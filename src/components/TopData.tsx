interface EarningsMinersToggleProps {
  isEarnings: boolean;
  setIsEarnings: Function;
}

const activeButtonStyles = "rounded-md px-4 py-2 bg-aleo-cyan-300 text-white";
const inactiveButtonStyles = "px-4 py-2 text-default";

export const EarningsMinersToggle = ({
  isEarnings,
  setIsEarnings,
}: EarningsMinersToggleProps) => {
  return (
    <div className="mt-4 flex text-sm">
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

interface DataContainerProps {
  children: React.ReactNode;
  width?: string;
}

const DataContainer = ({ children, width }: DataContainerProps) => {
  return (
    <div
      className={`flex px-4 py-[10px] rounded-[4px] border border-greyBorder justify-between ${width}`}
    >
      {children}
    </div>
  );
};

interface DataItemProps {
  name: string;
  value: string | number;
}

const DataItem = ({ name, value }: DataItemProps) => {
  return (
    <div className="flex flex-col text-[12px] gap-y-2 font-default font-semibold">
      <p className="text-default">{name}</p>
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
      <DataContainer width="w-[272px]">
        <DataItem name="Earnings" value={earnings} />
        <DataItem name="Payouts" value={payout} />
        <DataItem name="Fees" value={fees} />
      </DataContainer>

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

export const MachinesData = ({ count, estimated, reported }: MachinesDataProps) => {
  return (
    <div className="flex gap-x-[10px] mt-4">
      <DataContainer width="w-[442px]">
        <DataItem name="Count" value={count} />
        <DataItem
          name="Estimated speed, c/s"
          value={`≈${estimated}`}
        />
        <DataItem name="Reported speed, c/s" value={`≈${reported}`} />
      </DataContainer>
    </div>
  );
};


