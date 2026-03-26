export interface TelemetryPoint {
  timestamp: string;
  battery: number;
  meniscus: number;
  emg: number;
}

export interface TelemetryApiResponse {
  data: TelemetryPoint[];
  message?: string;
}
