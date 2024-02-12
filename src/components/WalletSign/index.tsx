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
      return <PayoutSuccess handleClick={() => close()} />;

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
        <div className="w-full p-0 mt-[70px]">
          <Content />
        </div>
      ) : (
        <PayoutError handleClick={resetStatus} />
      )}
    </div>
  );
};

export default WalletSign;
