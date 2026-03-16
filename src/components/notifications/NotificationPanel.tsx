import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncementList } from '@/hooks/useAnnouncements';
import { NotificationItem } from './NotificationItem';
import './notifications.scss';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useAnnouncementList();

  const notifications = data?.items || [];

  return (
    <div className="notification-panel absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-primary dark:bg-bg-primary-dark rounded-xl border-2 border-border-element dark:border-border-element-dark shadow-lg z-50 animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-border-element dark:border-border-element-dark">
        <h3 className="text-base font-semibold text-text-hi dark:text-text-hi-dark font-averta">{t('notifications.title')}</h3>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-fade-pulse space-y-2">
                <div className="h-4 bg-bg-secondary dark:bg-bg-secondary-dark rounded w-3/4" />
                <div className="h-3 bg-bg-secondary dark:bg-bg-secondary-dark rounded w-full" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-text-lo dark:text-text-lo-dark">{t('notifications.empty')}</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
