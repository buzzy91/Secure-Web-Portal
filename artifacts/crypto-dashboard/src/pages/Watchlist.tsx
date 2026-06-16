import { useState } from "react";
import { Star, Plus, Search, Bell, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";
import BuyModal from "@/components/BuyModal";
import type { CoinMarket } from "@/services/coingecko";

type View = "list" | "performance";

export default function WatchlistPage() {
  const [, navigate] = useLocation();
  const { watchlist, toggleWatchlist } = useTransactions();
  const [buyingCoin, setBuyingCoin] = useState<CoinMarket | null>(null);
  const [view, setView] = useState<View>("list");
  const [alertTarget, setAlertTarget] = useState<string | null>(null);

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  const watchlistCoins = markets.filter((c) => watchlist.includes(c.id));
  const gainers = watchlistCoins.filter(c => c.price_change_percentage_24h > 0);
  const losers = watchlistCoins.filter(c => c.price_change_percentage_24h < 0);

  return (
    <div className="min-h-screen bg-[#060810] pb-20">
      <TopBar />

      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Watchlist</h2>
            <p className="text-gray-500 text-xs mt-0.5">{watchlistCoins.length} coins tracked · Live</p>
          </div>
          <div className="flex items-center gap-2">
            {watchlistCoins.length > 0 && (
              <div className="flex bg-[#0d1117] rounded-xl border border-[#1e2530] p-0.5">
                <button onClick={() => setView("list")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "list" ? "bg-white text-black" : "text-gray-400"}`}>List</button>
                <button onClick={() => setView("performance")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "performance" ? "bg-white text-black" : "text-gray-400"}`}>7d</button>
              </div>
            )}
            <button onClick={() => navigate("/markets")}
              className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {watchlistCoins.length === 0 ? (
          /* Empty state */
          <div className="mt-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center mx-auto mb-5">
                <Star className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">No coins watched yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">Star coins on the Markets page to track their price here</p>
            </div>
            <button onClick={() => navigate("/markets")}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Browse Markets
            </button>

            {/* Suggestion cards */}
            <div className="mt-6">
              <p className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Popular to Watch</p>
              {isLoading ? (
                <div className="text-center text-gray-600 text-sm py-4">Loading…</div>
              ) : (
                <div className="space-y-2">
                  {markets.slice(0, 4).map((coin) => {
                    const up = coin.price_change_percentage_24h >= 0;
                    return (
                      <div key={coin.id} className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-3.5 flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-semibold">{coin.name}</p>
                          <p className="text-gray-500 text-xs">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</p>
                        </div>
                        <p className={`text-sm font-bold mr-2 ${up ? "text-green-400" : "text-red-400"}`}>{fmtPct(coin.price_change_percentage_24h)}</p>
                        <button onClick={() => toggleWatchlist(coin.id)}
                          className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
                          <Star className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : view === "list" ? (
          <>
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530] text-center">
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Watched</p>
                <p className="text-white text-sm font-bold">{watchlistCoins.length}</p>
              </div>
              <div className="bg-green-900/20 rounded-xl p-3 border border-green-800/30 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <p className="text-green-400 text-[10px] uppercase font-bold">Up</p>
                </div>
                <p className="text-green-400 text-sm font-bold">{gainers.length}</p>
              </div>
              <div className="bg-red-900/20 rounded-xl p-3 border border-red-800/30 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <p className="text-red-400 text-[10px] uppercase font-bold">Down</p>
                </div>
                <p className="text-red-400 text-sm font-bold">{losers.length}</p>
              </div>
            </div>

            {/* Coin cards */}
            <div className="space-y-2.5">
              {watchlistCoins.map((coin) => {
                const up = coin.price_change_percentage_24h >= 0;
                const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
                const hasAlert = alertTarget === coin.id;
                return (
                  <div key={coin.id} className="bg-[#0d1117] rounded-2xl border border-[#1e2530] overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      <button onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center gap-3 flex-1 text-left min-w-0">
                        <div className="relative">
                          <img src={coin.image} alt={coin.name} className="w-11 h-11 rounded-full" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0d1117] ${up ? "bg-green-400" : "bg-red-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold">{coin.name}</p>
                          <p className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-semibold ${up ? "text-green-400" : "text-red-400"}`}>
                              {up ? "▲" : "▼"}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}% 24h
                            </span>
                            {change7d !== 0 && (
                              <span className={`text-[10px] ${change7d >= 0 ? "text-green-300/60" : "text-red-300/60"}`}>
                                {change7d >= 0 ? "+" : ""}{change7d.toFixed(2)}% 7d
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                      <div className="text-right mr-1 flex-shrink-0">
                        <p className="text-white text-sm font-bold">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</p>
                        <p className="text-gray-500 text-xs">{fmt(coin.market_cap)}</p>
                      </div>
                    </div>
                    <div className="flex border-t border-[#1e2530]">
                      <button onClick={() => setBuyingCoin(coin)}
                        className="flex-1 py-2.5 text-xs font-semibold text-green-400 flex items-center justify-center gap-1 hover:bg-green-900/20 transition-colors border-r border-[#1e2530]">
                        <Zap className="w-3.5 h-3.5" /> Buy
                      </button>
                      <button onClick={() => setAlertTarget(hasAlert ? null : coin.id)}
                        className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border-r border-[#1e2530] ${hasAlert ? "text-yellow-400 bg-yellow-900/10" : "text-gray-400 hover:bg-[#1e2530]"}`}>
                        <Bell className="w-3.5 h-3.5" /> Alert {hasAlert ? "On" : ""}
                      </button>
                      <button onClick={() => toggleWatchlist(coin.id)}
                        className="flex-1 py-2.5 text-xs font-semibold text-yellow-400 flex items-center justify-center gap-1 hover:bg-yellow-900/10 transition-colors">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" /> Unwatch
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* 7d performance view */
          <div>
            <p className="text-gray-400 text-xs mb-3">7-day price change across your watchlist</p>
            <div className="space-y-3">
              {[...watchlistCoins].sort((a, b) => (b.price_change_percentage_7d_in_currency ?? 0) - (a.price_change_percentage_7d_in_currency ?? 0)).map((coin) => {
                const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
                const up = change7d >= 0;
                const barWidth = Math.min(Math.abs(change7d) * 4, 100);
                return (
                  <div key={coin.id} className="bg-[#0d1117] rounded-xl border border-[#1e2530] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{coin.name}</p>
                        <p className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</p>
                      </div>
                      <p className={`text-sm font-bold ${up ? "text-green-400" : "text-red-400"}`}>
                        {up ? "+" : ""}{change7d.toFixed(2)}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#0a0b0f] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${up ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs w-12 text-right">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
      {buyingCoin && <BuyModal coin={buyingCoin} onClose={() => setBuyingCoin(null)} />}
    </div>
  );
}
