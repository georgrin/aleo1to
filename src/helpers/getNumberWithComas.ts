type Params = {
  value: number | string;
  separator?: string;
};

function getNumberWithCommas({ value = 0, separator = " " }: Params) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export { getNumberWithCommas };
