import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { ErrorDisplay } from '../common/ErrorBoundary';
import { AppError } from '../../utils/error';

export function Auth() {
  const { auth, handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, redirige directement vers /schedule
    if (auth.isAuthenticated) {
      navigate('/schedule');
      return;
    }
    
    const hash = location.hash;
    if (!hash) {
      setError(new AppError('No authentication token found', 'AUTH_ERROR'));
      return;
    }
    
    const processAuth = async () => {
      try {
        await handleAuthCallback(hash);
        // Essayer de vider le hash pour éviter les appels répétés
        try {
          window.history.replaceState(null, '', '/auth');
        } catch (e) {
          console.error("Error clearing hash:", e);
        }
        navigate('/schedule');
      } catch (err) {
        if (err instanceof AppError) {
          setError(err);
        } else {
          const message = err instanceof Error ? err.message : String(err);
          setError(new AppError(`Authentication failed: ${message}`, 'AUTH_ERROR'));
        }
      }
    };

    processAuth();
  }, [auth.isAuthenticated, handleAuthCallback, navigate, location.hash]);

  if (error) {
    return (
      <div className="auth-error">
        <ErrorDisplay 
          error={error}
          onRetry={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div className="auth-loading">
      <h2>Authenticating...</h2>
      <LoadingSpinner size="large" className="auth-spinner" />
    </div>
  );
}
