import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { twMerge } from 'tailwind-merge';

interface OTPInputProps {
  /**
   * Number of OTP digits
   * @default 6
   */
  length?: number;

  /**
   * Current OTP value
   */
  value: string;

  /**
   * Callback when OTP value changes
   */
  onChange: (value: string) => void;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input has an error
   * @default false
   */
  error?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Label text above the input
   */
  label?: string;
}

export interface OTPInputRef {
  focus: () => void;
  clear: () => void;
}

/**
 * OTPInput Component
 *
 * A component for entering OTP (One-Time Password) codes with individual input boxes.
 * Features:
 * - Auto-focus to next input on digit entry
 * - Backspace moves to previous input
 * - Paste support (paste full OTP code)
 * - Numeric-only validation
 * - Error state styling
 * - Disabled state support
 */
export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  ({ length = 6, value, onChange, disabled = false, error = false, className, label }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRefs.current[0]?.focus();
      },
      clear: () => {
        onChange('');
        inputRefs.current[0]?.focus();
      }
    }));

    // Focus first empty input on mount
    useEffect(() => {
      const firstEmptyIndex = value.length < length ? value.length : 0;
      inputRefs.current[firstEmptyIndex]?.focus();
    }, []);

    const handleChange = (index: number, digit: string) => {
      // Only allow digits
      if (!/^\d*$/.test(digit)) return;

      const newValue = value.split('');
      newValue[index] = digit.slice(-1); // Take only last character
      const newOTP = newValue.join('').slice(0, length);
      onChange(newOTP);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle backspace
      if (e.key === 'Backspace') {
        if (!value[index] && index > 0) {
          // If current is empty and not first, go to previous
          inputRefs.current[index - 1]?.focus();
        } else if (value[index]) {
          // If current has value, clear it
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        }
      }

      // Handle arrow keys
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pastedData) {
        onChange(pastedData);
        // Focus the next empty input or last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      }
    };

    const handleFocus = (index: number) => {
      // Select the content when focused
      inputRefs.current[index]?.select();
    };

    return (
      <div className={twMerge('flex flex-col gap-2', className)}>
        {label && <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">{label}</label>}
        <div className="flex gap-2 justify-center">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              className={twMerge(
                'w-12 h-14 text-center text-xl font-semibold rounded-lg border-2',
                'bg-bg-input dark:bg-bg-input-dark',
                'text-text-hi dark:text-text-hi-dark',
                'border-border-element dark:border-border-dark',
                'focus:border-blue dark:focus:border-blue-dark',
                'focus:outline-none transition-colors duration-200',
                error && 'border-red dark:border-red',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput';
