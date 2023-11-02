import { MdClose, MdInfoOutline } from 'react-icons/md';
import * as model from '../../model/SearchResult';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
import Modal from 'react-modal';
import { BalanceOne, Miner } from '../../api';
import { getNumberWithCommas } from '../../helpers/getNumberWithComas';

import { IconAddCard } from '../../components/icons/IconAddCard';
import { IconClockLoader } from '../../components/icons/IconClockLoader';
import { WalletWrapper } from '../../components/wallet/WalletWrapper';

Modal.setAppElement('#modals');
const MIN_PAYOUT = 0.1
/**
 * @returns return string like 69.5 (+0.0 1h; +0.0 24h)
 */
const ResultMinerInSolo = ({ total, change_1h, change_24h }: BalanceOne) => {
  const firstNumber = getNumberWithCommas({ value: total.toFixed(1) });
  const secondNumber = getNumberWithCommas({ value: change_1h.toFixed(1) });
  const thirdNumber = getNumberWithCommas({ value: change_24h.toFixed(1) });
  return <>{`${firstNumber} (+${secondNumber} 1h; +${thirdNumber} 24h)`}</>;
};

/**
 * @returns return string like 69.5 (+0.0 1h; +0.0 24h)
 */

const ResultMinerInPool = ({ total, change_1h, change_24h }: BalanceOne) => {
  const firstNumber = getNumberWithCommas({ value: total.toFixed(1) });
  const secondNumber = getNumberWithCommas({ value: change_1h.toFixed(1) });
  const thirdNumber = getNumberWithCommas({ value: change_24h.toFixed(1) });
  return <>{`${firstNumber} (+${secondNumber} 1h; +${thirdNumber} 24h)`}</>;
};

interface SearchResultsProps {
  searchResults: model.SearchResult[];
  deleteSearchResult: Function;
}
export const SearchResults = ({
  searchResults,
  deleteSearchResult,
}: SearchResultsProps) => {
  return (
    <div className='container font-secondary relative overflow-hidden'>
      {searchResults.map((result) => (
        <SearchResult
          key={result.address}
          searchResult={result}
          deleteSearchResult={deleteSearchResult}
        />
      ))}
    </div>
  );
};
const tooltipProps = {
  className: `
        text-[rgba(247,163,40,1)] 
        bg-[rgba(30,32,35,1)]
        border
        border-[rgba(255,255,255,0.15)]
        rounded-[5px] transition-none p-[14px]
        opacity-100
        z-40
    `,
  variant: 'info' as 'info',
  noArrow: true,
  place: 'bottom' as 'bottom',
  events: ['click'] as ['click'],
};

