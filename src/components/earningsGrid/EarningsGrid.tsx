import { useState } from "react";
import DayGridItem from "./DayGridItem";
import useSearchResults from "../../pages/Home/hooks/useSearchResults";
import { Earnings, Payouts } from "../../model";
import { useSearchDateSummary } from "../../pages/Home/hooks/useSearchDateSummary";

export type DayData = (Earnings | Payouts)[];

export const isEarnings = (item: Earnings | Payouts): item is Earnings =>
  "epoch_number" in item;

export interface VisibilityState {
  [date: string]: boolean;
}

interface Props {
  earnings: Array<Earnings>;
  payouts: Array<Payouts>;
}

const EarningsGrid = ({ earnings, payouts }: Props) => {
  const { sortedCombinedData } = useSearchResults({ earnings, payouts });
  const dates = Object.keys(sortedCombinedData);

  const initialVisibility: VisibilityState = dates.reduce<VisibilityState>(
    (acc, date, index) => {
      acc[date] = index === 0;
      return acc;
    },
    {}
  );

  const [visibility, setVisibility] =
    useState<VisibilityState>(initialVisibility);

  const toggleVisibility = (date: string) => {
    setVisibility((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const handleExpand = () => {
    setVisibility(dates.reduce((acc, date) => ({ ...acc, [date]: true }), {}));
  };

  const handleCollapse = () => {
    setVisibility(dates.reduce((acc, date) => ({ ...acc, [date]: false }), {}));
  };

  return (
    <div className="container">
      <div className="flex justify-between py-[6px]">
        <p className="ml-[120px]">Earnings</p>
        <p className="mr-[230px]">Payouts</p>
      </div>
      <div className="flex flex-row  *:w-full top-line bottom-line border-[rgba(255,255,255,0.15)] text-default pt-1">
        <div className="min-w-[120px] ">
          <p>Timestamp</p>
        </div>
        <div className="max-w-[80px]">
          <p>Epoch</p>
        </div>
        <div className="max-w-[120px]">
          <p>Total shares</p>
        </div>
        <div className="max-w-[130px]">
          <p>Address shares</p>
        </div>
        <div className="max-w-[130px]">
          <p>Average speed</p>
        </div>
        <div className="max-w-[130px]">
          <p>Pool reward</p>
        </div>
        <div className="max-w-[110px]">
          <p>Pool fee</p>
        </div>
        <div className="max-w-[130px]">
          <p>Address reward</p>
        </div>
        <div className="max-w-[100px]">
          <p>Amount</p>
        </div>
        <div className="max-w-[100px]">
          <p>Fee</p>
        </div>
        <div className="max-w-[80px]">
          <p>Status</p>
        </div>
      </div>
      {dates.map((date) => {
        const { summary } = useSearchDateSummary(sortedCombinedData[date]);
        return (
          <div
            key={date}
            onClick={() => toggleVisibility(date)}
            className="cursor-pointer"
          >
            <DayGridItem
              date={date}
              items={sortedCombinedData[date]}
              isVisible={visibility[date]}
              summary={summary}
            />
          </div>
        );
      })}
      <div className="flex justify-start top-line items-center py-[3px] text-default">
        <p onClick={handleExpand} className="mr-4 cursor-pointer">
          Expand All
        </p>
        <p onClick={handleCollapse} className="cursor-pointer">
          Collapse All
        </p>
      </div>
    </div>
  );
};

export default EarningsGrid;
