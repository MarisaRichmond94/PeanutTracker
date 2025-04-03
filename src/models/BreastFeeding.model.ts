import { FeedingMethod } from '@types';

export enum FeedingSide {
  BOTH = 'both',
  LEFT = 'left',
  RIGHT = 'right',
}

export type BreastFeeding = {
  id: string;
  duration: number;
  side: FeedingSide;
  method: FeedingMethod.BREAST;
  notes: string | null;
  timestamp: string;
}
