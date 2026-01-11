import { create } from 'zustand';
import { brandingService } from '@/services/branding';

interface BrandingState {
  businessName: string;
  logoUrl: string;
  logoIconUrl: string;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initializeBranding: () => Promise<void>;
}

export const useBrandingStore = create<BrandingState>()((set, get) => ({
  businessName: '',
  logoUrl: '',
  logoIconUrl: '',
  isLoading: false,
  isInitialized: false,
  error: null,

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
        logoUrl: branding.logos?.logo?.original || '',
        logoIconUrl: branding.logos?.logo_icon?.original || '',
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Failed to fetch branding:', error);
      const domain = window.location.hostname;

      set({
        businessName: domain,
        logoUrl: '',
        logoIconUrl: '',
        isLoading: false,
        isInitialized: true,
        error: 'Failed to load branding'
      });
    }
  }
}));

// Initialize branding on app start
useBrandingStore.getState().initializeBranding();
