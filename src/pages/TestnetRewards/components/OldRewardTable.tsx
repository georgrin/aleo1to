import { useState } from "react";

interface Props {
  address: string;
}

const OldRewardTable = ({ address }: Props) => {
  const [sign, setSign] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <p className="p-4 bottom-line mt-[8px] bg-default rounded rounded-b-none">
        {address}
      </p>
      <div className="bg-default p-4 rounded rounded-t-none text-xs flex flex-col flex-1">
        <div className="flex justify-between items-center pb-[8px]">
          <p className="text-base">Snapshot reward</p>
          <p className="gradient-main text-2xl">1213,888889</p>
        </div>
        <p className="text-default">
          Due to the obsolescence of the Testnet 2 address format, you need to
          provide a Mainnet address (the same as used in Testnet 3) and verify
          that you own the private key for your Testnet 2 address. To do this,
          you must sign a message containing your Mainnet address using the
          private key from your Testnet 2 address. This can be done using the
          WASM tool from Aleo or our tool. Please read this&nbsp;
          <a className="text-link cursor-pointer">[link]</a> for guidance on how
          to proceed. Afterward, paste the signed message into the 'Sign' input
          field. Ensure that you enter the Mainnet address correctly, as this is
          the address to which your rewards will be sent.
        </p>
        <form className="flex flex-col h-full" onSubmit={onSubmit}>
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
                value={address}
                disabled
                placeholder="Mainnet address"
                className="flex-1 px-4 py-4 w-full leading-[18px] rounded outline-none bg-default border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="sign"
                className="block text-sm mb-[8px] text-default"
              >
                Sign
              </label>
              <input
                type="text"
                id="sign"
                value={sign}
                onChange={(e) => setSign(e.target.value)}
                placeholder="Sign"
                className="flex-1 px-4 py-4 w-full leading-[18px] rounded outline-none bg-default border-primary"
              />
            </div>
          </div>
          <div className="mt-[70px]">
            <button type="submit" className="w-full btn font-bold mt-auto">
              Sign
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OldRewardTable;
