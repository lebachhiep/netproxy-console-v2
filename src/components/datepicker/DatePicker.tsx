import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { CalendarPlus } from '../icons';
import { twMerge } from 'tailwind-merge';

dayjs.extend(isoWeek);

interface DatePickerProps {
  value?: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  className // nhận className từ ngoài
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');

  const calendarStart = startOfMonth.startOf('week');
  const calendarEnd = endOfMonth.endOf('week');

  const days: Dayjs[] = [];
  let day = calendarStart;
  while (day.isBefore(calendarEnd) || day.isSame(calendarEnd, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const handleSelect = (day: Dayjs) => {
    onChange(day);
    setCurrentMonth(day.startOf('month'));
    setOpen(false);
  };

  return (
    <div className={twMerge('relative inline-block', className)}>
      {/* Input hiển thị */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={twMerge(
          'flex items-center text-sm justify-between pl-3 pr-2 py-[10px] rounded-lg border-2 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark shadow-xs transition hover:border-blue dark:hover:border-transparent',
          className
        )}
      >
        <span className={value ? 'text-text-hi dark:text-text-hi-dark' : 'text-text-me dark:text-text-me-dark'}>
          {value ? value.format('DD/MM/YYYY') : placeholder}
        </span>
        <CalendarPlus className="text-text-lo" />
      </button>

      {/* Calendar Popup */}
      {open && (
        <div className="absolute mt-2 w-64 bg-bg-canvas dark:bg-bg-canvas-dark border-2 border-border-element dark:border-border-element-dark rounded-xl shadow-lg z-50 p-3">
          {/* Header month */}
          <div className="flex items-center justify-between mb-2 text-text-hi dark:text-text-hi-dark">
            <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>◀</button>
            <span className="font-semibold">{currentMonth.format('MMMM YYYY')}</span>
            <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>▶</button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-text-lo dark:text-text-lo-dark text-sm mb-1">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 text-center gap-1">
            {days.map((day) => {
              const isSelected = value?.isSame(day, 'day');
              const isCurrentMonth = day.month() === currentMonth.month();

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleSelect(day)}
                  className={`aspect-square w-full rounded-full text-sm flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-blue text-white'
                      : isCurrentMonth
                        ? 'hover:bg-blue-100 text-text-hi dark:text-text-hi-dark'
                        : 'text-text-lo dark:text-text-lo-dark'
                  }`}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
