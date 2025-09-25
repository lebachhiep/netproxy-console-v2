import { AppLoading } from 'components/app/AppLoading';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isInitialized } = useAuth();

  // Initialize auth listener on mount
  useEffect(() => {
    // Auth listener is initialized in the store automatically
  }, []);

  if (!isInitialized) {
    return <AppLoading />;
  }

  return <>{children}</>;
};
