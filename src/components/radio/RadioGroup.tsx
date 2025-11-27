import React from 'react';
import { Radio, RadioProps } from './Radio';
import clsx from 'clsx';

export interface RadioOption {
  /**
   * Key duy nhất cho option, dùng khi render list.
   */
  key: string;

  /**
   * Label hiển thị cho radio.
   */
  label: string;

  /**
   * Giá trị của radio option.
   */
  value: string | number;

  /**
   * Biến thể màu sắc của radio (tham chiếu từ RadioProps).
   */
  variant?: RadioProps['variant'];

  /**
   * Nếu true, radio option sẽ bị vô hiệu hóa.
   */
  disabled?: boolean;
}

interface RadioGroupProps {
  /**
   * Giá trị hiện tại được chọn trong nhóm radio.
   */
  value: string | number;

  /**
   * Hàm callback được gọi khi người dùng chọn một radio khác.
   * Nhận vào giá trị của radio được chọn.
   */
  onChange: (value: string | number) => void;

  /**
   * Danh sách các lựa chọn radio.
   */
  options: RadioOption[];

  /**
   * Hướng hiển thị của các radio: 'row' (hàng) hoặc 'col' (cột).
   * @default "row"
   */
  direction?: 'row' | 'col';

  className?: string;
}

/**
 * Component RadioGroup
 *
 * Nhóm các radio button, cho phép chọn một trong nhiều lựa chọn.
 * Hỗ trợ hiển thị theo hàng (row) hoặc cột (col) và nhận các tùy chọn từ props.
 *
 * @component
 *
 * @example
 * <RadioGroup
 *   value="A"
 *   onChange={(value) => console.log(value)}
 *   direction="row"
 *   options={[
 *     { key: '1', label: 'Lựa chọn A', value: 'A', variant: 'primary' },
 *     { key: '2', label: 'Lựa chọn B', value: 'B', variant: 'success', disabled: true },
 *   ]}
 * />
 *
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onChange, options, direction = 'row', className }) => {
  return (
    <div className={clsx(`flex ${direction === 'col' ? 'flex-col gap-2' : 'flex-row gap-5'}`, className)}>
      {options.map((opt) => (
        <Radio
          key={opt.key}
          label={opt.label}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          variant={opt.variant}
          disabled={opt.disabled}
          value={opt.value}
        />
      ))}
    </div>
  );
};
