import { apiService } from '@/services/api/api.service';
import { WalletBalance } from './wallet.types';

class WalletService {
  /**
   * Get wallet balance and summary
   * @returns Promise with balance, total_deposited, and total_purchased
   */
  async getBalance(): Promise<WalletBalance> {
    const response = await apiService.get<WalletBalance>('/user/account/me');
    return response;
  }
}

export const walletService = new WalletService();
