import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { Open } from '@/components/icons';
import { useCryptomusPayment } from '@/hooks/usePayments';
import type { CryptoService } from '@/services/payment/payment.types';

const MIN_AMOUNT = 10;

interface CryptomusFormProps {
  services?: CryptoService[];
  onSuccess: () => void;
}

export const CryptomusForm: React.FC<CryptomusFormProps> = ({ services, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const { mutate: generatePayment, isPending } = useCryptomusPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      toast.error(`Số tiền tối thiểu là $${MIN_AMOUNT}`);
      return;
    }

    generatePayment(
      { amount: numAmount },
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

  const availableServices = services?.filter((s) => s.is_available).slice(0, 6) || [];

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

      {availableServices.length > 0 && (
        <div className="p-3 rounded-lg bg-bg-mute dark:bg-bg-mute-dark border-2 border-border-element dark:border-border-element-dark">
          <p className="text-sm text-text-lo dark:text-text-lo-dark mb-2">
            Tiền điện tử được hỗ trợ:
          </p>
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
        Bạn sẽ được chuyển đến trang thanh toán Cryptomus để chọn loại tiền điện tử
      </p>
    </form>
  );
};

export default CryptomusForm;
