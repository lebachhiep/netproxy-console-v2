import { Badge } from '@/components/badge/Badge';
import { ActionButtons } from '@/components/button/ActionButtons';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { ProxyCardData } from '@/components/card/ProxyCard';
import {
  ArrowCounter,
  Chevron,
  ContentCopy,
  Eye,
  EyeOff,
  FileCopy,
  Globe,
  Key,
  Language,
  Location,
  MagnifyingGlass,
  TagFilled
} from '@/components/icons';
import { ApiInput } from '@/components/input/ApiInput';
import { Input } from '@/components/input/Input';
import { Modal } from '@/components/modal/Modal';
import { Select } from '@/components/select/Select';
import { SelectTag } from '@/components/select/SelectTag';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { Tabs } from '@/components/tabs/Tabs';
import Tooltip from '@/components/tooltip/Tooltip';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SubscriptionWithPlan } from '@/types/subscription';
import { ProxyConnectionInfo } from './ProxyConnectionInfo';

// Fake data type
export interface ProxyData {
  id: string;
  name: string;
  key: string;
  location: string;
}

export const locationOptions = [
  { label: 'Việt Nam', value: 'VN' },
  { label: 'Mỹ', value: 'US' },
  { label: 'Nhật Bản', value: 'JP' },
  { label: 'Singapore', value: 'SG' }
];

