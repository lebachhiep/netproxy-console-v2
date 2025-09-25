import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Icon hiển thị phía sau input.
   */
  icon: React.ReactNode;

  /**
   * ClassName tùy chỉnh cho wrapper.
   */
  wrapperClassName?: string;

  /**
   * ClassName tùy chỉnh cho input.
   */
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, wrapperClassName, inputClassName, ...props }, ref) => {
  return (
    <div
      className={twMerge(
        'flex items-center h-12 bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden',
        'focus-within:border-primary dark:focus-within:border-primary-dark',
        wrapperClassName
      )}
    >
      {/* Input */}
      <input
        ref={ref}
        type="text"
        className={twMerge(
          'flex-1 px-3 h-full text-sm outline-none bg-transparent text-text-hi dark:text-text-hi-dark placeholder:text-text-lo dark:placeholder:text-text-lo-dark',
          inputClassName
        )}
        {...props}
      />

      {/* Icon Right */}
      <button type="button" className="flex items-center justify-center w-12 h-12 transition-colors">
        {icon}
      </button>
    </div>
  );
});

Input.displayName = 'Input';
