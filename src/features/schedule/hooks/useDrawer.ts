import { useContext } from 'react';
import { DrawerContext } from '../components/DrawerContext/DrawerContextInstance';

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
