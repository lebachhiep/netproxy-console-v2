import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/modal/Modal';
import { Tabs } from '@/components/tabs/Tabs';
import { WalletCreditCardOutlined, Globe, DatabaseStackOutlined } from '@/components/icons';
import { usePaymentMethods } from '@/hooks/usePayments';
import TazapayForm from './modal/TazapayForm';
import CryptomusForm from './modal/CryptomusForm';
import Web2MInfo from './modal/Web2MInfo';
import { useTranslation } from 'react-i18next';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  paymentMethod?: 'tazapay' | 'cryptomus' | 'web2m';
  amount?: number;
  country?: string;
  bankInfo?: any;
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

export const TopUpModalV2: React.FC<TopUpModalProps> = ({ open, onClose, paymentMethod, amount, country }) => {
  const { t } = useTranslation();
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

  // Update active tab when default changes, only if paymentMethod is not set
  useEffect(() => {
    if (open && paymentMethods && !paymentMethod) {
      setActiveTab(defaultTab);
    }
  }, [open, paymentMethods, defaultTab, paymentMethod]);

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

  // Render content for a specific method
  const renderMethodContent = (method: 'tazapay' | 'cryptomus' | 'web2m') => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (method === 'tazapay') {
      return tazapay?.available ? (
        <TazapayForm key="tazapay" countries={tazapay.supported_countries} onSuccess={onClose} amount={amount} country={country} />
      ) : (
        <UnavailableMethod key="tazapay-unavailable" />
      );
    }
    if (method === 'cryptomus') {
      return cryptomus?.available ? (
        <CryptomusForm key="cryptomus" services={cryptomus.crypto_services} onSuccess={onClose} amount={amount || 10} />
      ) : (
        <UnavailableMethod key="cryptomus-unavailable" />
      );
    }
    if (method === 'web2m') {
      return web2m?.available && web2m.bank_info ? (
        <Web2MInfo key="web2m" bankInfo={web2m.bank_info} amount={amount || 10} />
      ) : (
        <UnavailableMethod key="web2m-unavailable" />
      );
    }
    return null;
  };

  return (
    <Modal open={open} title="Nạp tiền" onClose={onClose} className="max-w-[500px] max-h-[90dvh] overflow-auto" bodyClassName="p-0">
      {paymentMethod ? (
        renderMethodContent(paymentMethod)
      ) : (
        <Tabs tabs={tabs} type="card" activeKey={activeTab} onChange={setActiveTab} cardWrapperClass="">
          {[renderMethodContent(activeTab as 'tazapay' | 'cryptomus' | 'web2m')]}
        </Tabs>
      )}
    </Modal>
  );
};

export default TopUpModalV2;
