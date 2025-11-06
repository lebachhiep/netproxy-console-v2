import React, { useState, useMemo } from 'react';
import { Input } from '@/components/input/Input';
import { ApiInput } from '@/components/input/ApiInput';
import { Select } from '@/components/select/Select';
import { Eye, EyeOff, FileCopy, Person } from '@/components/icons';
import { toast } from 'sonner';
import { SubscriptionWithPlan, ProxyCredentials } from '@/types/subscription';

interface ProxyConnectionInfoProps {
  subscription: SubscriptionWithPlan;
  username?: string; // Current user's username for generating proxy username
}

// Helper function to check if credentials are valid
const hasValidCredentials = (creds: any): creds is ProxyCredentials => {
  return creds &&
         typeof creds === 'object' &&
         'ProxyIP' in creds &&
         'Username' in creds &&
         'Password' in creds;
};

// Country options for username builder
const countryOptions = [
  { label: 'Việt Nam', value: 'vn' },
  { label: 'Mỹ', value: 'us' },
  { label: 'Nhật Bản', value: 'jp' },
  { label: 'Singapore', value: 'sg' },
  { label: 'Hàn Quốc', value: 'kr' },
  { label: 'Anh', value: 'uk' },
  { label: 'Đức', value: 'de' },
  { label: 'Pháp', value: 'fr' },
  { label: 'Canada', value: 'ca' },
  { label: 'Úc', value: 'au' }
];

export const ProxyConnectionInfo: React.FC<ProxyConnectionInfoProps> = ({ subscription, username = 'user' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [sessionId, setSessionId] = useState('');

  const hasExternalCredentials = hasValidCredentials(subscription.provider_credentials);

  // Build username for internal plans
  const generatedUsername = useMemo(() => {
    let base = `npx-customer-${username}`;
    const parts: string[] = [];

    if (selectedCountry) {
      parts.push(`country-${selectedCountry}`);
    }

    if (sessionId.trim()) {
      parts.push(`session-${sessionId.trim()}`);
    }

    return parts.length > 0 ? `${base}-${parts.join('-')}` : base;
  }, [username, selectedCountry, sessionId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  // Render external plan connection info (with provider_credentials)
  if (hasExternalCredentials) {
    const credentials = subscription.provider_credentials as ProxyCredentials;

    // Generate RFC format strings
    const httpPort = credentials.HTTPPort || 80;
    const socksPort = credentials.SOCKS5Port || 0;
    const host = credentials.ProxyIP;
    const user = credentials.Username;
    const pass = showPassword ? credentials.Password : '•'.repeat(credentials.Password.length);

    // RFC formats
    const format1 = `http://${user}:${pass}@${host}:${httpPort}`;
    const format2 = `${host}:${httpPort}:${user}:${pass}`;
    const format3 = `${user}:${pass}@${host}:${httpPort}`;
    const format4 = `${host},${httpPort},${user},${pass}`;

    return (
      <div className="p-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            Thông tin kết nối proxy
          </span>
        </div>

        {/* RFC Format 1: http://user:pass@host:port */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            Format 1: http://user:pass@host:port
          </label>
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
                onClick: () => copyToClipboard(`http://${user}:${credentials.Password}@${host}:${httpPort}`, 'Format 1')
              }
            ]}
          />
        </div>

        {/* RFC Format 2: host:port:username:password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            Format 2: host:port:username:password
          </label>
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
                onClick: () => copyToClipboard(`${host}:${httpPort}:${user}:${credentials.Password}`, 'Format 2')
              }
            ]}
          />
        </div>

        {/* RFC Format 3: username:password@host:port */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            Format 3: username:password@host:port
          </label>
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
                onClick: () => copyToClipboard(`${user}:${credentials.Password}@${host}:${httpPort}`, 'Format 3')
              }
            ]}
          />
        </div>

        {/* RFC Format 4: host,port,username,password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            Format 4: host,port,username,password
          </label>
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
                onClick: () => copyToClipboard(`${host},${httpPort},${user},${credentials.Password}`, 'Format 4')
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
  const host = 'relay.prx.network:80';
  const password = subscription.api_key;

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
          Thông tin kết nối proxy
        </span>
      </div>

      {/* Proxy Host */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
          Proxy Host
        </label>
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
              className="h-10 flex-1 dark:pseudo-border-top dark:border-transparent"
              placeholder="Chọn quốc gia (tùy chọn)"
              options={countryOptions}
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value as string)}
            />
          </div>

          {/* Session ID input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-lo dark:text-text-lo-dark min-w-[80px]">Session ID:</span>
            <Input
              icon={<></>}
              placeholder="Nhập session ID (tùy chọn)"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              wrapperClassName="flex-1 h-10"
            />
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
          Format: <code className="bg-bg-mute dark:bg-bg-mute-dark px-1 py-0.5 rounded">
            npx-customer-{'{username}'}-country-{'{xx}'}-session-{'{id}'}
          </code>
        </p>
      </div>

      {/* Password (API Key) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
          Password (API Key)
        </label>
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
        <p className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
          Ví dụ cấu hình:
        </p>
        <div className="text-xs text-text-me dark:text-text-me-dark space-y-1 font-mono">
          <div>Host: <span className="text-blue dark:text-blue-dark">{host}</span></div>
          <div>Username: <span className="text-blue dark:text-blue-dark">{generatedUsername}</span></div>
          <div>Password: <span className="text-blue dark:text-blue-dark">{'•'.repeat(20)}</span></div>
        </div>
      </div>
    </div>
  );
};
