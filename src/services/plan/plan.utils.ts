import {
  Plan,
  PlanDisplay,
  PLAN_TYPE_LABELS,
  PLAN_CATEGORY_LABELS,
  PlanType,
  PlanCategory,
} from './plan.types';

/**
 * Format price with currency symbol
 * @param price - Price amount
 * @param currencyCode - Currency code (USD, VND, etc.)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    VND: '₫',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;

  // Format with locale
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
  }).format(price);

  // VND puts symbol after, others before
  return currencyCode === 'VND' ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

/**
 * Convert seconds to readable duration
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    if (days === 1) return '1 ngày';
    if (days === 7) return '7 ngày';
    if (days === 30) return '30 ngày';
    if (days === 365) return '1 năm';
    return `${days} ngày`;
  }

  if (hours > 0) {
    return hours === 1 ? '1 giờ' : `${hours} giờ`;
  }

  if (minutes > 0) {
    return minutes === 1 ? '1 phút' : `${minutes} phút`;
  }

  return `${seconds} giây`;
}

/**
 * Format bandwidth from bytes to readable size
 * @param bytes - Bandwidth in bytes
 * @returns Formatted bandwidth string
 */
export function formatBandwidth(bytes: number): string {
  if (bytes === 0) return 'Unlimited';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);

  return `${formatted} ${units[i]}`;
}

/**
 * Format throughput (speed) in Mbps
 * @param throughput - Throughput value
 * @returns Formatted throughput string
 */
export function formatThroughput(throughput: number): string {
  if (throughput < 1000) {
    return `${throughput} Mbps`;
  }
  const gbps = throughput / 1000;
  return `${gbps.toFixed(gbps % 1 === 0 ? 0 : 2)} Gbps`;
}

/**
 * Format frequency (rotation time)
 * @param frequency - Frequency in seconds
 * @returns Formatted frequency string
 */
export function formatFrequency(frequency: number): string {
  const minutes = Math.floor(frequency / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `Mỗi ${hours} giờ`;
  }

  if (minutes > 0) {
    return `Mỗi ${minutes} phút`;
  }

  return `Mỗi ${frequency} giây`;
}

/**
 * Format max concurrent connections
 * @param maxConcurrent - Maximum concurrent connections
 * @returns Formatted string
 */
export function formatMaxConcurrent(maxConcurrent: number): string {
  return `${maxConcurrent} kết nối đồng thời`;
}

/**
 * Extract features from plan attributes for display
 * @param plan - Plan object
 * @returns Array of feature strings
 */
export function extractPlanFeatures(plan: Plan): string[] {
  const features: string[] = [];

  // Bandwidth
  if (plan.bandwidth !== undefined) {
    if (plan.bandwidth === 0) {
      features.push('Băng thông không giới hạn');
    } else {
      features.push(`Băng thông: ${formatBandwidth(plan.bandwidth)}`);
    }
  }

  // Duration
  if (plan.duration !== undefined) {
    features.push(`Thời hạn: ${formatDuration(plan.duration)}`);
  }

  // Throughput
  if (plan.throughput !== undefined) {
    features.push(`Tốc độ: ${formatThroughput(plan.throughput)}`);
  }

  // Frequency
  if (plan.frequency !== undefined) {
    features.push(`Xoay vòng: ${formatFrequency(plan.frequency)}`);
  }

  // Max concurrent
  if (plan.max_concurrent !== undefined) {
    features.push(formatMaxConcurrent(plan.max_concurrent));
  }

  // Category
  features.push(`Loại: ${PLAN_CATEGORY_LABELS[plan.category]}`);

  return features;
}

/**
 * Get category label in Vietnamese
 * @param category - Plan category
 * @returns Vietnamese label
 */
export function getPlanCategoryLabel(category: PlanCategory): string {
  return PLAN_CATEGORY_LABELS[category] || category;
}

/**
 * Get type label in Vietnamese
 * @param type - Plan type
 * @returns Vietnamese label
 */
