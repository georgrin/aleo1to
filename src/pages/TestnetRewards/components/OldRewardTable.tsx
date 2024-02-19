import { useState } from "react";
import { Testnet2, TestnetStatus } from "../../../model/Testnet";
import { testnet2Payout } from "../../../api/testnet";
import { IconCheckSmall } from "../../../components/icons/IconCheckSmall";
import SuccessSign from "../../../components/WalletSign/SuccessSign";
import { errorMsgMapping } from "../../../components/WalletSign/hooks/useWalletSign";
import PendingSign from "../../../components/WalletSign/PendingSign";
import StatusBar from "../../../components/WalletSign/StatusBar";
import IconRetry from "../../../components/icons/IconRetry";
import RequestedSign from "../../../components/WalletSign/RequestedSign";

interface Props {
  address: string;
  data: Testnet2;
}

const OldRewardTable = ({ address, data }: Props) => {
  const [sign, setSign] = useState("");
  const [mainnetAddress, setMainnetAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successSign, setSuccessSign] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await testnet2Payout(address, sign, mainnetAddress);
      setSuccessSign(true);
    } catch (error: any) {
      setErrorMsg(errorMsgMapping(error.request.status));
      setSuccessSign(false);
    } finally {
      setIsLoading(false);
    }
  };

  const tryAgain = () => {
    setErrorMsg("");
    setIsLoading(false);
    setSuccessSign(false);
  };

  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none text-xs">
        {address}
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs flex flex-col flex-1">
        <div className="flex justify-between items-center pb-[8px]">
          <p className="text-base">Snapshot reward</p>
          <p className="gradient-main text-2xl">{data.snapshot_reward}</p>
        </div>
        {data.status === TestnetStatus.READY && (
          <p className="text-default">
            Due to the obsolescence of the Testnet 2 address format, you need to
            provide a Mainnet address (the same as used in Testnet 3) and verify
            that you own the private key for your Testnet 2 address. To do this,
            you must sign a message containing your Mainnet address using the
            private key from your Testnet 2 address. This can be done using the
            WASM tool from Aleo or our tool. Please&nbsp;
            <a
              href="https://docs.aleo1.to/rewards/testnet-2-rewards"
              target="_blank"
              className="text-link cursor-pointer"
            >
              read this for guidance
            </a>
            &nbsp;on how to proceed. Afterward, paste the signed message into
            the <b>Signature</b> input field. Ensure that you enter the Mainnet
            address correctly, as this is the address to which your rewards will
            be sent.
          </p>
        )}
        <form className="flex flex-col h-full" onSubmit={onSubmit}>
          {data.status === TestnetStatus.READY && (
            <div className="flex flex-col gap-4 mt-3">
              <div>
                <label
                  htmlFor="mainnet-address"
                  className="block text-sm mb-[8px] text-default"
                >
                  Mainnet address
                </label>
                <input
                  type="text"
                  id="mainnet-address"
                  value={mainnetAddress}
                  onChange={(e) => setMainnetAddress(e.target.value)}
                  placeholder="Mainnet address"
                  className="flex-1 px-4 py-4 w-full leading-[18px] rounded outline-none bg-default border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="sign"
                  className="block text-sm mb-[8px] text-default"
                >
                  Signature
                </label>
                <input
                  type="text"
                  id="sign"
                  value={sign}
                  onChange={(e) => setSign(e.target.value)}
                  placeholder="Signature"
                  className="flex-1 px-4 py-4 w-full leading-[18px] rounded outline-none bg-default border-primary"
                />
              </div>
            </div>
          )}
          <div className="mt-auto">
            {data.status === TestnetStatus.REQUESTED && (
              <div className="text-xs">
                <div className="border border-primary rounded flex justify-between items-center w-full py-[10px] pr-[6px] px-4">
                  <div className="flex items-center justify-center w-full">
                    <span className="mr-1">
                      <IconCheckSmall />
                    </span>
                    <span className="text-default">Requested...</span>
                  </div>
                </div>
              </div>
            )}
            {data.status === TestnetStatus.READY && (
              <div className="mt-2">
                {isLoading && (
                  <StatusBar message={<span className="loader"></span>} />
                )}
                {errorMsg && (
                  <StatusBar
                    message={
                      <div className="flex gap-2">
                        <span className="text-red-500">Error: {errorMsg}</span>
                        <button onClick={tryAgain}>
                          <IconRetry />
                        </button>
                        <button onClick={tryAgain} className="underline">
                          Try again
                        </button>
                      </div>
                    }
                  />
                )}
                {successSign && <RequestedSign />}
                {!isLoading && !errorMsg && !successSign && (
                  <button type="submit" className="w-full btn font-bold">
                    Claim
                  </button>
                )}
              </div>
            )}
            {data.status === TestnetStatus.SENT && (
              <SuccessSign txid={data.txid} />
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default OldRewardTable;
