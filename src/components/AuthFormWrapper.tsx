import { useResponsive } from '@/hooks/useResponsive';
import clsx from 'clsx';
import React from 'react';

interface AuthFormWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, subtitle, children }) => {
  const { isMobile, isTablet } = useResponsive();
  return (
    <div className={clsx('w-full max-w-[400px] flex flex-col gap-10 md:gap-7', isTablet && 'max-w-[380px]')}>
      <div className="flex flex-col gap-1 items-center">
        <h3>{title}</h3>
        {subtitle && <p className="text-text-me dark:text-text-me-dark text-center text-sm">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
