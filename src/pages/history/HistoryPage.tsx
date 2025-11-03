import { Badge } from '@/components/badge/Badge';
import IconButton from '@/components/button/IconButton';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Table, TableColumn } from '@/components/table/Table';
import { useResponsive } from '@/hooks/useResponsive';
import { copyToClipboard } from '@/utils/copyToClipboard';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { itemVariants, pageVariants } from '@/utils/animation';
import { transactionService } from '@/services/transaction/transaction.service';
import { TransactionDisplay } from '@/services/transaction/transaction.types';
import { transformTransaction, formatDateForAPI } from '@/utils/transaction.utils';

export interface Transaction {
  id: string;
  service: string;
  amount: number;
  description: string;
  status: { text: string; color: string };
  date: string;
}

const HistoryPage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  // State
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        per_page: pageSize,
      };

      // Add search query if present
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Add date range if present
      if (dateRange.from) {
        params.start_date = formatDateForAPI(dateRange.from);
      }
      if (dateRange.to) {
        params.end_date = formatDateForAPI(dateRange.to);
      }

      const response = await transactionService.getBalanceHistory(params);

      // Transform data for display
      const transformedData = response.items.map(transformTransaction);
      setTransactions(transformedData);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải lịch sử giao dịch');
      toast.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, dateRange]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page on search
      } else {
        fetchTransactions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when date range changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [dateRange]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleRefresh = () => {
    fetchTransactions();
    toast.success('Đã làm mới dữ liệu');
  };

  const columns: TableColumn<TransactionDisplay>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      render: (_value, _record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      key: 'id',
      title: 'Mã',
      width: '160px',
      align: 'left',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-between">
          <span className="truncate">{value}</span>
          <ContentCopy
            className="text-blue cursor-pointer ml-2"
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
      key: 'typeLabel',
      title: 'Loại',
      align: 'left',
      render: (value, record) => (
        <Badge color={record.type === 'credit' ? 'green' : 'blue'}>{value}</Badge>
      )
    },
    {
      key: 'amount',
      title: 'Số tiền',
      width: '120px',
      render: (value, record) => (
        <span className={record.type === 'credit' ? 'text-green' : 'text-red'}>
          {record.type === 'credit' ? '+' : '-'} ${Number(value).toFixed(2)}
        </span>
      )
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
      render: (value) => value || '-'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="overflow-y-auto md:h-[calc(100dvh-104px)] flex flex-col h-full"
    >
      <motion.div variants={itemVariants} className="px-5 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
          {/* Left group (Search + Filter + Button) */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Search field */}
            <Input
              placeholder="Tìm kiếm giao dịch..."
              wrapperClassName="bg-bg-input border-2 h-10 w-full md:w-[240px]"
              icon={<MagnifyingGlass />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Row below for Date + Button (on mobile) */}
            <div className="flex items-center gap-3 sm:mt-0 flex-1 min-w-0 justify-between">
              <div className="flex-1">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Chọn khoảng thời gian"
                  className="h-10 w-full md:w-[220px] sm:flex-none"
                  triggerClassName="dark:pseudo-border-top dark:border-transparent"
                />
              </div>

              <IconButton
                className="w-10 h-10"
                icon={<ArrowCounter />}
                onClick={handleRefresh}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-[350px] pb-5">
        <Table
          className="h-full"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 210px)' }}
          data={transactions}
          columns={columns}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
            pageSizeOptions: [5, 10, 20, 50],
            onChange: handlePageChange
          }}
          paginationType="pagination"
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default HistoryPage;
