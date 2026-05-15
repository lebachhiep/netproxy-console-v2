import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { usePay2sPayment } from '@/hooks/usePayments';
import { useTranslation } from 'react-i18next';

const MIN_AMOUNT = 10;

interface Pay2sFormProps {
  onSuccess: () => void;
  amount?: number;
}

export const Pay2sForm: React.FC<Pay2sFormProps> = ({ onSuccess, amount: propAmount }) => {
  const [amount, setAmount] = useState(propAmount ? propAmount.toString() : '');
  const { mutate: generatePayment, isPending } = usePay2sPayment();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      toast.error(t('toast.warn.minMoney') + MIN_AMOUNT);
      return;
    }

    const baseUrl = window.location.origin;
    generatePayment(
      {
        amount: numAmount,
        success_url: `${baseUrl}/payment/callback`,
        cancel_url: `${baseUrl}/payment/callback`
      },
      {
        onSuccess: (data) => {
          window.open(data.payment_url, '_blank');
          toast.success(t('toast.success.windowPaymentPop'));
          onSuccess();
        },
        onError: (error) => {
          toast.error(t('toast.error.cantCreatePay'));
          console.log('Pay2s payment error:', error);
        }
      }
    );
  };

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

      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        className="w-full h-10 !bg-[#2563eb] !border-[#1d4ed8] hover:!bg-[#1e40af]"
      >
        {t('payWithPay2s')}
      </Button>

      <p className="text-xs text-text-lo dark:text-text-lo-dark text-center">{t('pay2sRedirectInfo')}</p>
    </form>
  );
};

export default Pay2sForm;
