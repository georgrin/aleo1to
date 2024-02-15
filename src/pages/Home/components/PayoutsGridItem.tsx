import { adjustNumber } from "../../../helpers/numbers";
import { formatTimestampToTime } from "../../../helpers/time";
import { Payouts } from "../../../model";

const PayoutsGridItem = ({ amount, fee, status, created_at }: Payouts) => (
  <div className="grid earnings-grid w-full text-white py-2 px-6 text-xs bg-[#00FFAB]/[0.05]">
    <p className="pl-5">{formatTimestampToTime(created_at)}</p>
    {Array(6)
      .fill("_")
      .map((_, index) => (
        <p key={index}>-</p>
      ))}
    <p className="text-[#00FFAB]">-</p>
    <p>{adjustNumber(amount || 0, 2)}</p>
    <p>{adjustNumber(fee || 0, 2)}</p>
    <p>{status}</p>
  </div>
);

export default PayoutsGridItem;
