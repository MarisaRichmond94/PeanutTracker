export const formatLbsToLbsOz = (weightLbs: number): string => {
  const lbs = Math.floor(weightLbs);
  const oz = (weightLbs - lbs) * 16;
  const roundedOz = Math.round(oz * 10) / 10;
  return `${lbs} pound(s) and ${roundedOz} ounce(s)`;
};

export const calculateOunceDifference = (
  startPounds: number,
  startOunces: number,
  endPounds: number,
  endOunces: number
): number => {
  const startTotalOunces = (startPounds * 16) + startOunces;
  const endTotalOunces = (endPounds * 16) + endOunces;
  const rawDifference = endTotalOunces - startTotalOunces;
  const roundedDifference = Math.ceil(rawDifference * 10) / 10;
  return roundedDifference;
};
