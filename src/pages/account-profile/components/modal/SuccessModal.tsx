import { Button } from '@/components/button/Button';
import { SignOut } from '@/components/icons';
import { Modal } from '@/components/modal/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t('resetPasswordPage.alertResetSuccess')}
      open={open}
      onClose={onClose}
      className="max-w-[558px] rounded-xl"
      bodyClassName="p-5"
      headerClassName="justify-center"
      footerClassName="justify-center"
      closeButtonClassName="hidden"
      actions={[
        <div className="flex items-center justify-center" key={'login'}>
          <Button variant="primary" className="h-10 mb-1 px-4 capitalized" icon={<SignOut />} onClick={onConfirm}>
            {t('loginAgain')}
          </Button>
        </div>
      ]}
    >
      <div className="text-center">
        <p className="text-base text-text-hi dark:text-text-hi-dark">{t('resetPasswordComplete')}</p>
      </div>
    </Modal>
  );
};