export function getPlanTypeLabel(type: PlanType): string {
  return PLAN_TYPE_LABELS[type] || type;
}

/**
 * Calculate discount percentage from original and discounted price
 * @param originalPrice - Original price (fake_discount)
 * @param discountedPrice - Current price
 * @returns Discount percentage
 */
export function calculateDiscountPercent(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Convert Plan to PlanDisplay for UI rendering
 * @param plan - Backend plan object
 * @returns Frontend display plan object
 */
export function toPlanDisplay(plan: Plan): PlanDisplay {
  const features = extractPlanFeatures(plan);

  const display: PlanDisplay = {
    id: plan.id,
    name: plan.name,
    description: plan.description || '',
    type: plan.type,
    typeLabel: getPlanTypeLabel(plan.type),
    category: plan.category,
    categoryLabel: getPlanCategoryLabel(plan.category),
    price: plan.price,
    priceFormatted: formatPrice(plan.price, plan.currency_code),
    currencyCode: plan.currency_code,
    features,
    featured: plan.featured,
  };

  // Add fake discount if present
  if (plan.fake_discount && plan.fake_discount > plan.price) {
    display.originalPrice = plan.fake_discount;
    display.originalPriceFormatted = formatPrice(plan.fake_discount, plan.currency_code);
    display.discountPercent = calculateDiscountPercent(plan.fake_discount, plan.price);
  }

  // Add formatted attributes
  if (plan.bandwidth !== undefined) {
    display.bandwidth = formatBandwidth(plan.bandwidth);
  }

  if (plan.duration !== undefined) {
    display.duration = formatDuration(plan.duration);
  }

  if (plan.throughput !== undefined) {
    display.throughput = formatThroughput(plan.throughput);
  }

  if (plan.frequency !== undefined) {
    display.frequency = formatFrequency(plan.frequency);
  }

  if (plan.max_concurrent !== undefined) {
    display.maxConcurrent = formatMaxConcurrent(plan.max_concurrent);
  }

  // Add badge for featured plans
  if (plan.featured) {
    display.badge = {
      text: 'Nổi bật',
      color: 'yellow',
    };
  }

  return display;
}

/**
 * Sort plans by sort_order (ascending)
 * @param plans - Array of plans
 * @returns Sorted array
 */
export function sortPlansBySortOrder(plans: Plan[]): Plan[] {
  return [...plans].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Filter plans by type
 * @param plans - Array of plans
 * @param type - Plan type to filter
 * @returns Filtered array
 */
export function filterPlansByType(plans: Plan[], type: PlanType): Plan[] {
  return plans.filter(plan => plan.type === type);
}

/**
 * Filter plans by category
 * @param plans - Array of plans
 * @param category - Plan category to filter
 * @returns Filtered array
 */
export function filterPlansByCategory(plans: Plan[], category: PlanCategory): Plan[] {
  return plans.filter(plan => plan.category === category);
}

/**
 * Group plans by category
 * @param plans - Array of plans
 * @returns Object with category as key and plans array as value
 */
export function groupPlansByCategory(plans: Plan[]): Record<PlanCategory, Plan[]> {
  const grouped: Partial<Record<PlanCategory, Plan[]>> = {};

  plans.forEach(plan => {
    if (!grouped[plan.category]) {
      grouped[plan.category] = [];
    }
    grouped[plan.category]!.push(plan);
  });

  return grouped as Record<PlanCategory, Plan[]>;
}

/**
 * Group plans by type
 * @param plans - Array of plans
 * @returns Object with type as key and plans array as value
 */
export function groupPlansByType(plans: Plan[]): Record<PlanType, Plan[]> {
  const grouped: Partial<Record<PlanType, Plan[]>> = {};

  plans.forEach(plan => {
    if (!grouped[plan.type]) {
      grouped[plan.type] = [];
    }
    grouped[plan.type]!.push(plan);
  });

  return grouped as Record<PlanType, Plan[]>;
}
