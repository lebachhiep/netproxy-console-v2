import { Badge } from '@/components/badge/Badge';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { BalanceCard } from '@/components/card/BalanceCard';
import { OverViewCard } from '@/components/card/OverViewCard';
import { PricingCard } from '@/components/card/PricingCard';
import { ProxyCard } from '@/components/card/ProxyCard';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { DatePicker } from '@/components/datepicker/DatePicker';
import {
  ArrowDown,
  ArrowRotate,
  CartFilled,
  Chevron,
  Clock,
  DatabaseStackFilled,
  DatabaseStackOutlined,
  ShieldCheckmark,
  TagFilled,
  TopSpeed,
  WalletCreditCardFilled
} from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { Modal } from '@/components/modal/Modal';
import { Radio } from '@/components/radio/Radio';
import { Select } from '@/components/select/Select';
import { SelectTag } from '@/components/select/SelectTag';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import Tag from '@/components/tag/Tag';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { FaRegCalendar } from 'react-icons/fa';
import { IoFlame, IoLanguage } from 'react-icons/io5';
import { ColorPalette } from './ColorPallete';
import { usePageTitle } from '@/hooks/usePageTitle';
import { t } from 'i18next';

export interface ProxyData {
  id: number;
  name: string;
  plan: string;
  status: 'Đang hoạt động' | 'Tạm dừng' | 'Hết hạn';
  expiryDate: string;
  action: string;
}

