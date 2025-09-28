import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
// import "./styles/AdminLayout.scss";

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="bg-bg-canvas dark:bg-bg-canvas-dark min-h-screen  pl-5 py-5">
      <div className="rounded-tl-[16px] border-border-element">
        {/* Sidebar cố định */}

        <Sidebar collapsed={collapsed} toggle={toggle} />

        {/* Navbar cố định */}
        <div
          className={clsx(
            'fixed top-5 right-0 h-16 z-50 transition-all duration-300',
            collapsed ? 'left-[88px]' : 'left-[calc(272px+20px)]'
          )}
        >
          <Navbar />
        </div>

        {/* Content */}
        <main className={clsx('pt-16 transition-all duration-300 min-h-[calc(100vh-42px)]', collapsed ? 'ml-[88px]' : 'ml-[272px]')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
