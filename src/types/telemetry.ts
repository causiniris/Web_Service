export interface TelemetryPoint {
  timestamp: string;
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
  message?: string;
}
