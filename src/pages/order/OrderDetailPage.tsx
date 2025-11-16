import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { ArrowRotate, CloudSwapFilled, ContentCopy, CheckMark } from '@/components/icons';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { Modal } from '@/components/modal/Modal';
import { Select } from '@/components/select/Select';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subscriptionService } from '@/services/subscription/subscription.service';
import { Subscription } from '@/types/subscription';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { sectionVariants } from '@/utils/animation';
import { copyToClipboard } from '@/utils/copyToClipboard';

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
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [protocolModalType, setProtocolModalType] = useState<'single' | 'bulk'>('single');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<'http' | 'socks5'>('http');
  const [showAutoRenewModal, setShowAutoRenewModal] = useState(false);
  const [selectedAutoRenew, setSelectedAutoRenew] = useState<boolean>(true);

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

  const handleChangeProtocol = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setProtocolModalType('single');
    setShowProtocolModal(true);
  };

  const handleSwitchProtocol = async () => {
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
                      Password: response.password,
                    },
                  }
                : s
            )
          );
        }
      } else if (protocolModalType === 'bulk') {
        // Bulk switch - filter out rotating proxies
        const selectedSubscriptions = subscriptions
          .filter((sub) => selectedIds.includes(sub.id))
          .filter((sub) => !isRotatingProxy(sub)); // Skip rotating proxies

        for (const sub of selectedSubscriptions) {
          try {
            const response = await subscriptionService.switchProtocol(sub.id, protocol);

            if (response.success) {
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
                          Password: response.password,
                        },
                      }
                    : s
                )
              );
            }
          } catch (err) {
            console.error(`Failed to switch protocol for subscription ${sub.id}:`, err);
          }
        }
      }

      // Close modal and reset
      setShowProtocolModal(false);
      setSelectedSubscriptionId(null);
      setSelectedProtocol('http');
    } catch (err) {
      console.error('Failed to switch protocol:', err);
    }
  };

  const handleRefresh = (subscriptionId: string) => {
    console.log('Refresh subscription:', subscriptionId);
    // TODO: Implement later
  };

  const handleCopyProxy = async (record: Subscription) => {
    // Format: protocol://username:password@ip:port
    const credentials = record.provider_credentials as any;
    if (!credentials || !credentials.ProxyIP) {
      console.error('No credentials available');
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

    // Show success feedback
    setCopiedId(record.id);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleAutoRenewChange = async (subscriptionId: string, checked: boolean) => {
    try {
      // Optimistically update UI
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === subscriptionId ? { ...sub, auto_renew: checked } : sub))
      );

      // Call backend API
      await subscriptionService.updateAutoRenew(subscriptionId, checked);
    } catch (err) {
      console.error('Failed to update auto-renew:', err);
      // Revert on error
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === subscriptionId ? { ...sub, auto_renew: !checked } : sub))
      );
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

  const handleBulkGetProxy = () => {
    const selectedSubscriptions = subscriptions.filter((sub) => selectedIds.includes(sub.id));
    const proxyStrings = selectedSubscriptions.map((record) => {
      const credentials = record.provider_credentials as any;
      if (credentials && credentials.ProxyIP) {
        const protocol = credentials.HTTPPort > 0 ? 'http' : 'socks5';
        const username = credentials.Username || '';
        const password = credentials.Password || '';
        const ip = credentials.ProxyIP || '';
        const port = credentials.HTTPPort > 0 ? credentials.HTTPPort : credentials.SOCKS5Port;
        return `${protocol}://${username}:${password}@${ip}:${port}`;
      }
      return null;
    }).filter(Boolean) as string[];

    setProxyList(proxyStrings);
    setShowProxyModal(true);
  };

  const handleCopyAllProxies = () => {
    copyToClipboard(proxyList.join('\n'));
  };

  const handleBulkAutoRenew = () => {
    setShowAutoRenewModal(true);
  };

  const handleSaveAutoRenew = async () => {
    try {
      const selectedSubscriptions = subscriptions.filter((sub) => selectedIds.includes(sub.id));

      // Process all subscriptions with selected auto-renew value
      const promises = selectedSubscriptions.map(sub =>
        handleAutoRenewChange(sub.id, selectedAutoRenew)
      );

      await Promise.all(promises);

      // Close modal and reset
      setShowAutoRenewModal(false);
      setSelectedAutoRenew(true);
    } catch (err) {
      console.error('Failed to update bulk auto-renew:', err);
    }
  };

  const handleBulkSwitchProtocol = () => {
    setProtocolModalType('bulk');
    setShowProtocolModal(true);
  };

  const isAllSelected = subscriptions.length > 0 && selectedIds.length === subscriptions.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < subscriptions.length;

  // Helper function to check if subscription is rotating proxy
  const isRotatingProxy = (record: Subscription) => {
    // Rotating proxies have plan type 'rotating' or category 'rotating'
    return record.plan?.type === 'rotating' || record.plan?.category === 'rotating';
  };

  const columns: TableColumn<Subscription>[] = [
    {
      key: 'checkbox',
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
        />
      ),
      width: '50px',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={(checked) => handleSelectOne(record.id, checked)}
        />
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
      key: 'id',
      title: 'IP Address',
      align: 'left',
      render: (_, record) => {
        const credentials = record.provider_credentials as any;
        return <div className="line-clamp-1 font-mono text-xs">{credentials?.ProxyIP || '-'}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'api_key',
      title: 'Port',
      align: 'left',
      render: (_, record) => {
        const credentials = record.provider_credentials as any;
        const port = credentials?.HTTPPort > 0 ? credentials.HTTPPort : credentials?.SOCKS5Port;
        return <div className="line-clamp-1 font-mono text-xs">{port || '-'}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'status',
      title: 'Username',
      align: 'left',
      render: (_, record) => {
        const credentials = record.provider_credentials as any;
        return <div className="line-clamp-1 font-mono text-xs">{credentials?.Username || '-'}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'country',
      title: 'Password',
      align: 'left',
      render: (_, record) => {
        const credentials = record.provider_credentials as any;
        return <div className="line-clamp-1 font-mono text-xs">{credentials?.Password || '********'}</div>;
      }
    },
    {
      width: isMobile || isTablet ? 150 : '',
      key: 'plan',
      title: 'Connection Type',
      align: 'center',
      render: (_, record) => {
        const credentials = record.provider_credentials as any;
        const connectionType = credentials?.HTTPPort > 0 ? 'HTTP' : credentials?.SOCKS5Port > 0 ? 'SOCKS5' : '-';
        const colorClass = connectionType === 'HTTP' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
        return (
          <div className={`px-2 py-1 rounded ${colorClass} text-xs font-semibold`}>
            {connectionType}
          </div>
        );
      }
    },
    {
      width: isMobile || isTablet ? 200 : '',
      key: 'plan',
      title: 'Plan',
      align: 'left',
      render: (_, record) => <div className="line-clamp-1 text-xs">{record.plan?.name || '-'}</div>
    },
    {
      width: 150,
      key: 'auto_renew',
      title: 'Renew-Auto',
      align: 'center',
      render: (_, record) => (
        <Switch
          size="md"
          checked={record.auto_renew}
          onChange={(checked) => handleAutoRenewChange(record.id, checked)}
        />
      )
    },
    {
      width: isMobile || isTablet ? 200 : 250,
      fixed: 'right',
      key: 'actions',
      title: 'Hành động',
      align: 'center',
      render: (_, record) => {
        const isRotating = isRotatingProxy(record);
        return (
          <div className="flex items-center justify-center gap-2">
            <IconButton
              icon={
                copiedId === record.id ? (
                  <CheckMark className="text-green-600 dark:text-green-400" />
                ) : (
                  <ContentCopy className="text-purple-600 dark:text-purple-400" />
                )
              }
              className={`w-8 h-8 ${
                copiedId === record.id
                  ? 'bg-green-50 dark:bg-green-900/30'
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
              onClick={() => handleCopyProxy(record)}
              title={copiedId === record.id ? 'Copied!' : 'Copy Proxy'}
            />
            {!isRotating && (
              <>
                <IconButton
                  icon={<CloudSwapFilled className="text-blue-600 dark:text-blue-400" />}
                  className="w-8 h-8 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={() => handleChangeProtocol(record.id)}
                  title="Change Protocol"
                />
                <IconButton
                  icon={<ArrowRotate className="text-green-600 dark:text-green-400" />}
                  className="w-8 h-8 hover:bg-green-50 dark:hover:bg-green-900/30"
                  onClick={() => handleRefresh(record.id)}
                  title="Refresh"
                />
              </>
            )}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-hi dark:text-text-hi-dark mb-2">
                {planName}
              </h1>
              <p className="text-sm text-text-lo dark:text-text-lo-dark">
                Mã đơn hàng: <span className="font-mono font-semibold">{id}</span>
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/home')}>
              Quay lại
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 py-4 bg-bg-surface dark:bg-bg-surface-dark">
          <p className="text-sm text-text-lo dark:text-text-lo-dark leading-relaxed">
            Nếu bạn muốn IP định cố định cho kết nối, thêm một session id vào phần username (ví dụ: user_session123).
            Nếu bạn không thêm session id thì hệ thống sẽ tự động xoay IP sau mỗi lần kết thành công (default rotation).
          </p>
        </div>

        {/* Search and actions bar */}
        <div className="px-5 py-3 bg-bg-canvas dark:bg-bg-canvas-dark border-b-2 border-border-element dark:border-border-element-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-hi dark:text-text-hi-dark">Trang {currentPage}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkGetProxy}
                disabled={selectedIds.length === 0}
              >
                Get proxy ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkAutoRenew}
                disabled={selectedIds.length === 0}
              >
                Bật / Tắt tự động gia hạn ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkSwitchProtocol}
                disabled={selectedIds.length === 0}
              >
                Change Protocol ({selectedIds.length})
              </Button>
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

      {/* Protocol Selection Modal */}
      <Modal
        open={showProtocolModal}
        title="Edit Protocol"
        onClose={() => {
          setShowProtocolModal(false);
          setSelectedSubscriptionId(null);
          setSelectedProtocol('http');
        }}
        className="max-w-md"
        bodyClassName="p-5"
        actions={[
          <Button key="cancel" variant="outline" onClick={() => {
            setShowProtocolModal(false);
            setSelectedSubscriptionId(null);
            setSelectedProtocol('http');
          }}>
            Cancel
          </Button>,
          <Button key="save" onClick={handleSwitchProtocol}>
            Save
          </Button>
        ]}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Protocol <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: 'http', label: 'HTTP' },
                { value: 'socks5', label: 'SOCKS5' }
              ]}
              value={selectedProtocol}
              onChange={(value) => setSelectedProtocol(value as 'http' | 'socks5')}
              placeholder="Select protocol"
            />
          </div>
        </div>
      </Modal>

      {/* Auto Renew Modal */}
      <Modal
        open={showAutoRenewModal}
        title="Edit Auto Renew"
        onClose={() => {
          setShowAutoRenewModal(false);
          setSelectedAutoRenew(true);
        }}
        className="max-w-md"
        bodyClassName="p-5"
        actions={[
          <Button key="cancel" variant="outline" onClick={() => {
            setShowAutoRenewModal(false);
            setSelectedAutoRenew(true);
          }}>
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
                { value: true, label: 'Bật' },
                { value: false, label: 'Tắt' }
              ]}
              value={selectedAutoRenew}
              onChange={(value) => setSelectedAutoRenew(value as boolean)}
              placeholder="Select auto renew"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
