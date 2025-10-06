import { useLocation, useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './globals.css';
import './index.css';
import { routes } from './router';
import './styles/App.scss';
import './styles/custom.scss';

const App = () => {
  const location = useLocation();
  const element = useRoutes(routes, location);

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
