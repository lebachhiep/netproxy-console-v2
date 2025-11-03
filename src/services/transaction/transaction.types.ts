// Transaction type enum
export type TransactionType = 'credit' | 'debit';

// Transaction status enum
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'canceled' | 'error';

// Backend transaction item structure from balance history API
export interface TransactionItem {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

// Request parameters for balance history API
export interface BalanceHistoryRequest {
  type?: TransactionType;
  status?: TransactionStatus;
  search?: string;
  start_date?: string; // Format: YYYY-MM-DD or ISO datetime
  end_date?: string; // Format: YYYY-MM-DD or ISO datetime
  page?: number;
  per_page?: number;
}

// Response from balance history API
export interface BalanceHistoryResponse {
  items: TransactionItem[];
  total: number;
  page: number;
  per_page: number;
}

// Frontend display structure for transaction
export interface TransactionDisplay {
  id: string;
  type: TransactionType;
  typeLabel: string; // "Nạp tiền" or "Chi tiêu"
  amount: number;
  description: string;
  status: {
    text: string;
    color: string;
  };
  balanceBefore: number;
  balanceAfter: number;
  balanceChange: number;
  date: string;
  createdAt: Date;
}
