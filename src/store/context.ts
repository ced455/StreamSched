import { createContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | null>(null);

// Default provider value
export const defaultAuthContext: AuthContextType = {
  auth: { isAuthenticated: false, accessToken: null },
  handleAuthCallback: async () => {},
  login: () => {},
  logout: () => {}
};
