import { apiService } from '@/services/api/api.service';
import type {
  AvailablePaymentMethodsResponse,
  TazapayGenerateRequest,
  TazapayGenerateResponse,
  CryptomusGenerateRequest,
  CryptomusGenerateResponse,
  PaypalGenerateRequest,
  PaypalGenerateResponse,
  StripeGenerateRequest,
  StripeGenerateResponse,
  Pay2sGenerateRequest,
  Pay2sGenerateResponse
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

  /**
   * Generate a PayPal payment URL
   */
  async generatePaypalPayment(data: PaypalGenerateRequest): Promise<PaypalGenerateResponse> {
    return apiService.post<PaypalGenerateResponse>('/user/payments/paypal/generate', data);
  }

  /**
   * Generate a Stripe payment URL
   */
  async generateStripePayment(data: StripeGenerateRequest): Promise<StripeGenerateResponse> {
    return apiService.post<StripeGenerateResponse>('/user/payments/stripe/generate', data);
  }

  /**
   * Generate a Pay2s payment URL
   */
  async generatePay2sPayment(data: Pay2sGenerateRequest): Promise<Pay2sGenerateResponse> {
    return apiService.post<Pay2sGenerateResponse>('/user/payments/pay2s/generate', data);
  }
}

export const paymentService = new PaymentService();
