import dayjs from 'dayjs';

export function formatDate(timestamp: number, format = 'DD/MM/YYYY') {
  return dayjs.unix(timestamp).format(format);
}

export function formatFullDateTime(timestamp: number) {
  return dayjs.unix(timestamp).format('HH:mm:ss, DD/MM/YYYY');
}

export function formatDateDay(timestamp: number) {
  return dayjs.unix(timestamp).format('dddd, MM-DD-YYYY');
}

export function generateTimeSeries(step: number, addHour = 0, format = 'h:mm a') {
  const dt = new Date(1970, 0, 1);
  const rc = [];
  while (dt.getDate() === 1) {
    rc.push(dayjs(dt).add(addHour, 'hour').format(format));
    // rc.push(dt.toLocaleTimeString('en-US'))
    dt.setMinutes(dt.getMinutes() + step);
  }
  return rc;
}

export function generateDuration() {
  let seconds = 300;
  const durations = [];
  while (seconds <= 60 * 60 * 12) {
    const label = secondToMinuteString(seconds);
    durations.push({
      label,
      value: seconds
    });
    seconds += 300;
  }
  return durations;
}

export function secondToMinuteString(second: number) {
  const h = Math.floor(second / 3600);
  const m = (second % 3600) / 60;
  let label = '';
  if (h == 0) {
    label = `${m}m`;
  } else {
    if (m == 0) {
      label = `${h}h`;
    } else {
      label = `${h}h ${m}m`;
    }
  }
  return label;
}

export function handleDateRange(startAt: number, endAt: number) {
  return [dayjs(startAt * 1000), dayjs(endAt * 1000)];
}

export const dateRanges: any = {
  'Hôm nay': [dayjs().startOf('day'), dayjs().endOf('day')],
  'Hôm qua': [dayjs().subtract(1, 'days').startOf('day'), dayjs().subtract(1, 'days').endOf('day')],
  'Tuần này': [dayjs().startOf('week'), dayjs().endOf('week')],
  'Tuần trước': [dayjs().subtract(1, 'weeks').startOf('week'), dayjs().subtract(1, 'weeks').endOf('week')],
  'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
  'Tháng trước': [dayjs().subtract(1, 'months').startOf('month'), dayjs().subtract(1, 'months').endOf('month')]
};

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('HH:mm DD/MM/YYYY');
}
export function tableDashboardDate(time: number, t: any) {
  let d = 0;
  let h = 0;
  let m = 0;
  d = Math.trunc(time / 86400);
  h = Math.trunc((time % 86400) / 3600);
  m = Math.trunc((time % 3600) / 60);
  if (d > 0) return `${d} ${t('day')}`;
  else if (h > 0) return `${d} ${t('hour')}`;
  else if (m > 0) return `${d} ${t('minute')}`;
  else return `${d} ${t('sec')}`;
}
