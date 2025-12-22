import { LoadingOutlined } from '@ant-design/icons';
import { ButtonHTMLAttributes, FC, ReactNode, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'outlined' | 'default' | 'disabled';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
}

const baseClasses =
  'font-bold relative transition-colors duration-300 group whitespace-nowrap inline-flex h-12 justify-center items-center gap-1 rounded-[100px] border-2 shadow-xs text-[12px]';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary hover:brightness-[110%] dark:bg-primary-dark border-primary-border dark:border-primary-border-dark text-white hover:border-primary-hover dark:hover:bg-primary-hover-dark',
  outlined: 'border-primary-border text-primary bg-primary-bg hover:border-primary',
  default:
    'border-border dark:border-transparent dark:pseudo-border-top text-text-me dark:text-text-me-dark hover:text-text-hi dark:hover:text-text-hi-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:border-blue',
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed border-0'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-3 py-[7.5px] text-sm',
  lg: 'px-4 py-3 text-lg'
};

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

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (btnRef.current) {
      const width = btnRef.current.offsetWidth;
      const distance = width + 300;
      btnRef.current.style.setProperty('--move-distance', `${distance}px`);
      const speed = 250;
      const duration = distance / speed;
      btnRef.current.style.setProperty('--move-duration', `${duration}s`);
    }
  }, []);

  const blurClasses = variant === 'primary' ? 'opacity-100' : 'group-hover:opacity-100';

  return (
    <button ref={btnRef} className={twMerge(baseClasses, variants[variant], sizes[size], className)} disabled={isDisabled} {...props}>
      {/* Mask để giới hạn ánh sáng bên trong nút */}
      <span className="absolute inset-0 overflow-hidden rounded-[100px] pointer-events-none">
        <span
          className={twMerge(
            'absolute -bottom-[22px] -top-[22px] -left-[27px] w-[22px] bg-[rgb(255,161,46)] blur-[10px] rotate-[30deg] mix-blend-overlay opacity-0 animate-moveBlur',
            blurClasses
          )}
        />
      </span>

      {iconPosition === 'left' && iconElement}
      <div className="leading-[140%]">{children}</div>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};
