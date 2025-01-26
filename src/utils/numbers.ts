export const roundToTheNearestMultiple = (value: number, multiple: number) => {
  return Math.round(value / multiple) * multiple;
};

export const formatNumberAroundMagnitude = (value: number): string => {
  if (value >= 10e3 || value <= 1e-3) {
    value.toExponential(2);
  }
  return value.toFixed(2);
};
