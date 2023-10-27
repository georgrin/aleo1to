import { MouseEventHandler, useCallback, useMemo } from 'react';
import { IconLogoLeo } from '../components/icons/IconLogoLeo';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import {
  WalletAdapterNetwork,
  WalletName,
  WalletReadyState,
} from '@demox-labs/aleo-wallet-adapter-base';
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

export const WalletWrapper = (props: any) => {
  const {
    publicKey,
    wallet,
    wallets,
    select,
    connect,
    connecting,
    connected,
    disconnect,
  } = useWallet();
  const base58 = useMemo(() => publicKey?.toString(), [publicKey]);
  const leoWallet = wallets.find((item) => item.adapter.name === 'Leo Wallet');
  console.log({ wallet: wallet, wallets: wallets, base58: base58, leoWallet: leoWallet });
  return (
    <>
      <div className='w-full p-0 mt-4'>
        {leoWallet && leoWallet.readyState === WalletReadyState.Installed ? (
          connected ? (
            <DisconnectWallet />
          ) : (
            <WalletDisconnected />
          )
        ) : (
          <NotFoundWallet />
        )}
      </div>
    </>
  );
};

export const WalletDisconnected = ({
  disabled,
  onClick,
  decryptPermission,
  network,
  programs,
  ...props
}: any) => {
  const { publicKey, wallet, connect, connecting, connected, disconnect } =
    useWallet();
    const content = useMemo(() => {
      if (connecting) return 'Connecting ...';
      if (connected) return 'Connected';
      if (wallet) return 'Connect Wallet';
      return 'Connect Wallet';
  }, [ connecting, connected, wallet]);
  const connectWallet: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      console.log('connectWallet', event.defaultPrevented);
      if (!event.defaultPrevented)
        connect(
          decryptPermission || 'NO_DECRYPT',
          network || WalletAdapterNetwork.Testnet,
          programs ?? []
        ).catch(() => {});
    },
    [onClick, connect]
  );
  return (
    <>
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
    </>
  );
};
export const NotFoundWallet = (props: any) => {
  return (
    <>
      <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
        <div className='flex gap-2 items-center'>
          <IconLogoLeo className='' />
          <span className='text-[#6C7683]'>Leo wallet required,</span>
          <span className=''>please install it</span>
        </div>
        <a
          href='https://www.leo.app/'
          className='inline-block text-[#00FFF0] bg-[#00FFF0]/10 py-2 px-4 rounded leading-none'
        >
          Install Wallet
        </a>
      </div>
    </>
  );
};
export const DisconnectWallet = ({
  disabled,
  onClick,
  decryptPermission,
  network,
  programs,
  ...props
}: any) => {
  const { publicKey, wallet, connect, connecting, connected, disconnect } =
    useWallet();
  return (
    <>
      <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
        <div className='flex items-center text-sm font-medium'>
          <IconLogoLeo className='' />
          <span className='text-[#00FFAB] ml-2'>Extension detected</span>
          <span className='text-[#6C7683]'>, please connect your wallet</span>
        </div>
        <button
          onClick={disconnect}
          className='inline-block text-[#00FFF0] bg-[#00FFF0]/10 py-2 px-4 rounded leading-none'
        >
          Disconnect
        </button>
      </div>
    </>
  );
};
