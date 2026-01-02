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
  const { logoIconUrl } = useBranding();
  const element = useRoutes(routes(t), location);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <CartProvider>
      {logoIconUrl && <link rel="icon" href={logoIconUrl} />}
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
