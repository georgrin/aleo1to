const shortenAddress = (address: string) => {
  const startLength = 13;
  const endLength = 17;

  if (address.length > startLength + endLength) {
    const start = address.slice(0, startLength);
    const end = address.slice(-endLength);
    return `${start}...${end}`;
  }

  return address;
};

export default shortenAddress;
