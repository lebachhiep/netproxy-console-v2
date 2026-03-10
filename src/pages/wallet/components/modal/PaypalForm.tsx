import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { usePaypalPayment } from '@/hooks/usePayments';
import { useTranslation } from 'react-i18next';
const MIN_AMOUNT = 10;

interface PaypalFormProps {
  onSuccess: () => void;
  amount?: number;
}

export const PaypalForm: React.FC<PaypalFormProps> = ({ onSuccess, amount: propAmount }) => {
  const [amount, setAmount] = useState(propAmount ? propAmount.toString() : '');
  const { mutate: generatePayment, isPending } = usePaypalPayment();
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
        success_url: `${baseUrl}/wallet`,
        cancel_url: `${baseUrl}/wallet`
      },
      {
        onSuccess: (data) => {
          window.open(data.payment_url, '_blank');
          toast.success(t('toast.success.windowPaymentPop'));
          onSuccess();
        },
        onError: (error) => {
          toast.error(t('toast.error.cantCreatePay'));
          console.log('PayPal payment error:', error);
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
        className="w-full h-10 !bg-[#0070ba] !border-[#005ea6] hover:!bg-[#003087]"
      >
        {t('payWithPaypal')}
      </Button>

      <p className="text-xs text-text-lo dark:text-text-lo-dark text-center">{t('paypalRedirectInfo')}</p>
    </form>
  );
};

export default PaypalForm;
