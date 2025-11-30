import React, { useEffect, useRef } from 'react';

interface CheckboxProps {
  /**
   * Xác định checkbox có đang được chọn hay không.
   */
  checked: boolean;

  /**
   * Nếu true, checkbox sẽ hiển thị trạng thái một phần (indeterminate).
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Hàm callback được gọi khi giá trị checkbox thay đổi.
   * Nhận vào giá trị mới của checked.
   */
  onChange: (checked: boolean) => void;

  /**
   * Label hiển thị bên cạnh checkbox (tùy chọn).
   */
  label?: string;

  /**
   * Nếu true, checkbox sẽ bị vô hiệu hóa.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Component Checkbox
 *
 * Một checkbox tùy chỉnh hỗ trợ ba trạng thái: checked (đã chọn), unchecked (chưa chọn) và indeterminate (một phần).
 * Hỗ trợ label kèm theo và trạng thái disabled.
 *
 * @component
 *
 * @example
 * <Checkbox
 *   checked={true}
 *   indeterminate={false}
 *   onChange={(checked) => console.log(checked)}
 *   label="Chấp nhận điều khoản"
 *   disabled={false}
 * />
 *
 */
export const Checkbox: React.FC<CheckboxProps> = ({ checked, indeterminate = false, onChange, label, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // cập nhật trạng thái indeterminate cho native input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`flex items-center justify-center gap-2 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        className="peer hidden"
      />

      {/* ô vuông custom */}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors duration-200
          ${checked || indeterminate ? 'bg-blue dark:bg-blue-dark border-blue dark:border-blue-dark' : 'border-border dark:border-border-dark bg-bg-input dark:bg-bg-mute-dark'}
          ${!disabled ? 'peer-hover:border-blue dark:peer-hover:border-blue-dark' : ''}
        `}
      >
        {checked && !indeterminate && (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
        {indeterminate && (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M6 12h12" />
          </svg>
        )}
      </span>

      {label && <span className="text-text-hi dark:text-text-hi-dark">{label}</span>}
    </label>
  );
};
