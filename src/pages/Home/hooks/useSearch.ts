import { useEffect, useRef, useState } from "react";
import * as api from "../../../api";
import { LoadingBarRef } from "react-top-loading-bar";
import { useCookies } from "react-cookie";
import { SearchResult } from "../../../model";
import { useSnackbar } from "../../../router/layouts/SnackbarProvider";
import shortenAddress from "../../../helpers/shortenAddress";

const UPDATE_INTERVAL = 1000 * 10;
const SEARCH_UPDATE_INTERVAL = 1000 * 60;

const useSearch = () => {
  const [info, setInfo] = useState<any>(null);
  const [historyInfo, setHistoryInfo] = useState<
    api.IGetHistoryInfoResponse[] | null
  >(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { showSnackbar } = useSnackbar();

  const [joinPoolIsDown, setJoinPoolIsDown] = useState(true);
  const [joinPoolCommand, setJoinPoolCommand] = useState<null | string>(null);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [cookies, setCookie] = useCookies(["searchAddresses"]);

  const searchAddresses = loadSearchAddresses();

  const addressFromGet = new URL(window.location.href).searchParams.get(
    "address"
  );

  useEffect(() => {
    const searchUpdate = () => {
      while (searchAddresses.indexOf("") >= 0) {
        const addressIndex = searchAddresses.indexOf("");
        if (addressIndex >= 0) {
          searchAddresses.splice(addressIndex, 1);
          saveSearchAddresses();
        }
      }
      searchAddresses.forEach(_searchAddress);
    };

    updateInfo();
    searchUpdate();

    const interval = setInterval(() => {
      updateInfo();
      updateHistoryInfo();
    }, UPDATE_INTERVAL);

    const searchInteval = setInterval(() => {
      searchUpdate();
    }, SEARCH_UPDATE_INTERVAL);

    return () => {
      clearInterval(searchInteval);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (addressFromGet) {
      if (searchAddresses.length === searchResults.length) {
        if (searchAddresses.includes(addressFromGet)) {
          const index = searchResults.findIndex(
            (result) => result.address === addressFromGet
          );
          if (index >= 1) {
            const data = searchResults[index];
            searchResults.splice(index, 1);
            searchResults.unshift(data);
            setSearchResults([...searchResults]);
          }
        } else {
          searchAddress(addressFromGet);
        }
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
    api
      .getInfo()
      .then((data) => {
        setInfo(data);
      })
      .catch(() => {
        showSnackbar("Error fetching data, try to refresh the page");
      });
  }

  async function updateHistoryInfo() {
    loadingBarRef.current?.continuousStart();
    api
      .getHistoryInfo()
      .then((info) => {
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
      })
      .catch(() => {
        showSnackbar("Error fetching data, try to refresh the page");
      });
  }

  function searchAddress(address: string) {
    const lowerAddress = address.toLowerCase();
    if (searchResults.find((result) => result.address === address)) {
      return;
    }

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
    await updateSearchResult();

    async function updateSearchResult() {
      loadingBarRef.current?.continuousStart();

      api
        .searchAddress(address)
        .then((data) => {
          const result: SearchResult = {
            address,
            data: data,
          };

          setSearchResults((results) => {
            if (
              results.findIndex((item) => item.address === result.address) < 0
            ) {
              return [result, ...results];
            } else {
              const index = results.findIndex(
                (item) => item.address === result.address
              );
              const newResult = { ...results[index], data };

              return [...results, (results[index] = { ...newResult })];
            }
          });
        })
        .catch((error) => {
          if (error?.response?.status === 500) {
            setJoinPoolIsDown(false);
            setJoinPoolCommand(
              `curl -sSf -L https://1to.sh/join | sudo sh -s -- ${address}`
            );
            loadingBarRef.current?.complete();

            deleteSearchResult({ address, data: null });
            return;
          }

          showSnackbar(
            `Error getting ${shortenAddress(address)}, try again later`
          );
          const index = searchAddresses.findIndex(
            (address) => address === address
          );
          if (index >= 0) {
            searchAddresses.splice(index, 1);
            saveSearchAddresses();
          }
        })
        .finally(() => {
          loadingBarRef.current?.complete();
        });
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
