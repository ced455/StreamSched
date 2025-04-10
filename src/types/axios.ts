export interface AxiosErrorResponse {
  data?: {
    message?: string;
    code?: string;
  };
  status: number;
  headers?: Record<string, string>;
}

export interface AxiosError {
  response?: AxiosErrorResponse;
  request?: unknown;
  message: string;
  status?: number;
  headers?: Record<string, string>;
}
