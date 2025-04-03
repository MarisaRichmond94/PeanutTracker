import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';

export const addMinutes = (timestamp: string | Date, minutes: number): string => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

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
  const birthDate = dayjs(birthday);
  const today = dayjs();

  const diffInDays = today.diff(birthDate, 'day');
  const diffInWeeks = today.diff(birthDate, 'week');
  const diffInMonths = today.diff(birthDate, 'month');
  const diffInYears = today.diff(birthDate, 'year');

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  }

  if (diffInMonths < 1) {
    const overflowDays = diffInDays - (diffInWeeks * 7);
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''}${overflowDays > 0 ? ` and ${overflowDays} day${overflowDays !== 1 ? 's' : ''}` : ''}`;
  }

  if (diffInMonths < 12) {
    const weeks = today.diff(birthDate.add(diffInMonths, 'month'), 'week');
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}${weeks > 0 ? ` and ${weeks} week${weeks !== 1 ? 's' : ''}` : ''}`;
  }

  const remainingMonths = diffInMonths % 12;
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
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
