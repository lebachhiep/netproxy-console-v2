import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isInitialized: boolean;

  initializeTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: 'light',
  isInitialized: false,

  initializeTheme: () => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const theme = saved === 'dark' ? 'dark' : 'light';

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    set({ theme, isInitialized: true });
  },

  setTheme: (theme: Theme) => {
    const root = document.documentElement;
    root.classList.add('disable-transitions');

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);

    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  }
}));

// Auto-initialize
useThemeStore.getState().initializeTheme();
