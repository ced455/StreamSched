import { createContext } from 'react';
import { AuthState } from './AuthContext';

export interface AuthContextType {
  auth: AuthState;
  handleAuthCallback: (hash: string) => Promise<void>;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Default provider value
export const defaultAuthContext: AuthContextType = {
  auth: { isAuthenticated: false, accessToken: null },
  handleAuthCallback: async () => {},
  login: () => {},
  logout: () => {}
};
