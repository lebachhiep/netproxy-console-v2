import { SectionTitle } from '@/components/SectionTitle';
import React from 'react';

interface PricingItem {
  range: string; // ví dụ: "1-9 IPs"
  desc: string; // ví dụ: "$5/IP"
  price: number;
}

interface PricingTableProps {
  items: PricingItem[];
}

const PricingTable: React.FC<PricingTableProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* <SectionTitle text={'Bảng giá IPS'} /> */}
      <div className="overflow-x-auto">
        <div className="inline-grid min-w-full rounded-lg border-2 border-border-element dark:border-border-element-dark">
          {/* Header */}
          <div
            className="grid divide-x-2 divide-border-element dark:divide-border-element-dark bg-yellow-bg dark:bg-[#2B405A] rounded-t-lg text-center"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="py-[6px] px-[2px] md:px-3 text-[10px] md:text-sm font-medium md:font-semibold text-primary dark:text-primary-dark"
              >
                {item.range}
              </div>
            ))}
          </div>

          {/* Body */}
          <div
            className="border-t-2 border-border-element dark:border-border-element-dark grid divide-x-2 divide-border-element dark:divide-border-element-dark text-center"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item, idx) => (
              <div key={idx} className="py-[6px] px-2 md:px-3 text-[10px] md:text-sm font-semibold text-text-me dark:text-text-me-dark">
                {item.desc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
