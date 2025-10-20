import { Badge } from '@/components/badge/Badge';
import IconButton from '@/components/button/IconButton';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Table, TableColumn } from '@/components/table/Table';
import { useResponsive } from '@/hooks/useResponsive';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  service: string;
  amount: number;
  description: string;
  status: { text: string; color: string };
  date: string;
}

const services = ['Nạp tiền', 'Gia hạn hosting', 'Mua domain', 'Thanh toán VPS', 'Gia hạn email', 'Mua SSL'];
const statuses = [
  { text: 'Đang hoạt động', color: 'green' },
  { text: 'Hoàn thành', color: 'blue' },
  { text: 'Đã hủy', color: 'red' }
];

export const tableData: Transaction[] = Array.from({ length: 500 }, (_, i) => {
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

const HistoryPage: React.FC = () => {
  const [displayCount, setDisplayCount] = useState(10); // số item hiển thị
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const { isMobile, isTablet } = useResponsive();
  const paginatedData = tableData.slice(0, displayCount);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const handlePageSizeChange = (newPageSize: number) => {
    setDisplayCount(newPageSize);
  };

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
      <div className="px-5 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
          {/* Left group (Search + Filter + Button) */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Search field */}
            <Input
              placeholder="Tìm kiếm"
              wrapperClassName="bg-bg-input border-2 h-10 w-full md:w-[240px]"
              icon={<MagnifyingGlass />}
              onChange={(e) => console.log(e.target.value)}
            />

            {/* Row below for Date + Button (on mobile) */}
            <div className="flex items-center gap-3 sm:mt-0 flex-1 min-w-0 justify-between">
              <div className="flex-1">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Chọn ngày"
                  className="h-10 w-full md:w-[220px] sm:flex-none"
                />
              </div>

              <IconButton className="w-10 h-10" icon={<ArrowCounter />} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-[200px]">
        <Table
          className="h-full"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 210px)' }}
          data={paginatedData}
          columns={columns}
          pagination={{
            current: 1,
            pageSize: displayCount,
            total: tableData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: (_page, newPageSize) => handlePageSizeChange(newPageSize)
          }}
          paginationType="pagination"
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
