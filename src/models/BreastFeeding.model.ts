import { FeedingMethod } from '@types';

export enum FeedingSide {
  BOTH = 'both',
  LEFT = 'left',
  RIGHT = 'right',
}

export type BreastFeeding = {
  id: string;
  duration: number;
  endPounds: number | null;
  endOunces: number | null;
  method: FeedingMethod.BREAST;
  notes: string | null;
  side: FeedingSide;
  startPounds: number | null;
  startOunces: number | null;
  timestamp: string;
}
