import { PricingCard } from '@/components/card/PricingCard';
import {
  ArrowRotate,
  CalendarClock,
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
import { AnimatePresence, motion, Variants } from 'framer-motion';
import IconButton from '@/components/button/IconButton';
import { useCart } from '@/hooks/useCart';
import { planService } from '@/services/plan/plan.service';
import { Plan } from '@/services/plan/plan.types';
import { formatFrequency, formatBandwidth, formatThroughput, formatDuration } from '@/services/plan/plan.utils';
import { Button } from '@/components/button/Button';

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

type TabKey = 'rotating' | 'static' | 'dedicated';
type StaticSubKey = 'bandwidth' | 'unlimited';
type DedicatedSubKey = 'residential' | 'datacenter';

const PurchasePage: React.FC = () => {
  // API data state
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab state
  const [activeMain, setActiveMain] = useState<TabKey>('rotating');
  const [activeStatic, setActiveStatic] = useState<StaticSubKey>('bandwidth');
  const [activeDedicated, setActiveDedicated] = useState<DedicatedSubKey>('residential');
  const [cartOpen, setCartOpen] = useState(false);

  // Cart integration
  const cart = useCart();

  // Shared fetch function (DRY principle)
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter plans by type and category with explicit sorting
  const rotatingPlans = useMemo(
    () => plans.filter(p => p.type === 'rotating').sort((a, b) => a.sort_order - b.sort_order),
    [plans]
  );
  const staticPlans = useMemo(
    () => plans.filter(p => p.type === 'static').sort((a, b) => a.sort_order - b.sort_order),
    [plans]
  );
  const dedicatedPlans = useMemo(
    () => plans.filter(p => p.type === 'dedicated').sort((a, b) => a.sort_order - b.sort_order),
    [plans]
  );

  // Dynamic speed groups for rotating plans
  const speedGroups = useMemo(() => {
    const uniqueThroughputs = [...new Set(rotatingPlans.map(p => p.throughput).filter(Boolean))].sort(
      (a, b) => (a || 0) - (b || 0)
    );

    return uniqueThroughputs.map(throughput => ({
      label: `${throughput} MBPS Plan`,
      key: `${throughput}mbps`,
      value: throughput
    }));
  }, [rotatingPlans]);

  const [activeGroup, setActiveGroup] = useState(speedGroups[0]?.key || '');

  // Update active group when speed groups change
  useEffect(() => {
    if (speedGroups.length > 0 && !speedGroups.find(g => g.key === activeGroup)) {
      setActiveGroup(speedGroups[0].key);
    }
  }, [speedGroups, activeGroup]);

  // Helper to build features for PricingCard
  const buildPlanFeatures = (plan: Plan) => {
    const features: Array<{ icon: React.ReactNode; label: React.ReactNode }> = [];

    // Protocol support (hardcoded for now - could come from plan.package in future)
    features.push({
      icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
      label: (
        <div className="text-base">
          <label>Hỗ trợ: </label>
          <span className="font-bold">HTTP/HTTPS</span>
        </div>
      )
    });

    // Rotation frequency (for rotating proxies)
    if (plan.frequency) {
      features.push({
        icon: <Clock className="w-6 h-6 text-yellow" />,
        label: (
          <div className="text-base">
            <label>Thời gian xoay IP: </label>
            <span className="font-bold">{formatFrequency(plan.frequency)}</span>
          </div>
        )
      });
    }

    // Duration (for time-based plans)
    if (plan.duration) {
      features.push({
        icon: <CalendarClock className="w-6 h-6 text-blue" />,
        label: (
          <div className="text-base">
            <label>Thời hạn: </label>
            <span className="font-bold">{formatDuration(plan.duration)}</span>
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
            <label>Băng thông: </label>
            <span className="font-bold">{formatBandwidth(plan.bandwidth)}</span>
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
            <label>Lượt xoay IP: </label>
            <span className="font-bold">Không giới hạn</span>
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
            <label>Tốc độ: </label>
            <span className="font-bold">{formatThroughput(plan.throughput)}</span>
          </div>
        )
      });
    }

    // Max concurrent connections
    if (plan.max_concurrent) {
      features.push({
        icon: <Grid className="w-6 h-6 text-purple" />,
        label: (
          <div className="text-base">
            <label>Kết nối đồng thời: </label>
            <span className="font-bold">{plan.max_concurrent}</span>
          </div>
        )
      });
    }

    return features;
  };

  // Retry handler (reuses shared fetchPlans function)
  const handleRetry = () => {
    fetchPlans();
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 p-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div
          key={i}
          className="h-64 bg-bg-secondary dark:bg-bg-secondary-dark animate-pulse rounded-xl"
        />
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center p-10 gap-4">
      <p className="text-red dark:text-red-dark text-lg">{error}</p>
      <Button onClick={handleRetry} variant="primary">
        Thử lại
      </Button>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-10">
      <p className="text-text-me dark:text-text-me-dark text-lg">
        Không có gói nào trong danh mục này
      </p>
    </div>
  );

  const mainTabs = [
    { label: 'Rotating', key: 'rotating' },
    { label: 'Static', key: 'static' },
    { label: 'Dedicated', key: 'dedicated' }
  ];

  const staticTabs = [
    { label: 'Bandwidth', key: 'bandwidth' },
    { label: 'Unlimited', key: 'unlimited' }
  ];

  const dedicatedTabs = [
    { label: 'Residential', key: 'residential' },
    { label: 'Datacenter', key: 'datacenter' }
  ];

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between h-12 px-5 py-3 border-b border-border dark:border-border-dark">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xl font-semibold text-text-hi">
            <CartFilled width={24} height={24} className="text-yellow" />
            <span className="text-text-hi dark:text-text-hi-dark text-lg md:text-xl font-averta tracking-[-0.3px]">
              Mua hàng
            </span>
          </div>

          {/* Cart Icon */}
          <div
            onClick={() => setCartOpen(true)}
            className={`flex rounded-full shadow-xs items-center justify-center w-10 h-10 border-2 ${
              cart.itemCount > 0
                ? 'border-blue-border dark:border-blue-border-dark bg-blue dark:bg-blue-dark'
                : 'border-border-element dark:border-border-element-dark bg-bg-secondary dark:bg-bg-secondary-dark'
            }`}
          >
            <CartFilled
              className={`${
                cart.itemCount > 0 ? 'text-white' : 'text-text-lo dark:text-text-lo-dark'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs tabs={mainTabs} activeKey={activeMain} onChange={key => setActiveMain(key as TabKey)}>
        {/* Rotating Tab */}
        <div key="rotating">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : speedGroups.length === 0 ? (
            <EmptyState />
          ) : (
            <Tabs
              type="card"
              tabs={speedGroups}
              activeKey={activeGroup}
              onChange={key => setActiveGroup(String(key))}
            >
              {speedGroups.map(g => {
                const groupPlans = rotatingPlans.filter(p => p.throughput === g.value);

                return (
                  <div key={g.key} className="flex">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${
                        cart.itemCount > 0 ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
                      } gap-5 p-5 max-h-[calc(100dvh-295px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-215px)] overflow-y-auto`}
                    >
                      {groupPlans.length === 0 ? (
                        <div className="col-span-full">
                          <EmptyState />
                        </div>
                      ) : (
                        groupPlans.map((plan, index) => (
                          <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                            <PricingCard
                              tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                              description={plan.description || ''}
                              title={plan.name}
                              price={plan.price.toFixed(2)}
                              features={buildPlanFeatures(plan)}
                              buttonText="MUA GÓI"
                              enableCart={true}
                              plan={plan}
                              cartOptions={{
                                speedLimit: plan.throughput?.toString()
                              }}
                            />
                          </motion.div>
                        ))
                      )}
                    </motion.div>

                    {/* Cart Sidebar - Desktop only */}
                    {cart.itemCount > 0 && (
                      <div className="w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                        <OrderSummary useCartContext={true} />
                      </div>
                    )}
                  </div>
                );
              })}
            </Tabs>
          )}
        </div>

        {/* Static Tab */}
        <div key="static">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <Tabs
              type="card"
              tabs={staticTabs}
              activeKey={activeStatic}
              onChange={key => setActiveStatic(key as StaticSubKey)}
            >
              {/* Bandwidth Sub-tab */}
              <div key="bandwidth" className="flex">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${
                    cart.itemCount > 0 ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
                  } gap-5 p-5 max-h-[calc(100dvh-295px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-215px)] overflow-y-auto`}
                >
                  {staticPlans.filter(p => p.bandwidth && p.bandwidth > 0).length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState />
                    </div>
                  ) : (
                    staticPlans
                      .filter(p => p.bandwidth && p.bandwidth > 0)
                      .map((plan, index) => (
                        <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                          <PricingCard
                            tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                            description={plan.description || ''}
                            title={plan.name}
                            price={plan.price.toFixed(2)}
                            features={buildPlanFeatures(plan)}
                            buttonText="MUA GÓI"
                            enableCart={true}
                            plan={plan}
                            cartOptions={{
                              staticType: 'bandwidth'
                            }}
                          />
                        </motion.div>
                      ))
                  )}
                </motion.div>

                {/* Cart Sidebar - Desktop only */}
                {cart.itemCount > 0 && (
                  <div className="w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                    <OrderSummary useCartContext={true} />
                  </div>
                )}
              </div>

              {/* Unlimited Sub-tab */}
              <div key="unlimited" className="flex">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${
                    cart.itemCount > 0 ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
                  } gap-5 p-5 max-h-[calc(100dvh-255px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-215px)] overflow-y-auto`}
                >
                  {staticPlans.filter(p => !p.bandwidth || p.bandwidth === 0).length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState />
                    </div>
                  ) : (
                    staticPlans
                      .filter(p => !p.bandwidth || p.bandwidth === 0)
                      .map((plan, index) => (
                        <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                          <PricingCard
                            tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                            description={plan.description || ''}
                            title={plan.name}
                            price={plan.price.toFixed(2)}
                            features={buildPlanFeatures(plan)}
                            buttonText="MUA GÓI"
                            enableCart={true}
                            plan={plan}
                            cartOptions={{
                              staticType: 'unlimited'
                            }}
                          />
                        </motion.div>
                      ))
                  )}
                </motion.div>

                {/* Cart Sidebar - Desktop only */}
                {cart.itemCount > 0 && (
                  <div className="w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                    <OrderSummary useCartContext={true} />
                  </div>
                )}
              </div>
            </Tabs>
          )}
        </div>

        {/* Dedicated Tab */}
        <div key="dedicated">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <Tabs
              type="card"
              tabs={dedicatedTabs}
              activeKey={activeDedicated}
              onChange={key => setActiveDedicated(key as DedicatedSubKey)}
            >
              {/* Residential Sub-tab */}
              <div key="residential" className="flex">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${
                    cart.itemCount > 0 ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
                  } gap-5 p-5 max-h-[calc(100dvh-295px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-215px)] overflow-y-auto`}
                >
                  {dedicatedPlans.filter(p => p.category === 'residential').length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState />
                    </div>
                  ) : (
                    dedicatedPlans
                      .filter(p => p.category === 'residential')
                      .map((plan, index) => (
                        <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                          <PricingCard
                            tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                            description={plan.description || ''}
                            title={plan.name}
                            price={plan.price.toFixed(2)}
                            features={buildPlanFeatures(plan)}
                            buttonText="MUA GÓI"
                            enableCart={true}
                            plan={plan}
                            cartOptions={{
                              duration: '7day' // Default to 7 day, could be made dynamic
                            }}
                          />
                        </motion.div>
                      ))
                  )}
                </motion.div>

                {/* Cart Sidebar - Desktop only */}
                {cart.itemCount > 0 && (
                  <div className="w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                    <OrderSummary useCartContext={true} />
                  </div>
                )}
              </div>

              {/* Datacenter Sub-tab */}
              <div key="datacenter" className="flex">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${
                    cart.itemCount > 0 ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
                  } gap-5 p-5 max-h-[calc(100dvh-295px)] md:max-h-[calc(100dvh-335px)] lg:max-h-[calc(100dvh-215px)] overflow-y-auto`}
                >
                  {dedicatedPlans.filter(p => p.category === 'datacenter').length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState />
                    </div>
                  ) : (
                    dedicatedPlans
                      .filter(p => p.category === 'datacenter')
                      .map((plan, index) => (
                        <motion.div key={plan.id || `${plan.name}-${index}`} variants={itemVariants}>
                          <PricingCard
                            tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                            description={plan.description || ''}
                            title={plan.name}
                            price={plan.price.toFixed(2)}
                            features={buildPlanFeatures(plan)}
                            buttonText="MUA GÓI"
                            enableCart={true}
                            plan={plan}
                            cartOptions={{
                              duration: '7day' // Default to 7 day, could be made dynamic
                            }}
                          />
                        </motion.div>
                      ))
                  )}
                </motion.div>

                {/* Cart Sidebar - Desktop only */}
                {cart.itemCount > 0 && (
                  <div className="w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                    <OrderSummary useCartContext={true} />
                  </div>
                )}
              </div>
            </Tabs>
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
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex h-[64px] items-center justify-between p-5 border-b border-border dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <CartFilled className="text-yellow" width={24} height={24} />
                  <span className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
                    Giỏ hàng
                  </span>
                </div>
                <IconButton
                  className="w-10 h-10"
                  icon={<Dismiss className="text-text-me dark:text-text-me-dark" />}
                  onClick={() => setCartOpen(false)}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <OrderSummary useCartContext={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PurchasePage;
