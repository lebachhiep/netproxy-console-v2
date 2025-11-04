import { Button } from '@/components/button/Button';
import { OrderItemType } from './OrderSumary';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { Chevron, DismissCircle } from '@/components/icons';
import clsx from 'clsx';
import { Input } from '@/components/input/Input';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/auth.store';
import { couponService } from '@/services/coupon/coupon.service';
import { toast } from 'sonner';

export const MobileSummary = ({
  orders,
  totalIps,
  totalLocation,
  total,
  useCartContext = false
}: {
  total: number;
  orders: OrderItemType[];
  totalIps: number;
  totalLocation: number;
  useCartContext?: boolean;
}) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState<boolean>(false);

  const cart = useCartContext ? useCart() : null;
  const userProfile = useAuthStore((state) => state.userProfile);
  const balance = userProfile?.balance ?? 0;

  // Calculate final total with discount
  const discount = cart?.discountAmount ?? 0;
  const finalTotal = cart ? cart.total : total;
  const balanceAfter = balance - finalTotal;
  const hasInsufficientFunds = balanceAfter < 0;

  // Handle coupon apply
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (!cart) return;

    setIsValidatingCoupon(true);
    try {
      const result = await couponService.validateCoupon(couponInput.trim(), cart.subtotal);

      if (result.success && result.coupon && result.discount !== undefined) {
        cart.applyCoupon(couponInput.trim(), result.coupon, result.discount);
        toast.success(`Đã áp dụng mã giảm giá ${result.discount.toFixed(2)}$`);
        setCouponInput('');
      } else {
        toast.error(result.error || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      toast.error('Không thể xác thực mã giảm giá');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Handle coupon remove
  const handleRemoveCoupon = () => {
    if (cart) {
      cart.removeCoupon();
      toast.info('Đã xóa mã giảm giá');
    }
  };

  return (
    <div className="p-5">
      <div className="p-5 rounded-xl border-t border-border-element dark:border-border-element-dark bg-bg-canvas dark:bg-bg-canvas-dark shadow-xs dark:dark:bg-bg-secondary-dark relative">
        <div className="text-text-hi dark:text-text-hi-dark absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <IconButton
            className="w-6 h-6"
            icon={<Chevron className={clsx('w-4 h-4', isExpanded && '-rotate-90', !isExpanded && 'rotate-90')} />}
            onClick={() => setExpanded(!isExpanded)}
          />
        </div>
        <div
          className={`${'flex flex-col gap-3 text-sm'} transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {/* Coupon Input - Only show for cart context */}
          {useCartContext && cart && (
            <div className="border-b border-border-element dark:border-border-element-dark pb-3">
              {cart.couponCode ? (
                <div className="flex items-center gap-2 bg-green-bg dark:bg-green-bg p-2 rounded-lg">
                  <span className="text-green dark:text-green-dark text-sm font-medium flex-1">{cart.couponCode}</span>
                  <IconButton
                    className="w-6 h-6"
                    icon={<DismissCircle className="w-4 h-4 text-text-lo dark:text-text-lo-dark" />}
                    onClick={handleRemoveCoupon}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    icon={<></>}
                    placeholder="Mã giảm giá"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    wrapperClassName="flex-1 h-10"
                    inputClassName="text-sm"
                  />
                  <Button
                    className="text-xs h-10 px-4"
                    onClick={handleApplyCoupon}
                    loading={isValidatingCoupon}
                    disabled={!couponInput.trim()}
                  >
                    Áp dụng
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
            <span className="text-text-me dark:text-text-me-dark font-medium">IP type:</span>
            <span className="font-semibold text-text-hi dark:text-text-hi-dark">Standard ISP IP</span>
          </div>
          <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
            <span className="text-text-me dark:text-text-me-dark font-medium">IP Duration:</span>
            <span className="font-semibold text-text-hi dark:text-text-hi-dark">30 days</span>
          </div>
          <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
            <span className="text-text-me dark:text-text-me-dark font-medium">IP Unit Price:</span>
            <span className="font-semibold text-text-hi dark:text-text-hi-dark">
              ${orders.length > 0 ? orders[0]?.price.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
            <span className="text-text-me dark:text-text-me-dark font-medium">Total location:</span>
            <span className="font-semibold text-text-hi dark:text-text-hi-dark">{totalLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-me dark:text-text-me-dark font-medium">Total number of IPs:</span>
            <span className="font-semibold text-text-hi dark:text-text-hi-dark">{totalIps}</span>
          </div>
        </div>

        <div className={clsx('flex flex-col gap-5', isExpanded ? 'mt-5' : 'mt-0')}>
          {/* Balance and pricing - Only show for cart context */}
          {useCartContext && cart && (
            <div className="flex flex-col gap-2 border-b border-border-element dark:border-border-element-dark pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-me dark:text-text-me-dark">Tổng phụ:</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold">${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-me dark:text-text-me-dark">Giảm giá:</span>
                  <span className="text-green dark:text-green-dark font-semibold">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border-element dark:border-border-element-dark">
                <span className="text-text-me dark:text-text-me-dark">Số dư hiện tại:</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold">${balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-me dark:text-text-me-dark">Số dư sau:</span>
                <span className={clsx('font-semibold', hasInsufficientFunds ? 'text-red dark:text-red-dark' : 'text-text-hi dark:text-text-hi-dark')}>
                  ${balanceAfter.toFixed(2)}
                </span>
              </div>
              {hasInsufficientFunds && (
                <div className="bg-red-bg dark:bg-red-bg p-2 rounded-lg mt-2">
                  <span className="text-red dark:text-red-dark text-xs font-medium">
                    ⚠️ Số dư không đủ. Vui lòng nạp thêm ${Math.abs(balanceAfter).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center font-semibold text-lg">
            <div className="py-2">
              <span className="text-text-hi dark:text-text-hi-dark font-averta">Tổng cộng:</span>
            </div>
            <div className="flex items-start gap-1 font-averta">
              <span className="text-green font-semibold text-lg tracking-[-0.66px]">$</span>
              <span className="font-semibold text-blue text-[33px] leading-[120%] tracking-[-0.66px]">{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Button
              className="w-full text-[12px]"
              disabled={useCartContext ? hasInsufficientFunds || (cart?.items.length === 0) : false}
            >
              THANH TOÁN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
