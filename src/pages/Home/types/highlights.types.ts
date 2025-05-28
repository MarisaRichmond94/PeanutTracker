export type Change = {
  difference: number; // absolute value of change (positive number)
  type: 'Gained' | 'Lost' | 'N/A';
};

export type DailyBreastFeedingState = {
  total: number;
  duration: number;
  ounces: number;
}

export type DailyBottleFeedingState = {
  total: number;
  ouncesConsumed: number;
  ouncesGiven: number;
  ouncesBreastMilkConsumed: number;
  ouncesBreastMilkGiven: number;
  ouncesFormulaConsumed: number;
  ouncesFormulaGiven: number;
}

export type DailyChangingState = {
  dirty: number;
  total: number;
  wet: number;
}

export type DailyPumpingState = {
  ounces: number;
  time: number;
  total: number;
}

export type DailySleepState = {
  babySleepDuration: number;
  dadSleepDuration: number;
  momSleepDuration: number;
}
