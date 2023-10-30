import { IconLogoLeo } from '../icons/IconLogoLeo';
import { AddressLine } from './AddressLine';

interface Prop {
  requestAddress: string;
}
export const NotFoundWallet = ({ requestAddress }: Prop) => {
  return (
    <>
      <AddressLine requestAddress={requestAddress} />
      <h3 className='w-full text-[#6C7683] font-medium mb-4'>
        Wallet extension
      </h3>
      <div className='border border-[#32363B] rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4'>
        <div className='flex gap-2 items-center'>
          <IconLogoLeo className='' />
          <span className='text-[#6C7683]'>Leo wallet required</span>
          <span className=''>please install it</span>
        </div>
        <a
          href='https://www.leo.app/'
          className='inline-block text-[#00FFF0] bg-[#00FFF0]/10 py-2 px-4 rounded leading-none'
        >
          Install Wallet
        </a>
      </div>
      <footer className='mt-8 w-full'>
        <button className='w-full bg-[#00FFF0]/50 rounded h-[50px] text-black font-bold'>
          Sign
        </button>
      </footer>
    </>
  );
};
