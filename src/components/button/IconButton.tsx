import clsx from 'clsx';
import React, { cloneElement, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon hiển thị trong nút.
   */
  icon: React.ReactNode;

  /**
   * Nếu true, nút sẽ hiển thị trạng thái active.
   * @default false
   */
  active?: boolean;

  /**
   * Màu icon khi hover button
   * @default 'text-text-hi'
   */
  hoverIconColor?: string;

  iconClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
}

/**
 * Component IconButton
 *
 * Nút dạng icon tròn, hỗ trợ hover đổi màu icon, active, disabled.
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  active = false,
  className,
  iconClassName,
  disabled,
  hoverIconColor = 'text-text-hi',
  ...rest
}) => {
  const baseClasses =
    'w-12 h-12 shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark rounded-full flex items-center justify-center border-2 transition-colors duration-300 group hover:border-blue dark:hover:border-transparent';

  const activeClasses = active ? 'text-primary' : 'border-border dark:border-transparent dark:pseudo-border-top';

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500';

  // Type assertion để fix lỗi TypeScript
  const iconWithHover = isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<any>, {
        className: twMerge(
          clsx(
            'text-text-me dark:text-text-lo-dark',
            (icon as React.ReactElement<any>).props.className,
            !disabled ? `group-hover:${hoverIconColor} group-hover:dark:${hoverIconColor}-dark transition-colors duration-300` : '',
            iconClassName
          )
        )
      })
    : icon;

  return (
    <button
      disabled={disabled}
      className={twMerge(clsx(baseClasses, activeClasses, disabled ? disabledClasses : 'cursor-pointer', className))}
      {...rest}
    >
      {iconWithHover}
    </button>
  );
};

export default IconButton;
