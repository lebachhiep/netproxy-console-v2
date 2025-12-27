import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { OverViewCard } from '@/components/card/OverViewCard';
import {
  Add,
  ArrowCounter,
  CalendarClockOutline,
  CartFilled,
  ContentCopy,
  DataPie,
  DocumentTable,
  GridDots,
  HourglassHalf,
  MagnifyingGlass,
  Person,
  TextColumnOne,
  TopSpeed,
  WalletCreditCardFilled
} from '@/components/icons';
import { Input } from '@/components/input/Input';
import { Table, TableColumn } from '@/components/table/Table';
import { useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import TopUpModal from '../wallet/components/TopUpModal';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { sectionVariants, itemVariants, containerVariants } from '@/utils/animation';
import { subscriptionService } from '@/services/subscription/subscription.service';
import { usePageTitle } from '@/hooks/usePageTitle';
import moment from 'moment';
import { useAuthStore } from '@/stores/auth.store';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { toast } from 'sonner';
import { Badge } from '@/components/badge/Badge';
import { Card } from '@/components/card/Card';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/auth/ProtectedRoute';
import { Pagination } from '@/components/pagination/Pagination';
import { CheckingModal } from './CheckingModal';
import { useTranslation } from 'react-i18next';
import { userService } from '@/services/user/user.service';
import { useDebounce } from '@/hooks/useDebounce';
import { tableDashboardDate } from '@/utils/date';
const easeInOutCustom = [0.44, 0, 0.56, 1];

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.25,
      ease: easeInOutCustom as any
    }
  }
};

// Order table data type - mapped directly from API response
interface OrderTableData {
  id: string; // Order ID from API
  order_number: string; // Order number for display
  plan_name: string; // First subscription's plan name
  subscription_count: number; // Total subscriptions in order
  fulfilled_at: string; // Order fulfillment date (or created_at if not fulfilled)
  duration: string; // Duration calculated by the first subscription
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle({ pageName: t('home') });

