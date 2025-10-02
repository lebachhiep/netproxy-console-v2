import React from 'react';

export interface SwitchProps {
  /**
   * Xác định switch có đang bật (checked) hay không.
   */
  checked: boolean;

  /**
   * Callback được gọi khi trạng thái switch thay đổi.
   * Nhận vào giá trị mới của checked.
   */
  onChange: (checked: boolean) => void;

  /**
   * Kích thước switch: 'sm', 'md', 'lg'.
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Biến thể màu sắc của switch.
   * @default "primary"
   */
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';

  /**
   * Nếu true, switch sẽ bị vô hiệu hóa.
   * @default false
   */
  disabled?: boolean;
}

const sizeMap = {
  sm: { w: 'w-6', h: 'h-2', dot: 'h-3 w-3', translate: 'translate-x-[14px]' },
  md: { w: 'w-8', h: 'h-3', dot: 'h-4 w-4', translate: 'translate-x-[17px]' },
  lg: { w: 'w-16', h: 'h-8', dot: 'h-7 w-7', translate: 'translate-x-[34px]' }
};

// mapping màu cho variant
const variantColors: Record<NonNullable<SwitchProps['variant']>, string> = {
  primary: 'bg-blue',
  success: 'bg-green',
  danger: 'bg-red',
  warning: 'bg-yellow',
  info: 'bg-cyan-500'
};

/**
 * Component Switch
 *
 * Một toggle switch tùy chỉnh với các tính năng:
 * - Hỗ trợ trạng thái checked/unchecked
 * - Hỗ trợ các kích thước: sm, md, lg
 * - Hỗ trợ các variant màu sắc: primary, success, danger, warning, info
 * - Hỗ trợ trạng thái disabled
 *
 * @component
 *
 * @example
 * <Switch
 *   checked={isChecked}
 *   onChange={(val) => setIsChecked(val)}
 *   size="md"
 *   variant="primary"
 * />
 *
 * <Switch
 *   checked={true}
 *   onChange={() => {}}
 *   size="sm"
 *   variant="success"
 *   disabled
 * />
 *
 */
export const Switch: React.FC<SwitchProps> = ({ checked, onChange, size = 'md', variant = 'primary', disabled = false }) => {
  const { w, h, dot, translate } = sizeMap[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex ${h} ${w} items-center rounded-full transition-colors duration-300 
        ${checked ? variantColors[variant] : 'bg-bg-mute dark:bg-bg-mute-dark border-2 border-border dark:border-border-dark'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block ${dot} transform rounded-full shadow-md transition-all duration-300
          ${checked ? translate : '-translate-x-[1px]'} 
          ${checked ? 'bg-white' : 'bg-text-lo dark:bg-text-lo-dark'}
        `}
      />
    </button>
  );
};
