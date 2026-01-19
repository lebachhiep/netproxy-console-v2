import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/auth/auth.service';
import { RegisterCredentials, AuthUser } from '@/services/auth/auth.types';
import { userService } from '@/services/user/user.service';
import { UserProfile } from '@/services/user/user.types';
import { hasTokens, getUserFromToken, clearTokens, isAccessTokenValid, isRefreshTokenValid } from '@/utils/token';

interface AuthState {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  profileLoading: boolean;

  // Actions
  login: (login: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string, captchaToken: string) => Promise<void>;
  confirmResetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setInitialized: (initialized: boolean) => void;
  initializeAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userProfile: null,
      loading: false,
      error: null,
      isInitialized: false,
      profileLoading: false,

      initializeAuth: async () => {
        set({ loading: true });
        try {
          // Check if tokens exist
          if (!hasTokens()) {
            set({ user: null, loading: false, isInitialized: true });
            return;
          }

          // Check if access token is valid
          if (isAccessTokenValid()) {
            // Access token is valid, get user from it
            const user = getUserFromToken();
            if (user) {
              set({ user, loading: false, isInitialized: true });
              // Fetch user profile
              await get().fetchUserProfile();
            } else {
              // Token decode failed, clear everything
              clearTokens();
              set({ user: null, loading: false, isInitialized: true });
            }
            return;
          }

          // Access token is expired, check if refresh token is valid
          if (isRefreshTokenValid()) {
            try {
              // Try to refresh the access token
              await authService.refreshAccessToken();

              // Get user from the new token
              const user = getUserFromToken();
              if (user) {
                set({ user, loading: false, isInitialized: true });
                // Fetch user profile
                await get().fetchUserProfile();
              } else {
                // Token decode failed after refresh, clear everything
                clearTokens();
                set({ user: null, loading: false, isInitialized: true });
              }
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              console.error('Token refresh failed during initialization:', refreshError);
              clearTokens();
              set({ user: null, loading: false, isInitialized: true });
              // Redirect to login if not already there
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
            }
          } else {
            // Both tokens are invalid/expired, clear everything and redirect to login
            console.warn('Both access and refresh tokens are invalid or expired');
            clearTokens();
            set({ user: null, loading: false, isInitialized: true });
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          clearTokens();
          set({ user: null, loading: false, isInitialized: true });
          // Redirect to login on any error if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      },

      login: async (login: string, password: string, rememberMe: boolean) => {
        set({ loading: true, error: null });
        try {
          await authService.login(login, password, rememberMe);

          // Get user from newly stored token
          const user = getUserFromToken();
          set({ user, loading: false });

          // Fetch user profile after successful login
          await get().fetchUserProfile();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ loading: true, error: null });
        try {
          await authService.register(credentials);

          // Get user from newly stored token
          const user = getUserFromToken();
          set({ user, loading: false });

          // Fetch user profile after successful registration
          await get().fetchUserProfile();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await authService.logout();
          set({ user: null, userProfile: null, loading: false, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng xuất thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      resetPassword: async (email: string, captchaToken: string) => {
        set({ loading: true, error: null });
        try {
          await authService.requestPasswordReset(email, captchaToken);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Gửi email đặt lại mật khẩu thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      confirmResetPassword: async (email: string, token: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
          await authService.resetPassword(email, token, newPassword);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Đặt lại mật khẩu thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ loading }),
      setUser: (user: AuthUser | null) => set({ user }),
      setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),

      fetchUserProfile: async () => {
        const currentUser = get().user;
        if (!currentUser) {
          console.warn('No authenticated user to fetch profile for');
          return;
        }

        set({ profileLoading: true });
        try {
          const profile = await userService.getProfile();
          set({ userProfile: profile, profileLoading: false });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          set({ profileLoading: false });
          // Don't throw error here, profile fetch failure shouldn't break auth flow
        }
      },

      setUserProfile: (profile: UserProfile | null) => {
        set({ userProfile: profile });
      },

      clearUserProfile: () => {
        set({ userProfile: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Don't persist user or tokens - they're stored separately
        // Only persist initialization state to avoid flash
        isInitialized: state.isInitialized
      })
    }
  )
);

// Initialize auth on app start
useAuthStore.getState().initializeAuth();
