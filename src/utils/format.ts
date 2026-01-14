export const formatNumber = (value: number, decimals = 2): string => {
  if (value >= 10000) {
    return Math.floor(value).toString();
  }
  return value.toFixed(decimals);
};