interface SearchResultProps {
  searchResult: model.SearchResult;
  deleteSearchResult: Function;
}
function SearchResult({ searchResult, deleteSearchResult }: SearchResultProps) {
  const { address, data } = searchResult;
  const miners = getMiners();

  const [showCopied, setShowCopied] = useState(false);
  const [showRequestPayout, setShowRequestPayout] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`
        px-3 pt-3
        sm:px-6 sm:pt-6
        group/search-result
        bg-primary-3
        [&:nth-of-type(2n)]:bg-secondary-3
        border-[rgba(255,255,255,0.1)] border-t-[1px]
    `}
    >
      <div className='flex justify-between items-center gap-4'>
        <div
          className={`
                md:w-[728px] flex justify-between flex-wrap
                px-4
                py-1.5
                gap-4
                bg-primary-2
                group-[:nth-of-type(2n)]/search-result:bg-secondary-2
                outline-none rounded-[5px]
            `}
        >
          {AddressLine()}
          {AddressLineCopyIcon()}
        </div>
        {AddressCloseIcon()}
      </div>

      {Stat()}

      {miners.length > 0 && (
        <div
          className={`
                font-medium
                leading-[1]
                mx-[-24px]
                grid
                justify-items-stretch
                auto-rows-[minmax(max-content,0px)]
                grid-cols-[repeat(1,minmax(0px,1fr))]
                grid-flow-row
            `}
        >
          <div className='text-default'>{TableHead()}</div>
          <div>{miners.map(TableRow)}</div>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        className='bg-black flex flex-wrap w-full max-w-[800px] p-8 gap-6 rounded-2xl'
        overlayClassName='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50'
      >
        <WalletWrapper requestAddress={address} close={closeModal} />
      </Modal>
    </div>
  );

  function getMiners() {
    if (!data) return [];
    return data.miners.map((miner: Miner) => {
      const cpu: any[] = [];
      const gpu: any[] = [];
      miner.hardware.cpu.forEach((cpu_: any) => {
        const exists = cpu.find((item) => item[0] === cpu_.model);
        if (exists) {
          ++exists[1];
        } else {
          cpu.push([cpu_.model, 1]);
        }
      });
      miner.hardware.gpu.forEach((gpu_: any) => {
        const exists = gpu.find((item) => item[0] === gpu_.model);
        if (exists) {
          ++exists[1];
        } else {
          gpu.push([gpu_.model, 1]);
        }
      });
      return {
        ...miner,
        cpu,
        gpu,
      };
    });
  }

  function AddressLine() {
    return (
      <div className='font-medium mb-[-8px]'>
        <span className='hidden md:block'>{address}</span>
        <span className='md:hidden'>
          {address.slice(0, 10) + '...' + address.slice(-10)}
        </span>
      </div>
    );
  }

  function AddressLineCopyIcon() {
    return (
      <div
        className='relative flex items-center cursor-pointer'
        onClick={async () => {
          await navigator.clipboard.writeText(address);
          setShowCopied(true);
          setTimeout(() => {
            setShowCopied(false);
          }, 1000);
        }}
      >
        <div
          className={`  
                        w-[20px] h-[20px]
                        icon copy-blue-icon
                        group-[:nth-of-type(2n)]/search-result:copy-green-icon
                    `}
        ></div>
        <span
          className={`
                    ml-4
                    text-primary group-[:nth-of-type(2n)]/search-result:text-secondary
                    font-medium
                `}
        >
          Copy
        </span>

        <Tooltip
          {...tooltipProps}
          isOpen={showCopied}
          className={
            tooltipProps.className +
            `
                        absolute
                        top-[30px]
                        left-1/2
                        translate-x-[-50%]
                    `
          }
        >
          Copied!
        </Tooltip>
      </div>
    );
  }

  function AddressCloseIcon() {
    return (
      <div
        className='cursor-pointer'
        onClick={() => deleteSearchResult(searchResult)}
      >
        <MdClose color='rgb(255,66,90)' size={25} />
      </div>
    );
  }
function RequestBtn() {
  if(searchResult.data) {
    if(searchResult.data.payout.requested > 0 ) {
      return (
        <button
          className='flex items-center rounded gap-2 px-3 py-2 h-full bg-aleo-cyan/10 text-aleo-cyan font-bold text-sm opacity-50 cursor-progress'
        >
          <IconClockLoader className='' />
          Payout requested...
        </button>
      )
      
    } else if(searchResult.data.payout.available > MIN_PAYOUT) {
      return (
        <button
          className='flex items-center rounded gap-2 px-3 py-2 h-full bg-aleo-cyan/10 text-aleo-cyan font-bold text-sm'
          onClick={openModal}
        >
          <IconAddCard className='' />
          Request payout
        </button>
      )
    }
  }
  
  // return searchResult.data.payout.available
}
  function Stat() {
    return (
      <>
        <div className='flex flex-wrap sm:flex-nowrap font-medium py-6'>
          {/* IN POOL START */}
          <div className='bg-surface w-full mb-4 sm:mb-0 sm:mr-4 rounded-[5px] p-3'>
            <div className='flex items-center justify-between'>
              <div
                className={`
                        bg-primary-2
                        group-[:nth-of-type(2n)]/search-result:bg-secondary-2
                        w-fit px-3 py-2 font-default font-medium rounded
                    `}
              >
                In Pool
              </div>
              <RequestBtn />
            </div>

            <div className='mt-[8px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Mined
                <div
                  id={`mined-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip {...tooltipProps} anchorId={`mined-${address}`}>
                  Testnet3 credits
                </Tooltip>
              </div>

              {/* IN POOL */}
              <div>
                {!data ? null : (
                  <>
                    <ResultMinerInPool
                      total={data.balance.in_pool.total}
                      change_1h={data.balance.in_pool.change_1h}
                      change_24h={data.balance.in_pool.change_24h}
                    />
                  </>
                )}
              </div>
            </div>

            {/* IN POOL:Hashrate START */}
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Hashrate
                <div
                  id={`hashrate-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip {...tooltipProps} anchorId={`hashrate-${address}`}>
                  Calculated by proves count on miner
                </Tooltip>
              </div>
              <div>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({
                      value: Math.floor(data.hashrate.stat.in_pool),
                    })}
                    <span> c/s</span>
                  </>
                )}
              </div>
            </div>
            {/* IN POOL:Hashrate END */}

            {/* IN POOL:Estimated Hashrate START */}
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Estimated Hashrate
                <div
                  id={`estimated-hashrate-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip
                  {...tooltipProps}
                  anchorId={`estimated-hashrate-${address}`}
                >
                  Calculated by submitted shares
                </Tooltip>
              </div>
              <p>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({
                      value: Math.floor(data.hashrate.estimated.in_pool),
                    })}
                    <span> c/s</span>
                  </>
                )}
              </p>
            </div>
            {/* IN POOL:Estimated Hashrate END */}

            {/* IN POOL:Shares START */}
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <p className='text-default mr-2'>Shares</p>
              <p>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({ value: data.shares.in_pool.valid })}
                  </>
                )}
              </p>
            </div>
            {/* IN POOL:Shares END */}

            {/* IN POOL:Phase START */}
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Phase 2
                <div
                  id={`mined-in-solo-Phase2`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip {...tooltipProps} anchorId={`mined-in-solo-Phase2`}>
                  Testnet3 credits earned in <br /> incentivized period of phase
                  2
                </Tooltip>
              </div>
              <p>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({
                      value: data.balance_phase2.in_pool_incentivize.total,
                      separator: '',
                    })}
                  </>
                )}
              </p>
            </div>
            {/* IN POOL:Phase END */}
          </div>
          {/* IN POOL END */}

          {/* IN SOLO START */}
          <div className='bg-surface w-full rounded-[5px] p-3'>
            <div className='bg-[rgba(255,255,255,0.1)] w-fit px-2 py-[3px] font-default font-medium rounded-[5px]'>
              In Solo
            </div>
            <div className='mt-[8px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Mined
                <div
                  id={`mined-in-solo-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip
                  {...tooltipProps}
                  anchorId={`mined-in-solo-${address}`}
                >
                  Testnet3 credits
                </Tooltip>
              </div>
              {/* IN SOLO */}
              <div>
                {!data ? null : (
                  <>
                    <ResultMinerInSolo
                      total={data.balance.solo.total}
                      change_1h={data.balance.solo.change_1h}
                      change_24h={data.balance.solo.change_24h}
                    />
                  </>
                )}
              </div>
            </div>
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Hashrate
                <div
                  id={`hashrate-in-solo-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip
                  {...tooltipProps}
                  anchorId={`hashrate-in-solo-${address}`}
                >
                  Calculated by proves count on miner
                </Tooltip>
              </div>
              <div>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({
                      value: Math.floor(data.hashrate.stat.in_solo),
                    })}
                    <span> c/s</span>
                  </>
                )}
              </div>
            </div>
            <div className='mt-[2px] flex flex-wrap leading-[26px]'>
              <div className='text-default flex items-center mr-2'>
                Estimated Hashrate
                <div
                  id={`estimated-hashrate-in-solo-${address}`}
                  className='hover:text-primary cursor-pointer fill-current ml-1'
                >
                  <MdInfoOutline size={22} color='inherit' />
                </div>
                <Tooltip
                  {...tooltipProps}
                  anchorId={`estimated-hashrate-in-solo-${address}`}
                >
                  Calculated by submitted shares
                </Tooltip>
              </div>
              <div>
                {!data ? null : (
                  <>
                    {getNumberWithCommas({
                      value: Math.floor(data.hashrate.estimated.in_solo),
                    })}
                    <span> c/s</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* IN SOLO END */}
        </div>
      </>
    );
  }

  function TableHead() {
    return (
      <div className='hidden p-6 sm:flex grow-0 shrink-0'>
        <div className='self-center min-w-[10%] max-w-[100%] md:max-w-[25%] w-[10%] grow-[1]'>
          Host
        </div>
        <div className='hidden md:block self-center min-w-[20%] w-[20%] grow-[1]'>
          Hardware
        </div>
        <div className='hidden md:block self-center min-w-[10%] max-w-[20%] w-[10%] grow-[1]'>
          Hashrate (c/s)
        </div>
        <div className='hidden md:block self-center min-w-[10%] max-w-[10%] w-[10%] grow-[1]'>
          Shares
        </div>
        <div className='md:hidden self-center min-w-[10%] max-w-[100%] w-[10%] grow-[1]'>
          Host info
        </div>
      </div>
    );
  }

  function TableRow(miner: any, i: number) {
    return (
      <div
        key={i}
        className='top-line border-[rgba(255,255,255,0.15)] p-6 sm:flex grow-0 shrink-0'
      >
        <div className='relative min-w-[10%] sm:max-w-[50%] sm:w-[10%] grow-[1] sm:pr-5 pl-[20px] sm:pl-0 md:max-w-[25%] mb-[30px] sm:mb-0'>
          <p className='absolute left-0 origin-top-left rotate-90 sm:hidden text-default'>
            Host
          </p>
          <div>{miner.ip}</div>
          <div className='text-sm text-default font-default font-medium mt-2 break-words'>
            {miner.hostname}
          </div>
          <div className='text-sm text-default font-default font-medium mt-2 mb-1'>
            {miner.shares_solo == null || miner.shares_pool != null ? (
              'in pool'
            ) : (
              <span className='text-[rgb(255,66,90)]'>in solo</span>
            )}
          </div>
        </div>
        <div className='hidden md:block min-w-[20%] w-[20%] grow-[1] pr-5'>
          <div className='mb-[18px]'>
            {miner.cpu.map((cpu: any, i: number) => (
              <div key={i} className='mb-2'>
                CPU: {(cpu[1] > 1 ? cpu[1] + ' x ' : '') + cpu[0]}
              </div>
            ))}
          </div>
          <div>
            {miner.gpu.map((gpu: any, i: number) => (
              <div key={i} className='mb-2'>
                GPU: {(gpu[1] > 1 ? gpu[1] + ' x ' : '') + gpu[0]}
              </div>
            ))}
          </div>
        </div>
        <div className='hidden md:block min-w-[10%] max-w-[20%] w-[10%] grow-[1] pr-5'>
          {getNumberWithCommas({ value: Math.round(miner.hashrate) })}
          <br />
          <div className='mt-4 text-default'>
            {getNumberWithCommas({
              value: Math.round(miner.hashrate_estimated),
            })}
          </div>
        </div>
        <div className='hidden md:block min-w-[10%] max-w-[10%] w-[10%] grow-[1]'>
          {miner.shares_solo == null || miner.shares_pool != null
            ? getNumberWithCommas({ value: Math.round(miner.shares_pool) })
            : getNumberWithCommas({ value: Math.round(miner.shares_solo) })}
        </div>
        <div className='relative md:hidden min-w-[10%] max-w-[100%] sm:w-[10%] sm:pr-5 pl-[20px] sm:pl-0 grow-[1]'>
          <p className='absolute left-0 origin-top-left rotate-90 sm:hidden text-default'>
            Host info
          </p>
          <div className='text-default mb-4'>Hardware:</div>
          <div className='mb-4'>
            {miner.cpu.map((cpu: any, i: number) => (
              <div key={i} className='mb-2'>
                CPU: {(cpu[1] > 1 ? cpu[1] + ' x ' : '') + cpu[0]}
              </div>
            ))}
          </div>
          <div>
            {miner.gpu.map((gpu: any, i: number) => (
              <div key={i} className='mb-2'>
                GPU: {(gpu[1] > 1 ? gpu[1] + ' x ' : '') + gpu[0]}
              </div>
            ))}
          </div>
          <div className='mt-4'>
            <div className='text-default mb-1'>Hashrate (c/s): </div>
            {getNumberWithCommas({ value: Math.round(miner.hashrate) })}
            <br />
            <div className='text-default mt-1'>
              {getNumberWithCommas({
                value: Math.round(miner.hashrate_estimated),
              })}
            </div>
          </div>
          <div className='mt-4'>
            <span className='text-default'>Shares: </span>
            <span className='whitespace-nowrap'>
              {miner.shares_solo == null || miner.shares_pool != null
                ? getNumberWithCommas({ value: Math.round(miner.shares_pool) })
                : getNumberWithCommas({ value: Math.round(miner.shares_solo) })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
}
