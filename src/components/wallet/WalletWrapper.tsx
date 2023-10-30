import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
  WalletReadyState,
} from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { startSign, payout } from '../../api/wallet';

import { ConnectedWallet } from './ConnectedWallet';
import { ConnectedWalletDoesnMatch } from './ConnectedWalletDoesnMatch';
import { NotFoundWallet } from './NotFoundWallet';
import { DisconnectedWallet } from './DisconnectedWallet';
import { IconCancel } from '../../components/icons/IconCancel';
import { IconAddCard } from '../../components/icons/IconAddCard';
import { PayoutSuccess } from './PayoutSuccess';
import { PayoutError } from './PayoutError';

interface Prop {
  requestAddress: string;
  close: Function;
}
export const WalletWrapper = ({ requestAddress, close }: Prop) => {
  const { publicKey, wallet, wallets, select, connected } = useWallet();
  const base58 = useMemo(() => publicKey?.toString(), [publicKey]);
  const leoWallet = wallets.find((item) => item.adapter.name === 'Leo Wallet');
  const [nonce, setNonce] = useState('');
  const [token, setToken] = useState('');
  const [errorSign, setErrorSign] = useState(false);
  const [successSign, setSuccessSign] = useState(false);

  const sign = async () => {
    try {
      const response = await startSign(requestAddress);
      setNonce(response.nonce);
      if (!publicKey) throw new WalletNotConnectedError();
      const message = 'a message to sign';
      const bytes = new TextEncoder().encode(message);
      const signatureBytes = await (
        wallet?.adapter as LeoWalletAdapter
      ).signMessage(bytes);
      const signature = new TextDecoder().decode(signatureBytes);
      setToken(signature);
      await payout(signature);
      setSuccessSign(true);
    } catch (error) {
      setErrorSign(true);
      console.log('sign error', { error: error });
    }
  };
  const Content = () => {
    if (successSign) return <PayoutSuccess handleClick={() => close()} />;
    if (leoWallet && leoWallet.readyState === WalletReadyState.Installed) {
      if (connected) {
        return requestAddress === base58 ? (
          <ConnectedWallet requestAddress={requestAddress} sign={sign} />
        ) : (
          <ConnectedWalletDoesnMatch requestAddress={requestAddress} />
        );
      } else {
        return (
          <DisconnectedWallet
            adapter={leoWallet.adapter.name}
            requestAddress={requestAddress}
          />
        );
      }
    } else {
      return <NotFoundWallet requestAddress={requestAddress} />;
    }
  };
  return (
    <div className='w-full'>
      <header className='flex items-center gap-1 w-full mb-8'>
        <IconAddCard />
        <h2>Request payout</h2>
        <button onClick={() => close()} className='ml-auto'>
          <IconCancel />
        </button>
      </header>
      {!errorSign ? (
        <div className='w-full'>
          <div className='w-full p-0 mt-4'>
            <Content />
          </div>
        </div>
      ) : (
        <PayoutError handleClick={()=> setErrorSign(false)} />
      )}
    </div>
  );
};