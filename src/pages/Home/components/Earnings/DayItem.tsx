import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { DaySummary, Earnings, Payouts } from "../../../../model";
import EarningsGridItem from "./EarningsItem";
import PayoutsGridItem from "./PayoutsItem";
import { ROWS_ORDER } from "./EarningsGrid";
import { StatusMap, isEarnings } from "../../hooks/useSearchDateSummary";

interface Props {
  date: string;
  items: (Earnings | Payouts)[];
  isVisible: boolean;
  toggleVisibility: (date: string) => void;
  summary: DaySummary;
}

const DayGridItem = ({
  summary,
  items,
  isVisible,
  toggleVisibility,
  date,
}: Props) => (
  <div className="flex flex-col">
    <div className="grid earnings-grid w-full text-white py-2 px-6 text-xs bg-default font-default">
      <div className="flex items-center gap-1">
        {isVisible ? (
          <IoIosArrowUp
            className="text-[#6C7683] cursor-pointer"
            size={14}
            onClick={() => toggleVisibility(date)}
          />
        ) : (
          <IoIosArrowDown
            className="text-[#6C7683] cursor-pointer"
            size={14}
            onClick={() => toggleVisibility(date)}
          />
        )}
        <p>{summary.created_at}</p>
      </div>
      {ROWS_ORDER.map((row) => (
        <p className={row.style} key={row.title}>
          {summary[row.fieldName]}
        </p>
      ))}
      <p
        className={summary.status === StatusMap.PENDING ? "text-[#F7A328]" : ""}
      >
        {summary.status}
      </p>
    </div>
    <div className={`${isVisible ? "h-auto" : "h-0"} overflow-hidden`}>
      {items.map((item, index) => (
        <div key={index}>
          {isEarnings(item) ? (
            <EarningsGridItem {...item} />
          ) : (
            <PayoutsGridItem {...item} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default DayGridItem;
