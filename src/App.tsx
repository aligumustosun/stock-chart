import { useState, useEffect } from "react";
import "./index.scss";
import Chart from "./components/Chart";
import SearchInput from "./components/SearchInput";
import IntervalInput from "./components/IntervalInput";
import { IData, IResponseData, IResponse } from "./types";

function App() {
  const [symbol, setSymbol] = useState("");
  const [interval, setInterval] = useState("1min");
  const [data, setData] = useState([] as IData[]);

  useEffect(() => {
    getPriceData(symbol, interval).then((data) => {
      setData(data);
    });
  }, [symbol, interval]);

  async function getPriceData(
    symbol: string,
    interval: string
  ): Promise<IData[]> {
    const apiKey: string = process.env.REACT_APP_ALPHA_API_KEY || "";
    const baseUrl = "https://www.alphavantage.co/";
    const queryUrl = "query";
    const searchParams = `?${new URLSearchParams({
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval,
      apikey: apiKey,
    })}`;
    const url = `${baseUrl}${queryUrl}${searchParams}`;

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: IResponse) => {
        try {
          let parsedData: Array<IData> = Object.entries(
            data[`Time Series (${interval})`] as { prop: IResponseData }
          ).map(
            ([date, priceData]: [string, IResponseData]): IData => ({
              date: new Date(date),
              open: Number(priceData["1. open"]),
              high: Number(priceData["2. high"]),
              low: Number(priceData["3. low"]),
              close: Number(priceData["4. close"]),
              volume: Number(priceData["5. volume"]),
            })
          );
          return parsedData;
        } catch (err) {
          console.log("Err" + err);
          return [];
        }
      });
  }

  return (
    <div className="App">
      <div className="App-header">
        <SearchInput setSymbol={setSymbol} />
        <IntervalInput
          interval={interval}
          setInterval={setInterval}
        ></IntervalInput>
      </div>
      <Chart data={data} />
    </div>
  );
}

export default App;
