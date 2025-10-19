import { useLocation, useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { routes } from './router';
import './globals.css';
import './index.css';
import './styles/App.scss';
import './styles/custom.scss';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const element = useRoutes(routes, location);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
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
    </>
  );
};

export default App;
