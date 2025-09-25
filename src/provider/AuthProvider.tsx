import { AppLoading } from 'components/app/AppLoading';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return <AppLoading />;
  }

  return <>{children}</>;
};
