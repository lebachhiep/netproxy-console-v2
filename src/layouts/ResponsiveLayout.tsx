import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { AdminLayout } from './AdminLayout';
import { MobileLayout } from './MobileLayout';
import { useResponsive } from '@/hooks/useResponsive';

export const ResponsiveLayout: React.FC = () => {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileLayout /> : <AdminLayout />;
};
