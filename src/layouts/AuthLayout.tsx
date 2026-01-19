import { Select } from '@/components/select/Select';
import { SupportedLanguages } from '@/config/constants';
import { useBranding } from '@/hooks/useBranding';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface AuthLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left, right }) => {
  const { t, i18n } = useTranslation();
  const { businessName } = useBranding();
  return (
    <div className="max-w-[1200px] mx-auto relative md:flex min-h-[100dvh] ">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center lg:p-10 min-h-[100dvh] lg:min-h-0">
        {left}
        <div
          className={
            'absolute bottom-10 items-center -translate-x-1/2 md:translate-x-0 text-text-lo dark:text-text-lo-dark font-medium text-sm left-1/2 md:left-[unset]'
          }
        >
          <div className="mb-3 min-w-[130px]">
            <Select
              options={SupportedLanguages.map((l) => ({ label: l.displayName, value: l.code }))}
              value={i18n.language}
              onChange={(val) => {
                i18n.changeLanguage(String(val));
              }}
              placeholder={t('language') || 'Ngôn ngữ'}
              placement="bottom"
              className="w-full h-10 dark:pseudo-border-top dark:border-transparent dark:bg-[#2B405A] font-inter"
            />
          </div>
          <div className="items-center text-center md:center">© {businessName}</div>
        </div>
      </div>

      {/* Right */}
      {right && right}
    </div>
  );
};
