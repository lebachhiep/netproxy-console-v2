/**
 * BroadcastChannel-based cross-tab communication for payment status.
 *
 * When a payment completes, the callback tab posts a message so the
 * original tab can refresh the balance without user interaction.
 */

export const PAYMENT_CHANNEL_NAME = 'netproxy-payment-status';

export interface PaymentMessage {
  type: 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
  orderId?: string;
  resultCode?: string;
}
