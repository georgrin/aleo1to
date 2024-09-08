interface EarningsMinersToggleProps {
  isEarnings: boolean;
  setIsEarnings: Function;
}

export const EarningsMinersToggle = ({ isEarnings, setIsEarnings }: EarningsMinersToggleProps) => {
  const activeButtonStyles = "rounded-md px-4 py-2 bg-[#0085FF] text-white";
  const inactiveButtonStyles = "px-4 py-2 text-grey bg-white/[0.1] rounded-md";

  return (
    <div className="mt-4 flex text-sm gap-2">
      <button onClick={() => setIsEarnings(true)} className={isEarnings ? activeButtonStyles : inactiveButtonStyles}>
        Earnings & Payouts
      </button>

      <button onClick={() => setIsEarnings(false)} className={!isEarnings ? activeButtonStyles : inactiveButtonStyles}>
        Machines
      </button>
    </div>
  );
};

const DataContainer = ({ children }: { children: JSX.Element }) => (
  <div className="flex px-4 py-3 rounded-[4px] border-primary justify-start md:gap-x-14 gap-x-10 gap-y-4 flex-wrap sm:justify-between">
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
  autoPayout: string;
  // incentivize: number;
}

export const EarningsData = ({ earnings, payout, fees, balance, autoPayout }: EarningsDataProps) => {
  return (
    <div className="flex gap-[10px] mt-4 flex-wrap">
      <div className="relative">
        <p className="text-xs text-grey px-1 absolute top-[-8px] left-[13px] bg-surface">Alltime</p>
        <DataContainer>
          <>
            <DataItem name="Earnings" value={earnings} />
            {/* <DataItem name="Incentivized" value={incentivize} /> */}
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
  estimated: string;
  reported: string;
}

export const MachinesData = ({ count, estimated, reported }: MachinesDataProps) => {
  return (
    <div className="flex gap-x-[10px] mt-4 flex-wrap">
      <DataContainer>
        <>
          <DataItem name="Count" value={count} />
          <DataItem name="Estimated speed, c/s" value={estimated} />
          <DataItem name="Reported speed, c/s" value={reported} />
        </>
      </DataContainer>
    </div>
  );
};
