import { useEffect, useRef, useCallback } from 'react';
import { useDrawer } from '../../hooks/useDrawer';
import { FilterBarProps } from '../../types/schedule';
import { FilterBar } from '../FilterBar';
import { useAuth } from '../../../../store';
import './Drawer.css';

export function Drawer(props: FilterBarProps) {
  const { isOpen, closeDrawer } = useDrawer();
  const { logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    closeDrawer();
    // Add a small delay to let the drawer close animation finish
    setTimeout(() => {
      logout();
    }, 300);
  }, [closeDrawer, logout]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeDrawer]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeDrawer();
    }
  };

  return (
    <div 
      className={`drawer-container ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div 
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="drawer-header">
          <h2>Filters</h2>
          <button className="close-button" onClick={closeDrawer} aria-label="Close filters">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="drawer-content">
          <FilterBar {...props} className="drawer-filter-bar" />
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
    </div>
  );
}
