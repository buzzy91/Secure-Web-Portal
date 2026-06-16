import { useState, useMemo } from "react";
import { Search, Star, RefreshCw, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct, type CoinMarket } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";
import BuyModal from "@/components/BuyModal";

type FilterTab = "Top" | "Trending" | "Gainers" | "Losers";
type SortKey = "market_cap" | "current_price" | "price_change_percentage_24h" | "total_volume";

export default function MarketsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("Top");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortAsc, setSortAsc] = useState(false);
  const [buyingCoin, setBuyingCoin] = useState<CoinMarket | null>(null);
  const [, navigate] = useLocation();
  const { toggleWatchlist, isWatchlisted } = useTransactions();

  const { data: markets = [], isFetching, refetch } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  const filtered = useMemo(() => {
    let list = [...markets];
    if (search) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()));
    if (filterTab === "Gainers") list = list.filter((c) => c.price_change_percentage_24h > 0).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    else if (filterTab === "Losers") list = list.filter((c) => c.price_change_percentage_24h < 0).sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    else if (filterTab === "Trending") list = list.sort((a, b) => b.total_volume - a.total_volume).slice(0, 20);
    else list = list.sort((a, b) => sortAsc ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number));
    return list;
  }, [markets, search, filterTab, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const totalMarketCap = markets.reduce((s, c) => s + c.market_cap, 0);
  const bullCount = markets.filter(c => c.price_change_percentage_24h > 0).length;
  const bullPct = markets.length > 0 ? Math.round((bullCount / markets.length) * 100) : 0;
  const topGainer = [...markets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];
  const topLoser = [...markets].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0];

  return (
    <div className="min-h-screen bg-[#060810] pb-20">
      <TopBar />

      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Markets</h2>
            <p className="text-gray-500 text-xs mt-0.5">{markets.length} coins · Live prices</p>
          </div>
          <button onClick={() => refetch()} className="w-9 h-9 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center">
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Market overview stats */}
        {markets.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-3">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Market Cap</p>
              <p className="text-white text-sm font-bold">{fmt(totalMarketCap)}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 bg-[#1e2530] rounded-full flex-1 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${bullPct}%` }} />
                </div>
                <span className="text-green-400 text-[10px]">{bullPct}% ↑</span>
              </div>
            </div>
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-3">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">24h Movers</p>
              {topGainer && (
                <div className="flex items-center gap-1 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-white text-xs font-semibold">{topGainer.symbol.toUpperCase()}</span>
                  <span className="text-green-400 text-xs ml-auto">{fmtPct(topGainer.price_change_percentage_24h)}</span>
                </div>
              )}
              {topLoser && (
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-white text-xs font-semibold">{topLoser.symbol.toUpperCase()}</span>
                  <span className="text-red-400 text-xs ml-auto">{fmtPct(topLoser.price_change_percentage_24h)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins…"
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {(["Top", "Trending", "Gainers", "Losers"] as FilterTab[]).map((t) => (
            <button key={t} onClick={() => setFilterTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filterTab === t
                  ? t === "Gainers" ? "bg-green-600 text-white" : t === "Losers" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                  : "bg-[#0d1117] text-gray-400 border border-[#1e2530]"
              }`}>
              {t === "Gainers" ? "🚀 " : t === "Losers" ? "📉 " : t === "Trending" ? "🔥 " : ""}{t}
            </button>
          ))}
        </div>

        {/* Sort header */}
        <div className="flex items-center gap-2 mb-1 px-2">
          <span className="text-gray-600 text-xs w-6">#</span>
          <span className="text-gray-600 text-xs flex-1">Name</span>
          <button onClick={() => toggleSort("current_price")}
            className={`text-xs whitespace-nowrap flex items-center gap-0.5 ${sortKey === "current_price" ? "text-white" : "text-gray-600"}`}>
            Price {sortKey === "current_price" ? (sortAsc ? "↑" : "↓") : "↕"}
          </button>
          <button onClick={() => toggleSort("price_change_percentage_24h")}
            className={`text-xs whitespace-nowrap w-14 text-right flex items-center justify-end gap-0.5 ${sortKey === "price_change_percentage_24h" ? "text-white" : "text-gray-600"}`}>
            24h {sortKey === "price_change_percentage_24h" ? (sortAsc ? "↑" : "↓") : "↕"}
          </button>
          <span className="w-10" />
        </div>

        {/* Coin list */}
        {markets.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Loading live market data…</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((coin, idx) => {
              const up = coin.price_change_percentage_24h >= 0;
              const starred = isWatchlisted(coin.id);
              return (
                <div key={coin.id} className="flex items-center gap-2.5 py-3.5 border-b border-[#0d1117] hover:bg-[#0d1117]/50 rounded-xl px-1 transition-colors">
                  <button onClick={() => toggleWatchlist(coin.id)} className="flex-shrink-0 w-7 flex items-center justify-center">
                    <Star className={`w-3.5 h-3.5 transition-colors ${starred ? "fill-yellow-400 text-yellow-400" : "text-gray-700 hover:text-gray-500"}`} />
                  </button>
                  <span className="text-gray-600 text-xs w-5 text-right flex-shrink-0">{idx + 1}</span>
                  <button onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center gap-2.5 flex-1 text-left min-w-0">
                    <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{coin.name}</p>
                      <p className="text-gray-500 text-[11px]">{coin.symbol.toUpperCase()} · {fmt(coin.market_cap)}</p>
                    </div>
                  </button>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-bold">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</p>
                  </div>
                  <div className={`rounded-lg px-2 py-1 text-xs font-bold w-16 text-center flex-shrink-0 ${up ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {up ? "▲" : "▼"}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                  <button onClick={() => setBuyingCoin(coin)}
                    className="flex-shrink-0 bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-0.5 hover:bg-blue-500 transition-colors">
                    <Zap className="w-3 h-3" />Buy
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
      {buyingCoin && <BuyModal coin={buyingCoin} onClose={() => setBuyingCoin(null)} />}
    </div>
  );
}
