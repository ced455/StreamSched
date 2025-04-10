import { TwitchStream } from '../../../types/api';

export type ViewMode = 'calendar' | 'list';

export interface FilterOptions {
  searchTerm: string;
  categories: string[];
  streamers: string[];
  startDate?: Date;
  endDate?: Date;
  favorites: boolean;
}

export interface SortOptions {
  field: 'startTime' | 'streamerName' | 'category';
  direction: 'asc' | 'desc';
}

export interface StreamGroup {
  date: string;
  streams: TwitchStream[];
}

export interface ScheduleViewProps {
  initialView?: ViewMode;
  initialFilters?: Partial<FilterOptions>;
  initialSort?: SortOptions;
  className?: string;
}

export interface StreamCardProps {
  stream: TwitchStream;
  isLive?: boolean;
  onClick?: (stream: TwitchStream) => void;
  className?: string;
}

export interface StreamerOption {
  name: string;
  avatar?: string;
}

export interface CategoryOption {
  name: string;
  image: string;
}

export interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sort: SortOptions;
  onSortChange: (sort: SortOptions) => void;
  availableCategories: CategoryOption[];
  availableStreamers: StreamerOption[];
  className?: string;
}

export interface ScheduleCalendarProps {
  streams: TwitchStream[];
  onStreamClick?: (stream: TwitchStream) => void;
  className?: string;
}

export interface ScheduleListProps {
  streams: TwitchStream[];
  sort: SortOptions;
  onStreamClick?: (stream: TwitchStream) => void;
  className?: string;
}

export interface StreamsByDay {
  [date: string]: TwitchStream[];
}
