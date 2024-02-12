import shortenAddress from "../../helpers/shortenAddress";
import { IconLogoLeo } from "../icons/IconLogoLeo";
import StatusBar from "./StatusBar";

const PendingSign = ({ publicKey }: { publicKey: string }) => (
  <div className="text-xs">
    <div className="border border-primary rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
      <div className="flex gap-2 items-center">
        <IconLogoLeo />
        <span>{shortenAddress(publicKey)}</span>
      </div>
    </div>
    <StatusBar message={<span className="loader"></span>} />
  </div>
);
export default PendingSign;
