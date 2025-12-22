import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLoading } from '@/components/app/AppLoading';
import { AUTH_ROUTES } from '@/utils/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavbarProvider } from '@/contexts/NavbarContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = false,
  redirectTo = AUTH_ROUTES.LOGIN
}) => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (!isInitialized) {
    return <AppLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && user && !user.emailVerified) {
    return <Navigate to={AUTH_ROUTES.VERIFY_EMAIL} state={{ from: location.pathname }} replace />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavbarProvider>{children}</NavbarProvider>
    </QueryClientProvider>
  );
};
