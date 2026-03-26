import type { TelemetryApiResponse, TelemetryPoint } from '../types/telemetry';

const defaultBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smart-knee-api.onrender.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl;
export const TELEMETRY_PATH = import.meta.env.VITE_TELEMETRY_PATH ?? '/api/telemetry';
const REQUEST_TIMEOUT_MS = 10_000;

function toTelemetryPoint(raw: unknown): TelemetryPoint | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const timestamp = typeof record.timestamp === 'string' ? record.timestamp : null;
  const battery = typeof record.battery === 'number' ? record.battery : null;
  const meniscus = typeof record.meniscus === 'number' ? record.meniscus : null;
  const emg = typeof record.emg === 'number' ? record.emg : null;

  if (!timestamp || battery === null || meniscus === null || emg === null) {
    return null;
  }

  return { timestamp, battery, meniscus, emg };
}

function normalizePayload(payload: unknown): TelemetryPoint[] {
  const directList = Array.isArray(payload) ? payload : null;
  const wrappedList =
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as TelemetryApiResponse).data)
      ? (payload as TelemetryApiResponse).data
      : null;

  const source = directList ?? wrappedList ?? [];
  return source.map(toTelemetryPoint).filter((item): item is TelemetryPoint => item !== null);
}

export async function fetchTelemetry(signal?: AbortSignal): Promise<TelemetryPoint[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const mergedSignal = signal ?? controller.signal;
    const response = await fetch(`${API_BASE_URL}${TELEMETRY_PATH}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: mergedSignal,
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const payload: unknown = await response.json();
    const points = normalizePayload(payload);

    if (points.length === 0) {
      throw new Error('返回数据为空或字段不匹配');
    }

    return points;
  } finally {
    clearTimeout(timeout);
  }
}

export function startTelemetryPolling(
  onSuccess: (points: TelemetryPoint[]) => void,
  onError: (errorMessage: string) => void,
  intervalMs = 8000,
): () => void {
  let stopped = false;

  const run = async () => {
    try {
      const points = await fetchTelemetry();
      if (!stopped) {
        onSuccess(points);
      }
    } catch (error) {
      if (!stopped) {
        const message = error instanceof Error ? error.message : '网络异常，请稍后重试';
        onError(message);
      }
    }
  };

  void run();
  const timer = window.setInterval(() => {
    void run();
  }, intervalMs);

  return () => {
    stopped = true;
    window.clearInterval(timer);
  };
}
