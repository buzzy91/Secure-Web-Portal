import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";
import AssetsModal from "@/components/AssetsModal";
import PerformanceChart from "@/components/PerformanceChart";

const assets = [
  { symbol: "B", name: "Bitcoin", sub: "2.845032 BTC", value: "$189,390.94", change: "+1.31%", color: "#f7931a" },
  { symbol: "E", name: "Ethereum", sub: "48.912 ETH", value: "$87,815.63", change: "+3.96%", color: "#627eea" },
  { symbol: "T", name: "Tether", sub: "427,009.43 USDT", value: "$426,728.03", change: "+0.01%", color: "#26a17b" },
  { symbol: "U", name: "USD Coin", sub: "1,000,000 USDC", value: "$999,785.00", change: "+0.01%", color: "#2775ca" },
];

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAssets, setShowAssets] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "transaction">("overview");

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />

      <div className="overflow-y-auto">
        {/* Portfolio card */}
        <div className="mx-4 mt-4 bg-[#0d1826] rounded-2xl p-4 border border-[#1e2d3d]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#4f7dfa" className="w-4 h-4">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="#4f7dfa" strokeWidth="2" fill="none" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#4f7dfa" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Raymond's Portfolio</p>
                <p className="text-green-400 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  VERIFIED
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-green-500 text-green-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M12 1L3 5.5v6.5c0 5 3.8 9.7 9 10.9 5.2-1.2 9-5.9 9-10.9V5.5L12 1z" />
                </svg>
                CLEARED
              </span>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400">
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-xs mb-1">Total Portfolio Value</p>
          <p className="text-white text-3xl font-bold mb-1">
            {hideBalance ? "••••••••" : "$755,894.450"}
          </p>
          <p className="text-gray-400 text-xs mb-2">USDT</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↗ +0.001%
            </span>
            <span className="text-gray-400">+$1,234,567.89 all time</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-3 mx-4 mt-4">
          {[
            { label: "Send", icon: "↗", color: "#c47d1a", bg: "#2a1e0a" },
            { label: "Receive", icon: "↙", color: "#1a9c6b", bg: "#0a2019" },
            { label: "Withdraw", icon: "💳", color: "#4f7dfa", bg: "#0a1226" },
            { label: "Swap", icon: "↺", color: "#8b5cf6", bg: "#160f2a" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-2xl p-3"
              style={{ backgroundColor: action.bg }}
            >
              <span className="text-xl" style={{ color: action.color }}>{action.icon}</span>
              <span className="text-xs font-medium" style={{ color: action.color }}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Tab selector */}
        <div className="mx-4 mt-4 bg-[#0d1117] rounded-full flex p-1 border border-[#1e2530]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-white text-black" : "text-gray-400"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "transaction" ? "bg-white text-black" : "text-gray-400"}`}
          >
            Transaction
          </button>
        </div>

        {activeTab === "overview" ? (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
              {[
                { label: "TOTAL INVESTED", value: "$755,894.450", sub: "Available" },
                { label: "ALL-TIME P&L", value: "+$1.23M", sub: "Since inception" },
                { label: "ASSETS HELD", value: "4", sub: "Coins & tokens" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530]">
                  <p className="text-gray-500 text-[9px] font-semibold tracking-wide uppercase mb-1">{s.label}</p>
                  <p className="text-white text-xs font-bold">{s.value}</p>
                  <p className="text-gray-500 text-[10px]">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Performance chart */}
            <div className="mx-4 mt-4">
              <PerformanceChart />
            </div>
          </>
        ) : (
          <div className="mx-4 mt-4">
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-6 text-center">
              <p className="text-gray-400 text-sm">No recent transactions</p>
            </div>
          </div>
        )}

        {/* My Assets */}
        <div className="mx-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">My Assets</p>
              <p className="text-gray-400 text-xs">4 holdings · Available for withdrawal</p>
            </div>
            <button className="flex items-center gap-1 text-blue-400 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.name} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: asset.color }}>
                    {asset.symbol}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{asset.name}</p>
                  <p className="text-gray-400 text-xs">{asset.sub}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{asset.value}</p>
                  <p className="text-green-400 text-xs">{asset.change}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Chat bubble */}
        <div className="fixed bottom-20 right-4 z-30">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg cursor-pointer relative">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm-6 0a10 10 0 1 1 20 0A10 10 0 0 1 2 12z" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
          </div>
        </div>
      </div>

      <BottomNav />

      {showWelcome && (
        <WelcomeModal onViewAssets={() => { setShowWelcome(false); setShowAssets(true); }} onClose={() => setShowWelcome(false)} />
      )}
      {showAssets && (
        <AssetsModal onProceed={() => setShowAssets(false)} onClose={() => setShowAssets(false)} />
      )}
    </div>
  );
}
