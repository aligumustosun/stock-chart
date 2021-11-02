import React, { useState, useEffect } from "react";
import { IMatchedSymbol } from "../types";

const wrapperRef: React.RefObject<HTMLInputElement> = React.createRef();

function SearchInput(props: {
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { setSymbol } = props;
  const [searchedSymbols, setSearchedSymbols] = useState([]);
  let searchTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        wrapperRef &&
        !wrapperRef?.current?.contains(event.target as any) &&
        ![...(event.target as any).classList].includes("searchResult")
      ) {
        setSearchedSymbols([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function fetchSymbols(url: string) {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.bestMatches?.length) {
          setSearchedSymbols(
            data.bestMatches.map((matchedData: IMatchedSymbol) => ({
              symbol: matchedData["1. symbol"],
              name: matchedData["2. name"],
              currency: matchedData["8. currency"],
            }))
          );
        }
      });
  }

  function searchSymbol(e: React.ChangeEvent<HTMLInputElement>) {
    const keywords = e.target.value;

    const apiKey: string = process.env.REACT_APP_ALPHA_API_KEY || "";
    if (e.target.value === "" || apiKey === "") {
      setSearchedSymbols([]);
      return;
    }
    const baseUrl = "https://www.alphavantage.co/query";
    const searchParams = `?${new URLSearchParams({
      function: "SYMBOL_SEARCH",
      keywords,
      apikey: apiKey,
    })}`;
    const url = `${baseUrl}${searchParams}`;
    // prevent multiple requests while typing
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      fetchSymbols(url);
    }, 750);
  }

  function onSymbolClicked(e: React.MouseEvent<HTMLElement>) {
    setSymbol((e.target as any).id);
    setSearchedSymbols([]);
  }

  return (
    <div className="searchContainer">
      <label>
        <h4>Search Stocks</h4>
        <input
          ref={wrapperRef}
          className="searchInput"
          onChange={searchSymbol}
          placeholder="btc..."
        ></input>
        <div className="searchResultContainer">
          {searchedSymbols.map(({ symbol, name, currency }) => (
            <button
              className="searchResult"
              key={symbol}
              id={symbol}
              title={name}
              onClick={onSymbolClicked}
            >
              {symbol}/{currency}
            </button>
          ))}
        </div>
      </label>
    </div>
  );
}

export default SearchInput;
