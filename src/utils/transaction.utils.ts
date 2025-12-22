import { TransactionItem, TransactionDisplay, TransactionType, TransactionStatus } from '@/services/transaction/transaction.types';
/**
 * Map transaction status to Vietnamese display text and color
 */
export const getStatusDisplay = (status: TransactionStatus, t: (key: string) => string): { text: string; color: string } => {
  const statusMap: Record<TransactionStatus, { text: string; color: string }> = {
    pending: { text: t('transaction.pending') || 'Đang xử lý ', color: 'yellow' },
    success: { text: t('transaction.success') || 'Hoàn thành', color: 'green' },
    failed: { text: t('transaction.failed') || 'Thất bại', color: 'red' },
    canceled: { text: t('transaction.canceled') || 'Đã hủy', color: 'gray' },
    error: { text: t('transaction.error') || 'Lỗi', color: 'red' }
  };
  return statusMap[status] || { text: status, color: 'gray' };
};

/**
 * Map transaction type to Vietnamese display text
 */
export const getTypeDisplay = (type: TransactionType, t: (key: string) => string): string => {
  return type === 'credit' ? t('transaction.credit') : t('transaction.debit');
};

/**
 * Format date from ISO string to Vietnamese date format
 */
export const formatTransactionDate = (dateString: string): string => {
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
 * Transform backend transaction item to frontend display format
 */
export const transformTransaction = (item: TransactionItem, t: (key: string) => string): TransactionDisplay => {
  const balanceChange = item.balance_after - item.balance_before;

  return {
    id: item.id,
    type: item.type,
    typeLabel: getTypeDisplay(item.type, t),
    amount: item.amount,
    description: item.description,
    status: getStatusDisplay(item.status, t),
    balanceBefore: item.balance_before,
    balanceAfter: item.balance_after,
    balanceChange,
    date: formatTransactionDate(item.created_at),
    createdAt: new Date(item.created_at)
  };
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
