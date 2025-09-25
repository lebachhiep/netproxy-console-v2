import { Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AppLoading } from './components/app/AppLoading';
import { Toaster } from 'sonner';
import './globals.css';
import './index.css';
import './styles/App.scss';
import { routes } from './router';
import './styles/custom.scss';

const App = () => {
  const location = useLocation();
  const element = useRoutes(routes, location);

  return (
    <>
      <Suspense fallback={<AppLoading />}>
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          > */}
        {element}
        {/* </motion.div> */}
        {/* </AnimatePresence> */}
      </Suspense>
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
