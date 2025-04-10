export interface GameInfo {
  id: string;
  name: string;
  boxArtUrl: string;
}

export interface TwitchStream {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  game?: {
    name: string;
    description: string;
    image: string;
  } | null;
  streamerName: string;
  streamerId: string;
  streamerAvatar?: string;
}

export interface UserPreferences {
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  favorites: string[];
  notifications: boolean;
}

export interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}

export interface Schedule {
  streamerId: string;
  streams: TwitchStream[];
  lastUpdated: string;
  expiresAt: number;
}

export type StorageKey = 'auth' | 'preferences' | 'schedules';

export interface StorageSchema {
  auth: AuthState;
  preferences: UserPreferences;
  schedules: Record<string, Schedule>;
}
