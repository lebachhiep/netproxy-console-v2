import { Select } from '@/components/select/Select';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left, right }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto relative md:flex min-h-[100dvh] ">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center lg:p-10 min-h-[100dvh] lg:min-h-0">{left}</div>
      {/* Right */}
      {right && right}
      <div className="absolute bottom-10 -translate-x-1/2 md:translate-x-0 md:left-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">
        <div className="mb-3 min-w-[130px]">
          <Select
            options={[
              { label: t('english'), value: 'en' },
              { label: t('vnese'), value: 'vi' }
            ]}
            value={i18n.language}
            onChange={(val) => {
              if (val == 'vi') {
                i18n.changeLanguage('vi');
              } else {
                i18n.changeLanguage('en');
              }
            }}
            placeholder={t('language') || 'Ngôn ngữ'}
            placement="bottom"
            className="w-full h-10 dark:pseudo-border-top dark:border-transparent dark:bg-[#2B405A] font-inter"
          />
        </div>
        <div>© Netproxy</div>
      </div>
    </div>
  );
};
