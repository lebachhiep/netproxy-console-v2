import { useQuery, useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services/payment/payment.service';
import type {
  AvailablePaymentMethodsResponse,
  TazapayGenerateRequest,
  TazapayGenerateResponse,
  CryptomusGenerateRequest,
  CryptomusGenerateResponse
} from '@/services/payment/payment.types';

// Query keys factory
export const paymentKeys = {
  all: ['payments'] as const,
  methods: () => [...paymentKeys.all, 'methods'] as const
};

/**
 * Hook to fetch available payment methods with their configuration
 */
export function usePaymentMethods() {
  return useQuery<AvailablePaymentMethodsResponse>({
    queryKey: paymentKeys.methods(),
    queryFn: () => paymentService.getAvailablePaymentMethods(),
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  });
}

/**
 * Hook to generate a Tazapay payment
 */
export function useTazapayPayment() {
  return useMutation<TazapayGenerateResponse, Error, TazapayGenerateRequest>({
    mutationFn: (data) => paymentService.generateTazapayPayment(data)
  });
}

/**
 * Hook to generate a Cryptomus payment
 */
export function useCryptomusPayment() {
  return useMutation<CryptomusGenerateResponse, Error, CryptomusGenerateRequest>({
    mutationFn: (data) => paymentService.generateCryptomusPayment(data)
  });
}
