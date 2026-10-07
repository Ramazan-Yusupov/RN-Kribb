export const formatPrice = (value: number): string => {
  return `$${value.toLocaleString("en-US")}`;
};
