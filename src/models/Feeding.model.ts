export enum FeedingMethod {
  BOTTLE = 'bottle',
  BREAST = 'breast',
}

export enum FeedingSide {
  BOTH = 'both',
  LEFT = 'left',
  N_A = 'N/A',
  RIGHT = 'right',
}

export type Feeding = {
  id: string;
  amount?: number;
  duration?: number;
  side?: FeedingSide;
  method: FeedingMethod;
  notes?: string;
  timestamp: string;
}
