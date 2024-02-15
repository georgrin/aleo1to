import { useState } from "react";
import DayGridItem from "./DayGridItem";
import useSearchResults from "../hooks/useSearchResults";
import { DaySummary, Earnings, Payouts } from "../../../model";
import { useSearchDateSummary } from "../hooks/useSearchDateSummary";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../../../components/Pagination";

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

export const ROWS_ORDER: Array<{
  fieldName: keyof DaySummary;
  title: string;
  style?: string;
}> = [
  { fieldName: "epoch_number", title: "Epoch" },
  { fieldName: "pool_shares", title: "Total shares" },
  { fieldName: "address_shares", title: "Address shares" },
  { fieldName: "hashrate_estimated", title: "Average speed" },
  { fieldName: "pool_earnings", title: "Pool seward" },
  { fieldName: "pool_fee", title: "Pool fee" },
  {
    fieldName: "address_earnings",
    title: "Address reward",
    style: "text-[#00FFAB]",
  },
  { fieldName: "amount", title: "Amount" },
  { fieldName: "fee", title: "Fee" },
];

const EarningsGrid = ({ earnings, payouts }: Props) => {
  const { sortedCombinedData } = useSearchResults({ earnings, payouts });
  const dates = Object.keys(sortedCombinedData);
  const { pageData, jumpToPage, currentPage, totalPages } = usePagination({
    pageSize: 3,
    data: dates,
  });

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
    <div className="font-default mx-[-24px]">
      <div className="px-6 grid earnings-grid text-xs py-2 top-line mt-[20px]">
        <p></p>
        <p>Earnings</p>
        <p className="col-span-6"></p>
        <p>Payouts</p>
        <p className="col-span-2"></p>
      </div>
      <div className="grid earnings-grid top-line text-grey py-2 px-6 text-xs">
        <p className="">Timestamp</p>
        {ROWS_ORDER.map((row) => (
          <p key={row.title}>{row.title}</p>
        ))}
        <p>Status</p>
      </div>
      {pageData.map((date) => {
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
      <div className="grid grid-cols-3 justify-between top-line text-xs px-6 py-2 text-grey">
        <div className="flex gap-4">
          <p onClick={handleExpand} className="cursor-pointer">
            Expand All
          </p>
          <p onClick={handleCollapse} className="cursor-pointer">
            Collapse All
          </p>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={jumpToPage}
        />
        <p></p>
      </div>
    </div>
  );
};

export default EarningsGrid;
