export const getNumberWithCommas = (value: number | null): string => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "";
};

export const adjustNumber = (num: number, depth: number): number => {
  if (Number.isInteger(Number(num))) {
    return num;
  } else {
    return Number(Number(num).toFixed(depth));
  }
};
