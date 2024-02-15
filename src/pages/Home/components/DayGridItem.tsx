import { IoIosArrowDown } from "react-icons/io";
import { DaySummary, Earnings, Payouts } from "../../../model";
import EarningsGridItem from "./EarningsGridItem";
import PayoutsGridItem from "./PayoutsGridItem";
import { ROWS_ORDER, isEarnings } from "./EarningsGrid";

interface Props {
  date: string;
  items: (Earnings | Payouts)[];
  isVisible: boolean;
  summary: DaySummary;
}

const DayGridItem = ({ summary, items, isVisible }: Props) => (
  <div className="flex flex-col">
    <div className="grid earnings-grid w-full text-white py-2 px-6 text-xs bg-default font-default">
      <div className="flex items-center gap-1">
        <IoIosArrowDown className="text-[#6C7683]" />
        <p>{summary.created_at}</p>
      </div>
      {ROWS_ORDER.map((row) => (
        <p className={row.style} key={row.title}>
          {summary[row.fieldName]}
        </p>
      ))}
      <p>{summary.status}</p>
    </div>
    <div className={`${isVisible ? "h-full" : "h-0"} overflow-hidden`}>
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
