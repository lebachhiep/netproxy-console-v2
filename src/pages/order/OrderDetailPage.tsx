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
  DashboardFilled,
  LockMultiple
} from '@/components/icons';
import { Switch } from '@/components/switch/Switch';
import { Table, TableColumn } from '@/components/table/Table';
import { Select } from '@/components/select/Select';
import { useState, useMemo, useEffect, ReactNode, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { subscriptionService } from '@/services/subscription/subscription.service';
import { Subscription, SwitchProtocolResponse } from '@/types/subscription';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { sectionVariants } from '@/utils/animation';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { Input } from '@/components/input/Input';
import { OrderInfoModal } from './OrderInfoModal';
import { getIpAddressByProxyType, getPasswordByProxyType, getPortByProxyType, getUsernameByProxyType, isRotatingProxy } from './utils';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { queryClient } from '@/components/auth/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { useNavbar } from '@/contexts/NavbarContext';
import { OrderCountryModal } from './OrderCountryModal';

// ISO alpha-2 country codes
export const getCountryOptions = (t: any) => [
  { label: t('countryList.random'), value: 'random' },
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

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Subscription[]>([]);
  const { t } = useTranslation();
  const [loadingRowIndexes, setLoadingRowIndexes] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const { setNavbarItems } = useNavbar();

  const CountrySelectCell: React.FC<CountrySelectCellProps> = ({ subscriptionId, currentCountry, className }: CountrySelectCellProps) => {
    const { t } = useTranslation();
    const storedData = useSubscriptionStore((state) => state.getSubscriptionData(subscriptionId));
    const [selectedCountry, setSelectedCountry] = useState<string>(storedData?.country || currentCountry || 'VN');

    const handleCountryChange = (value: string | number | undefined, label: ReactNode) => {
      const countryCode = String(value);
      setSelectedCountry(countryCode);
      useSubscriptionStore.getState().setSubscriptionData(subscriptionId, { country: countryCode });
      toast.success(
        t('toast.success.changeCountry', {
          country: label
        })
      );
      // update table country
      queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
        return oldSubs.map((s) => {
          if (s.id === subscriptionId) {
            return {
              ...s,
              country: value
            };
          }
          return s;
        });
      });
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

  useEffect(() => {
    return () => {
      setNavbarItems([]);
    };
  }, []);

  const { data: subscriptions } = useQuery({
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
          per_page: pageSize
        });

        // Extract subscriptions array from response
        if (response && Array.isArray(response.subscriptions)) {
          setNavbarItems([
            {
              label: response.subscriptions[0]?.plan?.name || t('orderDetail.name'),
              icon: <DashboardFilled width={32} height={32} className="text-primary" />
            }
          ]);
          setTotal(response.total);
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

  const pageTitle = usePageTitle({ pageName: 'Chi tiết đơn hàng', orderId: subscriptions?.[0]?.notes || '' });

  const isBelongRotatingProxy = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return false;
    return subscriptions?.some((sub) => isRotatingProxy(sub));
  }, [subscriptions]);

  const handleSwitchProtocol = async ({ subs }: { subs: Subscription[] }) => {
    try {
      // Build a list of promises with metadata (subId)
      const promiseList = subs.map((sub) => {
        const connectionType =
          sub?.provider_credentials?.http_port > 0 ? 'http' : sub?.provider_credentials?.socks5_port > 0 ? 'socks5' : '-';
        const newConnectionType = connectionType === 'http' ? 'socks5' : 'http';
        // Attach subId as metadata to each promise
        return {
          subId: sub.id,
          promise: subscriptionService.switchProtocol(sub.id, newConnectionType),
          newSub: {
            ...sub,
            provider_credentials: {
              ...sub.provider_credentials,
              http_port: newConnectionType
            }
          }
        };
      });

      // Wait for all promises to settle
      const results = await Promise.allSettled(promiseList.map((item) => item.promise));
      let successCount = 0;
      let failureCount = 0;
      const switchedSubMap = new Map<string, SwitchProtocolResponse>();

      // Map results back to subId using the original array index
      results.forEach((res, idx) => {
        const subId = promiseList[idx].subId;
        if (res.status === 'fulfilled' && res.value.success) {
          successCount++;
          switchedSubMap.set(subId, res.value);
        } else {
          failureCount++;
        }
      });

      queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
        return oldSubs.map((sub) => {
          const switchedSub = switchedSubMap.get(sub.id);
          if (switchedSub) {
            return {
              ...sub,
              provider_credentials: {
                ...sub.provider_credentials,
                ...switchedSub
              }
            };
          }
          return sub;
        });
      });

      // Update selected rows
      if (selectedRows?.length) {
        const successFullSub = new Map<string, Subscription>();
        promiseList.forEach((sub, idx) => {
          if (results?.[idx]?.status === 'fulfilled') {
            successFullSub.set(sub.subId, sub.newSub);
          }
        });
        const newSelectedSubs = selectedRows
          .map((sub) => {
            if (successFullSub.has(sub.id)) {
              return successFullSub.get(sub.id);
            }
            return sub;
          })
          .filter((sub): sub is Subscription => sub !== undefined);
        setSelectedRows(newSelectedSubs);
      }

      return { successCount, failureCount };
    } catch (err) {
      console.error('Failed to switch protocol:', err);
      toast.error('Failed to switch protocol');
    }
  };

  const handleGetProxy = async (sub: Subscription) => {
    try {
      const subscription = subscriptions?.find((sub) => sub.id === sub.id);
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

      const response = await subscriptionService.getProxy(sub.id);
      if (!response) {
        toast.error(t('toast.error.proxyInfo'));
        return;
      }

      queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
        return oldSubs.map((s) => {
          if (s.id === sub.id) {
            return {
              ...s,
              provider_credentials: {
                ...response
              }
            };
          }
          return s;
        });
      });

      toast.success(t('toast.success.proxyInfo'));
    } catch (err) {
      console.error('Failed to get proxy:', err);
      toast.error(t('toast.error.proxyInfo'));
    }
  };

  const handleCopyProxy = async (record: Subscription) => {
    const isRotating = isRotatingProxy(record);

    if (isRotating) {
      const username = getUsernameByProxyType(record);
      const host = !record?.country || record.country === 'VN' ? 'vn.relay.prx.network' : 'relay.prx.network';
      const proxyString = `${host}:80:${username}:${record.api_key}`;

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

  const handleToggleAutoRenew = useCallback(
    async (subs: Subscription[]): Promise<{ successfullyCount: number; failedCount: number }> => {
      const loadingRowIndexes = subs.map((sub) => (subscriptions?.findIndex((s) => s.id === sub.id) || 0) + 1);
      setLoadingRowIndexes((prev) => [...prev, ...loadingRowIndexes]);
      try {
        const promiseList = subs.map((sub) => {
          const newAutoRenewStatus = !sub.auto_renew;
          return {
            subId: sub.id,
            autoRenew: newAutoRenewStatus,
            newSub: { ...sub, auto_renew: newAutoRenewStatus },
            promise: subscriptionService.updateAutoRenew(sub.id, newAutoRenewStatus)
          };
        });

        const results = await Promise.allSettled(promiseList.map((item) => item.promise));
        queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
          // Fill result to map
          const renewResultUpdateMap = new Map<string, boolean>();
          results.forEach((sub, idx) => {
            if (promiseList?.[idx] && sub.status === 'fulfilled') {
              renewResultUpdateMap.set(promiseList[idx].subId, promiseList[idx].autoRenew);
            }
          });

          return oldSubs.map((sub) => {
            // Checking status is fulfilled before update the UI
            if (renewResultUpdateMap.has(sub.id)) {
              return {
                ...sub,
                auto_renew: renewResultUpdateMap.get(sub.id)
              };
            }
            return sub;
          });
        });

        const successfullyCount = results.filter((res) => res.status === 'fulfilled').length;
        const failedCount = results.length - successfullyCount;

        // Update selected rows
        if (selectedRows?.length) {
          const successFullSub = new Map<string, Subscription>();
          promiseList.forEach((sub, idx) => {
            if (results?.[idx]?.status === 'fulfilled') {
              successFullSub.set(sub.subId, sub.newSub);
            }
          });
          const newSelectedSubs = selectedRows
            .map((sub) => {
              if (successFullSub.has(sub.id)) {
                return successFullSub.get(sub.id);
              }
              return sub;
            })
            .filter((sub): sub is Subscription => sub !== undefined);
          setSelectedRows(newSelectedSubs);
        }

        return {
          successfullyCount,
          failedCount
        };
      } catch (err) {
        console.error('Failed to update auto-renew:', err);
        toast.error(t('toast.error.autoRenew'));
        return { successfullyCount: 0, failedCount: subs.length };
      } finally {
        setLoadingRowIndexes((prev) => prev.filter((index) => !loadingRowIndexes.includes(index)));
      }
    },
    [currentPage, id, pageSize, subscriptions, t]
  );

  const handleToggleSticky = () => {
    queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
      const selectedRowMap = new Map<string, Subscription>();
      selectedRows.forEach((sub) => {
        selectedRowMap.set(sub.id, sub);
      });
      return oldSubs.map((s) => {
        const isExist = selectedRowMap.has(s.id);
        if (isExist) {
          return {
            ...s,
            tableData: {
              ...s.tableData,
              hasSticky: !s?.tableData?.hasSticky
            }
          };
        }
        return s;
      });
    });
  };

  const columns: (isRotating: boolean) => TableColumn<Subscription>[] = useCallback(
    (isRotating: boolean) => {
      return [
        {
          key: 'id',
          title: t('STT'),
          width: 50,
          align: 'center' as const,
          render: (_, __, index) => index + 1
        },
        {
          width: 100,
          key: 'subscription_id',
          title: 'ID',
          align: 'left' as const,
          render: (_, record) => (
            <div className="group flex items-center justify-between">
              <p className="flex-1 truncate line-clamp-1 font-mono">{record.id}</p>
              <ContentCopy
                className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                onClick={async (e) => {
                  e.stopPropagation();
                  await copyToClipboard(record.id);
                  toast.success(t('dashboard.copyOrderIDSuccess'));
                }}
              />
            </div>
          )
        },
        {
          width: 100,
          key: 'ip',
          title: t('ipAddress'),
          align: 'left' as const,
          render: (_, record) => {
            const ipAddress = getIpAddressByProxyType(record);
            return (
              <div className="group flex items-center justify-between">
                <p className="flex-1 truncate line-clamp-1 font-mono">{ipAddress}</p>
                <ContentCopy
                  className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await copyToClipboard(ipAddress);
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
          align: 'left' as const,
          render: (_, record) => {
            const port = getPortByProxyType(record);
            return (
              <div className="group flex items-center justify-between">
                <p className="flex-1 truncate line-clamp-1 font-mono">{port}</p>
                <ContentCopy
                  className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    copyToClipboard(port);
                    toast.success(t('toast.success.port'));
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
          align: 'left' as const,
          render: (_, record) => {
            const username = getUsernameByProxyType(record);
            return (
              <div className="group flex items-center justify-between">
                <p className="flex-1 truncate line-clamp-1 font-mono">{username}</p>
                <ContentCopy
                  className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await copyToClipboard(username);
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
          align: 'left' as const,
          render: (_, record) => {
            const { plainPassword } = getPasswordByProxyType(record);
            return (
              <div className="group flex items-center justify-between">
                <p className="flex-1 truncate line-clamp-1 font-mono">{plainPassword}</p>
                <ContentCopy
                  className="text-blue ml-2 hidden group-hover:inline-block w-fit cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await copyToClipboard(plainPassword);
                    toast.success(t('toast.success.passwordClipboard'));
                  }}
                />
              </div>
            );
          }
        },
        ...(isRotating
          ? [
              {
                width: 100,
                key: 'tableData.hasSticky',
                title: t('stickyIp'),
                align: 'center' as const,
                render: (_: any, record: Subscription) => {
                  return (
                    <Switch
                      size="md"
                      checked={record?.tableData?.hasSticky || false}
                      onChange={async () => {
                        queryClient.setQueryData(['order-subscriptions', id, currentPage, pageSize], (oldSubs: Subscription[]) => {
                          return oldSubs.map((s) => {
                            if (s.id === record.id) {
                              return {
                                ...s,
                                tableData: {
                                  ...s.tableData,
                                  hasSticky: !record?.tableData?.hasSticky
                                }
                              };
                            }
                            return s;
                          });
                        });
                      }}
                    />
                  );
                }
              }
            ]
          : []),
        {
          width: 180,
          key: 'country_code',
          title: t('country'),
          align: 'center' as const,
          render: (_: any, record: Subscription) => {
            const isRotating = isRotatingProxy(record);
            if (isRotating) {
              console.log(record.country);
              return <CountrySelectCell subscriptionId={record.id} currentCountry={record.country || 'VN'} className="max-w-40 mx-auto" />;
            }
            // For non-rotating proxies, show as plain text
            return <div className="line-clamp-1 font-semibold text-xs">{record.country || '-'}</div>;
          }
        },
        {
          width: 100,
          key: 'connection_type',
          title: 'Type',
          align: 'center' as const,
          render: (_, record) => {
            const credentials = record.provider_credentials as any;
            const connectionType = credentials?.http_port > 0 ? 'HTTPS' : credentials?.socks5_port > 0 ? 'SOCKS5' : '-';
            const isRotating = isRotatingProxy(record);

            return <div className="px-2 py-1 rounded text-xs font-semibold">{isRotating ? 'HTTP/ HTTPS' : connectionType}</div>;
          }
        },
        {
          width: 130,
          key: 'auto_renew',
          title: t('autoRenew'),
          align: 'center' as const,
          render: (_, record) => (
            <Switch
              size="md"
              checked={record.auto_renew}
              onChange={async () => {
                const result = await handleToggleAutoRenew([record]);
                if (result.successfullyCount) {
                  toast.success(t('toast.success.autoRenew'));
                } else {
                  toast.error(t('toast.error.autoRenew'));
                }
              }}
            />
          )
        },
        {
          width: 150,
          key: 'expires_at',
          title: t('expired'),
          render: (value, record) => (
            <div className="font-semibold">{moment(value || record.current_period_end).format('DD/MM/YYYY HH:mm')}</div>
          )
        },
        {
          width: 200,
          fixed: isMobile || isTablet ? undefined : 'right',
          key: 'actions',
          title: t('action'),
          align: 'center' as const,
          render: (_, record: Subscription, rowIndex) => {
            const isRotating = isRotatingProxy(record);
            return (
              <div className="flex items-center justify-center gap-2">
                {!isRotating && (
                  <>
                    <IconButton
                      icon={<CloudSwap />}
                      className="rounded-lg w-8 h-8 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      onClick={async () => {
                        setLoadingRowIndexes((prev) => [...prev, rowIndex + 1]);
                        const result = await handleSwitchProtocol({ subs: [record] });
                        if (result?.successCount && result.successCount > 0) {
                          toast.success(t('toast.success.changeProxySub'));
                        } else {
                          toast.error(t('toast.error.changeProxySub'));
                        }
                        setLoadingRowIndexes((prev) => prev.filter((index) => index !== rowIndex + 1));
                      }}
                      title="Change Protocol"
                    />
                    <IconButton
                      icon={<Reload />}
                      iconClassName="text-[#FDBE02] hover:!text-[#FDBE02] dark:text-[#FDBE02]"
                      className="rounded-lg w-8 h-8"
                      onClick={async () => {
                        const rowIndex = subscriptions?.findIndex((sub) => sub.id === record.id) || 0;
                        setLoadingRowIndexes((prev) => [...prev, rowIndex + 1]);
                        await handleGetProxy(record);
                        setLoadingRowIndexes((prev) => prev.filter((index) => index !== rowIndex + 1));
                      }}
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
                    const username = getUsernameByProxyType(record);
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
    },
    [t, isMobile, isTablet, handleToggleAutoRenew, copiedId, handleSwitchProtocol, subscriptions]
  );

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
          <div className="flex items-center justify-between gap-2">
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
                    const loadingRowIndexes = selectedRows.map((row) => (subscriptions?.findIndex((sub) => sub.id === row.id) || 0) + 1);
                    setLoadingRowIndexes((prev) => [...prev, ...loadingRowIndexes]);
                    const result = await handleSwitchProtocol({
                      subs: selectedRows
                    });

                    if (result?.successCount && result.successCount > 0) {
                      toast.success(
                        t('toast.success.changeProxySubCount', {
                          successfullyCount: result.successCount,
                          failedCount: result.failureCount
                        })
                      );
                    } else {
                      toast.error(t('toast.error.changeProxySub'));
                    }

                    setLoadingRowIndexes((prev) => prev.filter((index) => !loadingRowIndexes.includes(index)));
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
                  const result = await handleToggleAutoRenew(selectedRows);
                  if (result && result.successfullyCount) {
                    toast.success(
                      t('toast.success.toggleAutoRenew', { successfullyCount: result.successfullyCount, failedCount: result.failedCount })
                    );
                  } else {
                    toast.error(t('toast.error.autoRenew'));
                  }
                }}
                title="Renew Auto Toggle"
              />

              {/* Download */}
              <IconButton
                disabled={selectedRows.length === 0}
                className={`w-10 h-10 hover:bg-blue-50 dark:hover:bg-blue-900/30`}
                icon={<ArrowDownload className="w-5 h-5 " />}
                onClick={() => {
                  const selectedProxies = [
                    'ip:port:user:password',
                    ...(subscriptions || [])
                      .filter((sub) => selectedRows.some((row) => row.id === sub.id))
                      .map((record) => {
                        const ip = getIpAddressByProxyType(record);
                        const port = getPortByProxyType(record);
                        const username = getUsernameByProxyType(record);
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

              {/* Toggle sticky IP */}
              <IconButton
                className={`w-10 h-10`}
                disabled={selectedRows.length === 0}
                icon={<LockMultiple className="w-5 h-5" />}
                onClick={handleToggleSticky}
                title={t('stickyIp')}
              />

              {/* Country change */}
              <OrderCountryModal selectedRows={selectedRows} queryKey={['order-subscriptions', id, currentPage, pageSize]} />

              {/* Thông tin */}
              <OrderInfoModal type={isBelongRotatingProxy ? 'rotating' : 'provider'} />

              {/* Refresh */}
              <IconButton
                className="w-10 h-10"
                icon={<ArrowCounter className="w-5 h-5" />}
                onClick={async () => {
                  setCurrentPage(1);
                  setPageSize(100);
                  await queryClient.invalidateQueries({ queryKey: ['order-subscriptions'] });
                  const params = new URLSearchParams(window.location.search);
                  params.delete('page');
                  params.delete('pageSize');
                  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                  toast.success(t('toast.success.newData'));
                }}
                title={t('refresh')}
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
            columns={columns(subscriptions?.[0]?.plan?.type === 'rotating' || subscriptions?.[0]?.plan?.category === 'rotating')}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              pageSizeOptions: [100],
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
            rowDisabled={(r) => {
              return r.status !== 'active';
            }}
            rowLoading={loadingRowIndexes}
            loading={loading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;
