import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, "EEEE, MMMM do 'at' h:mm a", { locale: enUS });
};

export const formatDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, 'EEEE, MMMM do', { locale: enUS });
};

export const formatShortDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, 'MM/dd', { locale: enUS });
};

export const getAge = (birthday: string): string => {
  const birthDate = new Date(birthday);
  const today = new Date();

  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  const monthsDiff = today.getMonth() - birthDate.getMonth();
  const totalMonths = yearsDiff * 12 + monthsDiff;

  if (totalMonths < 24) {
    return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return months === 0
    ? `${years} year${years !== 1 ? 's' : ''}`
    : `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;
};

export const getMaxDayByMonth = (month: number): number => {
  switch (month) {
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return 29;
    default:
      return 31;
  }
};

export const getTimeOnly = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, 'h:mm a', { locale: enUS });
};

export const subtractMinutes = (timestamp: string | Date, minutes: number): string => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};
