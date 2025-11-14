import { Badge } from '@/components/badge/Badge';
import IconButton from '@/components/button/IconButton';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Select } from '@/components/select/Select';
import { Table, TableColumn } from '@/components/table/Table';
import { useResponsive } from '@/hooks/useResponsive';
import { copyToClipboard } from '@/utils/copyToClipboard';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { itemVariants, pageVariants } from '@/utils/animation';
import { orderService } from '@/services/order/order.service';
import { OrderDisplay, OrderType, OrderStatus, ORDER_TYPE_LABELS, ORDER_STATUS_DISPLAY } from '@/services/order/order.types';
import { transformOrder, formatDateForAPI, getOrderTypeColor, formatOrderDate } from '@/utils/order.utils';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { usePageTitle } from '@/hooks/usePageTitle';

const HistoryPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Lịch sử' });
  const { isMobile, isTablet } = useResponsive();

  // State
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Filter state
  const [selectedType, setSelectedType] = useState<OrderType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  // Modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
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

      // Add type filter if selected
      if (selectedType) {
        params.type = selectedType;
      }

      // Add status filter if selected
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await orderService.getOrders(params);

      // Transform data for display
      const transformedData = response.orders.map(transformOrder);
      setOrders(transformedData);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải lịch sử đơn hàng');
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, dateRange, selectedType, selectedStatus]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page on search
      } else {
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [dateRange, selectedType, selectedStatus]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    toast.success('Đã làm mới dữ liệu');
  };

  const handleRowClick = (order: OrderDisplay) => {
    setSelectedOrderId(order.id);
    setSelectedOrderItems(order.items || []);
    setIsModalOpen(true);
  };

  const handleViewItems = (e: React.MouseEvent, order: OrderDisplay) => {
    e.stopPropagation(); // Prevent row click
    setSelectedOrderId(order.id);
    setSelectedOrderItems(order.items || []);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setSelectedOrderItems([]);
  };

  const columns: TableColumn<OrderDisplay>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      render: (_value, _record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      key: 'orderNumber',
      title: 'Mã đơn hàng',
      width: '160px',
      align: 'left',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-between">
          <span className="truncate">{value}</span>
          <ContentCopy
            className="text-blue cursor-pointer ml-2"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(value);
              toast.success('Đã sao chép mã đơn hàng vào clipboard');
            }}
          />
        </div>
      )
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'typeLabel',
      title: 'Loại đơn',
      align: 'left',
      render: (value, record) => (
        <Badge color={getOrderTypeColor(record.type)}>{value}</Badge>
      )
    },
    {
      key: 'total',
      title: 'Tổng tiền',
      width: '120px',
      render: (value, record) => (
        <div className="group relative">
          <span className="font-medium text-blue cursor-help">
            ${Number(value).toFixed(2)}
          </span>
          {/* Tooltip */}
          <div className="absolute z-50 bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-bg-secondary dark:bg-bg-secondary-dark border border-border-element dark:border-border-element-dark rounded-lg shadow-lg p-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-text-lo dark:text-text-lo-dark">Tạm tính:</span>
                <span className="text-text-hi dark:text-text-hi-dark">{record.priceBreakdown.subtotal}</span>
              </div>
              {record.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-lo dark:text-text-lo-dark">Giảm giá:</span>
                  <span className="text-green">-{record.priceBreakdown.discount}</span>
                </div>
              )}
              {record.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-lo dark:text-text-lo-dark">Thuế:</span>
                  <span className="text-text-hi dark:text-text-hi-dark">{record.priceBreakdown.tax}</span>
                </div>
              )}
              <div className="border-t border-border-element dark:border-border-element-dark pt-1 mt-1 flex justify-between font-semibold">
                <span className="text-text-hi dark:text-text-hi-dark">Tổng:</span>
                <span className="text-blue">{record.priceBreakdown.total}</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'items',
      title: 'Items',
      width: '100px',
      align: 'center',
      render: (_value, record) => {
        const itemsCount = record.items?.length || 0;
        return itemsCount > 0 ? (
          <button
            onClick={(e) => handleViewItems(e, record)}
            className="px-3 py-1 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            {itemsCount} items
          </button>
        ) : (
          <span className="text-text-lo dark:text-text-lo-dark">-</span>
        );
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'description',
      title: 'Mô tả',
      align: 'left',
      render: (value) => <div className="truncate max-w-[220px]">{value || '...'}</div>
    },
    {
      key: 'statusDisplay',
      title: 'Trạng thái',
      width: '160px',
      align: 'center',
      render: (status) => <Badge color={status?.color || 'gray'}>{status?.text || '-'}</Badge>
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      width: isMobile || isTablet ? 120 : 200,
      fixed: 'right',
      render: (value) => formatOrderDate(value.toISOString())
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="overflow-y-auto md:h-[calc(100dvh-104px)] flex flex-col h-full"
    >
      {pageTitle}
      <motion.div variants={itemVariants} className="px-5 py-2">
        <div className="flex flex-col gap-3">
          {/* First row - Search and Date Range */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Search field */}
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng..."
              wrapperClassName="bg-bg-input border-2 h-10 w-full md:w-[240px]"
              icon={<MagnifyingGlass />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Chọn khoảng thời gian"
              className="h-10 w-full md:w-[220px]"
              triggerClassName="dark:pseudo-border-top dark:border-transparent"
            />

            <IconButton
              className="w-10 h-10"
              icon={<ArrowCounter />}
              onClick={handleRefresh}
            />
          </div>

          {/* Second row - Type and Status filters */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Order Type Filter */}
            <Select
              value={selectedType}
              onChange={(val) => setSelectedType(val as OrderType | '')}
              placeholder="Tất cả loại đơn"
              className="h-10 w-full md:w-[200px] dark:pseudo-border-top dark:border-transparent"
              options={[
                { value: '', label: 'Tất cả loại đơn' },
                ...Object.entries(ORDER_TYPE_LABELS).map(([value, label]) => ({
                  value,
                  label
                }))
              ]}
            />

            {/* Order Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as OrderStatus | '')}
              placeholder="Tất cả trạng thái"
              className="h-10 w-full md:w-[200px] dark:pseudo-border-top dark:border-transparent"
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                ...Object.entries(ORDER_STATUS_DISPLAY).map(([value, display]) => ({
                  value,
                  label: display.text
                }))
              ]}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-[350px] pb-5">
        <Table
          className="h-full [&_tbody_tr]:cursor-pointer [&_tbody_tr:hover]:bg-bg-mute dark:[&_tbody_tr:hover]:bg-bg-mute-dark"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 270px)' }}
          data={orders}
          columns={columns.map((col) => ({
            ...col,
            onCell: (record: OrderDisplay) => ({
              onClick: () => handleRowClick(record)
            })
          }))}
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

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={isModalOpen}
        orderId={selectedOrderId}
        onClose={handleModalClose}
        initialItems={selectedOrderItems}
      />
    </motion.div>
  );
};

export default HistoryPage;
