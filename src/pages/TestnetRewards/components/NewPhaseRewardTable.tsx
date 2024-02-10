const TABLE_ROWS = [
  {
    name: "Earned testnet credits",
    value: 3000,
    main: false,
  },
  {
    name: "Earned testnet credits",
    value: 3000,
    main: false,
  },
  {
    name: "Earned testnet credits",
    value: 3000,
    main: true,
  },
];

const NewPhaseRewardTable = () => {
  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none">
        adress
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs">
        <div>
          <p className="mb-[8px]">Proving participation rewards</p>
          {TABLE_ROWS.map(({ name, value, main }) => (
            <div className="flex justify-between bottom-line py-[8px]">
              <p className={!main ? "text-default" : ""}>{name}</p>
              <p className={main ? "text-secondary" : ""}>{value}</p>
            </div>
          ))}

          <p className="mt-4 mb-[8px]">Validator phase bonus</p>
          {TABLE_ROWS.map(({ name, value, main }) => (
            <div className="flex justify-between bottom-line py-[8px]">
              <p className={!main ? "text-default" : ""}>{name}</p>
              <p className={main ? "text-secondary" : ""}>{value}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center py-[8px] mt-[8px]">
          <p className="text-base">Total reward</p>
          <p className="gradient-main text-2xl">1213,888889</p>
        </div>
      </div>
    </>
  );
};

export default NewPhaseRewardTable;
