import shortenAddress from "../../helpers/shortenAddress";
import { IconCheckSmall } from "../icons/IconCheckSmall";

const SuccessSign = ({ txid, text }: { txid: string; text?: string }) => (
  <div className="text-xs w-full">
    <div className="border border-primary rounded flex justify-between items-center w-full py-[10px] pr-[6px] px-4">
      <div className="flex items-center justify-center w-full">
        <span className="mr-1">
          <IconCheckSmall />
        </span>
        <span className="text-default">{text || "Sent"}:&nbsp;</span>
        <a className="underline" href={`https://explorer.aleo.org/transaction/${txid}`}>
          {shortenAddress(txid)}
        </a>
      </div>
    </div>
  </div>
);
export default SuccessSign;
