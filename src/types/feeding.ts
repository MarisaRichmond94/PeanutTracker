import { BottleFeeding, BreastFeeding, Feeding } from '@models';

export enum FeedingMethod {
  BOTTLE = 'bottle',
  BREAST = 'breast',
  FOOD = 'food',
}

export type BaseFeeding = {
  id: string;
  method: FeedingMethod;
  notes: string | null;
  timestamp: string;
};

export type FeedingEntity = (BottleFeeding & BaseFeeding) | (BreastFeeding & BaseFeeding) | (Feeding & BaseFeeding);
