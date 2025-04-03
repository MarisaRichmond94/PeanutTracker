export const formatLbsToLbsOz = (weightLbs: number): string => {
  const lbs = Math.floor(weightLbs);
  const oz = (weightLbs - lbs) * 16;
  const roundedOz = Math.round(oz * 10) / 10;
  return `${lbs} lbs ${roundedOz} oz`;
};
