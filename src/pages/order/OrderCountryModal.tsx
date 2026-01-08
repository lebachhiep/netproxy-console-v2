import { Modal } from '@/components/modal/Modal';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { GlobeArrow } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { Subscription } from '@/types/subscription';
import { isNilOrEmpty } from '@/utils/types';
import { Select } from '@/components/select/Select';
import { queryClient } from '@/components/auth/ProtectedRoute';
import { getCountryOptions } from './OrderDetailPage';
import clsx from 'clsx';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { Button } from '@/components/button/Button';

export const OrderCountryModal = ({ selectedRows, queryKey }: { selectedRows: Subscription[]; queryKey: unknown[] }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('VN');
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleCountryChange = () => {
    const countryCode = String(selectedCountry);

    const selectedRowMap = new Map<string, Subscription>();
    selectedRows.forEach((row) => {
      useSubscriptionStore.getState().setSubscriptionData(row.id, { country: countryCode });
      selectedRowMap.set(row.id, row);
    });

    // update table country
    queryClient.setQueryData(queryKey, (oldSubs: Subscription[]) => {
      return oldSubs.map((s) => {
        if (!selectedRowMap.has(s.id)) {
          return s;
        }

        return {
          ...s,
          country: countryCode
        };
      });
    });
    setSelectedCountry('VN');
    setOpen(false);
  };

  return (
    <>
      <IconButton
        disabled={isNilOrEmpty(selectedRows)}
        onClick={() => {
          setOpen(true);
        }}
        className="w-10 h-10"
        icon={<GlobeArrow className="w-5 h-5" />}
      />
      <Modal
        open={open}
        className="text-text-hi dark:text-text-hi-dark"
        onClose={() => setOpen(false)}
        title={t('pickCountry')}
        actions={[]}
      >
        <div className="flex flex-col gap-2">
          <div className="p-4 flex flex-col gap-2">
            <p>{t('countryApplyFor', { count: selectedRows.length })}</p>
            <Select
              value={selectedCountry}
              onChange={(value) => {
                setSelectedCountry(String(value));
              }}
              options={getCountryOptions(t)}
              placeholder={t('selectCountry')}
              className={clsx('h-10 min-w-[140px]')}
              optionClassName="max-h-60 overflow-y-auto"
            />
          </div>
          <div className="flex items-center justify-center border-t p-4 dark:border-border-element-dark border-border-element">
            <Button onClick={handleCountryChange} className="mx-auto px-8" size="sm">
              {t('confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
