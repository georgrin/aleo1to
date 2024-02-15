import { IoIosArrowDown } from "react-icons/io";
import { DaySummary, Earnings, Payouts } from "../../model";
import EarningsGridItem from "./EarningsGridItem";
import PayoutsGridItem from "./PayoutsGridItem";
import { isEarnings } from "./EarningsGrid";

interface Props {
  date: string;
  items: (Earnings | Payouts)[];
  isVisible: boolean;
  summary: DaySummary;
}

const DayGridItem = ({ summary, items, isVisible }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row  *:w-full text-white pt-1">
        <div className="min-w-[120px] flex items-center gap-x-1">
          <IoIosArrowDown className="text-[#6C7683]" />
          <p>{summary.timestamp}</p>
        </div>
        <div className="max-w-[80px]">
          <p>{summary.epoch_number}</p>
        </div>
        <div className="max-w-[120px]">
          <p>{summary.pool_shares}</p>
        </div>
        <div className="max-w-[130px]">
          <p>{summary.address_shares}</p>
        </div>
        <div className="max-w-[130px]">
          <p>≈{summary.hashrate_estimated}</p>
        </div>
        <div className="max-w-[130px]">
          <p>{summary.pool_earnings}</p>
        </div>
        <div className="max-w-[110px]">
          <p>≈{summary.pool_fee}%</p>
        </div>
        <div className="max-w-[130px] text-primaryGreen">
          <p>{summary.address_earnings}</p>
        </div>
        <div className="max-w-[100px]">
          <p>{summary.amount}</p>
        </div>
        <div className="max-w-[100px]">
          <p>{summary.fee}</p>
        </div>
        <div className="max-w-[80px]">
          <p>{summary.status}</p>
        </div>
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
};

export default DayGridItem;
