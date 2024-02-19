import { testnet3Payout } from "../../../api/testnet";
import WalletSign from "../../../components/WalletSign";
import SuccessSign from "../../../components/WalletSign/SuccessSign";
import { IconCheckSmall } from "../../../components/icons/IconCheckSmall";
import { Testnet3, TestnetStatus } from "../../../model/Testnet";

const PROVING_ROWS = [
  {
    name: "Earned testnet credits",
    filedName: "testnet_credits",
    main: false,
  },
  {
    name: "Testnet-to-mainnet conversion rate",
    filedName: "testnet_mainnet_rate",
    main: false,
  },
  {
    name: "Mainnet credits (3000 / 2,5)",
    filedName: "mainnet_credits",
    main: true,
  },
];

const VALIDATOR_BONUS_ROWS = [
  {
    name: "Total testnet credits earned by all users",
    filedName: "total_credits_earned_by_all_users",
    main: false,
  },
  {
    name: "Your share of total credits (3000 / 2700000)",
    filedName: "address_share_of_total_credits",
    main: false,
  },
  {
    name: "10% of validator phase total reward",
    filedName: "validator_phase_bonus_10",
    main: false,
  },
  {
    name: "Your validator phase bonus",
    filedName: "address_validator_phase_bonus",
    main: true,
  },
];

interface Props {
  address: string;
  data: Testnet3;
}

const NewPhaseRewardTable = ({ address, data }: Props) => {
  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none text-xs leading-[15px]">
        {address}
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs flex flex-col flex-1 leading-[15px]">
        <div>
          <p className="mb-[8px]">Proving participation rewards</p>
          {PROVING_ROWS.map(({ name, filedName, main }) => (
            <div
              className="flex justify-between bottom-line mb-[-1px] py-[8px]"
              key={name}
            >
              <p className={!main ? "text-default" : ""}>{name}</p>
              <p className={main ? "text-secondary" : ""}>
                {data[filedName as keyof Testnet3]}
              </p>
            </div>
          ))}

          <p className="mt-4 mb-[8px]">Validator phase bonus</p>
          {VALIDATOR_BONUS_ROWS.map(({ name, filedName, main }) => (
            <div
              className="flex justify-between bottom-line mb-[-1px] py-[8px]"
              key={name}
            >
              <p className={!main ? "text-default" : ""}>{name}</p>
              <p className={main ? "text-secondary" : ""}>
                {data[filedName as keyof Testnet3]}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center py-[8px]">
          <p className="text-base">Total reward</p>
          <p className="gradient-main text-2xl">{data.total_reward}</p>
        </div>
        {data.status === TestnetStatus.READY && (
          <WalletSign
            dataToSign={{
              address: address,
              action: testnet3Payout,
            }}
          />
        )}
        {data.status === TestnetStatus.REQUESTED && (
          <div className="text-xs">
            <div className="border border-primary rounded flex justify-between items-center w-full py-[10px] pr-[6px] px-4">
              <div className="flex items-center justify-center w-full">
                <span className="mr-1">
                  <IconCheckSmall />
                </span>
                <span className="text-default">Requested...</span>
              </div>
            </div>
          </div>
        )}
        {data.status === TestnetStatus.SENT && (
          <SuccessSign publicKey={address} />
        )}
      </div>
    </>
  );
};

export default NewPhaseRewardTable;
