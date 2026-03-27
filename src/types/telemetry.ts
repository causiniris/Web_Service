export interface TelemetryPoint {
  timestamp: string;
  device_id: string; // <-- 新增：设备ID
  mode: string;      // <-- 新增：运行模式
  battery: number;
  meniscus: number;
  emg: number;
  lactate: number;
  temp: number;
  att: number;
  vgrf: number;
  vag: number;
}

export interface TelemetryApiResponse {
  data: TelemetryPoint[];
  count?: number;
  timestamp?: number;
}