import { Badge } from '@/components/badge/Badge';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { OverViewCard } from '@/components/card/OverViewCard';
import { ProxyCard, ProxyCardData } from '@/components/card/ProxyCard';
import {
  Add,
  AppsList,
  ArrowCounter,
  CartFilled,
  DatabaseStackFilled,
  Grid,
  MagnifyingGlass,
  Storage,
  TopSpeed,
  WalletCreditCardFilled
} from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { useMemo, useState } from 'react';
import DepositFlowModal from '../wallet/components/modal/DepositFlowModal';
import { ProxyDetailModal } from './components/modal/ProxyDetailModal';
import { useNavigate } from 'react-router-dom';
import { DataUsageModal } from './components/modal/DataUsageModal';

const data: ProxyCardData[] = [
  {
    id: 1,
    title: 'UK Bandwidth Proxy - 5GB / 30 ngày',
    planID: 'ANH.EXP1DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '5GB',
    expired: 'Dec 17, 2023',
    autoRenew: false,
    type: 'bandwidth-proxy'
  },
  {
    id: 2,
    title: 'US Bandwidth Proxy - 3GB / 7 ngày',
    planID: 'USA.EXP3DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '3GB',
    expired: 'Sep 10, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  },
  {
    id: 3,
    title: 'Germany Rotating Proxy - 1GB / 3 ngày',
    planID: 'GER.EXP1DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '1GB',
    expired: 'Aug 15, 2023',
    autoRenew: true,
    type: 'rotating-proxy'
  },
  {
    id: 4,
    title: 'France Rotating Proxy - 500MB / 1 ngày',
    planID: 'FRA.EXP1DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '500MB',
    expired: 'Oct 5, 2023',
    autoRenew: true,
    type: 'rotating-proxy'
  },
  {
    id: 5,
    title: 'Japan Bandwidth Proxy - 2GB / 15 ngày',
    planID: 'JPN.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '2GB',
    expired: 'Nov 20, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  },
  {
    id: 6,
    title: 'Singapore Bandwidth Proxy - 4GB / 30 ngày',
    planID: 'SGP.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '4GB',
    expired: 'Nov 22, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  },
  {
    id: 7,
    title: 'Canada Rotating Proxy - 1.5GB / 14 ngày',
    planID: 'CAN.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '1.5GB',
    expired: 'Dec 1, 2023',
    autoRenew: true,
    type: 'rotating-proxy'
  },
  {
    id: 8,
    title: 'Australia Bandwidth Proxy - 6GB / 30 ngày',
    planID: 'AUS.EXP3DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '6GB',
    expired: 'Dec 12, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  },
  {
    id: 9,
    title: 'Netherlands Rotating Proxy - 750MB / 7 ngày',
    planID: 'NLD.EXP1DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '750MB',
    expired: 'Nov 25, 2023',
    autoRenew: true,
    type: 'rotating-proxy'
  }
];

const DashboardPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tableData, setTableData] = useState<ProxyCardData[]>(data);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProxyCardData | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [openDataUsageModal, setOpenDataUsageModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleAutoRenewChange = (id: number | string, checked: boolean) => {
    console.log({ id });
    setTableData((prev) => prev.map((item) => (item.id === id ? { ...item, autoRenew: checked } : item)));
  };

  // Khi click vào Card hoặc row
  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const columns: TableColumn<ProxyCardData>[] = [
    {
      key: 'id',
      title: 'STT',
      width: '50px',
      align: 'center',
      render: (value, _, index) => index + 1
    },
    {
      key: 'title',
      title: 'Tên Gói',
      align: 'left',
      width: '200px',
      sortable: true
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (value) => <div>{value || '...'}</div>,
      width: 200
    },
    {
      width: 150,
      key: 'autoRenew',
      title: 'Tự động gia hạn',
      align: 'center',
      render: (_, record) => (
        <Switch size="md" checked={record.autoRenew} onChange={(checked) => handleAutoRenewChange(record.id, checked)} />
      )
    },
    {
      width: 150,
      key: 'status',
      title: 'Trạng thái',
      align: 'center',
      render: (status) => <Badge color={status.color}>{status?.text || '-'}</Badge>
    },
    {
      key: 'expired',
      title: 'Hết hạn'
    },
    {
      width: 200,
      fixed: 'right',
      key: 'buttonText',
      title: 'Hành động',
      align: 'center',
      render: (_, record, index) => (
        <Button variant="default" className="px-3 py-[7.5px] h-[32px]" onClick={() => handleItemClick(index)}>
          QUẢN LÝ
        </Button>
      )
    }
  ];

  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return tableData;

    return [...tableData].sort((a, b) => {
      const v1 = a[sortField as keyof ProxyCardData];
      const v2 = b[sortField as keyof ProxyCardData];

      if (typeof v1 === 'number' && typeof v2 === 'number') {
        return sortOrder === 'asc' ? v1 - v2 : v2 - v1;
      }
      return sortOrder === 'asc' ? String(v1).localeCompare(String(v2)) : String(v2).localeCompare(String(v1));
    });
  }, [sortField, sortOrder, tableData]);

  const prevItem = selectedIndex !== null && selectedIndex > 0 ? sortedData[selectedIndex - 1] : null;
  const nextItem = selectedIndex !== null && selectedIndex < sortedData.length - 1 ? sortedData[selectedIndex + 1] : null;

  return (
    <>
      <div className="p-5 bg-bg-primary dark:bg-bg-primary-dark">
        <div
          className="grid h-[212px] gap-5"
          style={{
            gridTemplateColumns: 'repeat(2, minmax(0, 264px)) 1fr 1fr'
          }}
        >
          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-blue-gradient rounded-[4px] text-white">
                <WalletCreditCardFilled />
              </div>
            }
            title="Số dư"
            mainContent={
              <div className="flex items-start gap-[2px] font-averta">
                <span className="text-green font-semibold text-sm tracking-[-0.66px]">$</span>
                <span className="text-blue dark:text-blue-dark font-semibold text-xl">50.00</span>
              </div>
            }
            subInfo={[{ label: 'Đã chi tiêu', value: '$20.00' }]}
            buttonText="NẠP THÊM"
            onButtonClick={() => setOpen(true)}
          />

          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-yellow-gradient rounded-[4px] text-white">
                <CartFilled />
              </div>
            }
            title="Các gói hoạt động"
            mainContent={
              <div className="">
                <span className="text-primary dark:text-primary-dark font-semibold text-xl tracking-[-0.3px] font-averta">5</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> Gói đang hoạt động</span>
              </div>
            }
            subInfo={[{ label: 'Tổng gói', value: '10 gói' }]}
            buttonText="MUA THÊM"
            onButtonClick={() => navigate('/buy')}
          />
          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-green-gradient rounded-[4px] text-white">
                <TopSpeed />
              </div>
            }
            title="Hiệu suất & khả dụng"
            mainContent={
              <div className="">
                <span className="text-green dark:text-green-dark font-semibold text-xl tracking-[-0.3px] font-averta">256</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> Mbps</span>
              </div>
            }
            subInfo={[
              {
                label: 'Proxy khả dụng:',
                value: (
                  <div className="">
                    <span className="text-green dark:text-green-dark font-semibold text-sm">12.535</span>
                    <span className="text-text-hi dark:text-green-dark font-semibold text-sm"> Ports</span>
                  </div>
                )
              }
            ]}
            //subInfo={[{ label: 'Cổng proxy khả dụng', value: '10.153 Ports' }]}
          />

          <OverViewCard
            icon={
              <div className="flex justify-center items-center w-10 h-10 bg-purple-gradient rounded-[4px] text-white">
                <Storage />
              </div>
            }
            title="Máy chủ & IP"
            mainContent={
              <div className="">
                <span className="text-pink dark:text-pink-dark font-semibold text-xl tracking-[-0.3px] font-averta">5</span>
                <span className="text-text-lo dark:text-text-lo-dark font-semibold text-sm font-averta"> / 20</span>

                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> hoạt động</span>
              </div>
            }
            subInfo={[
              {
                label: 'Tổng số IP:',
                value: (
                  <div className="">
                    <span className="text-pink dark:text-pink-dark font-semibold text-sm">123.985</span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> IPs</span>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
      <div className="p-5 pb-2 bg-bg-primary dark:bg-bg-primary-dark">
        <div className="flex items-center gap-2">
          <p className="text-text-lo dark:text-text-lo-dark text-sm tracking-[0.52px] font-ibm-plex-mono uppercase">Gói đang hoạt động</p>
          <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1"></div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Input
            placeholder="Tìm kiếm"
            wrapperClassName="bg-bg-input border-2 h-10"
            icon={<MagnifyingGlass />}
            onChange={(e) => console.log(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <IconButton
              className="w-10 h-10"
              icon={viewMode === 'list' ? <AppsList /> : <Grid />}
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            />
            <IconButton className="w-10 h-10" icon={<ArrowCounter />} />
            <IconButton icon={<Add className="text-white" />} className="bg-primary w-10 h-10 border-primary-border hover:bg-primary" />
          </div>
        </div>
      </div>
      <div>
        {viewMode === 'list' ? (
          <Table
            className="min-h-[calc(100dvh-465px)]"
            scroll={{ x: 300, y: 'calc(100dvh - 505px)' }}
            data={sortedData}
            columns={columns}
            // rowSelection={{
            //   selectedRowKeys,
            //   onChange: (keys, rows) => setSelectedRowKeys(keys)
            // }}
            pagination={{
              current: currentPage,
              pageSize,
              total: data.length,
              showSizeChanger: true,
              pageSizeOptions: [2, 4, 6, 8],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }
            }}
            rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
            size="large"
            bordered={false}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field, order) => {
              console.log({ field, order });
              setSortField(field);
              setSortOrder(order);
            }}
          />
        ) : (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] shadow-xxs z-10 border-t-2 border-border-element dark:border-border-element-dark" />
            <div
              className="overflow-y-auto h-[calc(100vh-460px)]
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 p-5"
            >
              {tableData.map((item, index) => (
                <ProxyCard
                  data={item}
                  buttonText={'Quản lý'}
                  onRenewChange={handleAutoRenewChange}
                  onButtonClick={() => handleItemClick(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ProxyDetailModal
        open={modalOpen}
        item={selectedIndex !== null ? sortedData[selectedIndex] : null}
        prevItem={prevItem}
        nextItem={nextItem}
        onClose={() => setModalOpen(false)}
        onPrev={prevItem ? () => setSelectedIndex((prev) => (prev !== null ? prev - 1 : prev)) : undefined}
        onNext={nextItem ? () => setSelectedIndex((prev) => (prev !== null ? prev + 1 : prev)) : undefined}
      />

      <DepositFlowModal open={open} onClose={() => setOpen(false)} />
      <DataUsageModal open={openDataUsageModal} onClose={() => setOpenDataUsageModal(false)} />
    </>
  );
};

export default DashboardPage;
