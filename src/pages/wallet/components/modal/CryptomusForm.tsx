import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { useCryptomusPayment } from '@/hooks/usePayments';
import type { CryptoService } from '@/services/payment/payment.types';
import { useTranslation } from 'react-i18next';
const MIN_AMOUNT = 10;

interface CryptomusFormProps {
  services?: CryptoService[];
  onSuccess: () => void;
  amount?: number;
}

export const CryptomusForm: React.FC<CryptomusFormProps> = ({ services, onSuccess, amount: propAmount }) => {
  const [amount, setAmount] = useState(propAmount ? propAmount.toString() : '');
  const { mutate: generatePayment, isPending } = useCryptomusPayment();
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      toast.error(t('toast.warn.minMoney') + MIN_AMOUNT);
      return;
    }

    generatePayment(
      { amount: numAmount },
      {
        onSuccess: (data) => {
          window.open(data.payment_url, '_blank');
          toast.success(t('toast.success.windowPaymentPop'));
          onSuccess();
        },
        onError: (error) => {
          toast.error(t('toast.error.cantCreatePay'));
          console.log('Cryptomus payment error:', error);
        }
      }
    );
  };

  const availableServices = services?.filter((s) => s.is_available).slice(0, 6) || [];

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div>
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-1 block">
          {t('money')} {`(USD)`}
        </label>
        <InputField
          type="number"
          min={MIN_AMOUNT}
          step="0.01"
          placeholder={t('minMoney') + `$${MIN_AMOUNT}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          wrapperClassName="h-10"
        />
      </div>

      {availableServices.length > 0 && (
        <div className="p-3 rounded-lg bg-bg-mute dark:bg-bg-mute-dark border-2 border-border-element dark:border-border-element-dark">
          <p className="text-sm text-text-lo dark:text-text-lo-dark mb-2">{t('supportCryp')}</p>
          <div className="flex flex-wrap gap-2">
            {availableServices.map((service) => (
              <span
                key={`${service.network}-${service.currency}`}
                className="inline-flex items-center rounded-lg bg-bg-secondary dark:bg-bg-secondary-dark px-2 py-1 text-xs font-medium text-text-hi dark:text-text-hi-dark border border-border-element dark:border-border-element-dark"
              >
                {service.currency} ({service.network})
              </span>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" loading={isPending} className="w-full h-10">
        {t('payment')}
      </Button>

      <p className="text-xs text-text-lo dark:text-text-lo-dark text-center">{t('toCryptomus')}</p>
    </form>
  );
};

export default CryptomusForm;
