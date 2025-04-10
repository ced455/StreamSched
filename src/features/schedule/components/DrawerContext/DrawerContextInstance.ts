import { createContext } from 'react';

export interface DrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);
