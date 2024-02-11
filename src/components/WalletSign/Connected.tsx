import shortenAddress from "../../helpers/shortenAddress";
import { WalletSignStatus } from "../../model";
import { IconLogoLeo } from "../icons/IconLogoLeo";

interface Prop {
  sign: () => void;
  signStatus: WalletSignStatus;
  publicKey: string;
  disconnect: () => void;
}

const Connected = ({ sign, signStatus, publicKey, disconnect }: Prop) => (
  <div className="text-xs">
    <div className="border-primary rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
      <div className="flex items-center font-medium">
        <IconLogoLeo />
        <span className="ml-2 break-all">{shortenAddress(publicKey)}</span>
      </div>
      <button
        onClick={disconnect}
        className="inline-block text-red-500 bg-[#FF425A]/10 py-[10px] px-4 rounded leading-none font-medium"
      >
        Disconnect
      </button>
    </div>
    <footer className="mt-4 w-full font-extrabold">
      {signStatus === WalletSignStatus.PENDING ? (
        <button
          className="w-full bg-aleo-cyan/50 rounded h-[50px] text-black font-bold"
          onClick={sign}
        >
          Sign message in your wallet
        </button>
      ) : (
        <button className="w-full btn font-bold" onClick={sign}>
          Sign
        </button>
      )}
    </footer>
  </div>
);

export default Connected;
