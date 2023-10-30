import { MouseEventHandler, useCallback } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { AddressLine } from './AddressLine';
import { IconLogoLeo } from '../icons/IconLogoLeo';

export const ConnectedWallet = ({ requestAddress, sign, ...props }: any) => {
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
        <h3 className='w-full text-[#6C7683] font-medium mb-4'>Leo Wallet</h3>
        <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
          <div className='flex items-center text-sm font-medium'>
            <IconLogoLeo className='' />
            <span className='ml-2'>{publicKey}</span>
          </div>
          <button
            onClick={disconnectHandler}
            className='inline-block text-red-500 bg-[#FF425A]/10 py-2 px-4 rounded leading-none'
          >
            Disconnect
          </button>
        </div>
        <footer className='mt-8 w-full'>
        <button
          className='w-full bg-[#00FFF0] rounded h-[50px] text-black font-bold'
          onClick={() => sign()}
        >
          Sign
        </button>
      </footer>
    </>
  );
};
