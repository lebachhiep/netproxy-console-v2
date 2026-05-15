import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Announcement } from '@/services/announcement/announcement.types';

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Announcement;
  onSelect: (notification: Announcement) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onSelect }) => {
  const isUnread = !notification.read_at;

  return (
    <div
      onClick={() => onSelect(notification)}
      className={`px-4 py-3 border-b border-border-element dark:border-border-element-dark cursor-pointer transition-colors hover:bg-bg-secondary/50 dark:hover:bg-bg-secondary-dark/50 ${
        isUnread ? 'bg-primary-bg dark:bg-primary-bg-dark' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {isUnread && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary dark:bg-primary-dark shrink-0" />}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-hi dark:text-text-hi-dark truncate">{notification.title}</h4>
          <p className="text-xs text-text-me dark:text-text-me-dark mt-0.5 line-clamp-2">{notification.body}</p>
          <p className="text-xs text-text-lo dark:text-text-lo-dark mt-1">{dayjs(notification.created_at).fromNow()}</p>
        </div>
      </div>
    </div>
  );
};
