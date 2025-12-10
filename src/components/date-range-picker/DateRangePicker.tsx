import React, { useState, useMemo } from 'react';
import { CalendarPlus } from '../icons';
import { useTranslation } from 'react-i18next';
interface DateRange {
  from: Date | null;
  to: Date | null;
}
interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const dateTime = date.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();
  return dateTime > startTime && dateTime < endTime;
};

const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of week (0 = Sunday, 1 = Monday, etc.)
  let startDay = firstDay.getDay();
  // Convert to Monday = 0, Sunday = 6
  startDay = startDay === 0 ? 6 : startDay - 1;

  const days: Date[] = [];

  // Add previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }

  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month days to complete the grid
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = { from: null, to: null },
  onChange,
  placeholder,
  className = '',
  triggerClassName = ''
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const placeholderText = useMemo(() => {
    return placeholder || t('DateRangePicker') || 'Select date range';
  }, [placeholder, t]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);

  const monthNames = [
    t('months.january') || 'January',
    t('months.february') || 'February',
    t('months.march') || 'March',
    t('months.april') || 'April',
    t('months.may') || 'May',
    t('months.june') || 'June',
    t('months.july') || 'July',
    t('months.august') || 'August',
    t('months.september') || 'September',
    t('months.october') || 'October',
    t('months.november') || 'November',
    t('months.december') || 'December'
  ];

  const handleSelect = (day: Date) => {
    if (!value.from || (value.from && value.to)) {
      onChange({ from: day, to: null });
    } else if (value.from && !value.to) {
      if (day.getTime() < value.from.getTime()) {
        onChange({ from: day, to: value.from });
      } else {
        onChange({ from: value.from, to: day });
      }
      setOpen(false);
    }
  };

  const isInRange = (day: Date): boolean => {
    if (!value.from) return false;

    const end = value.to || hoverDate;
    if (!end) return false;

    const start = value.from.getTime() < end.getTime() ? value.from : end;
    const finish = value.from.getTime() < end.getTime() ? end : value.from;

    return isDateInRange(day, start, finish);
  };

  const isRangeStart = (day: Date): boolean => {
    if (!value.from) return false;
    if (value.to) {
      return isSameDay(day, value.from.getTime() < value.to.getTime() ? value.from : value.to);
    }
    return isSameDay(day, value.from);
  };

  const isRangeEnd = (day: Date): boolean => {
    if (!value.from) return false;
    if (value.to) {
      return isSameDay(day, value.from.getTime() < value.to.getTime() ? value.to : value.from);
    }
    if (hoverDate) {
      return isSameDay(day, hoverDate);
    }
    return false;
  };

  const formatDisplayValue = (): string => {
    if (value.from && value.to) {
      return `${formatDate(value.from)} - ${formatDate(value.to)}`;
    } else if (value.from) {
      return formatDate(value.from);
    }
    return placeholderText;
  };

  const hasValue = value.from && value.to;
  const isCurrentMonth = (day: Date) => day.getMonth() === month;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center text-sm justify-between pl-3 pr-2 py-2.5 rounded-lg border-2 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark shadow-sm transition ${className} hover:border-blue dark:hover:border-transparent ${open && 'border-primary dark:border-primary-dark'} ${triggerClassName}`}
      >
        <span className={hasValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>{formatDisplayValue()}</span>
        <CalendarPlus className="text-gray-400 ml-2" />
      </button>

      {open && (
        <div className="absolute mt-2 w-64 bg-bg-canvas dark:bg-bg-canvas-dark border-2 border-border-element dark:border-border-element-dark rounded-xl shadow-lg p-3 z-[101]">
          <div className="flex items-center justify-between mb-2 text-gray-900 dark:text-gray-100">
            <button onClick={prevMonth} className="hover:bg-gray-100 dark:hover:bg-gray-700 w-8 h-8 rounded-lg transition">
              ◀
            </button>
            <span className="font-semibold">
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} className="hover:bg-gray-100 dark:hover:bg-gray-700 w-8 h-8 rounded-lg transition">
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-gray-500 dark:text-gray-400 text-sm mb-1">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-1">
            {days.map((day, idx) => {
              const isStart = isRangeStart(day);
              const isEnd = isRangeEnd(day);
              const inRange = isInRange(day);
              const inCurrentMonth = isCurrentMonth(day);

              let cellClassName = 'relative';

              if (inRange || isStart || isEnd) {
                cellClassName += ' before:content-[""] before:absolute before:inset-0 before:bg-blue';
                if (isStart && !isEnd) {
                  cellClassName += ' before:rounded-l-full';
                } else if (isEnd && !isStart) {
                  cellClassName += ' before:rounded-r-full';
                } else if (isStart && isEnd) {
                  cellClassName += ' before:rounded-full';
                }
              }

              return (
                <div key={idx} className={cellClassName}>
                  <button
                    onClick={() => handleSelect(day)}
                    onMouseEnter={() => setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`relative z-10 aspect-square w-full rounded-full text-sm flex items-center justify-center transition ${
                      isStart || isEnd || inRange
                        ? 'bg-blue text-white'
                        : inCurrentMonth
                          ? 'hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'text-gray-400 dark:text-gray-500'
                    } `}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
