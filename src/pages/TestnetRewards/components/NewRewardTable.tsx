import { useEffect, useState } from "react";
import WalletSign from "../../../components/WalletSign";
import RequestedSign from "../../../components/WalletSign/RequestedSign";
import SuccessSign from "../../../components/WalletSign/SuccessSign";
import { Testnet3, Testnet4, TestnetCombined, TestnetStatus } from "../../../model/Testnet";
import { IoChevronDownSharp } from "react-icons/io5";

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
  data: TestnetCombined;
}

const RewardRow = ({ text, data, main }: { text: string; data: string | number; main: boolean }) => (
  <div className="flex justify-between bottom-line mb-[-1px] py-[8px]">
    <div className={!main ? "text-default" : ""}>{text}</div>
    <div className={main ? "text-secondary" : ""}>{data}</div>
  </div>
);

const NewPhaseRewardTable = ({ address, data }: Props) => {
  const { testnet3, testnet4 } = data;
  const columnsAvailable = (!!testnet3 ? 2 : 0) + (testnet4 ? 1 : 0);
  const [openedIndex, setOpenedIndex] = useState<Array<number>>(!testnet4 ? [0, 1] : [2]);
  const [type, setType] = useState<"testnet3" | "testnet4" | "combined">();
  const [claimText, setClaimText] = useState<string>("Claim");

  const changeOpenedDropdown = (index: number) => {
    if (columnsAvailable < 3) return;

    const newArr = openedIndex.includes(index)
      ? openedIndex.filter((oIndex) => oIndex !== index)
      : openedIndex.length < 2
      ? [...openedIndex, index]
      : [index];

    setOpenedIndex(newArr);
  };

  useEffect(() => {
    if (testnet3?.status === TestnetStatus.READY && testnet4?.status === TestnetStatus.READY) {
      setType("combined");
      setClaimText("Claim for testnet 3");
    } else if (testnet3?.status === TestnetStatus.READY) {
      setType("testnet3");
      setClaimText(!testnet4 ? "Claim" : "Claim for testnet 3");
    } else if (testnet4?.status === TestnetStatus.READY) {
      setType("testnet4");
      setClaimText(!testnet3 ? "Claim" : "Claim for testnet 4");
    }
  }, [data]);

  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none text-xs leading-[15px] text-ellipsis overflow-hidden">
        {address}
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs flex flex-col flex-1 leading-[15px]">
        <DropdownItem
          data={
            testnet3 && (
              <div>
                {PROVING_ROWS.map(({ name, filedName, main }) => (
                  <RewardRow key={name} data={testnet3[filedName as keyof Testnet3]} text={name} main={main} />
                ))}
                <RewardRow
                  data={testnet3.mainnet_credits}
                  text={`Mainnet rewards (${testnet3.testnet_credits} / ${testnet3.testnet_mainnet_rate})`}
                  main={true}
                />
              </div>
            )
          }
          title="Testnet 3 Phase 2"
          titleRight={`Mainnet rewards: ${testnet3?.total_reward}`}
          opened={openedIndex.find((index) => index === 0) !== undefined}
          setOpenedIndex={() => changeOpenedDropdown(0)}
          columnsAvailable={columnsAvailable}
        />
        <DropdownItem
          data={
            testnet3 && (
              <div>
                <RewardRow
                  data={testnet3.total_credits_earned_by_all_users}
                  text="Total testnet credits earned by all users"
                  main={false}
                />
                <RewardRow
                  data={testnet3.address_share_of_total_credits}
                  text={`Your share of total credits (${testnet3.testnet_credits} / ${testnet3.total_credits_earned_by_all_users})`}
                  main={false}
                />
                {VALIDATOR_BONUS_ROWS.map(({ name, filedName, main }) => (
                  <RewardRow key={name} data={testnet3[filedName as keyof Testnet3]} text={name} main={main} />
                ))}
              </div>
            )
          }
          title="Validator phase bonus"
          titleRight={`Your validator phase bonus: ${testnet3?.address_validator_phase_bonus}`}
          opened={!!openedIndex.find((index) => index === 1)}
          setOpenedIndex={() => changeOpenedDropdown(1)}
          columnsAvailable={columnsAvailable}
        />
        <DropdownItem
          data={
            testnet4 && (
              <div>
                {PROVING_ROWS.map(({ name, filedName, main }) => (
                  <RewardRow key={name} data={testnet4[filedName as keyof Testnet4]} text={name} main={main} />
                ))}
                <RewardRow
                  data={testnet4.total_reward}
                  text={`Mainnet rewards (${testnet4.testnet_credits} / ${testnet4.testnet_mainnet_rate})`}
                  main={true}
                />
              </div>
            )
          }
          title="Testnet 4"
          titleRight={`Mainnet rewards: ${testnet4?.total_reward}`}
          opened={!!openedIndex.find((index) => index === 2)}
          setOpenedIndex={() => changeOpenedDropdown(2)}
          columnsAvailable={columnsAvailable}
        />
        <div className="flex justify-between items-center py-[8px]">
          <p className="text-base">Total reward</p>
          <p className="gradient-main text-2xl">{(testnet3?.total_reward || 0) + (testnet4?.total_reward || 0)}</p>
        </div>

        {testnet3?.status === TestnetStatus.READY || testnet4?.status === TestnetStatus.READY ? (
          <WalletSign
            dataToSign={{
              address: address,
              type: type!,
              claimText: claimText,
            }}
          />
        ) : (
          <div className="mt-auto">
            {testnet3?.status === TestnetStatus.REQUESTED && (
              <RequestedSign text={testnet4 ? "Testnet 3 requested" : undefined} />
            )}
            {testnet4?.status === TestnetStatus.REQUESTED && (
              <RequestedSign text={testnet3 ? "Testnet 4 requested" : undefined} />
            )}
            {testnet3?.status === TestnetStatus.SENT && (
              <SuccessSign txid={testnet3.txid} text={testnet4 ? "Testnet 3 sent" : undefined} />
            )}
            {testnet4?.status === TestnetStatus.SENT && (
              <SuccessSign txid={testnet4.txid} text={testnet3 ? "Testnet 4 sent" : undefined} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

const DropdownItem = ({
  title,
  titleRight,
  opened,
  setOpenedIndex,
  data,
  columnsAvailable,
}: {
  title: string;
  titleRight: string;
  opened?: boolean;
  setOpenedIndex?: () => void;
  data: JSX.Element | null;
  columnsAvailable: number;
}) => {
  const [isOpen, setIsOpen] = useState(opened);

  useEffect(() => {
    setIsOpen(opened);
  }, [opened]);

  if (data === null) return null;

  return (
    <div className={`group ${columnsAvailable > 2 && "cursor-pointer"} relative  w-full`} onClick={setOpenedIndex}>
      <div className="flex justify-between w-full items-center">
        <p className="mb-[8px]">{title}</p>
        {columnsAvailable > 2 && (
          <div className="flex gap-2">
            <button>
              <IoChevronDownSharp className={`h-[18px] transition-all md:h-[14px] ${isOpen && "rotate-[180deg]"}`} />
            </button>
            <p className="text-secondary">{titleRight}</p>
          </div>
        )}
      </div>
      <div
        className={`transition-[max-height_,_margin] duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px]" : "max-h-[0px]"
        }`}
      >
        <div>{data}</div>
      </div>
    </div>
  );
};

export default NewPhaseRewardTable;
