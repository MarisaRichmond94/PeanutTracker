export enum SleepLocation {
  BASSINET = 'bassinet',
  CAR_SEAT = 'car seat',
  CONTACT_NAP = 'contact nap',
  CRIB = 'crib',
  STROLLER = 'stroller',
}

export enum SleepType {
  NAP = 'nap',
  NIGHT = 'night',
}

export type Sleep = {
  id: string;
  duration: number; // in minutes
  endTime: string;
  location: SleepLocation;
  notes: string | null;
  startTime: string;
  type: SleepType;
}
