import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../button/Button';
import { motion } from 'framer-motion';
import { itemVariants } from '@/utils/animation';

interface AppCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ icon, title, description, buttonText = 'CÀI ĐẶT', onButtonClick, className }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={twMerge(
        'flex flex-col gap-4  rounded-xl border bg-white dark:bg-bg-secondary-dark border-border-element dark:border-border-element-dark shadow-md p-4 w-full',
        className
      )}
    >
      {/* Icon + button */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10">{icon}</div>
        <Button variant="default" className="px-3 py-[7.5px] h-[32px] text-[12px]" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {/* Title */}
        <div className="text-text-hi dark:text-text-hi-dark font-semibold text-lg font-averta">{title}</div>

        {/* Description */}
        <div className="text-sm text-text-me dark:text-text-me-dark leading-[150%]">{description}</div>
      </div>
    </motion.div>
  );
};
