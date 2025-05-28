import { FeedingMethod } from '@types';

export enum BottleType {
  BREAST_MILK = 'breast milk',
  COMBINATION = 'breast milk and formula',
  FORMULA = 'formula',
}

export type BottleFeeding = {
  id: string;
  amount: number;
  amountGiven: number | null;
  method: FeedingMethod.BOTTLE;
  notes: string | null;
  timestamp: string;
  type: BottleType;
}
