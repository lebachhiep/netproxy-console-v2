import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Chevron, PersonOutlined, SignOut, WalletCreditCardOutlined } from './icons';
import { User } from 'firebase/auth';

interface Props {
  user: User | null;
  settings: { defaultAvatar: string };
  handleLogout: () => void;
  setModalOpen: (open: boolean) => void;
}

const UserDropdown: React.FC<Props> = ({ user, settings, handleLogout, setModalOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setMenuOpen(true)} // hover vào avatar HOẶC menu thì mở
      onMouseLeave={() => setMenuOpen(false)} // rời hẳn ra ngoài thì đóng
    >
      {/* User info */}
      <div
        className="flex items-center justify-between cursor-pointer border-2 border-border-element dark:border-transparent dark:border-border-element-dark dark:pseudo-border-top
                   pl-2 pr-4 rounded-[100px] w-[200px] h-12 shadow-xs 
                   bg-bg-secondary dark:bg-bg-secondary-dark 
                   hover:border-blue dark:hover:border-transparent transition-colors duration-300"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <img src={user?.photoURL || settings.defaultAvatar} className="w-9 h-9 rounded-full" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-text-me dark:text-text-me-dark">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-sm text-blue-hi dark:text-blue-hi-dark">$ 825.97</span>
          </div>
        </div>
        <Chevron
          className={`w-4 h-4 text-text-lo dark:text-text-lo-dark transition-transform duration-300 ${
            menuOpen ? 'rotate-[90deg]' : '-rotate-[90deg]'
          }`}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 w-[200px] z-50"
          >
            {/* cầu nối trong suốt tạo gap */}
            <div className="h-2"></div>

            <div className="bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg border border-border-element dark:border-border-element-dark overflow-hidden">
              <div className="flex flex-col gap-1 p-1">
                <div
                  onClick={() => {
                    navigate('/account-profile');
                    // setModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer block rounded-lg px-2 py-1 text-sm 
                             text-text-me dark:text-text-me-dark 
                             hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                >
                  <div className="flex items-center gap-2">
                    <PersonOutlined className="w-5 h-5 text-text-hi dark:text-text-hi-dark" />
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
                  className="block rounded-lg px-2 py-1 text-sm 
                             text-text-me dark:text-text-me-dark 
                             hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 flex-nowrap">
                    <WalletCreditCardOutlined className="w-5 h-5 text-text-hi dark:text-text-hi-dark" />
                    <div>
                      Xem ví của tôi <span className="text-sm text-blue-hi dark:text-blue-hi-dark">$825.97</span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block rounded-lg px-2 py-1 text-sm 
                             text-text-me dark:text-text-me-dark 
                             hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
                >
                  <div className="flex items-center gap-2">
                    <SignOut className="w-5 h-5 text-red dark:text-red-dark" />
                    <div>Đăng xuất</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
