import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DecryptPermission, WalletAdapterNetwork, WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletSignStatus } from "../../../model";
import { getChallenge, getTestnet4Challenge, testnet3Payout, testnet4Payout } from "../../../api/testnet";

interface Props {
  address: string;
  testnet3: null | number;
  testnet4: null | number;
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

export const useWalletSign = ({ address, testnet3, testnet4 }: Props) => {
  const { publicKey, wallet, wallets, select, connecting, connected, connect, disconnect } = useWallet();
  const base58 = useMemo(() => publicKey?.toString(), [publicKey]);
  const leoWallet = wallets.find((item) => item.adapter.name === "Leo Wallet");
  const [signStatus, setSignStatus] = useState(WalletSignStatus.DEFAULT);
  const [errorMsg, setErrorMsg] = useState("");
  const [claimText, setClaimText] = useState(testnet3 !== null && testnet4 !== null ? "Claim for Testnet 3" : "Claim");

  const handleAccountChange = useCallback(async ({ publicKey }: { publicKey: string }) => {
    if (publicKey !== leoWallet?.adapter.publicKey) {
      await disconnect();
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (testnet3 !== null && testnet4 !== null) {
      if (testnet3 === 0) {
        setClaimText("Claim for Testnet 4");
      } else {
        setClaimText("Claim for Testnet 3");
      }
    } else {
      setClaimText("Claim");
    }
  }, [testnet3, testnet4]);

  useEffect(() => {
    // @ts-ignore
    window.leoWallet?.on("accountChange", handleAccountChange);
    return () => {
      // @ts-ignore
      window.leoWallet?.on("accountChange", handleAccountChange);
    };
  }, []);

  const sign = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    if (testnet3 && !testnet4) {
      try {
        const challenge = await getChallenge(address);
        const bytes = new TextEncoder().encode(challenge);
        setSignStatus(WalletSignStatus.PENDING);
        const signatureBytes = await (wallet?.adapter as LeoWalletAdapter).signMessage(bytes);
        const signature = new TextDecoder().decode(signatureBytes);
        await testnet3Payout(address, signature);
        setSignStatus(WalletSignStatus.SUCCESS);
      } catch (error: any) {
        setSignStatus(WalletSignStatus.ERROR);
        setErrorMsg(errorMsgMapping(error.request.status));
      }
    } else if (testnet4 && !testnet3) {
      try {
        const challenge = await getTestnet4Challenge(address);
        const bytes = new TextEncoder().encode(challenge);
        setSignStatus(WalletSignStatus.PENDING);
        const signatureBytes = await (wallet?.adapter as LeoWalletAdapter).signMessage(bytes);
        const signature = new TextDecoder().decode(signatureBytes);
        await testnet4Payout(address, signature);
        setSignStatus(WalletSignStatus.SUCCESS);
      } catch (error: any) {
        setSignStatus(WalletSignStatus.ERROR);
        setErrorMsg(errorMsgMapping(error.request.status));
      }
    } else {
      try {
        const challengeTestnet3 = await getChallenge(address);
        const bytesTestnet3 = new TextEncoder().encode(challengeTestnet3);
        setSignStatus(WalletSignStatus.PENDING);
        const signatureBytesTestnet3 = await (wallet?.adapter as LeoWalletAdapter).signMessage(bytesTestnet3);
        const signatureTestnet3 = new TextDecoder().decode(signatureBytesTestnet3);
        await testnet3Payout(address, signatureTestnet3);

        setClaimText("Claim for Testnet 4");
        const challenge = await getTestnet4Challenge(address);
        const bytes = new TextEncoder().encode(challenge);
        const signatureBytes = await (wallet?.adapter as LeoWalletAdapter).signMessage(bytes);
        const signature = new TextDecoder().decode(signatureBytes);
        await testnet4Payout(address, signature);

        setSignStatus(WalletSignStatus.SUCCESS);
      } catch (error: any) {
        setSignStatus(WalletSignStatus.ERROR);
        setErrorMsg(errorMsgMapping(error.request.status));
      }
    }
  };

  const connectWallet = () => {
    connect(DecryptPermission.NoDecrypt, WalletAdapterNetwork.TestnetBeta, []).catch((error) => {
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
    claimText,
    resetStatus: () => setSignStatus(WalletSignStatus.DEFAULT),
  };
};
