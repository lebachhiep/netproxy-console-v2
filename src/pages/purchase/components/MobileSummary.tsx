import { Button } from '@/components/button/Button';
import { OrderItemType } from './OrderSumary';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { Chevron } from '@/components/icons';
import clsx from 'clsx';

export const MobileSummary = ({
  orders,
  totalIps,
  totalLocation,
  total
}: {
  total: number;
  orders: OrderItemType[];
  totalIps: number;
  totalLocation: number;
}) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);

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
          className={`${'flex flex-col gap-3 text-sm'} transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
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
              ${orders.length > 0 ? orders[0].price.toFixed(2) : '0.00'}
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
          <div className="flex justify-between items-center font-semibold text-lg">
            <div className="py-2">
              <span className="text-text-hi dark:text-text-hi-dark font-averta">Tổng cộng:</span>
            </div>
            <div className="flex items-start gap-1 font-averta">
              <span className="text-green font-semibold text-lg tracking-[-0.66px]">$</span>
              <span className="font-semibold text-blue text-[33px] leading-[120%] tracking-[-0.66px]">{total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Button className="w-full text-[12px]">MUA GÓI</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
