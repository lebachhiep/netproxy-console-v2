import { useAuthStore } from '@/stores/auth.store';
import { userService } from '@/services/user/user.service';

// Hook wrapper for auth store
export const useAuth = () => {
  const {
    user,
    userProfile,
    loading,
    error,
    isInitialized,
    profileLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    clearError,
    fetchUserProfile,
    setUserProfile,
    clearUserProfile,
    getIdToken
  } = useAuthStore();

  return {
    user,
    userProfile,
    loading,
    error,
    isInitialized,
    profileLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    clearError,
    fetchUserProfile,
    setUserProfile,
    clearUserProfile,
    getIdToken,
    // Helper methods from userService
    getDisplayName: () => userProfile ? userService.getDisplayName(userProfile) : null,
    getUserInitials: () => userProfile ? userService.getUserInitials(userProfile) : null,
    formatBalance: () => userProfile ? userService.formatBalance(userProfile.balance) : null,
    isProfileComplete: () => userProfile ? userService.isProfileComplete(userProfile) : false,
    isAdmin: () => userProfile ? userService.isAdmin(userProfile) : false,
    isModerator: () => userProfile ? userService.isModerator(userProfile) : false
  };
};