import { Badge } from '@/components/badge/Badge';
import IconButton from '@/components/button/IconButton';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Select } from '@/components/select/Select';
import { Table, TableColumn } from '@/components/table/Table';
import { useResponsive } from '@/hooks/useResponsive';
import { copyToClipboard } from '@/utils/copyToClipboard';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { itemVariants, pageVariants } from '@/utils/animation';
import { orderService } from '@/services/order/order.service';
import { OrderDisplay, OrderType, OrderStatus, ORDER_TYPE_LABELS, ORDER_STATUS_DISPLAY } from '@/services/order/order.types';
import { transformOrder, formatDateForAPI, getOrderTypeColor, formatOrderDate } from '@/utils/order.utils';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import useFilter from '@/hooks/useFilter';

const HistoryPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Lịch sử' });
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();

  // State
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);

  // Filter items configuration
  const filterItems = useMemo(
    () => [
      {
        title: 'search',
        format: 'search' as const,
        field: ['orderNumber', 'description'],
        data: debouncedSearchQuery
      },
      {
        title: 'dateRange',
        format: 'dateRange' as const,
        field: ['createdAt'],
        data: dateRange.from && dateRange.to ? [dateRange.from.toISOString(), dateRange.to.toISOString()] : []
      },
      {
        title: 'type',
        format: 'select' as const,
        field: ['type'],
        data: selectedType || null
      },
      {
        title: 'status',
        format: 'select' as const,
        field: ['status'],
        data: selectedStatus || null
      }
    ],
    [debouncedSearchQuery, dateRange, selectedType, selectedStatus]
  );

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params: any = {
        page: currentPage,
        per_page: pageSize
      };

      // Add search query if present
      if (debouncedSearchQuery.trim()) {
        params.search = debouncedSearchQuery.trim();
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
      const transformedData = response.orders.map((order) => transformOrder(order, t));
      setOrders(transformedData);
      setTotal(response.total);
    } catch (err: any) {
      toast.error(t('dashboard.copyOrderIDSuccess'));
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchQuery, dateRange.from, dateRange.to, selectedType, selectedStatus, t]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [dateRange, selectedType, selectedStatus]);

  // Apply Filter hook (call at top-level) and log result
  const filterResult = useFilter('/history', filterItems, orders);

  useEffect(() => {
    console.log('Filter Result:', filterResult);
  }, [filterResult]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    toast.success(t('toast.success.newData'));
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

  const columns: TableColumn<OrderDisplay>[] = useMemo(
    () => [
      {
        key: 'stt',
        title: t('historyPage.columns.stt'),
        width: '60px',
        align: 'center',
        render: (_value, _record, index) => index + 1,
        fixed: 'left'
      },
      {
        key: 'orderNumber',
        title: t('historyPage.columns.orderNumber'),
        width: isMobile || isTablet ? 120 : 200,
        align: 'center',
        sortable: true,
        fixed: 'left',
        render: (value) => (
          <div className="flex items-center justify-between">
            <span className="truncate">{value}</span>
            <ContentCopy
              className="text-blue cursor-pointer ml-2"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(value);
                toast.success(t('dashboard.copyOrderIDSuccess'));
              }}
            />
          </div>
        )
      },
      {
        key: 'createdAt',
        title: t('historyPage.columns.createdAt'),
        width: 150,
        render: (value) => formatOrderDate(value.toISOString())
      },
      {
        width: 150,
        key: 'typeLabel',
        title: t('historyPage.columns.type'),
        align: 'center',
        render: (value, record) => <Badge color={getOrderTypeColor(record.type)}>{value}</Badge>
      },
      {
        key: 'total',
        title: t('historyPage.columns.total'),
        width: 150,
        align: 'center',
        render: (value) => {
          const amount = Number(value);
          const formattedAmount = amount.toFixed(2);
          return <span className="text-[#ff1818]">{amount > 0 ? `-$${formattedAmount}` : `$${formattedAmount}`}</span>;
        }
      },
      {
        key: 'items',
        title: t('quantity'),
        width: 150,
        align: 'center',
        render: (_value, record) => {
          const itemsCount = record.items?.length || 0;
          return itemsCount > 0 ? (
            <button
              onClick={(e) => handleViewItems(e, record)}
              className="px-3 py-1 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              {itemsCount} {t('items')}
            </button>
          ) : (
            <span className="text-text-lo dark:text-text-lo-dark">-</span>
          );
        }
      },
      {
        width: 150,
        key: 'statusDisplay',
        title: t('historyPage.columns.status'),
        align: 'center',
        render: (status) => <Badge color={status?.color || 'gray'}>{status?.text || '-'}</Badge>
      },
      {
        width: 150,
        key: 'description',
        title: t('historyPage.columns.description'),
        align: 'left',
        render: (value) => <div className="truncate">{value || '...'}</div>
      }
    ],
    [t]
  );

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
          <div className="flex flex-col md:flex-row gap-3 w-full flex-wrap">
            {/* Search field */}
            <Input
              placeholder={t('historyPage.searchPlaceholder')}
              wrapperClassName="bg-bg-input border-2 h-10 w-full md:w-[240px]"
              icon={<MagnifyingGlass />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={t('DateRangePicker')}
              className="h-10 w-full md:w-[220px]"
              triggerClassName="dark:pseudo-border-top dark:border-transparent"
            />

            <Select
              value={selectedType}
              onChange={(val) => setSelectedType(val as OrderType | '')}
              placeholder={t('historyPage.allTypes')}
              className="h-10 w-full md:w-[200px] dark:pseudo-border-top dark:border-transparent"
              options={[
                { value: '', label: t('historyPage.allTypes') },
                ...Object.entries(ORDER_TYPE_LABELS).map(([value]) => ({
                  value,
                  label: t(`order.${value}`)
                }))
              ]}
            />

            {/* Order Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as OrderStatus | '')}
              placeholder={t('historyPage.allStatuses')}
              className="h-10 w-full md:w-[200px] dark:pseudo-border-top dark:border-transparent"
              options={[
                { value: '', label: t('historyPage.allStatus') },
                ...Object.entries(ORDER_STATUS_DISPLAY).map(([value]) => ({
                  value,
                  label: t(`order.${value}`)
                }))
              ]}
            />

            <IconButton className="w-10 h-10 ml-auto" icon={<ArrowCounter />} onClick={handleRefresh} />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-[350px] pb-5">
        <Table
          showEmptyRows
          className="h-full [&_tbody_tr]:cursor-pointer [&_tbody_tr:hover]:bg-bg-mute dark:[&_tbody_tr:hover]:bg-bg-mute-dark"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 270px)' }}
          data={orders}
          onRowClick={(record) => handleRowClick(record)}
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
      <OrderDetailsModal open={isModalOpen} orderId={selectedOrderId} onClose={handleModalClose} initialItems={selectedOrderItems} />
    </motion.div>
  );
};

export default HistoryPage;
