// Types pour les données financières

export interface QuoteResponse {
  symbol: string;
  price: number;
  currency: string;
  shortName?: string;
  longName?: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface YahooQuoteData {
  symbol: string;
  regularMarketPrice: number;
  currency: string;
  shortName?: string;
  longName?: string;
}

export interface YahooCandleData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CrosshairData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SearchResult {
  symbol: string;
  description: string;
}

export interface FinnhubSearchResponse {
  count: number;
  result: SearchResult[];
}

export type TimeInterval = "1m" | "5m" | "15m" | "30m" | "60m" | "1d" | "1wk" | "1mo";

export interface IntervalOption {
  label: string;
  days: number;
  interval: TimeInterval;
}