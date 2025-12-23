import { PricingCard } from '@/components/card/PricingCard';
import {
  ArrowRotate,
  CalendarClockOutline,
  CartFilled,
  Clock,
  DatabaseStackOutlined,
  Dismiss,
  Fire,
  Grid,
  ShieldCheckmark,
  TopSpeed
} from '@/components/icons';
import { Tabs } from '@/components/tabs/Tabs';
import React, { useState, useEffect, useMemo } from 'react';
import OrderSummary from './components/OrderSumary';
import { DedicatedPlanFilter } from './components/DedicatedPlanFilter';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import IconButton from '@/components/button/IconButton';
import { useCart } from '@/hooks/useCart';
import { planService } from '@/services/plan/plan.service';
import { Plan } from '@/services/plan/plan.types';
import { formatFrequency, formatBandwidth, formatThroughput, formatDuration } from '@/services/plan/plan.utils';
import { PlanCardSkeleton } from '@/components/skeleton/PlanCardSkeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { usePageTitle } from '@/hooks/usePageTitle';
import { RadioGroup } from '@/components/radio/RadioGroup';
import { PurchaseConfirmModal } from './PurchaseConfirmModal';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
// Animation variants
const easeInOutCustom = [0.44, 0, 0.56, 1] as const;

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: easeInOutCustom as any
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeInOutCustom as any
    }
  }
};

type TabKey = 'rotating' | 'premium_isp' | 'private_ipv4' | 'shared_ipv4' | 'ipv6'; // string for dedicated proxy types

