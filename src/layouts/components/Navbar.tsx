import IconButton from '@/components/button/IconButton';
import { Chevron, Translate, WeatherMoon, WeatherSunny } from '@/components/icons';
import { HeaderSearchInput } from '@/components/input/HeaderSearchInput';
import Tooltip from '@/components/tooltip/Tooltip';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { AccountProfileModal } from '@/pages/account-profile/components/modal/AccountProfileModal';
import { settings } from '@/settings';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDashboard } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { Route, adminSections } from '@/router';
import { toast } from 'sonner';
import { giftCodeService } from '@/services/giftcode/giftcode.service';
import { Dropdown } from '@/components/dropdown';
import { useNavbar } from '@/contexts/NavbarContext';
import { SupportedLanguages } from '@/config/constants';
interface Breadcrumb {
  title: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [code, setCode] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const overrideNavbarItems = useNavbar().navbarItems;

  const dropdownRef = useRef<HTMLDivElement>(null); // ref cho user info + menu
  const { user, userProfile, logout, fetchUserProfile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
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

  useEffect(() => {
    // Kiểm tra nếu history có hơn 1 entry thì mới cho back
    setCanGoBack(window.history.state && window.history.state.idx > 0);
  }, [location]);

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  const handleChange = (value: string) => {
    setCode(value);
  };

  const handleEnter = async (value: string) => {
    const trimmedCode = value.trim();
    if (!trimmedCode) {
      toast.error(t('toast.warn.enterActiveCode'));
      return;
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
        if (router.path === location.pathname || location.pathname.startsWith(router.path + '/')) {
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
    <>
      <div className="w-full h-16 flex items-center justify-between px-5 py-2 bg-bg-canvas dark:bg-bg-canvas-dark  dark:border-border-element-dark gap-2">
        {/* Left */}
        <div className="flex items-center gap-4">
          <IconButton icon={<Chevron />} disabled={!canGoBack} onClick={handleBack} />

          {/* Dashboard / Breadcrumb */}
          {overrideNavbarItems.length ? (
            overrideNavbarItems.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-2 text-xl font-semibold text-text-hi">
                  <div>{item.icon}</div>
                  <span className="text-text-hi dark:text-text-hi-dark text-xl font-averta tracking-[-0.3px]">
                    {item.label ? item.label : 'Dashboard'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-2 text-xl font-semibold text-text-hi">
              {breadcrumbs.length && breadcrumbs[breadcrumbs.length - 1].icon ? (
                <div>{breadcrumbs[breadcrumbs.length - 1].icon}</div>
              ) : (
                <MdDashboard className="text-text-hi dark:text-text-hi-dark text-xl" />
              )}
              <span className="text-text-hi dark:text-text-hi-dark text-xl font-averta tracking-[-0.3px]">
                {breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1].title : 'Dashboard'}
              </span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <HeaderSearchInput
            ref={inputRef}
            placeholder={t('navbar.activeCode')}
            wrapperClassName="rounded-[100px]"
            value={code}
            onChange={(e) => handleChange(e.target.value)}
            onEnter={handleEnter}
            disabled={isRedeeming}
          />
          {/* Ngôn ngữ */}
          <Dropdown trigger={'both'} placement="bottom-right">
            <Dropdown.Trigger asIcon>
              <IconButton className="w-10 h-10" icon={<Translate className="w-5 h-5" />} />
            </Dropdown.Trigger>
            <Dropdown.Menu className="max-h-[100px]">
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
          <Tooltip content={isDark ? 'Light mode' : 'Dark mode'} trigger="hover" position="bottom">
            <IconButton
              className="w-10 h-10"
              icon={isDark ? <WeatherMoon className="w-5 h-5" /> : <WeatherSunny className="w-5 h-5" />}
              onClick={toggleTheme}
            />
          </Tooltip>
          {/* User info */}

          <UserDropdown user={user} userProfile={userProfile} settings={settings} handleLogout={handleLogout} setModalOpen={setModalOpen} />
        </div>
      </div>

      <AccountProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
