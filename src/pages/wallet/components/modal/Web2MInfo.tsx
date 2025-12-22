import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRPay, BanksObject } from 'vietnam-qr-pay';
import { toast } from 'sonner';
import { ContentCopy, CheckMark } from '@/components/icons';
import { copyToClipboard } from '@/utils/copyToClipboard';
import type { BankInfo } from '@/services/payment/payment.types';
import { useTranslation } from 'react-i18next';
interface Web2MInfoProps {
  bankInfo: BankInfo;
  amount?: number; // as default amount amount in USD
}

export const Web2MInfo: React.FC<Web2MInfoProps> = ({ bankInfo, amount: amountProp }) => {
  const [amount, setAmount] = useState<number>(amountProp || 10);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { t } = useTranslation();
  // Generate VietQR content
  const qrContent = useMemo(() => {
    if (!bankInfo.bank_name) return null;

    const bankKey = bankInfo.bank_name as keyof typeof BanksObject;
    const bank = BanksObject[bankKey];

    if (!bank) return null;

    try {
      const qrPayload = {
        bankBin: bank.bin,
        bankNumber: bankInfo.bank_account_number,
        purpose: bankInfo.transfer_code
      };
      if (amount !== undefined) {
        Object.assign(qrPayload, { amount: ((amount ?? 10) * bankInfo.vnd_usd_rate).toString() });
      }
      const qrInit = QRPay.initVietQR(qrPayload);
      return qrInit.build();
    } catch {
      return null;
    }
  }, [bankInfo, amount]);

  const handleCopy = async (text: string, field: string) => {
    try {
      await copyToClipboard(text);
      setCopiedField(field);
      toast.success(t('toast.success.copyClipboard'));
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('toast.error.cantCopy');
    }
  };

  // Get bank display name from BanksObject
  const bankKey = bankInfo.bank_name as keyof typeof BanksObject;
  const bank = BanksObject[bankKey];
  const bankDisplayName = bank ? bank.shortName : bankInfo.bank_name;

  const fields = [
    { label: t('bank'), value: bankDisplayName, key: 'bank_name' },
    { label: t('owner'), value: bankInfo.account_holder_name, key: 'holder_name' },
    { label: t('accountNo'), value: bankInfo.bank_account_number, key: 'account_number', hasCopy: true },
    ...(amount !== undefined
      ? [
          {
            label: t('money'),
            value: ((amount ?? 10) * bankInfo.vnd_usd_rate).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            key: 'amount',
            copyValue: (amount ?? 10) * bankInfo.vnd_usd_rate,
            hasCopy: true
          }
        ]
      : []),

    { label: t('payReference'), value: bankInfo.transfer_code, key: 'transfer_code', highlight: true, hasCopy: true }
  ];

  return (
    <div className="p-5 space-y-4">
      {/* QR Code */}
      {qrContent && (
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCodeSVG value={qrContent} size={180} />
          </div>
        </div>
      )}

      <p className="text-sm text-text-lo dark:text-text-lo-dark text-center">{t('scanQR')}</p>

      <div className="space-y-3">
        <div
          className={`flex items-center justify-between p-3 rounded-lg border-2 bg-bg-mute dark:bg-bg-mute-dark border-border-element dark:border-border-element-dark`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-lo dark:text-text-lo-dark">{t('money')} (USD)</p>
            <div className={`font-medium truncate text-text-hi dark:text-text-hi-dark`}>
              <input
                type="number"
                min={10}
                placeholder={`Tối thiểu: $10`}
                value={amount}
                onChange={(e) => {
                  const val = Math.max(10, Number(e.target.value));
                  setAmount(val);
                }}
                className="outline-none w-full bg-transparent border-b border-border-element dark:border-border-element-dark py-1 px-2 transition-colors"
              />
            </div>
          </div>
        </div>

        {fields.map((field) => (
          <div
            key={field.key}
            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
              field.highlight
                ? 'bg-primary-bg dark:bg-primary-bg-dark border-primary/20'
                : 'bg-bg-mute dark:bg-bg-mute-dark border-border-element dark:border-border-element-dark'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-lo dark:text-text-lo-dark">{field.label}</p>
              <p
                className={`font-medium truncate ${field.highlight ? 'text-primary dark:text-primary-dark' : 'text-text-hi dark:text-text-hi-dark'}`}
              >
                {field.value}
              </p>
            </div>{' '}
            {field.hasCopy && (
              <button
                onClick={() => handleCopy('' + (field.copyValue ?? field.value), field.key)}
                className="ml-2 p-2 rounded-lg hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark transition-colors"
              >
                {copiedField === field.key ? (
                  <CheckMark className="w-5 h-5 text-green dark:text-green-dark" />
                ) : (
                  <ContentCopy className="w-5 h-5 text-blue dark:text-blue-dark" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-2 border-yellow dark:border-yellow-dark bg-yellow-bg dark:bg-yellow-bg-dark p-3 rounded-lg">
        <p className="text-sm text-text-hi dark:text-text-hi-dark">
          <b className="text-red dark:text-red-dark">{t('notice')}:</b>
          {t('pleaseInput1')} <b className="text-primary dark:text-primary-dark">{t('payReference').toLowerCase()}</b> {t('pleaseInput2')}
        </p>
      </div>
    </div>
  );
};

export default Web2MInfo;
