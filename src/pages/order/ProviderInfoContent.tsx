import { useTranslation } from 'react-i18next';

export const ProviderInfoContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-text-hi dark:text-text-hi-dark">
      <h2 className="text-lg font-medium mb-2">{t('proxyGuide.rotating.intro')}</h2>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex gap-2 flex-row items-center">
          1.{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: t('proxyGuide.rotating.steps.getProxy', {
                getProxy: '<b>Get Proxy</b>'
              })
            }}
          />
        </li>

        <li className="flex gap-2 flex-row items-center">2. {t('proxyGuide.rotating.steps.contactSupport')}</li>
      </ul>
    </div>
  );
};
