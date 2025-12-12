import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/modal/Modal';
import { Tabs } from '@/components/tabs/Tabs';
import { WalletCreditCardOutlined, Globe, DatabaseStackOutlined } from '@/components/icons';
import { usePaymentMethods } from '@/hooks/usePayments';
import TazapayForm from './modal/TazapayForm';
import CryptomusForm from './modal/CryptomusForm';
import Web2MInfo from './modal/Web2MInfo';
import { t } from 'i18next';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  allowCloseByBackdrop?: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="p-5 space-y-4">
    <div className="h-10 bg-bg-mute dark:bg-bg-mute-dark rounded-lg animate-pulse" />
    <div className="h-32 bg-bg-mute dark:bg-bg-mute-dark rounded-lg animate-pulse" />
    <div className="h-10 bg-bg-mute dark:bg-bg-mute-dark rounded-lg animate-pulse" />
  </div>
);

const UnavailableMethod: React.FC = () => (
  <div className="p-8 text-center text-text-lo dark:text-text-lo-dark">Phương thức thanh toán này hiện không khả dụng</div>
);

export const TopUpModal: React.FC<TopUpModalProps> = ({ open, onClose, allowCloseByBackdrop = true }) => {
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const [activeTab, setActiveTab] = useState<string | number>('tazapay');

  // Extract method-specific data
  const tazapay = paymentMethods?.methods.find((m) => m.type === 'tazapay');
  const cryptomus = paymentMethods?.methods.find((m) => m.type === 'cryptomus');
  const web2m = paymentMethods?.methods.find((m) => m.type === 'web2m');

  // Set default tab to first available method
  const defaultTab = useMemo(() => {
    if (tazapay?.available) return 'tazapay';
    if (cryptomus?.available) return 'cryptomus';
    if (web2m?.available) return 'web2m';
    return 'tazapay';
  }, [tazapay, cryptomus, web2m]);

  // Update active tab when default changes
  useEffect(() => {
    if (open && paymentMethods) {
      setActiveTab(defaultTab);
    }
  }, [open, paymentMethods, defaultTab]);

  const tabs = [
    {
      key: 'tazapay',
      label: t('walletAndLabel'),
      icon: <WalletCreditCardOutlined className="w-5 h-5" />
    },
    {
      key: 'cryptomus',
      label: t('crypto'),
      icon: <Globe className="w-5 h-5" />
    },
    {
      key: 'web2m',
      label: t('bank'),
      icon: <DatabaseStackOutlined className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    if (isLoading) {
      return [<LoadingSkeleton key="loading-1" />, <LoadingSkeleton key="loading-2" />, <LoadingSkeleton key="loading-3" />];
    }

    return [
      // Tazapay content
      tazapay?.available ? (
        <TazapayForm key="tazapay" countries={tazapay.supported_countries} onSuccess={onClose} />
      ) : (
        <UnavailableMethod key="tazapay-unavailable" />
      ),
      // Cryptomus content
      cryptomus?.available ? (
        <CryptomusForm key="cryptomus" services={cryptomus.crypto_services} onSuccess={onClose} />
      ) : (
        <UnavailableMethod key="cryptomus-unavailable" />
      ),
      // Web2M content
      web2m?.available && web2m.bank_info ? (
        <Web2MInfo key="web2m" bankInfo={web2m.bank_info} amount={10} />
      ) : (
        <UnavailableMethod key="web2m-unavailable" />
      )
    ];
  };

  return (
    <Modal
      open={open}
      title={t('dashboard.topUp').toUpperCase()}
      onClose={onClose}
      bodyClassName="p-0"
      allowCloseByBackdrop={allowCloseByBackdrop}
    >
      <Tabs
        tabs={tabs}
        type="card"
        activeKey={activeTab}
        onChange={setActiveTab}
        contentCardWrapperClass="overflow-auto max-w-[500px] max-h-[70dvh]"
      >
        {renderContent()}
      </Tabs>
    </Modal>
  );
};

export default TopUpModal;
