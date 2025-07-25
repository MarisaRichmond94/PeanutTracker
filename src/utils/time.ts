export const formatMinutesToHoursAndMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursPart = hours > 0 ? `${hours} hour${hours !== 1 ? '(s)' : ''}` : '';
  const minutesPart = minutes > 0 ? `${Math.round((minutes * 100) / 100)} minute(s)` : '';

  if (hoursPart && minutesPart) {
    return `${hoursPart} and ${minutesPart}`;
  }

  return hoursPart || minutesPart || '0 minute(s)';
};

export const getDaysSince = (isoTimestamp: string): number => {
  const then = new Date(isoTimestamp);
  const now = new Date();

  const diffMs = now.getTime() - then.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

