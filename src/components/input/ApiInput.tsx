import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ApiInputAction {
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ApiInputProps {
  label?: string;
  value: string;
  actions?: ApiInputAction[];
  className?: string;
}

export const ApiInput: React.FC<ApiInputProps> = ({ label = 'API: ', value, actions = [], className }) => {
  return (
    <div
      className={twMerge(
        'flex items-center h-10 w-full bg-bg-input dark:bg-bg-input-dark border-2 border-border-element dark:border-border-dark rounded-lg overflow-hidden',
        className
      )}
    >
      <div className="px-4 flex-1 flex items-center gap-1 min-w-0">
        {/* Label */}
        <span className="text-sm text-text-hi font-bold dark:text-text-hi-dark whitespace-nowrap">{label}</span>

        {/* Value */}
        <span className="flex-1 min-w-0 text-sm line-clamp-1 text-text-lo dark:text-text-lo-dark w-full whitespace-nowrap truncate">
          {value}
        </span>
      </div>
      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex items-center">
          {actions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              className="flex items-center border-l-2 border-border-element dark:border-border-element-dark justify-center w-10 h-10 hover:bg-bg-hover"
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
