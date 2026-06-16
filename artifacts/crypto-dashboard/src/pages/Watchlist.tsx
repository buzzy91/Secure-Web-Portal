import { Star, Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const watchlist = [
  { symbol: "B", name: "Bitcoin", sub: "BTC", price: "$66,569.00", change: "+1.31%", up: true, color: "#f7931a" },
  { symbol: "E", name: "Ethereum", sub: "ETH", price: "$1,795.38", change: "+3.96%", up: true, color: "#627eea" },
  { symbol: "S", name: "Solana", sub: "SOL", price: "$74.95", change: "+4.92%", up: true, color: "#9945ff" },
  { symbol: "X", name: "XRP", sub: "XRP", price: "$1.24", change: "+4.68%", up: true, color: "#00aae4" },
];

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Watchlist</h2>
          <button className="flex items-center gap-1 text-blue-400 text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {watchlist.map((coin) => (
            <div key={coin.name} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: coin.color }}>
                {coin.symbol}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{coin.name}</p>
                <p className="text-gray-400 text-xs">{coin.sub}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-semibold">{coin.price}</p>
                <p className={coin.up ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                  {coin.up ? "▲" : "▼"} {coin.change.replace("+", "").replace("-", "")}
                </p>
              </div>
              <button className="text-yellow-400 ml-1">
                <Star className="w-4 h-4 fill-yellow-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#0d1117] rounded-2xl border border-[#1e2530] p-6 text-center">
          <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Add more coins to your watchlist</p>
          <button className="mt-3 flex items-center gap-1 text-blue-400 text-sm mx-auto">
            <Plus className="w-4 h-4" /> Browse Markets
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
