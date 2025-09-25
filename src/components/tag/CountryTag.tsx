import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
import { XCircle } from '../icons';

interface CountryTagProps {
  name: string;
  flagUrl: string;
  removable?: boolean;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void; // thêm prop này
  className?: string;
}

export const CountryTag: React.FC<CountryTagProps> = ({
  name,
  flagUrl,
  removable = false,
  active = false,
  onRemove,
  onClick,
  className
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex shadow-xs text-sm items-center gap-2 px-2 py-1.5 rounded-full border-[1.5px] cursor-pointer transition
        ${active ? 'bg-primary dark:bg-primary-dark text-white border-primary-border dark:border-primary-border-dark font-bold' : 'bg-bg-primary dark:bg-bg-primary-dark text-text-me dark:text-text-me-dark font-medium border-border-element dark:border-border-element-dark hover:bg-gray-200'}
        ${className || ''}
      `}
    >
      <img src={flagUrl} alt={name} className="w-4 h-4 rounded-full object-cover" />
      <span className="">{name}</span>
      {removable && active && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // chặn trigger onClick bên ngoài
            onRemove?.();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/30"
        >
          <XCircle className="text-white" />
        </button>
      )}
    </div>
  );
};
