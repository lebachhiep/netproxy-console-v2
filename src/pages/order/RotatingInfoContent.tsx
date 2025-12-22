import { useTranslation } from 'react-i18next';

export const RotatingInfoContent = () => {
  const { t } = useTranslation();

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-text-hi dark:text-text-hi-dark">
      <h2 className="text-lg font-medium mb-2">{t('proxyGuide.usernameStructure')}</h2>
      <pre className="bg-gray-100 dark:bg-slate-800 rounded-md p-4 text-sm overflow-x-auto">
        <code className="font-mono">npx-customer-admin[-country-XX][-session-YYY]</code>
      </pre>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex gap-2 flex-row items-center">
          <span className="font-mono bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">country-XX</span>
          <div className="flex-1">
            → {t('proxyGuide.selectCountry')} (<code className="font-mono">us</code>, <code className="font-mono">vn</code>,{' '}
            <code className="font-mono">jp</code>...).
            <span>{t('proxyGuide.selectCountryDescription')}</span>
          </div>
        </li>

        <li className="flex gap-2 flex-row items-center">
          <span className="font-mono bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">session-YYY</span>
          <div className="flex-1">
            → {t('proxyGuide.keepIP')} (<code className="font-mono">YYY</code> {t('isRandom')}).
            <span>{t('proxyGuide.onceDontHavePlan')}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};
