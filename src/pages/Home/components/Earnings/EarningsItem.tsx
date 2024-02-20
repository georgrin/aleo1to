import { adjustNumber, numberFormat as n } from "../../../../helpers/numbers";
import { formatTimestampToTime } from "../../../../helpers/time";
import { Earnings } from "../../../../model";

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
    <p>{n(pool_shares) || "-"}</p>
    <p>{n(address_shares) || "-"}</p>
    <p>{n(hashrate_estimated) || "-"}</p>
    <p>{n(adjustNumber(pool_earnings || 0, 6))}</p>
    <p>{adjustNumber(Number(pool_fee * 100), 0)} % </p>
    <p className="text-[#00FFAB]">
      {n(adjustNumber(address_earnings || 0, 6))}
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
