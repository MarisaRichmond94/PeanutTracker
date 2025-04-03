export enum WasteColor {
  BLACK = 'black',
  BROWN = 'brown',
  GREEN = 'green',
  NOT_APPLICABLE = 'N/A',
  YELLOW = 'yellow',
}

export enum WasteConsistency {
  MUCOUSY = 'mucosy',
  NOT_APPLICABLE = 'N/A',
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
  color: WasteColor;
  consistency: WasteConsistency;
  notes: string | null;
  type: WasteType;
  timestamp: string;
}
