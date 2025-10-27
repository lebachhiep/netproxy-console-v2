import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

interface TagOption {
  /**
   * Giá trị của tag.
   */
  value: string;

  /**
   * Label hiển thị cho tag, có thể là text hoặc component.
   */
  label: React.ReactNode;

  /**
   * Icon hiển thị bên cạnh label (tùy chọn).
   */
  icon?: React.ReactNode;

  /**
   * Class màu chữ cho label (Tailwind class).
   */
  labelColor?: string;

  /**
   * Badge hiển thị ở cuối option (tùy chọn).
   */
  badge?: React.ReactNode;

  /**
   * Class màu nền cho badge (Tailwind class).
   */
  badgeBg?: string;

  /**
   * Class màu chữ cho badge (Tailwind class).
   */
  badgeColor?: string;

  /**
   * Class border cho badge (Tailwind class).
   */
  badgeBorder?: string;
}

interface SelectTagProps {
  /**
   * Danh sách các option tag.
   */
  options: TagOption[];

  /**
   * Giá trị được chọn (controlled).
   */
  value?: string;

  /**
   * Giá trị mặc định khi uncontrolled.
   */
  defaultValue?: string;

  /**
   * Placeholder khi chưa chọn giá trị.
   */
  placeholder?: string;

  /**
   * ClassName tùy chỉnh cho wrapper.
   */
  className?: string;

  /**
   * Callback được gọi khi người dùng chọn tag.
   */
  onChange?: (value: string) => void;
}

/**
 * Component SelectTag
 *
 * Một dropdown select dạng tag với các tính năng:
 * - Hỗ trợ controlled và uncontrolled value
 * - Hiển thị placeholder khi chưa chọn
 * - Mỗi option có thể có icon, badge, màu label
 * - Click outside để đóng dropdown
 *
 * @component
 *
 * @example
 * const options = [
 *   { value: '1', label: 'Tag 1', icon: <SomeIcon />, badge: '3', badgeBg: 'bg-red-200', badgeColor: 'text-red-600' },
 *   { value: '2', label: 'Tag 2' },
 * ];
 *
 * <SelectTag
 *   options={options}
 *   value={selectedValue}
 *   onChange={(val) => setSelectedValue(val)}
 *   placeholder="Chọn tag"
 * />
 *
 * <SelectTag
 *   options={options}
 *   defaultValue="1"
 *   placeholder="Chọn tag"
 * />
 *
 */
export const SelectTag: React.FC<SelectTagProps> = ({ options, value, defaultValue, placeholder = 'Chọn', className, onChange }) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selected = options.find((o) => o.value === selectedValue) || null;

  const handleSelect = (opt: TagOption) => {
    if (!isControlled) {
      setInternalValue(opt.value);
    }
    setOpen(false);
    onChange?.(opt.value);
  };

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={twMerge('relative w-56')}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={twMerge(
          'shadow-xs transition-all duration-300 flex items-center justify-between w-full px-3 border-2 rounded-lg bg-secondary dark:bg-bg-secondary-dark text-sm h-12',
          open
            ? 'border-primary dark:border-primary-dark'
            : 'border-border-element dark:border-border-element-dark hover:bg-bg-input hover:dark:bg-bg-input-dark hover:font-bold hover:text-text-hi hover:dark:text-text-hi-dark',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <div className="text-text-hi dark:text-text-hi-dark">{selected.label}</div>
          ) : (
            <span className="text-text-me dark:text-text-me-dark">{placeholder}</span>
          )}
        </div>
        <FiChevronDown className={twMerge('transition-transform text-text-me dark:text-text-me-dark', open ? 'rotate-180' : 'rotate-0')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="p-1 absolute top-full mt-1 w-full bg-bg-secondary dark:bg-bg-secondary-dark border border-border-element dark:border-border-element-dark rounded-lg shadow-md z-[101]">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={twMerge(
                'transition-all duration-300 rounded-lg px-3 py-2 cursor-pointer text-sm flex items-center justify-between hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark hover:font-bold',
                selected?.value === opt.value && 'bg-bg-hover-gray dark:bg-bg-hover-gray-dark font-bold'
              )}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span className={opt.labelColor}>{opt.label}</span>
              </div>
              {opt.badge && (
                <div
                  className={twMerge(
                    'text-xs w-6 flex items-center justify-center h-6 rounded-full font-medium',
                    opt.badgeBg ?? 'bg-gray-100',
                    opt.badgeColor ?? 'text-gray-600',
                    opt.badgeBorder ?? 'border border-gray-300'
                  )}
                >
                  {opt.badge}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
