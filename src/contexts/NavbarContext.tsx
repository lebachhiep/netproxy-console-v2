import { createContext, useContext, useState, ReactNode } from 'react';

import { ReactNode as IconNode } from 'react';

export type NavbarItem = {
  label: string; // translation key
  icon?: IconNode;
};

type NavbarContextType = {
  navbarItems: NavbarItem[];
  setNavbarItems: (items: NavbarItem[]) => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);

  return <NavbarContext.Provider value={{ navbarItems, setNavbarItems }}>{children}</NavbarContext.Provider>;
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
