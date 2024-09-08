import { WalletReadyState } from "@demox-labs/aleo-wallet-adapter-base";

import { useWalletSign } from "./hooks/useWalletSign";
import DisconnectedWallet from "./Disconnected";
import NotFound from "./NotFound";
import WalletDoesnMatch from "./WalletDoesnMatch";
import { WalletSignStatus } from "../../model";
import Connected from "./Connected";
import SuccessSign from "./SuccessSign";
import ErrorSign from "./ErrorSign";
import PendingSign from "./PendingSign";
import RequestedSign from "./RequestedSign";

interface Prop {
  dataToSign: {
    address: string;
    type: "testnet3" | "testnet4" | "combined";
    claimText: string;
  };
}

const WalletSign = ({ dataToSign }: Prop) => {
  const {
    sign,
    leoWallet,
    connected,
    connectWallet,
    addressMatch,
    status,
    resetStatus,
    selectAdapter,
    disconnect,
    publicKey,
    disconnectedWalletMsg,
    errorMsg,
    type,
    claimText,
  } = useWalletSign({
    ...dataToSign,
  });

  const Content = () => {
    if (status === WalletSignStatus.SUCCESS) return <RequestedSign />;

    if (status === WalletSignStatus.PENDING) return <PendingSign publicKey={publicKey as string} />;

    if (status === WalletSignStatus.ERROR)
      return <ErrorSign resetStatus={resetStatus} publicKey={publicKey as string} errorMsg={errorMsg} />;

    if (leoWallet && leoWallet.readyState === WalletReadyState.Installed) {
      if (connected) {
        return addressMatch ? (
          <Connected
            claimText={claimText}
            sign={sign}
            signStatus={status}
            publicKey={publicKey as string}
            disconnect={disconnect}
          />
        ) : (
          <WalletDoesnMatch publicKey={publicKey as string} disconnect={disconnect} />
        );
      } else {
        return (
          <DisconnectedWallet
            connectWallet={connectWallet}
            selectAdapter={selectAdapter}
            disconnectedWalletMsg={disconnectedWalletMsg}
          />
        );
      }
    } else {
      return <NotFound />;
    }
  };

  return (
    <div className="w-full mt-auto">
      <div className="w-full p-0 mt-2">
        <Content />
      </div>
    </div>
  );
};

export default WalletSign;
