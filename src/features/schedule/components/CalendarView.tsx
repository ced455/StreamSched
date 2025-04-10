import { useState, useEffect } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { FilterBar } from './FilterBar';
import { Drawer } from './Drawer/Drawer';
import { MobileHeader } from './MobileHeader/MobileHeader';
import { DrawerProvider } from './DrawerContext/DrawerContext';
import { FilterOptions, SortOptions } from '../types/schedule';
import { TwitchStream } from '../../../types/api';
import './CalendarView.css';

export function CalendarView() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());
  
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
    const timeKey = new Date(stream.startTime).toISOString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = {};
    }
    if (!groups[dateKey][timeKey]) {
      groups[dateKey][timeKey] = [];
    }
    groups[dateKey][timeKey].push(stream);
    return groups;
  }, {} as Record<string, Record<string, TwitchStream[]>>);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleDayCollapse = (date: string) => {
    const newCollapsed = new Set(collapsedDays);
    if (collapsedDays.has(date)) {
      newCollapsed.delete(date);
    } else {
      newCollapsed.add(date);
    }
    setCollapsedDays(newCollapsed);
  };

  // Get unique streamers for a given day
  const getDayStreamers = (date: string) => {
    const uniqueStreamers = new Set<string>();
    const avatars = new Map<string, string>();
    
    Object.values(groupedStreams[date]).forEach(streams => {
      streams.forEach(stream => {
        if (stream.streamerName && !uniqueStreamers.has(stream.streamerName)) {
          uniqueStreamers.add(stream.streamerName);
          if (stream.streamerAvatar) {
            avatars.set(stream.streamerName, stream.streamerAvatar);
          }
        }
      });
    });

    return Array.from(uniqueStreamers).map(name => ({
      name,
      avatar: avatars.get(name)
    }));
  };

  const ChevronIcon = ({ className = '' }: { className?: string }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <DrawerProvider>
      <div className="calendar-view">
        <div className="layout-container">
          {/* Desktop Sidebar */}
          {!isMobile && (
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
          )}

          {/* Mobile Header */}
          {isMobile && (
            <MobileHeader
              weekStart={weekStart}
              weekEnd={weekEnd}
              onPrevWeek={prevWeek}
              onNextWeek={nextWeek}
            />
          )}

          {/* Mobile Drawer */}
          {isMobile && (
            <Drawer
              filters={filters}
              onFilterChange={setFilters}
              sort={sort}
              onSortChange={setSort}
              availableCategories={availableCategories}
              availableStreamers={availableStreamers}
            />
          )}

          <main className="calendar-content">
            {/* Desktop Week Navigation */}
            {!isMobile && (
              <div className="week-navigation">
                <button onClick={prevWeek}>Previous Week</button>
                <span>
                  {weekStart.toLocaleDateString('fr-FR')} - {weekEnd.toLocaleDateString('fr-FR')}
                </span>
                <button onClick={nextWeek}>Next Week</button>
              </div>
            )}
            <div className="day-cards">
              {sortedDates.map((date) => {
                const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
              return (
                <div key={date} className={`day-card ${collapsedDays.has(date) ? 'collapsed' : ''}`}>
                  <div className="day-card-header">
                    <h3>{formattedDate}</h3>
                    <button 
                      className={`collapse-button ${collapsedDays.has(date) ? 'collapsed' : ''}`}
                      onClick={() => toggleDayCollapse(date)}
                    >
                      {collapsedDays.has(date) ? 'Expand' : 'Collapse'}
                      <ChevronIcon />
                    </button>
                  </div>
                  {collapsedDays.has(date) ? (
                    <div className="avatar-list">
                      {getDayStreamers(date).map(streamer => (
                        streamer.avatar && (
                          <img
                            key={streamer.name}
                            className="streamer-avatar"
                            src={streamer.avatar}
                            alt={`${streamer.name} avatar`}
                            title={streamer.name}
                          />
                        )
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="expanded-content">
                        {Object.entries(groupedStreams[date])
                        .sort(([timeA], [timeB]) => new Date(timeA).getTime() - new Date(timeB).getTime())
                        .map(([timeKey, streams]) => {
                          const formattedTime = new Date(timeKey).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div key={timeKey} className="time-group">
                              <div className="time-heading">{formattedTime}</div>
                              <ul>
                                {streams.map((stream) => (
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
                                        <a 
                                          href={`https://twitch.tv/${stream.streamerName}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="streamer-name"
                                        >
                                          {stream.streamerName}
                                        </a>
                                      </div>
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
              </main>
            </div>
          </div>
        </DrawerProvider>
      );
}
