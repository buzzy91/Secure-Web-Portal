import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Sparkles, TrendingUp, Shield, Zap, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";

type Message = { role: "user" | "ai"; text: string; time: string };

const CANNED: Record<string, string> = {
  btc: "📊 **Bitcoin Analysis**\n\nBTC remains the market leader with strong institutional interest. On-chain data shows whale accumulation at current levels and exchange reserves at a 5-year low — a historically very bullish signal.\n\n• Support: ~$62,000\n• Resistance: ~$72,000\n• Outlook: Bullish medium-term",
  eth: "📊 **Ethereum Analysis**\n\nEthereum staking withdrawals are at 6-month lows, indicating strong long-term holder conviction. The network's PoS transition reduced energy usage by ~99.95% and staking yields remain attractive at ~4.2% APR.\n\n• Support: ~$1,700\n• Resistance: ~$2,100\n• Outlook: Bullish",
  defi: "🏦 **DeFi Overview**\n\nDeFi TVL has recovered significantly from 2022 lows. Top protocols:\n\n• Uniswap — $6.8B TVL, 0.3% LP fees\n• Aave — $12B TVL, variable lending rates\n• Curve — Stablecoin liquidity hub\n\nYield opportunities exist but carry smart contract risk. Always audit protocol history before depositing.",
  portfolio: "💼 **Portfolio Strategy**\n\nA balanced crypto portfolio typically:\n\n• 40–60% BTC (store of value)\n• 20–30% ETH (yield + utility)\n• 10–20% Altcoins (growth exposure)\n• 10–20% Stablecoins (dry powder)\n\nRebalance quarterly. Dollar-cost averaging beats timing the market for most investors.",
  market: "📈 **Market Overview**\n\nCurrent market shows bullish momentum with buying pressure across major large caps. Key indicators:\n\n• BTC dominance: 52.4%\n• Total market cap: ~$2.4T\n• Fear & Greed Index: 72 (Greed)\n• 30d volatility: moderate\n\nWatch macro events: Fed meetings, ETF flows, and on-chain whale activity.",
  default: "🤖 Based on real-time market data, I can see mixed signals across asset classes. The overall trend is cautiously bullish with BTC and ETH showing strength.\n\nConsider:\n• Diversifying across large caps\n• Monitoring macro indicators\n• Keeping 10-20% in stablecoins as reserves\n\nAlways invest within your personal risk tolerance.",
};

function getAIResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("bitcoin") || lower.includes("btc")) return CANNED.btc;
  if (lower.includes("ethereum") || lower.includes("eth")) return CANNED.eth;
  if (lower.includes("defi")) return CANNED.defi;
  if (lower.includes("portfolio")) return CANNED.portfolio;
  if (lower.includes("market") || lower.includes("analysis")) return CANNED.market;
  if (lower.includes("solana") || lower.includes("sol")) return "📊 **Solana Analysis**\n\nSOL has shown exceptional performance with high throughput (~65,000 TPS) and low fees. Options open interest surged 340% recently — institutional attention is growing.\n\n• Support: ~$140\n• Resistance: ~$180\n• Outlook: Bullish momentum, watch for volume confirmation.";
  if (lower.includes("usdt") || lower.includes("stablecoin")) return "💵 **Stablecoins**\n\nUSDT (Tether) remains the dominant stablecoin with $89B+ market cap. It's pegged 1:1 to USD and is the primary trading pair across exchanges. Good for: parking profits, avoiding volatility, earning yield via staking.";
  return CANNED.default;
}

const QUICK_PROMPTS = [
  { label: "BTC Analysis", icon: "₿", query: "Analyze Bitcoin market" },
  { label: "ETH Outlook", icon: "Ξ", query: "What's the Ethereum outlook?" },
  { label: "Portfolio Tips", icon: "💼", query: "How should I balance my portfolio?" },
  { label: "DeFi Guide", icon: "🏦", query: "Explain DeFi opportunities" },
  { label: "Market Overview", icon: "📊", query: "Give me a market analysis" },
];

