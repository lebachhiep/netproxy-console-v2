import React from 'react';

export interface RadioProps {
  /**
   * Xác định radio có đang được chọn hay không.
   */
  checked: boolean;

  /**
   * Hàm callback được gọi khi radio được chọn.
   * Nhận vào giá trị mới của checked (luôn là true khi chọn radio này).
   */
  onChange: (checked: boolean) => void;

  /**
   * Label hiển thị bên cạnh radio (tùy chọn).
   */
  label?: string;

  /**
   * Giá trị của radio, dùng khi kết hợp nhiều radio trong một group (tùy chọn).
   */
  value?: string | number;

  /**
   * Biến thể màu sắc của radio.
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

  /**
   * Nếu true, radio sẽ bị vô hiệu hóa.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Component Radio
 *
 * Một radio button tùy chỉnh với các biến thể màu sắc khác nhau.
 * Hỗ trợ trạng thái checked, disabled và hiển thị label.
 * Có thể dùng value để kết hợp trong RadioGroup.
 *
 * @component
 *
 * @example
 * <Radio
 *   checked={true}
 *   onChange={(checked) => console.log(checked)}
 *   label="Lựa chọn A"
 *   variant="primary"
 *   disabled={false}
 *   value="A"
 * />
 *
 */
export const Radio: React.FC<RadioProps> = ({ checked, onChange, label, variant = 'primary', disabled = false, value }) => {
  const colorMap: Record<NonNullable<RadioProps['variant']>, string> = {
    primary: 'border-primary text-primary',
    secondary: 'border-blue text-blue',
    success: 'border-green text-green',
    danger: 'border-red text-red',
    warning: 'border-yellow text-yellow'
  };

  const handleChange = () => {
    if (!disabled) {
      onChange(true); // báo cho parent biết radio này được chọn
    }
  };

  return (
    <label className={`flex items-center gap-2 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input type="radio" value={value} checked={checked} disabled={disabled} onChange={handleChange} className="hidden" />

      {/* vòng tròn custom */}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200
          ${checked ? colorMap[variant] : 'border-border dark:border-border-dark bg-bg-mute dark:bg-bg-mute-dark'}
        `}
      >
        {checked && <span className="h-3 w-3 rounded-full bg-current" />}
      </span>

      {label && (
        <span
          className={`text-sm font-medium leading-[20px] ${
            checked ? 'text-text-hi dark:text-text-hi-dark' : 'text-text-me dark:text-text-me-dark'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};
