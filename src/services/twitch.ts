import axios from 'axios';
import { TwitchStream, Schedule, GameInfo } from '../types/api';
import { AppError } from '../utils/error';
import { storage } from './storage';

const TWITCH_API_URL = 'https://api.twitch.tv/helix';
const AUTH_URL = 'https://id.twitch.tv/oauth2';

class TwitchService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI;
  }

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Client-Id': this.clientId
    };
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'token',
      scope: 'user:read:email user:read:follows'
    });
    return `${AUTH_URL}/authorize?${params}`;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.get(`${AUTH_URL}/validate`, {
        headers: { 'Authorization': `OAuth ${token}` }
      });
      return true;
    } catch (error: any) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async getUser(token: string) {
    try {
      const response = await axios.get(`${TWITCH_API_URL}/users`, {
        headers: this.getAuthHeaders(token)
      });
      if (!response.data.data || response.data.data.length === 0) {
        throw new Error('User not found');
      }
      return response.data.data[0];
    } catch (error: any) {
      console.error('Failed to get user:', error);
      throw AppError.fromAxiosError(error);
    }
  }
  
  async getUserById(token: string, id: string) {
    try {
      const response = await axios.get(`${TWITCH_API_URL}/users`, {
        headers: this.getAuthHeaders(token),
        params: { id }
      });
      if (!response.data.data || response.data.data.length === 0) {
        throw new Error('User not found');
      }
      return response.data.data[0];
    } catch (error: any) {
      console.error('Failed to get user by id:', error);
      throw AppError.fromAxiosError(error);
    }
  }
  
  async getFollowedChannels(token: string): Promise<string[]> {
    try {
      const user = await this.getUser(token);
      let broadcasterIds: string[] = [];
      let after: string | undefined = undefined;
      do {
        const params: any = { user_id: user.id, first: 100 };
        if (after) {
          params.after = after;
        }
        const response = await axios.get(`${TWITCH_API_URL}/channels/followed`, {
          headers: this.getAuthHeaders(token),
          params: params
        });
        if (response.data.data) {
          broadcasterIds.push(...response.data.data.map((follow: any) => follow.broadcaster_id));
        }
        after = response.data.pagination && response.data.pagination.cursor;
      } while (after);
      return broadcasterIds;
    } catch (error: any) {
      console.error('Failed to get followed channels:', error);
      throw AppError.fromAxiosError(error);
    }
  }

  async getSchedule(token: string, streamerId: string): Promise<Schedule> {
    try {
      // Check cache first
      let schedule: Schedule;
      const cached = await storage.getSchedule(streamerId);
      if (cached && cached.expiresAt > Date.now()) {
        schedule = cached;
      } else {
        // Fetch from API
        const response = await axios.get(`${TWITCH_API_URL}/schedule`, {
          headers: this.getAuthHeaders(token),
          params: { broadcaster_id: streamerId }
        });
  
        if (!response.data.data || !response.data.data.segments) {
          schedule = {
            streamerId,
            streams: [],
            lastUpdated: new Date().toISOString(),
            expiresAt: Date.now() + 3600000
          };
        } else {
          const streams: TwitchStream[] = response.data.data.segments.map((segment: any) => ({
            id: segment.id,
            title: segment.title,
            startTime: segment.start_time,
            endTime: segment.end_time,
            game: segment.category ? {
              name: segment.category.name,
            } : null,
            streamerId,
            streamerName: response.data.data.broadcaster_name
          }));
          schedule = {
            streamerId,
            streams,
            lastUpdated: new Date().toISOString(),
            expiresAt: Date.now() + 3600000 // Cache for 1 hour
          };
        }
        // Update cache with the newly fetched schedule (without avatar yet)
        await storage.setSchedule(streamerId, schedule);
      }
  
      // Always fetch fresh user info to update the avatar
      const userInfo = await this.getUserById(token, streamerId);
      schedule.streams.forEach((stream) => {
        stream.streamerAvatar = userInfo.profile_image_url;
      });
  
      // Update cache with the new avatar info
      await storage.setSchedule(streamerId, schedule);
  
      return schedule;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return {
          streamerId,
          streams: [],
          lastUpdated: new Date().toISOString(),
          expiresAt: Date.now() + 3600000
        };
      }
      console.error('Failed to get schedule:', error);
      throw AppError.fromAxiosError(error);
    }
  }

  async getAllSchedules(token: string): Promise<Schedule[]> {
    try {
      const streamerIds = await this.getFollowedChannels(token);
      const schedules = await Promise.all(
        streamerIds.map(id => this.getSchedule(token, id))
      );
      return schedules;
    } catch (error: any) {
      console.error('Failed to get all schedules:', error);
      throw AppError.fromAxiosError(error);
    }
  }

  async getGames(token: string, names: string[]): Promise<GameInfo[]> {
    try {
      if (names.length === 0) return [];
      
      const response = await axios.get(`${TWITCH_API_URL}/games`, {
        headers: this.getAuthHeaders(token),
        params: { name: names }
      });

      if (!response.data.data) {
        return [];
      }

      return response.data.data.map((game: any) => ({
        id: game.id,
        name: game.name,
        boxArtUrl: game.box_art_url.replace('{width}', '40').replace('{height}', '40')
      }));
    } catch (error: any) {
      console.error('Failed to get games:', error);
      throw AppError.fromAxiosError(error);
    }
  }
}

export const twitch = new TwitchService();
