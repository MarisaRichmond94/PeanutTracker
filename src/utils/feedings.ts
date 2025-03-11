import { FeedingMethod } from '@types';

export const getTitle = (method: FeedingMethod) => {
  switch (method) {
    case FeedingMethod.BOTTLE:
      return 'Bottle Feeding';
    case FeedingMethod.BREAST:
      return 'Breast Feeding';
    case FeedingMethod.FOOD:
      return 'Feeding';
  }
};
