import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { Select } from '@/components/select/Select';
import { useTazapayPayment } from '@/hooks/usePayments';
import { useTranslation } from 'react-i18next';
const MIN_AMOUNT = 10;

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface TazapayFormProps {
  countries?: Record<string, string>;
  onSuccess: () => void;
  amount?: string | number;
  country?: string | number;
  onAmountChange?: (value: string) => void;
  onCountryChange?: (value: string | number) => void;
}

export const TazapayForm: React.FC<TazapayFormProps> = ({
  countries,
  onSuccess,
  amount: propAmount,
  country: propCountry,
  onAmountChange,
  onCountryChange
}) => {
  const [internalAmount, setInternalAmount] = useState('');
  const [internalCountry, setInternalCountry] = useState<string | number>('');
  const amount = propAmount !== undefined ? String(propAmount) : internalAmount;
  const country = propCountry !== undefined ? propCountry : internalCountry;
  const { mutate: generatePayment, isPending } = useTazapayPayment();
  const { t } = useTranslation();
  console.log('countries', countries);

  const countryOptions = countries
    ? Object.entries(countries).map(([name, code]) => ({
        value: code,
        label: (
          <span className="text-text-hi dark:text-text-hi-dark flex items-center gap-2">
            <span>{getCountryFlag(code)}</span>
            <span>{name}</span>
          </span>
        )
      }))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      toast.error(t('toast.warn.minMoney') + `$${MIN_AMOUNT}`);
      return;
    }

    if (!country) {
      toast.error(t('toast.warn.pickCountry'));
      return;
    }

    const baseUrl = window.location.origin;
    generatePayment(
      {
        amount: numAmount,
        country: String(country),
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
          console.log('Tazapay payment error:', error);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div>
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-1 block">Số tiền (USD)</label>
        <InputField
          type="number"
          min={MIN_AMOUNT}
          step="0.01"
          placeholder={t('minMoney') + `$${MIN_AMOUNT}`}
          value={amount}
          onChange={(e) => {
            if (onAmountChange) {
              onAmountChange(e.target.value);
            } else {
              setInternalAmount(e.target.value);
            }
          }}
          wrapperClassName="h-10"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-1 block">{t('country')}</label>
        <Select
          options={countryOptions}
          value={country}
          onChange={(val) => {
            if (onCountryChange) {
              onCountryChange(val);
            } else {
              setInternalCountry(val);
            }
          }}
          placeholder={t('pickCountry')}
          optionClassName="max-h-[100px]"
          placement="top-right"
          className="w-full h-10 dark:bg-[#2B405A] dark:pseudo-border-top dark:border-transparent"
        />
      </div>

      <Button type="submit" variant="primary" loading={isPending} className="w-full h-10">
        {t('payment')}
      </Button>

      <p className="text-xs text-text-lo dark:text-text-lo-dark text-center">{t('toTazapay')}</p>
    </form>
  );
};

export default TazapayForm;
