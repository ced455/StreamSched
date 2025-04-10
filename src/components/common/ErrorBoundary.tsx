import { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, handleError } from '../../utils/error';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: AppError) => ReactNode);
  onError?: (error: AppError) => void;
}

interface State {
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromError(error: unknown): State {
    return { error: handleError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = handleError(error);
    console.error('React Error Boundary caught an error:', appError, errorInfo);
    this.props.onError?.(appError);
  }

  render() {
    if (this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          {this.state.error.retryable && (
            <button onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  return (
    <div role="alert" className={`error-display ${className}`}>
      <h2>{error.code}</h2>
      <p>{error.message}</p>
      {error.retryable && onRetry && (
        <button onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}
