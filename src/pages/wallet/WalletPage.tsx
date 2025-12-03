import { Badge } from '@/components/badge/Badge';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { BalanceCard } from '@/components/card/BalanceCard';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { SectionTitle } from '@/components/SectionTitle';
import { Table, TableColumn } from '@/components/table/Table';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TopUpModal from './components/modal/TopUpModal';
import { useResponsive } from '@/hooks/useResponsive';
import { toast } from 'sonner';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { copyToClipboard } from '@/utils/copyToClipboard';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { itemVariants, pageVariants } from '@/utils/animation';
import { transactionService } from '@/services/transaction/transaction.service';
import { TransactionDisplay } from '@/services/transaction/transaction.types';
import { transformTransaction, formatDateForAPI } from '@/utils/transaction.utils';
import { walletService } from '@/services/wallet/wallet.service';
import { WalletBalance } from '@/services/wallet/wallet.types';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Select } from '@/components/select/Select';
import { Slider } from '@/components/slider/Slider';
import { InputField } from '@/components/input/InputField';

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
  const pageTitle = usePageTitle({ pageName: 'Xem ví' });
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const { userProfile, getDisplayName } = useAuth();
  const [priceValue, setPriceValue] = useState(10);
  const [selectedMethod, setSelectedMethod] = useState<string | number>('ACB');

  // Top-up modal state
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);

  // Balance state
  const [balance, setBalance] = useState<WalletBalance | null>(null);

  // Transaction state
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    try {
      const balanceData = await walletService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      toast.error('Không thể tải thông tin ví');
      console.log('Error fetching wallet balance:', error);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        per_page: pageSize
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
    } catch (error) {
      toast.error('Không thể tải lịch sử giao dịch');
      console.log('Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, dateRange]);

  // Fetch data on mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

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
    fetchBalance();
    fetchTransactions();
    toast.success('Đã làm mới dữ liệu');
  };

  const columns: TableColumn<TransactionDisplay>[] = useMemo(() => {
    return [
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
        render: (value, record) => <Badge color={record.type === 'credit' ? 'green' : 'blue'}>{value}</Badge>
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
  }, [currentPage, pageSize, isMobile, isTablet]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="overflow-y-auto h-[calc(100dvh)] md:h-[calc(100dvh-104px)] flex flex-col"
    >
      {pageTitle}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-5 p-5 items-stretch">
        {/* Left Panel - Top Up Section */}
        <div className="flex-1 p-5 shadow-md rounded-xl border border-border-element dark:border-border-element-dark dark:bg-bg-secondary-dark">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1">Nạp thêm tiền vào ví</h3>
              {/* Amount Display */}
              <div>
                <div className="relative text-text-hi dark:text-text-hi-dark">
                  <span className="absolute z-10 top-1/2 left-3 -translate-y-1/2 text-sm flex justify-center items-center h-5">$</span>
                  <InputField
                    wrapperClassName="pl-3 h-10"
                    value={priceValue}
                    onChange={(e) => setPriceValue(Math.min(+e.target.value, 1000))}
                  />
                </div>

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
                className="w-full h-10 dark:pseudo-border-top dark:border-transparent dark:bg-[#2B405A]"
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
              <Button
                variant="primary"
                className="h-10 px-6 dark:pseudo-border-top-orange dark:border-transparent"
                onClick={() => setTopUpModalOpen(true)}
              >
                NẠP TIỀN
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {/* Wallet Card */}
        {(isDesktop || isLargeDesktop || isMobile) && (
          <BalanceCard
            balance={balance?.balance || 0}
            spent={balance?.total_purchased || 0}
            owner={getDisplayName()?.toUpperCase() || userProfile?.username?.toUpperCase() || 'USER'}
            variant="blue"
          />
        )}
      </motion.div>
      {/* Filter section */}
      <motion.div variants={itemVariants} className="p-5 pb-2">
        <div>
          <SectionTitle text="Lịch sử giao dịch" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
            {/* Left group (Search + Filter + Button) */}
            <div className={clsx('w-full flex flex-col gap-3', (isDesktop || isLargeDesktop) && '!flex-row')}>
              {/* Search field */}
              <Input
                placeholder="Tìm kiếm giao dịch..."
                wrapperClassName={clsx(
                  'bg-bg-input border-2 h-10 w-full sm:w-[240px]',
                  isTablet && '!w-full',
                  (isDesktop || isLargeDesktop) && 'flex flex-col'
                )}
                icon={<MagnifyingGlass />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Row below for Date + Button (on mobile) */}
              <div className={clsx('flex items-center gap-3 sm:mt-0 flex-1 min-w-0 justify-between')}>
                <div className="flex-1">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Chọn khoảng thời gian"
                    className={clsx('h-10 w-full sm:flex-none ', isTablet && '!w-full', (isDesktop || isLargeDesktop) && 'max-w-[220px]')}
                    triggerClassName="dark:bg-bg-primary-dark dark:pseudo-border-top dark:border-transparent"
                  />
                </div>

                <IconButton className="w-10 h-10" icon={<ArrowCounter />} onClick={handleRefresh} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-[350px] pb-5">
        <Table
          className="h-full"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 615px)' }}
          data={transactions}
          columns={columns}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: total,
            pageSizeOptions: [5, 10, 20, 50],
            className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
            onChange: handlePageChange
          }}
          paginationType="pagination"
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
          showEmptyRows
        />
      </motion.div>

      <TopUpModal open={topUpModalOpen} onClose={() => setTopUpModalOpen(false)} />
    </motion.div>
  );
};

export default WalletPage;
