import { AppLoading } from '@/components/app/AppLoading';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'linear' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};
