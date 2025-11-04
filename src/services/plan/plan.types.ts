// Plan type enum
export type PlanType = 'static' | 'rotating' | 'dedicated';

// Plan category enum
export type PlanCategory = 'datacenter' | 'mobile' | 'residential' | 'isp' | 'mixed';

// Backend plan structure from API
export interface Plan {
  id: string;
  name: string;
  description?: string;
  type: PlanType;
  category: PlanCategory;

  // Pricing
  price: number; // Final price including reseller markup
  currency_code: string;
  fake_discount?: number; // Original price for display purposes

  // Plan attributes
  bandwidth?: number; // In bytes
  duration?: number; // In seconds
  throughput?: number; // Speed limit
  frequency?: number; // Rotation frequency
  max_concurrent?: number; // Max concurrent connections
  package?: any; // Additional package data as JSON

  // Status
  featured: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
}

// Request parameters for list plans API
export interface ListPlansParams {
  page?: number;
  per_page?: number;
  category?: PlanCategory;
  featured?: 'true' | 'false' | boolean; // Backend accepts string
}

// Response from list plans API
export interface ListPlansResponse {
  items: Plan[]; // Backend returns "items" not "plans"
  total: number;
  page: number;
  per_page: number;
}

// Frontend display structure for plan
export interface PlanDisplay {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  typeLabel: string; // Vietnamese label
  category: PlanCategory;
  categoryLabel: string; // Vietnamese label
  price: number;
  priceFormatted: string; // With currency symbol
  originalPrice?: number; // If fake_discount exists
  originalPriceFormatted?: string;
  discountPercent?: number;
  currencyCode: string;

  // Plan attributes formatted for display
  bandwidth?: string; // e.g., "10 GB", "Unlimited"
  duration?: string; // e.g., "30 days", "7 days"
  throughput?: string; // e.g., "100 Mbps"
  frequency?: string; // e.g., "Every 5 minutes"
  maxConcurrent?: string; // e.g., "5 connections"

  // Features list for display
  features: string[];

  // Status
  featured: boolean;

  // UI helpers
  badge?: {
    text: string;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  };
}

// Plan type labels in Vietnamese
export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  static: 'Tĩnh (Static)',
  rotating: 'Xoay (Rotating)',
  dedicated: 'Riêng (Dedicated)'
};

// Plan category labels in Vietnamese
export const PLAN_CATEGORY_LABELS: Record<PlanCategory, string> = {
  datacenter: 'Datacenter',
  mobile: 'Mobile',
  residential: 'Residential',
  isp: 'ISP',
  mixed: 'Mixed'
};

// Plan type colors for badges
export const PLAN_TYPE_COLORS: Record<PlanType, string> = {
  static: 'blue',
  rotating: 'green',
  dedicated: 'yellow'
};

// Plan category colors for badges
export const PLAN_CATEGORY_COLORS: Record<PlanCategory, string> = {
  datacenter: 'blue',
  mobile: 'purple',
  residential: 'green',
  isp: 'orange',
  mixed: 'gray'
};
