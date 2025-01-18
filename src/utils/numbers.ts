export const roundToTheNearestMultiple = (value: number, multiple: number) => {
  return Math.round(value / multiple) * multiple;
};
