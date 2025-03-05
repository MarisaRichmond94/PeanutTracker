import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  return format(date, "EEEE, MMMM do 'at' h:mm a", { locale: enUS });
};
