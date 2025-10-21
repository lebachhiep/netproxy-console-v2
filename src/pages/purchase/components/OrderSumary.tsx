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

export type OrderItemType = {
  country: Country;
  price: number;
  quantity: number;
};

interface Props {
  orders: OrderItemType[];
  onUpdateQuantity: (country: Country, quantity: number) => void;
  onRemove: (country: Country) => void;
  onClearAll: () => void; // Xóa tất cả
}

const OrderSummary: React.FC<Props> = ({ orders, onUpdateQuantity, onRemove, onClearAll }) => {
  const { isMobile, isTablet } = useResponsive();

  // Nếu giỏ hàng trống
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-270px)] bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark text-center p-8">
        <CartFilled className="w-16 h-16 text-text-lo dark:text-text-lo-dark mb-4 opacity-70" />
        <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">Giỏ hàng trống</h2>
        <p className="text-text-me dark:text-text-me-dark text-sm mb-6">Hãy chọn quốc gia để thêm IP vào giỏ hàng của bạn.</p>
      </div>
    );
  }
  const total = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const totalIps = orders.reduce((sum, o) => sum + o.quantity, 0);
  const totalLocation = orders.length;

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
              {orders.map((o) => (
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
                        onClick={() => onUpdateQuantity(o.country, o.quantity - 1)}
                      >
                        <Subtract className="text-text-lo dark:text-text-lo-dark " />
                      </div>
                      <span className="text-text-hi dark:text-text-hi-dark">{o.quantity}</span>
                      <div
                        className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                        onClick={() => onUpdateQuantity(o.country, o.quantity + 1)}
                      >
                        <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                      </div>
                    </div>
                  </div>

                  {/* Tổng */}
                  <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(o.price * o.quantity).toFixed(2)}</div>

                  {/* Nút xóa */}
                  <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => onRemove(o.country)} />
                </div>
              ))}
            </div>
          </div>

          <DesktopSummary orders={orders} total={total} totalIps={totalIps} totalLocation={totalLocation} />
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100dvh-64px)] bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 ">
            {orders.map((o, index) => (
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
                          onClick={() => onUpdateQuantity(o.country, o.quantity - 1)}
                        >
                          <Subtract className="text-text-lo dark:text-text-lo-dark" />
                        </div>
                        <span className="text-text-hi dark:text-text-hi-dark">{o.quantity}</span>
                        <div
                          className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer"
                          onClick={() => onUpdateQuantity(o.country, o.quantity + 1)}
                        >
                          <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Tổng */}
                    <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(o.price * o.quantity).toFixed(2)}</div>

                    {/* Xóa */}
                    <IconButton className="w-8 h-8" icon={<Delete className="w-5 h-5" />} onClick={() => onRemove(o.country)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA area fixed at bottom */}
          <MobileSummary orders={orders} total={total} totalIps={totalIps} totalLocation={totalLocation} />
        </div>
      )}
    </>
  );
};

export default OrderSummary;
