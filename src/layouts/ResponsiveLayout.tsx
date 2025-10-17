import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { AdminLayout } from './AdminLayout';
import { MobileLayout } from './MobileLayout';
import { TabletLayout } from './TabletLayout';

export const ResponsiveLayout: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  return isMobile ? <MobileLayout /> : isTablet ? <TabletLayout /> : <AdminLayout />;
};
