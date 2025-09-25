import { clsx } from 'clsx';
import type React from 'react';

export type StatusColor = 'green' | 'gray' | 'yellow' | 'blue' | 'red';
export type StatusSize = 'sm' | 'md' | 'lg';
export type StatusVariant = 'solid' | 'filled';

interface BadgeProps {
  children: React.ReactNode;
  color?: StatusColor;
  size?: StatusSize;
  variant?: StatusVariant;
  className?: string;
}

const solidVariants: Record<StatusColor, string> = {
  green: 'bg-green-bg dark:bg-green-bg-dark text-green dark:text-green-dark border-transparent',
  gray: 'bg-bg-mute dark:bg-bg-mute-dark text-text-me dark:text-text-me-dark border-transparent',
  yellow: 'bg-yellow-bg dark:bg-yellow-bg-dark text-yellow border-transparent',
  blue: 'bg-blue-bg dark:bg-blue-bg-dark text-blue dark:text-blue-dark border-transparent',
  red: 'bg-red-bg dark:bg-red-bg-dark text-red dark:text-red-dark border-transparent'
};

const filledVariants: Record<StatusColor, string> = {
  green: 'bg-green text-white border-transparent',
  gray: 'bg-text-lo text-white border-transparent',
  yellow: 'bg-yellow text-white border-transparent',
  blue: 'bg-blue text-white border-transparent',
  red: 'bg-red text-white border-transparent'
};

const sizes: Record<StatusSize, string> = {
  sm: 'px-2 py-[2px] text-xs leading-[150%]',
  md: 'px-2 py-[2px] text-sm leading-[150%]',
  lg: 'px-4 py-2 text-base'
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', size = 'md', variant = 'solid', className }) => {
  const styleClass = variant === 'filled' ? filledVariants[color] : solidVariants[color];

  return (
    <span
      className={clsx(
        'inline-flex h-6 w-fit font-bold items-center justify-center rounded-full border-2 transition-colors',
        styleClass,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
