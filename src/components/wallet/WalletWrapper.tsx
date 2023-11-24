import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
  WalletReadyState,
} from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { getChallenge, getToken, payout } from '../../api/wallet';

import { ConnectedWallet } from './ConnectedWallet';
import { ConnectedWalletDoesnMatch } from './ConnectedWalletDoesnMatch';
import { NotFoundWallet } from './NotFoundWallet';
import { DisconnectedWallet } from './DisconnectedWallet';
import { IconCancel } from '../../components/icons/IconCancel';
import { IconAddCard } from '../../components/icons/IconAddCard';
import { PayoutSuccess } from './PayoutSuccess';
import { PayoutError } from './PayoutError';
import { RequestPayout } from '../../api';

interface Prop {
  requestAddress: string;
  close: Function;
  setPayoutRequested: Function;
  replaceSearchResult: Function;
  payoutData?: RequestPayout;
}
const PAYOUT_FEE = 0.263388;

export const WalletWrapper = ({
  requestAddress,
  close,
  setPayoutRequested,
  replaceSearchResult,
  payoutData,
}: Prop) => {
  const { publicKey, wallet, wallets, select, connected } = useWallet();
  const base58 = useMemo(() => publicKey?.toString(), [publicKey]);
  const leoWallet = wallets.find((item) => item.adapter.name === 'Leo Wallet');
  const [token, setToken] = useState('');
  const [signStatus, setSignStatus] = useState('');
  const [errorSign, setErrorSign] = useState(false);
  const [successSign, setSuccessSign] = useState(false);

  const sign = async () => {
    try {
      const challenge = await getChallenge(requestAddress);
      // console.log('challenge', { challenge: challenge });
      if (!publicKey) throw new WalletNotConnectedError();
      const bytes = new TextEncoder().encode(challenge);
      setSignStatus('pending');
      const signatureBytes = await (
        wallet?.adapter as LeoWalletAdapter
      ).signMessage(bytes);
      const signature = new TextDecoder().decode(signatureBytes);
      const requestData = {
        signature: signature,
      };
      const tokenResponse = await getToken(requestAddress, requestData);
      setToken(tokenResponse.token);
      await payout(tokenResponse.token);
      replaceSearchResult(requestAddress);
      setSuccessSign(true);
      setPayoutRequested(true);
    } catch (error) {
      if ((error as Error).message !== 'Permission Not Granted')
        setErrorSign(true);
      console.log('sign error', { error: error });
    } finally {
      setSignStatus('fulfilled');
    }
  };
  function calcAmountSum() {
    return payoutData ? payoutData.available - PAYOUT_FEE : ' — ';
  }
  const Content = () => {
    if (successSign) return <PayoutSuccess handleClick={() => close()} />;
    if (leoWallet && leoWallet.readyState === WalletReadyState.Installed) {
      if (connected) {
        return requestAddress === base58 ? (
          <ConnectedWallet
            requestAddress={requestAddress}
            sign={sign}
            signStatus={signStatus}
          />
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
      <header className='flex items-center gap-2 w-full mb-6'>
        <IconAddCard className='w-6 h-6' />
        <h2 className='text-2xl font-bold'>Request payout</h2>
        <button onClick={() => close()} className='ml-auto'>
          <IconCancel />
        </button>
      </header>
      <div className='flex gap-5 mb-6 font-secondary'>
        <div className='flex'>
          <div className='text-grey font-medium'>Amount</div>
          <div className='ml-2'>{calcAmountSum()}</div>
        </div>
        <div className='flex'>
          <span className='text-grey font-medium'>Fee</span>
          <output className='ml-2'>{PAYOUT_FEE}</output>
        </div>
      </div>
      {!errorSign ? (
        <div className='w-full'>
          <div className='w-full p-0 mt-4'>
            <Content />
          </div>
        </div>
      ) : (
        <PayoutError handleClick={() => setErrorSign(false)} />
      )}
    </div>
  );
};
