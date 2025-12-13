import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import {
  ContentCopy,
  MagnifyingGlass,
  ArrowCounter,
  CopySelect,
  ArrowDownload,
  Reload,
  CloudSwap,
  CloudSwapOutlined,
  ArrowSync,
  DashboardFilled
} from '@/components/icons';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { Select } from '@/components/select/Select';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { subscriptionService } from '@/services/subscription/subscription.service';
import { Subscription } from '@/types/subscription';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { sectionVariants } from '@/utils/animation';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { useAuthStore } from '@/stores/auth.store';
import { Input } from '@/components/input/Input';
import { OrderInfoModal } from './OrderInfoModal';
import { getIpAddressByProxyType, getPasswordByProxyType, getPortByProxyType, getUsernameByProxyType, isRotatingProxy } from './utils';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { queryClient } from '@/components/auth/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { useNavbar } from '@/contexts/NavbarContext';
// ISO alpha-2 country codes
export const getCountryOptions = (t: any) => [
  { label: t('countryList.vn'), value: 'VN' },
  { label: t('countryList.us'), value: 'US' },
  { label: t('countryList.uk'), value: 'GB' },
  { label: t('countryList.jp'), value: 'JP' },
  { label: t('countryList.sg'), value: 'SG' },
  { label: t('countryList.kr'), value: 'KR' },
  { label: t('countryList.de'), value: 'DE' },
  { label: t('countryList.fr'), value: 'FR' },
  { label: t('countryList.ca'), value: 'CA' },
  { label: t('countryList.au'), value: 'AU' },
  { label: t('countryList.in'), value: 'IN' },
  { label: t('countryList.br'), value: 'BR' },
  { label: t('countryList.mx'), value: 'MX' },
  { label: t('countryList.th'), value: 'TH' },
  { label: t('countryList.ph'), value: 'PH' },
  { label: t('countryList.my'), value: 'MY' },
  { label: t('countryList.id'), value: 'ID' },
  { label: t('countryList.hk'), value: 'HK' },
  { label: t('countryList.tw'), value: 'TW' },
  { label: t('countryList.pk'), value: 'PK' }
];

// Country Select Cell Component for Table
interface CountrySelectCellProps {
  subscriptionId: string;
  currentCountry?: string;
  className?: string;
}

