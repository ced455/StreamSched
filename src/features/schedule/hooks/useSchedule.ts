import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../store/AuthContext';
import { useMemo } from 'react';
import { twitch } from '../../../services/twitch';
import { Schedule, TwitchStream } from '../../../types/api';
import { FilterOptions, SortOptions, StreamsByDay } from '../types/schedule';
import { format } from 'date-fns';
import { isPast } from '../../../utils/date';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useSchedule(filters: FilterOptions, sort: SortOptions) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      if (!auth.accessToken) throw new Error('Not authenticated');
      return twitch.getAllSchedules(auth.accessToken);
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!auth.accessToken
  });

  // Extract all streams from schedules
  const streams = schedules.flatMap((schedule: Schedule) => 
    schedule.streams.map((stream: TwitchStream) => ({
      ...stream,
      streamerId: schedule.streamerId
    }))
  );

  // Apply filters
  const filteredStreams = streams.filter(stream => {
    // Filter by streamers
    if (filters.streamers.length > 0 && !filters.streamers.includes(stream.streamerName)) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm && !stream.streamerName.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by categories
    if (filters.categories.length > 0 && !filters.categories.includes(stream.game?.name || '')) {
      return false;
    }

    // Filter by date range
    if (filters.startDate && new Date(stream.startTime) < filters.startDate) {
      return false;
    }
    if (filters.endDate && new Date(stream.startTime) > filters.endDate) {
      return false;
    }

    // Filter past streams
    if (isPast(stream.endTime || stream.startTime)) {
      return false;
    }

    return true;
  });

  // Sort streams
  const sortedStreams = [...filteredStreams].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    
    switch (sort.field) {
      case 'startTime':
        return (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) * direction;
      case 'streamerName':
        return a.streamerName.localeCompare(b.streamerName) * direction;
      case 'category':
        return ((a.game?.name || '').localeCompare(b.game?.name || '')) * direction;
      default:
        return 0;
    }
  });

  // Group streams by day
  const streamsByDay = sortedStreams.reduce<StreamsByDay>((acc, stream) => {
    const day = format(new Date(stream.startTime), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(stream);
    return acc;
  }, {});

  // Extract all unique streamers before filtering and sort alphabetically
  const allStreamers = useMemo(() => 
    Array.from(new Set(streams.map(s => s.streamerName)))
      .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
      .map(name => {
        const streamWithAvatar = streams.find(s => s.streamerName === name && s.streamerAvatar);
        return { 
          name, 
          avatar: streamWithAvatar ? streamWithAvatar.streamerAvatar : undefined 
        };
      }),
    [streams]
  );

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', streams],
    queryFn: async () => {
      const gameNames = new Set(streams.map(s => s.game?.name).filter((name): name is string => !!name));
      const uniqueCategories = Array.from(gameNames);

      if (!auth.accessToken || uniqueCategories.length === 0) return [];

      const gameInfo = await twitch.getGames(auth.accessToken, uniqueCategories);
      
      return gameInfo.map(game => ({
        name: game.name,
        image: game.boxArtUrl
      }));
    },
    enabled: !!auth.accessToken && streams.length > 0
  });

  return {
    streams: sortedStreams,
    streamsByDay,
    allStreamers,
    availableCategories: categories,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['schedules'] })
  };
}
