import { create } from 'zustand';
import { brandingService } from '@/services/branding';
import { useThemeStore } from './theme.store';

interface BrandingState {
  businessName: string;
  logoLight: string;
  logoDark: string;
  iconLight: string;
  iconDark: string;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Computed getters (theme-aware)
  getCurrentLogo: () => string;
  getCurrentIcon: () => string;
  shouldInvertLogo: () => boolean;
  shouldInvertIcon: () => boolean;

  // Actions
  initializeBranding: () => Promise<void>;
}

export const useBrandingStore = create<BrandingState>()((set, get) => ({
  businessName: '',
  logoLight: '',
  logoDark: '',
  iconLight: '',
  iconDark: '',
  isLoading: false,
  isInitialized: false,
  error: null,

  getCurrentLogo: () => {
    const { logoLight, logoDark } = get();
    const theme = useThemeStore.getState().theme;

    if (theme === 'dark') {
      return logoDark || logoLight;
    }
    return logoLight;
  },

  getCurrentIcon: () => {
    const { iconLight, iconDark } = get();
    const theme = useThemeStore.getState().theme;

    if (theme === 'dark') {
      return iconDark || iconLight;
    }
    return iconLight;
  },

  shouldInvertLogo: () => {
    const { logoLight, logoDark } = get();
    const theme = useThemeStore.getState().theme;

    // Invert if: dark theme AND no dark logo available (using light as fallback)
    return theme === 'dark' && !logoDark && !!logoLight;
  },

  shouldInvertIcon: () => {
    const { iconLight, iconDark } = get();
    const theme = useThemeStore.getState().theme;

    return theme === 'dark' && !iconDark && !!iconLight;
  },

  initializeBranding: async () => {
    // Prevent multiple initializations
    if (get().isInitialized || get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const domain = window.location.hostname;
      const branding = await brandingService.getBranding(domain);

      set({
        businessName: branding.business_name || domain,
        logoLight: branding.logos?.logo_light?.original || '',
        logoDark: branding.logos?.logo_dark?.original || '',
        iconLight: branding.logos?.icon_light?.original || '',
        iconDark: branding.logos?.icon_dark?.original || '',
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Failed to fetch branding:', error);
      const domain = window.location.hostname;

      set({
        businessName: domain,
        logoLight: '',
        logoDark: '',
        iconLight: '',
        iconDark: '',
        isLoading: false,
        isInitialized: true,
        error: 'Failed to load branding'
      });
    }
  }
}));

// Initialize branding on app start
useBrandingStore.getState().initializeBranding();
