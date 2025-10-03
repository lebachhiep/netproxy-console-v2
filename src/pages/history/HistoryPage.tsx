import { Badge } from '@/components/badge/Badge';
import IconButton from '@/components/button/IconButton';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Table, TableColumn } from '@/components/table/Table';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';

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
  const [loadingMore, setLoadingMore] = useState(false);

  const paginatedData = tableData.slice(0, displayCount);
  const hasMore = displayCount < tableData.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 10, tableData.length));
      setLoadingMore(false);
    }, 500); // giả lập loading
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setDisplayCount(newPageSize);
  };

  const columns: TableColumn<Transaction>[] = [
    { key: 'stt', title: 'STT', width: '60px', align: 'center', render: (_v, _r, i) => i + 1 },
    {
      key: 'id',
      title: 'Mã',
      width: '160px',
      align: 'left',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-between">
          <span>{value}</span>
          <ContentCopy className="text-blue cursor-pointer" />
        </div>
      )
    },
    { key: 'service', title: 'Dịch vụ', align: 'left', render: (v) => v || '...' },
    { key: 'amount', title: 'Số tiền', width: '120px', render: (v) => `$ ${Number(v).toFixed(2)}` },
    {
      key: 'description',
      title: 'Mô tả',
      align: 'left',
      render: (v) => <div className="truncate max-w-[220px]">{v || '...'}</div>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: '160px',
      align: 'center',
      render: (s) => <Badge color={s?.color || 'gray'}>{s?.text || '-'}</Badge>
    },
    {
      key: 'date',
      title: 'Thời gian',
      width: 200,
      fixed: 'right',
      render: (v) => (v ? <span>{new Date(v).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span> : '-')
    }
  ];

  return (
    <div>
      <div className="px-5 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm"
              wrapperClassName="bg-bg-input border-2 h-10"
              icon={<MagnifyingGlass />}
              onChange={(e) => console.log(e.target.value)}
            />
            <DatePicker
              className="h-10"
              value={selectedDate}
              onChange={(date: Dayjs | null) => {
                setSelectedDate(date);
                console.log('Selected date:', date?.format('DD/MM/YYYY'));
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <IconButton className="w-10 h-10" icon={<ArrowCounter />} />
          </div>
        </div>
      </div>

      <div>
        <Table
          className="min-h-[calc(100dvh-160px)]"
          scroll={{ x: 300, y: 'calc(100dvh - 210px)' }}
          data={paginatedData}
          columns={columns}
          pagination={{
            current: 1,
            pageSize: displayCount,
            total: tableData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            type: 'loadmore',
            onLoadMore: handleLoadMore,
            loading: loadingMore,
            hasMore: hasMore,
            onChange: (_page, newPageSize) => handlePageSizeChange(newPageSize)
          }}
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
