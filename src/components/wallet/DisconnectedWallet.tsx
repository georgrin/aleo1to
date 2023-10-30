import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { useMemo, MouseEventHandler, useCallback, useEffect } from 'react';
import { AddressLine } from './AddressLine';
import { IconLogoLeo } from '../icons/IconLogoLeo';

export const DisconnectedWallet = ({
  disabled,
  onClick,
  decryptPermission,
  network,
  programs,
  requestAddress,
  ...props
}: any) => {
  const { wallet, connecting, connected, connect, select, autoConnect } =
    useWallet();
  const content = useMemo(() => {
    if (connecting) return 'Connecting ...';
    if (connected) return 'Connected';
    if (wallet) return 'Connect Wallet';
    return 'Connect Wallet';
  }, [connecting, connected, wallet]);

  const connectWallet = () => {
    connect(
      decryptPermission || 'NO_DECRYPT',
      network || WalletAdapterNetwork.Testnet,
      programs ?? []
    ).catch((error) => {
      console.log('connectWallet error', { error: error });
    });
  };
  useEffect(() => {
    select(props.adapter);
  }, []);
  return (
    <>
      <div>
        <AddressLine requestAddress={requestAddress} />
        <h3 className='w-full text-[#6C7683] font-medium mb-4'>Leo Wallet</h3>
        <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
          <div className='flex items-center text-sm font-medium'>
            <IconLogoLeo className='' />
            <span className='text-[#00FFAB] ml-2'>Extension detected</span>
            <span className='text-[#6C7683]'>, please connect your wallet</span>
          </div>
          <button
            onClick={connectWallet}
            className='inline-block text-[#00FFF0] bg-[#00FFF0]/10 py-2 px-4 rounded leading-none'
          >
            {content}
          </button>
        </div>
        <footer className='mt-8 w-full'>
          <button className='w-full bg-[#00FFF0]/50 rounded h-[50px] text-black font-bold'>
            Sign
          </button>
        </footer>
      </div>
    </>
  );
};
