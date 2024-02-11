import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { TokenResponse, getChallenge, getToken } from "../../../api/wallet";
import {
  DecryptPermission,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletSignStatus } from "../../../model";

interface Props {
  address: string;
  action: (token: TokenResponse) => void;
}

export const useWalletSign = ({ address, action }: Props) => {
  const {
    publicKey,
    wallet,
    wallets,
    select,
    connecting,
    connected,
    connect,
    disconnect,
  } = useWallet();
  const base58 = useMemo(() => publicKey?.toString(), [publicKey]);
  const leoWallet = wallets.find((item) => item.adapter.name === "Leo Wallet");
  const [signStatus, setSignStatus] = useState(WalletSignStatus.DEFAULT);

  // const handleAccountChange = () => {
  //   console.log("changed");
  // };

  // useEffect(() => {
  //   (leoWallet?.adapter as LeoWalletAdapter).on(
  //     "readyStateChange",
  //     handleAccountChange
  //   );

  //   console.log(leoWallet?.adapter);
  //   // Removes event listener during component teardown
  //   return () => {
  //     (leoWallet?.adapter as LeoWalletAdapter).off(
  //       "readyStateChange",
  //       handleAccountChange
  //     );
  //   };
  // }, [leoWallet]);

  const sign = async () => {
    try {
      const challenge = await getChallenge(address);

      if (!publicKey) throw new WalletNotConnectedError();

      const bytes = new TextEncoder().encode(challenge);

      setSignStatus(WalletSignStatus.PENDING);

      const signatureBytes = await (
        wallet?.adapter as LeoWalletAdapter
      ).signMessage(bytes);

      const signature = new TextDecoder().decode(signatureBytes);
      const requestData = {
        signature: signature,
      };
      const tokenResponse = await getToken(address, requestData);

      await action(tokenResponse);

      setSignStatus(WalletSignStatus.SUCCESS);
    } catch (error) {
      if ((error as Error).message !== "Permission Not Granted")
        setSignStatus(WalletSignStatus.ERROR);
      console.log("sign error", { error: error });
    }
  };

  const connectWallet = () => {
    connect(
      DecryptPermission.NoDecrypt,
      WalletAdapterNetwork.Testnet,
      []
    ).catch((error) => {
      console.log("connectWallet error", { error: error });
    });
  };

  const selectAdapter = () => leoWallet && select(leoWallet.adapter.name);

  const disconnectedWalletMsg = useMemo(() => {
    if (connecting) return "Connecting ...";
    if (connected) return "Connected";
    if (wallet) return "Connect Wallet";
    return "Connect Wallet";
  }, [connecting, connected, wallet]);

  return {
    sign,
    leoWallet,
    connecting,
    connected,
    disconnect,
    connectWallet,
    selectAdapter,
    disconnectedWalletMsg,
    addressMatch: address === base58,
    status: signStatus,
    publicKey,
    resetStatus: () => setSignStatus(WalletSignStatus.DEFAULT),
  };
};
