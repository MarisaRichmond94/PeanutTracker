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

export const getTimeOnly = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, 'h:mm a', { locale: enUS });
};

export const subtractMinutes = (timestamp: string | Date, minutes: number): string => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};
