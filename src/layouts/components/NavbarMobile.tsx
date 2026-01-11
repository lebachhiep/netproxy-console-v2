import IconButton from '@/components/button/IconButton';
import { Chevron, Dismiss, TextColumnOne, Translate, WeatherMoon, WeatherSunny } from '@/components/icons';
import { HeaderSearchInput } from '@/components/input/HeaderSearchInput';
import { settings } from '@/settings';
import React, { useEffect, useRef, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Route, adminSections } from '@/router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import UserDropdown from '@/components/UserDropdown';
import { useBranding } from '@/hooks/useBranding';
import { motion } from 'framer-motion';
import { giftCodeService } from '@/services/giftcode/giftcode.service';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/components/dropdown';
import i18n from '@/i18n';
import { SupportedLanguages } from '@/config/constants';

interface Breadcrumb {
  title: string;
  icon?: React.ReactNode;
}

export const NavbarMobile = ({ toggleSidebar, sidebarOpen }: { toggleSidebar: () => void; sidebarOpen: boolean }) => {
  const { t } = useTranslation();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logoUrl, shouldInvertLogo } = useBranding();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [code, setCode] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const isBuyPage = location.pathname === '/buy';
  const isProxyDetail = matchPath('/proxy/detail/:id', location.pathname);

  const dropdownRef = useRef<HTMLDivElement>(null); // ref cho user info + menu
  const { user, userProfile, logout, fetchUserProfile } = useAuth();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('auth.LOGOUT_SUCCESS'));
      navigate('/login');
    } catch (error) {
      toast.error(t('toast.error.logout'));
      console.log('Logout error:', error);
    }
  };

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Nếu click ngoài dropdownRef thì mới đóng
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   // Kiểm tra nếu history có hơn 1 entry thì mới cho back
  //   setCanGoBack(window.history.state && window.history.state.idx > 0);
  // }, [location]);

  const handleBack = () => {
    navigate('/home');
  };

  const handleChange = (value: string) => {
    setCode(value);
  };

  const handleEnter = async (value: string) => {
    const trimmedCode = value.trim();
    if (!trimmedCode) {
      toast.error(t('toast.warn.enterActiveCode'));
    }

    if (isRedeeming) return;

    setIsRedeeming(true);
    try {
      const response = await giftCodeService.redeem(trimmedCode);

      // Backend always returns success=true on 200 response
      toast.success(response.message);

      if (response.balance_added) {
        await fetchUserProfile();
      }

      if (response.order_id) {
        toast.success(t('toast.success.orderCreate'), {
          duration: 5000
        });
      }

      setCode('');
    } catch (error: any) {
      // Handle Encore error format (may have validation_error or message)
      const errorMessage =
        error.response?.data?.validation_error || error.response?.data?.message || 'Không thể kích hoạt mã. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleSetBreadcrumbs = (data: Route): void => {
    if (!data) return;
    if (data.breadcrumb) {
      setBreadcrumbs([{ title: data.breadcrumb, icon: data.breadcrumbIcon }]);
    } else if (data.title) {
      setBreadcrumbs([{ title: data.title, icon: data.breadcrumbIcon }]);
    }
  };

  useEffect(() => {
    adminSections(t).forEach((section) => {
      section.routes.forEach((router: Route) => {
        if (router.path === location.pathname) {
          return handleSetBreadcrumbs(router);
        }
      });
    });
  }, [location.pathname, t]);

  // Focus input khi nhấn "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && inputRef.current) {
        e.preventDefault(); // tránh browser search
        inputRef.current.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="dark:bg-bg-primary-dark"
    >
      <div className="px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="h-12 flex items-center justify-between">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className={`h-8 object-contain text-center cursor-pointer ${shouldInvertLogo ? 'dark:invert' : ''}`}
              onClick={() => navigate('/home')}
            />
          )}
          <UserDropdown user={user} userProfile={userProfile} settings={settings} handleLogout={handleLogout} setModalOpen={() => {}} />
        </div>
      </div>
      <div className="px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-2">
          {isProxyDetail && <IconButton className="w-10 h-10" icon={<Chevron className="w-5 h-5" />} onClick={handleBack} />}
          <div className="flex-1 min-w-0">
            <HeaderSearchInput
              ref={inputRef}
              placeholder={t('navbar.activeCode')}
              wrapperClassName="rounded-[100px] h-10"
              value={code}
              onChange={(e) => handleChange(e.target.value)}
              onEnter={handleEnter}
              disabled={isRedeeming}
            />
          </div>
          {/* Ngôn ngữ */}
          <Dropdown trigger={'click'} placement="bottom-right">
            <Dropdown.Trigger asIcon>
              <IconButton className="w-10 h-10" icon={<Translate className="w-5 h-5" />} />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              {SupportedLanguages.map((language) => {
                return (
                  <Dropdown.Item
                    isActive={language.code === i18n.language}
                    key={language.code}
                    onClick={() => {
                      const currentLang = i18n.language;
                      if (currentLang === language.code) {
                        toast.info(language.infoMessage);
                        return;
                      }
                      i18n.changeLanguage(language.code);
                      toast.success(language.successMessage);
                    }}
                  >
                    <div className="flex gap-2">
                      <span>{language.flag}</span>
                      <span>{language.displayName}</span>
                    </div>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <IconButton
            className="w-10 h-10"
            icon={isDark ? <WeatherMoon className="w-5 h-5" /> : <WeatherSunny className="w-5 h-5" />}
            onClick={toggleTheme}
          />
          <IconButton
            className="w-10 h-10 md:hidden"
            icon={sidebarOpen ? <Dismiss className="w-5 h-5" /> : <TextColumnOne className="w-6 h-6" />}
            onClick={toggleSidebar}
          />
        </div>
      </div>

      {!isBuyPage && !isProxyDetail && (
        <div className="px-5 py-3 border-b border-border dark:border-border-dark">
          <div className="flex items-center gap-4">
            {/* Dashboard / Breadcrumb */}
            <div className="flex items-center gap-2 text-xl font-semibold text-text-hi">
              {breadcrumbs.length && breadcrumbs[breadcrumbs.length - 1].icon ? (
                React.cloneElement(breadcrumbs[breadcrumbs.length - 1].icon as React.ReactElement, {
                  width: 24,
                  height: 24
                })
              ) : (
                <MdDashboard className="text-text-hi dark:text-text-hi-dark w-6 h-6" />
              )}
              <span className="text-text-hi dark:text-text-hi-dark text-lg md:text-xl font-averta tracking-[-0.3px]">
                {breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1].title : 'Dashboard'}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};
