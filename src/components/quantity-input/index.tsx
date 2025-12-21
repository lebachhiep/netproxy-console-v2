import { useEffect, useState } from 'react';
import { Add, Subtract } from '../icons';
import { QuantityInputProps } from './types';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const QuantityInput = ({ value: valueProp, min, max, stepper = 1, onValueChange }: QuantityInputProps) => {
  const { t } = useTranslation();
  const [isEdit, setEdit] = useState<boolean>(false);
  const [value, setValue] = useState<number>(valueProp || min || 0);

  useEffect(() => {
    if (valueProp !== undefined) {
      setValue(clamp(valueProp));
    }
  }, [valueProp, min, max]);

  const clamp = (v: number) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  };

  const canSubtract = min === undefined || value > min;
  const canAdd = max === undefined || value < max;

  const commitValue = () => {
    const next = clamp(value);
    setValue(next);
    onValueChange?.(next);
    setEdit(false);
  };

  return (
    <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px]  rounded-md">
      <div
        className={twMerge(
          clsx(
            'select-none shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent',
            { 'opacity-50 cursor-not-allowed': !canSubtract }
          )
        )}
        onClick={() => {
          if (!canSubtract) return;
          const next = clamp(value - stepper);
          setValue(next);
          onValueChange?.(next);
        }}
      >
        <Subtract className="text-text-lo dark:text-text-lo-dark" />
      </div>
      {isEdit ? (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/\D/g, '');
            const next = onlyNumber === '' ? (min ?? 0) : Number(onlyNumber);
            setValue(clamp(next));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitValue();
            if (e.key === 'Escape') {
              setValue(clamp(valueProp));
              setEdit(false);
            }
          }}
          onBlur={commitValue}
          className="w-12 text-center text-text-hi dark:text-text-hi-dark bg-bg-primary dark:bg-bg-primary-dark border border-primary dark:border-primary-dark rounded px-1 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          autoFocus
        />
      ) : (
        <span
          className="text-text-hi dark:text-text-hi-dark cursor-pointer select-none truncate"
          onClick={() => setEdit((prev) => !prev)}
          title={t('clickToEdit')}
        >
          {value}
        </span>
      )}
      <div
        className={twMerge(
          clsx(
            'select-none shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent',
            {
              'opacity-50 cursor-not-allowed': !canAdd
            }
          )
        )}
        onClick={() => {
          if (!canAdd) return;
          const next = clamp(value + stepper);
          setValue(next);
          onValueChange?.(next);
        }}
      >
        <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4" />
      </div>
    </div>
  );
};
