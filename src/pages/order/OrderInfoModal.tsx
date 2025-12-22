import { Modal } from '@/components/modal/Modal';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { ChatWarning } from '@/components/icons';
import { useTranslation } from 'react-i18next';

export const OrderInfoModal = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
        className="w-10 h-10"
        icon={<ChatWarning className="w-5 h-5" />}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={t('orderInfoModal.title')}>
        {/* Nội dung modal */}
        <div className="h-full flex flex-col overflow-auto text-text-lo dark:text-text-lo-dark">
          <div className="p-6 prose max-w-none">
            <h2>{t('orderInfoModal.title')}</h2>
            <p>{t('orderInfoModal.welcome')}</p>
            <h3>1. {t('orderInfoModal.orderInformation')}</h3>
            <p>{t('orderInfoModal.orderInformationDetail')}</p>
            <h3>2. {t('orderInfoModal.productDetailTitle')}</h3>
            <p>{t('orderInfoModal.productDetails')}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};
