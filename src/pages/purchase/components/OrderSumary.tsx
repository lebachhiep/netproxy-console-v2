import React from 'react';
import { Country } from './table/CountrySelector';
import { SectionTitle } from '@/components/SectionTitle';
import { Add, CartFilled, Delete, Subtract } from '@/components/icons';
import { Divider } from '@/components/divider/Divider';
import { Button } from '@/components/button/Button';
import { useResponsive } from '@/hooks/useResponsive';
import { DesktopSummary } from './DesktopSummary';
import IconButton from '@/components/button/IconButton';
import { MobileSummary } from './MobileSummary';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/contexts/CartContext';

export type OrderItemType = {
  country: Country;
  price: number;
  quantity: number;
};

interface Props {
  orders?: OrderItemType[]; // Optional for backward compatibility
  onUpdateQuantity?: (country: Country, quantity: number) => void;
  onRemove?: (country: Country) => void;
  onClearAll?: () => void;
  useCartContext?: boolean; // Flag to use cart context instead of props
}

const OrderSummary: React.FC<Props> = ({
  orders: propOrders = [],
  onUpdateQuantity,
  onRemove,
  onClearAll,
  useCartContext = false
}) => {
  const { isMobile, isTablet } = useResponsive();
  const cart = useCartContext ? useCart() : null;

  // Use cart context if flag is set, otherwise use props
  const orders = useCartContext && cart ? cart.items : propOrders;
  const isEmpty = orders.length === 0;

  // Nếu giỏ hàng trống
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-270px)] bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark text-center p-8">
        <CartFilled className="w-16 h-16 text-text-lo dark:text-text-lo-dark mb-4 opacity-70" />
        <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">Giỏ hàng trống</h2>
        <p className="text-text-me dark:text-text-me-dark text-sm mb-6">
          {useCartContext ? 'Hãy chọn gói dịch vụ để thêm vào giỏ hàng.' : 'Hãy chọn quốc gia để thêm IP vào giỏ hàng của bạn.'}
        </p>
      </div>
    );
  }

  // Calculate totals based on cart type
  let total: number;
  let totalIps: number;
  let totalLocation: number;

  if (useCartContext && cart) {
    // For cart context items
    total = cart.subtotal;
    totalIps = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    totalLocation = cart.items.length;
  } else {
    // For dedicated orders (backward compatibility)
    const orderItems = propOrders as OrderItemType[];
    total = orderItems.reduce((sum, o) => sum + o.price * o.quantity, 0);
    totalIps = orderItems.reduce((sum, o) => sum + o.quantity, 0);
    totalLocation = orderItems.length;
  }

  // Handle quantity update
  const handleUpdateQuantity = (itemOrCountry: CartItem | Country, quantity: number) => {
    if (useCartContext && cart) {
      const item = itemOrCountry as CartItem;
      cart.updateQuantity(item.id, quantity);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(itemOrCountry as Country, quantity);
    }
  };

  // Handle remove
  const handleRemove = (itemOrCountry: CartItem | Country) => {
    if (useCartContext && cart) {
      const item = itemOrCountry as CartItem;
      cart.removeItem(item.id);
    } else if (onRemove) {
      onRemove(itemOrCountry as Country);
    }
  };

  return (
    <>
      {/* Desktop */}
      {!isMobile && !isTablet ? (
        <div className="bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark p-5 flex flex-col h-full !pb-0">
          {/* Header */}
          {/* <SectionTitle text="Đơn hàng" icon={<Delete className="cursor-pointer text-text-lo dark:text-text-lo-dark" onClick={onClearAll} />} /> */}

          {/* Scrollable order list */}
          <div className="flex-1 mt-5 flex flex-col min-h-28 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 pb-3 text-sm font-medium text-text-lo dark:text-text-lo-dark border-b border-border-element dark:border-border-element-dark">
              <span>Country</span>
              <span className="w-[42px] text-center">Giá</span>
              <span className="w-[100px] text-center">Số lượng</span>
              <span className="w-[60px] text-center">Tổng</span>
              <span className="w-[20px] text-center"></span>
            </div>

            {/* List items */}
            <div className="space-y-3 mt-3 mb-5 pb-5 overflow-y-auto flex-1">
              {useCartContext && cart ? (
                // Render cart items
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 text-sm font-medium items-center border-b border-border-element dark:border-border-element-dark pb-2"
                  >
                    {/* Tên gói */}
                    <div className="text-text-hi dark:text-text-hi-dark">{item.plan.name}</div>

                    {/* Đơn giá */}
                    <div className="w-[42px] text-center text-primary dark:text-primary-dark font-semibold">${item.plan.price.toFixed(2)}</div>

                    {/* Số lượng */}
                    <div className="w-[100px]">
                      <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] dark:border-border-element-dark rounded-md">
                        <div
                          className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <Subtract className="text-text-lo dark:text-text-lo-dark " />
                        </div>
                        <span className="text-text-hi dark:text-text-hi-dark">{item.quantity}</span>
                        <div
                          className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        >
                          <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                        </div>
                      </div>
                    </div>

                    {/* Tổng */}
                    <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(item.plan.price * item.quantity).toFixed(2)}</div>

                    {/* Nút xóa */}
                    <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => handleRemove(item)} />
                  </div>
                ))
              ) : (
                // Render dedicated orders (backward compatibility)
                propOrders.map((o) => (
                  <div
                    key={o.country.id}
                    className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 text-sm font-medium items-center border-b border-border-element dark:border-border-element-dark pb-2"
                  >
                    {/* Quốc gia */}
                    <div className="text-text-hi dark:text-text-hi-dark">{o.country.name}</div>

                    {/* Đơn giá */}
                    <div className="w-[42px] text-center text-primary dark:text-primary-dark font-semibold">${o.price.toFixed(2)}</div>

                    {/* Số lượng */}
                    <div className="w-[100px]">
                      <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] dark:border-border-element-dark rounded-md">
                        <div
                          className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity - 1)}
                        >
                          <Subtract className="text-text-lo dark:text-text-lo-dark " />
                        </div>
                        <span className="text-text-hi dark:text-text-hi-dark">{o.quantity}</span>
                        <div
                          className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity + 1)}
                        >
                          <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                        </div>
                      </div>
                    </div>

                    {/* Tổng */}
                    <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(o.price * o.quantity).toFixed(2)}</div>

                    {/* Nút xóa */}
                    <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => onRemove && onRemove(o.country)} />
                  </div>
                ))
              )}
            </div>
          </div>

          <DesktopSummary
            orders={propOrders}
            total={total}
            totalIps={totalIps}
            totalLocation={totalLocation}
            useCartContext={useCartContext}
          />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100dvh-64px)] bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 ">
            {useCartContext && cart ? (
              // Render cart items
              cart.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg font-medium text-sm bg-bg-canvas dark:bg-bg-canvas-dark border-2 border-border dark:border-border-element-dark shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]"
                >
                  <div className="p-2 border-b border-border dark:border-border-dark">
                    <div className="text-text-hi dark:text-text-hi-dark">{item.plan.name}</div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-primary dark:text-primary-dark font-semibold">${item.plan.price.toFixed(2)}</div>
                      </div>

                      {/* Quantity control */}
                      <div className="w-[100px]">
                        <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px]  rounded-md">
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          >
                            <Subtract className="text-text-lo dark:text-text-lo-dark" />
                          </div>
                          <span className="text-text-hi dark:text-text-hi-dark">{item.quantity}</span>
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          >
                            <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Tổng */}
                      <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(item.plan.price * item.quantity).toFixed(2)}</div>

                      {/* Xóa */}
                      <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => handleRemove(item)} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Render dedicated orders (backward compatibility)
              propOrders.map((o, index) => (
                <div
                  key={index}
                  className="rounded-lg font-medium text-sm bg-bg-canvas dark:bg-bg-canvas-dark border-2 border-border dark:border-border-element-dark shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]"
                >
                  <div className="p-2 border-b border-border dark:border-border-dark">
                    <div className="text-text-hi dark:text-text-hi-dark">{o.country.name}</div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-primary dark:text-primary-dark font-semibold">${o.price.toFixed(2)}</div>
                      </div>

                      {/* Quantity control */}
                      <div className="w-[100px]">
                        <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px]  rounded-md">
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity - 1)}
                          >
                            <Subtract className="text-text-lo dark:text-text-lo-dark" />
                          </div>
                          <span className="text-text-hi dark:text-text-hi-dark">{o.quantity}</span>
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity + 1)}
                          >
                            <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Tổng */}
                      <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(o.price * o.quantity).toFixed(2)}</div>

                      {/* Xóa */}
                      <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => onRemove && onRemove(o.country)} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA area fixed at bottom */}
          <MobileSummary
            orders={propOrders}
            total={total}
            totalIps={totalIps}
            totalLocation={totalLocation}
            useCartContext={useCartContext}
          />
        </div>
      )}
    </>
  );
};

export default OrderSummary;
