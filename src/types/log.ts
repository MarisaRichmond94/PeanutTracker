import { BottleFeeding, BreastFeeding, Changing, Feeding, Growth, Sleep } from '@models';

export type BaseLog = {
  id: string;
  timestamp: string;
  time: string;
  logType: LogType;
};

export enum LogType {
  BOTTLE_FEEDING = 'bottle feeding',
  BREAST_FEEDING = 'breast feeding',
  CHANGING = 'changing',
  FEEDING = 'feeding',
  GROWTH = 'growth',
  SLEEP = 'sleep',
}

export type LogEntry =
  (BreastFeeding & BaseLog) |
  (BottleFeeding & BaseLog) |
  (Changing & BaseLog) |
  (Feeding & BaseLog) |
  (Growth & BaseLog) |
  (Sleep & BaseLog);
