import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { OverViewCard } from '@/components/card/OverViewCard';
import {
  Add,
  ArrowCounter,
  CalendarClock,
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
import TopUpModal from '../wallet/components/modal/TopUpModal';
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
import { IoFlame } from 'react-icons/io5';
import { Card } from '@/components/card/Card';
import { useQuery } from '@tanstack/react-query';

export const data = [
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
  },
  {
    id: 10,
    title: 'Sweden Bandwidth Proxy - 3GB / 15 ngày',
    planID: 'SWE.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '3GB',
    expired: 'Dec 5, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  },
  {
    id: 11,
    title: 'Italy Rotating Proxy - 2GB / 10 ngày',
    planID: 'ITA.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '2GB',
    expired: 'Dec 15, 2023',
    autoRenew: true,
    type: 'rotating-proxy'
  },
  {
    id: 12,
    title: 'Spain Bandwidth Proxy - 4GB / 20 ngày',
    planID: 'ESP.EXP2DIP',
    status: { text: 'Đang hoạt động', color: 'blue' },
    dataLeft: '4GB',
    expired: 'Dec 20, 2023',
    autoRenew: true,
    type: 'bandwidth-proxy'
  }
];

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
  const pageTitle = usePageTitle({ pageName: 'Trang chủ' });
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
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const userProfile = useAuthStore((state) => state.userProfile);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  useQuery({
    queryKey: ['dashboard-get-subscriptions', currentPage, pageSize],
    queryFn: async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersResponse = await subscriptionService.getSubscriptions({ Status: 'active', Page: currentPage, PerPage: pageSize });
        if (ordersResponse.total_subscriptions !== totalSubscriptions) {
          setTotalSubscriptions(ordersResponse.total_subscriptions || 0);
        }
        if (ordersResponse.total_orders !== activeSubscriptions) {
          setActiveSubscriptions(ordersResponse.total_orders || 0);
        }

        // Transform orders to table data
        const transformedData = (ordersResponse.orders || []).map((order): OrderTableData => {
          const firstSubscription = order.subscriptions?.[0];
          return {
            id: order.id,
            order_number: order.order_number,
            plan_name: firstSubscription?.plan?.name || 'Unknown Plan',
            subscription_count: order.subscriptions?.length || 0,
            fulfilled_at: order.fulfilled_at || order.created_at,
            duration: firstSubscription?.plan?.duration ? moment.duration(firstSubscription.plan.duration, 'seconds').humanize() : 'N/A'
          };
        });
        setTableData(transformedData);
        setTotal(ordersResponse.total_orders);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
        setTableData([]);
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
      title: 'STT',
      width: '50px',
      align: 'center',
      render: (value, _, index) => index + 1,
      fixed: 'left'
    },
    {
      width: isMobile || isTablet ? 200 : '',
      minWidth: 150,
      key: 'order_number',
      title: 'Mã đơn hàng',
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
              toast.success('Đã sao chép mã đơn hàng vào clipboard');
            }}
          />
        </div>
      ),
      fixed: 'left'
    },
    {
      width: 200,
      key: 'plan_name',
      title: 'Gói',
      align: 'left',
      sortable: true,
      render: (value) => <div className="line-clamp-1">{value}</div>
    },
    {
      width: 150,
      key: 'subscription_count',
      title: 'Số lượng',
      align: 'center',
      sortable: true,
      render: (value) => <div className="font-semibold">{value}</div>
    },
    {
      key: 'expired',
      title: 'Duration',
      width: isMobile || isTablet ? 150 : 200,
      render: (_, record) => {
        return <div className="font-semibold capitalize">{record.duration}</div>;
      }
    },
    {
      width: 150,
      key: 'fulfilled_at',
      title: 'Ngày mua',
      sortable: true,
      render: (value) => <div className="font-semibold">{moment(value).format('DD/MM/YYYY HH:mm')}</div>
    },

    {
      key: 'subscriptions',
      title: 'Trạng thái',
      width: '160px',
      align: 'center',
      render: (subs) => <Badge color={'blue'}>Đang hoạt động</Badge> // Always active for now
    },
    {
      width: isMobile || isTablet ? 150 : 200,
      fixed: 'right',
      key: 'buttonText',
      title: 'Hành động',
      align: 'center',
      render: (_, record) => (
        <Button variant="default" className="px-3 py-[7.5px] h-[32px] dark:text-text-lo-dark" onClick={() => handleItemClick(record.id)}>
          QUẢN LÝ
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
        title="Người dùng & Đơn hàng"
        mainContent={
          <div>
            <span className="text-pink dark:text-pink-dark font-semibold text-xl tracking-[-0.3px] font-averta">2500</span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> Khách hàng</span>
          </div>
        }
        subInfo={[
          {
            label: 'Tổng đơn hàng :',
            value: (
              <div>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm">155.231</span>
                <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> Orders</span>
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
        title="Máy chủ"
        mainContent={
          <div>
            <span className="text-pink dark:text-pink-dark font-semibold text-xl tracking-[-0.3px] font-averta">1</span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm">/ 5 </span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> hoạt động</span>
          </div>
        }
        subInfo={[
          {
            label: '',
            value: (
              <Button variant="default" className="rounded-lg w-full flex items-center justify-center">
                KIỂM TRA TRẠNG THÁI
              </Button>
            )
          }
        ]}
      />
    ];
    if (isMobile || isTablet) return items.reverse();
    return items;
  }, [isDesktop, isLargeDesktop]);

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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 "
          >
            {[
              <OverViewCard
                key="1"
                icon={
                  <div className="flex justify-center items-center w-10 h-10 bg-blue-gradient rounded-[4px] text-white">
                    <WalletCreditCardFilled />
                  </div>
                }
                title="Số dư"
                mainContent={
                  <div className="flex items-center font-averta">
                    <span className="text-green font-semibold text-xl tracking-[-0.66px]">$</span>
                    <span className="text-blue dark:text-blue-dark font-semibold text-xl">{userProfile?.balance || '-'}</span>
                  </div>
                }
                subInfo={[{ label: 'Tổng tiền đã nạp ', value: userProfile?.total_purchased ? `$${userProfile.total_purchased}` : '-' }]}
                buttonText="NẠP THÊM"
                onButtonClick={() => setOpen(true)}
              />,
              <OverViewCard
                key="2"
                icon={
                  <div className="flex justify-center items-center w-10 h-10 bg-yellow-gradient rounded-[4px] text-white">
                    <CartFilled />
                  </div>
                }
                title="Các gói hoạt động"
                mainContent={
                  <div>
                    <span className="text-primary dark:text-primary-dark font-semibold text-xl tracking-[-0.3px] font-averta">
                      {loading ? '...' : activeSubscriptions}
                    </span>
                    <span className="text-text-hi dark:text-text-hi-dark font-semibold text-sm"> Gói đang hoạt động</span>
                  </div>
                }
                subInfo={[{ label: 'Tổng gói', value: `${loading ? '...' : totalSubscriptions} gói` }]}
                buttonText="MUA THÊM"
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
            <p className="text-text-hi dark:text-text-hi-dark text-sm tracking-[0.52px] font-ibm-plex-mono uppercase">Gói đang hoạt động</p>
            <div className="h-[2px] bg-border-element dark:bg-border-element-dark flex-1"></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <Input
              placeholder="Tìm kiếm"
              wrapperClassName="bg-bg-input border-2 h-10 min-w-[223px]"
              icon={<MagnifyingGlass />}
              onChange={(e) => console.log(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <IconButton
                className="w-10 h-10 hidden lg:flex"
                icon={viewMode === 'list' ? <TextColumnOne /> : <GridDots />}
                onClick={() => handleChangeMode(viewMode === 'list' ? 'grid' : 'list')}
              />
              <IconButton
                className="w-10 h-10"
                icon={<ArrowCounter />}
                onClick={() => {
                  setCurrentPage(1);
                  setPageSize(20);
                  const params = new URLSearchParams(window.location.search);
                  params.delete('page');
                  params.delete('pageSize');
                  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
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
              className="h-full pr-2"
              scroll={{ x: 300, y: isMobile ? '' : 'calc(100dvh - 540px)' }}
              data={sortedData}
              columns={columns}
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
            <div className="relative h-full flex-1 flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-[2px] shadow-xxs z-10 border-t-2 border-border-element dark:border-border-element-dark" />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="overflow-y-auto h-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 p-5 items-stretch"
              >
                {tableData.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card
                      tag={{
                        text: 'POPULAR',
                        icon: <IoFlame className="w-3 h-3" />
                      }}
                    >
                      <Card.Header>
                        <Card.Title
                          status={{
                            text: 'Đang hoạt động',
                            color: 'blue'
                          }}
                        >
                          {item.plan_name}
                        </Card.Title>
                        <Card.Action text={'Quản lý'} onClick={() => handleItemClick(item.id)} />
                      </Card.Header>
                      <Card.List className="dark:text-text-hi-dark">
                        <Card.ListItem label="Mã đơn hàng" icon={<DocumentTable />}>
                          <div className="flex items-center justify-between">
                            <p className="line-clamp-1 font-mono truncate">{item.order_number}</p>
                            <ContentCopy
                              className="text-blue cursor-pointer ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.order_number);
                                toast.success('Đã sao chép mã đơn hàng vào clipboard');
                              }}
                            />
                          </div>
                        </Card.ListItem>
                        <Card.ListItem label="Số lượng" icon={<DataPie />} value={item.subscription_count} />
                        <Card.ListItem label="Duration" icon={<HourglassHalf />} value={item.duration} />
                        <Card.ListItem
                          label="Ngày mua"
                          icon={<CalendarClock />}
                          value={moment(item.fulfilled_at).format('DD/MM/YYYY HH:mm')}
                        />
                      </Card.List>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* ====== MODALS ====== */}
        <TopUpModal open={open} onClose={() => setOpen(false)} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
