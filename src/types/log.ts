import { Changing, Feeding, Growth, Sleep } from '@models';

export type BaseLog = {
  id: string;
  timestamp: string;
  time: string;
  logType: LogType;
};

export enum LogType {
  CHANGING = 'changing',
  FEEDING = 'feeding',
  GROWTH = 'growth',
  SLEEP = 'sleep',
}

export type LogEntry = (Changing & BaseLog) | (Feeding & BaseLog) | (Growth & BaseLog) | (Sleep & BaseLog);
