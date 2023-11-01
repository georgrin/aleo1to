import { TextLine } from '../TextLine';
import { TextLineCopy } from '../TextLineCopy';

export function AddressLine({ requestAddress }: { requestAddress: string }) {
  return (
    <div className='w-full'>
      <h3 className='w-full text-grey font-medium mb-4'>
        Address for request
      </h3>
      <div className='relative w-full text-white'>
        {TextLine({ command: requestAddress })}
        {TextLineCopy({ command: requestAddress })}
      </div>
    </div>
  );
}
