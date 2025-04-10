import { useState, useMemo, useCallback } from 'react';
import { FilterBarProps } from '../types/schedule';
import { useAuth } from '../../../store';
import './FilterBar.css';

export function FilterBar({
  filters,
  onFilterChange,
  availableCategories,
  availableStreamers,
  className = ''
}: FilterBarProps) {
  // New state for active tab and sidebar search query
  const [activeTab, setActiveTab] = useState<'streamers' | 'categories'>('streamers');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Filter the list based on sidebar search input
  const filteredStreamers = useMemo(() => {
    return availableStreamers.filter(streamer =>
      streamer.name.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
  }, [availableStreamers, sidebarSearch]);

  const filteredCategories = useMemo(() => {
    return availableCategories.filter(category =>
      category.name.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
  }, [availableCategories, sidebarSearch]);

  // Handler for selecting a streamer (toggle selection)
  const handleStreamerSelect = (streamer: string) => {
    const isSelected = filters.streamers.includes(streamer);
    let newStreamers;
    if (isSelected) {
      newStreamers = filters.streamers.filter(s => s !== streamer);
    } else {
      newStreamers = [...filters.streamers, streamer];
    }
    onFilterChange({ ...filters, streamers: newStreamers });
  };

  // Handler for selecting a category (toggle selection)
  const handleCategorySelect = (categoryName: string) => {
    const isSelected = filters.categories.includes(categoryName);
    let newCategories;
    if (isSelected) {
      newCategories = filters.categories.filter(c => c !== categoryName);
    } else {
      newCategories = [...filters.categories, categoryName];
    }
    onFilterChange({ ...filters, categories: newCategories });
  };

  return (
    <div className={`filter-sidebar ${className}`}>
      <div className="sidebar-content">
        <h2 className="filter-title">Filters</h2>
        <div className="search-container">
        <input 
          type="text"
          placeholder="Search..."
          value={sidebarSearch}
          onChange={(e) => setSidebarSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'streamers' ? 'active' : ''}`}
          onClick={() => setActiveTab('streamers')}
        >
          Streamers
        </button>
        <button 
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>
      <div className="filter-content">
        {activeTab === 'streamers' ? (
          <div className="streamers-list">
            {filteredStreamers.map(({ name, avatar }) => (
              <div 
                key={name} 
                className={`filter-item ${filters.streamers.includes(name) ? 'selected' : ''}`}
                onClick={() => handleStreamerSelect(name)}
              >
                {avatar ? (
                  <img className="streamer-avatar" src={avatar} alt={`${name} avatar`} />
                ) : (
                  <div className="avatar-placeholder" />
                )}
                <span className="item-name">{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="categories-list">
            {filteredCategories.map(category => (
              <div 
                key={category.name} 
                className={`filter-item ${filters.categories.includes(category.name) ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.image ? (
                  <img className="category-image" src={category.image} alt={`${category.name} icon`} />
                ) : (
                  <div className="category-placeholder" />
                )}
                <span className="item-name">{category.name}</span>
              </div>
            ))}
          </div>
        )}
        </div>
        <div className="user-menu">
          <button 
            onClick={handleLogout}
            className="logout-button"
            aria-label="Logout"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M17 7l-5 5m0 0l-5-5m5 5V3m7 13v.01M7 16v.01M12 21a9 9 0 110-18 9 9 0 010 18z" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
