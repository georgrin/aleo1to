import { MdClose, MdInfoOutline } from "react-icons/md";
import { formatNumber } from "../../formatNumber";
import * as model from "../../model/SearchResult";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { Balance, Miner } from "../../api";
import { getNumberWithCommas } from "../../helpers/getNumberWithComas";

/**
 * @returns return string like 69.5 (+0.0 1h; +0.0 24h)
 */
const ResultMinerInSolo = ({ total, change_1h, change_24h }: Balance) => {
  const firstNumber = getNumberWithCommas({ value: total.toFixed(1) });
  const secondNumber = getNumberWithCommas({ value: change_1h.toFixed(1) });
  const thirdNumber = getNumberWithCommas({ value: change_24h.toFixed(1) });
  return <>{`${firstNumber} (+${secondNumber} 1h; +${thirdNumber} 24h)`}</>;
};

/**
 * @returns return string like 69.5 (+0.0 1h; +0.0 24h)
 */
const ResultMinerInPool = ({ total, change_1h, change_24h }: Balance) => {
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
    <div className="container font-secondary relative overflow-hidden">
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
  variant: "info" as "info",
  noArrow: true,
  place: "bottom" as "bottom",
  events: ["click"] as ["click"],
};

interface SearchResultProps {
  searchResult: model.SearchResult;
  deleteSearchResult: Function;
}
function SearchResult({ searchResult, deleteSearchResult }: SearchResultProps) {
  const { address, data } = searchResult;
  const miners = getMiners();

  const [showCopied, setShowCopied] = useState(false);

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
      <div className="flex justify-between items-center gap-4">
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
          <div className="text-default">{TableHead()}</div>
          <div>{miners.map(TableRow)}</div>
        </div>
      )}
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
      <div className="font-medium mb-[-8px]">
        <span className="hidden md:block">{address}</span>
        <span className="md:hidden">
          {address.slice(0, 10) + "..." + address.slice(-10)}
        </span>
      </div>
    );
  }

  function AddressLineCopyIcon() {
    return (
      <div
        className="relative flex items-center cursor-pointer"
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
        className="cursor-pointer"
        onClick={() => deleteSearchResult(searchResult)}
      >
        <MdClose color="rgb(255,66,90)" size={25} />
      </div>
    );
  }

  function Stat() {
    return (
      <div className="flex flex-wrap sm:flex-nowrap font-medium py-6">
        <div className="bg-surface w-full mb-4 sm:mb-0 sm:mr-4 rounded-[5px] p-3">
          <div
            className={`
                        bg-primary-2
                        group-[:nth-of-type(2n)]/search-result:bg-secondary-2
                        w-fit px-2 py-[3px] font-default font-medium rounded-[5px]
                    `}
          >
            In Pool
          </div>
          <div className="mt-[12.5px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Mined
              <div
                id={`mined-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
              </div>
              <Tooltip {...tooltipProps} anchorId={`mined-${address}`}>
                Testnet3 credits
              </Tooltip>
            </div>
            <div>
              {!data ? null : (
                <ResultMinerInPool
                  total={data.balance.total}
                  change_1h={data.balance.change_1h}
                  change_24h={data.balance.change_24h}
                />
              )}
            </div>
          </div>
          <div className="mt-[6px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Hashrate
              <div
                id={`hashrate-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
              </div>
              <Tooltip {...tooltipProps} anchorId={`hashrate-${address}`}>
                Calculated by proves count on miner
              </Tooltip>
            </div>
            <div>
              {!data ? null : (
                <>{formatNumber(Math.floor(data.hashrate.stat.in_pool))} c/s</>
              )}
            </div>
          </div>
          <div className="mt-[6px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Estimated Hashrate
              <div
                id={`estimated-hashrate-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
              </div>
              <Tooltip
                {...tooltipProps}
                anchorId={`estimated-hashrate-${address}`}
              >
                Calculated by submitted shares
              </Tooltip>
            </div>
            <div>
              {!data ? null : (
                <>
                  {formatNumber(Math.floor(data.hashrate.estimated.in_pool))}{" "}
                  c/s
                </>
              )}
            </div>
          </div>
          <div className="mt-[6px] flex flex-wrap leading-[1]">
            <div className="text-default mr-2">Shares</div>
            <div>
              {!data ? null : <>{formatNumber(data.shares.in_pool.valid)}</>}
            </div>
          </div>
        </div>
        <div className="bg-surface w-full rounded-[5px] p-3">
          <div className="bg-[rgba(255,255,255,0.1)] w-fit px-2 py-[3px] font-default font-medium rounded-[5px]">
            In Solo
          </div>
          <div className="mt-[12.5px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Mined
              <div
                id={`mined-in-solo-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
              </div>
              <Tooltip {...tooltipProps} anchorId={`mined-in-solo-${address}`}>
                Testnet3 credits
              </Tooltip>
            </div>
            <div>
              {!data ? null : (
                <ResultMinerInSolo
                  total={data.balance_solo.total}
                  change_1h={data.balance_solo.change_1h}
                  change_24h={data.balance_solo.change_24h}
                />
              )}
            </div>
          </div>
          <div className="mt-[6px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Hashrate
              <div
                id={`hashrate-in-solo-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
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
                <>{formatNumber(Math.floor(data.hashrate.stat.in_solo))} c/s</>
              )}
            </div>
          </div>
          <div className="mt-[6px] flex flex-wrap leading-[1]">
            <div className="text-default flex mr-2">
              Estimated Hashrate
              <div
                id={`estimated-hashrate-in-solo-${address}`}
                className="hover:text-primary cursor-pointer fill-current ml-1 relative top-[-2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
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
                  {formatNumber(Math.floor(data.hashrate.estimated.in_solo))}{" "}
                  c/s
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function TableHead() {
    return (
      <div className="hidden p-6 sm:flex grow-0 shrink-0">
        <div className="self-center min-w-[10%] max-w-[100%] md:max-w-[25%] w-[10%] grow-[1]">
          Host
        </div>
        <div className="hidden md:block self-center min-w-[20%] w-[20%] grow-[1]">
          Hardware
        </div>
        <div className="hidden md:block self-center min-w-[10%] max-w-[20%] w-[10%] grow-[1]">
          Hashrate (c/s)
        </div>
        <div className="hidden md:block self-center min-w-[10%] max-w-[10%] w-[10%] grow-[1]">
          Shares
        </div>
        <div className="md:hidden self-center min-w-[10%] max-w-[100%] w-[10%] grow-[1]">
          Host info
        </div>
      </div>
    );
  }

  function TableRow(miner: any, i: number) {
    return (
      <div
        key={i}
        className="top-line border-[rgba(255,255,255,0.15)] p-6 sm:flex grow-0 shrink-0"
      >
        <div className="relative min-w-[10%] sm:max-w-[50%] sm:w-[10%] grow-[1] sm:pr-5 pl-[20px] sm:pl-0 md:max-w-[25%] mb-[30px] sm:mb-0">
          <p className="absolute left-0 origin-top-left rotate-90 sm:hidden text-default">
            Host
          </p>
          <div>{miner.ip}</div>
          <div className="text-sm text-default font-default font-medium mt-2 break-words">
            {miner.hostname}
          </div>
          <div className="text-sm text-default font-default font-medium mt-2 mb-1">
            {miner.shares_solo == null || miner.shares_pool != null ? (
              "in pool"
            ) : (
              <span className="text-[rgb(255,66,90)]">in solo</span>
            )}
          </div>
        </div>
        <div className="hidden md:block min-w-[20%] w-[20%] grow-[1] pr-5">
          <div className="mb-[18px]">
            {miner.cpu.map((cpu: any, i: number) => (
              <div key={i} className="mb-2">
                CPU: {(cpu[1] > 1 ? cpu[1] + " x " : "") + cpu[0]}
              </div>
            ))}
          </div>
          <div>
            {miner.gpu.map((gpu: any, i: number) => (
              <div key={i} className="mb-2">
                GPU: {(gpu[1] > 1 ? gpu[1] + " x " : "") + gpu[0]}
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block min-w-[10%] max-w-[20%] w-[10%] grow-[1] pr-5">
          {formatNumber(Math.round(miner.hashrate))}
          <br />
          <div className="mt-4 text-default">
            {formatNumber(Math.round(miner.hashrate_estimated))}
          </div>
        </div>
        <div className="hidden md:block min-w-[10%] max-w-[10%] w-[10%] grow-[1]">
          {miner.shares_solo == null || miner.shares_pool != null
            ? formatNumber(Math.round(miner.shares_pool))
            : formatNumber(Math.round(miner.shares_solo))}
        </div>
        <div className="relative md:hidden min-w-[10%] max-w-[100%] sm:w-[10%] sm:pr-5 pl-[20px] sm:pl-0 grow-[1]">
          <p className="absolute left-0 origin-top-left rotate-90 sm:hidden text-default">
            Host info
          </p>
          <div className="text-default mb-4">Hardware:</div>
          <div className="mb-4">
            {miner.cpu.map((cpu: any, i: number) => (
              <div key={i} className="mb-2">
                CPU: {(cpu[1] > 1 ? cpu[1] + " x " : "") + cpu[0]}
              </div>
            ))}
          </div>
          <div>
            {miner.gpu.map((gpu: any, i: number) => (
              <div key={i} className="mb-2">
                GPU: {(gpu[1] > 1 ? gpu[1] + " x " : "") + gpu[0]}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-default mb-1">Hashrate (c/s): </div>
            {formatNumber(Math.round(miner.hashrate))}
            <br />
            <div className="text-default mt-1">
              {formatNumber(Math.round(miner.hashrate_estimated))}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-default">Shares: </span>
            <span className="whitespace-nowrap">
              {miner.shares_solo == null || miner.shares_pool != null
                ? formatNumber(Math.round(miner.shares_pool))
                : formatNumber(Math.round(miner.shares_solo))}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
