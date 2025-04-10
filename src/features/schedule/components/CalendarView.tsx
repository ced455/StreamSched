import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { FilterBar } from './FilterBar';
import { FilterOptions, SortOptions } from '../types/schedule';
import { TwitchStream } from '../../../types/api';
import './CalendarView.css';

export function CalendarView() {
  const [filters, setFilters] = useState<FilterOptions>({ 
    searchTerm: '', 
    categories: [], 
    streamers: [],
    favorites: false
  });
  const [sort, setSort] = useState<SortOptions>({ 
    field: 'startTime', 
    direction: 'asc'
  });
  
  const { streams, allStreamers: availableStreamers, availableCategories, isLoading, error, refetch } = useSchedule(filters, sort);

  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekStreams = streams.filter(s => {
    const time = new Date(s.startTime);
    return time >= weekStart && time < weekEnd;
  });

  const groupedStreams = weekStreams.reduce((groups, stream: TwitchStream) => {
    const dateKey = new Date(stream.startTime).toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(stream);
    return groups;
  }, {} as Record<string, TwitchStream[]>);

  const sortedDates = Object.keys(groupedStreams).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  if (isLoading) {
    return (
      <div className="calendar-view">
        <div className="loading">Loading schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-view error">
        <div>Error loading schedules.</div>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <div className="layout-container">
        <aside className="sidebar">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            availableCategories={availableCategories}
            availableStreamers={availableStreamers}
          />
        </aside>
        <main className="calendar-content">
          <div className="week-navigation">
            <button onClick={prevWeek}>Previous Week</button>
            <span>
              {weekStart.toLocaleDateString('fr-FR')} - {weekEnd.toLocaleDateString('fr-FR')}
            </span>
            <button onClick={nextWeek}>Next Week</button>
          </div>
          <div className="day-cards">
            {sortedDates.map((date) => {
              const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              return (
                <div key={date} className="day-card">
                  <h3>{formattedDate}</h3>
                  <ul>
                    {groupedStreams[date].map((stream) => (
                      <li key={stream.id} className="stream-card">
                        <div className="stream-card-header">
                          <div className="streamer-info">
                            {stream.streamerAvatar ? (
                              <img 
                                className="streamer-avatar" 
                                src={stream.streamerAvatar} 
                                alt={`${stream.streamerName} avatar`} 
                              />
                            ) : (
                              <div className="avatar-placeholder" />
                            )}
                            <span className="streamer-name">{stream.streamerName}</span>
                          </div>
                          <span className="stream-time">
                            {new Date(stream.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {stream.game && (
                          <div className="stream-category">{stream.game.name}</div>
                        )}
                        <div className="stream-title">{stream.title}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
