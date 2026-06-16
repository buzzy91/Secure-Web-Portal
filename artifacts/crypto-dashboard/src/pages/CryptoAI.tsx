import { useState } from "react";
import { Send } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const liveMarket = [
  { symbol: "BTC", price: "$66,569.00", change: "↗ 1.31%", up: true },
  { symbol: "ETH", price: "$1,795.38", change: "↗ 3.96%", up: true },
  { symbol: "USDT", price: "$1.00", change: "↗ 0.01%", up: true },
  { symbol: "BNB", price: "$614.10", change: "↙ 0.10%", up: false },
];

const insights = [
  { text: "BTC whale accumulation signal detected", time: "2m ago", color: "bg-green-400" },
  { text: "ETH staking withdrawals hit 6-month low", time: "15m ago", color: "bg-green-400" },
  { text: "SOL options open interest surges 340%", time: "1h ago", color: "bg-yellow-400" },
  { text: "USDT dominance drops below 5% for first time", time: "2h ago", color: "bg-green-400" },
];

const topics = ["Market Analysis", "Breaking News", "Portfolio"];

export default function CryptoAIPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  const handleSend = () => {
    if (!question.trim()) return;
    const q = question.trim();
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Based on real-time market data and on-chain analytics, the current market shows strong bullish momentum with BTC whale accumulation and ETH staking at multi-month lows. Portfolio diversification remains key — consider your risk tolerance before making any moves.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-20">
      <TopBar />

      <div className="px-4 pt-4 space-y-4">
        {/* Hero card */}
        <div className="bg-[#0d1226] rounded-2xl border border-[#1e2d40] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
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
          <p className="text-gray-300 text-sm mb-3">
            Your personal crypto analyst. Ask anything — market trends, portfolio strategy, DeFi yields, on-chain data, or breaking news.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Real-time data", "On-chain analytics", "10,000+ assets"].map((tag) => (
              <span key={tag} className="bg-[#0a1a3d] border border-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="text-blue-400">✦</span> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-[#0d1117] border border-[#1e2530] text-gray-200"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask input */}
        <div className="relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Crypto AI anything..."
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-12"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Live Market Snapshot */}
        <div>
          <p className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-blue-400">📊</span> Live Market Snapshot
          </p>
          <div className="grid grid-cols-2 gap-3">
            {liveMarket.map((m) => (
              <div key={m.symbol} className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-3">
                <p className="text-white text-sm font-bold">{m.symbol}</p>
                <p className="text-white text-xs font-semibold">{m.price}</p>
                <p className={`text-xs font-medium ${m.up ? "text-green-400" : "text-red-400"}`}>{m.change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-4">
          <p className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-orange-400">⏰</span> Recent AI Insights
          </p>
          <div className="space-y-3">
            {insights.map((ins) => (
              <div key={ins.text} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ins.color}`} />
                <p className="text-gray-300 text-xs flex-1">{ins.text}</p>
                <span className="text-gray-500 text-[10px] whitespace-nowrap">{ins.time}</span>
                <span className="text-gray-500 text-xs">&gt;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Topics */}
        <div>
          <p className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-yellow-400">☆</span> Explore Topics
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {topics.map((t, i) => (
              <button
                key={t}
                className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
                  i === 0 ? "bg-blue-600 text-white" : "bg-[#0d1117] text-gray-400 border border-[#1e2530]"
                }`}
              >
                {i === 0 ? "📊" : i === 1 ? "🔥" : "↗"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Market question prompt */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400">📋</span>
            <span className="text-white text-sm">Why is the market up today?</span>
          </div>
          <span className="text-gray-500 text-xs">&gt;</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
