import { testnet3Payout } from "../../../api/testnet";
import WalletSign from "../../../components/WalletSign";
import RequestedSign from "../../../components/WalletSign/RequestedSign";
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
];

const VALIDATOR_BONUS_ROWS = [
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

const RewardRow = ({
  text,
  data,
  main,
}: {
  text: string;
  data: string | number;
  main: boolean;
}) => (
  <div className="flex justify-between bottom-line mb-[-1px] py-[8px]">
    <p className={!main ? "text-default" : ""}>{text}</p>
    <p className={main ? "text-secondary" : ""}>{data}</p>
  </div>
);

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
            <RewardRow
              key={name}
              data={data[filedName as keyof Testnet3]}
              text={name}
              main={main}
            />
          ))}
          <RewardRow
            data={data.mainnet_credits}
            text={`Mainnet credits (${data.testnet_credits} / ${data.testnet_mainnet_rate})`}
            main={true}
          />
          <p className="mt-4 mb-[8px]">Validator phase bonus</p>
          <RewardRow
            data={data.total_credits_earned_by_all_users}
            text="Total testnet credits earned by all users"
            main={false}
          />
          <RewardRow
            data={data.address_share_of_total_credits}
            text={`Your share of total credits (${data.testnet_credits} / ${data.total_credits_earned_by_all_users})`}
            main={false}
          />
          {VALIDATOR_BONUS_ROWS.map(({ name, filedName, main }) => (
            <RewardRow
              key={name}
              data={data[filedName as keyof Testnet3]}
              text={name}
              main={main}
            />
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
          <div className="mt-auto">
            <RequestedSign />
          </div>
        )}
        {data.status === TestnetStatus.SENT && (
          <div className="mt-auto">
            <SuccessSign publicKey={address} />
          </div>
        )}
      </div>
    </>
  );
};

export default NewPhaseRewardTable;
