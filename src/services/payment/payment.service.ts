import { apiService } from '@/services/api/api.service';
import type {
  AvailablePaymentMethodsResponse,
  TazapayGenerateRequest,
  TazapayGenerateResponse,
  CryptomusGenerateRequest,
  CryptomusGenerateResponse,
} from './payment.types';

class PaymentService {
  /**
   * Get available payment methods with their configuration
   */
  async getAvailablePaymentMethods(): Promise<AvailablePaymentMethodsResponse> {
    return apiService.get<AvailablePaymentMethodsResponse>('/user/payments/methods');
  }

  /**
   * Generate a Tazapay payment URL
   */
  async generateTazapayPayment(data: TazapayGenerateRequest): Promise<TazapayGenerateResponse> {
    return apiService.post<TazapayGenerateResponse>('/user/payments/tazapay/generate', data);
  }

  /**
   * Generate a Cryptomus payment URL
   */
  async generateCryptomusPayment(data: CryptomusGenerateRequest): Promise<CryptomusGenerateResponse> {
    return apiService.post<CryptomusGenerateResponse>('/user/payments/cryptomus/generate', data);
  }
}

export const paymentService = new PaymentService();
