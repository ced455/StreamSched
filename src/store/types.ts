/**
 * Authentication state interface
 */
export interface AuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** The current access token, if authenticated */
  accessToken: string | null;
  /** Token expiration time in seconds */
  expiresIn?: string;
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  /** Current authentication state */
  auth: AuthState;
  /** Handle OAuth callback */
  handleAuthCallback: (hash: string) => Promise<void>;
  /** Initiate login flow */
  login: () => void;
  /** Logout current user */
  logout: () => void;
}
