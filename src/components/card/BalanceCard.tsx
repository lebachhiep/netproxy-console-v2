import React from 'react';
import { twMerge } from 'tailwind-merge';
import cardBgBlue from '@/assets/images/card_bg_blue.png';
import cardBgYellow from '@/assets/images/card_bg_yellow.png';
import cardBgBlack from '@/assets/images/card_bg_black.png';

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
  return (
    <div className="w-full max-w-[430px] flex flex-col gap-1">
      {/* Card with background */}
      <div className="relative rounded-2xl overflow-hidden text-white">
        {/* Background image */}
        <img src={backgrounds[variant]} alt="card background" className="absolute inset-0 w-full h-full object-contain" />

        {/* Overlay content */}
        <div className="relative flex flex-col h-[272px] justify-between p-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Số dư tài khoản</p>
            <p className="text-[33px] font-averta leading-[120%] font-semibold">${balance.toLocaleString()}</p>
          </div>
          <p className="text-right text-lg font-semibold font-averta">{owner}</p>
        </div>
      </div>

      {/* Footer */}
      <div
        className={twMerge(
          'rounded-xl text-white text-sm px-5 py-3 flex justify-between items-center',
          variant === 'blue' && 'bg-[#2471C9]',
          variant === 'yellow' && 'bg-primary',
          variant === 'black' && 'bg-[#010101]'
        )}
      >
        <span>Đã chi tiêu</span>
        <span className="font-bold">${spent.toFixed(2)}</span>
      </div>
    </div>
  );
};
