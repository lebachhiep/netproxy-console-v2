import React, { useState, forwardRef } from 'react';
import { IoEyeOff } from 'react-icons/io5';
import { Eye, EyeOff } from '../icons';
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
   * Label hiển thị phía trên input.
   */
  label?: string;

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
  ({ icon, iconPosition = 'left', type, showPasswordToggle = false, wrapperClassName, label, inputClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1 w-full">
        {/* Label */}
        {label && <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">{label}</label>}
        <div
          className={twMerge(
            'group flex items-center h-12 bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden transition-colors duration-300',
            'focus-within:border-blue dark:focus-within:border-blue-dark hover:border-blue dark:hover:border-blue-dark',
            wrapperClassName
          )}
        >
          {/* Icon Left */}
          {icon && iconPosition === 'left' && (
            <div
              className={twMerge(
                'flex items-center justify-center w-12 h-12 bg-bg-secondary dark:bg-bg-secondary-dark border-r-[2px] border-border-element dark:border-border-dark text-primary dark:text-primary-dark transition-colors',
                'group-focus-within:border-blue dark:group-focus-within:border-blue-dark'
              )}
            >
              {icon}
            </div>
          )}

          <div className="flex-1 px-3 flex items-center justify-between">
            {/* Input */}
            <input
              ref={ref} // <-- thêm ref
              type={inputType}
              className={twMerge(
                'w-full h-5 text-sm outline-none bg-transparent text-text-hi dark:text-text-hi-dark placeholder:text-text-lo dark:placeholder:text-text-lo-dark',
                inputClassName
              )}
              {...props}
            />

            {/* Icon Right */}
            {icon && iconPosition === 'right' && !showPasswordToggle && (
              <div
                className={twMerge(
                  'flex items-center justify-center w-12 h-12 bg-bg-secondary dark:bg-bg-secondary-dark border-l-[2px] border-border-element dark:border-border-dark text-primary dark:text-primary-dark transition-colors',
                  'group-focus-within:border-blue dark:group-focus-within:border-blue-dark'
                )}
              >
                {icon}
              </div>
            )}

            {/* Toggle Password */}
            {showPasswordToggle && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="w-6 h-6 flex items-center text-text-muted dark:text-text-me-dark hover:text-text-hi dark:hover:text-text-hi-dark transition-colors"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
