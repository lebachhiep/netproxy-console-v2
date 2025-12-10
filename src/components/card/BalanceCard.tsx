import React from 'react';
import cardBgBlue from '@/assets/images/card_bg_blue.png';
import cardBgYellow from '@/assets/images/card_bg_yellow.png';
import cardBgBlack from '@/assets/images/card_bg_black.png';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface BalanceCardProps {
  balance: number;
  spent: number;
  owner: string;
  variant?: 'blue' | 'yellow' | 'black';
}

const backgrounds: Record<string, string> = {
  blue: cardBgBlue,
  yellow: cardBgYellow,
  black: cardBgBlack
};

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, spent, owner, variant = 'blue' }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-full lg:max-w-[388.5px] flex flex-col gap-1 rounded-tl-2xl rounded-tr-2xl overflow-hidden">
      {/* Main Card giữ đúng tỷ lệ ảnh */}
      {/* aspect-[388/248] */}
      <div className="relative aspect-[388/248] rounded-2xl overflow-hidden text-white">
        {/* Background giữ đúng tỉ lệ */}
        <img src={backgrounds[variant]} alt="card background" className="absolute inset-0 w-full h-full object-cover" />

        {/* Nội dung đè lên ảnh */}
        <div className="relative z-10 flex flex-col justify-between h-full p-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t('BalanceCard.currentBalance')}</p>
            <p className="text-[28px] sm:text-[33px] font-averta leading-[120%] font-semibold">${balance.toLocaleString()}</p>
          </div>
          <p className="text-right text-base sm:text-lg font-semibold font-averta">{owner}</p>
        </div>

        {/* Overlay nhẹ để tăng tương phản (optional) */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Footer */}
      <div
        className={clsx(
          'rounded-xl text-white text-sm sm:text-base px-5 py-3 flex justify-between items-center transition-colors',
          variant === 'blue' && 'bg-[#2471C9]',
          variant === 'yellow' && 'bg-primary',
          variant === 'black' && 'bg-[#010101]'
        )}
      >
        <span>{t('BalanceCard.paidAmount')}</span>
        <span className="font-bold">${spent.toFixed(2)}</span>
      </div>
    </div>
  );
};
