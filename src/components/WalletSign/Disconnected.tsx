import { useEffect } from "react";
import StatusBar from "./StatusBar";

interface Props {
  connectWallet: () => void;
  selectAdapter: () => void;
  disconnectedWalletMsg: string;
}

const DisconnectedWallet = ({
  connectWallet,
  selectAdapter,
  disconnectedWalletMsg,
}: Props) => {
  useEffect(() => {
    selectAdapter();
  }, []);

  return (
    <>
      <div className="text-xs">
        <div className="border-primary rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
          <div className="flex items-center font-medium">
            <span className="text-secondary">Extension detected</span>
            <span>, please connect your wallet</span>
          </div>
          <button
            onClick={connectWallet}
            className="inline-block text-aleo-cyan bg-aleo-cyan/10 py-[10px] px-4 rounded leading-none font-medium"
          >
            {disconnectedWalletMsg}
          </button>
        </div>
        <StatusBar message="Wallet not connected" />
      </div>
    </>
  );
};

export default DisconnectedWallet;
