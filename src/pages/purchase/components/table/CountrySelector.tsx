import { Caret } from '@/components/icons';
import { CountryTag } from '@/components/tag/CountryTag';
import React, { useState } from 'react';

export type Country = { id: string; name: string; code: string };

const popularCountries: Country[] = [
  { id: '1', name: 'China', code: 'cn' },
  { id: '2', name: 'Bangladesh', code: 'bd' },
  { id: '5', name: 'Jordan', code: 'jo' }
];

const asiaCountries: Country[] = [
  { id: '1', name: 'China', code: 'cn' },
  { id: '2', name: 'Bangladesh', code: 'bd' },
  { id: '3', name: 'Indonesia', code: 'id' },
  { id: '4', name: 'India - Mumbai', code: 'in' },
  { id: '5', name: 'India - Delhi', code: 'in' },
  { id: '6', name: 'Vietnam', code: 'vn' },
  { id: '7', name: 'Thailand', code: 'th' },
  { id: '8', name: 'Philippines', code: 'ph' },
  { id: '9', name: 'Malaysia', code: 'my' },
  { id: '10', name: 'Singapore', code: 'sg' },
  { id: '11', name: 'Japan - Tokyo', code: 'jp' },
  { id: '12', name: 'South Korea - Seoul', code: 'kr' },
  { id: '13', name: 'Pakistan - Islamabad', code: 'pk' },
  { id: '14', name: 'Sri Lanka - Colombo', code: 'lk' },
  { id: '15', name: 'Nepal - Kathmandu', code: 'np' },
  { id: '16', name: 'Myanmar - Yangon', code: 'mm' },
  { id: '17', name: 'Cambodia - Phnom Penh', code: 'kh' },
  { id: '18', name: 'Laos - Vientiane', code: 'la' },
  { id: '19', name: 'Mongolia - Ulaanbaatar', code: 'mn' },
  { id: '20', name: 'Jordan - Amman', code: 'jo' }
];

interface Props {
  selected: Country[];
  onSelect: (country: Country) => void;
  onUnselect: (country: Country) => void;
}

const CountrySelector: React.FC<Props> = ({ selected, onSelect, onUnselect }) => {
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    popular: true,
    asia: true
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (key: string, title: string, countries: Country[]) => {
    const isOpen = openGroups[key];

    return (
      <div className={`flex flex-col gap-3`}>
        {/* Header */}
        <div
          className={`font-medium text-sm flex items-center gap-2 cursor-pointer select-none transition-colors ${
            isOpen ? 'text-text-hi dark:text-text-hi-dark' : 'text-text-me dark:text-text-me-dark'
          }`}
          onClick={() => toggleGroup(key)}
        >
          <Caret className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
          {title}
        </div>

        {/* Body (collapse) */}
        <div className={`transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="flex flex-wrap gap-3 mt-2">
            {countries.map((c) => {
              const isActive = selected.some((s) => s.code === c.code && s.name === c.name);
              return (
                <CountryTag
                  key={c.code + c.name}
                  name={c.name}
                  flagUrl={`https://flagcdn.com/w20/${c.code}.png`}
                  active={isActive}
                  removable={isActive}
                  onClick={() => (isActive ? onUnselect(c) : onSelect(c))}
                  onRemove={() => onUnselect(c)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <SectionTitle text="Chọn quốc gia" /> */}

      {renderSection('popular', 'Phổ biến', popularCountries)}
      {renderSection('asia', 'Châu Á', asiaCountries)}

      <p className="text-sm text-text-me dark:text-text-me-dark font-medium leading-[150%] max-w-[348px]">
        Cho những{' '}
        <div className="text-primary dark:text-primary-dark inline-block">
          {' '}
          IPs <span className="text-text-me ">từ</span> quốc gia khác
        </div>
        . Bạn vui lòng{' '}
        <a href="/contact" className="text-blue dark:text-blue-dark underline hover:text-blue-700">
          liên hệ
        </a>{' '}
        đội ngũ kỹ thuật của chúng tôi. Để hỗ trợ
      </p>
    </div>
  );
};

export default CountrySelector;
