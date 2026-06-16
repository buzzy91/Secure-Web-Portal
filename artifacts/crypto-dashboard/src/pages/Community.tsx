import { useState } from "react";
import { Search, Globe } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const topMovers = [
  { symbol: "XLM", price: "$0.22", change: "17.21%", up: true },
  { symbol: "UNI", price: "$3.05", change: "16.13%", up: true },
  { symbol: "HYPE", price: "$75.28", change: "11.60%", up: true },
  { symbol: "WLD", price: "$0.65", change: "11.30%", up: true },
];

const trending = [
  { symbol: "ZANO", change: "+12.34%" },
  { symbol: "PENGU", change: "+5.02%" },
  { symbol: "SPCXX", change: "+23.1%" },
];

const tabs = ["Trending", "Top", "Watchlist"] as const;
type Tab = typeof tabs[number];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Trending");

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-white text-xl font-bold">Community</h2>
            <p className="text-gray-400 text-xs">Join the conversation · 142,000 members online</p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center text-gray-400">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center text-gray-400">
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">⚡</span>
              <span className="text-white font-semibold">Market Sentiment</span>
            </div>
            <span className="text-gray-400 text-xs">Updated live</span>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-green-400 text-4xl font-bold">74%</span>
            <div className="mb-1">
              <p className="text-white font-semibold">Bullish</p>
              <p className="text-gray-400 text-xs">Community consensus</p>
            </div>
          </div>
          <div className="w-full h-2 bg-red-900/50 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "74%" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-red-400 text-xs">Bearish 26%</span>
            <span className="text-green-400 text-xs">Bullish 74%</span>
          </div>
        </div>

        {/* Trending Now */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-400 text-lg">🔥</span>
            <span className="text-white font-semibold">Trending Now</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {trending.map((t) => (
              <div key={t.symbol} className="bg-[#0d1117] border border-[#1e2530] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold">{t.symbol}</span>
                <span className="text-green-400 text-xs">▲{t.change}</span>
              </div>
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
            <button className="text-blue-400 text-xs">See all &gt;</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topMovers.map((m) => (
              <div key={m.symbol} className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3">
                <p className="text-white text-sm font-bold">{m.symbol}</p>
                <p className="text-gray-400 text-xs mb-1">{m.price}</p>
                <p className={`text-sm font-semibold ${m.up ? "text-green-400" : "text-red-400"}`}>
                  ↗ {m.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex gap-0 mt-5 bg-[#0d1117] rounded-full p-1 border border-[#1e2530]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === t ? "bg-white text-black" : "text-gray-400"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {[
            "Why is the market up today?",
            "Best DeFi strategies for 2025",
            "BTC reaching all-time high soon?",
          ].map((topic) => (
            <div key={topic} className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📋</span>
                <span className="text-white text-sm">{topic}</span>
              </div>
              <span className="text-gray-500 text-xs">&gt;</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
