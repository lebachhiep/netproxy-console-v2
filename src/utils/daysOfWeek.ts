import dayjs from 'dayjs';

export const daysOfWeek = [
  { value: 'MONDAY', label: 'Thứ Hai' },
  { value: 'TUESDAY', label: 'Thứ Ba' },
  { value: 'WEDNESDAY', label: 'Thứ Tư' },
  { value: 'THURSDAY', label: 'Thứ Năm' },
  { value: 'FRIDAY', label: 'Thứ Sáu' },
  { value: 'SATURDAY', label: 'Thứ Bảy' },
  { value: 'SUNDAY', label: 'Chủ Nhật' }
];

export const generateTimeSlots = () => {
  const chooseTimeNotify = [];
  const startTime = dayjs('00:00', 'HH:mm');
  const endTime = dayjs('23:55', 'HH:mm');

  while (startTime <= endTime) {
    chooseTimeNotify.push(startTime.format('HH:mm'));
    startTime.add(5, 'minutes');
  }

  return chooseTimeNotify;
};
