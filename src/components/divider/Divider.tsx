import React from 'react';

interface DividerProps {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, orientation = 'horizontal', className = '' }) => {
  if (orientation === 'vertical') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-px h-full bg-gray-300" />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-grow h-[2px] bg-border-element dark:bg-border-element-dark"></div>
      {text && <span className="px-3 text-gray-500 text-sm font-medium whitespace-nowrap">{text}</span>}
      <div className="flex-grow h-[2px] bg-border-element dark:bg-border-element-dark"></div>
    </div>
  );
};
