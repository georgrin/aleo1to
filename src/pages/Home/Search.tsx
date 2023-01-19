import { useState } from 'react';
import { Search as SearchIcon } from 'react-ionicons';

export const Search = ({ search }: any) => {
    const [address, setAddress] = useState<string>('');

    return (
        <div className="container">
            <div className='bg-surface mt-1 px-6 py-6 flex'>
                <div className='w-full relative'>
                    {SearchInputIcon()}
                    {SearchInput()}
                </div>
                {SearchButton()}
            </div>
        </div>
    )

    function SearchInput() {
        return (
            <input
                className={`
                    w-full pl-12 pr-2 py-3
                    bg-[rgba(30,32,35,1)] border-[rgba(255,255,255,0.15)] border-[1px]
                    outline-none rounded-[5px]
                    font-medium
                    placeholder:font-medium
                    placeholder:text-[rgba(255,255,255,0.5)]
                `}
                placeholder="Type address here"
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key==='Enter' && address !== '' && search(address)}
            />
        )
    }

    function SearchInputIcon() {
        return (
            <div className='absolute top-1/2 -translate-y-1/2 left-[16px]'>
                <SearchIcon color="rgba(255,255,255,0.5)" width='18px' />
            </div>
        )
    }

    function SearchButton() {
        return (
            <button
                className="bg-primary-2 ml-6 px-[46px] font-extrabold text-xl rounded-[5px] hover:shadow-primary"
                onClick={() => address !== '' && search(address)}
            >
                Search
            </button>
        )
    }
}
