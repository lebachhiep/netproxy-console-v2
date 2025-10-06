import { motion, AnimatePresence } from 'framer-motion';
import { AppLogo } from './AppLogo';
import { useState, useEffect } from 'react';

export const AppLoading = () => {
  const [visible, setVisible] = useState(true);

  // Cho fade-out mượt nếu cần delay trước khi ẩn
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200); // ẩn sau 1.2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="app-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-bg-canvas dark:bg-bg-canvas-dark z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <AppLogo />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
