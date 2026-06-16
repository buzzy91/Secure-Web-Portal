const BASE = "https://api.coingecko.com/api/v3";

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    ath: { usd: number };
    atl: { usd: number };
  };
  description: { en: string };
}

export interface OHLCEntry {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function getMarkets(page = 1, perPage = 50): Promise<CoinMarket[]> {
  const url = `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko API error");
  return res.json();
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const url = `${BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko coin detail error");
  return res.json();
}

export async function getCoinChart(id: string, days: number | string): Promise<{ prices: [number, number][] }> {
  const url = `${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko chart error");
  return res.json();
}

export async function getTrendingCoins(): Promise<{ item: { id: string; name: string; symbol: string; thumb: string; price_btc: number } }[]> {
  const res = await fetch(`${BASE}/search/trending`);
  if (!res.ok) throw new Error("CoinGecko trending error");
  const data = await res.json();
  return data.coins;
}

export function fmt(n: number, decimals = 2): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  return `$${n.toFixed(decimals > 4 ? 6 : decimals)}`;
}

export function fmtPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
