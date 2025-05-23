export const toCapitalCase = (sentence: string): string =>
  sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
