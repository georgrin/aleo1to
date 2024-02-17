export const numberFormat = (value: number | null): string => {
  const formattedValue =
    value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "";

  // Remove spaces after the decimal point
  return formattedValue.replace(/(\.\d*)\s/g, "$1");
};

export const adjustNumber = (num: number, depth: number): number => {
  if (Number.isInteger(Number(num))) {
    return num;
  } else {
    return Number(Number(num).toFixed(depth));
  }
};
