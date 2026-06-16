import { useState } from "react";
import { Search, Star } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const coins = [
  { rank: 1, symbol: "B", name: "Bitcoin", cap: "$1.33T", price: "$66,569.00", change: "+1.31%", up: true, color: "#f7931a" },
  { rank: 2, symbol: "E", name: "Ethereum", cap: "$216.68B", price: "$1,795.38", change: "+3.96%", up: true, color: "#627eea" },
  { rank: 3, symbol: "T", name: "Tether", cap: "$186.43B", price: "$1.00", change: "+0.01%", up: true, color: "#26a17b" },
  { rank: 4, symbol: "B", name: "BNB", cap: "$82.77B", price: "$614.10", change: "-0.10%", up: false, color: "#f3ba2f" },
  { rank: 5, symbol: "X", name: "XRP", cap: "$77.03B", price: "$1.24", change: "+4.68%", up: true, color: "#00aae4" },
  { rank: 6, symbol: "U", name: "USDC", cap: "$74.99B", price: "$1.00", change: "+0.01%", up: true, color: "#2775ca" },
  { rank: 7, symbol: "S", name: "Solana", cap: "$43.48B", price: "$74.95", change: "+4.92%", up: true, color: "#9945ff" },
  { rank: 8, symbol: "D", name: "Dogecoin", cap: "$22.11B", price: "$0.152", change: "+2.31%", up: true, color: "#c2a633" },
  { rank: 9, symbol: "A", name: "Cardano", cap: "$18.50B", price: "$0.52", change: "+1.87%", up: true, color: "#0033ad" },
  { rank: 10, symbol: "P", name: "Polkadot", cap: "$12.30B", price: "$8.21", change: "-0.44%", up: false, color: "#e6007a" },
];

const tabs = ["Top", "Trending", "Gainers", "Losers"] as const;
type Tab = typeof tabs[number];

const sortKeys = ["Market Cap", "Price", "24h %", "Vol"] as const;

export default function MarketsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Top");
  const [search, setSearch] = useState("");

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />

      <div className="px-4 pt-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins..."
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tab chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t ? "bg-blue-600 text-white" : "bg-[#0d1117] text-gray-400 border border-[#1e2530]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort row */}
        <div className="flex items-center gap-4 mb-3 px-1">
          {sortKeys.map((s) => (
            <button key={s} className={`text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ${s === "Market Cap" ? "font-semibold text-white" : ""}`}>
              {s}
              {s === "Market Cap" ? (
                <span className="text-[10px]">↓</span>
              ) : (
                <span className="text-[10px] opacity-50">↑↓</span>
              )}
            </button>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center gap-2 px-1 mb-2">
          <span className="text-gray-500 text-xs w-5">#</span>
          <span className="text-gray-500 text-xs flex-1">Name</span>
          <span className="text-gray-500 text-xs w-24 text-right">Price</span>
          <span className="text-gray-500 text-xs w-16 text-right">24h %</span>
        </div>

        {/* Coin rows */}
        <div className="space-y-0">
          {filtered.map((coin) => (
            <div key={coin.rank} className="flex items-center gap-3 py-3.5 border-b border-[#1e2530]">
              <button className="flex-shrink-0 text-gray-600">
                <Star className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ backgroundColor: coin.color }}>
                {coin.symbol}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{coin.name}</p>
                <p className="text-gray-400 text-xs">{coin.cap}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-semibold">{coin.price}</p>
              </div>
              <div className={`text-right w-16 ${coin.up ? "text-green-400" : "text-red-400"} text-sm font-medium`}>
                {coin.up ? "▲" : "▼"} {coin.change.replace("+", "").replace("-", "")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
