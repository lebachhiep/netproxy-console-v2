// Backend subscription types matching Encore.go API structure

export interface ProxyCredentials {
  proxy_ip: string;
  http_port: number;
  socks5_port: number;
  username: string;
  password: string;
  active_protocol?: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  type: string;
  category: string;
  price: string;
  currency_code: string;
  bandwidth?: number; // in bytes
  duration?: number; // in seconds
  throughput?: number;
  frequency?: number;
  max_concurrent?: number;
  provider?: string; // "internal", "proxy6", "proxycheap", "proxyseller"
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  bandwidth_id?: string;
  original_order_id: string;
  api_key: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  auto_renew: boolean;
  renewal_period_seconds: number;
  start_date: string; // ISO timestamp
  current_period_start: string; // ISO timestamp
  current_period_end: string; // ISO timestamp
  next_renewal_date?: string; // ISO timestamp
  trial_ends_at?: string; // ISO timestamp
  cancelled_at?: string; // ISO timestamp
  expires_at?: string; // ISO timestamp
  renewal_count: number;
  last_renewal_order_id?: string;
  last_renewal_at?: string; // ISO timestamp
  renewal_price: string;
  currency_code: string;
  reseller_id?: string;
  country?: string; // Country code (e.g., 'US', 'VN', 'JP')
  provider_credentials?: ProxyCredentials | Record<string, any>;
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  plan?: Plan; // Embedded plan data

  // Using for table mapping
  tableData?: {
    hasSticky?: boolean;
  };
}

// Alias since API returns subscription with plan embedded directly
export type SubscriptionWithPlan = Subscription;

export interface Order {
  id: string;
  order_number: string;
  type: string;
  status: string;
  user_id: string;
  currency_code: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total: string;
  created_at: string;
  updated_at: string;
  fulfilled_at?: string;
  subscriptions: Subscription[];
}

export interface ListSubscriptionsResponse {
  orders: Order[];
  total_subscriptions: number;
  active_count: number;
  page: number;
  per_page: number;
  total_orders: number;
}

export interface ListSubscriptionsRequest {
  Page?: number;
  PerPage?: number;
  Status?: 'active' | 'paused' | 'cancelled' | 'expired';
  search?: string;
}

export interface ListOrderSubscriptionsRequest {
  orderId: string;
  Page?: number;
  per_page?: number;
  Status?: 'active' | 'paused' | 'cancelled' | 'expired';
}

export interface OrderSubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  per_page: number;
}

export interface UpdateAutoRenewRequest {
  auto_renew: boolean;
}

export interface SwitchProtocolRequest {
  protocol: 'http' | 'socks5';
}

export interface SwitchProtocolResponse {
  success: boolean;
  message: string;
  proxy_ip: string;
  http_port: number;
  socks5_port: number;
  username: string;
  password: string;
}

// Helper type for determining plan type
export type PlanProvider = 'internal' | 'proxy6' | 'proxycheap' | 'proxyseller' | string;

// Helper function to check if plan is internal
export function isInternalPlan(subscription: Subscription): boolean {
  return subscription.plan?.provider === 'internal';
}

// Helper function to check if plan has external credentials
export function hasExternalCredentials(subscription: Subscription): boolean {
  return !!subscription.provider_credentials && typeof subscription.provider_credentials === 'object';
}
