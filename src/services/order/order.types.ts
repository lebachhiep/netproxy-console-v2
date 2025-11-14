// Order type enum
export type OrderType = 'buy' | 'renew' | 'redeem' | 'transfer';

// Order status enum
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'fulfilled' | 'canceled' | 'refunded' | 'failed';

// Backend order structure from API
export interface Order {
  id: string;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  user_id: string;
  reseller_id?: string;
  currency_code: string;
  subtotal: string; // Formatted as decimal string
  tax_amount: string;
  discount_amount: string;
  total: string;
  coupon_id?: string;
  gift_code_id?: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  fulfilled_at?: string;
  items?: OrderItem[]; // Order items included in list response
}

// Request parameters for list orders API
export interface OrderListRequest {
  page?: number;
  per_page?: number;
  status?: OrderStatus;
  type?: OrderType;
  search?: string; // Searches order_number
  start_date?: string; // Format: YYYY-MM-DD or ISO datetime
  end_date?: string; // Format: YYYY-MM-DD or ISO datetime
}

// Response from list orders API
export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  per_page: number;
}

// Frontend display structure for order
export interface OrderDisplay {
  id: string;
  orderNumber: string;
  type: OrderType;
  typeLabel: string; // Vietnamese label
  status: OrderStatus;
  statusDisplay: {
    text: string;
    color: 'green' | 'gray' | 'yellow' | 'blue' | 'red';
  };
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currencyCode: string;
  description: string;
  notes: string;
  hasCoupon: boolean;
  hasGiftCode: boolean;
  createdAt: Date;
  updatedAt: Date;
  fulfilledAt?: Date;
  items?: OrderItem[]; // Order items from list response
  // For tooltip display
  priceBreakdown: {
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
  };
}

// Order type labels in Vietnamese
export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  buy: 'Mua mới',
  renew: 'Gia hạn',
  redeem: 'Đổi quà',
  transfer: 'Chuyển khoản'
};

// Order type colors for badges
export const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  buy: 'blue',
  renew: 'green',
  redeem: 'gray',
  transfer: 'yellow'
};

// Order status labels and colors in Vietnamese
export const ORDER_STATUS_DISPLAY: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: 'Chờ thanh toán', color: 'yellow' },
  paid: { text: 'Đã thanh toán', color: 'blue' },
  processing: { text: 'Đang xử lý', color: 'blue' },
  fulfilled: { text: 'Hoàn thành', color: 'green' },
  canceled: { text: 'Đã hủy', color: 'gray' },
  refunded: { text: 'Đã hoàn tiền', color: 'yellow' },
  failed: { text: 'Thất bại', color: 'red' }
};

// Create order request item
export interface CreateOrderItemRequest {
  plan_id: string;
  quantity: number;
  country?: string; // ISO 3166-1 alpha-2 code for external provider plans
}

// Create order request
export interface CreateOrderRequest {
  type: OrderType;
  items: CreateOrderItemRequest[];
  coupon_code?: string;
  gift_code?: string;
}

// Order item from backend (simplified - provider fields not exposed)
export interface OrderItem {
  id: string;
  order_id: string;
  plan_id: string;
  plan_name: string; // Snapshot of plan name at purchase time
  quantity: number;
  unit_price: string; // Decimal string
  total_price: string; // Decimal string
  country?: string; // ISO 3166-1 alpha-2 country code (e.g., 'US', 'NL')
  created_at: string;
}

// Order with items (from create order and get order by ID responses)
export interface OrderWithItems {
  id: string;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  user_id: string;
  reseller_id?: string; // Empty string when not present (omitempty)
  currency_code: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total: string;
  coupon_id?: string; // Empty string when not present (omitempty)
  gift_code_id?: string; // Empty string when not present (omitempty)
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  fulfilled_at?: string;
  items: OrderItem[];
}

// Create order response wraps the order
export interface CreateOrderResponse {
  order: OrderWithItems;
}

// Get order response wraps the order
export interface GetOrderResponse {
  order: OrderWithItems;
}

