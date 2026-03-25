export type PaymentMethodType = 'web2m' | 'cryptomus' | 'tazapay' | 'paypal' | 'stripe' | 'pay2s';

export interface BankInfo {
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
  transfer_code: string;
  vnd_usd_rate: number;
}

export interface CryptoService {
  network: string;
  currency: string;
  is_available: boolean;
  min_amount: number;
  max_amount: number;
  fee_percent: number;
}

export interface PaymentMethodInfo {
  type: PaymentMethodType;
  available: boolean;
  supported_countries?: Record<string, string>;
  crypto_services?: CryptoService[];
  bank_info?: BankInfo;
}

export interface AvailablePaymentMethodsResponse {
  methods: PaymentMethodInfo[];
}

export interface TazapayGenerateRequest {
  amount: number;
  country: string;
  success_url: string;
  cancel_url: string;
}

export interface TazapayGenerateResponse {
  payment_url: string;
}

export interface CryptomusGenerateRequest {
  amount: number;
}

export interface CryptomusGenerateResponse {
  payment_url: string;
}

export interface PaypalGenerateRequest {
  amount: number;
  success_url: string;
  cancel_url: string;
}

export interface PaypalGenerateResponse {
  payment_url: string;
}

export interface StripeGenerateRequest {
  amount: number;
  success_url: string;
  cancel_url: string;
}

export interface StripeGenerateResponse {
  payment_url: string;
}

export interface Pay2sGenerateRequest {
  amount: number;
  success_url: string;
  cancel_url: string;
}

export interface Pay2sGenerateResponse {
  payment_url: string;
}
