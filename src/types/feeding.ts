import { BottleFeeding, BreastFeeding, Feeding, Pumping } from '@models';

export enum FeedingMethod {
  BOTTLE = 'bottle',
  BREAST = 'breast',
  FOOD = 'food',
  PUMP = 'pump',
}

export type BaseFeeding = {
  id: string;
  method: FeedingMethod;
  notes: string | null;
  timestamp: string;
};

export type FeedingEntity = (BottleFeeding & BaseFeeding) | (BreastFeeding & BaseFeeding) | (Feeding & BaseFeeding) | (Pumping & BaseFeeding);
