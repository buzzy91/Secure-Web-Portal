import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Plus, ArrowUpRight, AlertTriangle } from "lucide-react";
import { TOTAL_SENT, WALLET_TRANSACTIONS } from "@/data/walletHistory";
import { useQuery } from "@tanstack/react-query";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";
import AssetsModal from "@/components/AssetsModal";
import PerformanceChart from "@/components/PerformanceChart";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";

const PORTFOLIO_COINS = ["bitcoin", "ethereum", "tether"];
const PORTFOLIO_AMOUNTS: Record<string, number> = {
  bitcoin: 0.002,
  ethereum: 0.15,
  tether: 298.55,
};

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAssets, setShowAssets] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "transaction">("overview");
  const [, navigate] = useLocation();
  const { transactions, holdings, totalInvested } = useTransactions();

  const { data: markets } = useQuery({
    queryKey: ["markets-portfolio"],
    queryFn: () => getMarkets(1, 50),
    refetchInterval: 30_000,
  });

  const portfolioCoins = markets?.filter((c) => PORTFOLIO_COINS.includes(c.id)) ?? [];

  const portfolioValue = portfolioCoins.reduce((sum, coin) => {
    return sum + (PORTFOLIO_AMOUNTS[coin.id] ?? 0) * coin.current_price;
  }, 0);

  const displayValue = portfolioValue > 0 ? portfolioValue : 701.0;

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />
      <div className="overflow-y-auto">
        {/* Portfolio card */}
        <div className="mx-4 mt-4 bg-[#0d1826] rounded-2xl p-4 border border-[#1e2d3d]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4f7dfa" strokeWidth="2" className="w-4 h-4">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Charles's Portfolio</p>
                <p className="text-green-400 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />VERIFIED
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-green-500 text-green-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M12 1L3 5.5v6.5c0 5 3.8 9.7 9 10.9 5.2-1.2 9-5.9 9-10.9V5.5L12 1z" /></svg>
                CLEARED
              </span>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400">
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-xs mb-1">Total Portfolio Value</p>
          <p className="text-white text-3xl font-bold mb-1">
            {hideBalance ? "••••••••" : `$${displayValue.toFixed(2)}`}
          </p>
          <p className="text-gray-400 text-xs mb-2">USDT</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">↗ +0.001%</span>
            <span className="text-gray-400">+$12.89 all time</span>
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
            <button key={action.label} className="flex flex-col items-center gap-2 rounded-2xl p-3" style={{ backgroundColor: action.bg }}>
              <span className="text-xl" style={{ color: action.color }}>{action.icon}</span>
              <span className="text-xs font-medium" style={{ color: action.color }}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Tab selector */}
        <div className="mx-4 mt-4 bg-[#0d1117] rounded-full flex p-1 border border-[#1e2530]">
          {(["overview", "transaction"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium capitalize transition-colors ${activeTab === t ? "bg-white text-black" : "text-gray-400"}`}>
              {t === "transaction" ? "Transactions" : "Overview"}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
              {[
                { label: "PORTFOLIO", value: `$${displayValue.toFixed(2)}`, sub: "Available" },
                { label: "TOTAL INVESTED", value: totalInvested > 0 ? fmt(totalInvested) : "$701.00", sub: "All time" },
                { label: "ASSETS HELD", value: String(Math.max(portfolioCoins.length, 3)), sub: "Coins" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530]">
                  <p className="text-gray-500 text-[9px] font-semibold tracking-wide uppercase mb-1">{s.label}</p>
                  <p className="text-white text-xs font-bold">{s.value}</p>
                  <p className="text-gray-500 text-[10px]">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mx-4 mt-4"><PerformanceChart /></div>
          </>
        ) : (
          <div className="mx-4 mt-4">
            {transactions.length === 0 ? (
              <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-8 text-center">
                <p className="text-gray-400 text-sm mb-3">No transactions yet</p>
                <button onClick={() => navigate("/markets")} className="text-blue-400 text-sm flex items-center gap-1 mx-auto">
                  <ArrowUpRight className="w-4 h-4" /> Go to Markets to Buy
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="bg-[#0d1117] rounded-xl p-4 border border-[#1e2530] flex items-center gap-3">
                    <img src={tx.coinImage} alt={tx.coinName} className="w-9 h-9 rounded-full" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{tx.coinName}</p>
                      <p className="text-gray-400 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "buy" ? "+" : "-"}{tx.amount} {tx.coinSymbol.toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs">${tx.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wallet Activity Alert */}
        <div className="mx-4 mt-5">
          <button onClick={() => navigate("/wallet-activity")}
            className="w-full bg-red-950/40 border border-red-800/50 rounded-2xl p-4 flex items-start gap-3 text-left hover:border-red-600/60 transition-colors">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-red-400 text-sm font-semibold mb-1">Wallet Activity — Evidence Record</p>
              <p className="text-gray-300 text-xs leading-relaxed">
                {WALLET_TRANSACTIONS.filter(t => t.type === "sent").length} outbound USDT transfers detected · <span className="text-red-400 font-bold">{TOTAL_SENT.toFixed(1)} USDT drained</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {WALLET_TRANSACTIONS.filter(t => t.type === "sent").slice(0, 3).map(tx => (
                  <span key={tx.id} className="text-[10px] bg-red-900/30 text-red-300 px-2 py-0.5 rounded-full border border-red-800/40">
                    -{tx.amount} USDT · {tx.date.replace("Jun ", "Jun ")} {tx.time}
                  </span>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4 flex-shrink-0 mt-0.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {/* My Assets */}
        <div className="mx-4 mt-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">My Assets</p>
              <p className="text-gray-400 text-xs">{portfolioCoins.length} holdings · Available for withdrawal</p>
            </div>
            <button onClick={() => navigate("/markets")} className="flex items-center gap-1 text-blue-400 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {portfolioCoins.length > 0 ? portfolioCoins.map((coin) => {
              const amount = PORTFOLIO_AMOUNTS[coin.id] ?? 0;
              const value = amount * coin.current_price;
              const up = coin.price_change_percentage_24h >= 0;
              return (
                <button key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                  className="w-full bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3 text-left">
                  <div className="relative">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{coin.name}</p>
                    <p className="text-gray-400 text-xs">{amount} {coin.symbol.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">${value.toFixed(2)}</p>
                    <p className={`text-xs ${up ? "text-green-400" : "text-red-400"}`}>{fmtPct(coin.price_change_percentage_24h)}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4 flex-shrink-0"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              );
            }) : (
              /* Fallback static assets */
              [
                { id: "bitcoin", name: "Bitcoin", symbol: "BTC", amount: "0.00200000", value: "$133.14", change: "+1.31%", up: true, color: "#f7931a", letter: "B" },
                { id: "ethereum", name: "Ethereum", symbol: "ETH", amount: "0.15000000", value: "$269.31", change: "+3.96%", up: true, color: "#627eea", letter: "E" },
                { id: "tether", name: "Tether", symbol: "USDT", amount: "298.55", value: "$298.55", change: "+0.01%", up: true, color: "#26a17b", letter: "T" },
              ].map((a) => (
                <button key={a.id} onClick={() => navigate(`/coin/${a.id}`)}
                  className="w-full bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3 text-left">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: a.color }}>{a.letter}</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{a.name}</p>
                    <p className="text-gray-400 text-xs">{a.amount} {a.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{a.value}</p>
                    <p className={`text-xs ${a.up ? "text-green-400" : "text-red-400"}`}>{a.change}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4 flex-shrink-0"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Holdings from transactions */}
        {holdings.length > 0 && (
          <div className="mx-4 mb-4">
            <p className="text-white font-semibold mb-3">My Holdings</p>
            <div className="space-y-3">
              {holdings.map((h) => {
                const livePrice = markets?.find((m) => m.id === h.coinId)?.current_price ?? 0;
                const currentValue = h.amount * livePrice;
                const pnl = currentValue - h.totalInvested;
                return (
                  <div key={h.coinId} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3">
                    <img src={h.coinImage} alt={h.coinName} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{h.coinName}</p>
                      <p className="text-gray-400 text-xs">{h.amount.toFixed(6)} {h.coinSymbol.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">${currentValue.toFixed(2)}</p>
                      <p className={`text-xs ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chat bubble */}
      <div className="fixed bottom-20 right-4 z-30">
        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg cursor-pointer relative">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm-6 0a10 10 0 1 1 20 0A10 10 0 0 1 2 12z" /></svg>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
        </div>
      </div>

      <BottomNav />

      {showWelcome && <WelcomeModal onViewAssets={() => { setShowWelcome(false); setShowAssets(true); }} onClose={() => setShowWelcome(false)} />}
      {showAssets && <AssetsModal onProceed={() => setShowAssets(false)} onClose={() => setShowAssets(false)} portfolioValue={displayValue} />}
    </div>
  );
}
