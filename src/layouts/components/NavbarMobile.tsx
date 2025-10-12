import IconButton from '@/components/button/IconButton';
import {
  ArrowDown,
  Chevron,
  Dismiss,
  Globe,
  Person,
  PersonOutlined,
  SignOut,
  TextColumnOne,
  WalletCreditCardFilled,
  WalletCreditCardOutlined,
  WeatherMoon,
  WeatherSunny
} from '@/components/icons';
import { HeaderSearchInput } from '@/components/input/HeaderSearchInput';
import { settings } from '@/settings';
import React, { useEffect, useRef, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Route, adminSections } from 'router';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AUTH_MESSAGES } from '@/utils/constants';
import { AccountProfileModal } from '@/pages/account-profile/components/modal/AccountProfileModal';
import UserDropdown from '@/components/UserDropdown';
import { ReactComponent as LogoText } from 'assets/images/logo-text.svg';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { SidebarMobile } from './SidebarMobile';

interface Breadcrumb {
  title: string;
  icon?: React.ReactNode;
}

export const NavbarMobile = ({ toggleSidebar, sidebarOpen }: { toggleSidebar: () => void; sidebarOpen: boolean }) => {
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

  const isBuyPage = location.pathname === '/buy';
  const isProxyDetail = matchPath('/proxy/detail/:id', location.pathname);

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

    // Tạm tắt transition toàn trang
    root.classList.add('disable-transitions');

    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Gỡ class sau 1 frame (để theme đổi tức thì)
    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);
  }, [darkMode]);

  useEffect(() => {
    // Kiểm tra nếu history có hơn 1 entry thì mới cho back
    setCanGoBack(window.history.state && window.history.state.idx > 0);
  }, [location]);

  const handleBack = () => {
    navigate('/home');
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
    <motion.header initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="h-12 flex items-center justify-between">
          <LogoText className="h-8 object-contain text-center cursor-pointer dark:invert" onClick={() => navigate('/home')} />
          <UserDropdown user={user} settings={settings} handleLogout={handleLogout} setModalOpen={setModalOpen} />
        </div>
      </div>
      <div className="px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-2">
          {isProxyDetail && <IconButton className="w-10 h-10" icon={<Chevron className="w-5 h-5" />} onClick={handleBack} />}
          <div className="flex-1 min-w-0">
            <HeaderSearchInput
              ref={inputRef}
              placeholder={'Nhập mã kích hoạt'}
              wrapperClassName="rounded-[100px] h-10"
              value={code}
              onChange={(e) => handleChange(e.target.value)}
              onEnter={handleEnter}
            />
          </div>
          {/* Ngôn ngữ */}
          <IconButton className="w-10 h-10" icon={<Globe className="w-5 h-5" />} />
          <IconButton
            className="w-10 h-10"
            icon={darkMode ? <WeatherMoon className="w-5 h-5" /> : <WeatherSunny className="w-5 h-5" />}
            onClick={() => setDarkMode((prev) => !prev)}
          />
          <IconButton
            className="w-10 h-10"
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
