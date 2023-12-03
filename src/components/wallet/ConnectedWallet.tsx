import { MouseEventHandler, useCallback } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { AddressLine } from './AddressLine';
import { IconLogoLeo } from '../icons/IconLogoLeo';

interface Prop {
  requestAddress: string;
  sign: Function;
  signStatus: string;
}

export const ConnectedWallet = ({
  requestAddress,
  sign,
  signStatus,
  ...props
}: Prop) => {
  const { publicKey, disconnect } = useWallet();
  const disconnectHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) disconnect().catch(() => {});
    },
    [disconnect]
  );

  return (
    <>
      <AddressLine requestAddress={requestAddress} />
      <h3 className='w-full text-grey font-medium mt-6 mb-4'>Leo Wallet</h3>
      <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
        <div className='flex items-center text-sm font-medium'>
          <IconLogoLeo className='' />
          <span className='ml-2 break-all'>{publicKey}</span>
        </div>
        <button
          onClick={disconnectHandler}
          className='inline-block text-red-500 bg-[#FF425A]/10 text-sm py-[10px] px-4 rounded leading-none font-medium'
        >
          Disconnect
        </button>
      </div>
      <footer className='mt-8 w-full'>
        {signStatus === 'pending' ? (
          <button
            className='w-full bg-aleo-cyan/50 rounded h-[50px] text-black font-bold'
            onClick={() => sign()}
          >
            Sign message in your wallet
          </button>
        ) : (
          <button className='w-full btn font-bold' onClick={() => sign()}>
            Sign
          </button>
        )}
      </footer>
    </>
  );
};