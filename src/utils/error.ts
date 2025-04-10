import { AxiosError } from '../types/axios';

export class AppError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    retryable: boolean = false,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;
  }

  static fromAxiosError(error: unknown): AppError {
    const isAxiosError = (err: unknown): err is AxiosError => {
      return typeof err === 'object' && err !== null && 
        ('response' in err || 'request' in err || 'message' in err);
    };

    if (!isAxiosError(error)) {
      return new AppError('Unknown error occurred', 'UNKNOWN_ERROR', false);
    }

    if (error.response) {
      // Server responded with error status
      return new AppError(
        error.response.data?.message || error.message,
        error.response.data?.code || `HTTP_${error.response.status}`,
        error.response.status >= 500, // Server errors are retryable
        error.response.data
      );
    } 
    
    if (error.request) {
      // Request made but no response
      return new AppError(
        'Network error occurred',
        'NETWORK_ERROR',
        true // Network errors are retryable
      );
    } 
    
    // Request setup error
    return new AppError(
      error.message,
      'REQUEST_SETUP_ERROR',
      false
    );
  }

  static fromTwitchError(error: { status: number; headers?: Record<string, string>; message?: string }): AppError {
    if (error.status === 401) {
      return new AppError(
        'Authentication expired',
        'AUTH_EXPIRED',
        false
      );
    }

    if (error.status === 429) {
      return new AppError(
        'Rate limit exceeded',
        'RATE_LIMIT',
        true,
        { retryAfter: error.headers?.['Ratelimit-Reset'] }
      );
    }

    return new AppError(
      error.message || 'Twitch API error',
      'TWITCH_API_ERROR',
      error.status >= 500
    );
  }
}

export class StorageError extends AppError {
  constructor(message: string, operation: string, details?: unknown) {
    super(
      message,
      `STORAGE_${operation.toUpperCase()}_ERROR`,
      true, // Storage errors are usually retryable
      details
    );
    this.name = 'StorageError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unknown error occurred');
}

export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const appError = handleError(error);

      if (!appError.retryable || attempt === maxAttempts) {
        throw appError;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw handleError(lastError);
}

type ErrorHandler = (error: AppError) => void;

const errorHandlers: ErrorHandler[] = [];

export function registerErrorHandler(handler: ErrorHandler): () => void {
  errorHandlers.push(handler);
  return () => {
    const index = errorHandlers.indexOf(handler);
    if (index > -1) {
      errorHandlers.splice(index, 1);
    }
  };
}

export function notifyError(error: unknown): void {
  const appError = handleError(error);
  errorHandlers.forEach(handler => handler(appError));
}
