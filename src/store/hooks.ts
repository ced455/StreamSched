import { useContext } from 'react';
import { AuthContext } from './context';

interface AuthContextType {
  auth: {
    isAuthenticated: boolean;
    accessToken: string | null;
    expiresIn?: string;
  };
  handleAuthCallback: (hash: string) => Promise<void>;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
