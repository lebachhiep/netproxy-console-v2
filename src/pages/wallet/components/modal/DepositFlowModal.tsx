import bgDeposit from '@/assets/images/bg_deposit.png';
import qrDemoImg from '@/assets/images/qr_code1.png';
import { Button } from '@/components/button/Button';
import { ArrowRight, CheckMark, DismissCircle } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { Modal } from '@/components/modal/Modal';
import { Select } from '@/components/select/Select';
import { Slider } from '@/components/slider/Slider';
import { formatCurrency } from '@/utils/currency';
import React, { useEffect, useState } from 'react';

const options = [
  {
    value: 'ACB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">ACB</span>
      </div>
    )
  },
  {
    value: 'VCB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">VCB</span>
      </div>
    )
  },
  {
    value: 'TPB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">TPB</span>
      </div>
    )
  }
];

interface DepositFlowModalProps {
  open: boolean;
  onClose: () => void;
  defaultStep?: 1 | 2;
  defaultAmount?: number;
  defaultMethod?: string | number;
}

const DepositFlowModal: React.FC<DepositFlowModalProps> = ({
  open,
  onClose,
  defaultStep = 1,
  defaultAmount = 10,
  defaultMethod = 'ACB'
}) => {
  const [step, setStep] = useState<1 | 2>(defaultStep);
  const [amount, setAmount] = useState(defaultAmount);
  const [selectedMethod, setSelectedMethod] = useState<string | number>(defaultMethod);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  // reset mỗi lần mở modal
  useEffect(() => {
    if (open) {
      setStep(defaultStep);
      setAmount(defaultAmount);
      setSelectedMethod(defaultMethod);
    }
  }, [open, defaultStep, defaultAmount, defaultMethod]);

  return (
    <Modal
      className={'max-w-[558px] max-h-[100dvh] overflow-auto'}
      open={open}
      title={step === 1 ? 'Nạp tiền' : 'QR - Thanh toán'}
      onClose={onClose}
      // nút hủy chỉ hiện step 1
      cancelButton={
        step === 1 ? (
          <button
            onClick={onClose}
            className="text-text-hi dark:text-text-lo-dark border-none h-10 flex items-center uppercase px-4 gap-2 text-[12px] tracking-[0.6px] font-bold"
          >
            <DismissCircle />
            Hủy
          </button>
        ) : null
      }
      // actions thay đổi theo step
      actions={
        step === 1
          ? [
              <Button variant="primary" className="h-10 mb-1" onClick={() => handleNext()} icon={<ArrowRight className="w-5 h-5" />}>
                TIẾP THEO
              </Button>
            ]
          : [
              <Button key="confirm" onClick={onClose} className="h-10 mb-1 dark:pseudo-border-top-orange dark:border-transparent" icon={<CheckMark className="w-5 h-5" />}>
                Xác nhận thanh toán
              </Button>
            ]
      }
    >
      <div>
        {step === 1 && (
          <div className="p-5">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1">Nạp thêm tiền vào ví</h3>
                {/* Amount Display */}
                <div className="">
                  <InputField
                    wrapperClassName="h-10"
                    value={formatCurrency('' + amount)}
                    onChange={(e) => setAmount(Math.min(+e.target.value, 10000))}
                  />

                  {/* Slider */}
                  <div className="mt-2">
                    <Slider
                      min={10}
                      max={1000}
                      step={5}
                      value={amount}
                      onValueChange={setAmount}
                      formatValue={(val) => `$${val.toLocaleString()}`}
                      labels={['$10.00', '$1,000.00']}
                      labelValues={[10, 1000]}
                      showCurrentValue={false}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="">
                <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1">Phương thức</h3>
                <Select
                  options={options}
                  value={selectedMethod}
                  onChange={(val) => setSelectedMethod(val)}
                  placeholder="Chọn ngân hàng"
                  placement="bottom"
                  className="w-full h-10 dark:bg-[#2B405A] dark:pseudo-border-top dark:border-transparent "
                />
              </div>

              <div>
                {/* Terms */}
                <p className="text-sm text-text-lo dark:text-text-lo-dark font-medium">
                  Bằng cách nhấp vào tiếp tục thanh toán, bạn đồng ý với{' '}
                  <a href="#" className="text-blue dark:text-blue-dark underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-blue dark:text-blue-dark underline">
                    Chính sách bảo mật
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="p-3 border-b border-border dark:border-border-dark">
              <p className="text-text-hi dark:text-text-hi-dark text-sm">
                Mã đơn: <b>FKS284</b>
              </p>
              <div className="text-text-hi dark:text-text-hi-dark text-sm flex items-center gap-1">
                Thành tiền:{' '}
                <div className="inline-flex items-start gap-[2px] font-averta">
                  <span className="text-green font-semibold text-[12px] tracking-[-0.66px] font-averta">$</span>
                  <span className="text-blue font-averta dark:text-blue-dark font-semibold text-lg">{amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-3 border-b border-border dark:border-border-dark">
              <div className="relative inline-block w-full sm:w-auto m">
                {/* Ảnh nền */}
                <img src={bgDeposit} alt="QR Background" className="h-auto rounded-lg object-contain w-full sm:w-auto" />

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-5">
                  <img src={qrDemoImg} alt="QR Code" className="w-[70%] sm:w-[305px] h-auto object-contain" />

                  <div className="bg-bg-primary dark:bg-bg-primary-dark rounded -mt-3 p-2 sm:p-3 text-center text-xs sm:text-sm w-[calc(70%-20px)] sm:w-[280px] flex flex-col gap-1">
                    <p className="text-text-me">
                      Chủ tài khoản: <b className="text-text-hi dark:text-text-hi-dark">******</b>
                    </p>
                    <p className="text-text-me">
                      STK: <b className="text-text-hi dark:text-text-hi-dark">XXXX 000 644 290</b>
                    </p>
                    <p className="text-text-me">
                      Ngân hàng: <b className="text-text-hi dark:text-text-hi-dark">VCB</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-text-hi dark:text-text-hi-dark font-medium p-3">
              <div className="border flex flex-col gap-2 border-yellow dark:border-yellow-dark bg-yellow-bg dark:bg-yellow-bg-dark p-3 rounded-lg">
                <div>
                  <b className="text-red dark:text-red-dark">Lưu ý:</b> Sau khi thanh toán, vui lòng đợi hệ thống cập nhật số dư cho bạn.
                  Sau <b className="text-red dark:text-red-dark"> 1 phút</b> và tải lại trang.
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <span className="text-red dark:text-red-dark font-bold">Đơn hàng sẽ hết hạn sau:</span>
                  <span className="text-red dark:text-red-dark font-bold">03:59:00</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DepositFlowModal;