const PurchasePage: React.FC = () => {
  const { t } = useTranslation();
  const [filteredDuration, setFilteredDuration] = useState('');
  const [durationOptions, setDurationOptions] = useState<number[]>([]);
  const [confirmModal, setConfirmModalOpen] = useState(false);

  // Tab state
  const [activeMain, setActiveMain] = useState<TabKey>('rotating');
  const [activeDedicatedTab, setActiveDedicatedTab] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  const {
    data: plansData,
    isLoading: loading,
    refetch: refetchPlans,
    error
  } = useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.getAllPlans()
  });

  // Rotating plans from API response
  const rotatingPlans = useMemo(() => plansData?.rotate.sort((a, b) => a.sort_order - b.sort_order) || [], [plansData]);

  // Dedicated tabs cố định
  const dedicatedTabs = [
    { label: t('purchase.premiumIsp'), key: 'premium_isp' },
    { label: t('purchase.privateIpv4'), key: 'private_ipv4' },
    // { label: t('purchase.sharedIpv4'), key: 'shared_ipv4' },
    { label: t('purchase.ipv6'), key: 'ipv6' }
  ];

  // Set active dedicated tab when plans load
  useEffect(() => {
    if (dedicatedTabs.length > 0 && !activeDedicatedTab) {
      setActiveDedicatedTab(dedicatedTabs[0].key);
    }
  }, []);

  // Dynamic speed groups for rotating plans
  const speedGroups = useMemo(() => {
    const uniqueThroughputs = [...new Set(rotatingPlans.map((p) => p.throughput).filter(Boolean))].sort((a, b) => (a || 0) - (b || 0));

    const throughputPrefix = {
      5: 'Basic Plan: ',
      10: 'Standard Plan: ',
      25: 'Advanced Plan: ',
      50: 'Premium Plan: '
    };

    return uniqueThroughputs.map((throughput) => ({
      label: `${throughputPrefix?.[throughput as keyof typeof throughputPrefix] || ''}${throughput} MBPS`,
      key: `${throughput}mbps`,
      value: throughput
    }));
  }, [rotatingPlans]);

  const [activeGroup, setActiveGroup] = useState(speedGroups[0]?.key || '');

  const pageTitle = usePageTitle({ pageName: 'Mua hàng', tabName: activeMain, plan: activeGroup });

  // Update active group when speed groups change
  useEffect(() => {
    if (speedGroups.length > 0 && !speedGroups.find((g) => g.key === activeGroup)) {
      setActiveGroup(speedGroups[0].key);
    }
  }, [speedGroups, activeGroup]);

  // Sync duration options when rotating plans change
  useEffect(() => {
    const durations = rotatingPlans.map((p) => p.duration).filter((d): d is number => d !== undefined);
    const sortedDurations = Array.from(new Set(durations)).sort((a, b) => a - b);
    setFilteredDuration('' + sortedDurations[0]);
    setDurationOptions(sortedDurations);
  }, [rotatingPlans]);

  useEffect(() => {
    const hasRotatingItems = cart.itemsByTab.rotating.length > 0;
    if (hasRotatingItems) {
      setConfirmModalOpen(true);
    }
  }, [cart]);

  // Helper to get display price
  const getDisplayPrice = (plan: Plan): string => {
    // If plan has price = 0 and we have a cached default price, use it
    // if (plan.price === 0 && defaultPrices[plan.id]) {
    //   return defaultPrices[plan.id].toFixed(2);
    // }
    // Otherwise use plan.price (có thể là 0 nếu chưa fetch price)
    return plan.price.toFixed(2);
  };

  // Helper to build features for PricingCard
  const buildPlanFeatures = (plan: Plan, t: (key: string) => string) => {
    const features: Array<{ icon: React.ReactNode; label: React.ReactNode }> = [];

    // Protocol support (hardcoded for now - could come from plan.package in future)
    features.push({
      icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
      label: (
        <div className="text-base">
          <label>{t('purchase.support')}: </label>
          <span className="font-bold">{t('purchase.httpHttps')}</span>
        </div>
      )
    });

    // Rotation frequency (for rotating proxies)
    if (plan.frequency) {
      features.push({
        icon: <Clock className="w-6 h-6 text-yellow" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.rotationTime')}: </label>
            <span className="font-bold">{formatFrequency(plan.frequency, t)}</span>
          </div>
        )
      });
    }

    // Duration (for time-based plans)
    if (plan.duration) {
      features.push({
        icon: <CalendarClockOutline className="w-6 h-6 text-blue" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.duration')}: </label>
            <span className="font-bold">{formatDuration(plan.duration, t)}</span>
          </div>
        )
      });
    }

    // Bandwidth
    if (plan.bandwidth !== undefined) {
      features.push({
        icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.bandwidth')}: </label>
            <span className="font-bold">{formatBandwidth(plan.bandwidth)}</span>
          </div>
        )
      });
    } else if (!plan.max_concurrent) {
      // Unlimited bandwidth when max_concurrent doesn't exist
      features.push({
        icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.bandwidth')}: </label>
            <span className="font-bold">{t('purchase.unlimited')}</span>
          </div>
        )
      });
    }

    // Rotation count (hardcoded as unlimited for rotating plans)
    if (plan.type === 'rotating') {
      features.push({
        icon: <ArrowRotate className="w-6 h-6 text-blue" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.rotationCount')}: </label>
            <span className="font-bold">{t('purchase.unlimited')}</span>
          </div>
        )
      });
    }

    // Throughput (speed limit)
    if (plan.throughput) {
      features.push({
        icon: <TopSpeed className="w-6 h-6 text-pink" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.speedLimit')}: </label>
            <span className="font-bold">{formatThroughput(plan.throughput)}</span>
          </div>
        )
      });
    }

    // Max concurrent connections
    if (plan.max_concurrent) {
      features.push({
        icon: <Grid className="w-6 h-6 text-green" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.maxConnections')}: </label>
            <span className="font-bold">{plan.max_concurrent}</span>
          </div>
        )
      });
    } else {
      // Unlimited concurrent connections when max_concurrent doesn't exist
      features.push({
        icon: <Grid className="w-6 h-6 text-green" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.maxConnections')}: </label>
            <span className="font-bold">{t('purchase.unlimited')}</span>
          </div>
        )
      });
    }

    // Dedicated proxy message (for dedicated type)
    if (plan.type === 'dedicated') {
      features.push({
        icon: <Fire className="w-6 h-6 text-orange" />,
        label: (
          <div className="text-base">
            <label>{t('purchase.dedicated')}: </label>
            <span className="font-bold">{t('purchase.dedicatedMessage')}</span>
          </div>
        )
      });
    }

    return features;
  };

  // Retry handler (reuses shared fetchPlans function)
  const handleRetry = () => {
    refetchPlans();
  };

  // Loading skeleton - uses PlanCardSkeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 p-5">
      {[...Array(6)].map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </div>
  );

  // Error state - uses ErrorDisplay component with retry
  const ErrorState = () => (
    <ErrorDisplay
      title={t('purchase.loadingError')}
      message={error?.message || t('purchase.loadingErrorMessage')}
      onRetry={handleRetry}
      retryText={t('purchase.retryButton')}
    />
  );

  // Empty state - enhanced with icon matching OrderSummary pattern
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <CartFilled className="w-16 h-16 text-text-lo dark:text-text-lo-dark opacity-70 mb-4" aria-hidden="true" />
      <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">{t('purchase.noPackages')}</h2>
      <p className="text-text-me dark:text-text-me-dark text-sm">{t('purchase.noPackagesMessage')}</p>
    </div>
  );

  // Build main tabs: Rotating + dedicated tabs cố định
  const mainTabs = [{ label: t('purchase.rotating'), key: 'rotating' }, ...dedicatedTabs];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="overflow-auto flex flex-col flex-1"
      style={{ scrollbarGutter: 'stable' }}
    >
      {pageTitle}
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between h-12 px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xl font-semibold text-text-hi">
            <CartFilled width={24} height={24} className="text-yellow" />
            <span className="text-text-hi dark:text-text-hi-dark text-lg md:text-xl font-averta tracking-[-0.3px]">
              {t('purchase.title')}
            </span>
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`Giỏ hàng${cart.itemCount > 0 ? ` (${cart.itemCount} sản phẩm)` : ' (trống)'}`}
            className={`flex rounded-full shadow-xs items-center justify-center w-10 h-10 border-2 ${
              cart.itemCount > 0
                ? 'border-blue-border dark:border-blue-border-dark bg-blue dark:bg-blue-dark'
                : 'border-border-element dark:border-border-element-dark bg-bg-secondary dark:bg-bg-secondary-dark'
            }`}
          >
            <CartFilled className={`${cart.itemCount > 0 ? 'text-white' : 'text-text-lo dark:text-text-lo-dark'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* Main Tabs */}
      <Tabs
        defaultWrapperClass="h-full flex flex-col"
        className="overflow-auto min-h-11 whitespace-nowrap scrollbar-hide"
        tabs={mainTabs}
        activeKey={activeMain}
        onChange={(key) => {
          setActiveMain(key as TabKey);
          cart.clearCart();
        }}
        itemWrapperClass="overflow-visible"
      >
        {/* Rotating Tab - index 0, key: 'rotating' */}
        <div key="rotating">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : speedGroups.length === 0 ? (
            <EmptyState />
          ) : (
            <Tabs type="card" tabs={speedGroups} activeKey={activeGroup} onChange={(key) => setActiveGroup(String(key))}>
              {speedGroups.map((g) => {
                const groupPlans = rotatingPlans.filter((p) => p.throughput === g.value);
                return (
                  <div key={g.key} className="flex flex-col">
                    {/* Filtering */}
                    <div className="px-5 py-4 border-b-2 border-border-element dark:border-border-element-dark whitespace-nowrap scrollbar-hide overflow-auto">
                      <RadioGroup
                        className="overflow-visible"
                        value={filteredDuration}
                        onChange={(value) => setFilteredDuration('' + value)}
                        options={durationOptions.map((duration) => ({
                          label: formatDuration(duration, t),
                          value: '' + duration,
                          key: `duration-${duration}`
                        }))}
                      />
                    </div>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex-1 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 p-5 max-h-[calc(100dvh-365px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-265px)] overflow-y-auto`}
                    >
                      {groupPlans.length === 0 ? (
                        <div className="col-span-full">
                          <EmptyState />
                        </div>
                      ) : (
                        groupPlans
                          .filter((plan) => !filteredDuration || plan.duration === Number(filteredDuration))
                          .map((plan, index) => {
                            const enrichedPlan = {
                              ...plan,
                              buttonText: t('buyPackage')
                            };
                            return (
                              <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                                <PricingCard
                                  tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                                  description={plan.description || ''}
                                  title={plan.name}
                                  price={getDisplayPrice(plan)}
                                  features={buildPlanFeatures(plan, t)}
                                  buttonText={enrichedPlan.buttonText}
                                  enableCart
                                  plan={enrichedPlan}
                                  cartOptions={{
                                    speedLimit: plan.throughput?.toString()
                                  }}
                                  preventNotification
                                />
                              </motion.div>
                            );
                          })
                      )}
                    </motion.div>

                    <PurchaseConfirmModal open={confirmModal} setOpen={setConfirmModalOpen} duration={+filteredDuration} />
                  </div>
                );
              })}
            </Tabs>
          )}
        </div>

        {/* Premium ISP Tab - index 1, key: 'premium_isp' */}
        <div className="flex-1 h-full flex flex-col" key="premium_isp">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-full flex-1 flex flex-col">
              <DedicatedPlanFilter
                plans={plansData?.dedicated?.['premium_isp'] || []}
                proxyType="Premium ISP"
                servers={plansData?.servers}
              />
            </motion.div>
          )}
        </div>

        {/* Private IPv4 Tab - index 2, key: 'private_ipv4' */}
        <div className="flex-1 h-full flex flex-col" key="private_ipv4">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-full flex-1 flex flex-col">
              <DedicatedPlanFilter
                plans={plansData?.dedicated?.['private_ipv4'] || []}
                proxyType="Private IPv4"
                servers={plansData?.servers}
              />
            </motion.div>
          )}
        </div>

        {/* Shared IPv4 Tab - index 3, key: 'shared_ipv4' */}
        {/* <div className="flex-1 h-full flex flex-col" key="shared_ipv4">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-full flex-1 flex flex-col">
              <DedicatedPlanFilter
                plans={plansData?.dedicated?.['shared_ipv4'] || []}
                proxyType="Shared IPv4"
                servers={plansData?.servers}
              />
            </motion.div>
          )}
        </div> */}

        {/* IPv6 Tab - index 4, key: 'ipv6' */}
        <div className="flex-1 h-full flex flex-col" key="ipv6">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-full flex-1 flex flex-col">
              <DedicatedPlanFilter plans={plansData?.dedicated?.['ipv6'] || []} proxyType="IPv6" servers={plansData?.servers} />
            </motion.div>
          )}
        </div>
      </Tabs>
      {/* Mobile Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { delay: 0.25, duration: 0.25, ease: easeInOutCustom }
            }}
            transition={{ duration: 0.25, ease: easeInOutCustom }}
            className="fixed inset-0 z-50 bg-black/40 flex justify-end"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              key="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{
                x: '100%',
                transition: { duration: 0.25, ease: easeInOutCustom }
              }}
              transition={{ type: 'tween', duration: 0.35, ease: easeInOutCustom }}
              className="relative w-[calc(100%-75px)] max-w-[354px] h-full bg-white dark:bg-bg-canvas-dark shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex h-[64px] items-center justify-between p-5 border-b border-border dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <CartFilled className="text-yellow" width={24} height={24} />
                  <span className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">{t('purchase.cartTitle')}</span>
                </div>
                <IconButton
                  className="w-10 h-10"
                  icon={<Dismiss className="text-text-me dark:text-text-me-dark" />}
                  onClick={() => setCartOpen(false)}
                  aria-label={t('purchase.closeCart')}
                />
              </div>

              {/* Content - Only show if there are rotating items */}
              {cart.getAllItems().length > 0 && (
                <div className="flex-1">
                  <OrderSummary useCartContext={true} />
                </div>
              )}
              {cart.getAllItems().length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <CartFilled className="w-16 h-16 text-text-lo dark:text-text-lo-dark mb-4 opacity-70 mx-auto" />
                    <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">{t('purchase.emptyCart')}</h2>
                    <p className="text-text-me dark:text-text-me-dark text-sm">{t('purchase.emptyCartMessage')}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PurchasePage;
