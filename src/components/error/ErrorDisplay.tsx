import React from 'react';
import { Button } from '../button/Button';
import { ChatWarning } from '../icons';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * Reusable error display component with retry functionality
 * Shows when API calls fail or network errors occur
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Không thể tải dữ liệu',
  message = 'Vui lòng kiểm tra kết nối mạng và thử lại.',
  onRetry,
  retryText = 'Thử lại'
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
      role="alert"
      aria-live="polite"
    >
      <ChatWarning className="w-16 h-16 text-red dark:text-red-dark mb-4" aria-hidden="true" />
      <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">
        {title}
      </h2>
      <p className="text-text-me dark:text-text-me-dark text-sm mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} aria-label={retryText}>
          {retryText}
        </Button>
      )}
    </div>
  );
};
