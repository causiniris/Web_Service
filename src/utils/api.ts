import type { TelemetryApiResponse, TelemetryPoint } from '../types/telemetry';

// <-- 修复2：强制指向 Render 服务器，拒绝本地自娱自乐
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-knee-platform.onrender.com';
export const TELEMETRY_PATH = import.meta.env.VITE_TELEMETRY_PATH ?? '/api/telemetry';
const REQUEST_TIMEOUT_MS = 10_000;

function toValidNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function toTelemetryPoint(raw: unknown): TelemetryPoint | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const timestamp = typeof record.timestamp === 'string' ? record.timestamp : null;
  
  // <-- 修复3：前端也必须认识设备的 ID
  const device_id = typeof record.device_id === 'string' ? record.device_id : 'UNKNOWN';
  const mode = typeof record.mode === 'string' ? record.mode : 'UNKNOWN';

  const battery = toValidNumber(record.battery);
  const meniscus = toValidNumber(record.meniscus);
  const emg = toValidNumber(record.emg);
  const lactate = toValidNumber(record.lactate);
  const temp = toValidNumber(record.temp);
  const att = toValidNumber(record.att);
  const vgrf = toValidNumber(record.vgrf);
  const vag = toValidNumber(record.vag);

  if (
    !timestamp || battery === null || meniscus === null || emg === null ||
    lactate === null || temp === null || att === null || vgrf === null || vag === null
  ) {
    return null;
  }

  return {
    timestamp,
    device_id, // 完整回传
    mode,      // 完整回传
    battery, meniscus, emg, lactate, temp, att, vgrf, vag,
  };
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

    return points;
  } finally {
    clearTimeout(timeout);
  }
}

export function startTelemetryPolling(
  onSuccess: (points: TelemetryPoint[]) => void,
  onError: (errorMessage: string) => void,
  intervalMs = 5000,
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