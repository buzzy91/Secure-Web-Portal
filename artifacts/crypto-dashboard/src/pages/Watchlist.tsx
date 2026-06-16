import { useState } from "react";
import { Star, Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";
import BuyModal from "@/components/BuyModal";
import type { CoinMarket } from "@/services/coingecko";

export default function WatchlistPage() {
  const [, navigate] = useLocation();
  const { watchlist, toggleWatchlist } = useTransactions();
  const [buyingCoin, setBuyingCoin] = useState<CoinMarket | null>(null);

  const { data: markets = [] } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  const watchlistCoins = markets.filter((c) => watchlist.includes(c.id));

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-xl font-bold">Watchlist</h2>
            <p className="text-gray-400 text-xs">{watchlistCoins.length} coins tracked</p>
          </div>
          <button onClick={() => navigate("/markets")} className="flex items-center gap-1 text-blue-400 text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {watchlistCoins.length === 0 ? (
          <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-8 text-center mt-4">
            <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-1">Your watchlist is empty</p>
            <p className="text-gray-500 text-xs mb-4">Star coins on the Markets page to track them here</p>
            <button onClick={() => navigate("/markets")} className="flex items-center gap-1 text-blue-400 text-sm mx-auto">
              <Search className="w-4 h-4" /> Browse Markets
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlistCoins.map((coin) => {
              const up = coin.price_change_percentage_24h >= 0;
              return (
                <div key={coin.id} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
                  <div className="flex items-center gap-3">
                    <button onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center gap-3 flex-1 text-left">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{coin.name}</p>
                        <p className="text-gray-400 text-xs">{coin.symbol.toUpperCase()} · {fmt(coin.market_cap)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">{fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}</p>
                        <p className={`text-xs ${up ? "text-green-400" : "text-red-400"}`}>{fmtPct(coin.price_change_percentage_24h)}</p>
                      </div>
                    </button>
                    <div className="flex flex-col gap-2 ml-2">
                      <button onClick={() => setBuyingCoin(coin)} className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-lg border border-green-600/30">Buy</button>
                      <button onClick={() => toggleWatchlist(coin.id)} className="text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 7d sparkline summary */}
        {watchlistCoins.length > 0 && (
          <div className="mt-5 bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
            <p className="text-white font-semibold mb-3">7d Performance</p>
            <div className="space-y-2">
              {watchlistCoins.map((coin) => {
                const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
                const up = change7d >= 0;
                const barWidth = Math.min(Math.abs(change7d) * 5, 100);
                return (
                  <div key={coin.id} className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                    <p className="text-gray-400 text-xs w-16 truncate">{coin.symbol.toUpperCase()}</p>
                    <div className="flex-1 h-2 bg-[#0a0b0f] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${up ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
                    </div>
                    <p className={`text-xs font-medium w-14 text-right ${up ? "text-green-400" : "text-red-400"}`}>
                      {fmtPct(change7d)}
                    </p>
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
