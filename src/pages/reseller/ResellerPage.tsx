import { useTranslation } from 'react-i18next';

export const ResellerPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center">
      <span className="text-2xl font-bold text-text-hi dark:text-text-hi-dark bg-blue-100 px-8 py-4 rounded-lg">{t('comingSoon')}</span>
    </div>
  );
};
