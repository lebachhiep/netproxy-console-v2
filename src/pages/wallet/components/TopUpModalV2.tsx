import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/modal/Modal';
import { Tabs } from '@/components/tabs/Tabs';
import { WalletCreditCardOutlined, Globe, DatabaseStackOutlined } from '@/components/icons';
import { usePaymentMethods } from '@/hooks/usePayments';
import { PaymentMethodInfo } from '@/services/payment/payment.types';
import TazapayForm from './modal/TazapayForm';
import CryptomusForm from './modal/CryptomusForm';
import Web2MInfo from './modal/Web2MInfo';
import PaypalForm from './modal/PaypalForm';
import StripeForm from './modal/StripeForm';
import Pay2sForm from './modal/Pay2sForm';
import { useTranslation } from 'react-i18next';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  paymentMethod?: 'tazapay' | 'cryptomus' | 'web2m' | 'paypal' | 'stripe' | 'pay2s';
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

export const TopUpModalV2: React.FC<TopUpModalProps> = ({ open, onClose, paymentMethod, amount, country }) => {
  const { t } = useTranslation();
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const [activeTab, setActiveTab] = useState<string | number>('tazapay');

  // Build a lookup map from API methods
  const methodMap = useMemo(() => {
    const map: Record<string, PaymentMethodInfo> = {};
    paymentMethods?.methods.forEach((m) => {
      map[m.type] = m;
    });
    return map;
  }, [paymentMethods]);

  // Tab config for each known method type
  const allTabConfigs: Record<string, { label: string; icon: React.ReactNode }> = useMemo(
    () => ({
      tazapay: { label: t('walletAndLabel'), icon: <WalletCreditCardOutlined className="w-5 h-5" /> },
      cryptomus: { label: t('crypto'), icon: <Globe className="w-5 h-5" /> },
      web2m: { label: t('bank'), icon: <DatabaseStackOutlined className="w-5 h-5" /> },
      paypal: { label: t('paypal'), icon: <WalletCreditCardOutlined className="w-5 h-5" /> },
      stripe: { label: t('stripe'), icon: <WalletCreditCardOutlined className="w-5 h-5" /> },
      pay2s: { label: t('pay2s'), icon: <WalletCreditCardOutlined className="w-5 h-5" /> }
    }),
    [t]
  );

  // Build tabs dynamically from API response — only show available methods
  const tabs = useMemo(() => {
    if (!paymentMethods?.methods) return [];
    return paymentMethods.methods
      .filter((m) => allTabConfigs[m.type] && m.available)
      .map((m) => ({
        key: m.type,
        label: allTabConfigs[m.type].label,
        icon: allTabConfigs[m.type].icon
      }));
  }, [paymentMethods, allTabConfigs]);

  // Set default tab to first available method
  const defaultTab = useMemo(() => {
    const firstAvailable = paymentMethods?.methods.find((m) => m.available);
    return firstAvailable?.type || tabs[0]?.key || 'tazapay';
  }, [paymentMethods, tabs]);

  // Update active tab when default changes, only if paymentMethod is not set
  useEffect(() => {
    if (open && paymentMethods && !paymentMethod) {
      setActiveTab(defaultTab);
    }
  }, [open, paymentMethods, defaultTab, paymentMethod]);

  // Render content for a specific method
  const renderMethodContent = (method: string) => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    const info = methodMap[method];
    if (method === 'tazapay') {
      return <TazapayForm key="tazapay" countries={info?.supported_countries} onSuccess={onClose} amount={amount} country={country} />;
    }
    if (method === 'cryptomus') {
      return <CryptomusForm key="cryptomus" services={info?.crypto_services} onSuccess={onClose} amount={amount || 10} />;
    }
    if (method === 'web2m' && info?.bank_info) {
      return <Web2MInfo key="web2m" bankInfo={info.bank_info} amount={amount || 10} />;
    }
    if (method === 'paypal') {
      return <PaypalForm key="paypal" onSuccess={onClose} amount={amount} />;
    }
    if (method === 'stripe') {
      return <StripeForm key="stripe" onSuccess={onClose} amount={amount} />;
    }
    if (method === 'pay2s') {
      return <Pay2sForm key="pay2s" onSuccess={onClose} amount={amount} />;
    }
    return null;
  };

  const noMethodsAvailable = !isLoading && tabs.length === 0;

  return (
    <Modal
      open={open}
      title={t('topUp')}
      onClose={onClose}
      className="max-w-[500px] max-h-[90dvh] flex flex-col overflow-hidden"
      headerClassName="shrink-0"
      bodyClassName="p-0 overflow-y-auto flex-1 min-h-0"
    >
      {noMethodsAvailable ? (
        <div className="p-8 text-center text-text-lo dark:text-text-lo-dark">{t('paymentUnavailable')}</div>
      ) : paymentMethod ? (
        renderMethodContent(paymentMethod)
      ) : (
        <Tabs tabs={tabs} type="card" activeKey={activeTab} onChange={setActiveTab} cardWrapperClass="">
          {tabs.map((tab) => renderMethodContent(tab.key))}
        </Tabs>
      )}
    </Modal>
  );
};

export default TopUpModalV2;
