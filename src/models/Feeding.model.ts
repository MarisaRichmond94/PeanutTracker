import { FeedingMethod } from '@types';

export type Feeding = {
  id: string;
  food: string;
  method: FeedingMethod.FOOD;
  notes: string | null;
  reaction: string;
  timestamp: string;
}
