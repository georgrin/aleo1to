type Params = {
  value: number | string;
  separator?: string;
};

export const getNumberWithCommas = ({ value = 0, separator = " " }: Params) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const adjustNumber = (num: number, depth: number): number => {
  if (Number.isInteger(Number(num))) {
    return num;
  } else {
    return Number(Number(num).toFixed(depth));
  }
};
