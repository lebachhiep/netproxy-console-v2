import IconButton from '@/components/button/IconButton';
import { ArrowDown, Chevron, Globe, Person, SignOut, WalletCreditCardFilled } from '@/components/icons';
import { HeaderSearchInput } from '@/components/input/HeaderSearchInput';
import { settings } from '@/settings';
import React, { useEffect, useRef, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Route, adminSections } from 'router';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AUTH_MESSAGES } from '@/utils/constants';
import { AccountProfileModal } from '@/pages/account-profile/components/modal/AccountProfileModal';

interface Breadcrumb {
  title: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [code, setCode] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // ref cho user info + menu
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS);
      navigate('/login');
    } catch (error) {
      toast.error('Đăng xuất thất bại');
    }
  };

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Nếu click ngoài dropdownRef thì mới đóng
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const handleEnter = (value: string) => {
    console.log('Mã kích hoạt:', value);
    // TODO: gọi API check code ở đây
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
    adminSections.forEach((section) => {
      section.routes.forEach((router: Route) => {
        if (router.path === location.pathname) {
          return handleSetBreadcrumbs(router);
        }
      });
    });
  }, [location.pathname]);

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

  console.log({ modalOpen });

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between px-5 py-2 bg-bg-primary dark:bg-bg-primary-dark dark:border-t-2 dark:border-border-element-dark transition-colors duration-300">
        {/* Left */}
        <div className="flex items-center gap-4">
          <IconButton icon={<Chevron className="text-text-lo dark:text-text-lo-dark " />} disabled={!canGoBack} onClick={handleBack} />

          {/* Dashboard / Breadcrumb */}
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
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <HeaderSearchInput
            ref={inputRef}
            placeholder={'Nhập mã kích hoạt'}
            wrapperClassName="rounded-[100px]"
            inputClassName="w-[194px]"
            value={code}
            onChange={(e) => handleChange(e.target.value)}
            onEnter={handleEnter}
          />
          {/* Ngôn ngữ */}
          <IconButton icon={<Globe className="text-text-lo w-6 h-6 dark:text-text-lo-dark" />} />
          {/* <IconButton
          icon={
            darkMode ? (
              <WeatherMoon className="text-text-lo dark:text-text-lo-dark" />
            ) : (
              <WeatherSunny className="text-text-lo dark:text-text-lo-dark" />
            )
          }
          onClick={() => setDarkMode((prev) => !prev)}
        /> */}

          {/* User info */}
          <div className="relative" ref={dropdownRef}>
            {/* User info */}
            <div
              className="flex items-center justify-between cursor-pointer border-2 border-border-element dark:border-border-element-dark pl-2 pr-4 rounded-[100px] w-[200px] h-12 shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <img src={user?.photoURL || settings.defaultAvatar} className="w-9 h-9 rounded-full" />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-medium text-text-me dark:text-text-me-dark">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-sm text-blue-hi dark:text-blue-hi-dark">$ 825.97</span>
                </div>
              </div>
              <ArrowDown className="text-text-lo dark:text-text-lo-dark" />
            </div>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute top-[64px] right-0 w-[200px] bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg border border-border-element dark:border-border-element-dark overflow-hidden z-50">
                <div className="flex flex-col gap-1 p-1">
                  <div
                    onClick={() => {
                      setModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer block rounded-lg px-2 py-1 text-sm text-text-me dark:text-text-me-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Person className="w-5 h-5 text-text-hi dark:text-text-hi-dark" />
                      <div>
                        Xem hồ sơ{' '}
                        <span className="text-sm text-blue-hi dark:text-blue-hi-dark">
                          {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/wallet"
                    className="block rounded-lg px-2 py-1 text-sm text-text-me dark:text-text-me-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2 flex-nowrap">
                      <WalletCreditCardFilled className="w-5 h-5 text-text-hi dark:text-text-hi-dark" />
                      <div>
                        Xem ví của tôi <span className="text-sm text-blue-hi dark:text-blue-hi-dark">$825.97</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block rounded-lg px-2 py-1 text-sm text-text-me dark:text-text-me-dark hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                  >
                    <div className="flex items-center gap-2">
                      <SignOut className="w-5 h-5 text-red dark:text-red-dark" />
                      <div>Đăng xuất</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AccountProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
