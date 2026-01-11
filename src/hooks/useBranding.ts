import { useBrandingStore } from '@/stores/branding.store';
import { useThemeStore } from '@/stores/theme.store';

// Hook wrapper for branding store with theme-aware logo selection
export const useBranding = () => {
  const { businessName, getCurrentLogo, getCurrentIcon, shouldInvertLogo, shouldInvertIcon, isLoading, isInitialized, error } =
    useBrandingStore();

  // Subscribe to theme to trigger re-renders on theme change
  useThemeStore((state) => state.theme);

  const logoUrl = getCurrentLogo();
  const logoIconUrl = getCurrentIcon();

  return {
    businessName,
    logoUrl,
    logoIconUrl,
    shouldInvertLogo: shouldInvertLogo(),
    shouldInvertIcon: shouldInvertIcon(),
    isLoading,
    isInitialized,
    error,
    hasLogos: !!logoUrl && !!logoIconUrl
  };
};
