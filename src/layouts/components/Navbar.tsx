import IconButton from '@/components/button/IconButton';
import { Chevron, Globe, WeatherMoon, WeatherSunny } from '@/components/icons';
import { HeaderSearchInput } from '@/components/input/HeaderSearchInput';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import { AccountProfileModal } from '@/pages/account-profile/components/modal/AccountProfileModal';
import { settings } from '@/settings';
import { AUTH_MESSAGES } from '@/utils/constants';
import React, { useEffect, useRef, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { Route, adminSections } from 'router';
import { toast } from 'sonner';

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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

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
    const root = document.documentElement;

    // Tắt tạm transition để tránh flicker khi đổi theme
    root.classList.add('disable-transitions');

    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Gỡ sau 1 frame để transition hoạt động đồng bộ
    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);
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
      <div className="w-full h-16 flex items-center justify-between px-5 py-2 bg-bg-canvas dark:bg-bg-canvas-dark  dark:border-border-element-dark">
        {/* Left */}
        <div className="flex items-center gap-4">
          <IconButton icon={<Chevron />} disabled={!canGoBack} onClick={handleBack} />

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
          <IconButton icon={<Globe className="w-6 h-6" />} />
          <IconButton icon={darkMode ? <WeatherMoon /> : <WeatherSunny />} onClick={() => setDarkMode((prev) => !prev)} />

          {/* User info */}

          <UserDropdown user={user} settings={settings} handleLogout={handleLogout} setModalOpen={setModalOpen} />
        </div>
      </div>

      <AccountProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