  const [currentPage, setCurrentPage] = useState(() => {
    const pageQuery = new URLSearchParams(window.location.search).get('page');
    return pageQuery ? parseInt(pageQuery, 10) : 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const sizeQuery = new URLSearchParams(window.location.search).get('pageSize');
    return sizeQuery ? parseInt(sizeQuery, 10) : 20;
  });
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const storageMode = localStorage.getItem('dashboardViewMode');
    return storageMode === 'list' ? 'list' : 'grid';
  });
  const [tableData, setTableData] = useState<OrderTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const { isMobile, isTablet } = useResponsive();
  const userProfile = useAuthStore((state) => state.userProfile);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  // Checking modal state
  const [openCheckingModal, setOpenCheckingModal] = useState(false);
  // Searching
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data: platformStats } = useQuery({
    queryKey: ['platform-status'],
    queryFn: () => userService.getPlatformStat()
  });

  useQuery({
    queryKey: ['dashboard-get-subscriptions', currentPage, pageSize, debouncedSearch],
    queryFn: async () => {
      setLoading(true);
      try {
        const ordersResponse = await subscriptionService.getSubscriptions({
          Status: 'active',
          Page: currentPage,
          PerPage: pageSize,
          search: debouncedSearch
        });

        setTotalSubscriptions(ordersResponse.total_subscriptions || 0);
        setActiveSubscriptions(ordersResponse.total_orders || 0);

        const transformedData: OrderTableData[] = (ordersResponse.orders || []).map((order) => {
          const firstSubscription = order.subscriptions?.[0];
          return {
            id: order.id,
            order_number: order.order_number,
            plan_name: firstSubscription?.plan?.name || 'Unknown Plan',
            subscription_count: order.subscriptions?.length || 0,
            fulfilled_at: order.fulfilled_at || order.created_at,
            duration: firstSubscription?.plan?.duration ? tableDashboardDate(firstSubscription?.plan.duration, t) : 'N/A'
          };
        });

        setTableData(transformedData);
        setTotal(ordersResponse.total_orders);
        return transformedData;
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load order data. Please try again later.');
        setTableData([]);
        return [];
      } finally {
        setLoading(false);
      }
    }
  });

  const handleItemClick = (id: string) => {
    navigate(`/order/${id}`);
  };

  const columns: TableColumn<OrderTableData>[] = [
    {
      key: 'id',
      title: t('no'),
      width: '50px',
      align: 'center',
      render: (_value, _record, index) => index + 1,
      fixed: 'left'
    },
    {
      width: isMobile || isTablet ? 200 : '',
      minWidth: 150,
      key: 'order_number',
      title: t('orderNumber'),
      align: 'left',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-between">
          <p className="line-clamp-1 font-mono truncate">{value}</p>
          <ContentCopy
            className="text-blue cursor-pointer ml-2"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(value);
              toast.success(t('dashboard.copyOrderIDSuccess'));
            }}
          />
        </div>
      ),
      fixed: isMobile || isTablet ? undefined : 'left'
    },
    {
      width: 200,
      key: 'plan_name',
      title: t('plan'),
      align: 'left',
      sortable: true,
      render: (value) => <div className="line-clamp-1">{value}</div>
    },
    {
      width: 150,
      key: 'subscription_count',
      title: t('quantity'),
      align: 'center',
      sortable: true,
      render: (value) => <div className="font-semibold">{value}</div>
    },
    {
      key: 'expired',
      title: t('duration'),
      width: isMobile || isTablet ? 150 : 200,
      render: (_, record) => {
        return <div className="font-semibold">{record.duration}</div>;
      }
    },
    {
      width: 150,
      key: 'fulfilled_at',
      title: t('purchaseDate'),
      sortable: true,
      render: (value) => <div className="font-semibold">{moment(value).format('DD/MM/YYYY HH:mm')}</div>
    },

    {
      key: 'subscriptions',
      title: t('status'),
      width: '160px',
      align: 'center',
      render: () => <Badge color={'blue'}>{t('dashboard.active')}</Badge> // Always active for now
    },
    {
      width: isMobile || isTablet ? 100 : 130,
      fixed: 'right',
      key: 'buttonText',
      title: t('action'),
      align: 'center',
      render: (_, record) => (
        <Button variant="default" className="px-3 py-[7.5px] h-[32px] dark:text-text-lo-dark" onClick={() => handleItemClick(record.id)}>
          {t('manage')}
        </Button>
      )
    }
  ];

  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return tableData;
    return [...tableData].sort((a, b) => {
      const v1 = a[sortField as keyof OrderTableData];
      const v2 = b[sortField as keyof OrderTableData];
      if (typeof v1 === 'number' && typeof v2 === 'number') {
        return sortOrder === 'asc' ? v1 - v2 : v2 - v1;
      }
      return sortOrder === 'asc' ? String(v1).localeCompare(String(v2)) : String(v2).localeCompare(String(v1));
    });
  }, [sortField, sortOrder, tableData]);

  const last2Items = useMemo(() => {
    const items = [
      <OverViewCard
        key="4"
        icon={
          <div className="flex justify-center items-center w-10 h-10 bg-purple-gradient rounded-[4px] text-white">
            <Person className="text-text-hi-dark" />
          </div>
        }
        title={t('dashboard.user')}
        mainContent={
          <div>
            <span className="text-pink dark:text-pink-dark font-semibold text-xl tracking-[-0.3px] font-averta">
              {platformStats?.total_users}
            </span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> {t('dashboard.customer')}</span>
          </div>
        }
        subInfo={[
          {
            label: t('dashboard.totalOrdersSold'),
            value: (
              <div>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm">{platformStats?.total_orders}</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> {t('order.name')} </span>
              </div>
            )
          }
        ]}
      />,
      <OverViewCard
        key="3"
        icon={
          <div className="flex justify-center items-center w-10 h-10 bg-green-gradient rounded-[4px] text-white">
            <TopSpeed />
          </div>
        }
        title={t('dashboard.server')}
        mainContent={
          <div>
            <span className="text-pink dark:text-pink-dark font-semibold text-xl tracking-[-0.3px] font-averta">
              {platformStats?.total_relay_nodes}
            </span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm">/ {platformStats?.total_relay_nodes} </span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm capitalize"> {t('dashboard.operating')}</span>
          </div>
        }
        subInfo={[
          {
            label: '',
            value: (
              <Button
                // size={isDesktop || isLargeDesktop ? 'md' : 'sm'}
                variant="default"
                className="font-bold relative transition-colors duration-300 group whitespace-nowrap justify-center items-center gap-1 border-2 shadow-xs border-border dark:border-transparent dark:pseudo-border-top text-text-me dark:text-text-me-dark hover:text-text-hi dark:hover:text-text-hi-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:border-blue text-sm px-3 py-[7.5px] rounded-[4px] h-[32px] lg:h-10 flex w-full lg:px-3"
                onClick={() => {
                  setOpenCheckingModal(true);
                }}
              >
                {t('dashboard.checking').toUpperCase()}
              </Button>
            )
          }
        ]}
      />
    ];
    if (isMobile || isTablet) return items.reverse();
    return items;
  }, [isMobile, isTablet, platformStats?.total_orders, platformStats?.total_relay_nodes, platformStats?.total_users, t]);

  const handleChangeMode = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem('dashboardViewMode', mode);
  };

  return (
    <div className="overflow-auto min-h-0 h-[100dvh] md:h-[calc(100dvh-104px)] flex flex-col flex-1" style={{ scrollbarGutter: 'stable' }}>
      {pageTitle}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="bg-bg-canvas dark:bg-bg-canvas-dark h-full flex flex-col flex-1"
      >
        {/* ====== TOP CARDS ====== */}
        <div className="p-5 bg-bg-canvas dark:bg-bg-canvas-dark">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 min-[448px]:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 "
          >
            {[
              <OverViewCard
                key="1"
                icon={
                  <div className="flex justify-center items-center w-10 h-10 bg-blue-gradient rounded-[4px] text-white">
                    <WalletCreditCardFilled />
                  </div>
                }
                title={t('dashboard.balance')}
                mainContent={
                  <div className="flex items-center font-averta">
                    <span className="text-green font-semibold text-xl tracking-[-0.66px]">$</span>
                    <span className="text-blue dark:text-blue-dark font-semibold text-xl">{userProfile?.balance || '-'}</span>
                  </div>
                }
                subInfo={[
                  { label: t('dashboard.totalTopUp'), value: userProfile?.total_purchased ? `$${userProfile.total_purchased}` : '-' }
                ]}
                buttonText={t('dashboard.topUp').toUpperCase()}
                onButtonClick={() => setOpen(true)}
              />,
              <OverViewCard
                key="2"
                icon={
                  <div className="flex justify-center items-center w-10 h-10 bg-yellow-gradient rounded-[4px] text-white">
                    <CartFilled />
                  </div>
                }
                title={t('dashboard.activePlan')}
                mainContent={
                  <div>
                    <span className="text-primary dark:text-primary-dark font-semibold text-xl tracking-[-0.3px] font-averta">
                      {loading ? '...' : activeSubscriptions}
                    </span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> {t('dashboard.activePlans')}</span>
                  </div>
                }
                subInfo={[
                  {
                    label: t('dashboard.totalPurchasedPlans'),
                    value: `${loading ? '...' : totalSubscriptions} ${t('plan').toLocaleLowerCase()}`
                  }
                ]}
                buttonText={t('dashboard.buyMore').toUpperCase()}
                onButtonClick={() => navigate('/buy')}
              />,
              ...last2Items
            ].map((card, i) => (
              <motion.div key={i} variants={itemVariants}>
                {card}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ====== FILTER BAR ====== */}
        <motion.div variants={sectionVariants} className="p-5 pb-2 bg-bg-canvas dark:bg-bg-canvas-dark">
          <div className="flex items-center gap-2">
            <p className="text-text-hi dark:text-text-hi-dark text-sm tracking-[0.52px] font-ibm-plex-mono uppercase">
              {t('dashboard.activePlans')}
            </p>
            <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1"></div>
          </div>
          <div className="flex items-center justify-between mt-3 gap-2">
            <Input
              placeholder={t('dashboard.search')}
              wrapperClassName="bg-bg-input border-2 h-10 md:min-w-[223px]"
              icon={<MagnifyingGlass />}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <IconButton
                className="w-10 h-10 lg:flex"
                icon={viewMode === 'list' ? <TextColumnOne /> : <GridDots />}
                onClick={() => handleChangeMode(viewMode === 'list' ? 'grid' : 'list')}
              />
              <IconButton
                className="w-10 h-10"
                icon={<ArrowCounter />}
                onClick={async () => {
                  await queryClient.invalidateQueries({ queryKey: ['dashboard-get-subscriptions'] });
                  setCurrentPage(1);
                  setPageSize(20);
                  const params = new URLSearchParams(window.location.search);
                  params.delete('page');
                  params.delete('pageSize');
                  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                  toast.success(t('dashboard.refreshSuccess'));
                }}
              />
              <Link to="/buy">
                <IconButton
                  hoverIconColor="text-white"
                  icon={<Add className="text-white dark:text-white" />}
                  className="bg-primary dark:bg-primary-dark w-10 h-10 border-primary-border  hover:bg-primary dark:hover:bg-primary-dark hover:border-primary-hi-dark dark:hover:border-transparent dark:!pseudo-border-top-orange"
                />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ====== CONTENT ====== */}
        <motion.div variants={sectionVariants} className="relative flex-1 flex flex-col overflow-hidden min-h-[350px] pb-5">
          {viewMode === 'list' ? (
            <Table
              loading={loading}
              className="h-full pr-2"
              scroll={{ x: 300, y: isMobile ? '' : 'calc(100dvh - 540px)' }}
              data={sortedData}
              columns={columns}
              showEmptyRows
              pagination={{
                current: currentPage,
                pageSize,
                total,
                pageSizeOptions: [2, 4, 6, 8],
                className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);

                  // Update URL without reloading the page
                  const params = new URLSearchParams(window.location.search);
                  if (page !== 1) {
                    params.set('page', String(page));
                  } else {
                    params.delete('page');
                  }
                  if (size !== 20) {
                    params.set('pageSize', String(size));
                  } else {
                    params.delete('pageSize');
                  }
                  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                }
              }}
              paginationType="pagination"
              rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
              size="large"
              bordered={false}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={(field, order) => {
                setSortField(field);
                setSortOrder(order);
              }}
            />
          ) : (
            <>
              <div className="relative h-full flex-1 flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-[2px] shadow-xxs z-10 border-t-2 border-border-element dark:border-border-element-dark" />
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="overflow-y-auto h-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 min-[2400px]:grid-cols-6 place-content-start gap-5 p-5 items-stretch"
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-full w-full col-span-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">{t('loading')}</span>
                    </div>
                  ) : (
                    tableData.map((item) => (
                      <motion.div key={item.id} variants={itemVariants}>
                        <Card className="max-h-[260px]">
                          <Card.Header>
                            <Card.Title
                              status={{
                                text: t('dashboard.active'),
                                color: 'blue'
                              }}
                            >
                              {item.plan_name}
                            </Card.Title>
                            <Card.Action text={'Quản lý'} onClick={() => handleItemClick(item.id)} />
                          </Card.Header>
                          <Card.List className="dark:text-text-hi-dark">
                            <Card.ListItem label={t('dashboard.orderID')} icon={<DocumentTable />}>
                              <div className="flex items-center justify-between">
                                <p className="line-clamp-1 font-mono truncate">{item.order_number}</p>
                                <ContentCopy
                                  className="text-blue cursor-pointer ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.order_number);
                                    toast.success(t('dashboard.copyOrderIDSuccess'));
                                  }}
                                />
                              </div>
                            </Card.ListItem>
                            <Card.ListItem label="Số lượng" icon={<DataPie />} value={item.subscription_count} />
                            <Card.ListItem label="Duration" icon={<HourglassHalf />} value={item.duration} />
                            <Card.ListItem
                              label={t('purchaseDate')}
                              icon={<CalendarClockOutline className="w-6 h-6 text-blue" />}
                              value={moment(item.fulfilled_at).format('DD/MM/YYYY HH:mm')}
                            />
                          </Card.List>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
                <div>
                  <Pagination
                    type={'pagination'}
                    {...{
                      current: currentPage,
                      pageSize,
                      total,
                      pageSizeOptions: [2, 4, 6, 8],
                      className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
                      onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);

                        // Update URL without reloading the page
                        const params = new URLSearchParams(window.location.search);
                        if (page !== 1) {
                          params.set('page', String(page));
                        } else {
                          params.delete('page');
                        }
                        if (size !== 20) {
                          params.set('pageSize', String(size));
                        } else {
                          params.delete('pageSize');
                        }
                        window.history.replaceState(
                          {},
                          '',
                          `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ====== MODALS ====== */}
        <TopUpModal open={open} onClose={() => setOpen(false)} allowCloseByBackdrop={false} />
        <CheckingModal isOpen={openCheckingModal} onClose={() => setOpenCheckingModal(false)} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
