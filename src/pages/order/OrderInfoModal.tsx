import { Modal } from '@/components/modal/Modal';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { ChatWarning } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { ProviderInfoContent } from './ProviderInfoContent';
import { RotatingInfoContent } from './RotatingInfoContent';
import Tooltip from '@/components/tooltip/Tooltip';

export const OrderInfoModal = ({ type }: { type: 'provider' | 'rotating' }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Tooltip content={t('tutorials')}>
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
          className="w-10 h-10"
          icon={<ChatWarning className="w-5 h-5" />}
        />
      </Tooltip>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={type === 'provider' ? t('proxyGuide.title') : t('proxyGuide.rotating.title')}
      >
        <div className="h-full flex flex-col overflow-auto text-text-lo dark:text-text-lo-dark">
          <div className="p-6 prose max-w-none">{type === 'provider' ? <ProviderInfoContent /> : <RotatingInfoContent />}</div>
        </div>
      </Modal>
    </>
  );
};
