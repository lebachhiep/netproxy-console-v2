import { apiService } from '@/services/api/api.service';
import { RedeemGiftCodeRequest, RedeemGiftCodeResponse } from './giftcode.types';

class GiftCodeService {
  async redeem(code: string): Promise<RedeemGiftCodeResponse> {
    const response = await apiService.post<RedeemGiftCodeResponse>(
      '/user/giftcodes/redeem',
      { code } as RedeemGiftCodeRequest
    );
    return response;
  }
}

export const giftCodeService = new GiftCodeService();
