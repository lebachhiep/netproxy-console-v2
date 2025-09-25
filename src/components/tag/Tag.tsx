import React from 'react';
import clsx from 'clsx';
import { CloseCircleFilled } from '@ant-design/icons';

type TagVariant = 'outline' | 'default' | 'solid' | 'light';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  closable?: boolean;
  onClose?: () => void;
}

const Tag: React.FC<TagProps> = ({ variant = 'default', className, children, closable, onClose, ...props }) => {
  return (
    <span
      {...props}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        {
          // Outline (cam border + chữ cam, bg nhạt)
          'border border-primary text-primary bg-primaryBg': variant === 'outline',

          // Default (border xám, chữ đen, bg trắng)
          'border border-border text-textDark bg-white': variant === 'default',

          // Solid (bg cam, chữ trắng)
          'bg-primary text-white border-0': variant === 'solid',

          // Light (bg cam nhạt, chữ cam)
          'bg-primaryBg text-primary border-0': variant === 'light'
        },
        className
      )}
    >
      {children}
      {closable && (
        <button
          onClick={onClose}
          className={clsx('ml-1 flex items-center justify-center rounded-full focus:outline-none transition', {
            // Nút close trắng khi solid
            'bg-white/20 hover:bg-white/30 text-white w-4 h-4': variant === 'solid',

            // Nút close cam khi outline/light/default
            'hover:bg-black/5 w-4 h-4 text-inherit': variant !== 'solid'
          })}
        >
          <CloseCircleFilled className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Tag;
