interface EarningsMinersToggleProps {
  isEarnings: boolean;
  setIsEarnings: Function;
}

const activeButtonStyles = "rounded-md px-4 py-2 bg-[#0085FF] text-white";
const inactiveButtonStyles = "px-4 py-2 text-grey";

export const EarningsMinersToggle = ({
  isEarnings,
  setIsEarnings,
}: EarningsMinersToggleProps) => {
  return (
    <div className="mt-4 flex text-sm ">
      <button
        onClick={() => setIsEarnings(true)}
        className={isEarnings ? activeButtonStyles : inactiveButtonStyles}
      >
        Earnings & Payouts
      </button>

      <button
        onClick={() => setIsEarnings(false)}
        className={!isEarnings ? activeButtonStyles : inactiveButtonStyles}
      >
        Machines
      </button>
    </div>
  );
};

const DataContainer = ({ children }: { children: JSX.Element }) => (
  <div className="flex px-4 py-3 rounded-[4px] border-primary justify-between gap-x-14">
    {children}
  </div>
);

interface DataItemProps {
  name: string;
  value: string | number;
}

const DataItem = ({ name, value }: DataItemProps) => {
  return (
    <div className="flex flex-col text-xs font-default">
      <p className="text-grey">{name}</p>
      <p className="text-white">{value}</p>
    </div>
  );
};

interface EarningsDataProps {
  earnings: number;
  payout: number;
  fees: number;
  balance: number;
  autoPayout: number;
}

export const EarningsData = ({
  earnings,
  payout,
  fees,
  balance,
  autoPayout,
}: EarningsDataProps) => {
  return (
    <div className="flex gap-x-[10px] mt-4">
      <div className="relative">
        <p className="text-xs text-grey px-1 absolute top-[-8px] left-[13px] bg-surface">
          Alltime
        </p>
        <DataContainer>
          <>
            <DataItem name="Earnings" value={earnings} />
            <DataItem name="Payouts" value={payout} />
            <DataItem name="Fees" value={fees} />
          </>
        </DataContainer>
      </div>

      <DataContainer>
        <DataItem name="Balance" value={balance} />
      </DataContainer>

      <DataContainer>
        <DataItem name="Auto Payout" value={autoPayout} />
      </DataContainer>
    </div>
  );
};

interface MachinesDataProps {
  count: number;
  estimated: number;
  reported: number;
}

export const MachinesData = ({
  count,
  estimated,
  reported,
}: MachinesDataProps) => {
  return (
    <div className="flex gap-x-[10px] mt-4">
      <DataContainer>
        <>
          <DataItem name="Count" value={count} />
          <DataItem name="Estimated speed, c/s" value={`≈${estimated}`} />
          <DataItem name="Reported speed, c/s" value={`≈${reported}`} />
        </>
      </DataContainer>
    </div>
  );
};
