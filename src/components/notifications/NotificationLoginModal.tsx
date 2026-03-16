import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/modal/Modal';
import { useAnnouncementModal, useDismissAnnouncement } from '@/hooks/useAnnouncements';

const DISMISSED_KEY = 'static-notif-dismissed';

export const NotificationLoginModal: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useAnnouncementModal();
  const dismissMutation = useDismissAnnouncement();
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const notification = data?.notification;

  useEffect(() => {
    if (notification) {
      const dismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (dismissed !== notification.id) {
        setOpen(true);
      }
    }
  }, [notification]);

  const handleClose = () => {
    if (notification) {
      sessionStorage.setItem(DISMISSED_KEY, notification.id);
      if (dontShowAgain) {
        dismissMutation.mutate(notification.id);
      }
    }
    setOpen(false);
  };

  if (!notification) return null;

  return (
    <Modal
      open={open}
      title={notification.title}
      onClose={handleClose}
      actions={[
        <button
          key="close"
          onClick={handleClose}
          className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t('close')}
        </button>
      ]}
    >
      <div className="p-5">
        <p className="text-sm text-text-me dark:text-text-me-dark whitespace-pre-wrap leading-relaxed">{notification.body}</p>
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded border-border-element dark:border-border-element-dark accent-primary"
          />
          <span className="text-xs text-text-lo dark:text-text-lo-dark">{t('notifications.dontShowAgain')}</span>
        </label>
      </div>
    </Modal>
  );
};
