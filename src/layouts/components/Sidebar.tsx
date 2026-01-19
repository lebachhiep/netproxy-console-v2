import IconButton from '@/components/button/IconButton';
import { Chevron } from '@/components/icons';
import { useResponsive } from '@/hooks/useResponsive';
import { useBranding } from '@/hooks/useBranding';
import clsx from 'clsx';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminSections, Route } from '@/router';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

// Declare $crisp as a global variable
declare const $crisp: any;

interface SidebarProps {
  collapsed: boolean;
  toggle: (collapse: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggle }: SidebarProps) => {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const { isDesktop, isLargeDesktop, isMobile, isTablet } = useResponsive();
  const navigate = useNavigate();
  const { isAbsoluteSidebar } = useResponsive();
  const { logoUrl, logoIconUrl, shouldInvertLogo, shouldInvertIcon, businessName } = useBranding();
  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const isActive = (path: string) => location.pathname === path;

  // chia section main và footer
  const mainSections = adminSections(t).filter((s) => s.title !== 'FOOTER');
  const footerSection = adminSections(t).find((s) => s.title === 'FOOTER');

  return (
    <aside
      className={clsx(
        `hidden left-5 h-[calc(100dvh-40px)] z-[102] bg-bg-secondary dark:bg-bg-secondary-dark p-3 border-2 border-border-element dark:border-border-element-dark rounded-[16px] shadow-lg md:flex flex-col transition-[width] duration-300 
      ${collapsed ? 'w-[calc(64px+4px)]' : 'w-[212px] lg:w-[272px]'}`,
        isAbsoluteSidebar ? 'absolute !left-0 !top-0 z-20' : 'fixed'
      )}
      // Hover auto expand / collapse
      onMouseEnter={() => (isDesktop || isLargeDesktop ? toggle(false) : '')} // mở khi hover
      onMouseLeave={() => (isDesktop || isLargeDesktop ? toggle(true) : '')} // đóng khi rời chuột
    >
      {/* Nút collapse */}
      {(isMobile || isTablet || isDesktop) && (
        <div className="absolute top-1/2 -right-3 z-50 -translate-y-1/2">
          {collapsed ? (
            <IconButton onClick={() => toggle(false)} className="w-6 h-6" icon={<Chevron className="rotate-180 w-4 h-4" />} />
          ) : (
            <IconButton onClick={() => toggle(true)} icon={<Chevron className="w-4 h-4" />} className="w-6 h-6" />
          )}
        </div>
      )}
      {/* Logo */}

      {collapsed ? (
        <div className="h-[52px] hidden lg:flex items-center justify-center cursor-pointer" onClick={() => navigate('/home')}>
          {logoIconUrl && (
            <img src={logoIconUrl} alt="Logo" className={`h-8 object-contain cursor-pointer ${shouldInvertIcon ? 'dark:invert' : ''}`} />
          )}
        </div>
      ) : (
        <div className="h-[52px] hidden lg:flex items-center cursor-pointer" onClick={() => navigate('/home')}>
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className={`h-8 object-contain text-center ${shouldInvertLogo ? 'dark:invert' : ''}`} />
          )}
        </div>
      )}

      {/* Main menu */}
      <nav className={twMerge(clsx('lg:mt-2 flex-1 overflow-y-auto flex flex-col gap-2 lg:gap-4', { 'scrollbar-hide': collapsed }))}>
        {mainSections.map((section, index) => (
          <div key={section.title} className="flex flex-col gap-2">
            {/* Section Header / Divider */}

            <div className="hidden lg:flex items-center gap-2">
              {!collapsed && (
                <div className="text-[11px] text-text-lo uppercase font-ibm-plex-mono tracking-[0.44px] leading-[17px]">
                  {section.title}
                </div>
              )}
              <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1 my-[8.5px]"></div>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-1 ">
              {section.routes
                .filter((route) => !route.hidden)
                .map((route: Route) => {
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

                  // External link
                  if (route.externalUrl) {
                    return (
                      <li key={route.name || route.externalUrl}>
                        <a
                          href={route.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center h-10 gap-2 px-2 py-1 text-[14px] font-medium rounded-lg transition-smooth text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark hover:!font-bold"
                        >
                          <div
                            className={twMerge(
                              'w-6 h-6 flex items-center justify-center',
                              collapsed ? 'text-text-hi dark:text-text-hi-dark' : route.iconClass
                            )}
                          >
                            {collapsed && route.collapsedIcon ? route.collapsedIcon : route.icon}
                          </div>
                          <div
                            className={`transition-smooth overflow-hidden whitespace-nowrap flex-1 ${
                              collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                            }`}
                          >
                            {route.title}
                          </div>
                        </a>
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
                      ? 'bg-primary shadow-menuItem text-white !font-bold'
                      : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark hover:!font-bold'
                  }`}
                      >
                        <div
                          className={twMerge(
                            'w-6 h-6 flex items-center justify-center',
                            collapsed
                              ? isActive(route.path || '')
                                ? 'text-white'
                                : 'text-text-hi dark:text-text-hi-dark'
                              : isActive(route.path || '')
                                ? 'text-white'
                                : route.iconClass
                          )}
                        >
                          {collapsed && route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                        </div>
                        <div
                          className={`transition-smooth overflow-hidden whitespace-nowrap flex-1 ${
                            collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                          }`}
                        >
                          {route.title}
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>

            {/* Divider riêng cho tablet giữa 2 section */}
            {index === 0 && (
              <div className="flex md:flex lg:hidden">
                <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1 my-[8.5px]" />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer menu */}
      {footerSection && (
        <div className="mt-auto pt-3">
          <ul className="flex flex-col gap-1">
            {footerSection.routes.map((route: Route) => (
              <li
                key={route.path}
                onClick={() => {
                  if (route.path === '/help') {
                    $crisp.push(['do', 'chat:toggle']);
                  }
                }}
              >
                <Link
                  to={route.path === '/help' ? '#' : route.path || ''}
                  className={`flex h-10 items-center gap-2 px-2 py-1 text-[14px] font-medium rounded-lg transition
                        ${isActive(route.path || '') ? 'bg-primary shadow-menuItem text-white !font-bold' : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray hover:!font-bold'} 
                      `}
                >
                  <div
                    className={twMerge(
                      'w-6 h-6 flex items-center justify-center',
                      collapsed
                        ? isActive(route.path || '')
                          ? 'text-white'
                          : 'text-text-hi dark:text-text-hi-dark'
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
            © {new Date().getFullYear()} {businessName}.
          </div>
        </div>
      )}
    </aside>
  );
};
