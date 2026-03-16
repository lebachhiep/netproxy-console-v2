import React, { useState, useRef } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useAnnouncementUnreadCount } from '@/hooks/useAnnouncements';
import { useClickOutside } from '@/hooks/useClickOutside';
import { NotificationPanel } from './NotificationPanel';

export const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const [panelOpen, setPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useAnnouncementUnreadCount();
  const unreadCount = data?.unread_count || 0;

  useClickOutside(containerRef, () => setPanelOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="w-10 h-10 shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark rounded-full flex items-center justify-center border-2 border-border-element dark:border-border-element-dark transition-colors duration-300 group hover:border-blue dark:hover:border-transparent relative"
        aria-label={t('notifications.title')}
      >
        <IoNotificationsOutline className="w-5 h-5 text-text-me dark:text-text-lo-dark group-hover:text-text-hi dark:group-hover:text-text-hi-dark transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-red dark:bg-red-dark text-white text-[10px] font-semibold px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
    </div>
  );
};
