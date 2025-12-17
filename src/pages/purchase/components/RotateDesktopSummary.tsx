import { Button } from '@/components/button/Button';
import { OrderItemType } from './OrderSumary';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { DismissCircle } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/auth.store';
import { CartTabKey, getTabKeyFromPlan } from '@/contexts/CartContext';
import { couponService } from '@/services/coupon/coupon.service';
import { orderService } from '@/services/order/order.service';
import { CreateOrderRequest } from '@/services/order/order.types';
import { toast } from 'sonner';
import moment from 'moment';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
export const RotateDesktopSummary = ({
  orders,
  // totalIps,
  // totalLocation,
  total,
  useCartContext = false,
  proxyType,
  duration,
  filterPlanType,
  orderCallback
}: {
  total: number;
  orders: OrderItemType[];
  totalIps: number;
  totalLocation: number;
  useCartContext?: boolean;
  proxyType?: string;
  duration?: number;
  filterPlanType?: 'rotating' | 'dedicated' | 'static';
  orderCallback?: () => void;
}) => {
  // const [isExpanded, setExpanded] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const { t } = useTranslation();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cart = useCartContext ? useCart() : null;
  const userProfile = useAuthStore((state) => state.userProfile);
  const balance = userProfile?.balance ?? 0;

  // Calculate final total with discount
  // For dedicated tabs (when orders prop is provided), use the passed total (which is already filtered)
  // For rotating tabs, use the passed total (which is already filtered by OrderSummary)
  const discount = cart?.discountAmount ?? 0;
  // If orders prop is provided and has items, it means we're in a dedicated tab with filtered items
  const isDedicatedTab = orders.length > 0 && useCartContext;
  // Always use the passed total since OrderSummary already filters items by filterPlanType
  const subtotalForCalculation = total;
  const finalTotal = cart ? subtotalForCalculation - discount : total;
  const balanceAfter = balance - finalTotal;
  const hasInsufficientFunds = balanceAfter < 0;

  // Handle coupon apply
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error(t('toast.warn.enterValidCoupon'));
      return;
    }

    if (!cart) return;

    setIsValidatingCoupon(true);
    try {
      // Use subtotalForCalculation (which is already filtered by tab)
      const subtotalToValidate = subtotalForCalculation;
      const result = await couponService.validateCoupon(couponInput.trim(), subtotalToValidate);

      if (result.success && result.coupon && result.discount !== undefined) {
        cart.applyCoupon(couponInput.trim(), result.coupon, result.discount);
        toast.success(`Đã áp dụng mã giảm giá ${result.discount.toFixed(2)}$`);
        setCouponInput('');
      } else {
        toast.error(t('toast.warn.enterValidCoupon') || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      toast.error(t('toast.error.cantValidCoupon'));
      console.log('Coupon validation error:', error);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Handle coupon remove
  const handleRemoveCoupon = () => {
    if (cart) {
      cart.removeCoupon();
      toast.info(t('toast.success.couponRemove'));
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!cart || !useCartContext) return;

    // Get filtered items based on current tab
    const allItems = cart.getAllItems();
    let itemsToCheckout = allItems;
    if (isDedicatedTab && orders.length > 0) {
      // For dedicated tabs, only checkout items that are in the orders list (already filtered)
      const orderCountries = orders.map((o) => o.country.code?.toLowerCase()).filter(Boolean);
      itemsToCheckout = allItems.filter((item) => item.country && orderCountries.includes(item.country.toLowerCase()));
    } else if (filterPlanType) {
      // For rotating tabs or when filterPlanType is provided
      itemsToCheckout = allItems.filter((item) => item.plan.type === filterPlanType);
    }

    // Validate cart not empty
    if (itemsToCheckout.length === 0) {
      toast.error('emptyCard');
      return;
    }

    // Validate sufficient balance (already checked in UI, but double-check)
    if (hasInsufficientFunds) {
      toast.error(t('toast.warn.outOfBalance'));
      return;
    }

    setIsCheckingOut(true);
    try {
      // Build order request from filtered cart items only
      const orderRequest: CreateOrderRequest = {
        type: 'buy',
        items: itemsToCheckout.map((item) => ({
          plan_id: item.plan.id,
          quantity: item.quantity,
          country: item.country,
          duration: item.duration
        })),
        coupon_code: cart.couponCode
      };

      // Create order
      const order = await orderService.createOrder(orderRequest);

      // Clear only the items that were checked out
      // Group items by tab and clear them from respective tabs
      const itemsByTab = new Map<CartTabKey, string[]>();
      itemsToCheckout.forEach((item) => {
        const tabKey = getTabKeyFromPlan(item.plan);
        if (!itemsByTab.has(tabKey)) {
          itemsByTab.set(tabKey, []);
        }
        itemsByTab.get(tabKey)!.push(item.id);
      });

      // Clear items from each tab
      itemsByTab.forEach((itemIds, tabKey) => {
        cart.clearCartByItemIds(tabKey, itemIds);
      });

      // Handle different order statuses
      if (order.status === 'fulfilled') {
        // Fast provider - subscriptions ready immediately
        toast.success(
          t('detail-order', {
            orderId: order.order_number,
            adj: t('been'),
            action: t('payment'),
            result: t('success')
          })
        );
      } else if (order.status === 'processing') {
        // Slow provider - async fulfillment
        toast.success(
          t('detail-order', {
            orderId: order.order_number,
            adj: t('being'),
            action: t('process'),
            result: ''
          }),
          {
            description: t('toast.warn.notif30sec'),
            duration: 5000
          }
        );
      } else {
        // Other statuses (shouldn't happen, but handle gracefully)
        toast.success(
          t('detail-order', {
            orderId: order.order_number,
            adj: t('been'),
            action: t('create'),
            result: t('success')
          })
        );
      }
    } catch (error: any) {
      console.error('Checkout error:', error);

      // Handle specific error messages
      const errorMessage = error.response?.data?.message || error.message || '';

      if (errorMessage.includes('insufficient balance')) {
        toast.error(t('toast.warn.outOfBalance'));
      } else if (errorMessage.includes('Coupon') || errorMessage.includes('coupon')) {
        toast.error(t('toast.warn.enterValidCoupon'));
        cart.removeCoupon(); // Remove invalid coupon
      } else if (errorMessage.includes('plan') && errorMessage.includes('not active')) {
        toast.error(t('toast.warn.planOutdate'));
      } else if (error.code === 'ERR_NETWORK' || errorMessage.includes('network')) {
        toast.error(t('toast.error.connect'));
      } else {
        toast.error(t('toast.error.unknown'));
      }
    } finally {
      setIsCheckingOut(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      orderCallback && orderCallback();
    }
  };

  return (
    <>
      <div className="px-5 mt-3 mb-5">
        <div className="border border-border-element dark:border-border-element-dark rounded-xl shadow-xs  text-sm sticky bottom-5 bg-bg-canvas dark:dark:bg-bg-secondary-dark p-2">
          <div className="relative ">
            <div className={`transition-all duration-300 ease-in-out overflow-hidden `}>
              <div className="flex flex-col gap-3">
                {/* Coupon Input - Only show for cart context */}
                {useCartContext && cart && (
                  <div className="border-b border-border-element dark:border-border-element-dark pb-2">
                    {cart.couponCode ? (
                      <div className="flex items-center gap-2 bg-green-bg dark:bg-green-bg p-2 rounded-lg">
                        <span className="text-green dark:text-green-dark text-sm font-medium flex-1">{cart.couponCode}</span>
                        <IconButton
                          className="w-6 h-6"
                          icon={<DismissCircle className="w-4 h-4 text-text-lo dark:text-text-lo-dark" />}
                          onClick={handleRemoveCoupon}
                          aria-label={t('discountRemo')}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          icon={<></>}
                          placeholder={t('discountCode')}
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          wrapperClassName="flex-1 h-10"
                          inputClassName="text-sm"
                          aria-label="enterDiscount"
                        />
                        <Button
                          className="text-xs h-10 px-4"
                          onClick={handleApplyCoupon}
                          loading={isValidatingCoupon}
                          disabled={!couponInput.trim()}
                        >
                          {t('apply')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {proxyType && (
                  <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
                    <span className="text-text-me dark:text-text-me-dark text-sm font-medium">{t('ipType')}:</span>
                    <span className="font-semibold text-text-hi dark:text-text-hi-dark">{proxyType}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Balance and pricing - Only show for cart context */}
              {useCartContext && cart && (
                <div className="flex flex-col border-b border-border-element dark:border-border-element-dark">
                  <div className="flex justify-between text-sm py-2 border-b border-border-element dark:border-border-element-dark">
                    <span className="text-text-me dark:text-text-me-dark">{t('ipType')}:</span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold">{cart.getTabItems('rotating')[0]?.plan?.name}</span>
                  </div>

                  {duration && (
                    <div className="flex justify-between border-b border-border-element dark:border-border-element-dark py-2 ">
                      <span className="text-text-me dark:text-text-me-dark text-sm font-medium">{t('ipDuration')}:</span>
                      <span className="font-semibold text-text-hi dark:text-text-hi-dark">
                        {moment.duration(duration, 'seconds').humanize()}
                      </span>
                    </div>
                  )}

                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-me dark:text-text-me-dark">{t('.historyPage.messages.discount')}:</span>
                      <span className="text-green dark:text-green-dark font-semibold">-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-border-element dark:border-border-element-dark py-2">
                    <span className="text-text-me dark:text-text-me-dark">{t('price')}:</span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold">
                      ${cart.getTabItems('rotating')[0]?.plan?.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border-element dark:border-border-element-dark py-2">
                    <span className="text-text-me dark:text-text-me-dark">{t('quantity')}:</span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold">{cart.getTabItems('rotating')[0]?.quantity}</span>
                  </div>

                  {hasInsufficientFunds && (
                    <div className="bg-red-bg dark:bg-red-bg p-2 rounded-lg mt-2">
                      <span className="text-red dark:text-red-dark text-xs font-medium">
                        ⚠️ {t('toast.warn.outOfBalance')} ${Math.abs(balanceAfter).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center font-semibold text-lg pt-2">
                <div className="py-2">
                  <span className="text-text-hi dark:text-text-hi-dark text-lg font-semibold font-averta">{t('sum')}:</span>
                </div>
                <div className="flex items-start gap-1 font-averta">
                  <span className="text-green font-semibold text-lg tracking-[-0.66px]">$</span>
                  <span className="font-semibold text-blue text-[33px] leading-[120%] tracking-[-0.66px]">{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-t p-3 dark:border-border-element-dark">
        <Button
          className={clsx('text-[12px] mx-auto h-10')}
          disabled={useCartContext ? hasInsufficientFunds || cart?.itemCount === 0 : false}
          loading={isCheckingOut}
          onClick={useCartContext ? handleCheckout : undefined}
          variant={(useCartContext ? hasInsufficientFunds || cart?.itemCount === 0 : false) ? 'disabled' : 'primary'}
        >
          {t('checkOut')}
        </Button>
      </div>
    </>
  );
};
