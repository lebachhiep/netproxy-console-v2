import { useLocation, useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { routes } from './router';
import './globals.css';
import './index.css';
import './styles/App.scss';
import './styles/custom.scss';
import { useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useBranding } from '@/hooks/useBranding';

const App = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { logoIconUrl, shouldInvertIcon } = useBranding();
  const element = useRoutes(routes(t), location);

  // Update favicon dynamically when theme or branding changes
  useEffect(() => {
    if (!logoIconUrl) return;

    // Find existing favicon (exclude apple-touch-icon)
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;

    if (!link) {
      // Also check for shortcut icon (legacy)
      link = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
    }

    if (!link) {
      // Create new favicon link
      link = document.createElement('link');
      link.rel = 'icon';
      // Don't set type - browser will auto-detect from URL/content
      document.head.appendChild(link);
    }

    link.href = logoIconUrl;

    // Note: Favicon doesn't support CSS invert
    // Browser will detect image format automatically from URL/content-type
  }, [logoIconUrl, shouldInvertIcon]);

  return (
    <CartProvider>
      {element}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px'
          }
        }}
      />
    </CartProvider>
  );
};

export default App;
