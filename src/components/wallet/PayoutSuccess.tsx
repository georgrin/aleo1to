import { IconCheck } from '../icons/IconCheck';

export function PayoutSuccess({ handleClick }: { handleClick: Function }) {
  return (
    <div className='text-center'>
      <div className='flex justify-center items-center mb-4'>
        <IconCheck className='text-[#00FFAB] rounded-full shadow-[0_4px_100px_0_rgba(0,255,171,1)]' />
      </div>
      <div className='font-bold text-2xl mb-2'>
        Payment requested, you can close window
      </div>
      <div className='text-[#6C7683] font-bold'>
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
