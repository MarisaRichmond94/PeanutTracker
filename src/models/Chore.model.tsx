export enum RepeatType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export type Chore = {
  id: string;
  description: string | null;
  lastCompletedAt: string | null;
  lastCompletedBy: string | number | null;
  name: string;
  repeatType: RepeatType;
}