// Fake data
const tableData: ProxyData[] = [
  { id: '1', name: 'Proxy xoay - 5GB', key: 'ABC123', location: 'VN' },
  { id: '2', name: 'Proxy xoay - 10GB', key: 'DEF456', location: 'US' },
  { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' }
];

// Columns definition

export const columnsBandwidth: TableColumn<ProxyData>[] = [
  {
    key: 'select',
    title: 'STT',
    render: (_, __, index) => <>{index + 1}</>,
    width: 50,
    align: 'center'
  },
  {
    sortable: true,
    key: 'name',
    title: (
      <div className="flex items-center gap-1">
        <Globe className="text-text-lo dark:text-text-lo-dark" />
        <span>Proxy IP</span>
      </div>
    ),
    render: (value) => <div>{value}</div>,
    width: 140
  },
  {
    key: 'location',
    title: (
      <div className="flex items-center gap-1">
        <Location className="text-text-lo dark:text-text-lo-dark" />
        <span>Vị trí</span>
      </div>
    ),
    render: (value) => (
      <Select
        labelClassName="font-medium text-text-me "
        className="h-8 dark:pseudo-border-top dark:border-transparent"
        options={locationOptions}
        value={value}
        onChange={(newValue) => console.log('Selected:', newValue)}
      />
    ),

    width: 150
  },
  {
    key: 'type',
    title: 'Type',
    render: (value) => <div>Business</div>,
    width: 140
  },

  {
    align: 'center',
    key: 'active',
    title: 'Hoạt động',
    render: (value) => <Badge color="green">1222 Phút</Badge>,
    width: 140
  },

  {
    key: 'action',
    title: 'Hành động',
    render: () => (
      <Button variant="default" icon={<Language className="text-text-lo text-sm" />} className="h-8">
        Lấy Proxy
      </Button>
    ),
    width: 135,
    align: 'center',
    fixed: 'right'
  }
];

export const optionsTagSelect = [
  {
    value: '1',
    label: 'Tag 1',
    icon: <TagFilled className="text-text-lo dark:text-text-lo-dark" />,
    badge: 40,
    badgeBg: 'bg-yellow-bg dark:bg-yellow-bg-dark',
    badgeColor: 'text-yellow dark:text-yellow-dark',
    badgeBorder: 'border border-yellow dark:border-border-yellow-dark'
  },
  {
    value: '2',
    label: 'Tag 2',
    labelColor: 'text-blue dark:text-blue-dark',
    icon: <TagFilled className="text-blue dark:text-blue-dark" />,
    badge: 12,
    badgeBg: 'bg-blue-bg dark:bg-blue-bg-dark',
    badgeColor: 'text-blue dark:text-blue-dark',
    badgeBorder: 'border border-blue-border dark:border-blue-border-dark'
  },
  {
    value: '3',
    label: 'Tag 3',
    labelColor: 'text-yellow dark:text-yellow-dark',
    icon: <TagFilled className="text-yellow dark:text-yellow-dark" />,
    badge: 5,
    badgeBg: 'bg-yellow-bg dark:bg-yellow-bg-dark',
    badgeColor: 'text-yellow dark:text-yellow-dark',
    badgeBorder: 'border border-yellow dark:border-yellow-border-dark'
  },
  {
    value: '4',
    label: 'Tag 4',
    labelColor: 'text-primary dark:text-primary-dark',
    icon: <TagFilled className="text-primary dark:text-primary-dark" />,
    badge: 5,
    badgeBg: 'bg-red-bg dark:bg-red-bg-dark',
    badgeColor: 'text-yellow dark:text-yellow-dark',
    badgeBorder: 'border border-red-border dark:border-red-border-dark'
  },
  {
    value: '5',
    label: 'Tag 5',
    labelColor: 'text-green dark:text-green-dark',
    icon: <TagFilled className="text-green dark:text-green-dark" />,
    badge: 5,
    badgeBg: 'bg-green-bg dark:bg-green-bg-dark',
    badgeColor: 'text-green dark:text-green-dark',
    badgeBorder: 'border border-green-border dark:border-green-border-dark'
  }
];

export const countryOptions = [
  { label: 'Việt Nam', value: 'VN' },
  { label: 'Mỹ', value: 'US' },
  { label: 'Nhật Bản', value: 'JP' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Hàn Quốc', value: 'KR' },
  { label: 'Anh', value: 'UK' }
];

// Tabs - only connection info now since each subscription has one proxy
export const proxyTabs = [{ key: 'connection', label: 'Thông tin kết nối' }];

interface ProxyDetailModalProps {
  open: boolean;
  item?: ProxyCardData | null;
  subscription?: SubscriptionWithPlan | null;
  username?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevItem?: ProxyCardData | null;
  nextItem?: ProxyCardData | null;
}

interface HeaderInfoProps {
  expired?: string;
  dataLeft?: string;
  autoRenew: boolean;
  onAutoRenewChange: (val: boolean) => void;
}

export const HeaderInfo: React.FC<HeaderInfoProps> = ({ expired, dataLeft, autoRenew, onAutoRenewChange }) => {
  return (
    <div className="border-b-[2px] border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark">
      <div className="flex items-start justify-between py-3 px-5 w-full max-w-[473px]">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-text-hi dark:text-text-hi-dark">
            <label className="text-sm min-w-[106px]">Ngày hết hạn</label>
            <span className="font-semibold text-sm">{expired}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-text-hi dark:text-text-hi-dark text-sm min-w-[106px]">Data left</label>
            <div className="text-sm">
              <span className="text-primary dark:text-primary-dark font-medium">{dataLeft}</span>
              <span className="font-normal text-text-hi dark:text-text-hi-dark"> / 50 GB</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-hi dark:text-text-hi-dark text-sm">Tự động gia hạn</span>
          <Switch checked={autoRenew} onChange={onAutoRenewChange} />
        </div>
      </div>
    </div>
  );
};

export const ProxyDetailModal: React.FC<ProxyDetailModalProps> = ({
  open,
  item,
  subscription,
  username,
  onClose,
  onPrev,
  onNext,
  nextItem,
  prevItem
}) => {
  if (!item) return null;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [isHideApiValue, setIsHideApiValue] = useState(true);
  const [apiValue, _] = useState('https://api.netproxy.io/api/bandwidthProxy/getProxies?apiKey=823321...');

  const columns: TableColumn<ProxyData>[] = [
    {
      key: 'select',
      title: 'STT',
      render: (_, __, index) => <>{index + 1}</>,
      width: 50,
      align: 'center'
    },
    { key: 'name', title: 'Tên Gói', width: 200, sortable: true },
    {
      key: 'key',
      title: (
        <div className="flex items-center gap-1">
          <Key className="text-text-lo dark:text-text-lo-dark" />
          <span>Key</span>
        </div>
      ),
      render: (value) => (
        <div className="flex items-center justify-between">
          <span>•••</span>
          <ContentCopy className="text-blue cursor-pointer" />
        </div>
      ),
      width: 140
    },
    {
      key: 'location',
      title: (
        <div className="flex items-center gap-1">
          <Location className="text-text-lo dark:text-text-lo-dark" />
          <span>Vị trí</span>
        </div>
      ),
      render: (value) => (
        <Select
          labelClassName="font-medium text-text-me"
          className="h-8 dark:pseudo-border-top dark:border-transparent"
          options={locationOptions}
          value={value}
          onChange={(newValue) => console.log('Selected:', newValue)}
        />
      ),

      width: 150
    },
    {
      width: 200,
      key: 'action',
      title: 'Hành động',
      render: () => (
        <Button variant="default" icon={<Language className="text-text-lo text-sm" />} className="h-8">
          Lấy Proxy
        </Button>
      ),
      align: 'center',
      fixed: 'right'
    }
  ];

  return (
    <Modal
      bodyClassName="flex-1 overflow-hidden flex flex-col"
      className="rounded-none max-w-[1085px] w-[80%] relative flex flex-col h-full"
      open={open}
      onClose={onClose}
      title={item.title || 'Chi tiết'}
    >
      <div className="absolute z-50 -left-[70px] top-1/2 -translate-y-1/2">
        <Tooltip content={prevItem?.title} className="w-[125px] line-clamp-2 text-wrap text-center">
          {/* Nút Prev */}
          <IconButton
            className="bg-bg-secondary dark:bg-bg-secondary-dark shadow-xs"
            icon={<Chevron className="text-2xl" />}
            onClick={onPrev}
            disabled={!onPrev}
          />
        </Tooltip>
      </div>

      <div className="absolute z-[101] -right-[70px] top-1/2 -translate-y-1/2">
        <Tooltip content={nextItem?.title} className="w-[125px] line-clamp-2 text-wrap text-center">
          {/* Nút Next */}
          <IconButton
            className="bg-bg-secondary dark:bg-bg-secondary-dark  shadow-xs"
            icon={<Chevron className="text-2xl rotate-180" />}
            onClick={onNext}
            disabled={!onNext}
          />
        </Tooltip>
      </div>

      {/* Nội dung modal */}
      <div className="h-full bg-bg-canvas dark:bg-bg-canvas-dark flex flex-col overflow-auto">
        {subscription && <ProxyConnectionInfo subscription={subscription} username={username} />}
      </div>

      <div className="absolute -translate-x-1/2 bottom-[72px] left-1/2 z-50">
        <ActionButtons />
      </div>
    </Modal>
  );
};
