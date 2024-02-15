import { adjustNumber, getNumberWithCommas } from "../../../helpers/numbers";
import { formatTimestampToTime } from "../../../helpers/time";
import { Earnings } from "../../../model";

const EarningsGridItem = ({
  epoch_number,
  pool_earnings,
  pool_shares,
  address_earnings,
  address_shares,
  hashrate_estimated,
  pool_fee,
  created_at,
}: Earnings) => (
  <div className="grid earnings-grid w-full text-white/[0.6] py-2 px-6 text-xs bg-surface">
    <p className="pl-5 text-white">{formatTimestampToTime(created_at)}</p>
    <p className="text-white">{epoch_number || "-"}</p>
    <p>{getNumberWithCommas(pool_shares) || "-"}</p>
    <p>{getNumberWithCommas(address_shares) || "-"}</p>
    <p>{getNumberWithCommas(hashrate_estimated) || "-"}</p>
    <p>{getNumberWithCommas(adjustNumber(pool_earnings || 0, 2))}</p>
    <p>{adjustNumber(pool_fee, 2)} % </p>
    <p className="text-[#00FFAB]">
      {getNumberWithCommas(adjustNumber(address_earnings || 0, 2))}
    </p>
    {Array(3)
      .fill("_")
      .map((_, index) => (
        <p className="text-white" key={index}>
          -
        </p>
      ))}
  </div>
);

export default EarningsGridItem;
