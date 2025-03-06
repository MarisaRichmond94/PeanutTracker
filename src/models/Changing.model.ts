export enum WasteColor {
  BLACK = 'black',
  BROWN = 'brown',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export enum WasteConsistency {
  MUCOUSY = 'mucosy',
  RUNNY = 'runny',
  SEEDY = 'seedy',
  SOLID = 'solid',
}

export enum WasteType {
  BOTH = 'both',
  DIRTY = 'dirty',
  WET = 'wet',
}

export type Changing = {
  id: string;
  color?: WasteColor;
  consistency?: WasteConsistency;
  notes?: string;
  type: WasteType;
  timestamp: string;
}
