import React from 'react';

interface SectionTitleProps {
  text: string;
  className?: string;
  icon?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ text, className, icon }) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {/* Text */}
      <p className="text-text-hi dark:text-text-hi-dark text-sm tracking-[0.52px] font-ibm-plex-mono uppercase">{text}</p>

      {/* Line */}
      <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1"></div>

      {/* Icon (ở cuối) */}
      {icon && <span className="inline-flex">{icon}</span>}
    </div>
  );
};
