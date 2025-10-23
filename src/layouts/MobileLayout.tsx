import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { SidebarMobile } from './components/SidebarMobile';
import { NavbarMobile } from './components/NavbarMobile';

export const MobileLayout: React.FC = () => {
  const easeInOutCustom = [0.44, 0, 0.56, 1] as const;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);
  // Disable scroll khi sidebar mở
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="h-[100dvh] bg-bg-canvas dark:bg-bg-canvas-dark flex flex-col">
      {/* Navbar đơn giản */}

      <NavbarMobile sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay nền mờ — chỉ phủ dưới header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[136px] bottom-0 bg-black/40 backdrop-blur-sm z-[102]"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar trượt nhẹ từ header xuống */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: easeInOutCustom }}
              className="
          fixed left-0 right-0 top-[136px] z-[102]
          bg-white dark:bg-bg-surface-dark
          rounded-b-[16px] shadow-lg overflow-hidden
        "
            >
              <SidebarMobile onItemClick={closeSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nội dung */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
