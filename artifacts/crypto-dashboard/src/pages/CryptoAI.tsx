import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";

type Message = { role: "user" | "ai"; text: string };

const CANNED: Record<string, string> = {
  btc: "Bitcoin remains the market leader with strong institutional interest. Current on-chain data shows whale accumulation and low exchange reserves — a historically bullish signal.",
  eth: "Ethereum's staking withdrawals are at 6-month lows, indicating long-term holder confidence. The network's transition to PoS reduced energy usage by ~99.95%.",
  default: "Based on real-time market data, the current landscape shows mixed signals. Consider diversifying across large caps like BTC and ETH while monitoring macro indicators. Always invest within your risk tolerance.",
};

function getAIResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("bitcoin") || lower.includes("btc")) return CANNED.btc;
  if (lower.includes("ethereum") || lower.includes("eth")) return CANNED.eth;
  if (lower.includes("market")) return "Markets are showing " + (Math.random() > 0.5 ? "bullish momentum with buying pressure across major caps. Key resistance levels are being tested." : "consolidation after recent gains. Volume is moderate — watch for a breakout confirmation.");
  if (lower.includes("defi")) return "DeFi TVL has recovered significantly. Top protocols like Uniswap, Aave, and Curve are seeing increased volume. Yield opportunities exist but carry smart contract risk.";
  if (lower.includes("portfolio")) return "A balanced crypto portfolio typically holds 40-60% BTC, 20-30% ETH, and the remainder in high-conviction altcoins. Rebalance quarterly and keep 10-20% in stablecoins as dry powder.";
  return CANNED.default;
}

export default function CryptoAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const { data: markets = [], isFetching, refetch } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const q = question.trim();
    if (!q) return;
    setMessages((p) => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setMessages((p) => [...p, { role: "ai", text: getAIResponse(q) }]);
    setLoading(false);
  };

  const liveMarket = markets.slice(0, 4);
  const insights = [
    { text: "BTC whale accumulation signal detected", time: "2m ago", dot: "bg-green-400" },
    { text: "ETH staking withdrawals hit 6-month low", time: "15m ago", dot: "bg-green-400" },
    { text: "SOL options open interest surges 340%", time: "1h ago", dot: "bg-yellow-400" },
    { text: "USDT dominance drops below 5% for first time", time: "2h ago", dot: "bg-green-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />
      <div className="px-4 pt-4 space-y-4">
        {/* Hero */}
        <div className="bg-[#0d1226] rounded-2xl border border-[#1e2d40] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">Crypto AI</span>
                <span className="bg-green-900/50 text-green-400 text-[10px] px-1.5 py-0.5 rounded-full border border-green-700/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />LIVE
                </span>
              </div>
              <p className="text-gray-400 text-xs">Powered by real-time market intelligence</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">Your personal crypto analyst. Ask anything — market trends, portfolio strategy, DeFi yields, on-chain data, or breaking news.</p>
          <div className="flex flex-wrap gap-2">
            {["Real-time data", "On-chain analytics", "10,000+ assets"].map((t) => (
              <span key={t} className="bg-[#0a1a3d] border border-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="text-blue-400">✦</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* Chat */}
        {messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white" : "bg-[#0d1117] border border-[#1e2530] text-gray-200"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Ask Crypto AI anything…"
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-12" />
          <button onClick={handleSend} disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center disabled:opacity-50">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Live Market Snapshot */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold flex items-center gap-2"><span className="text-blue-400">📊</span>Live Market Snapshot</p>
            <button onClick={() => refetch()} className="text-gray-400"><RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {liveMarket.map((m) => {
              const up = m.price_change_percentage_24h >= 0;
              return (
                <button key={m.id} onClick={() => navigate(`/coin/${m.id}`)}
                  className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3 text-left">
                  <p className="text-white text-sm font-bold">{m.symbol.toUpperCase()}</p>
                  <p className="text-white text-xs font-semibold">{fmt(m.current_price, m.current_price < 1 ? 6 : 2)}</p>
                  <p className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}>
                    {up ? "↗" : "↙"} {fmtPct(m.price_change_percentage_24h)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-4">
          <p className="text-white font-semibold mb-3 flex items-center gap-2"><span className="text-orange-400">⏰</span>Recent AI Insights</p>
          <div className="space-y-3">
            {insights.map((ins) => (
              <div key={ins.text} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ins.dot}`} />
                <p className="text-gray-300 text-xs flex-1">{ins.text}</p>
                <span className="text-gray-500 text-[10px] whitespace-nowrap">{ins.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick prompts */}
        <div>
          <p className="text-white font-semibold mb-3 flex items-center gap-2"><span className="text-yellow-400">☆</span>Explore Topics</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[{ label: "Market Analysis", icon: "📊" }, { label: "Breaking News", icon: "🔥" }, { label: "Portfolio Tips", icon: "↗" }].map((t, i) => (
              <button key={t.label} onClick={() => { setQuestion(t.label); }}
                className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${i === 0 ? "bg-blue-600 text-white" : "bg-[#0d1117] text-gray-400 border border-[#1e2530]"}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setQuestion("Why is the market up today?")} className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl p-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><span className="text-red-400">📋</span><span className="text-white text-sm">Why is the market up today?</span></div>
          <span className="text-gray-500 text-xs">&gt;</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
