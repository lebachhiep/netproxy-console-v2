import { useAuthStore } from '@/stores/auth.store';

// Hook wrapper for auth store
export const useAuth = () => {
  const {
    user,
    loading,
    error,
    isInitialized,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    clearError
  } = useAuthStore();

  return {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    clearError
  };
};