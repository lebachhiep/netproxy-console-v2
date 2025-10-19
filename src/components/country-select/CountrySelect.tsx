import React, { useEffect, useRef, useState } from 'react';

interface Option {
  value: string | number;
  label: React.ReactNode;
  flag?: string;
}

interface CountrySelectProps {
  options: Option[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  className?: string;
  onChange?: (value: string | number) => void;
  placement?: 'top' | 'bottom';
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder = 'Chọn quốc gia',
  label,
  className = '',
  onChange,
  placement = 'bottom'
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === selectedValue) || null;

  const handleSelect = (opt: Option) => {
    if (!isControlled) {
      setInternalValue(opt.value);
    }
    setOpen(false);
    onChange?.(opt.value);
  };

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

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">{label}</label>}

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`group flex items-center bg-bg-input dark:bg-bg-input-dark border-2 rounded-lg overflow-hidden transition-colors duration-300 h-10 w-full ${
            open
              ? 'border-blue dark:border-blue-dark'
              : 'border-border-element dark:border-border-dark hover:border-blue dark:hover:border-blue-dark'
          }`}
        >
          <div className="flex-1 px-3 flex items-center justify-between">
            {selectedOption ? (
              <div className="flex items-center gap-2 h-5 text-sm text-text-hi dark:text-text-hi-dark">{selectedOption.label}</div>
            ) : (
              <span className="h-5 text-sm text-text-lo dark:text-text-lo-dark">{placeholder}</span>
            )}
            {/* <ChevronDown
              className={`w-4 h-4 text-text-lo dark:text-text-lo-dark transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
            /> */}
          </div>
        </button>

        {open && (
          <div
            className={`absolute w-full bg-bg-secondary dark:bg-bg-secondary-dark border border-border-element dark:border-border-element-dark rounded-lg shadow-md z-50 p-1 max-h-60 overflow-y-auto ${
              placement === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
            }`}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`text-text-hi dark:text-text-hi-dark transition-all duration-300 rounded-lg font-medium px-3 py-2 cursor-pointer text-sm hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark hover:font-bold ${
                  selectedOption?.value === opt.value && 'bg-bg-hover-gray dark:bg-bg-hover-gray-dark font-bold'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
