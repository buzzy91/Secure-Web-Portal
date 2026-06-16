import { useState } from "react";
import { RefreshCw, TrendingUp, Users, MessageCircle, Heart, Share2, Flame, Crown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getMarkets, fmt, fmtPct } from "@/services/coingecko";

type Tab = "Feed" | "Trending" | "Leaderboard";

const FEED_POSTS = [
  {
    id: 1, avatar: "👨‍💼", name: "CryptoWhale", handle: "@whale_99", time: "2m ago",
    text: "BTC just broke above key resistance at $65K. Volume is massive — this could be the start of the next leg up. 🚀 #Bitcoin",
    likes: 1240, comments: 89, coin: "BTC", verified: true,
  },
  {
    id: 2, avatar: "👩‍💻", name: "ETH Maxi", handle: "@ethmaxi", time: "8m ago",
    text: "Ethereum staking withdrawals hit 6-month lows today. Long-term holders are NOT selling. This is extremely bullish for ETH.",
    likes: 874, comments: 52, coin: "ETH", verified: false,
  },
  {
    id: 3, avatar: "🦊", name: "DeFi King", handle: "@defiking", time: "15m ago",
    text: "Reminder: Not your keys, not your coins. Always self-custody your assets. The market teaches hard lessons.",
    likes: 3201, comments: 214, coin: null, verified: true,
  },
  {
    id: 4, avatar: "📊", name: "ChartMaster", handle: "@charts_pro", time: "1h ago",
    text: "SOL options open interest just surged 340% in 24h. Something big is coming. Keep your eyes on $SOL this week.",
    likes: 542, comments: 33, coin: "SOL", verified: false,
  },
];

