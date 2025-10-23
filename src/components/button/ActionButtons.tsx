import React from 'react';
import { DocumentQueue, Globe, Language } from '../icons';
import { useResponsive } from '@/hooks/useResponsive';

interface ActionButtonsProps {
  onGetProxy?: () => void;
  onExportKey?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onGetProxy, onExportKey }) => {
  const { isMobile, isTablet } = useResponsive();
  return (
    <>
      {isMobile || isTablet ? (
        <div className="flex items-center">
          {/* Nút Get Proxy */}
          <button
            onClick={onGetProxy}
            className="font-bold w-full flex items-center justify-center gap-2 px-4 py-[6px] border-2 border-border-element dark:border-border-dark rounded-[8px_0_0_8px] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark dark:border-r-0"
          >
            <Globe className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
            Get proxy
          </button>

          {/* Nút Export Key */}
          <button
            onClick={onExportKey}
            className="font-bold w-full flex items-center justify-center gap-2 px-4 py-[6px] border-2 border-border-element dark:border-border-dark rounded-[0_8px_8px_0] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
          >
            <DocumentQueue className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
            Export key
          </button>
        </div>
      ) : (
        <div className="bg-bg-primary dark:border-transparent dark:pseudo-border-top dark:bg-bg-primary-dark inline-flex items-center border-2 border-border-element dark:border-border-element-dark p-2 rounded-full shadow-md">
          {/* Nút Get Proxy */}
          <button
            onClick={onGetProxy}
            className="font-bold flex items-center gap-2 px-4 py-2 border-2 border-border-element dark:border-transparent dark:pseudo-border-top rounded-[100px_0_0_100px] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
          >
            <Globe className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
            Get proxy
          </button>

          {/* Nút Export Key */}
          <button
            onClick={onExportKey}
            className="font-bold flex items-center gap-2 px-4 py-2 border-2 border-border-element dark:border-transparent dark:pseudo-border-top rounded-[0_100px_100px_0] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
          >
            <DocumentQueue className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
            Export key
          </button>
        </div>
      )}
    </>
  );
};