const CountrySelectCell: React.FC<CountrySelectCellProps> = ({ subscriptionId, currentCountry, className }: CountrySelectCellProps) => {
  const { t } = useTranslation();
  const storedData = useSubscriptionStore((state) => state.getSubscriptionData(subscriptionId));
  const [selectedCountry, setSelectedCountry] = useState<string>(storedData?.country || currentCountry || 'US');

  const handleCountryChange = (value: string | number | undefined) => {
    const countryCode = String(value);
    setSelectedCountry(countryCode);
    useSubscriptionStore.getState().setSubscriptionData(subscriptionId, { country: countryCode });
    toast.success(t('changeCountry') + countryCode);
  };

  return (
    <Select
      value={selectedCountry}
      onChange={handleCountryChange}
      options={getCountryOptions(t)}
      placeholder="Select country"
      className={clsx('h-8 min-w-[140px]', className)}
      optionClassName="max-h-60 overflow-y-auto"
    />
  );
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pageTitle = usePageTitle({ pageName: 'Chi tiết đơn hàng', orderId: id || '' });
  const [loading, setLoading] = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Subscription[]>([]);
  const [protocolModalType, setProtocolModalType] = useState<'single' | 'bulk'>('single');
  const [renewCount, setRenewCount] = useState(0);
  const { t } = useTranslation();

  const { setNavbarItems } = useNavbar();

  useEffect(() => {
    return () => {
      setNavbarItems([]);
    };
  }, []);

  const { data: subscriptions, refetch } = useQuery({
    queryKey: ['order-subscriptions', id, currentPage, pageSize],
    enabled: !!id,
    queryFn: async () => {
      try {
        setError(null);
        setLoading(true);
        // Fetch subscriptions for this order using the new API
        const response = await subscriptionService.getOrderSubscriptions({
          orderId: id!,
          Page: currentPage,
          PerPage: pageSize
        });

        // Extract subscriptions array from response
        if (response && Array.isArray(response.subscriptions)) {
          setNavbarItems([
            {
              label: response.subscriptions[0]?.plan?.name || t('orderDetail.name'),
              icon: <DashboardFilled width={32} height={32} className="text-primary" />
            }
          ]);
          return response.subscriptions;
        } else {
          console.error('API response is not valid:', response);
          setError('Dữ liệu trả về không đúng định dạng.');
          return [];
        }
      } catch (err) {
        console.error('Failed to fetch order subscriptions:', err);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        return [];
      } finally {
        setLoading(false);
      }
    }
  });

  const isBelongRotatingProxy = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return false;
    return subscriptions?.some((sub) => isRotatingProxy(sub));
  }, [subscriptions]);

  const handleSwitchProtocol = async ({
    selectedSubscriptionId,
    protocol
  }: {
    selectedSubscriptionId: string;
    protocol: 'http' | 'socks5';
  }) => {
    try {
      if (protocolModalType === 'single' && selectedSubscriptionId) {
        // Single subscription switch
        const response = await subscriptionService.switchProtocol(selectedSubscriptionId, protocol);

        if (response.success) {
          await refetch();
          setSelectedRows([]);
          setSelectedIds([]);
          toast.success('toast.success.changeProtocol');
        }
      } else if (protocolModalType === 'bulk') {
        // Bulk switch - filter out rotating proxies
        const selectedSubscriptions = (subscriptions || [])
          .filter((sub) => selectedIds.includes(sub.id))
          .filter((sub) => !isRotatingProxy(sub)); // Skip rotating proxies

        let successCount = 0;
        let failureCount = 0;

        for (const sub of selectedSubscriptions) {
          try {
            const response = await subscriptionService.switchProtocol(sub.id, protocol);

            if (response.success) {
              successCount++;
              refetch();
              setSelectedRows([]);
              setSelectedIds([]);
            }
          } catch (err) {
            failureCount++;
            console.error(`Failed to switch protocol for subscription ${sub.id}:`, err);
          }
        }

        // Show appropriate toast message
        if (failureCount === 0) {
          toast.success(t('toast.success.changeProtocol') + ' ' + t('for') + ' ' + successCount + 'subscription(s)');
        } else {
          toast.error(t('toast.error.changeProtocolSub') + failureCount + 'subscription(s)');
        }
      }
    } catch (err) {
      console.error('Failed to switch protocol:', err);
      toast.error('Failed to switch protocol');
    }
  };

  const handleGetProxy = async (subscriptionId: string) => {
    try {
      const subscription = subscriptions?.find((sub) => sub.id === subscriptionId);
      if (!subscription) {
        toast.error(t('toast.error.notFoundSub'));
        return;
      }

      // Only allow for non-rotating proxies
      const isRotating = isRotatingProxy(subscription);
      if (isRotating) {
        toast.error('toast.error.rotateProxy');
        return;
      }

      console.log('Getting proxy information for subscription:', subscriptionId);
      // const response = await subscriptionService.getProxy(subscriptionId);

      // Update subscriptions state with new proxy credentials
      // setSubscriptions((prev) =>
      //   prev.map((sub) =>
      //     sub.id === subscriptionId
      //       ? {
      //           ...sub,
      //           provider_credentials: {
      //             ProxyIP: response.proxy_ip,
      //             HTTPPort: response.http_port,
      //             SOCKS5Port: response.socks5_port,
      //             Username: response.username,
      //             Password: response.password
      //           } as any
      //         }
      //       : sub
      //   )
      // );
      refetch();
      setSelectedRows([]);
      setSelectedIds([]);

      toast.success(t('toast.success.proxyInfo'));
    } catch (err) {
      console.error('Failed to get proxy:', err);
      toast.error(t('toast.error.proxyInfo'));
    }
  };

  const handleCopyProxy = async (record: Subscription) => {
    const isRotating = isRotatingProxy(record);

    if (isRotating) {
      // For rotating proxy: relay.prx.network:80:username:password
      // Format: npx-customer-{authUsername}-country-{country}-session-{sessionId}
      const subscriptionData = useSubscriptionStore.getState().getSubscriptionData(record.id);
      const authUser = useAuthStore.getState().user;
      const authUsername = authUser?.username || 'user';

      // Build username with auth username, default country (US), and sessionId
      const country = subscriptionData?.country || 'us';
      let sessionId = subscriptionData?.sessionId;

      // Generate session ID if it doesn't exist
      if (!sessionId) {
        sessionId = useSubscriptionStore.getState().generateNewSessionId(record.id);
      }

      let username = `npx-customer-${authUsername}-country-${country}`;
      if (sessionId) {
        username += `-session-${sessionId}`;
      }

      const proxyString = `relay.prx.network:80:${username}:${record.api_key}`;

      console.log('Copying rotating proxy string:', proxyString);
      await copyToClipboard(proxyString);

      setCopiedId(record.id);
      toast.success(t('toast.success.rotateProxyCopy'));
    } else {
      // For fixed proxy: protocol://username:password@ip:port
      const credentials = record.provider_credentials as any;
      if (!credentials || !credentials.proxy_ip) {
        toast.error('toast.error.credentialFail');
        return;
      }

      const protocol = credentials.http_port > 0 ? 'http' : 'socks5';
      const username = credentials.username || '';
      const password = credentials.password || '';
      const ip = credentials.proxy_ip || '';
      const port = credentials.http_port > 0 ? credentials.http_port : credentials.socks5_port;

      const proxyString = `${protocol}://${username}:${password}@${ip}:${port}`;

      console.log('Copying proxy string:', proxyString);
      await copyToClipboard(proxyString);

      setCopiedId(record.id);
      toast.success(t('toast.success.proxyCopy'));
    }

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleAutoRenewChange = async (subscriptionId: string, checked: boolean) => {
    try {
      const result = await subscriptionService.updateAutoRenew(subscriptionId, checked);
      console.log('Auto-renew update result:', result);
      if (result) {
        refetch();
        setSelectedRows([]);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Failed to update auto-renew:', err);
    }
  };

  const columns: TableColumn<Subscription>[] = useMemo(() => {
    return [
      {
        key: 'id',
        title: t('STT'),
        width: 50,
        align: 'center',
        render: (_, __, index) => index + 1
      },
      {
        width: 100,
        key: 'subscription_id',
        title: 'ID',
        align: 'left',
        render: (_, record) => (
          <div className="group flex items-center justify-between">
            <p className="flex-1 truncate line-clamp-1 font-mono">{record.id}</p>
            <ContentCopy
              className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(record.id);
                toast.success(t('toast.success.copyOrderId'));
              }}
            />
          </div>
        )
      },
      {
        width: 100,
        key: 'ip',
        title: t('ipAddress'),
        align: 'left',
        render: (_, record) => {
          const ipAddress = getIpAddressByProxyType(record);
          return (
            <div className="group flex items-center justify-between">
              <p className="flex-1 truncate line-clamp-1 font-mono">{ipAddress}</p>
              <ContentCopy
                className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(ipAddress);
                  toast.success(t('toast.success.ipAddressClipboard'));
                }}
              />
            </div>
          );
        }
      },
      {
        width: 100,
        key: 'port',
        title: 'Port',
        align: 'left',
        render: (_, record) => {
          const port = getPortByProxyType(record);
          return (
            <div className="group flex items-center justify-between">
              <p className="flex-1 truncate line-clamp-1 font-mono">{port}</p>
              <ContentCopy
                className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(port);
                  toast.success(t('toast.success.ipAddressClipBoard'));
                }}
              />
            </div>
          );
        }
      },
      {
        width: 100,
        key: 'username',
        title: t('Username'),
        align: 'left',
        render: (_, record) => {
          const username = getUsernameByProxyType(record);
          return (
            <div className="group flex items-center justify-between">
              <p className="flex-1 truncate line-clamp-1 font-mono">{username}</p>
              <ContentCopy
                className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(username);
                  toast.success(t('toast.success.usernameClipboard'));
                }}
              />
            </div>
          );
        }
      },
      {
        width: 100,
        key: 'password',
        title: t('password'),
        align: 'left',
        render: (_, record) => {
          const { plainPassword } = getPasswordByProxyType(record);
          return (
            <div className="group flex items-center justify-between">
              <p className="flex-1 truncate line-clamp-1 font-mono">{plainPassword}</p>
              <ContentCopy
                className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(plainPassword);
                  toast.success(t('toast.success.passwordClipboard'));
                }}
              />
            </div>
          );
        }
      },
      {
        width: 180,
        key: 'country_code',
        title: t('country'),
        align: 'center',
        render: (_: any, record: Subscription) => {
          const isRotating = isRotatingProxy(record);
          if (isRotating) {
            return <CountrySelectCell subscriptionId={record.id} currentCountry={record.country} className="max-w-40 mx-auto" />;
          }
          // For non-rotating proxies, show as plain text
          return <div className="line-clamp-1 font-semibold text-xs">{record.country || '-'}</div>;
        }
      },
      {
        width: 100,
        key: 'connection_type',
        title: 'Type',
        align: 'center',
        render: (_, record) => {
          const credentials = record.provider_credentials as any;
          const connectionType = credentials?.http_port > 0 ? 'HTTPS' : credentials?.socks5_port > 0 ? 'SOCKS5' : '-';

          return <div className="px-2 py-1 rounded text-xs font-semibold">{connectionType}</div>;
        }
      },
      {
        width: 100,
        key: 'auto_renew',
        title: t('autoRenew'),
        align: 'center',
        render: (_, record) => (
          <div>
            <Switch size="md" checked={record.auto_renew} onChange={(checked) => handleAutoRenewChange(record.id, checked)} />
          </div>
        )
      },
      {
        width: 150,
        key: 'next_renewal_date',
        title: t('expired'),
        render: (value) => <div className="font-semibold">{moment(value).format('DD/MM/YYYY HH:mm')}</div>
      },
      {
        width: 200,
        fixed: isMobile || isTablet ? undefined : 'right',
        key: 'actions',
        title: t('action'),
        align: 'center',
        render: (_, record) => {
          const isRotating = isRotatingProxy(record);
          return (
            <div className="flex items-center justify-center gap-2">
              {' '}
              {!isRotating && (
                <>
                  <IconButton
                    icon={<CloudSwap />}
                    className="rounded-lg w-8 h-8 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => {
                      setProtocolModalType('single');
                      const credentials = record.provider_credentials as any;
                      const connectionType = credentials?.http_port > 0 ? 'http' : credentials?.socks5_port > 0 ? 'socks5' : '-';
                      handleSwitchProtocol({ selectedSubscriptionId: record.id, protocol: connectionType === 'http' ? 'socks5' : 'http' });
                    }}
                    title="Change Protocol"
                  />
                  <IconButton
                    icon={<Reload />}
                    iconClassName="text-[#FDBE02] hover:!text-[#FDBE02] dark:text-[#FDBE02]"
                    className="rounded-lg w-8 h-8"
                    onClick={() => handleGetProxy(record.id)}
                    title="Get Proxy"
                  />
                </>
              )}
              <IconButton
                className={`rounded-lg w-8 h-8`}
                iconClassName="text-[#27BE2A] hover:text-[#27BE2A] dark:!text-[#27BE2A]"
                icon={<ArrowDownload />}
                onClick={() => {
                  const ip = getIpAddressByProxyType(record);
                  const port = getPortByProxyType(record);
                  const username = getUsernameByProxyType(record).toLocaleLowerCase();
                  const { plainPassword } = getPasswordByProxyType(record);

                  const proxyString = `${ip}:${port}:${username}:${plainPassword}`;
                  const blob = new Blob([['ip:port:user:password', proxyString].join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `proxy_${moment().format('YYYYMMDD_HHmmss')}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  toast.success(t('toast.success.proxyExport'));
                }}
                title="Export Proxy"
              />
              <IconButton
                icon={<CopySelect />}
                className={`rounded-lg w-8 h-8`}
                onClick={() => handleCopyProxy(record)}
                title={copiedId === record.id ? 'Copied!' : 'Copy Proxy'}
              />
            </div>
          );
        }
      }
    ];
  }, [subscriptions]);

  if (error || subscriptions?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-104px)] gap-4">
        <div className="text-text-hi dark:text-text-hi-dark">{error || 'Không tìm thấy đơn hàng'}</div>
        <Button onClick={() => navigate('/home')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="overflow-auto min-h-0 h-[100dvh] md:h-[calc(100dvh-104px)] flex flex-col flex-1" style={{ scrollbarGutter: 'stable' }}>
      {pageTitle}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-bg-canvas dark:bg-bg-canvas-dark h-full flex flex-col flex-1"
      >
        {/* Header */}
        <div className="px-5 border-t mt-6 py-2 bg-bg-canvas dark:bg-bg-canvas-dark border-border-element dark:border-border-element-dark">
          <div className="flex items-center justify-between flex-cold xs:flex-row flex-wrap gap-2">
            <Input
              placeholder="Tìm kiếm"
              wrapperClassName="bg-bg-input border-2 h-10 md:min-w-[223px]"
              icon={<MagnifyingGlass />}
              onChange={(e) => console.log(e.target.value)}
            />
            <div className="flex items-center gap-2 ml-auto">
              {/* Change protocol */}
              {!isBelongRotatingProxy && (
                <IconButton
                  disabled={selectedRows.length === 0 || loading}
                  icon={<CloudSwapOutlined className="w-5 h-5" />}
                  className="w-10 h-10 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={async () => {
                    setLoading(true);
                    const promiseList = selectedRows.map((record) => {
                      setProtocolModalType('single');
                      const credentials = record.provider_credentials as any;
                      const connectionType = credentials?.http_port > 0 ? 'http' : credentials?.socks5_port > 0 ? 'socks5' : '-';

                      return handleSwitchProtocol({
                        selectedSubscriptionId: record.id,
                        protocol: connectionType === 'http' ? 'socks5' : 'http'
                      });
                    });

                    const results = await Promise.allSettled(promiseList);
                    const needRefresh = results.some((res) => res.status === 'fulfilled');

                    if (needRefresh) {
                      await refetch();
                      setSelectedRows([]);
                      setSelectedIds([]);
                    }
                    setLoading(false);
                    toast.success(t('toast.success.changeProxySub'));
                  }}
                  title="Change Protocol"
                />
              )}

              {/* Renew */}
              <IconButton
                disabled={selectedRows.length === 0}
                icon={<ArrowSync className="w-5 h-5" />}
                className="w-10 h-10 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={async () => {
                  setLoading(true);
                  const renewChecked = renewCount % 2 === 0;
                  const promiseList = selectedRows.map((record) => {
                    return handleAutoRenewChange(record.id, renewChecked);
                  });
                  const results = await Promise.allSettled(promiseList);
                  const needRefresh = results.some((res) => res.status === 'fulfilled');

                  if (needRefresh) {
                    await refetch();

                    setSelectedRows([]);
                    setSelectedIds([]);
                  }
                  setLoading(false);
                  setRenewCount((prev) => prev + 1);
                  toast.success(`Auto-renew ${renewChecked ? 'enabled' : 'disabled'} for selected subscriptions`);
                }}
                title="Renew Auto Toggle"
              />

              {/* Download */}
              <IconButton
                disabled={selectedRows.length === 0}
                className={`w-10 h-10`}
                icon={<ArrowDownload className="w-5 h-5" />}
                onClick={() => {
                  const selectedProxies = [
                    'ip:port:user:password',
                    ...(subscriptions || [])
                      .filter((sub) => selectedRows.some((row) => row.id === sub.id))
                      .map((record) => {
                        const ip = getIpAddressByProxyType(record);
                        const port = getPortByProxyType(record);
                        const username = getUsernameByProxyType(record).toLocaleLowerCase();
                        const { plainPassword } = getPasswordByProxyType(record);
                        return `${ip}:${port}:${username}:${plainPassword}`;
                      })
                  ];

                  const blob = new Blob([selectedProxies.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `proxies_${moment().format('YYYYMMDD_HHmmss')}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  toast.success(t('toast.success.proxyExport'));
                }}
                title="Export Selected Proxies"
              />

              {/* Thông tin */}
              <OrderInfoModal />

              {/* Refresh */}
              <IconButton
                className="w-10 h-10"
                icon={<ArrowCounter className="w-5 h-5" />}
                onClick={async () => {
                  await queryClient.invalidateQueries({ queryKey: ['order-subscriptions'] });
                  setCurrentPage(1);
                  setPageSize(20);
                  const params = new URLSearchParams(window.location.search);
                  params.delete('page');
                  params.delete('pageSize');
                  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                  toast.success(t('toast.success.newData'));
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden pb-5">
          <Table
            showEmptyRows
            className="h-full pr-2"
            scroll={{ x: 800, y: isMobile ? '' : 'calc(100dvh - 450px)' }}
            data={subscriptions || []}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize,
              total: subscriptions?.length || 0,
              pageSizeOptions: [10, 20, 50],
              className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }
            }}
            paginationType="pagination"
            rowClassName={(_, index) => (index % 2 === 0 ? '' : 'bg-bg-mute dark:bg-bg-mute-dark')}
            size="large"
            bordered={false}
            rowSelection={{
              selectedRowKeys: selectedIds,
              onChange: (selectedRowIds, selectedRows) => {
                setSelectedIds(selectedRowIds.map((id) => id as string));
                setSelectedRows(selectedRows);
              }
            }}
            loading={loading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;