const LEADERBOARD = [
  { rank: 1, avatar: "🏆", name: "AlphaTrader", pnl: "+$42,800", pct: "+68.2%", up: true },
  { rank: 2, avatar: "🥈", name: "CryptoWhale", pnl: "+$31,200", pct: "+51.4%", up: true },
  { rank: 3, avatar: "🥉", name: "DeFi King", pnl: "+$18,500", pct: "+29.7%", up: true },
  { rank: 4, avatar: "👤", name: "ETH Maxi", pnl: "+$12,100", pct: "+18.3%", up: true },
  { rank: 5, avatar: "👤", name: "SOL Bull", pnl: "+$7,800", pct: "+12.1%", up: true },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Feed");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [pollVote, setPollVote] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const { data: markets = [], isFetching, refetch } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    refetchInterval: 30_000,
  });

  const bullPct = markets.length > 0
    ? Math.round((markets.filter(c => c.price_change_percentage_24h > 0).length / markets.length) * 100)
    : 62;

  const gainers = [...markets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 6);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fearLevel = bullPct >= 60 ? { label: "Greed", color: "text-green-400", bg: "bg-green-500", emoji: "🤑" }
    : bullPct >= 45 ? { label: "Neutral", color: "text-yellow-400", bg: "bg-yellow-500", emoji: "😐" }
    : { label: "Fear", color: "text-red-400", bg: "bg-red-500", emoji: "😨" };

  return (
    <div className="min-h-screen bg-[#060810] pb-20">
      <TopBar />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#1e2530]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white text-2xl font-bold">Community</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <p className="text-gray-400 text-xs">142,847 members online now</p>
            </div>
          </div>
          <button onClick={() => refetch()} className="w-9 h-9 rounded-full bg-[#0d1117] border border-[#1e2530] flex items-center justify-center text-gray-400">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-[#0d1117] rounded-xl p-1 border border-[#1e2530]">
          {(["Feed", "Trending", "Leaderboard"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? "bg-white text-black" : "text-gray-400"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* FEED TAB */}
        {activeTab === "Feed" && (
          <>
            {/* Fear & Greed Card */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-xl">⚡</span> Market Sentiment
                </p>
                <span className="text-[10px] text-gray-500 bg-green-900/20 border border-green-800/30 px-2 py-0.5 rounded-full text-green-400">LIVE</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-5xl mb-1">{fearLevel.emoji}</p>
                  <p className={`text-sm font-bold ${fearLevel.color}`}>{fearLevel.label}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-end gap-2 mb-2">
                    <span className={`text-3xl font-black ${fearLevel.color}`}>{bullPct}</span>
                    <span className="text-gray-400 text-sm mb-1">/ 100</span>
                  </div>
                  <div className="relative w-full h-3 bg-gradient-to-r from-red-800 via-yellow-700 to-green-700 rounded-full overflow-hidden">
                    <div className="absolute top-0 h-full w-1 bg-white rounded-full shadow-md transition-all" style={{ left: `${bullPct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-red-400 text-[10px]">Extreme Fear</span>
                    <span className="text-green-400 text-[10px]">Extreme Greed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community poll */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-white font-bold mb-1">📊 Community Poll</p>
              <p className="text-gray-300 text-sm mb-3">Where do you think BTC will be end of month?</p>
              {[
                { label: "Above $70K 🚀", pct: 48 },
                { label: "$60K–$70K 📈", pct: 31 },
                { label: "Below $60K 📉", pct: 21 },
              ].map((opt) => (
                <button key={opt.label} onClick={() => setPollVote(opt.label)}
                  className={`w-full mb-2 rounded-xl overflow-hidden border transition-colors ${pollVote === opt.label ? "border-blue-500" : "border-[#1e2530]"}`}>
                  <div className="relative h-10 flex items-center px-3">
                    <div className={`absolute inset-0 rounded-xl ${pollVote ? "bg-blue-900/20" : "bg-[#0a0b0f]"} transition-all`}
                      style={{ width: pollVote ? `${opt.pct}%` : "0%" }} />
                    <span className="relative text-sm text-white font-medium flex-1">{opt.label}</span>
                    {pollVote && <span className="relative text-blue-400 text-sm font-bold">{opt.pct}%</span>}
                  </div>
                </button>
              ))}
              <p className="text-gray-600 text-xs text-right mt-1">12,840 votes</p>
            </div>

            {/* Posts feed */}
            {FEED_POSTS.map((post) => (
              <div key={post.id} className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e2530] flex items-center justify-center text-xl flex-shrink-0">{post.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-white text-sm font-bold">{post.name}</p>
                      {post.verified && <span className="text-blue-400 text-xs">✓</span>}
                      {post.coin && (
                        <span className="bg-blue-900/30 border border-blue-700/30 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full">#{post.coin}</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{post.handle} · {post.time}</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed mb-3">{post.text}</p>
                <div className="flex items-center gap-4 border-t border-[#1e2530] pt-3">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-xs ${likedPosts.has(post.id) ? "text-red-400" : "text-gray-500"}`}>
                    <Heart className={`w-3.5 h-3.5 ${likedPosts.has(post.id) ? "fill-red-400" : ""}`} />
                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 text-xs ml-auto">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* TRENDING TAB */}
        {activeTab === "Trending" && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-400" />
              <p className="text-white font-bold text-base">Trending Right Now</p>
            </div>

            {/* Hot coins grid */}
            <div className="grid grid-cols-2 gap-3">
              {gainers.map((m, i) => {
                const up = m.price_change_percentage_24h >= 0;
                return (
                  <button key={m.id} onClick={() => navigate(`/coin/${m.id}`)}
                    className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-4 text-left hover:border-blue-600/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={m.image} alt={m.name} className="w-7 h-7 rounded-full" />
                        <span className="text-white text-sm font-bold">{m.symbol.toUpperCase()}</span>
                      </div>
                      <span className="text-gray-600 text-xs font-bold">#{i + 1}</span>
                    </div>
                    <p className="text-white text-sm font-semibold">{fmt(m.current_price, m.current_price < 1 ? 4 : 2)}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${up ? "text-green-400" : "text-red-400"}`}>
                      {up ? <TrendingUp className="w-3 h-3" /> : <span>▼</span>}
                      {fmtPct(m.price_change_percentage_24h)}
                    </div>
                    {/* mini bar chart */}
                    <div className="flex items-end gap-0.5 mt-3 h-6">
                      {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 1.0].map((h, j) => (
                        <div key={j} className={`flex-1 rounded-sm ${up ? "bg-green-500/40" : "bg-red-500/40"}`} style={{ height: `${h * 100}%` }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hot topics */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-white font-bold mb-3">🔥 Hot Topics</p>
              {[
                { tag: "#Bitcoin", posts: "24.2K posts", up: true },
                { tag: "#DeFi", posts: "12.8K posts", up: true },
                { tag: "#NFT", posts: "8.1K posts", up: false },
                { tag: "#Ethereum", posts: "18.4K posts", up: true },
                { tag: "#Solana", posts: "6.9K posts", up: true },
              ].map((t) => (
                <div key={t.tag} className="flex items-center justify-between py-2.5 border-b border-[#1e2530] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t.up ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-blue-400 text-sm font-semibold">{t.tag}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{t.posts}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "Leaderboard" && (
          <>
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-800/30 rounded-2xl p-4 flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Monthly Leaderboard</p>
                <p className="text-gray-400 text-xs">Top traders by PnL · June 2026</p>
              </div>
            </div>

            <div className="space-y-2">
              {LEADERBOARD.map((p) => (
                <div key={p.rank} className={`bg-[#0d1117] rounded-2xl border p-4 flex items-center gap-3 ${p.rank === 1 ? "border-yellow-700/40" : "border-[#1e2530]"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${p.rank === 1 ? "bg-yellow-900/30" : p.rank === 2 ? "bg-gray-700/30" : p.rank === 3 ? "bg-orange-900/30" : "bg-[#1e2530]"}`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">{p.name}</p>
                    <p className="text-gray-500 text-xs">Rank #{p.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-bold">{p.pnl}</p>
                    <p className="text-green-300/70 text-xs">{p.pct}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-white font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Community Stats</p>
              {[
                { label: "Total Members", value: "4.2M" },
                { label: "Online Now", value: "142,847" },
                { label: "Posts Today", value: "38,492" },
                { label: "Countries", value: "187" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-[#1e2530] last:border-0">
                  <span className="text-gray-400 text-sm">{s.label}</span>
                  <span className="text-white text-sm font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
