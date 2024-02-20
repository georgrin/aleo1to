import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DecryptPermission,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletSignStatus } from "../../../model";
import { getChallenge } from "../../../api/testnet";

interface Props {
  address: string;
  action: (address: string, signature: string) => void;
}

export const errorMsgMapping = (code: number) => {
  switch (code) {
    case 401:
      return "Signature is invalid";
    case 404:
      return "Signature is invalid";
    case 409:
      return "Signature is invalid";
    case 500:
      return "Signature is invalid";
    default:
      return "Unexpected error";
  }
};

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
  const [errorMsg, setErrorMsg] = useState("");

  const handleAccountChange = useCallback(
    async ({ publicKey }: { publicKey: string }) => {
      if (publicKey !== leoWallet?.adapter.publicKey) {
        await disconnect();
        connectWallet();
      }
    },
    []
  );

  useEffect(() => {
    // @ts-ignore
    window.leoWallet?.on("accountChange", handleAccountChange);
    return () => {
      // @ts-ignore
      window.leoWallet?.on("accountChange", handleAccountChange);
    };
  }, []);

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

      await action(address, signature);

      setSignStatus(WalletSignStatus.SUCCESS);
    } catch (error: any) {
      setSignStatus(WalletSignStatus.ERROR);
      setErrorMsg(errorMsgMapping(error.request.status));
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
    errorMsg,
    resetStatus: () => setSignStatus(WalletSignStatus.DEFAULT),
  };
};
