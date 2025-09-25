import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AUTH_ROUTES } from '@/utils/constants';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

export const useAuthGuard = ({
  requireAuth = true,
  redirectTo = AUTH_ROUTES.LOGIN,
  requireEmailVerification = false
}: UseAuthGuardOptions = {}) => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) return;

    if (requireAuth && !isAuthenticated) {
      // Save the attempted location for redirect after login
      navigate(redirectTo, {
        state: { from: location.pathname },
        replace: true
      });
    }

    if (requireEmailVerification && user && !user.emailVerified) {
      navigate(AUTH_ROUTES.VERIFY_EMAIL, { replace: true });
    }
  }, [
    isAuthenticated,
    isInitialized,
    requireAuth,
    requireEmailVerification,
    user,
    navigate,
    redirectTo,
    location
  ]);

  return {
    isAuthenticated,
    isInitialized,
    user
  };
};