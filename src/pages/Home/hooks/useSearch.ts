import { useEffect, useRef, useState } from "react";
import * as api from "../../../api";
import { LoadingBarRef } from "react-top-loading-bar";
import { useCookies } from "react-cookie";
import { SearchResult } from "../../../model";

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes;

const useSearch = () => {
  const [info, setInfo] = useState<any>(null);
  const [historyInfo, setHistoryInfo] = useState<
    api.IGetHistoryInfoResponse[] | null
  >(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [joinPoolIsDown, setJoinPoolIsDown] = useState(true);
  const [joinPoolCommand, setJoinPoolCommand] = useState<null | string>(null);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [cookies, setCookie] = useCookies(["searchAddresses"]);

  const searchAddresses = loadSearchAddresses();

  const addressFromGet = new URL(window.location.href).searchParams.get(
    "address"
  );

  useEffect(() => {
    updateInfo();
    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (addressFromGet) {
  //     searchAddress(addressFromGet);
  //   }
  // }, [addressFromGet]);

  useEffect(() => {
    if (addressFromGet) {
      const index = searchResults.findIndex(
        (result) => result.address === addressFromGet
      );
      if (index >= 0) {
        const data = searchResults[index];
        searchResults.splice(index, 0);
        searchResults.unshift(data);
      } else {
        searchAddress(addressFromGet);
      }
    }
  }, [searchResults, addressFromGet]);

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
    const lowerAddress = address.toLowerCase();

    if (searchAddresses.includes(lowerAddress)) {
      setJoinPoolIsDown(true);
      setJoinPoolCommand(null);
      loadingBarRef.current?.continuousStart();
      loadingBarRef.current?.complete();
      return;
    }
    searchAddresses.unshift(lowerAddress);
    saveSearchAddresses();

    _searchAddress(lowerAddress);
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

      try {
        result.data = await api.searchAddress(address);

        loadingBarRef.current?.complete();

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
      } catch {
        setJoinPoolIsDown(false);
        setJoinPoolCommand(
          `curl -sSf -L https://1to.sh/join | sudo sh -s -- ${address}`
        );
        loadingBarRef.current?.complete();

        deleteSearchResult(result);
      }
    }
  }

  function deleteSearchResult(searchResult: SearchResult) {
    if (addressFromGet === searchResult.address) {
      window.history.pushState({}, document.title, window.location.pathname);
    }

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
};

export default useSearch;
