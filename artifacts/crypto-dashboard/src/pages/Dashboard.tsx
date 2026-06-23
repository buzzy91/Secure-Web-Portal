import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Plus, AlertTriangle, TrendingUp, TrendingDown, Zap, Gift, Bell, ShieldAlert, X, ArrowUpRight, ArrowDownLeft, ArrowDown, RefreshCw, PhoneCall } from "lucide-react";
import { TOTAL_SENT, WALLET_TRANSACTIONS } from "@/data/walletHistory";
import { useQuery } from "@tanstack/react-query";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import WelcomeModal from "@/components/WelcomeModal";
import AssetsModal from "@/components/AssetsModal";
import WithdrawModal from "@/components/WithdrawModal";
import PerformanceChart from "@/components/PerformanceChart";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";

const PORTFOLIO_COINS = ["bitcoin", "ethereum", "tether"];
const PORTFOLIO_AMOUNTS: Record<string, number> = {
  bitcoin: 0.002,
  ethereum: 0.15,
  tether: 298.55,
};
const COIN_COLORS: Record<string, string> = {
  bitcoin: "#f7931a",
  ethereum: "#627eea",
  tether: "#26a17b",
};

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAssets, setShowAssets] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "transaction">("overview");
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [, navigate] = useLocation();
  const { transactions, holdings, totalInvested } = useTransactions();

  const { data: markets } = useQuery({
    queryKey: ["markets-portfolio"],
    queryFn: () => getMarkets(1, 50),
    refetchInterval: 30_000,
  });

  const portfolioCoins = markets?.filter((c) => PORTFOLIO_COINS.includes(c.id)) ?? [];
  const portfolioValue = portfolioCoins.reduce((sum, coin) => sum + (PORTFOLIO_AMOUNTS[coin.id] ?? 0) * coin.current_price, 0);
  const displayValue = portfolioValue > 0 ? portfolioValue : 701.0;

  const totalPortfolio = portfolioCoins.reduce((s, c) => s + (PORTFOLIO_AMOUNTS[c.id] ?? 0) * c.current_price, 0) || 701;
  const allCoinsUp = portfolioCoins.every(c => c.price_change_percentage_24h >= 0);

  return (
    <div className="min-h-screen bg-[#060810] pb-20">
      <TopBar />

      {/* Scrolling ticker bar */}
      <div className="bg-[#0d1117] border-b border-[#1e2530] overflow-hidden py-1.5">
        <div className="flex gap-6 animate-marquee whitespace-nowrap px-4" style={{ animation: "marquee 22s linear infinite" }}>
          {(portfolioCoins.length > 0 ? portfolioCoins : [
            { symbol: "btc", current_price: 66500, price_change_percentage_24h: 1.2 },
            { symbol: "eth", current_price: 1802, price_change_percentage_24h: 2.6 },
            { symbol: "usdt", current_price: 1.0, price_change_percentage_24h: 0.01 },
          ] as any[]).concat(portfolioCoins).map((c, i) => {
            const up = c.price_change_percentage_24h >= 0;
            return (
              <span key={i} className="text-[11px] font-medium flex items-center gap-1">
                <span className="text-gray-400">{c.symbol?.toUpperCase()}</span>
                <span className="text-white">${c.current_price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className={up ? "text-green-400" : "text-red-400"}>{up ? "▲" : "▼"}{Math.abs(c.price_change_percentage_24h).toFixed(2)}%</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="overflow-y-auto">
        {/* Gradient portfolio hero */}
        <div className="mx-4 mt-4 rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0f2042 0%, #1a1060 50%, #0d1a38 100%)" }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at 70% 30%, #4f7dfa 0%, transparent 60%)" }} />
          <div className="relative p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6ea4ff" strokeWidth="2" className="w-4 h-4">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-200 text-xs font-medium">Raymond's Portfolio</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    <span className="text-green-400 text-[10px] font-semibold">VERIFIED & ACTIVE</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={() => setHideBalance(!hideBalance)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  {hideBalance ? <EyeOff className="w-3.5 h-3.5 text-white" /> : <Eye className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>

            <p className="text-blue-200/70 text-xs mb-1 uppercase tracking-wider">Total Balance</p>
            <p className="text-white text-4xl font-bold tracking-tight mb-0.5">
              {hideBalance ? "••••••" : "$755,894.450"}
            </p>
            <p className="text-blue-300/70 text-sm mb-4">USDT equivalent</p>

            <div className="flex items-center gap-3 mb-5">
              <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${allCoinsUp ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                {allCoinsUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {allCoinsUp ? "+2.31%" : "-0.8%"} today
              </div>
              <span className="text-blue-300/50 text-xs">+$12.89 all time</span>
            </div>

            {/* Allocation bar */}
            <div className="mb-2">
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                {portfolioCoins.length > 0 ? portfolioCoins.map((c) => {
                  const val = (PORTFOLIO_AMOUNTS[c.id] ?? 0) * c.current_price;
                  const pct = (val / totalPortfolio) * 100;
                  return <div key={c.id} className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COIN_COLORS[c.id] ?? "#4f7dfa" }} />;
                }) : (
                  <>
                    <div className="h-full rounded-full bg-[#f7931a]" style={{ width: "19%" }} />
                    <div className="h-full rounded-full bg-[#627eea]" style={{ width: "38%" }} />
                    <div className="h-full rounded-full bg-[#26a17b]" style={{ width: "43%" }} />
                  </>
                )}
              </div>
              <div className="flex justify-between mt-1.5">
                {["BTC", "ETH", "USDT"].map((sym, i) => (
                  <span key={sym} className="text-[10px] text-blue-200/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: [COIN_COLORS.bitcoin, COIN_COLORS.ethereum, COIN_COLORS.tether][i] }} />
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="border-t border-white/10 px-5 py-4 grid grid-cols-4 gap-2">
            {[
              { icon: <ArrowUpRight className="w-5 h-5" />, label: "Send", color: "text-blue-300", bg: "bg-blue-500/20", action: () => setShowRestrictionModal(true) },
              { icon: <ArrowDownLeft className="w-5 h-5" />, label: "Receive", color: "text-green-300", bg: "bg-green-500/20", action: () => setShowRestrictionModal(true) },
              { icon: <ArrowDown className="w-5 h-5" />, label: "Withdraw", color: "text-purple-300", bg: "bg-purple-500/20", action: () => setShowWithdraw(true) },
              { icon: <RefreshCw className="w-5 h-5" />, label: "Swap", color: "text-amber-300", bg: "bg-amber-500/20", action: () => setShowRestrictionModal(true) },
            ].map(({ icon, label, color, bg, action }) => (
              <button key={label} onClick={action} className="flex flex-col items-center gap-1.5">
                <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center`}>
                  <span className={color}>{icon}</span>
                </div>
                <span className="text-white/70 text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rewards / promo strip */}
        <div className="mx-4 mt-3 bg-gradient-to-r from-purple-900/50 to-blue-900/40 rounded-2xl border border-purple-700/30 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
            <Gift className="w-4 h-4 text-purple-300" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold">Earn up to 14.5% p.a.</p>
            <p className="text-purple-300/70 text-[10px]">Stake USDT and earn daily rewards</p>
          </div>
          <button className="bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">Stake</button>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mx-4 mt-3">
          {[
            { label: "Portfolio", value: `$${displayValue.toFixed(0)}`, sub: "Total", color: "text-white" },
            { label: "Invested", value: totalInvested > 0 ? fmt(totalInvested) : "$701", sub: "All time", color: "text-white" },
            { label: "Assets", value: String(Math.max(portfolioCoins.length, 3)), sub: "Holdings", color: "text-white" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d1117] rounded-2xl p-3 border border-[#1e2530]">
              <p className="text-gray-500 text-[9px] font-bold tracking-widest uppercase mb-1.5">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-600 text-[10px]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab selector */}
        <div className="mx-4 mt-4 bg-[#0d1117] rounded-full flex p-1 border border-[#1e2530]">
          {(["overview", "transaction"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === t ? "bg-white text-black shadow" : "text-gray-400"}`}>
              {t === "transaction" ? "Transactions" : "Overview"}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <>
            <div className="mx-4 mt-4">
              <PerformanceChart />
            </div>

            {/* My Assets */}
            <div className="mx-4 mt-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-base">My Assets</p>
                  <p className="text-gray-500 text-xs">{Math.max(portfolioCoins.length, 3)} holdings · Live prices</p>
                </div>
                <button onClick={() => navigate("/markets")} className="flex items-center gap-1 bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs px-3 py-1.5 rounded-full">
                  <Plus className="w-3 h-3" /> Add Asset
                </button>
              </div>
              <div className="space-y-2.5">
                {portfolioCoins.length > 0 ? portfolioCoins.map((coin) => {
                  const amount = PORTFOLIO_AMOUNTS[coin.id] ?? 0;
                  const value = amount * coin.current_price;
                  const alloc = (value / totalPortfolio) * 100;
                  const up = coin.price_change_percentage_24h >= 0;
                  return (
                    <button key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                      className="w-full bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3 text-left hover:border-blue-600/30 transition-colors">
                      <div className="relative">
                        <img src={coin.image} alt={coin.name} className="w-11 h-11 rounded-full" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{coin.name}</p>
                        <p className="text-gray-500 text-xs">{amount} {coin.symbol.toUpperCase()}</p>
                        <div className="mt-1.5 w-full h-1 bg-[#1e2530] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${alloc}%`, backgroundColor: COIN_COLORS[coin.id] ?? "#4f7dfa" }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white text-sm font-bold">${value.toFixed(2)}</p>
                        <p className={`text-xs font-medium mt-0.5 ${up ? "text-green-400" : "text-red-400"}`}>
                          {up ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{alloc.toFixed(0)}% of portfolio</p>
                      </div>
                    </button>
                  );
                }) : (
                  [
                    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", amount: "2.10532000", value: "$221,475.20", change: "+1.31%", up: true, color: "#f7931a", letter: "B", alloc: 29 },
                    { id: "ethereum", name: "Ethereum", symbol: "ETH", amount: "57.34200000", value: "$106,465.37", change: "+3.96%", up: true, color: "#627eea", letter: "E", alloc: 14 },
                    { id: "tether", name: "Tether", symbol: "USDT", amount: "427,009.43", value: "$427,009.43", change: "+0.01%", up: true, color: "#26a17b", letter: "T", alloc: 57 },
                  ].map((a) => (
                    <button key={a.id} onClick={() => navigate(`/coin/${a.id}`)}
                      className="w-full bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3 text-left hover:border-blue-600/30 transition-colors">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: a.color }}>{a.letter}</div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0b0f]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{a.name}</p>
                        <p className="text-gray-500 text-xs">{a.amount} {a.symbol}</p>
                        <div className="mt-1.5 w-full h-1 bg-[#1e2530] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${a.alloc}%`, backgroundColor: a.color }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white text-sm font-bold">{a.value}</p>
                        <p className={`text-xs font-medium mt-0.5 ${a.up ? "text-green-400" : "text-red-400"}`}>{a.up ? "▲" : "▼"} {a.change.replace(/[+\-]/, "")}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{a.alloc}% of portfolio</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Wallet Activity Alert */}
            <div className="mx-4 mb-4">
              <button onClick={() => navigate("/wallet-activity")}
                className="w-full bg-red-950/30 border border-red-800/40 rounded-2xl p-4 flex items-start gap-3 text-left hover:border-red-600/60 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-red-900/40 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-red-400 text-sm font-bold mb-0.5">Wallet Evidence Record</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {WALLET_TRANSACTIONS.filter(t => t.type === "sent").length} outbound transfers · <span className="text-red-400 font-semibold">{TOTAL_SENT.toFixed(1)} USDT total drained</span>
                  </p>
                  <p className="text-gray-600 text-[11px] mt-1">Jun 9–11, 2026 · Tap to view full evidence</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4 flex-shrink-0 mt-0.5"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mx-4 mb-4">
              <p className="text-white font-bold text-base mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate("/markets")} className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-4 text-left hover:bg-blue-600/20 transition-colors">
                  <Zap className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-white text-sm font-semibold">Buy Crypto</p>
                  <p className="text-gray-500 text-xs mt-0.5">100+ coins available</p>
                </button>
                <button onClick={() => navigate("/crypto-ai")} className="bg-purple-600/10 border border-purple-600/20 rounded-2xl p-4 text-left hover:bg-purple-600/20 transition-colors">
                  <span className="text-2xl block mb-2">🤖</span>
                  <p className="text-white text-sm font-semibold">Ask Crypto AI</p>
                  <p className="text-gray-500 text-xs mt-0.5">Market insights, live</p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-4 mt-4 mb-4">
            {transactions.length === 0 ? (
              <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1e2530] flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" className="w-7 h-7"><path d="M12 2v10m0 0-3-3m3 3 3-3M6 17l-2 2 2 2M18 17l2 2-2 2M3 19h18" /></svg>
                </div>
                <p className="text-white text-sm font-semibold mb-1">No transactions yet</p>
                <p className="text-gray-500 text-xs mb-4">Buy or receive crypto to see history here</p>
                <button onClick={() => navigate("/markets")} className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold">Browse Markets</button>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="bg-[#0d1117] rounded-xl p-4 border border-[#1e2530] flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "buy" ? "bg-green-900/30" : "bg-red-900/30"}`}>
                      <img src={tx.coinImage} alt={tx.coinName} className="w-6 h-6 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{tx.coinName}</p>
                      <p className="text-gray-500 text-xs capitalize">{tx.type} · {new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "buy" ? "+" : "-"}{tx.amount} {tx.coinSymbol.toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-xs">${tx.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI chat bubble */}
      <button onClick={() => navigate("/crypto-ai")} className="fixed bottom-24 right-4 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/40 relative">
        <span className="text-white text-xl">🤖</span>
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#060810]" />
      </button>

      <BottomNav />
      {showWelcome && <WelcomeModal onViewAssets={() => { setShowWelcome(false); setShowAssets(true); }} onClose={() => setShowWelcome(false)} />}
      {showAssets && <AssetsModal onProceed={() => setShowAssets(false)} onClose={() => setShowAssets(false)} portfolioValue={displayValue} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}

      {/* Transaction Restriction Modal */}
      {showRestrictionModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRestrictionModal(false)} />
          <div className="relative w-full bg-[#0d1117] rounded-t-3xl border-t border-[#1e2530] p-6 pb-10 animate-slide-up">
            {/* Close */}
            <button onClick={() => setShowRestrictionModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-900/30 border-2 border-amber-600/40 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-white text-xl font-bold text-center mb-2">Transaction Temporarily Restricted</h2>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-amber-500/40 mx-auto mb-4 rounded-full" />

            {/* Message */}
            <p className="text-gray-300 text-sm text-center leading-relaxed mb-4">
              We detected unusual activity on this wallet, including multiple withdrawal attempts on{" "}
              <span className="text-amber-400 font-semibold">11/06/2026</span>. As a precaution, part of your balance has been temporarily restricted.
            </p>

            {/* Breakdown cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-950/30 border border-green-800/30 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  <p className="text-green-400 text-[10px] font-bold uppercase tracking-wider">Recovered</p>
                </div>
                <p className="text-white text-lg font-black">$300.00</p>
                <p className="text-gray-500 text-[10px] mt-0.5">USDT · Available</p>
              </div>
              <div className="bg-amber-950/30 border border-amber-800/30 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Restricted</p>
                </div>
                <p className="text-white text-lg font-black">$400.00</p>
                <p className="text-gray-500 text-[10px] mt-0.5">USDT · Pending</p>
              </div>
            </div>

            <p className="text-gray-500 text-xs text-center mb-5">
              The remaining <span className="text-amber-400 font-semibold">$400.00 USDT</span> is held due to the detected unusual activity. To restore full access, please proceed with a service request.
            </p>

            {/* Buttons */}
            <button
              onClick={() => { setShowRestrictionModal(false); navigate("/recovery"); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-sm transition-colors mb-3 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Request Recovery Assistance
            </button>
            <button
              onClick={() => setShowRestrictionModal(false)}
              className="w-full bg-[#1e2530] text-gray-300 font-semibold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-[#252d3a] transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Contact Support
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}
