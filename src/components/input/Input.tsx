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
        'flex items-center h-12 bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden transition-colors duration-300',
        'focus-within:border-blue dark:focus-within:border-blue-dark hover:border-blue dark:hover:border-blue-dark',
        wrapperClassName
      )}
    >
      <div className="flex items-center flex-1 px-3 min-w-0">
        {/* Input */}
        <input
          ref={ref}
          type="text"
          className={twMerge(
            'h-full flex-1 text-sm outline-none bg-transparent text-text-hi dark:text-text-hi-dark placeholder:text-text-lo dark:placeholder:text-text-lo-dark',
            inputClassName
          )}
          {...props}
        />

        {/* Icon Right */}
        <button type="button" className="flex items-center justify-center w-5 h-5 transition-colors">
          {icon}
        </button>
      </div>
    </div>
  );
});

Input.displayName = 'Input';
