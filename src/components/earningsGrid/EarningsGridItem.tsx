import { adjustNumber } from "../../helpers/numbers";
import { formatTimestampToTime } from "../../helpers/time";
import { Earnings } from "../../model";

const EarningsGridItem = ({
  epoch_number,
  pool_earnings,
  pool_shares,
  address_earnings,
  address_shares,
  hashrate_estimated,
  pool_fee,
  created_at,
}: Earnings) => {
  return (
    <div className="flex flex-row  *:w-full text-grey py-1">
      <div className="min-w-[120px] text-white ">
        <p className="pl-[15px]">{formatTimestampToTime(created_at)}</p>
      </div>
      <div className="max-w-[80px] text-white">
        <p>{epoch_number || "-"}</p>
      </div>
      <div className="max-w-[120px] ">
        <p>{pool_shares || "-"}</p>
      </div>
      <div className="max-w-[130px] ">
        <p>{address_shares || "-"}</p>
      </div>
      <div className="max-w-[130px] ">
        <p>{hashrate_estimated || "-"}</p>
      </div>
      <div className="max-w-[130px] ">
        <p>{adjustNumber(pool_earnings || 0, 4)}</p>
      </div>
      <div className="max-w-[110px] ">
        <p>{pool_fee}</p>
      </div>
      <div className="max-w-[130px] text-[#00FFAB]">
        <p>{adjustNumber(address_earnings || 0, 4)}</p>
      </div>
      <div className="max-w-[100px]">
        <p>-</p>
      </div>
      <div className="max-w-[100px]">
        <p>-</p>
      </div>
      <div className="max-w-[80px]">
        <p>-</p>
      </div>
    </div>
  );
};

export default EarningsGridItem;
