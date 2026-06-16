import { useState } from "react";
import { Search, Globe, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";

type Tab = "Trending" | "Top" | "Watchlist";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Trending");
  const [, navigate] = useLocation();

  const { data: markets = [], isFetching, refetch } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  const gainers = [...markets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);
  const topMovers = gainers;
  const trending = gainers.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white text-xl font-bold">Community</h2>
            <p className="text-gray-400 text-xs">Join the conversation · 142,000 members online</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => refetch()} className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center text-gray-400">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center text-gray-400">
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">⚡</span>
              <span className="text-white font-semibold">Market Sentiment</span>
            </div>
            <span className="text-gray-400 text-xs">Live</span>
          </div>
          {markets.length > 0 ? (() => {
            const bullPct = Math.round((markets.filter(c => c.price_change_percentage_24h > 0).length / markets.length) * 100);
            return (
              <>
                <div className="flex items-end gap-3 mb-2">
                  <span className={`text-4xl font-bold ${bullPct >= 50 ? "text-green-400" : "text-red-400"}`}>{bullPct}%</span>
                  <div className="mb-1">
                    <p className="text-white font-semibold">{bullPct >= 50 ? "Bullish" : "Bearish"}</p>
                    <p className="text-gray-400 text-xs">Community consensus</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-red-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${bullPct}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-red-400 text-xs">Bearish {100 - bullPct}%</span>
                  <span className="text-green-400 text-xs">Bullish {bullPct}%</span>
                </div>
              </>
            );
          })() : <div className="h-16 flex items-center justify-center text-gray-500 text-sm">Loading…</div>}
        </div>

        {/* Trending Now */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-400 text-lg">🔥</span>
            <span className="text-white font-semibold">Trending Now</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {trending.map((c) => (
              <button key={c.id} onClick={() => navigate(`/coin/${c.id}`)}
                className="bg-[#0d1117] border border-[#1e2530] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold">{c.symbol.toUpperCase()}</span>
                <span className="text-green-400 text-xs">▲{fmtPct(c.price_change_percentage_24h)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span className="text-white font-semibold">Top Movers (24h)</span>
            </div>
            <button onClick={() => navigate("/markets")} className="text-blue-400 text-xs">See all &gt;</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topMovers.map((m) => {
              const up = m.price_change_percentage_24h >= 0;
              return (
                <button key={m.id} onClick={() => navigate(`/coin/${m.id}`)}
                  className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={m.image} alt={m.name} className="w-5 h-5 rounded-full" />
                    <p className="text-white text-sm font-bold">{m.symbol.toUpperCase()}</p>
                  </div>
                  <p className="text-gray-400 text-xs mb-1">{fmt(m.current_price, m.current_price < 1 ? 4 : 2)}</p>
                  <p className={`text-sm font-semibold ${up ? "text-green-400" : "text-red-400"}`}>
                    {up ? "↗" : "↙"} {fmtPct(m.price_change_percentage_24h)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab */}
        <div className="flex gap-0 mt-5 bg-[#0d1117] rounded-full p-1 border border-[#1e2530]">
          {(["Trending", "Top", "Watchlist"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === t ? "bg-white text-black" : "text-gray-400"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 mb-4">
          {(activeTab === "Top" ? [...markets].sort((a, b) => b.market_cap - a.market_cap).slice(0, 5) : topMovers).map((c) => {
            const up = c.price_change_percentage_24h >= 0;
            return (
              <button key={c.id} onClick={() => navigate(`/coin/${c.id}`)}
                className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl p-4 flex items-center gap-3 text-left">
                <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-gray-400 text-xs">{c.symbol.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{fmt(c.current_price, c.current_price < 1 ? 4 : 2)}</p>
                  <p className={`text-xs ${up ? "text-green-400" : "text-red-400"}`}>{fmtPct(c.price_change_percentage_24h)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
