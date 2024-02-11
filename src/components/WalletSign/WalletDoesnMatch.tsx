import shortenAddress from "../../helpers/shortenAddress";
import StatusBar from "./StatusBar";

interface Props {
  publicKey: string;
  disconnect: () => void;
}

const WalletDoesnMatch = ({ publicKey, disconnect }: Props) => (
  <div className="text-xs">
    <div className="border border-[#FF425A] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
      <div className="flex items-center font-medium">
        <span className="ml-2 break-all">{shortenAddress(publicKey)}</span>
      </div>
      <button
        onClick={disconnect}
        className="inline-block text-red-500 bg-[#FF425A]/10 py-[10px] px-4 rounded leading-none font-medium"
      >
        Disconnect
      </button>
    </div>
    <StatusBar message="Connected wallet address does not match" />
  </div>
);
export default WalletDoesnMatch;
