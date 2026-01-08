import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/input/Input';
import { ApiInput } from '@/components/input/ApiInput';
import { Select } from '@/components/select/Select';
import { Eye, EyeOff, FileCopy, Person, ArrowRotate } from '@/components/icons';
import IconButton from '@/components/button/IconButton';
import { toast } from 'sonner';
import { SubscriptionWithPlan, ProxyCredentials } from '@/types/subscription';
import { useSubscriptionData } from '@/stores/subscription.store';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';

interface ProxyConnectionInfoProps {
  subscription: SubscriptionWithPlan;
  username?: string; // Current user's username for generating proxy username
}

// Helper function to check if credentials are valid
const hasValidCredentials = (creds: any): creds is ProxyCredentials => {
  return creds && typeof creds === 'object' && 'proxy_ip' in creds && 'username' in creds && 'password' in creds;
};

export const ProxyConnectionInfo: React.FC<ProxyConnectionInfoProps> = ({ subscription, username: propUsername }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('VN'); // Default US
  const [sessionId, setSessionId] = useState('');

  // Load subscription data from store
  const subscriptionData = useSubscriptionData(subscription.id);

  // Get username from auth store
  const authUser = useAuthStore((state) => state.user);
  const authUsername = authUser?.username || propUsername || 'user';

  const hasExternalCredentials = hasValidCredentials(subscription.provider_credentials);
  // const isRotatingProxy = subscription.plan?.type === 'rotating' || subscription.plan?.category === 'rotating';

  // Country options for username builder
  const countryOptions = [
    { label: t('countryList.vn'), value: 'vn' },
    { label: t('countryList.us'), value: 'us' },
    { label: t('countryList.jp'), value: 'jp' },
    { label: t('countryList.sg'), value: 'sg' },
    { label: t('countryList.kr'), value: 'kr' },
    { label: t('countryList.uk'), value: 'uk' },
    { label: t('countryList.de'), value: 'de' },
    { label: t('countryList.fr'), value: 'fr' },
    { label: t('countryList.ca'), value: 'ca' },
    { label: t('countryList.au'), value: 'au' }
  ];

  // Load saved country and sessionId from store on mount
  useEffect(() => {
    // Set country from store or default to US
    setSelectedCountry(subscriptionData.country || 'us');
    // Set sessionId from store or will be generated on demand
    setSessionId(subscriptionData.sessionId);
  }, []);

  // Save country to store when changed
  const handleCountryChange = (value: string | number | undefined) => {
    const countryValue = (value as string) || 'us';
    setSelectedCountry(countryValue);
    subscriptionData.updateCountry(countryValue);
  };

  // Save sessionId to store when changed
  const handleSessionIdChange = (value: string) => {
    setSessionId(value);
    if (value) {
      subscriptionData.setData({ sessionId: value });
    }
  };

  // Refresh sessionId (generate new random one)
  const handleRefreshSessionId = () => {
    const newSessionId = subscriptionData.generateNewSessionId();
    setSessionId(newSessionId);
    toast.success(t('toast.success.sessionF5'));
  };

  // Build username for internal plans
  // Format: npx-customer-{username}-country-{country_code}-session-{session_id}
  const generatedUsername = useMemo(() => {
    const base = `npx-customer-${authUsername}`;
    const parts: string[] = [];

    // Always add country (default or selected)
    if (selectedCountry) {
      parts.push(`country-${selectedCountry}`);
    }

    // Always add sessionId (generate if empty)
    const finalSessionId = sessionId || subscriptionData.sessionId;
    if (finalSessionId) {
      parts.push(`session-${finalSessionId}`);
    }

    return parts.length > 0 ? `${base}-${parts.join('-')}` : base;
  }, [authUsername, selectedCountry, sessionId, subscriptionData.sessionId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copied') + label);
  };

  // Render external plan connection info (with provider_credentials)
  if (hasExternalCredentials) {
    const credentials = subscription.provider_credentials as ProxyCredentials;

    // Generate RFC format strings
    const httpPort = credentials.http_port || 80;
    const socksPort = credentials.socks5_port || 0;
    const host = credentials.proxy_ip;
    const user = credentials.username;
    const pass = showPassword ? credentials.password : '•'.repeat(credentials.password.length);

    // RFC formats
    const format1 = `http://${user}:${pass}@${host}:${httpPort}`;
    const format2 = `${host}:${httpPort}:${user}:${pass}`;
    const format3 = `${user}:${pass}@${host}:${httpPort}`;
    const format4 = `${host},${httpPort},${user},${pass}`;

    return (
      <div className="p-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Thông tin kết nối proxy</span>
        </div>

        {/* RFC Format 1: http://user:pass@host:port */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Format 1: http://user:pass@host:port</label>
          <ApiInput
            className="h-10"
            value={format1}
            label=""
            actions={[
              {
                icon: showPassword ? (
                  <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
                ) : (
                  <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
                ),
                onClick: () => setShowPassword(!showPassword)
              },
              {
                icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                onClick: () => copyToClipboard(`http://${user}:${credentials.password}@${host}:${httpPort}`, 'Format 1')
              }
            ]}
          />
        </div>

        {/* RFC Format 2: host:port:username:password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Format 2: host:port:username:password</label>
          <ApiInput
            className="h-10"
            value={format2}
            label=""
            actions={[
              {
                icon: showPassword ? (
                  <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
                ) : (
                  <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
                ),
                onClick: () => setShowPassword(!showPassword)
              },
              {
                icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                onClick: () => copyToClipboard(`${host}:${httpPort}:${user}:${credentials.password}`, 'Format 2')
              }
            ]}
          />
        </div>

        {/* RFC Format 3: username:password@host:port */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Format 3: username:password@host:port</label>
          <ApiInput
            className="h-10"
            value={format3}
            label=""
            actions={[
              {
                icon: showPassword ? (
                  <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
                ) : (
                  <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
                ),
                onClick: () => setShowPassword(!showPassword)
              },
              {
                icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                onClick: () => copyToClipboard(`${user}:${credentials.password}@${host}:${httpPort}`, 'Format 3')
              }
            ]}
          />
        </div>

        {/* RFC Format 4: host,port,username,password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Format 4: host,port,username,password</label>
          <ApiInput
            className="h-10"
            value={format4}
            label=""
            actions={[
              {
                icon: showPassword ? (
                  <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
                ) : (
                  <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
                ),
                onClick: () => setShowPassword(!showPassword)
              },
              {
                icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                onClick: () => copyToClipboard(`${host},${httpPort},${user},${credentials.password}`, 'Format 4')
              }
            ]}
          />
        </div>

        {socksPort > 0 && (
          <div className="bg-bg-mute dark:bg-bg-mute-dark p-3 rounded-lg">
            <p className="text-xs text-text-lo dark:text-text-lo-dark">
              <span className="font-semibold">SOCKS5 Port:</span> {socksPort}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render internal plan (no provider_credentials - use API key)
  const host = countryOptions ? 'vn.prx.network:80' : 'relay.prx.network:80';
  const password = subscription.api_key;

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Thông tin kết nối proxy</span>
      </div>

      {/* Proxy Host */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Proxy Host</label>
        <ApiInput
          className="h-10"
          value={host}
          label=""
          actions={[
            {
              icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
              onClick: () => copyToClipboard(host, 'Proxy Host')
            }
          ]}
        />
      </div>

      {/* Username Builder */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark flex items-center gap-2">
          <Person className="w-4 h-4" />
          Username Builder
        </label>

        <div className="flex flex-col gap-2">
          {/* Country selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-lo dark:text-text-lo-dark min-w-[80px]">Quốc gia:</span>
            <Select
              className="h-10 w-[200px] dark:pseudo-border-top dark:border-transparent"
              placeholder="Chọn quốc gia (tùy chọn)"
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
            />
          </div>

          {/* Session ID input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-lo dark:text-text-lo-dark min-w-[80px]">Session ID:</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                icon={<></>}
                placeholder="Nhập session ID (tùy chọn)"
                value={sessionId}
                onChange={(e) => handleSessionIdChange(e.target.value)}
                wrapperClassName="flex-1 h-10"
              />
              <IconButton
                icon={<ArrowRotate className="text-green-600 dark:text-green-400" />}
                className="w-8 h-8 hover:bg-green-50 dark:hover:bg-green-900/30"
                onClick={handleRefreshSessionId}
                title="Refresh Session ID"
              />
            </div>
          </div>

          {/* Generated username display */}
          <ApiInput
            className="h-10"
            value={generatedUsername}
            label="Username: "
            actions={[
              {
                icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                onClick: () => copyToClipboard(generatedUsername, 'Username')
              }
            ]}
          />
        </div>

        <p className="text-xs text-text-lo dark:text-text-lo-dark">
          Format:{' '}
          <code className="bg-bg-mute dark:bg-bg-mute-dark px-1 py-0.5 rounded">
            npx-customer-{'{username}'}-country-{'{xx}'}-session-{'{id}'}
          </code>
        </p>
      </div>

      {/* Password (API Key) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">Password (API Key)</label>
        <ApiInput
          className="h-10"
          value={showPassword ? password : '•'.repeat(password.length)}
          label=""
          actions={[
            {
              icon: showPassword ? (
                <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
              ) : (
                <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
              ),
              onClick: () => setShowPassword(!showPassword)
            },
            {
              icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
              onClick: () => copyToClipboard(password, 'Password')
            }
          ]}
        />
      </div>

      {/* Example configuration */}
      <div className="bg-bg-mute dark:bg-bg-mute-dark p-4 rounded-lg">
        <p className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">Ví dụ cấu hình:</p>
        <div className="text-xs text-text-me dark:text-text-me-dark space-y-1 font-mono">
          <div>
            Host: <span className="text-blue dark:text-blue-dark">{host}</span>
          </div>
          <div>
            Username: <span className="text-blue dark:text-blue-dark">{generatedUsername}</span>
          </div>
          <div>
            Password: <span className="text-blue dark:text-blue-dark">{'•'.repeat(20)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
