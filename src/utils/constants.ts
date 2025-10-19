// Authentication constants
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email'
} as const;

export const PROTECTED_ROUTES = {
  HOME: '/home',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
} as const;

// Password validation constants
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true
} as const;

// Session constants
export const SESSION_CONFIG = {
  TIMEOUT_MINUTES: 30,
  REMEMBER_ME_DAYS: 30
} as const;

// Toast messages
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  PASSWORD_RESET_SENT: 'Email đặt lại mật khẩu đã được gửi!',
  EMAIL_VERIFICATION_SENT: 'Email xác thực đã được gửi!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công!'
} as const;

export const COUNTRY_OPTIONS = [
  { value: 'vn', label: '🇻🇳 Việt Nam' },
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'kr', label: '🇰🇷 South Korea' },
  { value: 'cn', label: '🇨🇳 China' },
  { value: 'th', label: '🇹🇭 Thailand' },
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'my', label: '🇲🇾 Malaysia' },
  { value: 'id', label: '🇮🇩 Indonesia' },
  { value: 'ph', label: '🇵🇭 Philippines' }
];
