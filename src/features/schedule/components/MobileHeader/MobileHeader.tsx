import { useDrawer } from '../../hooks/useDrawer';
import './MobileHeader.css';

interface MobileHeaderProps {
  weekStart: Date;
  weekEnd: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function MobileHeader({ weekStart, weekEnd, onPrevWeek, onNextWeek }: MobileHeaderProps) {
  const { toggleDrawer } = useDrawer();

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        <button className="filter-toggle" onClick={toggleDrawer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="sr-only">Toggle Filters</span>
        </button>
        
        <div className="week-navigation">
          <button className="nav-button prev" onClick={onPrevWeek}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Previous Week</span>
          </button>
          
          <span className="week-range">
            {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </span>
          
          <button className="nav-button next" onClick={onNextWeek}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Next Week</span>
          </button>
        </div>
      </div>
    </header>
  );
}
