import { BottleType } from './BottleFeeding.model';
import { WasteColor, WasteConsistency } from './Changing.model'
import { SleepLocation } from './Sleep.model';

export type DefaultSettings = {
  pumpTimeInMinutes: number;
  sleepLocation: SleepLocation;
  supplementInOunces: number;
  supplementType: BottleType;
  wasteColor: WasteColor;
  wasteConsistency: WasteConsistency;
}
