import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService } from '@/services/auth/auth.service';
import { RegisterCredentials } from '@/services/auth/auth.types';
import { userService } from '@/services/user/user.service';
import { UserProfile } from '@/services/user/user.types';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  profileLoading: boolean;

  // Actions
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
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

      login: async (email: string, password: string, rememberMe: boolean) => {
        set({ loading: true, error: null });
        try {
          const { user } = await authService.signInWithEmail(email, password, rememberMe);
          set({ user, loading: false });

          // Fetch user profile after successful login
          await get().fetchUserProfile();
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng nhập thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const { user } = await authService.signInWithGoogle();
          set({ user, loading: false });

          // Fetch user profile after successful Google login
          await get().fetchUserProfile();
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng nhập với Google thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ loading: true, error: null });
        try {
          const { user } = await authService.createAccount(credentials);
          set({ user, loading: false });

          // Fetch user profile after successful registration
          await get().fetchUserProfile();
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng ký thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await authService.signOut();
          set({ user: null, userProfile: null, loading: false, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng xuất thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null });
        try {
          await authService.sendPasswordReset(email);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Gửi email đặt lại mật khẩu thất bại';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ loading }),
      setUser: (user: User | null) => set({ user }),
      setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),

      getIdToken: async (forceRefresh = false) => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idToken = await currentUser.getIdToken(forceRefresh);
            return idToken;
          }
          return null;
        } catch (error) {
          console.error('Failed to get ID token:', error);
          return null;
        }
      },

      fetchUserProfile: async () => {
        const currentUser = auth.currentUser;
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
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Listen to auth state changes
let unsubscribe: (() => void) | null = null;

export const initializeAuthListener = () => {
  if (unsubscribe) return;

  unsubscribe = onAuthStateChanged(auth, async (user) => {
    useAuthStore.setState({
      user,
      loading: false,
      isInitialized: true
    });

    // If user is logged in, fetch their profile
    if (user) {
      await useAuthStore.getState().fetchUserProfile();
    } else {
      // Clear profile when user logs out
      useAuthStore.getState().clearUserProfile();
    }
  });
};

// Clean up listener
export const cleanupAuthListener = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};

// Initialize listener immediately
initializeAuthListener();