import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../button/Button';

interface SubInfo {
  label: string;
  value: string | number | React.ReactNode;
  highlight?: boolean;
}

interface OverViewCardProps {
  icon?: React.ReactNode;
  title: string;
  mainContent: string | number | React.ReactNode;
  subInfo?: SubInfo[];
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const OverViewCard: React.FC<OverViewCardProps> = ({
  icon,
  title,
  mainContent,
  subInfo = [],
  buttonText,
  onButtonClick,
  className
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-1 justify-between rounded-xl border-2 bg-bg-primary dark:bg-bg-primary-dark border-border dark:border-transparent dark:pseudo-border-top shadow-md p-2 lg:h-[226px] h-full',
        className
      )}
    >
      {/* Header */}
      <div className="md:px-3 md:py-1 mb-3 md:mb-0">
        <span className="text-text-hi dark:text-text-hi-dark font-medium">{title}</span>
      </div>

      <div className="md:p-3 gap-2 flex flex-col rounded-[4px] flex-1 justify-between md:border md:border-dashed border-border dark:border-border-dark">
        <div className="flex items-center justify-between">
          {icon && icon}
          {buttonText && (
            <Button variant="default" className="px-3 py-[7.5px] h-[32px] hidden lg:flex" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div>{mainContent}</div>
          </div>
        </div>
      </div>

      {/* Sub Info */}
      {subInfo.length > 0 && (
        <div
          className="grid gap-2 md:mt-1"
          style={{
            gridTemplateColumns: `248px repeat(${subInfo.length - 1}, minmax(0, 1fr))`
          }}
        >
          {subInfo.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-col justify-between text-sm rounded-[4px] bg-bg-mute dark:bg-bg-mute-dark px-3 py-2 my-1 md:my-0"
            >
              <span className="text-text-me dark:text-text-me-dark">{item.label}</span>
              <div className="font-semibold text-text-hi dark:text-text-hi-dark capitalize">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {buttonText && (
        <Button variant="default" className="px-3 rounded-[4px] py-[7.5px] h-[32px] flex lg:hidden" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};
