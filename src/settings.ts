import settingsData from './settings.json';
import defaultAvatar from '@/assets/images/person-girl.png';

export const settings = {
  checkPermission: false,
  version: settingsData.version,
  defaultAvatar,
  dateFormat: 'DD/MM/YYYY',
  fullDateFormat: 'HH:mm, DD/MM/YYYY',
  isDev: import.meta.env.VITE_IS_DEV == 'true',
  isProd: import.meta.env.VITE_IS_PRODUCTION == 'true'
};