const ComponentPage = () => {
  const pageTitle = usePageTitle({ pageName: 'Components' });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [isOn, setIsOn] = useState(false);
  const [selected, setSelected] = useState('primary');
  const [checked, setChecked] = useState(false);
  // const [indeterminate, setIndeterminate] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);

  const data: ProxyData[] = [
    {
      id: 1,
      name: 'Proxy vip4 - 5GB',
      plan: 'ANH.EXP1DIP',
      status: 'Đang hoạt động',
      expiryDate: 'Dec 17, 2023',
      action: 'XEM'
    },
    {
      id: 2,
      name: 'Proxy vip3 - 3GB',
      plan: 'USA.EXP3DIP',
      status: 'Đang hoạt động',
      expiryDate: 'Sep 10, 2023',
      action: 'XEM'
    },
    {
      id: 3,
      name: 'Proxy vip2 - 1GB',
      plan: 'GER.EXP1DIP',
      status: 'Hết hạn',
      expiryDate: 'Aug 15, 2023',
      action: 'XEM'
    },
    {
      id: 4,
      name: 'Proxy vip1 - 500MB',
      plan: 'FRA.EXP1DIP',
      status: 'Đang hoạt động',
      expiryDate: 'Oct 5, 2023',
      action: 'XEM'
    },
    {
      id: 5,
      name: 'Proxy test - 2GB',
      plan: 'JPN.EXP2DIP',
      status: 'Đang hoạt động',
      expiryDate: 'Nov 20, 2023',
      action: 'XEM'
    }
  ];

  const columns: TableColumn<ProxyData>[] = [
    {
      key: 'id',
      title: t('STT'),
      width: '60px',
      align: 'center'
    },
    {
      key: 'name',
      title: 'Tên Gói',
      sortable: true
    },
    {
      key: 'plan',
      title: 'Mã ID',
      render: (value) => <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm font-mono">{value}</div>
    },
    {
      key: 'plan',
      title: 'Mã ID',
      render: (value) => <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm font-mono">{value}</div>
    },
    {
      key: 'plan',
      title: 'Mã ID',
      render: (value) => <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm font-mono">{value}</div>
    },
    // {
    //   key: 'status',
    //   title: 'Trạng thái',
    //   align: 'center',
    //   render: (status) => (
    //     <StatusBadge status={status} variant={status === 'Đang hoạt động' ? 'success' : status === 'Tạm dừng' ? 'warning' : 'error'} />
    //   )
    // },
    {
      key: 'expiryDate',
      title: 'Hết hạn',
      align: 'center',
      sortable: true
    },
    {
      fixed: 'right',
      key: 'action',
      title: 'Hành động',
      align: 'center',
      render: (_, record) => <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">{record.action}</button>
    }
  ];

  const buttons = [
    <IoLanguage size={24} key={1} />,
    <IoLanguage size={24} key={2} />,
    <FaRegCalendar size={24} key={3} />,
    <IoLanguage size={24} color="orange" key={4} />
  ];

  const options = [
    {
      value: '1',
      label: 'Option 1'
    },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  const optionsTagSelect = [
    {
      value: '1',
      label: 'Tag 1',
      icon: <TagFilled className="text-text-lo" />,
      badge: 40,
      badgeBg: 'bg-yellow-100',
      badgeColor: 'text-yellow-700',
      badgeBorder: 'border border-yellow-400'
    },
    {
      value: '2',
      label: 'Tag 2',
      labelColor: 'text-blue',
      icon: <TagFilled className="text-blue" />,
      badge: 12,
      badgeBg: 'bg-blue-bg',
      badgeColor: 'text-blue',
      badgeBorder: 'border border-blue-border'
    },
    {
      value: '3',
      label: 'Tag 3',
      labelColor: 'text-yellow-hi',
      icon: <TagFilled className="text-yellow" />,
      badge: 5,
      badgeBg: 'bg-yellow-bg',
      badgeColor: 'text-yellow',
      badgeBorder: 'border border-yellow'
    },
    {
      value: '4',
      label: 'Tag 4',
      labelColor: 'text-primary',
      icon: <TagFilled className="text-primary" />,
      badge: 5,
      badgeBg: 'bg-red-bg',
      badgeColor: 'text-yellow',
      badgeBorder: 'border border-red-border'
    },
    {
      value: '5',
      label: 'Tag 5',
      labelColor: 'text-green',
      icon: <TagFilled className="text-green" />,
      badge: 5,
      badgeBg: 'bg-green-bg',
      badgeColor: 'text-green',
      badgeBorder: 'border border-green-border'
    }
  ];

  return (
    <div className="flex flex-col gap-10 p-5 max-h-[calc(100vh-104px)] overflow-y-auto">
      {pageTitle}
      <div>
        <h1>Color pallete</h1>
        <ColorPalette />
      </div>
      <div>
        <h1>Button</h1>
        <div className="flex gap-4">
          <Button variant="default" icon={<ArrowDown />}>
            BUTTON
          </Button>

          <Button variant="primary" icon={<ArrowDown />}>
            BUTTON
          </Button>

          <Button variant="disabled" icon={<ArrowDown />}>
            BUTTON
          </Button>

          <Button variant="outlined" icon={<ArrowDown />}>
            BUTTON
          </Button>
        </div>
      </div>
      <div>
        <h1>Icon Button</h1>
        <div className="flex gap-4 p-4">
          {buttons.map((icon, index) => (
            <IconButton key={index} icon={icon} active={activeIndex === index} onClick={() => setActiveIndex(index)} />
          ))}
        </div>
      </div>

      <div>
        <h1>Tag</h1>
        <div className="flex gap-4 flex-wrap">
          <Tag variant="outline">Tag</Tag>
          <Tag variant="default">Tag</Tag>
          <Tag variant="solid" closable>
            Tag
          </Tag>
          <Tag variant="light">Tag</Tag>
        </div>
      </div>

      <div>
        <h1>Input</h1>
        <div className="flex gap-4 flex-wrap">
          {/* Ghi đè radius */}
          <InputField placeholder="Default" />
          <InputField placeholder="Left Icon" icon={<Chevron />} iconPosition="left" />
          <InputField placeholder="Right Icon" icon={<Chevron />} iconPosition="right" />
          <InputField placeholder="Full Radius" inputClassName="rounded-full" wrapperClassName="rounded-full" />
        </div>
      </div>

      <div>
        <h1>Select</h1>
        <div className="flex gap-4 flex-wrap">
          <Select
            className="dark:pseudo-border-top dark:border-transparent"
            options={options}
            placeholder="Chọn option"
            onChange={(val) => console.log('Selected:', val)}
          />
        </div>
        <h1>Tag Select</h1>
        <div className="flex gap-4 flex-wrap">
          <SelectTag options={optionsTagSelect} placeholder="Trạng thái" onChange={(val) => console.log('Selected:', val)} />
        </div>
      </div>

      <div>
        <h1>Card</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-blue-gradient rounded-[4px] text-white">
                <WalletCreditCardFilled />
              </div>
            }
            title="Số dư"
            mainContent="$50.00"
            subInfo={[{ label: 'Đã chi tiêu', value: '$20.00' }]}
            buttonText="NẠP THÊM"
          />

          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-yellow-gradient rounded-[4px] text-white">
                <CartFilled />
              </div>
            }
            title="Gói hoạt động"
            mainContent="5"
            subInfo={[{ label: 'Tổng gói', value: '10' }]}
            buttonText="MUA GÓI"
          />

          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-green-gradient rounded-[4px] text-white">
                <DatabaseStackFilled />
              </div>
            }
            title="Data usage"
            mainContent="256 MB"
            subInfo={[
              { label: 'Total Bandwidth Used', value: '10 GB' },
              {
                label: 'Remaining Bandwidth',
                value: '0.27 / 50 GB',
                highlight: true
              }
            ]}
            buttonText="CHI TIẾT"
            className="col-span-2"
          />

          {Array.from({ length: 4 }).map((_, index) => (
            <PricingCard
              key={index}
              tag={{ text: 'POPULAR', icon: <IoFlame className="w-3 h-3" /> }}
              title="Đổi IP 10 phút"
              price="4.50"
              description="Ideal proxies for any use case & purpose. By accessing our 10M+ IP pool non-subnet linked..."
              features={[
                {
                  icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
                  label: (
                    <div className="text-base">
                      <label htmlFor="">Hỗ trợ: </label>
                      <span className="font-bold">HTTP/HTTPS</span>
                    </div>
                  )
                },
                {
                  icon: <Clock className="w-6 h-6 text-yellow" />,
                  label: (
                    <div className="text-base">
                      <label htmlFor="">Thời gian xoay IP: </label>
                      <span className="font-bold">10 phút</span>
                    </div>
                  )
                },
                {
                  icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
                  label: (
                    <div className="text-base">
                      <label htmlFor="">Băng thông: </label>
                      <span className="font-bold">Không giới hạn</span>
                    </div>
                  )
                },
                {
                  icon: <ArrowRotate className="w-6 h-6 text-blue" />,
                  label: (
                    <div className="text-base">
                      <label htmlFor="">Lượt xoay IP: </label>
                      <span className="font-bold">Không giới hạn</span>
                    </div>
                  )
                },
                {
                  icon: <TopSpeed className="w-6 h-6 text-pink" />,
                  label: (
                    <div className="text-base">
                      <label htmlFor="">Tăng tốc: </label>
                      <span className="font-bold">50Mbps</span>
                    </div>
                  )
                }
              ]}
              buttonText="MUA GÓI"
              onClick={() => alert('Mua gói')}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProxyCard
              key={index}
              data={{
                id: 1,
                title: 'Proxy - Băng thông',
                status: { text: 'Đang hoạt động', color: 'green' },
                planID: 'ANH.EXP1DIP',
                dataLeft: '5GB',
                expired: 'Dec 17, 2023',
                autoRenew: false,
                tag: { text: 'POPULAR', icon: <IoFlame className="w-3 h-3" /> },
                type: 'bandwidth-proxy'
              }}
            />
          ))}
        </div>
        <div>
          <h1>Balance Card</h1>
          <div className="flex items-center gap-2">
            <div className="w-[420px]">
              <BalanceCard balance={825.097} spent={20} owner="LÊ BẠCH HIỆP" variant="black" />
            </div>
            <div className="w-[420px]">
              <BalanceCard balance={825.097} spent={20} owner="LÊ BẠCH HIỆP" variant="blue" />
            </div>
            <div className="w-[420px]">
              <BalanceCard balance={825.097} spent={20} owner="LÊ BẠCH HIỆP" variant="yellow" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1>Controls</h1>
        <div className="flex items-center gap-5">
          <Switch checked={isOn} onChange={setIsOn} variant="primary" size="sm" />
          <Switch checked={isOn} onChange={setIsOn} variant="danger" size="md" />
          <Switch checked={isOn} onChange={setIsOn} variant="warning" size="lg" disabled />

          <Radio checked={selected === 'primary'} onChange={() => setSelected('primary')} label="Primary" variant="primary" />
          <Radio checked={selected === 'success'} onChange={() => setSelected('success')} label="Success" variant="success" />
          <Radio checked={selected === 'danger'} onChange={() => setSelected('danger')} label="Danger disabled" variant="danger" disabled />

          <Checkbox checked={checked} indeterminate={false} onChange={setChecked} label="Custom Checkbox" />
        </div>
      </div>

      <div>
        <h1>Badge</h1>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="filled" size="md" color="green">
            Complete
          </Badge>
          <Badge variant="filled" size="md" color="blue">
            Complete
          </Badge>
          <Badge variant="filled" size="md" color="gray">
            Complete
          </Badge>
          <Badge variant="filled" size="md" color="red">
            Complete
          </Badge>
          <Badge variant="filled" size="md" color="yellow">
            Complete
          </Badge>
          <Badge variant="solid" size="md" color="green">
            Complete
          </Badge>
          <Badge variant="solid" size="md" color="blue">
            Complete
          </Badge>
          <Badge variant="solid" size="md" color="gray">
            Complete
          </Badge>
          <Badge variant="solid" size="md" color="red">
            Complete
          </Badge>
          <Badge variant="solid" size="md" color="yellow">
            Complete
          </Badge>
        </div>
      </div>
      <div>
        <h1>DatePicker</h1>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div>
        <h1>Table</h1>
        <Table
          className="min-h-[500px]"
          scroll={{ x: 300 }}
          data={data}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              console.log('Selected:', keys, rows);
            }
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data.length,
            pageSizeOptions: [2, 4, 6, 8],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
          onRowClick={(record, index) => {
            console.log('Row clicked:', record, index);
          }}
        />
      </div>
      <div>
        <h1>Modal</h1>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          title="Thông báo"
          onClose={() => setOpen(false)}
          cancelButton={
            <Button size="sm" key="action2" variant="default" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
          actions={[
            <Button key="action2" variant="outlined">
              Action 2
            </Button>,
            <Button key="action1" variant="primary">
              Action 1
            </Button>
          ]}
        >
          <div>Content Modal</div>
        </Modal>
      </div>
    </div>
  );
};

export default ComponentPage;
