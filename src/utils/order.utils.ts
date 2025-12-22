import { Order, OrderDisplay, OrderType, OrderStatus, ORDER_TYPE_COLORS, ORDER_STATUS_DISPLAY } from '@/services/order/order.types';

/**
 * Get order type Vietnamese label
 */
export const getOrderTypeLabel = (type: OrderType, t: (key: string) => string): string => {
  const OrderTypeLabelsTranslated: Record<OrderType, string> = {
    buy: t('order.buy') || 'Mua mới',
    renew: t('order.renew') || 'Gia hạn',
    redeem: t('order.redeem') || 'Đổi quà',
    transfer: t('order.transfer') || 'Chuyển khoản'
  };
  return OrderTypeLabelsTranslated[type] || type;
};

/**
 * Get order type color for badge
 */
export const getOrderTypeColor = (type: OrderType): 'green' | 'gray' | 'yellow' | 'blue' | 'red' => {
  return (ORDER_TYPE_COLORS[type] || 'gray') as 'green' | 'gray' | 'yellow' | 'blue' | 'red';
};

/**
 * Get order status display with text and color
 */
export const getOrderStatusDisplay = (
  status: OrderStatus,
  t?: ((key: string) => string) | null
): { text: string; color: 'green' | 'gray' | 'yellow' | 'blue' | 'red' } => {
  const display = ORDER_STATUS_DISPLAY[status] || { text: status, color: 'gray' };
  if (t != null) {
    const statusTextMap: Record<OrderStatus, string> = {
      pending: t('order.pending') || 'Đang xử lý ',
      paid: t('order.completed') || 'Hoàn thành',
      processing: t('order.processing') || 'Đang xử lý',
      fulfilled: t('order.fulfilled') || 'Hoàn thành',
      canceled: t('order.canceled') || 'Đã hủy',
      failed: t('order.failed') || 'Thất bại',
      refunded: t('order.refunded') || 'Đã hoàn tiền'
    };
    return {
      text: statusTextMap[status] || display.text,
      color: display.color as 'green' | 'gray' | 'yellow' | 'blue' | 'red'
    };
  } else {
    return {
      text: display.text,
      color: display.color as 'green' | 'gray' | 'yellow' | 'blue' | 'red'
    };
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: string | number, currencyCode: string = 'USD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (currencyCode === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  }

  return `$${numAmount.toFixed(2)}`;
};

/**
 * Format date from ISO string to Vietnamese date format
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date for API request (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse string amount to number
 */
export const parseAmount = (amount: string): number => {
  return parseFloat(amount) || 0;
};

/**
 * Transform backend order to frontend display format
 */
export const transformOrder = (order: Order, t?: ((key: string) => string) | null): OrderDisplay => {
  const subtotal = parseAmount(order.subtotal);
  const taxAmount = parseAmount(order.tax_amount);
  const discountAmount = parseAmount(order.discount_amount);
  const total = parseAmount(order.total);

  return {
    id: order.id,
    orderNumber: order.order_number,
    type: order.type,
    typeLabel: getOrderTypeLabel(order.type, t != null ? t : (key: string) => key),
    status: order.status,
    statusDisplay: getOrderStatusDisplay(order.status, t != null ? t : (key: string) => key),
    subtotal,
    taxAmount,
    discountAmount,
    total,
    currencyCode: order.currency_code,
    description: order.description || '',
    notes: order.notes || '',
    hasCoupon: !!order.coupon_id,
    hasGiftCode: !!order.gift_code_id,
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
    fulfilledAt: order.fulfilled_at ? new Date(order.fulfilled_at) : undefined,
    items: order.items, // Pass through items if present
    priceBreakdown: {
      subtotal: formatCurrency(subtotal, order.currency_code),
      tax: formatCurrency(taxAmount, order.currency_code),
      discount: formatCurrency(discountAmount, order.currency_code),
      total: formatCurrency(total, order.currency_code)
    }
  };
};
