import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import {
  CloudSwapFilled,
  ContentCopy,
  CheckMark,
  Replay,
  MagnifyingGlass,
  ArrowCounter,
  ChatWarning,
  DocumentSync
} from '@/components/icons';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { Modal } from '@/components/modal/Modal';
import { Select } from '@/components/select/Select';
import { useState, useEffect } from 'react';
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
import Tooltip from '@/components/tooltip/Tooltip';
import { OrderInfoModal } from './OrderInfoModal';
import { getIpAddressByProxyType, getPasswordByProxyType, getPortByProxyType, getUsernameByProxyType, isRotatingProxy } from './utils';
import { get } from 'http';

// ISO alpha-2 country codes
const COUNTRY_OPTIONS = [
  { label: 'Vietnam', value: 'VN' },
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Japan', value: 'JP' },
  { label: 'Singapore', value: 'SG' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'India', value: 'IN' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Taiwan', value: 'TW' },
  { label: 'Pakistan', value: 'PK' }
];

// Country Select Cell Component for Table
interface CountrySelectCellProps {
  subscriptionId: string;
  currentCountry?: string;
}

const CountrySelectCell: React.FC<CountrySelectCellProps> = ({ subscriptionId, currentCountry }) => {
  const storedData = useSubscriptionStore((state) => state.getSubscriptionData(subscriptionId));
  const [selectedCountry, setSelectedCountry] = useState<string>(storedData?.country || currentCountry || 'US');

  const handleCountryChange = (value: string | number | undefined) => {
    const countryCode = String(value);
    setSelectedCountry(countryCode);
    useSubscriptionStore.getState().setSubscriptionData(subscriptionId, { country: countryCode });
    toast.success(`Country changed to ${countryCode}`);
  };

  return (
    <Select
      value={selectedCountry}
      onChange={handleCountryChange}
      options={COUNTRY_OPTIONS}
      placeholder="Select country"
      className="h-8 min-w-[140px]"
      placement="top"
      optionClassName="max-h-60 overflow-y-auto"
    />
  );
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pageTitle = usePageTitle({ pageName: 'Chi tiết đơn hàng' });
  const { isMobile, isTablet } = useResponsive();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showProxyModal, setShowProxyModal] = useState(false);
  const [proxyList, setProxyList] = useState<string[]>([]);
  const [protocolModalType, setProtocolModalType] = useState<'single' | 'bulk'>('single');
  const [selectedProtocol, setSelectedProtocol] = useState<'http' | 'socks5'>('http');
  const [showAutoRenewModal, setShowAutoRenewModal] = useState(false);
  const [selectedAutoRenew, setSelectedAutoRenew] = useState<string>('true');

  useEffect(() => {
    const fetchOrderSubscriptions = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch subscriptions for this order using the new API
        const response = await subscriptionService.getOrderSubscriptions(id);

        // Extract subscriptions array from response
        if (response && Array.isArray(response.subscriptions)) {
          setSubscriptions(response.subscriptions);
        } else {
          console.error('API response is not valid:', response);
          setError('Dữ liệu trả về không đúng định dạng.');
          setSubscriptions([]);
        }
      } catch (err) {
        console.error('Failed to fetch order subscriptions:', err);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSubscriptions();
  }, [id]);

  const handleSwitchProtocol = async ({ selectedSubscriptionId }: { selectedSubscriptionId: string }) => {
    try {
      const protocol = selectedProtocol;

      if (protocolModalType === 'single' && selectedSubscriptionId) {
        // Single subscription switch
        const response = await subscriptionService.switchProtocol(selectedSubscriptionId, protocol);

        if (response.success) {
          setSubscriptions((prev) =>
            prev.map((s) =>
              s.id === selectedSubscriptionId
                ? {
                    ...s,
                    provider_credentials: {
                      ProxyIP: response.proxy_ip,
                      HTTPPort: response.http_port,
                      SOCKS5Port: response.socks5_port,
                      Username: response.username,
                      Password: response.password
                    }
                  }
                : s
            )
          );
          toast.success('Protocol switched successfully');
        }
      } else if (protocolModalType === 'bulk') {
        // Bulk switch - filter out rotating proxies
        const selectedSubscriptions = subscriptions.filter((sub) => selectedIds.includes(sub.id)).filter((sub) => !isRotatingProxy(sub)); // Skip rotating proxies

        let successCount = 0;
        let failureCount = 0;

        for (const sub of selectedSubscriptions) {
          try {
            const response = await subscriptionService.switchProtocol(sub.id, protocol);

            if (response.success) {
              successCount++;
              setSubscriptions((prev) =>
                prev.map((s) =>
                  s.id === sub.id
                    ? {
                        ...s,
                        provider_credentials: {
                          ProxyIP: response.proxy_ip,
                          HTTPPort: response.http_port,
                          SOCKS5Port: response.socks5_port,
                          Username: response.username,
                          Password: response.password
                        }
                      }
                    : s
                )
              );
            }
          } catch (err) {
            failureCount++;
            console.error(`Failed to switch protocol for subscription ${sub.id}:`, err);
          }
        }

        // Show appropriate toast message
        if (failureCount === 0) {
          toast.success(`Protocol switched successfully for ${successCount} subscription(s)`);
        } else {
          toast.error(`Failed to switch protocol for ${failureCount} subscription(s). ${successCount} succeeded.`);
        }
      }
    } catch (err) {
      console.error('Failed to switch protocol:', err);
      toast.error('Failed to switch protocol');
    }
  };

  const handleGetProxy = async (subscriptionId: string) => {
    try {
      const subscription = subscriptions.find((sub) => sub.id === subscriptionId);
      if (!subscription) {
        toast.error('Subscription not found');
        return;
      }

      // Only allow for non-rotating proxies
      const isRotating = isRotatingProxy(subscription);
      if (isRotating) {
        toast.error('Get Proxy is not available for rotating proxies');
        return;
      }

      console.log('Getting proxy information for subscription:', subscriptionId);
      const response = await subscriptionService.getProxy(subscriptionId);

      // Update subscriptions state with new proxy credentials
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? {
                ...sub,
                provider_credentials: {
                  ProxyIP: response.proxy_ip,
                  HTTPPort: response.http_port,
                  SOCKS5Port: response.socks5_port,
                  Username: response.username,
                  Password: response.password
                } as any
              }
            : sub
        )
      );

      toast.success('Proxy information retrieved successfully');
    } catch (err) {
      console.error('Failed to get proxy:', err);
      toast.error('Failed to get proxy information');
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
      toast.success('Rotating proxy copied to clipboard');
    } else {
      // For fixed proxy: protocol://username:password@ip:port
      const credentials = record.provider_credentials as any;
      if (!credentials || !credentials.ProxyIP) {
        toast.error('No credentials available');
        return;
      }

      const protocol = credentials.HTTPPort > 0 ? 'http' : 'socks5';
      const username = credentials.Username || '';
      const password = credentials.Password || '';
      const ip = credentials.ProxyIP || '';
      const port = credentials.HTTPPort > 0 ? credentials.HTTPPort : credentials.SOCKS5Port;

      const proxyString = `${protocol}://${username}:${password}@${ip}:${port}`;

      console.log('Copying proxy string:', proxyString);
      await copyToClipboard(proxyString);

      setCopiedId(record.id);
      toast.success('Proxy copied to clipboard');
    }

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleAutoRenewChange = async (subscriptionId: string, checked: boolean) => {
    try {
      // Optimistically update UI
      setSubscriptions((prev) => prev.map((sub) => (sub.id === subscriptionId ? { ...sub, auto_renew: checked } : sub)));

      // Call backend API
      await subscriptionService.updateAutoRenew(subscriptionId, checked);
    } catch (err) {
      console.error('Failed to update auto-renew:', err);
      // Revert on error
      setSubscriptions((prev) => prev.map((sub) => (sub.id === subscriptionId ? { ...sub, auto_renew: !checked } : sub)));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(subscriptions.map((sub) => sub.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleCopyAllProxies = () => {
    copyToClipboard(proxyList.join('\n'));
  };

  const handleSaveAutoRenew = async () => {
    try {
      const selectedSubscriptions = subscriptions.filter((sub) => selectedIds.includes(sub.id));

      // Convert string to boolean
      const autoRenewValue = selectedAutoRenew === 'true';

      // Process all subscriptions with selected auto-renew value
      const promises = selectedSubscriptions.map((sub) => handleAutoRenewChange(sub.id, autoRenewValue));

      await Promise.all(promises);

      // Close modal and reset
      setShowAutoRenewModal(false);
      setSelectedAutoRenew('true');
    } catch (err) {
      console.error('Failed to update bulk auto-renew:', err);
    }
  };

  const isAllSelected = subscriptions.length > 0 && selectedIds.length === subscriptions.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < subscriptions.length;

  const columns: TableColumn<Subscription>[] = [
    {
      key: 'checkbox',
      title: <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={handleSelectAll} />,
      width: '50px',
      align: 'center',
      render: (_, record) => (
        <Checkbox checked={selectedIds.includes(record.id)} onChange={(checked) => handleSelectOne(record.id, checked)} />
      )
    },
    {
      key: 'id',
      title: 'STT',
      width: '50px',
      align: 'center',
      render: (_, __, index) => index + 1
    },

    {
      width: isMobile || isTablet ? 200 : '',
      key: 'subscription_id',
      title: 'ID',
      align: 'left',
      render: (_, record) => (
        <div className="group flex items-center">
          <p className="line-clamp-1 font-mono text-xs ">{record.id}</p>
          <ContentCopy
            className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(record.id);
              toast.success('Đã sao chép mã đơn hàng vào clipboard');
            }}
          />
        </div>
      )
    },
    {
      width: isMobile || isTablet ? 200 : '',
      key: 'ip',
      title: 'IP Address',
      align: 'left',
      render: (_, record) => {
        const ipAddress = getIpAddressByProxyType(record);
        return <div className="line-clamp-1 font-mono text-xs">{ipAddress}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'port',
      title: 'Port',
      align: 'left',
      render: (_, record) => {
        const port = getPortByProxyType(record);
        return <div className="line-clamp-1 font-mono text-xs">{port || '-'}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'status',
      title: 'Username',
      align: 'left',
      render: (_, record) => {
        const username = getUsernameByProxyType(record);
        return <div className="line-clamp-1 font-mono text-xs">{username}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'password',
      title: 'Password',
      align: 'left',
      render: (_, record) => {
        const { displayPassword } = getPasswordByProxyType(record);
        return <div className="line-clamp-1 font-mono text-xs">{displayPassword}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'connection_type',
      title: 'Type',
      align: 'center',
      render: (_, record) => {
        const isRotating = isRotatingProxy(record);
        let connectionType = '-';

        let bgColor = '#f3f4f6';
        let textColor = '#374151';

        if (isRotating) {
          connectionType = 'HTTPS';
        } else {
          const credentials = record.provider_credentials as any;
          connectionType = credentials?.HTTPPort > 0 ? 'HTTP' : credentials?.SOCKS5Port > 0 ? 'SOCKS5' : '-';
          if (connectionType === 'HTTP') {
            bgColor = '#dbeafe';
            textColor = '#1e40af';
          } else if (connectionType === 'SOCKS5') {
            bgColor = '#e9d5ff';
            textColor = '#7e22ce';
          }
        }

        return <div className="px-2 py-1 rounded text-xs font-semibold">{connectionType}</div>;
      }
    },
    {
      width: 150,
      key: 'auto_renew',
      title: 'Renew-Auto',
      align: 'center',
      render: (_, record) => (
        <Switch size="md" checked={record.auto_renew} onChange={(checked) => handleAutoRenewChange(record.id, checked)} />
      )
    },
    {
      width: isMobile || isTablet ? 200 : 180,
      key: 'country_code',
      title: 'Country',
      align: 'center',
      render: (_, record) => {
        const isRotating = isRotatingProxy(record);
        if (isRotating) {
          return <CountrySelectCell subscriptionId={record.id} currentCountry={record.country} />;
        }
        // For non-rotating proxies, show as plain text
        return <div className="line-clamp-1 font-semibold text-xs">{record.country || '-'}</div>;
      }
    },
    {
      width: 200,
      fixed: 'right',
      key: 'actions',
      title: 'Hành động',
      align: 'center',
      render: (_, record) => {
        const isRotating = isRotatingProxy(record);
        return (
          <div className="flex items-center justify-center gap-2">
            {' '}
            {!isRotating && (
              <>
                <IconButton
                  icon={<CloudSwapFilled className="text-blue-600 dark:text-blue-400" />}
                  className="w-8 h-8 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={() => {
                    setProtocolModalType('single');
                    const credentials = record.provider_credentials as any;
                    const connectionType = credentials?.HTTPPort > 0 ? 'http' : credentials?.SOCKS5Port > 0 ? 'socks5' : '-';
                    setSelectedProtocol(connectionType === 'http' ? 'http' : 'socks5');
                    handleSwitchProtocol({ selectedSubscriptionId: record.id });
                  }}
                  title="Change Protocol"
                />
                <IconButton
                  icon={<Replay className="text-orange-600 dark:text-orange-400" />}
                  className="w-8 h-8 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                  onClick={() => handleGetProxy(record.id)}
                  title="Get Proxy"
                />
              </>
            )}
            <IconButton
              className={`w-8 h-8 ${
                copiedId === record.id ? 'bg-green-50 dark:bg-green-900/30' : 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
              icon={<DocumentSync />}
              onClick={() => {
                const ip = getIpAddressByProxyType(record);
                const port = getPortByProxyType(record);
                const username = getUsernameByProxyType(record);
                const { plainPassword } = getPasswordByProxyType(record);

                const proxyString = `${ip}:${port}:${username}:${plainPassword}`;
                const blob = new Blob([proxyString], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `proxy_${record.id}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success('Proxy exported successfully');
              }}
            />
            <IconButton
              icon={
                copiedId === record.id ? (
                  <CheckMark className="text-green-600 dark:text-green-400" />
                ) : (
                  <ContentCopy className="text-purple-600 dark:text-purple-400" />
                )
              }
              className={`w-8 h-8 ${
                copiedId === record.id ? 'bg-green-50 dark:bg-green-900/30' : 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
              onClick={() => handleCopyProxy(record)}
              title={copiedId === record.id ? 'Copied!' : 'Copy Proxy'}
            />
          </div>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-104px)]">
        <div className="text-text-hi dark:text-text-hi-dark">Đang tải...</div>
      </div>
    );
  }

  if (error || subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-104px)] gap-4">
        <div className="text-text-hi dark:text-text-hi-dark">{error || 'Không tìm thấy đơn hàng'}</div>
        <Button onClick={() => navigate('/home')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  // Get plan name from first subscription
  const planName = subscriptions[0]?.plan?.name || 'Advanced Plan';

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
        <div className="p-5 bg-bg-canvas dark:bg-bg-canvas-dark border-b-2 border-border-element dark:border-border-element-dark">
          <div className="flex items-center justify-between mt-3">
            <Input
              placeholder="Tìm kiếm"
              wrapperClassName="bg-bg-input border-2 h-10 min-w-[223px]"
              icon={<MagnifyingGlass />}
              onChange={(e) => console.log(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <IconButton className="w-10 h-10" icon={<ArrowCounter />} />
              <OrderInfoModal />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden pb-5">
          <Table
            className="h-full pr-2"
            scroll={{ x: 800, y: isMobile ? '' : 'calc(100dvh - 450px)' }}
            data={subscriptions}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize,
              total: subscriptions.length,
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
          />
        </div>
      </motion.div>

      {/* Proxy List Modal */}
      <Modal
        open={showProxyModal}
        title="Danh sách Proxy"
        onClose={() => setShowProxyModal(false)}
        className="max-w-2xl"
        bodyClassName="p-5"
        actions={[
          <Button key="copy" onClick={handleCopyAllProxies}>
            Copy tất cả
          </Button>
        ]}
      >
        <div className="space-y-3">
          <p className="text-sm text-text-lo dark:text-text-lo-dark">
            Tổng số proxy: <span className="font-semibold">{proxyList.length}</span>
          </p>
          <textarea
            readOnly
            value={proxyList.join('\n')}
            className="w-full h-96 p-3 rounded-lg bg-bg-mute dark:bg-bg-mute-dark text-text-hi dark:text-text-hi-dark font-mono text-xs border border-border-element dark:border-border-element-dark focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-blue-dark resize-none"
            placeholder="Không có proxy nào được chọn"
          />
        </div>
      </Modal>

      {/* Auto Renew Modal */}
      <Modal
        open={showAutoRenewModal}
        title="Edit Auto Renew"
        onClose={() => {
          setShowAutoRenewModal(false);
          setSelectedAutoRenew('true');
        }}
        className="max-w-md"
        bodyClassName="p-5"
        actions={[
          <Button
            key="cancel"
            variant="outlined"
            onClick={() => {
              setShowAutoRenewModal(false);
              setSelectedAutoRenew('true');
            }}
          >
            Cancel
          </Button>,
          <Button key="save" onClick={handleSaveAutoRenew}>
            Save
          </Button>
        ]}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Auto Renew <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: 'true', label: 'Bật' },
                { value: 'false', label: 'Tắt' }
              ]}
              value={selectedAutoRenew}
              onChange={(value) => setSelectedAutoRenew(String(value))}
              placeholder="Select auto renew"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
