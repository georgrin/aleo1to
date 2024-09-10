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
    testnet3: null | number;
    testnet4: null | number;
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
    claimText,
  } = useWalletSign({
    ...dataToSign,
  });

  const Content = () => {
    if (status === WalletSignStatus.SUCCESS) {
      if (dataToSign.testnet3 !== null && dataToSign.testnet4 !== null) {
        return (
          <div className="flex flex-col gap-2 md:flex-row">
            <RequestedSign text="Testnet 3 requested" />
            <RequestedSign text="Testnet 4 requested" />
          </div>
        );
      } else {
        return <RequestedSign />;
      }
    }

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
