import { apiService } from '@/services/api/api.service';
import { BalanceHistoryRequest, BalanceHistoryResponse } from './transaction.types';

class TransactionService {
  /**
   * Get balance history with filtering support
   * @param params - Filter parameters (type, status, search, date range, pagination)
   * @returns Promise with transaction items and pagination info
   */
  async getBalanceHistory(params?: BalanceHistoryRequest): Promise<BalanceHistoryResponse> {
    const response = await apiService.get<BalanceHistoryResponse>('/user/account/balance/history', {
      params,
    });
    return response;
  }
}

export const transactionService = new TransactionService();
