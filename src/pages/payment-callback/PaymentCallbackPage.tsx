import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PAYMENT_CHANNEL_NAME, type PaymentMessage } from '@/lib/payment-channel';

/**
 * PaymentCallbackPage handles the redirect from payment gateways after payment.
 *
 * Payment gateways redirect here with query params (e.g. resultCode, orderId, amount).
 * This page:
 *   1. Reads resultCode to determine success/failure
 *   2. Notifies the original tab via BroadcastChannel so it can refresh balance
 *   3. Auto-closes this tab after a short delay (works because it was opened via window.open)
 */
export default function PaymentCallbackPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setClosing] = useState(false);

  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  // Stripe/PayPal don't send resultCode — treat presence of session_id or no error params as success
  const isSuccess = resultCode === '0' || resultCode === '9000' || resultCode === null;

  const displayAmount = useMemo(() => {
    if (!amount) return null;
    const num = parseInt(amount, 10);
    if (isNaN(num)) return null;
    return new Intl.NumberFormat('vi-VN').format(num);
  }, [amount]);

  useEffect(() => {
    // Notify the original tab via BroadcastChannel
    try {
      const channel = new BroadcastChannel(PAYMENT_CHANNEL_NAME);
      const msg: PaymentMessage = {
        type: isSuccess ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
        orderId: orderId ?? undefined,
        resultCode: resultCode ?? undefined
      };
      channel.postMessage(msg);
      channel.close();
    } catch {
      // BroadcastChannel not supported
    }

    // Auto-close this tab after delay
    const timer = setTimeout(() => {
      setClosing(true);
      window.close();
      // If window.close() didn't work, redirect to wallet
      setTimeout(() => {
        navigate('/wallet', { replace: true });
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSuccess, orderId, resultCode, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary dark:bg-bg-primary-dark p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {isSuccess ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-text-hi dark:text-text-hi-dark">{t('paymentCallback.success')}</h1>
            {displayAmount && (
              <p className="text-text-lo dark:text-text-lo-dark">{t('paymentCallback.amountVnd', { amount: displayAmount })}</p>
            )}
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-red/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-text-hi dark:text-text-hi-dark">{t('paymentCallback.failed')}</h1>
            {message && <p className="text-text-lo dark:text-text-lo-dark">{message}</p>}
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-text-lo dark:text-text-lo-dark">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{t('paymentCallback.autoClose')}</span>
        </div>
      </div>
    </div>
  );
}
