import { LoadingOutlined } from '@ant-design/icons';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
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
  'font-bold whitespace-nowrap inline-flex h-12 justify-center items-center gap-1 rounded-[100px] border-2 shadow-xs text-[12px]';

// variant style
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary dark:bg-primary-dark border-primary-border dark:border-primary-border-dark text-white hover:bg-[#e55e16]',
  outlined: 'border-primary-border text-primary bg-primary-bg hover:border-primary',
  default:
    'border-border-element dark:border-border-element-dark text-text-lo dark:text-text-lo-dark hover:text-text-hi dark:hover:text-text-hi-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark',
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

  return (
    <button className={twMerge(baseClasses, variants[variant], sizes[size], className)} disabled={isDisabled} {...props}>
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  );
};
