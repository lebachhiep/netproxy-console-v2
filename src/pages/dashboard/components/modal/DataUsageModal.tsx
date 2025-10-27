import { Modal } from '@/components/modal/Modal';
import { Select } from '@/components/select/Select';
import { useState } from 'react';
import DataUsageChart from '../charts/DataUsageChart';

const data = [
  { name: 'T1', bandwidth: 300, projected: 400, concurrency: 200 },
  { name: 'T2', bandwidth: 250, projected: 380, concurrency: 220 },
  { name: 'T3', bandwidth: 280, projected: 420, concurrency: 260 },
  { name: 'T4', bandwidth: 350, projected: 500, concurrency: 300 },
  { name: 'T5', bandwidth: 320, projected: 480, concurrency: 280 },
  { name: 'T6', bandwidth: 330, projected: 500, concurrency: 300 },
  { name: 'T7', bandwidth: 300, projected: 520, concurrency: 310 },
  { name: 'T8', bandwidth: 780, projected: 560, concurrency: 350 },
  { name: 'T9', bandwidth: 500, projected: 600, concurrency: 320 },
  { name: 'T10', bandwidth: 550, projected: 640, concurrency: 330 },
  { name: 'T11', bandwidth: 580, projected: 660, concurrency: 340 },
  { name: 'T12', bandwidth: 600, projected: 700, concurrency: 360 }
];

const dataUsageOptions = [
  { value: 'all', label: 'Chọn Data Usage' },
  { value: 'download', label: 'Download' },
  { value: 'upload', label: 'Upload' }
];

const billingCycleOptions = [
  { value: 'this_cycle', label: 'This Billing Cycle' },
  { value: 'last_month', label: 'Last Month' }
];

export const DataUsageModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [usage, setUsage] = useState<string | number>('all');
  const [billing, setBilling] = useState<string | number>('this_cycle');
  return (
    <Modal open={open} onClose={onClose} title="Data usage" className="max-w-[558px] w-full">
      <div>
        {/* Filter row */}
        <div className="grid grid-cols-2 gap-3 p-5">
          <Select options={dataUsageOptions} value={usage} onChange={(val) => setUsage(val)} className="w-full dark:pseudo-border-top dark:border-transparent" />
          <Select options={billingCycleOptions} value={billing} onChange={(val) => setBilling(val)} className="w-full dark:pseudo-border-top dark:border-transparent" />
        </div>

        {/* Chart */}
        <DataUsageChart />

        {/* Footer summary */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Bandwidth Used', value: '10 GB' },
              {
                label: 'Total brandwidth',
                value: (
                  <div>
                    <span className="text-primary font-medium">40.8</span>
                    <span> / </span>
                    <span className="font-normal">50 GB</span>
                  </div>
                ),
                highlight: true
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col rounded-lg bg-bg-mute dark:bg-bg-mute-dark px-3 py-2">
                <div className="font-semibold text-base text-text-hi dark:text-text-hi-dark">{item.value}</div>
                <span className="text-text-me text-sm dark:text-text-me-dark">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
