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
    const subscriptionData = useSubscriptionStore.getState().getSubscriptionData(record.id);
    const country = (subscriptionData?.country || record?.country || '').toLowerCase();
    return !country || country === 'vn' ? 'vn.relay.prx.network' : 'relay.prx.network';
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
  // For rotating proxy: relay.prx.network:80:username:password
  // Format: npx-customer-{authUsername}-country-{country}-session-{sessionId}
  const isRotating = isRotatingProxy(record);
  if (isRotating) {
    const subscriptionData = useSubscriptionStore.getState().getSubscriptionData(record.id);
    const authUser = useAuthStore.getState().user;
    const authUsername = authUser?.username || 'user';
    const country = subscriptionData?.country || 'random';
    let sessionId = subscriptionData?.sessionId;

    // Generate session ID if it doesn't exist
    if (!sessionId) {
      sessionId = useSubscriptionStore.getState().generateNewSessionId(record.id);
    }

    let username = `npx-customer-${authUsername}`;
    const isRandomCountry = country === 'random' ? '' : `-country-${country.toLowerCase()}`;
    username += isRandomCountry;
    if (sessionId && record?.tableData?.hasSticky) {
      username += `-session-${sessionId}`;
    }
    return username;
  }
  const credentials = record.provider_credentials as any;
  return credentials?.username || '-';
};

// getConnectionString returns the canonical proxy connection string for a
// subscription. Prefers the BE-computed `connection_string` (single source of
// truth) and falls back to composing from the legacy discrete-field helpers
// during rollout. For sticky rotating subs, injects `-session-{sessionId}`
// into the username portion using the client-managed session store.
export const getConnectionString = (record: Subscription): string => {
  const isRotating = isRotatingProxy(record);
  const beString = record.connection_string;

  if (beString) {
    if (!isRotating) return beString;

    // Rotating: inject client-side country and session overrides.
    // BE format: `host:80:npx-customer-{user}[-country-{cc}]:{api_key}`
    const subscriptionData = useSubscriptionStore.getState().getSubscriptionData(record.id);
    const parts = beString.split(':');
    if (parts.length !== 4) return beString;

    // Replace country in username if user changed it client-side
    const clientCountry = subscriptionData?.country;
    if (clientCountry) {
      const username = parts[2];
      const countryLower = clientCountry.toLowerCase();
      if (clientCountry === 'random') {
        // Remove country segment entirely
        parts[2] = username.replace(/-country-[a-z]{2}/i, '');
        parts[0] = 'relay.prx.network';
      } else {
        if (/-country-[a-z]{2}/i.test(username)) {
          parts[2] = username.replace(/-country-[a-z]{2}/i, `-country-${countryLower}`);
        } else {
          parts[2] = `${username}-country-${countryLower}`;
        }
        parts[0] = countryLower === 'vn' ? 'vn.relay.prx.network' : 'relay.prx.network';
      }
    }

    // Inject session ID for sticky proxies
    if (record?.tableData?.hasSticky) {
      let sessionId = subscriptionData?.sessionId;
      if (!sessionId) sessionId = useSubscriptionStore.getState().generateNewSessionId(record.id);
      if (sessionId) {
        parts[2] = `${parts[2]}-session-${sessionId}`;
      }
    }

    return parts.join(':');
  }

  // Fallback: compose from legacy helpers (rollout safety for subs that
  // predate the BE field or for BE errors that leave it empty).
  const ip = getIpAddressByProxyType(record);
  const port = getPortByProxyType(record);
  const username = getUsernameByProxyType(record);
  const { plainPassword } = getPasswordByProxyType(record);

  if (isRotating) return `${ip}:${port}:${username}:${plainPassword}`;

  const credentials = record.provider_credentials as any;
  const protocol = credentials?.http_port > 0 ? 'http' : 'socks5';
  return `${protocol}://${username}:${plainPassword}@${ip}:${port}`;
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
