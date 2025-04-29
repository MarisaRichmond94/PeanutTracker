export enum SleepEntity {
  DAD = 'Dad',
  MOM = 'Mom',
  BABY = 'Noah',
}

export enum SleepLocation {
  BASSINET = 'bassinet',
  BED = 'bed',
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
  entity: SleepEntity | null;
  duration: number; // in minutes
  endTime: string;
  location: SleepLocation | null;
  notes: string | null;
  startTime: string;
  type: SleepType | null;
}
