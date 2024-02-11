import { IconInfo } from '../icons/IconInfo';

export function PayoutError({ handleClick }: { handleClick: Function }) {
  return (
    <div className='text-center'>
      <div className='flex justify-center items-center mb-4'>
        <IconInfo className='text-[#F7A328]' />
      </div>
      <div className='font-bold text-2xl mb-2'>Something went wrong</div>
      <div className='text-grey font-bold'>Please try again</div>
      <footer className='mt-8 w-full'>
        <button
          className='w-full bg-[#00FFF0] rounded h-[50px] text-black font-bold'
          onClick={() => handleClick()}
        >
          Try again
        </button>
      </footer>
    </div>
  );
}
