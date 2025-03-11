import { FeedingMethod } from '@types';

export type BottleFeeding = {
  id: string;
  amount: number;
  method: FeedingMethod.BOTTLE;
  notes?: string;
  timestamp: string;
}
