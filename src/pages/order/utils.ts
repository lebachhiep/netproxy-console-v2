import { useAuthStore } from '@/stores/auth.store';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { Subscription } from '@/types/subscription';

export const isRotatingProxy = (record: Subscription) => {
  // Rotating proxies have plan type 'rotating' or category 'rotating'
  return record.plan?.type === 'rotating' || record.plan?.category === 'rotating';
};

export const getIpAddressByProxyType = (record: Subscription): string => {
  const isRotating = isRotatingProxy(record);
  if (isRotating) {
    return 'relay.prx.network';
  }
  const credentials = record.provider_credentials as any;
  return credentials?.proxy_ip || '-';
};

export const getPortByProxyType = (record: Subscription): string => {
  const isRotating = isRotatingProxy(record);
  if (isRotating) {
    return '80';
  }
  const credentials = record.provider_credentials as any;
  const port = credentials?.http_port > 0 ? credentials.http_port : credentials?.socks5_port;
  return port?.toString() || '-';
};

export const getUsernameByProxyType = (record: Subscription): string => {
  const isRotating = isRotatingProxy(record);
  if (isRotating) {
    const subscriptionData = useSubscriptionStore.getState().getSubscriptionData(record.id);
    const authUser = useAuthStore.getState().user;
    const authUsername = authUser?.username || 'user';
    const country = subscriptionData?.country || 'us';
    let sessionId = subscriptionData?.sessionId;

    // Generate session ID if it doesn't exist
    if (!sessionId) {
      sessionId = useSubscriptionStore.getState().generateNewSessionId(record.id);
    }

    let username = `npx-customer-${authUsername}-country-${country}`;
    if (sessionId) {
      username += `-session-${sessionId}`;
    }
    return username;
  }
  const credentials = record.provider_credentials as any;
  return credentials?.username || '-';
};

export const getPasswordByProxyType = (record: Subscription): { displayPassword: string; plainPassword: string } => {
  const isRotating = isRotatingProxy(record);
  if (isRotating) {
    return {
      displayPassword: `${record.api_key.substring(0, 20)}...`,
      plainPassword: record.api_key
    };
  }
  const credentials = record.provider_credentials as any;
  const password = credentials?.password || '********';
  return {
    displayPassword: password,
    plainPassword: password
  };
};
