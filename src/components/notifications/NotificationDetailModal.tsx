import React from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Modal } from '@/components/modal/Modal';
import type { Announcement } from '@/services/announcement/announcement.types';

dayjs.extend(relativeTime);

interface NotificationDetailModalProps {
  notification: Announcement | null;
  onClose: () => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return createPortal(
    <Modal open={true} title={notification.title} onClose={onClose}>
      <div className="p-5">
        <p className="text-sm text-text-me dark:text-text-me-dark whitespace-pre-wrap leading-relaxed">{notification.body}</p>
        <p className="text-xs text-text-lo dark:text-text-lo-dark mt-4">{dayjs(notification.created_at).fromNow()}</p>
      </div>
    </Modal>,
    document.body
  );
};
