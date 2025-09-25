import { Modal } from '@/components/modal/Modal';
import React from 'react';

interface PaymentQrModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  accountNumber: string;
  bankName: string;
  qrImage: string;
  expiredAt: string;
  onConfirm: () => void;
}

export const PaymentQrModal: React.FC<PaymentQrModalProps> = ({
  open,
  onClose,
  orderId,
  amount,
  accountNumber,
  bankName,
  qrImage,
  expiredAt,
  onConfirm
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="QR - Thanh toán"
      bodyClassName="p-5"
      footerClassName="p-4"
      actions={[
        <button
          key="confirm"
          onClick={onConfirm}
          className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center"
        >
          ✔ XÁC NHẬN THANH TOÁN
        </button>
      ]}
    >
      <div className="flex flex-col gap-3">
        {/* Order info */}
        <div>
          <p>
            Mã đơn: <span className="font-semibold">{orderId}</span>
          </p>
          <p>
            Thành tiền: <span className="text-blue-500 font-semibold">${amount.toFixed(2)}</span>
          </p>
        </div>

        {/* QR section */}
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center py-4">
            <img src={qrImage} alt="QR Code" className="w-56 h-56 bg-white p-2 rounded-md" />
            <div className="bg-white mt-3 rounded-md px-4 py-2 text-center text-sm font-medium">
              <div>Chủ tài khoản: ******</div>
              <div>
                STK: <span className="font-semibold">{accountNumber}</span>
              </div>
              <div>Ngân hàng: {bankName}</div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-md px-3 py-2">
          <p>
            <strong>Lưu ý:</strong> Sau khi thanh toán, vui lòng đợi hệ thống cập nhật số dư cho bạn. Sau{' '}
            <span className="font-semibold">1 phút</span> và tải lại trang.
          </p>
          <p className="mt-1">
            Đơn hàng sẽ hết hạn sau: <span className="font-bold text-red-500">{expiredAt}</span>
          </p>
        </div>
      </div>
    </Modal>
  );
};
