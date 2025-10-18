import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = useCallback((collapsed: boolean) => {
    setCollapsed(collapsed);
  }, []);

  const easeInOutCustom = [0.44, 0, 0.56, 1] as const;

  return (
    <div className="bg-bg-canvas dark:bg-bg-canvas-dark min-h-screen md:pl-5 md:py-5">
      <div className="rounded-tl-[16px] border-border-element relative">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: -20, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeInOutCustom }}
          className="fixed left-5 top-5 h-[calc(100vh-40px)] z-20"
        >
          <Sidebar collapsed={collapsed} toggle={toggle} />
        </motion.div>

        {/* Navbar */}
        <motion.div
          key="navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.4, // xuất hiện sau sidebar
            ease: easeInOutCustom
          }}
          className={clsx(
            'fixed top-5 right-0 h-16 z-40 transition-all duration-300',
            collapsed ? 'left-[88px]' : 'left-[calc(272px+20px)]'
          )}
        >
          <Navbar />
        </motion.div>

        {/* Content */}
        <main className={clsx('pt-16 transition-all duration-300 min-h-[calc(100vh-42px)]', collapsed ? 'md:ml-[68px]' : 'md:ml-[272px]')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
