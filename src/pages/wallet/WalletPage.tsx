import { Badge } from '@/components/badge/Badge';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { BalanceCard } from '@/components/card/BalanceCard';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { InputField } from '@/components/input/InputField';
import { SectionTitle } from '@/components/SectionTitle';
import { Select } from '@/components/select/Select';
import { Slider } from '@/components/slider/Slider';
import { Table, TableColumn } from '@/components/table/Table';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import DepositFlowModal from './components/modal/DepositFlowModal';
import { Transaction } from '../history/HistoryPage';
import { useResponsive } from '@/hooks/useResponsive';
import { toast } from 'sonner';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { formatCurrency } from '@/utils/currency';
import clsx from 'clsx';

const services = ['Nạp tiền', 'Gia hạn hosting', 'Mua domain', 'Thanh toán VPS', 'Gia hạn email', 'Mua SSL'];

const statuses = [
  { text: 'Đang hoạt động', color: 'green' },
  { text: 'Hoàn thành', color: 'blue' },
  { text: 'Đã hủy', color: 'red' }
];

export const tableData: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const randomService = services[Math.floor(Math.random() * services.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomAmount = (Math.random() * 100 + 5).toFixed(2);
  const randomDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];

  return {
    id: `TX${i + 1}`,
    service: randomService,
    amount: parseFloat(randomAmount),
    description: `${randomService} mô tả fake ${i + 1}`,
    status: randomStatus,
    date: randomDate
  };
});

const options = [
  {
    value: 'ACB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">ACB</span>
      </div>
    )
  },
  {
    value: 'VCB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">VCB</span>
      </div>
    )
  },
  {
    value: 'TPB',
    label: (
      <div>
        <span className="font-medium">Ngân hàng nội địa - </span>
        <span className="text-primary font-bold">TPB</span>
      </div>
    )
  }
];

const WalletPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | number>('ACB');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const paginatedData = tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [priceValue, setPriceValue] = useState(10);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      render: (_value, _record, index) => index + 1
    },
    {
      key: 'id',
      title: 'Mã',
      width: '160px',
      align: 'left',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-between">
          <span>{value}</span>
          <ContentCopy
            className="text-blue cursor-pointer"
            onClick={() => {
              copyToClipboard(value);
              toast.success('Đã sao chép mã giao dịch vào clipboard');
            }}
          />
        </div>
      )
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'service',
      title: 'Dịch vụ',
      align: 'left',
      render: (value) => value || '...'
    },
    {
      key: 'amount',
      title: 'Số tiền',
      width: '120px',
      render: (value) => `$ ${Number(value).toFixed(2)}`
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'description',
      title: 'Mô tả',
      align: 'left',
      render: (value) => <div className="truncate max-w-[220px]">{value || '...'}</div>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: '160px',
      align: 'center',
      render: (status) => <Badge color={status?.color || 'gray'}>{status?.text || '-'}</Badge>
    },
    {
      key: 'date',
      title: 'Thời gian',
      width: isMobile || isTablet ? 120 : 200,
      fixed: 'right',
      render: (value) =>
        value ? (
          <span>
            {new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })}
          </span>
        ) : (
          '-'
        )
    }
  ];

  return (
    <div className="overflow-y-auto h-[calc(100dvh)] md:h-[calc(100dvh-104px)] flex flex-col">
      <div className="flex flex-col lg:flex-row items-center gap-5 p-5">
        {/* Left Panel - Top Up Form */}
        <div className="flex-1 p-5 shadow-md rounded-xl border border-border-element dark:border-border-element-dark">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1">Nạp thêm tiền vào ví</h3>
              {/* Amount Display */}
              <div>
                <InputField
                  wrapperClassName="h-10"
                  value={formatCurrency('' + priceValue)}
                  onChange={(e) => setPriceValue(Math.min(+e.target.value, 1000))}
                />

                {/* Slider */}
                <div className="mt-2">
                  <Slider
                    min={10}
                    max={1000}
                    step={5}
                    value={priceValue}
                    onValueChange={setPriceValue}
                    formatValue={(val) => `$${val.toLocaleString()}`}
                    labels={['$10.00', '$1,000.00']}
                    labelValues={[10, 1000]}
                    showCurrentValue={false}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="">
              <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1">Phương thức</h3>
              <Select
                options={options}
                value={selectedMethod}
                onChange={(val) => setSelectedMethod(val)}
                placeholder="Chọn ngân hàng"
                placement="bottom"
                className="w-full h-10"
              />
            </div>

            <div className="flex items-center gap-5 justify-between">
              {/* Submit Button */}

              {/* Terms */}
              <p className="text-sm flex-1 text-text-lo dark:text-text-lo-dark font-medium">
                Bằng cách nhấp vào tiếp tục thanh toán, bạn đồng ý với{' '}
                <a href="#" className="text-blue dark:text-blue-dark underline">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-blue dark:text-blue-dark underline">
                  Chính sách bảo mật
                </a>
              </p>
              <Button variant="primary" className="h-10 w-[100px]" onClick={() => setOpen(true)}>
                NẠP TIỀN
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {/* Wallet Card */}
        <BalanceCard balance={825.097} spent={20} owner="LÊ BẠCH HIỆP" variant="blue" />
      </div>
      {/* Filter section */}
      <div className="p-5 pb-2">
        <div>
          <SectionTitle text="Lịch sử nạp tiền" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
            {/* Left group (Search + Filter + Button) */}
            <div className={clsx('w-full flex flex-col gap-3', (isDesktop || isLargeDesktop) && '!flex-row')}>
              {/* Search field */}
              <Input
                placeholder="Tìm kiếm"
                wrapperClassName={clsx(
                  'bg-bg-input border-2 h-10 w-full sm:w-[240px]',
                  isTablet && '!w-full',
                  (isDesktop || isLargeDesktop) && 'flex flex-col'
                )}
                icon={<MagnifyingGlass />}
                onChange={(e) => console.log(e.target.value)}
              />

              {/* Row below for Date + Button (on mobile) */}
              <div className={clsx('flex items-center gap-3 sm:mt-0 flex-1 min-w-0 justify-between')}>
                <div className="flex-1">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Chọn ngày"
                    className={clsx('h-10 w-full sm:flex-none', isTablet && '!w-full', (isDesktop || isLargeDesktop) && 'max-w-[220px]')}
                  />
                  {/* <DatePicker
                    className="h-10 w-full md:w-[220px] sm:flex-none"
                    value={selectedDate}
                    onChange={(date: Dayjs | null) => {
                      setSelectedDate(date);
                      console.log('Selected date:', date?.format('DD/MM/YYYY'));
                    }}
                  /> */}
                </div>

                <IconButton className="w-10 h-10" icon={<ArrowCounter />} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-[calc(100dvh-565px)]">
        <Table
          className="h-full"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 615px)' }}
          data={paginatedData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize,
            total: tableData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: (page, size) => {
              console.log({ page, size });
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
          paginationType="pagination"
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
          showEmptyRows
        />
      </div>

      <DepositFlowModal
        open={open}
        onClose={() => setOpen(false)}
        defaultStep={2}
        defaultAmount={priceValue}
        defaultMethod={selectedMethod}
      />
    </div>
  );
};

export default WalletPage;
