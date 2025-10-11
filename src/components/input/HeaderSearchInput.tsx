import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowEnter, SlashForward } from '../icons';

interface HeaderSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * ClassName tùy chỉnh cho wrapper bao quanh input.
   */
  wrapperClassName?: string;

  /**
   * ClassName tùy chỉnh cho chính input.
   */
  inputClassName?: string;

  onEnter?: (value: string) => void;
}

export const HeaderSearchInput = forwardRef<HTMLInputElement, HeaderSearchInputProps>(
  ({ wrapperClassName, inputClassName, onEnter, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnter) {
        onEnter(e.currentTarget.value);
      }
    };

    return (
      <div
        className={twMerge(
          'group flex items-center h-12 bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden transition-colors duration-300',
          'focus-within:border-blue dark:focus-within:border-blue-dark hover:border-blue dark:hover:border-blue-dark',
          wrapperClassName
        )}
      >
        <div className="px-4 flex items-center flex-1 min-w-0">
          <div className={twMerge('md:flex hidden items-center justify-center mr-1')}>
            <SlashForward className="text-primary dark:text-primary-dark animate-fade-pulse" />
          </div>

          {/* Input */}
          <input
            ref={ref}
            type="text"
            onKeyDown={handleKeyDown}
            className={twMerge(
              'h-full w-full text-sm outline-none bg-transparent text-text-hi dark:text-text-hi-dark placeholder:text-text-lo dark:placeholder:text-text-lo-dark',
              inputClassName
            )}
            {...props}
          />
        </div>
        {/* Icon Right */}
        <button
          type="button"
          onClick={() => onEnter?.(props.value as string)}
          className={twMerge(
            'flex items-center justify-center w-12 h-12 bg-bg-secondary dark:bg-bg-secondary-dark border-l-[2px] border-border-element dark:border-border-dark text-primary dark:text-primary-dark transition-colors duration-300'
            // 'group-focus-within:border-blue dark:group-focus-within:border-blue-dark'
          )}
        >
          <ArrowEnter className="text-text-lo" />
        </button>
      </div>
    );
  }
);

HeaderSearchInput.displayName = 'HeaderSearchInput';
