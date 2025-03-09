export enum NotePriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export type Note = {
  id: string;
  priority: NotePriority;
  timestamp: string;
  value: string;
}
