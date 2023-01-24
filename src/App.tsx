import { useEffect, useRef, useState } from "react";
import * as api from "./api";
import * as Home from "./pages/Home";
import { useCookies } from "react-cookie";
import { SearchResult } from "./model/SearchResult";
import Modal from "react-modal";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import "react-tooltip/dist/react-tooltip.css";
import "./index.scss";

Modal.setAppElement("#modals");

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes;

function App() {
  const {
    loadingBarRef,
    info,
    historyInfo,
    updateHistoryInfo,
    joinPoolIsDown,
    setJoinPoolIsDown,
    joinPoolCommand,
    searchAddress,
    searchResults,
    deleteSearchResult,
  } = useAppController();

  if (!info) {
    return null;
  }

  const joinPool = (
    <Home.JoinPool
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
      <Home.Header info={info} />

      <div className="pt-[68px] sm:pt-[56px] min-h-[100vh] pb-[10px]">
        <Home.Stat
          info={info}
          historyInfo={historyInfo}
          updateHistoryInfo={updateHistoryInfo}
        />
        <Home.Search search={searchAddress} />
        {!joinPoolIsDown && joinPool}
        <Home.SearchResults
          searchResults={searchResults}
          deleteSearchResult={deleteSearchResult}
        />
        {joinPoolIsDown && joinPool}
      </div>

      <Home.Footer />
    </>
  );
}

export default App;

function useAppController() {
  const [info, setInfo] = useState<any>(null);
  const [historyInfo, setHistoryInfo] = useState<api.IGetHistoryInfoResponse[] | []>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [joinPoolIsDown, setJoinPoolIsDown] = useState(true);
  const [joinPoolCommand, setJoinPoolCommand] = useState<null | string>(null);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [cookies, setCookie] = useCookies(["searchAddresses"]);

  const searchAddresses = loadSearchAddresses();
  
  useEffect(() => {
    updateInfo();
    setInterval(() => {
      updateInfo();
      updateHistoryInfo();
    }, UPDATE_INTERVAL);

    while (searchAddresses.indexOf("") >= 0) {
      const addressIndex = searchAddresses.indexOf("");
      if (addressIndex >= 0) {
        searchAddresses.splice(addressIndex, 1);
        saveSearchAddresses();
      }
    }
    searchAddresses.forEach(_searchAddress);
  }, []);

  return {
    loadingBarRef,
    info,
    historyInfo,
    updateHistoryInfo,
    joinPoolIsDown,
    setJoinPoolIsDown,
    joinPoolCommand,
    searchAddress,
    searchResults,
    deleteSearchResult,
  };

  function loadSearchAddresses(): string[] {
    if (!cookies.searchAddresses) {
      return [];
    }
    return JSON.parse(decodeURIComponent(cookies.searchAddresses));
  }

  function saveSearchAddresses() {
    setCookie(
      "searchAddresses",
      encodeURIComponent(JSON.stringify(searchAddresses))
    );
  }

  async function updateInfo() {
    setInfo(await api.getInfo());
  }

  async function updateHistoryInfo() {
    loadingBarRef.current?.continuousStart();
    const info = await api.getHistoryInfo();
    
    let aggregatedInfo: api.IGetHistoryInfoResponse[] = [];
    let count = 0;
    info.forEach((item, i) => {
      const date = new Date(item.date);
      const day = `${date.getMonth() + 1}-${date.getDate()}`;
      const last = aggregatedInfo[aggregatedInfo.length - 1];
      ++count;
      if (last) {
        const lastDate = new Date(last.date);
        const lastDay = `${lastDate.getMonth() + 1}-${lastDate.getDate()}`;
        if (lastDay !== day || i === info.length - 1) {
          Object.keys(last).forEach((k) => {
            if (k === "date") {
              return;
            }
            // @ts-ignore
            last[k] /= count;
          });
          count = 0;
          if (i !== info.length - 1) {
            aggregatedInfo.push({ ...item });
          }
        } else {
          Object.keys(last).forEach((k) => {
            if (k === "date") {
              return;
            }
            // TODO: Add type
            // @ts-ignore
            last[k] += item[k];
          });
        }
      } else {
        aggregatedInfo.push({ ...item });
      }
    });
    setHistoryInfo(aggregatedInfo);
    loadingBarRef.current?.complete();
  }

  function searchAddress(address: string) {
    if (searchAddresses.includes(address)) {
      setJoinPoolIsDown(true);
      setJoinPoolCommand(null);
      loadingBarRef.current?.continuousStart();
      loadingBarRef.current?.complete();
      return;
    }
    searchAddresses.unshift(address);
    saveSearchAddresses();

    _searchAddress(address);
  }

  async function _searchAddress(address: string) {
    if (searchResults.find((result) => result.address === address)) {
      return;
    }
    const result: SearchResult = {
      address,
      data: null,
    };
    await updateSearchResult();

    async function updateSearchResult() {
      loadingBarRef.current?.continuousStart();
      // TODO: try catch?
      const { data } = await api.searchAddress(address);
      if (data) {
        result.data = data;
        loadingBarRef.current?.complete();
        if (
          !result.data.miners.length &&
          result.data.balance.total <= 0 &&
          result.data.balance_solo.total <= 0
        ) {
          setJoinPoolIsDown(false);
          setJoinPoolCommand(
            `curl -sSf -L https://1to.sh/join | sudo sh -s -- ${address}`
          );
          deleteSearchResult(result);
          return;
        }
        if (!result.interval) {
          setJoinPoolIsDown(true);
          setJoinPoolCommand(null);
          result.interval = setInterval(updateSearchResult, UPDATE_INTERVAL);
        }
        setSearchResults((results) => {
          if (results.indexOf(result) < 0) {
            return [result, ...results];
          }

          return [...results];
        });
      }
    }
  }

  function deleteSearchResult(searchResult: SearchResult) {
    const addressIndex = searchAddresses.indexOf(searchResult.address);
    if (addressIndex >= 0) {
      searchAddresses.splice(addressIndex, 1);
      saveSearchAddresses();
    }

    searchResult.interval && clearInterval(searchResult.interval);

    setSearchResults((results) => {
      const index = results.indexOf(searchResult);
      if (index < 0) {
        return results;
      }
      results.splice(index, 1);
      return [...results];
    });
  }
}
