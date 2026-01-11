import { useBrandingStore } from '@/stores/branding.store';

// Hook wrapper for branding store
export const useBranding = () => {
  const { businessName, logoUrl, logoIconUrl, isLoading, isInitialized, error } = useBrandingStore();

  return {
    businessName,
    logoUrl,
    logoIconUrl,
    isLoading,
    isInitialized,
    error,
    hasLogos: !!logoUrl && !!logoIconUrl
  };
};
