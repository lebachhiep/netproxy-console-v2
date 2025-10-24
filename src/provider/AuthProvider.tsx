import { AppLoading } from 'components/app/AppLoading';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isInitialized } = useAuth();

  // Auth is initialized automatically in the auth store on app start
  if (!isInitialized) {
    return <AppLoading />;
  }

  return <>{children}</>;
};
