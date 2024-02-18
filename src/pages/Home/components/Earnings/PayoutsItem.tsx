import { adjustNumber, numberFormat as n } from "../../../../helpers/numbers";
import { formatTimestampToTime } from "../../../../helpers/time";
import { Payouts } from "../../../../model";
import { StatusMap } from "../../hooks/useSearchDateSummary";

const PayoutsGridItem = ({
  amount,
  fee,
  status,
  created_at,
  txid,
}: Payouts) => (
  <div className="grid earnings-grid w-full text-white py-2 px-6 text-xs bg-[#00FFAB]/[0.05]">
    <p className="pl-5">{formatTimestampToTime(created_at)}</p>
    {Array(6)
      .fill("_")
      .map((_, index) => (
        <p key={index}>-</p>
      ))}
    <p className="text-[#00FFAB]">-</p>
    <p>{n(adjustNumber(amount || 0, 6))}</p>
    <p>{n(adjustNumber(fee || 0, 6))}</p>
    <p className={status === "PENDING" ? "text-[#F7A328]" : ""}>
      {StatusMap[status as keyof typeof StatusMap]}
      {(status === "SENT" || status === "DONE") && (
        <a
          target="_blank"
          href={`https://explorer.aleo.org/transaction/${txid}`}
          className="text-grey cursor-pointer"
        >
          &nbsp;(tx)
        </a>
      )}
    </p>
  </div>
);

export default PayoutsGridItem;