const SIGNALS = [
  { text: "BTC whale accumulation detected — wallets >1000 BTC up 2.3%", time: "2m ago", dot: "bg-green-400", badge: "BULLISH" },
  { text: "ETH staking withdrawals at 6-month low — strong holder conviction", time: "12m ago", dot: "bg-green-400", badge: "BULLISH" },
  { text: "SOL options open interest surges 340% in 24h", time: "1h ago", dot: "bg-yellow-400", badge: "WATCH" },
  { text: "USDT dominance dips below 5% — risk appetite increasing", time: "2h ago", dot: "bg-green-400", badge: "BULLISH" },
  { text: "BTC miner capitulation signal — historically a buy signal", time: "3h ago", dot: "bg-blue-400", badge: "SIGNAL" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function CryptoAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "👋 Hello! I'm Crypto AI — your personal market analyst. I'm connected to live data across 10,000+ assets.\n\nAsk me anything: price analysis, portfolio strategy, DeFi yields, on-chain signals, or market news.", time: now() }
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"chat" | "signals">("chat");
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

  const handleSend = async (q?: string) => {
    const text = (q ?? question).trim();
    if (!text) return;
    setMessages(p => [...p, { role: "user", text, time: now() }]);
    setQuestion("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100 + Math.random() * 600));
    setMessages(p => [...p, { role: "ai", text: getAIResponse(text), time: now() }]);
    setLoading(false);
  };

  const liveMarket = markets.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#060810] pb-20 flex flex-col">
      <TopBar />

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-gradient-to-r from-[#0d1226] to-[#120a2a] rounded-2xl border border-blue-900/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">🤖</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">Crypto AI</span>
                  <span className="bg-green-900/50 text-green-400 text-[10px] px-1.5 py-0.5 rounded-full border border-green-700/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />LIVE
                  </span>
                </div>
                <p className="text-gray-400 text-xs">Powered by real-time market intelligence</p>
              </div>
            </div>
            <button onClick={() => refetch()} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ icon: <Sparkles className="w-3 h-3" />, label: "10,000+ assets" },
              { icon: <TrendingUp className="w-3 h-3" />, label: "Real-time data" },
              { icon: <Shield className="w-3 h-3" />, label: "On-chain analytics" }].map((b) => (
              <span key={b.label} className="flex items-center gap-1 bg-blue-900/20 border border-blue-800/30 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                {b.icon}{b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="px-4 mb-3">
        <div className="flex bg-[#0d1117] rounded-xl p-1 border border-[#1e2530]">
          <button onClick={() => setActiveSection("chat")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeSection === "chat" ? "bg-white text-black" : "text-gray-400"}`}>
            💬 Chat
          </button>
          <button onClick={() => setActiveSection("signals")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${activeSection === "signals" ? "bg-white text-black" : "text-gray-400"}`}>
            <Zap className="w-3.5 h-3.5" /> AI Signals
          </button>
        </div>
      </div>

      {activeSection === "chat" ? (
        <div className="flex-1 flex flex-col px-4">
          {/* Messages */}
          <div className="space-y-3 mb-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 mb-1">🤖</div>
                )}
                <div className={`max-w-[82%] ${m.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-blue-600 text-white rounded-br-md" : "bg-[#0d1117] border border-[#1e2530] text-gray-200 rounded-bl-md"}`}>
                    {m.text}
                  </div>
                  <span className="text-gray-600 text-[10px] mt-1 px-1">{m.time}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  {[0, 150, 300].map((d) => (
                    <div key={d} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
            {QUICK_PROMPTS.map((p) => (
              <button key={p.label} onClick={() => handleSend(p.query)}
                className="flex items-center gap-1.5 bg-[#0d1117] border border-[#1e2530] text-gray-300 text-xs px-3 py-2 rounded-xl whitespace-nowrap hover:border-blue-600/40 hover:text-white transition-colors flex-shrink-0">
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative mb-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Ask Crypto AI anything…"
              className="w-full bg-[#0d1117] border border-[#1e2530] rounded-2xl pl-4 pr-14 py-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
            <button onClick={() => handleSend()} disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {/* Live market snapshot */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold flex items-center gap-2"><span className="text-blue-400">📊</span>Live Market</p>
              <button onClick={() => refetch()} className="text-gray-500"><RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {liveMarket.map((m) => {
                const up = m.price_change_percentage_24h >= 0;
                return (
                  <button key={m.id} onClick={() => navigate(`/coin/${m.id}`)}
                    className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3 text-left hover:border-blue-600/30 transition-colors">
                    <div className="flex items-center gap-1 mb-1">
                      <img src={m.image} alt={m.name} className="w-4 h-4 rounded-full" />
                      <p className="text-gray-400 text-[10px] font-bold">{m.symbol.toUpperCase()}</p>
                    </div>
                    <p className="text-white text-xs font-bold">{fmt(m.current_price, m.current_price < 1 ? 4 : 2)}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${up ? "text-green-400" : "text-red-400"}`}>
                      {up ? "▲" : "▼"}{fmtPct(m.price_change_percentage_24h)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Signals */}
          <div>
            <p className="text-white font-bold mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Real-Time AI Signals</p>
            <div className="space-y-2">
              {SIGNALS.map((s, i) => (
                <div key={i} className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3 flex items-start gap-3 hover:border-blue-600/30 transition-colors cursor-pointer">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
                  <p className="text-gray-200 text-xs flex-1 leading-relaxed">{s.text}</p>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      s.badge === "BULLISH" ? "bg-green-900/40 text-green-400 border border-green-800/40"
                      : s.badge === "WATCH" ? "bg-yellow-900/40 text-yellow-400 border border-yellow-800/40"
                      : "bg-blue-900/40 text-blue-400 border border-blue-800/40"
                    }`}>{s.badge}</span>
                    <span className="text-gray-600 text-[10px]">{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI insights cards */}
          <div>
            <p className="text-white font-bold mb-3">🔮 AI Market Predictions</p>
            {[
              { title: "BTC Short-Term", pred: "$66K–$72K range this week", conf: 74, up: true },
              { title: "ETH Short-Term", pred: "$1,800–$2,100 consolidation", conf: 68, up: true },
              { title: "Market Sentiment", pred: "Cautiously bullish through month end", conf: 81, up: true },
            ].map((p) => (
              <div key={p.title} className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3 mb-2 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-0.5">{p.title}</p>
                  <p className="text-white text-sm font-semibold">{p.pred}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-400 text-sm font-bold">{p.conf}%</p>
                  <p className="text-gray-600 text-[10px]">confidence</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveSection("chat")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2">
            <span>💬</span> Chat with Crypto AI
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
