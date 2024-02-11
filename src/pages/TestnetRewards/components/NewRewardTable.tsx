import WalletSign from "../../../components/WalletSign";

const PROVING_ROWS = [
  {
    name: "Earned testnet credits",
    value: 3000,
    main: false,
  },
  {
    name: "Testnet-to-mainnet conversion rate",
    value: 3000,
    main: false,
  },
  {
    name: "Mainnet credits (3000 / 2,5)",
    value: 3000,
    main: true,
  },
];

const VALIDATOR_BONUS_ROWS = [
  {
    name: "Total testnet credits earned by all users",
    value: 3000,
    main: false,
  },
  {
    name: "Your share of total credits (3000 / 2700000)",
    value: 3000,
    main: false,
  },
  {
    name: "10% of validator phase total reward",
    value: 3000,
    main: false,
  },
  {
    name: "Your validator phase bonus",
    value: 3000,
    main: true,
  },
];

interface Props {
  address: string;
}

const NewPhaseRewardTable = ({ address }: Props) => {
  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none">
        {address}
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs flex flex-col flex-1">
        <div>
          <p className="mb-[8px]">Proving participation rewards</p>
          {PROVING_ROWS.map(({ name, value, main }) => (
            <div className="flex justify-between bottom-line py-[8px]">
              <p className={!main ? "text-default" : ""}>{name}</p>
              <p className={main ? "text-secondary" : ""}>{value}</p>
            </div>
          ))}

          <p className="mt-4 mb-[8px]">Validator phase bonus</p>
          {VALIDATOR_BONUS_ROWS.map(({ name, value, main }) => (
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
        <WalletSign
          dataToSign={{
            address: address,
            action: async () => {},
          }}
        />
      </div>
    </>
  );
};

export default NewPhaseRewardTable;
