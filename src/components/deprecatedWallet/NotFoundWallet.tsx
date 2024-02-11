import { IconLogoLeo } from '../icons/IconLogoLeo';
import { AddressLine } from './AddressLine';

interface Prop {
  requestAddress: string;
}
export const NotFoundWallet = ({ requestAddress }: Prop) => {
  return (
    <>
      <AddressLine requestAddress={requestAddress} />
      <h3 className='w-full text-grey font-medium mt-6 mb-4'>
        Wallet extension
      </h3>
      <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
        <div className='flex gap-2 items-center'>
          <IconLogoLeo className='' />
          <span className='text-grey'>Leo wallet required</span>
          <span className=''>please install it</span>
        </div>
        <a
          href='https://www.leo.app/'
          className='inline-block text-sm text-aleo-cyan bg-aleo-cyan/10 py-[10px] px-4 rounded leading-none font-medium'
        >
          Install Wallet
        </a>
      </div>
      <footer className='mt-8 w-full'>
        <button className='w-full btn btn-disabled font-bold'>
          Sign
        </button>
      </footer>
    </>
  );
};
