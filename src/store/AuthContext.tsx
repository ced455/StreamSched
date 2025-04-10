import React, { useState, useEffect } from 'react';
import { AppError } from '../utils/error';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AuthContext } from './context';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresIn?: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, accessToken: null });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage and validate token
  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        try {
          // Validate the stored token
          const response = await fetch('https://id.twitch.tv/oauth2/validate', {
            headers: { 'Authorization': `OAuth ${parsed.accessToken}` }
          });
          
          if (response.ok) {
            setAuth({
              isAuthenticated: true,
              accessToken: parsed.accessToken,
              expiresIn: parsed.expiresIn
            });
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('auth');
          }
        } catch (error) {
          console.error('Failed to validate token:', error);
          localStorage.removeItem('auth');
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const handleAuthCallback = async (hash: string) => {
    console.log("Auth callback initiated with hash:", hash);
    try {
      // Remove the leading '#' and parse the parameters
      const params = new URLSearchParams(hash.slice(1));
      const parsedParams = Object.fromEntries(params.entries());
      console.log("Parsed parameters:", parsedParams);
      const token = params.get('access_token');
      // Use a default value for expires_in if missing
      const expiresIn = params.get('expires_in') || '3600';
      if (!token) {
        console.error("Missing token", { token, parsedParams });
        throw new AppError("Token not found", "AUTH_ERROR");
      }
      // Successfully extracted token and expiration info (fallback to default if expires_in is absent)
      setAuth({ isAuthenticated: true, accessToken: token, expiresIn });
      console.log("Authentication successful", { token, expiresIn });
    } catch (error) {
      console.error("Error in handleAuthCallback:", error);
      throw error;
    }
  };

  const login = () => {
    // Build the Twitch OAuth URL using environment variables
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI;
    const scope = "user:read:email user:read:follows";
    const responseType = "token";
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, accessToken: null });
    localStorage.removeItem('auth');
  };

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  const value = {
    auth,
    handleAuthCallback,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
