import { WalletReadyState } from "@demox-labs/aleo-wallet-adapter-base";
import { TokenResponse } from "../../api/wallet";

import { PayoutSuccess } from "../deprecatedWallet/PayoutSuccess";
import { PayoutError } from "../deprecatedWallet/PayoutError";
import { useWalletSign } from "./hooks/useWalletSign";
import DisconnectedWallet from "./Disconnected";
import NotFound from "./NotFound";
import WalletDoesnMatch from "./WalletDoesnMatch";
import { WalletSignStatus } from "../../model";
import Connected from "./Connected";
import Pending from "./PendingSign";
import SuccessSign from "./SuccessSign";
import ErrorSign from "./ErrorSign";
import PendingSign from "./PendingSign";

interface Prop {
  dataToSign: {
    address: string;
    action: (token: TokenResponse) => void;
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
  } = useWalletSign({
    ...dataToSign,
  });

  const Content = () => {
    if (status === WalletSignStatus.SUCCESS)
      return <SuccessSign publicKey={publicKey as string} />;

    if (status === WalletSignStatus.PENDING)
      return <PendingSign publicKey={publicKey as string} />;

    if (status === WalletSignStatus.ERROR)
      return (
        <ErrorSign resetStatus={resetStatus} publicKey={publicKey as string} />
      );

    if (leoWallet && leoWallet.readyState === WalletReadyState.Installed) {
      if (connected) {
        return addressMatch ? (
          <Connected
            sign={sign}
            signStatus={status}
            publicKey={publicKey as string}
            disconnect={disconnect}
          />
        ) : (
          <WalletDoesnMatch
            publicKey={publicKey as string}
            disconnect={disconnect}
          />
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
      {status !== WalletSignStatus.ERROR ? (
        <div className="w-full p-0 mt-2">
          <Content />
        </div>
      ) : (
        <PayoutError handleClick={resetStatus} />
      )}
    </div>
  );
};

export default WalletSign;
