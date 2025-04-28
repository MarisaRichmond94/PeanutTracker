import { BottleFeeding, BreastFeeding, Changing, Pumping, WasteType } from '@models';
import { calculateOunceDifference } from '@utils';

import { DailyBottleFeedingState, DailyBreastFeedingState, DailyChangingState, DailyPumpingState } from '../types';

export const calculateDailyBreastFeedingState = (dailyLogs: BreastFeeding[]): DailyBreastFeedingState => {
  let duration = 0;
  let ounces = 0;
  dailyLogs.forEach((log) => {
    const { duration: logDuration, endPounds, endOunces, startPounds, startOunces } = log;
    duration += logDuration;
    const showWeightChange = [startPounds, startOunces, endPounds, endOunces].every((value) => value != null);
    if (showWeightChange) {
      ounces += calculateOunceDifference(startPounds!, startOunces!, endPounds!, endOunces!);
    }
  });

  return {
    total: dailyLogs.length,
    duration,
    ounces,
  };
};

export const calculateDailyBottleFeedingState = (dailyLogs: BottleFeeding[]): DailyBottleFeedingState => {
  let ounces = 0;
  dailyLogs.forEach((log) => {
    const { amount } = log;
    ounces += amount;
  });

  return {
    total: dailyLogs.length,
    ounces,
  };
};

export const calculateDailyChangingState = (dailyLogs: Changing[]): DailyChangingState => {
  let dirty = 0;
  let total = 0;
  let wet = 0;

  dailyLogs.forEach((log) => {
    const { type } = log;
    total += 1;
    if (type === WasteType.BOTH || type === WasteType.DIRTY) {
      dirty += 1;
    }
    if (type === WasteType.BOTH || type === WasteType.WET) {
      wet += 1;
    }
  });

  return { dirty, total, wet };
};

export const calculateDailyPumpingState = (dailyLogs: Pumping[]): DailyPumpingState => {
  let ounces = 0;
  let time = 0;

  dailyLogs.forEach((log) => {
    const { duration, leftAmount, rightAmount } = log;
    ounces += (leftAmount + rightAmount);
    time += duration;
  });

  return {
    ounces: Math.ceil(ounces * 10) / 10,
    time,
    total: dailyLogs.length,
  };
};
