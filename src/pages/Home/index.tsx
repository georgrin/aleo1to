import LoadingBar from "react-top-loading-bar";
import { JoinPool } from "./JoinPool";
import { Search } from "./Search";
import { SearchResults } from "./SearchResults";
import { Stat } from "./Stat";
import useSearch from "./hooks/useSearch";

const HomePage = () => {
  const {
    info,
    historyInfo,
    updateHistoryInfo,
    joinPoolIsDown,
    setJoinPoolIsDown,
    joinPoolCommand,
    searchAddress,
    searchResults,
    deleteSearchResult,
    loadingBarRef,
  } = useSearch();

  if (!info) return null;

  const joinPool = (
    <JoinPool
      joinPoolCommand={joinPoolCommand}
      hasUpDownSwitch={!!searchResults.filter((result) => result.data).length}
      isDown={joinPoolIsDown}
      setIsDown={setJoinPoolIsDown}
    />
  );

  return (
    <>
      <LoadingBar
        color="rgba(0,117,255,1)"
        height={4}
        shadow
        ref={loadingBarRef}
      />
      <div className="min-h-[100vh] pt-[68px] sm:pt-[56px] pb-[10px] overflow-x-hidden">
        <Stat
          info={info}
          historyInfo={historyInfo}
          updateHistoryInfo={updateHistoryInfo}
        />
        <Search search={searchAddress} />
        {!joinPoolIsDown && joinPool}
        <SearchResults
          searchResults={searchResults}
          deleteSearchResult={deleteSearchResult}
        />
        {joinPoolIsDown && joinPool}
      </div>
    </>
  );
};

export default HomePage;
