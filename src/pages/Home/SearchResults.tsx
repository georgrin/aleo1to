import { MdClose } from "react-icons/md";
import * as model from "../../model/SearchResult";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { EarningsData, EarningsMinersToggle, MachinesData } from "./components/TopData";
import EarningsGrid from "./components/Earnings/EarningsGrid";
import { numberFormat as n } from "../../helpers/numbers";
import MachinesGrid from "./components/MachinesGrid";
import { toGigaNumber } from "../../formatNumber";

interface SearchResultsProps {
  searchResults: model.SearchResult[];
  deleteSearchResult: Function;
  searchAddresses: string[];
}
export const SearchResults = ({ searchResults, deleteSearchResult, searchAddresses }: SearchResultsProps) => {
  console.log(searchResults);

  return (
    <div className="container font-secondary relative overflow-hidden">
      {searchAddresses.map((address, index) => {
        if (searchResults.find((result) => result.address === address)) {
          return null;
        } else {
          return (
            <div className="px-3 pt-3 sm:px-6 sm:pt-6 top-line bg-surface font-medium">
              <div className="flex justify-between items-center gap-4">
                <div className="md:w-[728px] flex justify-between flex-wrap px-4 py-1.5 gap-4 bg-primary-2 group-[:nth-of-type(2n)]/search-result:bg-secondary-2 outline-none rounded-[5px]">
                  <div className="font-medium mb-[-8px]">
                    <span className="hidden md:block">{address}</span>
                    <span className="md:hidden">{address.slice(0, 10) + "..." + address.slice(-10)}</span>
                  </div>
                  <div
                    className="relative flex items-center cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(address)}
                  >
                    <div className="w-[20px] h-[20px] icon copy-blue-icon group-[:nth-of-type(2n)]/search-result:copy-green-icon"></div>
                    <span className="ml-4 text-primary group-[:nth-of-type(2n)]/search-result:text-secondary font-medium">
                      Copy
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center flex-col flex-1 justify-center py-10">
                <span className="loader-big"></span>
              </div>
            </div>
          );
        }
      })}
      {searchResults.map((result, index) => (
        <SearchResult key={result.address + index} searchResult={result} deleteSearchResult={deleteSearchResult} />
      ))}
    </div>
  );
};

const tooltipProps = {
  className:
    "text-[rgba(247,163,40,1)]  bg-[rgba(30,32,35,1)] border border-[rgba(255,255,255,0.15)] rounded-[5px] transition-none p-[14px] opacity-100 z-40",
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
  const [showCopied, setShowCopied] = useState(false);
  const [isEarnings, setIsEarnings] = useState(true);

  if (!searchResult.data) return null;

  const { address, data } = searchResult;
  const { earnings, general_info, payouts, machines, balance } = data;

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6 group/search-result top-line bg-surface font-medium">
      <div className="flex justify-between items-center gap-4">
        <div className="md:w-[728px] flex justify-between flex-wrap px-4 py-1.5 gap-4 bg-primary-2 group-[:nth-of-type(2n)]/search-result:bg-secondary-2 outline-none rounded-[5px]">
          {AddressLine()}
          {AddressLineCopyIcon()}
        </div>
        {AddressCloseIcon()}
      </div>

      <EarningsMinersToggle isEarnings={isEarnings} setIsEarnings={setIsEarnings} />
      {isEarnings ? (
        <>
          <EarningsData
            earnings={general_info.earnings_total}
            payout={general_info.payouts_total}
            fees={general_info.fee_total}
            balance={general_info.balance}
            autoPayout={general_info.auto_payout}
          />
          <EarningsGrid earnings={earnings} payouts={payouts} />
        </>
      ) : (
        <>
          <MachinesData
            count={machines.general_info.active}
            estimated={n(toGigaNumber(machines.general_info.total_estimated_hashrate))}
            reported={n(toGigaNumber(machines.general_info.total_reported_hashrate))}
          />
          <MachinesGrid machines={machines.machines} />
        </>
      )}
    </div>
  );

  function AddressLine() {
    return (
      <div className="font-medium mb-[-8px]">
        <span className="hidden md:block">{address}</span>
        <span className="md:hidden">{address.slice(0, 10) + "..." + address.slice(-10)}</span>
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
        <div className="w-[20px] h-[20px] icon copy-blue-icon group-[:nth-of-type(2n)]/search-result:copy-green-icon"></div>
        <span className="ml-4 text-primary group-[:nth-of-type(2n)]/search-result:text-secondary font-medium">
          Copy
        </span>

        <Tooltip
          {...tooltipProps}
          isOpen={showCopied}
          className={tooltipProps.className + "absolute top-[30px] left-1/2 translate-x-[-50%]"}
        >
          Copied!
        </Tooltip>
      </div>
    );
  }

  function AddressCloseIcon() {
    return (
      <div className="cursor-pointer" onClick={() => deleteSearchResult(searchResult)}>
        <MdClose color="" className="text-default hover:text-[rgb(255,66,90)]" size={25} />
      </div>
    );
  }
}
