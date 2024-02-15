import { adjustNumber } from "../../helpers/numbers";
import { formatTimestampToTime } from "../../helpers/time";
import { Payouts } from "../../model";

const PayoutsGridItem = ({ amount, fee, status, created_at }: Payouts) => {
  return (
    <div className="flex flex-row  *:w-full text-grey py-1 bg-[#00FFAB0D]">
      <div className="min-w-[120px] text-white">
        <p className="pl-[15px]">{formatTimestampToTime(created_at)}</p>
      </div>
      <div className="max-w-[80px] text-white ">
        <p>-</p>
      </div>
      <div className="max-w-[120px]">
        <p>-</p>
      </div>
      <div className="max-w-[130px]">
        <p>-</p>
      </div>
      <div className="max-w-[130px]">
        <p>-</p>
      </div>
      <div className="max-w-[130px]">
        <p>-</p>
      </div>
      <div className="max-w-[110px]">
        <p>-</p>
      </div>
      <div className="max-w-[130px]">
        <p>-</p>
      </div>
      <div className="max-w-[100px] text-white">
        <p>{adjustNumber(amount || 0, 4)}</p>
      </div>
      <div className="max-w-[100px] text-white">
        <p>{adjustNumber(fee || 0, 4)}</p>
      </div>
      <div className="max-w-[80px] text-white">
        <p>{status}</p>
      </div>
    </div>
  );
};

export default PayoutsGridItem;
