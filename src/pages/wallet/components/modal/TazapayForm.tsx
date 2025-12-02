import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { Select } from '@/components/select/Select';
import { Open } from '@/components/icons';
import { useTazapayPayment } from '@/hooks/usePayments';

const MIN_AMOUNT = 10;

interface TazapayFormProps {
  countries?: Record<string, string>;
  onSuccess: () => void;
}

export const TazapayForm: React.FC<TazapayFormProps> = ({ countries, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState<string | number>('');
  const { mutate: generatePayment, isPending } = useTazapayPayment();

  const countryOptions = countries
    ? Object.entries(countries).map(([code, name]) => ({
        value: code,
        label: <span className="text-text-hi dark:text-text-hi-dark">{name}</span>,
      }))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      toast.error(`Số tiền tối thiểu là $${MIN_AMOUNT}`);
      return;
    }

    if (!country) {
      toast.error('Vui lòng chọn quốc gia');
      return;
    }

    const baseUrl = window.location.origin;
    generatePayment(
      {
        amount: numAmount,
        country: String(country),
        success_url: `${baseUrl}/wallet`,
        cancel_url: `${baseUrl}/wallet`,
      },
      {
        onSuccess: (data) => {
          window.open(data.payment_url, '_blank');
          toast.success('Đã mở cửa sổ thanh toán');
          onSuccess();
        },
        onError: (error) => {
          toast.error(error.message || 'Không thể tạo thanh toán');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div>
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-1 block">
          Số tiền (USD)
        </label>
        <InputField
          type="number"
          min={MIN_AMOUNT}
          step="0.01"
          placeholder={`Tối thiểu: $${MIN_AMOUNT}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          wrapperClassName="h-10"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-1 block">
          Quốc gia
        </label>
        <Select
          options={countryOptions}
          value={country}
          onChange={(val) => setCountry(val)}
          placeholder="Chọn quốc gia"
          placement="bottom"
          className="w-full h-10 dark:bg-[#2B405A] dark:pseudo-border-top dark:border-transparent"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        icon={<Open className="w-5 h-5" />}
        className="w-full h-10"
      >
        Thanh toán
      </Button>

      <p className="text-xs text-text-lo dark:text-text-lo-dark text-center">
        Bạn sẽ được chuyển đến trang thanh toán Tazapay để hoàn tất giao dịch
      </p>
    </form>
  );
};

export default TazapayForm;
