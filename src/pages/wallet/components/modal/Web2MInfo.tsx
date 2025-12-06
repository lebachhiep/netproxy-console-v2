import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRPay, BanksObject } from 'vietnam-qr-pay';
import { toast } from 'sonner';
import { ContentCopy, CheckMark } from '@/components/icons';
import { copyToClipboard } from '@/utils/copyToClipboard';
import type { BankInfo } from '@/services/payment/payment.types';

interface Web2MInfoProps {
  bankInfo: BankInfo;
  amount?: number; // as default amount amount in USD
}

export const Web2MInfo: React.FC<Web2MInfoProps> = ({ bankInfo, amount }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      toast.success('Đã sao chép vào clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Không thể sao chép');
    }
  };

  // Get bank display name from BanksObject
  const bankKey = bankInfo.bank_name as keyof typeof BanksObject;
  const bank = BanksObject[bankKey];
  const bankDisplayName = bank ? bank.shortName : bankInfo.bank_name;

  const fields = [
    { label: 'Ngân hàng', value: bankDisplayName, key: 'bank_name' },
    { label: 'Chủ tài khoản', value: bankInfo.account_holder_name, key: 'holder_name' },
    { label: 'Số tài khoản', value: bankInfo.bank_account_number, key: 'account_number', hasCopy: true },
    ...(amount !== undefined
      ? [
          {
            label: 'Số tiền',
            value: ((amount ?? 10) * bankInfo.vnd_usd_rate).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            key: 'amount',
            copyValue: (amount ?? 10) * bankInfo.vnd_usd_rate,
            hasCopy: true
          }
        ]
      : []),

    { label: 'Nội dung chuyển khoản', value: bankInfo.transfer_code, key: 'transfer_code', highlight: true, hasCopy: true }
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

      <p className="text-sm text-text-lo dark:text-text-lo-dark text-center">
        Quét mã QR bằng ứng dụng ngân hàng hoặc chuyển khoản thủ công với thông tin bên dưới
      </p>

      <div className="space-y-3">
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
            </div>
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
          <b className="text-red dark:text-red-dark">Lưu ý:</b> Vui lòng nhập chính xác{' '}
          <b className="text-primary dark:text-primary-dark">nội dung chuyển khoản</b> để hệ thống tự động xác nhận giao dịch. Sau khi
          chuyển khoản thành công, số dư sẽ được cập nhật trong vòng 1-5 phút.
        </p>
      </div>
    </div>
  );
};

export default Web2MInfo;
