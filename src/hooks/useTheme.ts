import { useThemeStore } from '@/stores/theme.store';

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    setTheme,
    toggleTheme
  };
};
