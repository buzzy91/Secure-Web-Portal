import { useState, useMemo } from "react";
import { Search, Star, RefreshCw } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />
      <div className="px-4 pt-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coins..."
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl pl-9 pr-10 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          <button onClick={() => refetch()} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {(["Top", "Trending", "Gainers", "Losers"] as FilterTab[]).map((t) => (
            <button key={t} onClick={() => setFilterTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterTab === t ? "bg-blue-600 text-white" : "bg-[#0d1117] text-gray-400 border border-[#1e2530]"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Sort header */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-gray-500 text-xs w-6">#</span>
          <span className="text-gray-500 text-xs flex-1">Name</span>
          <button onClick={() => toggleSort("current_price")} className={`text-xs whitespace-nowrap flex items-center gap-0.5 ${sortKey === "current_price" ? "text-white" : "text-gray-500"}`}>
            Price {sortKey === "current_price" ? (sortAsc ? "↑" : "↓") : "↕"}
          </button>
          <button onClick={() => toggleSort("price_change_percentage_24h")} className={`text-xs whitespace-nowrap w-16 text-right flex items-center justify-end gap-0.5 ${sortKey === "price_change_percentage_24h" ? "text-white" : "text-gray-500"}`}>
            24h {sortKey === "price_change_percentage_24h" ? (sortAsc ? "↑" : "↓") : "↕"}
          </button>
        </div>

        {/* Coin list */}
        {markets.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">Loading live data…</div>
        ) : (
          <div>
            {filtered.map((coin) => {
              const up = coin.price_change_percentage_24h >= 0;
              return (
                <div key={coin.id} className="flex items-center gap-3 py-3 border-b border-[#1e2530]">
                  <button onClick={() => toggleWatchlist(coin.id)} className="flex-shrink-0">
                    <Star className={`w-4 h-4 ${isWatchlisted(coin.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                  </button>
                  <button onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center gap-3 flex-1 text-left">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{coin.name}</p>
                      <p className="text-gray-400 text-xs">{fmt(coin.market_cap)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</p>
                    </div>
                    <div className={`text-right w-16 text-sm font-medium ${up ? "text-green-400" : "text-red-400"}`}>
                      {up ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </button>
                  <button onClick={() => setBuyingCoin(coin)}
                    className="flex-shrink-0 bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-lg border border-blue-600/30 font-medium">
                    Buy
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
