import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { useResponsive } from '@/hooks/useResponsive';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAbsoluteSidebar } = useResponsive();

  const toggle = useCallback((collapsed: boolean) => {
    setCollapsed(collapsed);
  }, []);

  const easeInOutCustom = [0.44, 0, 0.56, 1] as const;

  return (
    <div className="bg-bg-canvas dark:bg-bg-canvas-dark h-[100dvh] md:pl-5 md:pt-5 flex flex-col">
      <div className="rounded-tl-[16px] border-border-element relative flex flex-col h-full">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: -20, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeInOutCustom }}
          className={clsx('left-5 top-5 h-[calc(100dvh-40px)] z-[101]', isAbsoluteSidebar ? 'absolute !top-0 z-20' : 'fixed')}
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
            collapsed ? 'left-[88px]' : isAbsoluteSidebar ? 'left-[88px]' : 'left-[calc(272px+20px)]'
          )}
        >
          <Navbar />
        </motion.div>

        {/* Content */}
        <main
          className={clsx(
            'pt-16 transition-all duration-300 flex-1 flex flex-col overflow-hidden',
            collapsed ? 'md:ml-[68px]' : isAbsoluteSidebar ? 'md:ml-[68px]' : 'md:ml-[272px]'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
