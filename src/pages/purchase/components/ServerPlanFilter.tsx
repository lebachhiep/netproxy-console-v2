import React, { useMemo, useState } from 'react';
import { Plan } from '@/services/plan/plan.types';
import { RadioGroup } from '@/components/radio/RadioGroup';
import { PricingCard } from '@/components/card/PricingCard';
import { Fire } from '@/components/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ServerPlanFilterProps {
  plans: Plan[];
  getDisplayPrice: (plan: Plan) => string;
  buildPlanFeatures: (plan: Plan) => Array<{ icon: React.ReactNode; label: React.ReactNode }>;
}

// Helper to normalize proxy type - giữ nguyên giá trị từ metadata
const normalizeProxyType = (proxyType: string | undefined): string => {
  if (!proxyType) return '';
  // Giữ nguyên giá trị từ metadata, chỉ lowercase để so sánh
  return proxyType.toLowerCase().trim();
};

// Helper to get period in days - CHỈ dùng metadata.period
const getPeriodDays = (plan: Plan): number | null => {
  // CHỈ dùng metadata.period từ metadata
  const period = plan.metadata?.period;
  if (period && typeof period === 'number' && period > 0) {
    return period;
  }
  return null;
};

export const ServerPlanFilter: React.FC<ServerPlanFilterProps> = ({ plans, getDisplayPrice, buildPlanFeatures }) => {
  const { t } = useTranslation();
  // Filter state - phải khai báo trước khi dùng trong useMemo
  const [selectedProxyType, setSelectedProxyType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number | ''>('');

  // Extract available proxy types from all plans (level 1 - không phụ thuộc filter nào)
  const availableProxyTypes = useMemo(() => {
    const proxyTypes = new Set<string>();
    plans.forEach((plan) => {
      const proxyType = normalizeProxyType(plan.metadata?.proxy_type);
      if (proxyType) proxyTypes.add(proxyType);
    });
    return Array.from(proxyTypes).sort();
  }, [plans]);

  // Filter plans by proxyType để tính available categories (level 2)
  const plansFilteredByProxyType = useMemo(() => {
    if (!selectedProxyType) return plans;
    return plans.filter((plan) => {
      const planProxyType = normalizeProxyType(plan.metadata?.proxy_type);
      return planProxyType === selectedProxyType;
    });
  }, [plans, selectedProxyType]);

  // Extract available categories từ plans đã filter bởi proxyType
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    plansFilteredByProxyType.forEach((plan) => {
      if (plan.category) categories.add(plan.category);
    });
    return Array.from(categories).sort();
  }, [plansFilteredByProxyType]);

  // Filter plans by proxyType + category để tính available periods (level 3)
  const plansFilteredByProxyTypeAndCategory = useMemo(() => {
    let filtered = plansFilteredByProxyType;
    if (selectedCategory) {
      filtered = filtered.filter((plan) => plan.category === selectedCategory);
    }
    return filtered;
  }, [plansFilteredByProxyType, selectedCategory]);

  // Extract available periods từ plans đã filter bởi proxyType + category
  const availablePeriods = useMemo(() => {
    const periods = new Set<number>();
    plansFilteredByProxyTypeAndCategory.forEach((plan) => {
      const periodDays = getPeriodDays(plan);
      if (periodDays !== null) {
        periods.add(periodDays);
      }
    });
    return Array.from(periods).sort((a, b) => a - b);
  }, [plansFilteredByProxyTypeAndCategory]);

  // Initialize proxyType when plans change
  React.useEffect(() => {
    if (availableProxyTypes.length > 0) {
      if (!selectedProxyType || !availableProxyTypes.includes(selectedProxyType)) {
        setSelectedProxyType(availableProxyTypes[0]);
      }
    } else {
      setSelectedProxyType('');
    }
  }, [availableProxyTypes]);

  // Reset category when proxyType changes hoặc category không còn hợp lệ
  React.useEffect(() => {
    if (availableCategories.length > 0) {
      if (!selectedCategory || !availableCategories.includes(selectedCategory)) {
        setSelectedCategory(availableCategories[0]);
      }
    } else {
      setSelectedCategory('');
    }
  }, [availableCategories, selectedProxyType]);

  // Reset period when category hoặc proxyType changes hoặc period không còn hợp lệ
  React.useEffect(() => {
    if (availablePeriods.length > 0) {
      if (!selectedPeriod || !availablePeriods.includes(selectedPeriod as number)) {
        setSelectedPeriod(availablePeriods[0]);
      }
    } else {
      setSelectedPeriod('');
    }
  }, [availablePeriods, selectedCategory, selectedProxyType]);

  // Filter plans based on all selections - dùng plansFilteredByProxyTypeAndCategory làm base
  const filteredPlans = useMemo(() => {
    let filtered = plansFilteredByProxyTypeAndCategory;

    // Filter by period
    if (selectedPeriod) {
      filtered = filtered.filter((plan) => {
        const planPeriodDays = getPeriodDays(plan);
        return planPeriodDays === selectedPeriod;
      });
    }

    return filtered;
  }, [plansFilteredByProxyTypeAndCategory, selectedPeriod]);

  // Build proxy type options - format label đẹp hơn
  const proxyTypeOptions = availableProxyTypes.map((type) => {
    // Format label: "ipv4" -> "IPv4", "ipv4 shared" -> "IPv4 Shared", "ipv6" -> "IPv6"
    const formattedLabel = type
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      key: type,
      label: formattedLabel,
      value: type
    };
  });

  // Build category options - chỉ hiển thị categories có trong plans đã filter bởi proxyType
  const categoryOptions = availableCategories.map((cat) => ({
    key: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat
  }));

  // Build period options - chỉ hiển thị periods có trong plans đã filter bởi proxyType + category
  const periodOptions = availablePeriods.map((period) => ({
    key: `${period}d`,
    label: `${period} ${t('day')}`,
    value: period
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Filters Section */}
      <div className="p-5 bg-bg-secondary dark:bg-bg-secondary-dark rounded-lg border border-border dark:border-border-dark">
        <div className="flex flex-col gap-4">
          {/* Proxy Type Filter */}
          {proxyTypeOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Loại Proxy:</label>
              <RadioGroup
                value={selectedProxyType}
                onChange={(value) => setSelectedProxyType(String(value))}
                options={proxyTypeOptions}
                direction="row"
              />
            </div>
          )}

          {/* Category Filter */}
          {categoryOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Danh mục:</label>
              <RadioGroup
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(String(value))}
                options={categoryOptions}
                direction="row"
              />
            </div>
          )}

          {/* Period Filter */}
          {periodOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Thời hạn:</label>
              <RadioGroup
                value={selectedPeriod}
                onChange={(value) => setSelectedPeriod(Number(value))}
                options={periodOptions}
                direction="row"
              />
            </div>
          )}
        </div>
      </div>

      {/* Filtered Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
          <p className="text-text-me dark:text-text-me-dark">Không có gói nào phù hợp với bộ lọc đã chọn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 p-5">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id || `${plan.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <PricingCard
                tag={plan.featured ? { text: 'POPULAR', icon: <Fire /> } : undefined}
                description={plan.description || ''}
                title={plan.name}
                price={getDisplayPrice(plan)}
                features={buildPlanFeatures(plan)}
                buttonText="MUA GÓI"
                enableCart={true}
                plan={plan}
                cartOptions={{
                  speedLimit: plan.throughput?.toString()
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
