import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { NavbarMobile } from './components/NavbarMobile';
import { Sidebar } from './components/Sidebar';
import clsx from 'clsx';

export const TabletLayout: React.FC = () => {
  const easeInOutCustom = [0.44, 0, 0.56, 1] as const;
  const [collapsed, setCollapsed] = useState(true);

  const toggle = useCallback((collapsed: boolean) => {
    setCollapsed(collapsed);
  }, []);

  return (
    <div className="bg-bg-canvas dark:bg-bg-canvas-dark flex flex-col h-[100dvh] md:pl-5 md:py-5 md:overflow-hidden">
      <div className="rounded-tl-[16px] border-border-element relative flex flex-col h-full">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: -20, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeInOutCustom }}
          className="fixed left-5 top-5 h-[calc(100dvh-40px)]"
        >
          <Sidebar collapsed={collapsed} toggle={toggle} />
        </motion.div>
        <motion.div
          key="navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.4, // xuất hiện sau sidebar
            ease: easeInOutCustom
          }}
          className={clsx('transition-all duration-300', collapsed ? 'md:ml-[68px]' : 'md:ml-[212px]')}
        >
          {/* Navbar đơn giản */}
          <NavbarMobile
            toggleSidebar={function (): void {
              throw new Error('Function not implemented.');
            }}
            sidebarOpen={false}
          />
        </motion.div>
        {/* Nội dung */}
        <main
          className={clsx(
            'flex-1 transition-all duration-300 overflow-y-hidden flex flex-col',
            collapsed ? 'md:ml-[68px]' : 'md:ml-[212px]'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
