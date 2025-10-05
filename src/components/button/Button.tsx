import { LoadingOutlined } from '@ant-design/icons';
import { ButtonHTMLAttributes, FC, ReactNode, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'outlined' | 'default' | 'disabled';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Biến thể của button: 'primary', 'outlined', 'default', 'disabled'.
   * @default "primary"
   */
  variant?: 'primary' | 'outlined' | 'default' | 'disabled';

  /**
   * Kích thước button: 'sm', 'md', 'lg'.
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Nếu true, hiển thị trạng thái loading.
   * @default false
   */
  loading?: boolean;

  /**
   * Icon hiển thị trên button (tùy chọn).
   */
  icon?: ReactNode;

  /**
   * Vị trí hiển thị icon: 'left' hoặc 'right'.
   * @default "left"
   */
  iconPosition?: 'left' | 'right';
}

const baseClasses =
  'font-bold relative transition-colors duration-300 overflow-hidden group whitespace-nowrap inline-flex h-12 justify-center items-center gap-1 rounded-[100px] border-2 shadow-xs text-[12px]';

// variant style
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary hover:brightness-[110%] dark:bg-primary-dark border-primary-border dark:border-primary-border-dark text-white hover:border-primary-hover dark:hover:bg-primary-hover-dark',
  outlined: 'border-primary-border text-primary bg-primary-bg hover:border-primary',
  default:
    'border-border dark:border-border-dark text-text-me dark:text-text-me-dark hover:text-text-hi dark:hover:text-text-hi-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:border-blue',
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed border-0'
};

// size style
const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-3 py-[7.5px] text-sm',
  lg: 'px-4 py-3 text-lg'
};

/**
 * Component Button
 *
 * Một button tùy chỉnh với các tính năng:
 * - Hỗ trợ các variant: primary, outlined, default, disabled
 * - Hỗ trợ các kích thước: sm, md, lg
 * - Hiển thị icon ở bên trái hoặc bên phải
 * - Hỗ trợ trạng thái loading
 * - Kết hợp className tùy chỉnh
 *
 * @component
 *
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('Click')}>
 *   Nhấn tôi
 * </Button>
 *
 * <Button variant="outlined" size="sm" icon={<SomeIcon />} iconPosition="left">
 *   Button Icon
 * </Button>
 *
 * <Button variant="primary" loading>
 *   Loading...
 * </Button>
 *
 */
export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const isDisabled = disabled || variant === 'disabled' || loading;
  const iconElement = loading ? <LoadingOutlined className="w-5 h-5 animate-spin" /> : icon;

  // ref để lấy width của button
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (btnRef.current) {
      const width = btnRef.current.offsetWidth;

      console.log(width);
      const distance = width + 300; // chạy ngang button + 300px
      btnRef.current.style.setProperty('--move-distance', `${distance}px`);

      const speed = 250; // px/giây
      const duration = distance / speed;
      btnRef.current.style.setProperty('--move-duration', `${duration}s`);
    }
  }, []);

  const blurClasses = variant === 'primary' ? 'opacity-100' : ' group-hover:opacity-100';

  return (
    <button ref={btnRef} className={twMerge(baseClasses, variants[variant], sizes[size], className)} disabled={isDisabled} {...props}>
      <span
        className={twMerge(
          'absolute  -bottom-[22px] -top-[22px] flex-none mix-blend-overlay -left-[27px] w-[22px] bg-[rgb(255,161,46)] blur-[10px] opacity-0 rotate-[30deg] animate-moveBlur',
          blurClasses
        )}
      ></span>
      {iconPosition === 'left' && iconElement}
      <div className="leading-[140%]">{children}</div>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};
