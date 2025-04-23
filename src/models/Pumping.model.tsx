import { FeedingMethod } from '@types';

export type Pumping = {
  id: string;
  duration: number;
  leftAmount: number;
  method: FeedingMethod.PUMP;
  notes: string | null;
  rightAmount: number;
  timestamp: string;
}
