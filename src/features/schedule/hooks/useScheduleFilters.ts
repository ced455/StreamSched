import { useState, useCallback } from 'react';
import { FilterOptions, SortOptions, ViewMode } from '../types/schedule';

const DEFAULT_FILTERS: FilterOptions = {
  searchTerm: '',
  categories: [],
  streamers: [],
  favorites: false
};

const DEFAULT_SORT: SortOptions = {
  field: 'startTime',
  direction: 'asc'
};

export function useScheduleFilters(
  initialView: ViewMode = 'list',
  initialFilters: Partial<FilterOptions> = {},
  initialSort: SortOptions = DEFAULT_SORT
) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });
  const [sort, setSort] = useState<SortOptions>(initialSort);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((newSort: Partial<SortOptions>) => {
    setSort(prev => ({ ...prev, ...newSort }));
  }, []);

  const toggleView = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'calendar' : 'list');
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleFavorites = useCallback(() => {
    setFilters(prev => ({ ...prev, favorites: !prev.favorites }));
  }, []);

  const setDateRange = useCallback((startDate?: Date, endDate?: Date) => {
    setFilters(prev => ({ ...prev, startDate, endDate }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  return {
    viewMode,
    filters,
    sort,
    updateFilters,
    updateSort,
    toggleView,
    resetFilters,
    toggleFavorites,
    setDateRange,
    toggleCategory
  };
}
