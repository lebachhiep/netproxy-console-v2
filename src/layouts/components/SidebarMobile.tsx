import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminSections, Route } from '@/router';
import { Chevron } from '@/components/icons';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useBranding } from '@/hooks/useBranding';

interface SidebarMobileProps {
  onItemClick: () => void;
}

export const SidebarMobile = ({ onItemClick }: SidebarMobileProps) => {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { businessName } = useBranding();

  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const isActive = (path: string) => location.pathname === path;

  // chia section main và footer
  const mainSections = adminSections(t).filter((s) => s.title !== 'FOOTER');
  const footerSection = adminSections(t).find((s) => s.title === 'FOOTER');

  const handleItemClick = (path?: string) => {
    if (!path) return;
    navigate(path);
    onItemClick(); // đóng sidebar
  };

  return (
    <aside className="z-20 bg-bg-secondary dark:bg-bg-secondary-dark p-3 border border-border-element dark:border-border-element-dark rounded-bl-sidebar shadow-lg flex flex-col justify-between transition-[width] duration-300">
      {/* Main menu */}
      <nav className="mt-2 flex-1 overflow-y-auto flex flex-col gap-4">
        {mainSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <div className="text-[11px] text-text-lo uppercase font-ibm-plex-mono tracking-[0.44px] leading-[17px]">{section.title}</div>
              <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1 my-[8.5px]" />
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-1">
              {section.routes
                .filter((route) => !route.hidden)
                .map((route: Route) => {
                  const isOpen = openKeys.includes(route.path || '');

                  // Có submenu
                  if (route.children?.length) {
                    return (
                      <li key={route.path} className="flex flex-col">
                        <button
                          onClick={() => toggleSubmenu(route.path || '')}
                          className={`flex items-center gap-3 px-4 py-2 text-[14px] font-medium w-full text-left hover:bg-gray-100 transition
                            ${isOpen ? 'bg-gray-50' : ''}`}
                        >
                          <span className="w-6 h-6 flex items-center justify-center">
                            {!isActive(route.path || '') ? route.collapsedIcon : route.icon}
                          </span>
                          <span className="flex-1 whitespace-nowrap">{route.title}</span>
                          <Chevron className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Submenu */}
                        {isOpen && (
                          <ul className="ml-6 flex flex-col border-l border-gray-200">
                            {route.children
                              .filter((item) => !item.hidden)
                              .map((item) => {
                                const fullPath = `${route.path}/${item.path}`;
                                return (
                                  <li key={fullPath}>
                                    <button
                                      onClick={() => handleItemClick(fullPath)}
                                      className={`flex items-center h-10 px-2 py-1 text-[14px] rounded-lg w-full text-left transition
                                        ${
                                          isActive(fullPath)
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-gray-700 hover:bg-bg-hover-gray'
                                        }`}
                                    >
                                      {item.icon && <span className="mr-2">{item.icon}</span>}
                                      {item.title}
                                    </button>
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
                          onClick={onItemClick}
                          className={twMerge(
                            `flex items-center h-10 gap-2 px-2 py-1 text-[14px] font-medium rounded-lg w-full text-left transition-smooth`,
                            'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark hover:!font-bold'
                          )}
                        >
                          <div className={twMerge('w-6 h-6 flex items-center justify-center', route.iconClass)}>
                            {route.collapsedIcon ? route.collapsedIcon : route.icon}
                          </div>
                          <div className="flex-1 whitespace-nowrap">{route.title}</div>
                        </a>
                      </li>
                    );
                  }

                  // Không có submenu
                  return (
                    <li key={route.path}>
                      <button
                        onClick={() => handleItemClick(route.path)}
                        className={twMerge(
                          `flex items-center h-10 gap-2 px-2 py-1 text-[14px] font-medium rounded-lg w-full text-left transition-smooth`,
                          isActive(route.path || '')
                            ? 'bg-primary shadow-menuItem text-white !font-bold'
                            : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark hover:!font-bold'
                        )}
                      >
                        <div
                          className={twMerge(
                            'w-6 h-6 flex items-center justify-center',
                            isActive(route.path || '') ? 'text-white' : route.iconClass
                          )}
                        >
                          {route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                        </div>
                        <div className="flex-1 whitespace-nowrap">{route.title}</div>
                      </button>
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
                <button
                  onClick={() => handleItemClick(route.path)}
                  className={twMerge(
                    `flex h-10 items-center gap-2 px-2 py-1 text-[14px] font-medium rounded-lg w-full text-left transition`,
                    isActive(route.path || '')
                      ? 'bg-primary shadow-menuItem text-white !font-bold'
                      : 'text-text-hi dark:text-text-hi-dark hover:bg-bg-hover-gray hover:!font-bold'
                  )}
                >
                  <div
                    className={twMerge(
                      'w-6 h-6 flex items-center justify-center',
                      isActive(route.path || '') ? 'text-white' : route.iconClass
                    )}
                  >
                    {route.collapsedIcon && !isActive(route.path || '') ? route.collapsedIcon : route.icon}
                  </div>
                  <div className="flex-1 whitespace-nowrap">{route.title}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-1 px-2 py-1 text-sm text-text-muted dark:text-text-muted-dark font-medium">
            © {new Date().getFullYear()} {businessName}.
          </div>
        </div>
      )}
    </aside>
  );
};
