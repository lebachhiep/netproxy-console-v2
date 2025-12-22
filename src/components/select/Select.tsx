import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

interface Option {
  /**
   * Giá trị của option.
   */
  value: string | number;

  /**
   * Label hiển thị cho option, có thể là text hoặc component.
   */
  label: React.ReactNode;
}

interface SelectProps {
  optionClassName?: string;
  /**
   * Danh sách các option để hiển thị.
   */
  options: Option[];

  /**
   * Giá trị được chọn (controlled value).
   */
  value?: string | number;

  /**
   * Giá trị mặc định khi uncontrolled.
   */
  defaultValue?: string | number;

  /**
   * Placeholder khi chưa chọn giá trị.
   */
  placeholder?: string;

  /**
   * ClassName tùy chỉnh cho wrapper.
   */
  className?: string;
  /**
   * ClassName tùy chỉnh cho label.
   */
  labelClassName?: string;

  /**
   * Callback được gọi khi người dùng chọn option.
   */
  onChange?: (value: string | number, label: React.ReactNode) => void;

  /**
   * Vị trí hiển thị dropdown: 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'.
   * @default "bottom"
   */
  placement?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Component Select
 *
 * Một dropdown select tùy chỉnh với các tính năng:
 * - Hỗ trợ controlled và uncontrolled value
 * - Hiển thị placeholder khi chưa chọn
 * - Hỗ trợ click outside để đóng dropdown
 * - Tùy chỉnh vị trí hiển thị: 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 *
 * @component
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder = 'Chọn',
  className,
  labelClassName,
  onChange,
  placement = 'bottom',
  optionClassName
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  // Only handle 'top' or 'bottom' for auto placement
  const [autoPlacement, setAutoPlacement] = useState<'top' | 'bottom'>(placement === 'top' ? 'top' : 'bottom');
  const ref = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === selectedValue) || null;

  const handleSelect = (opt: Option) => {
    if (!isControlled) {
      setInternalValue(opt.value);
    }
    setOpen(false);
    onChange?.(opt.value, opt.label);
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
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = Math.min(options.length * 40, 300); // estimate or measure
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setAutoPlacement('top');
    } else {
      setAutoPlacement('bottom');
    }
  }, [open, options.length]);

  // Determine position classes based on placement
  const getPositionClasses = () => {
    // Only use autoPlacement for 'top'/'bottom', fallback to original for others
    if (placement === 'top' || placement === 'bottom') {
      switch (autoPlacement) {
        case 'top':
          return 'bottom-full mb-1 left-0 right-0';
        case 'bottom':
        default:
          return 'top-full mt-1 left-0 right-0';
      }
    }
    // Fallback for left/right placements
    switch (placement) {
      case 'top-left':
        return 'bottom-full mb-1 right-0';
      case 'top-right':
        return 'bottom-full mb-1 left-0';
      case 'bottom-left':
        return 'top-full mt-1 right-0';
      case 'bottom-right':
        return 'top-full mt-1 left-0';
      default:
        return 'top-full mt-1 left-0 right-0';
    }
  };

  return (
    <div ref={ref} className={twMerge('relative')}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={twMerge(
          'shadow-xs transition-all duration-300 flex items-center gap-1 justify-between w-full h-12 px-3 border-2 rounded-lg bg-bg-secondary dark:bg-bg-primary-dark text-sm dark:text-text-me-dark',
          open
            ? 'border-primary dark:border-primary-dark'
            : 'border-border-element dark:border-border-element-dark hover:bg-bg-input hover:dark:bg-bg-input-dark hover:font-bold hover:text-text-hi hover:dark:text-text-hi-dark hover:border-blue dark:hover:border-transparent',
          className
        )}
      >
        <div className="flex items-center gap-2 w-full">
          {selectedOption ? (
            <div className={twMerge('text-text-hi dark:text-text-me-dark font-bold w-full', labelClassName)}>{selectedOption.label}</div>
          ) : (
            <span className="text-text-me dark:text-text-me-dark">{placeholder}</span>
          )}
        </div>
        <FiChevronDown className={twMerge('transition-transform text-text-me dark:text-text-me-dark', open ? 'rotate-180' : 'rotate-0')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={twMerge(
            'p-1 absolute bg-bg-secondary dark:bg-bg-secondary-dark border border-border-element dark:border-border-element-dark rounded-lg shadow-md z-[101] transition-all duration-300 ease-out overflow-y-auto flex flex-col gap-1',
            getPositionClasses(),
            open ? 'opacity-100 max-h-60 translate-y-0 pointer-events-auto' : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none',
            // Add width constraint for corner placements
            placement.includes('left') || placement.includes('right') ? 'w-auto min-w-full' : 'w-full',
            optionClassName
          )}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={twMerge(
                clsx(
                  'text-text-hi dark:text-text-me-dark transition-all duration-300 rounded-lg font-medium px-3 py-2 cursor-pointer text-sm hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark hover:font-bold whitespace-nowrap',
                  selectedOption?.value === opt.value && 'bg-bg-hover-gray dark:bg-bg-hover-gray-dark font-bold'
                )
              )}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
