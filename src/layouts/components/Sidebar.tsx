import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminSections, Route } from 'router';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { ReactComponent as LogoText } from 'assets/images/logo-text.svg';
import { Chevron } from '@/components/icons';
import IconButton from '@/components/button/IconButton';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  collapsed: boolean;
  toggle: (collapse: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();

  const navigate = useNavigate();
  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const isActive = (path: string) => location.pathname === path;

  // chia section main và footer
  const mainSections = adminSections.filter((s) => s.title !== 'FOOTER');
  const footerSection = adminSections.find((s) => s.title === 'FOOTER');

  return (
    <aside
      className={`fixed left-5 h-[calc(100vh-40px)] z-20 bg-bg-primary dark:bg-bg-primary-dark p-3 border-2 border-border-element dark:border-border-element-dark rounded-[16px] dark:rounded-sidebar shadow-lg flex flex-col transition-all duration-300 
      ${collapsed ? 'w-[calc(64px+4px)]' : 'w-[272px]'}`}
      // Hover auto expand / collapse
      onMouseEnter={() => toggle(false)} // mở khi hover
      onMouseLeave={() => toggle(true)} // đóng khi rời chuột
    >
      {/* Nút collapse */}
      <div className="absolute top-1/2 -right-3 z-50 -translate-y-1/2">
        {collapsed ? (
          <IconButton onClick={() => toggle(true)} className="w-6 h-6" icon={<Chevron className="rotate-180 w-4 h-4" />} />
        ) : (
          <IconButton onClick={() => toggle(false)} icon={<Chevron className="w-4 h-4" />} className="w-6 h-6" />
        )}
      </div>
      {/* Logo */}

      {collapsed ? (
        <div className="h-[52px] flex items-center justify-center cursor-pointer" onClick={() => navigate('/home')}>
          <Logo className="h-8 object-contain cursor-pointer dark:invert" />
        </div>
      ) : (
        <div className="h-[52px] flex items-center">
          <LogoText className="h-8 object-contain text-center cursor-pointer dark:invert" onClick={() => navigate('/home')} />
        </div>
      )}

      {/* Main menu */}
      <nav className="mt-2 flex-1 overflow-y-auto flex flex-col gap-4">
        {mainSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            {/* Section Header / Divider */}

            <div className="flex items-center gap-2">
              {!collapsed && (
                <div className="text-[11px] text-text-lo uppercase font-ibm-plex-mono tracking-[0.44px] leading-[17px]">
                  {section.title}
                </div>
              )}
              <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1 my-[8.5px]"></div>
            </div>
            {/* Menu Items */}
            <ul className="flex flex-col gap-1 ">
              {section.routes.map((route: Route) => {
                const isOpen = openKeys.includes(route.path || '');

                if (route.children?.length) {
                  return (
                    <li key={route.path} className="flex flex-col">
                      <button
                        onClick={() => toggleSubmenu(route.path || '')}
                        className={`flex items-center gap-3 px-4 py-2 text-[14px] font-medium w-full text-left hover:bg-gray-100 transition
                    ${isOpen ? 'bg-gray-50' : ''}`}
                      >
                        <span className="w-6 h-6 flex items-center justify-center">
                          {collapsed && route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                        </span>
                        <span
                          className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                            collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                          }`}
                        >
                          {route.title}
                        </span>
                      </button>

                      {/* Submenu */}
                      {isOpen && !collapsed && (
                        <ul className="ml-6 flex flex-col border-l border-gray-200">
                          {route.children
                            .filter((item) => !item.hidden)
                            .map((item) => {
                              const fullPath = `${route.path}/${item.path}`;
                              return (
                                <li key={fullPath}>
                                  <Link
                                    to={fullPath}
                                    className={`flex items-center h-10 px-2 py-1 text-[14px] rounded-lg transition
                                ${isActive(fullPath) ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-bg-hover-gray'}`}
                                  >
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.title}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={route.path}>
                    <Link
                      to={route.path || ''}
                      className={`flex items-center h-10 gap-2 px-2 py-1 text-[14px] font-medium rounded-lg transition-smooth
                  ${
                    isActive(route.path || '')
                      ? 'bg-primary text-white !font-bold'
                      : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray hover:!font-bold'
                  }`}
                    >
                      <div
                        className={twMerge(
                          'w-6 h-6 flex items-center justify-center',
                          collapsed
                            ? isActive(route.path || '')
                              ? 'text-white'
                              : 'text-text-hi'
                            : isActive(route.path || '')
                              ? 'text-white'
                              : route.iconClass
                        )}
                      >
                        {collapsed && route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                      </div>
                      <span
                        className={`transition-smooth overflow-hidden whitespace-nowrap ${
                          collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                        }`}
                      >
                        {route.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer menu */}
      {footerSection && (
        <div className="mt-auto pt-3">
          <ul className="flex flex-col gap-1">
            {footerSection.routes.map((route: Route) => (
              <li key={route.path}>
                <Link
                  to={route.path || ''}
                  className={`flex h-10 items-center gap-2 px-2 py-1 text-[14px] font-medium rounded-lg transition
                        ${isActive(route.path || '') ? 'bg-primary text-white !font-bold' : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray hover:!font-bold'} 
                      `}
                >
                  <div
                    className={twMerge(
                      'w-6 h-6 flex items-center justify-center',
                      collapsed
                        ? isActive(route.path || '')
                          ? 'text-white'
                          : 'text-text-hi'
                        : isActive(route.path || '')
                          ? 'text-white'
                          : route.iconClass
                    )}
                  >
                    {collapsed && route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                  </div>
                  <div
                    className={`w-full transition-all duration-300 overflow-hidden whitespace-nowrap ${
                      collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                    }`}
                  >
                    {route.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mt-1 px-2 leading-[150%] py-1 text-sm text-text-muted dark:text-text-muted-dark font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
            }`}
          >
            © 2025 Net Proxy.
          </div>
        </div>
      )}
    </aside>
  );
};
