import { Button } from '@/components/button/Button';
import { Modal } from '@/components/modal/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ApiKeyConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ApiKeyConfirmModal: React.FC<ApiKeyConfirmModalProps> = ({ open, onClose, onConfirm, isLoading = false }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('apiKey.confirmTitle') || 'Xác nhận tạo API Key'}
      open={open}
      onClose={onClose}
      className="max-w-[558px] rounded-xl"
      bodyClassName="p-5"
      cancelButton={
        <Button variant="outlined" className="h-10 px-4" onClick={onClose} disabled={isLoading}>
          {t('cancel') || 'Hủy'}
        </Button>
      }
      actions={[
        <Button key="confirm" variant="primary" className="h-10 px-4" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? t('form.loading') || 'Đang xử lý...' : t('confirm') || 'Xác nhận'}
        </Button>
      ]}
    >
      <div className="text-text-hi dark:text-text-hi-dark">
        <p className="mb-2">{t('apiKey.confirmMessage') || 'Bạn có chắc chắn muốn tạo API Key mới?'}</p>
        <p className="text-sm text-text-me dark:text-text-me-dark">
          {t('apiKey.confirmWarning') || 'Nếu bạn đã có API Key, key cũ sẽ bị vô hiệu hóa và không thể sử dụng được nữa.'}
        </p>
      </div>
    </Modal>
  );
};
