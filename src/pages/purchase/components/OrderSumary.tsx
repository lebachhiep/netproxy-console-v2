import React from 'react';
import { Country } from './table/CountrySelector';
import { SectionTitle } from '@/components/SectionTitle';
import { Add, Delete, Subtract } from '@/components/icons';
import { Divider } from '@/components/divider/Divider';
import { Button } from '@/components/button/Button';

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
  if (!orders.length) return null;

  const total = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const totalIps = orders.reduce((sum, o) => sum + o.quantity, 0);
  const totalLocation = orders.length;

  return (
    <>
      <div className="bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark p-5 min-h-[calc(100vh-270px)] flex flex-col">
        {/* Header */}
        {/* <SectionTitle text="Đơn hàng" icon={<Delete className="cursor-pointer text-text-lo dark:text-text-lo-dark" onClick={onClearAll} />} /> */}

        {/* Scrollable order list */}
        <div className="flex-1 mt-5 overflow-y-auto">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 pb-3 text-sm font-medium text-text-lo dark:text-text-lo-dark border-b border-border-element dark:border-border-element-dark">
            <span>Country</span>
            <span className="w-[42px] text-center">Giá</span>
            <span className="w-[100px] text-center">Số lượng</span>
            <span className="w-[60px] text-center">Tổng</span>
            <span className="w-[20px] text-center"></span>
          </div>

          {/* List items */}
          <div className="space-y-3 mt-3 mb-5">
            {orders.map((o) => (
              <div
                key={o.country.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 text-sm font-medium items-center border-b border-border-element dark:border-border-element-dark pb-2"
              >
                {/* Quốc gia */}
                <div className="text-text-hi dark:text-text-hi-dark">{o.country.name}</div>

                {/* Đơn giá */}
                <div className="w-[42px] text-center text-primary font-semibold">${o.price.toFixed(2)}</div>

                {/* Số lượng */}
                <div className="w-[100px]">
                  <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] border-2 border-border-element dark:border-border-element-dark rounded-md">
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

                {/* Nút xóa */}
                <div className="w-[20px] text-center">
                  <Delete className="cursor-pointer text-text-lo dark:text-text-lo-dark" onClick={() => onRemove(o.country)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + CTA (always fixed at bottom) */}
        <div className="border border-border-element dark:border-border-element-dark rounded-xl shadow-xs p-5 text-sm sticky bottom-5 bg-bg-canvas dark:bg-bg-canvas-dark">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
              <span className="text-text-me dark:text-text-me-dark text-sm font-medium">IP type:</span>
              <span className="font-semibold text-text-hi dark:text-text-hi-dark">Standard ISP IP</span>
            </div>
            <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
              <span className="text-text-me dark:text-text-me-dark text-sm font-medium">IP Duration:</span>
              <span className="font-semibold text-text-hi dark:text-text-hi-dark">30 days</span>
            </div>
            <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
              <span className="text-text-me dark:text-text-me-dark text-sm font-medium">IP Unit Price:</span>
              <span className="font-semibold text-text-hi dark:text-text-hi-dark">${orders[0].price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-border-element dark:border-border-element-dark pb-3">
              <span className="text-text-me dark:text-text-me-dark text-sm font-medium">Total location:</span>
              <span className="font-semibold text-text-hi dark:text-text-hi-dark">{totalLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-me dark:text-text-me-dark text-sm font-medium">Total number of IPs:</span>
              <span className="font-semibold text-text-hi dark:text-text-hi-dark">{totalIps}</span>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex justify-between items-center font-semibold text-lg">
              <div className="py-2">
                <span className="text-text-hi dark:text-text-hi-dark text-lg font-semibold font-averta">Tổng cộng:</span>
              </div>
              <div className="flex items-start gap-1 font-averta">
                <span className="text-green font-semibold text-lg tracking-[-0.66px]">$</span>
                <span className="font-semibold text-blue text-[33px] leading-[120%] tracking-[-0.66px]">{total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <Button className="w-full text-[12px]">MUA GÓI</Button>
              <p className="text-xs text-text-lo dark:text-text-lo-dark text-center mt-1 font-medium">Terms & conditions apply</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
