export interface IData {
  date: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface IResponseData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface IResponse {
  "Time Series (1min)": { prop: IResponseData };
  "Time Series (5min)": { prop: IResponseData };
  "Time Series (15min)": { prop: IResponseData };
  "Time Series (30min)": { prop: IResponseData };
  "Time Series (60min)": { prop: IResponseData };
}

export interface IMatchedSymbol {
  "1. symbol": string;
  "2. name": string;
  "8. currency": string;
}