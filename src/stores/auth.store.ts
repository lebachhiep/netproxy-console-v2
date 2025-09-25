import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService } from '@/services/auth/auth.service';
import { RegisterCredentials } from '@/services/auth/auth.types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      isInitialized: false,

      login: async (email: string, password: string, rememberMe: boolean) => {
        set({ loading: true, error: null });
        try {
          const { user } = await authService.signInWithEmail(email, password, rememberMe);
          set({ user, loading: false });
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
          set({ user: null, loading: false, error: null });
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
      setInitialized: (initialized: boolean) => set({ isInitialized: initialized })
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

  unsubscribe = onAuthStateChanged(auth, (user) => {
    useAuthStore.setState({
      user,
      loading: false,
      isInitialized: true
    });
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