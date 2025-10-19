import React from 'react';
import { Badge, StatusColor } from '../badge/Badge';
import { Button } from '../button/Button';
import { ArrowRepeatAll, DataPie, DocumentTable, HourglassHalf } from '../icons';
import { Switch } from '../switch/Switch'; // nếu bạn dùng switch toggle

// Interfaces
export interface Feature {
  icon?: React.ReactNode;
  label: React.ReactNode;
}

export type ProxyType = 'rotating-proxy' | 'bandwidth-proxy';

export interface ProxyCardData {
  id: string | number;
  title: string;
  status?: { text: string; color?: StatusColor };
  planID?: string;
  dataLeft?: string; // ex: "50GB"
  expired?: string; // ex: "Dec 17, 2025"
  autoRenew: boolean;
  features?: Feature[];
  tag?: { text: string; icon?: React.ReactNode };
  type: ProxyType;
}

interface ProxyCardProps {
  data: ProxyCardData;
  onClick?: () => void;
  onRenewChange?: (id: number | string, checked: boolean) => void;
  buttonText?: string;
}

export const ProxyCard: React.FC<ProxyCardProps> = ({ data, onClick, buttonText, onRenewChange }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative w-full h-full rounded-xl border-2 border-border-element bg-bg-primary dark:bg-bg-primary-dark dark:border-border-element-dark hover:bg-bg-secondary dark:hover:bg-bg-secondary-dark hover:shadow-md shadow-xs p-5 flex flex-col gap-4 transition-all hover:border-primary hover:dark:border-primary-dark"
    >
      {/* Tag */}
      {data.tag && (
        <span className="absolute -top-3 left-0 flex items-center gap-1  bg-primary text-white text-xs font-semibold pl-1 pr-3 py-1 rounded-[50px_100px_100px_0] shadow">
          {data.tag.icon && <span className="text-sm">{data.tag.icon}</span>}
          {data.tag.text}
        </span>
      )}

      <div className="flex flex-col gap-5 text-text-me dark:text-text-me-dark group-hover:text-text-hi group-hover:dark:text-text-hi-dark">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold font-averta line-clamp-1">{data.title}</h3>
            {data.status && <Badge color={data.status.color}>{data.status.text}</Badge>}
          </div>
          {/* Button */}
          <Button
            onClick={onClick}
            variant="default"
            className="h-10 group-hover:bg-primary group-hover:dark:bg-primary-dark group-hover:border-primary-border group-hover:dark:border-primary-border-dark group-hover:!border-2 group-hover:text-white"
          >
            {buttonText || 'Chọn gói'}
          </Button>
        </div>

        {/* Features / Details */}
        <ul className="flex flex-col gap-4 text-base">
          {data.planID && (
            <li className="flex items-center gap-2">
              <DocumentTable />
              <div>
                <span className="font-semibold">PlanID: </span>
                <span>{data.planID}</span>
              </div>
            </li>
          )}
          {data.dataLeft && (
            <li className="flex items-center gap-2">
              <DataPie />
              <div>
                <span className="font-semibold">Data left: </span>
                <span>{data.dataLeft}</span>
              </div>
            </li>
          )}
          {data.expired && (
            <li className="flex items-center gap-2">
              <HourglassHalf />
              <div>
                <span className="font-semibold">Hết hạn: </span>
                <span>{data.expired}</span>
              </div>
            </li>
          )}

          {/* Các feature khác */}
          {data.features?.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {f.icon}
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
        {typeof data.autoRenew !== 'undefined' && (
          <div className="flex items-center justify-between rounded-lg p-2 bg-bg-mute dark:bg-bg-mute-dark">
            <li className="flex items-center gap-2">
              <ArrowRepeatAll />
              <span>Gia hạn tự động:</span>
            </li>
            <Switch checked={data.autoRenew} onChange={(value) => onRenewChange?.(data.id, value)} />
          </div>
        )}
      </div>
    </div>
  );
};
