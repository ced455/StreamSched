interface TwitchUserResponse {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  email?: string;
}

interface TwitchFollowResponse {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
}

interface TwitchPagination {
  cursor?: string;
}

interface TwitchScheduleSegment {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  category?: {
    name: string;
  };
}

interface TwitchScheduleResponse {
  data: {
    segments: TwitchScheduleSegment[];
    broadcaster_name: string;
  };
}

interface TwitchGameResponse {
  id: string;
  name: string;
  box_art_url: string;
}

export interface TwitchAPIResponse<T> {
  data: T[];
  pagination?: TwitchPagination;
}

export type {
  TwitchUserResponse,
  TwitchFollowResponse,
  TwitchScheduleResponse,
  TwitchScheduleSegment,
  TwitchGameResponse
};
