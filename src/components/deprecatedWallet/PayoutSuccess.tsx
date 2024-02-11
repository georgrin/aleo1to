import { IconCheck } from '../icons/IconCheck';

export function PayoutSuccess({ handleClick }: { handleClick: Function }) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center items-center mb-4 max-w-[340px]'>
        <IconCheck className='text-[#00FFAB] rounded-full shadow-[0_4px_100px_0_rgba(0,255,171,1)]' />
      </div>
      <div className='font-bold text-2xl mb-2 max-w-[340px] w-full text-center'>
        Payment requested, you can close window
      </div>
      <div className='text-grey font-bold max-w-[340px]'>
        Expected withdrawal time 6-12 hours
      </div>
      <footer className='mt-8 w-full'>
        <button
          className='w-full bg-[#00FFF0] rounded h-[50px] text-black font-bold'
          onClick={() => handleClick()}
        >
          Go home
        </button>
      </footer>
    </div>
  );
}
