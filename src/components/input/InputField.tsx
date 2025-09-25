import React, { useState, forwardRef } from 'react';
import { IoEyeOff } from 'react-icons/io5';
import { Eye } from '../icons';
import { twMerge } from 'tailwind-merge';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Icon hiển thị trong input (tùy chọn).
   */
  icon?: React.ReactNode;

  /**
   * Vị trí hiển thị icon: 'left' hoặc 'right'.
   * @default "left"
   */
  iconPosition?: 'left' | 'right';

  /**
   * Nếu true và type="password", sẽ hiển thị nút toggle để show/hide mật khẩu.
   * @default false
   */
  showPasswordToggle?: boolean;

  /**
   * ClassName tùy chỉnh cho wrapper bao quanh input.
   */
  wrapperClassName?: string;

  /**
   * ClassName tùy chỉnh cho chính input.
   */
  inputClassName?: string;
}

/**
 * Component InputField
 *
 * Một input field tùy chỉnh với các tính năng:
 * - Icon hiển thị bên trái hoặc bên phải
 * - Toggle hiển thị mật khẩu (show/hide password)
 * - Hỗ trợ ref để thao tác trực tiếp với input
 * - Tùy chỉnh style thông qua className cho wrapper và input
 *
 * @component
 *
 * @example
 * <InputField
 *   type="text"
 *   placeholder="Nhập tên"
 *   icon={<SomeIcon />}
 *   iconPosition="left"
 *   showPasswordToggle={false}
 * />
 *
 * <InputField
 *   type="password"
 *   placeholder="Mật khẩu"
 *   showPasswordToggle={true}
 * />
 *
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon, iconPosition = 'left', type, showPasswordToggle = false, wrapperClassName, inputClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div
        className={twMerge(
          'group flex items-center h-12 bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden',
          'focus-within:border-primary dark:focus-within:border-primary-dark',
          wrapperClassName
        )}
      >
        {/* Icon Left */}
        {icon && iconPosition === 'left' && (
          <div
            className={twMerge(
              'flex items-center justify-center w-12 h-12 bg-bg-secondary dark:bg-bg-secondary-dark border-r-[2px] border-border-element dark:border-border-dark text-primary dark:text-primary-dark transition-colors',
              'group-focus-within:border-primary dark:group-focus-within:border-primary-dark'
            )}
          >
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref} // <-- thêm ref
          type={inputType}
          className={twMerge(
            'flex-1 px-3 h-full text-sm outline-none bg-transparent text-text-hi dark:text-text-hi-dark placeholder:text-text-lo dark:placeholder:text-text-lo-dark',
            inputClassName
          )}
          {...props}
        />

        {/* Icon Right */}
        {icon && iconPosition === 'right' && !showPasswordToggle && (
          <div
            className={twMerge(
              'flex items-center justify-center w-12 h-12 bg-bg-secondary dark:bg-bg-secondary-dark border-l-[2px] border-border-element dark:border-border-dark text-primary dark:text-primary-dark transition-colors',
              'group-focus-within:border-primary dark:group-focus-within:border-primary-dark'
            )}
          >
            {icon}
          </div>
        )}

        {/* Toggle Password */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 flex items-center text-text-muted dark:text-text-muted-dark hover:text-text-hi dark:hover:text-text-hi-dark transition-colors"
          >
            {showPassword ? <IoEyeOff /> : <Eye />}
          </button>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
