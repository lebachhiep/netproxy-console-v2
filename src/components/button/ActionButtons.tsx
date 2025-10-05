import React from 'react';
import { DocumentQueue, Globe, Language } from '../icons';

interface ActionButtonsProps {
  onGetProxy?: () => void;
  onExportKey?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onGetProxy, onExportKey }) => {
  return (
    <div className="bg-bg-secondary dark:bg-bg-secondary-dark inline-flex items-center border-2 border-border-element dark:border-border-element-dark p-2 rounded-full shadow-md">
      {/* Nút Get Proxy */}
      <button
        onClick={onGetProxy}
        className="font-bold flex items-center gap-2 px-4 py-2 border-2 border-border-element dark:border-border-element-dark rounded-[100px_0_0_100px] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
      >
        <Globe className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
        Get proxy
      </button>

      {/* Nút Export Key */}
      <button
        onClick={onExportKey}
        className="font-bold flex items-center gap-2 px-4 py-2 border-2 border-border-element dark:border-border-element-dark rounded-[0_100px_100px_0] bg-bg-secondary dark:bg-bg-secondary-dark text-sm text-text-me dark:text-text-me-dark shadow-xs hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark"
      >
        <DocumentQueue className="w-5 h-5 text-text-lo dark:text-text-lo-dark" />
        Export key
      </button>
    </div>
  );
};
