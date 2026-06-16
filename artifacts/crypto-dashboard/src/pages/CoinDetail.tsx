import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Star, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getCoinDetail, getCoinChart, fmt, fmtPct } from "@/services/coingecko";
import { useTransactions } from "@/context/TransactionContext";
import BuyModal from "@/components/BuyModal";
import { useQuery as useQ } from "@tanstack/react-query";
import { getMarkets } from "@/services/coingecko";

type Period = "1" | "7" | "30" | "90" | "365";

export default function CoinDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<Period>("7");
  const [showBuy, setShowBuy] = useState(false);
  const { toggleWatchlist, isWatchlisted } = useTransactions();

  const { data: coin, isLoading } = useQuery({
    queryKey: ["coin-detail", id],
    queryFn: () => getCoinDetail(id),
    enabled: !!id,
  });

  const { data: chart } = useQuery({
    queryKey: ["coin-chart", id, period],
    queryFn: () => getCoinChart(id, period),
    enabled: !!id,
    refetchInterval: 30_000,
  });

  const { data: markets } = useQ({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    staleTime: 30_000,
  });

  const marketData = markets?.find((m) => m.id === id);

  const chartData = chart?.prices.map(([ts, price]) => ({
    time: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price,
  })) ?? [];

  const price = coin?.market_data.current_price.usd ?? 0;
  const change24h = coin?.market_data.price_change_percentage_24h ?? 0;
  const isUp = change24h >= 0;

  const periodLabels: Record<Period, string> = { "1": "24h", "7": "7d", "30": "30d", "90": "90d", "365": "1y" };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!coin) return (
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400">Coin not found</p>
      <button onClick={() => navigate("/markets")} className="text-blue-400">← Back</button>
    </div>
  );

  const desc = coin.description.en.replace(/<[^>]*>/g, "").slice(0, 300);

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#1e2530]">
        <button onClick={() => navigate("/markets")} className="text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src={coin.image.large} alt={coin.name} className="w-6 h-6 rounded-full" />
          <span className="text-white font-semibold">{coin.symbol.toUpperCase()}</span>
        </div>
        <button onClick={() => toggleWatchlist(id)}>
          <Star className={`w-5 h-5 ${isWatchlisted(id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Price hero */}
        <div className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
          <div className="flex items-center gap-3 mb-2">
            <img src={coin.image.large} alt={coin.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white font-bold">{coin.name}</p>
              <p className="text-gray-400 text-xs">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <p className="text-white text-3xl font-bold mb-1">{fmt(price, price < 1 ? 6 : 2)}</p>
          <div className="flex items-center gap-2">
            {isUp ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
            <span className={`text-sm font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
              {fmtPct(change24h)} (24h)
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
          <div className="flex gap-1 mb-4 bg-[#0a0b0f] rounded-lg p-1">
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${period === p ? "bg-white text-black" : "text-gray-400"}`}>
                {periodLabels[p]}
              </button>
            ))}
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 8, color: "#fff", fontSize: 12 }}
                  formatter={(v: number) => [fmt(v, v < 1 ? 6 : 2), "Price"]} labelStyle={{ color: "#6b7280" }} />
                <Area type="monotone" dataKey="price" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth={2} fill="url(#coinGrad)" dot={false} activeDot={{ r: 4, fill: isUp ? "#22c55e" : "#ef4444" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-gray-500 text-sm">Loading chart…</div>
          )}
        </div>

        {/* Market Stats */}
        <div className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
          <p className="text-white font-semibold mb-3">Market Stats</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Market Cap", value: fmt(coin.market_data.market_cap.usd) },
              { label: "Volume (24h)", value: fmt(coin.market_data.total_volume.usd) },
              { label: "ATH", value: fmt(coin.market_data.ath.usd, 2) },
              { label: "ATL", value: fmt(coin.market_data.atl.usd, coin.market_data.atl.usd < 1 ? 6 : 2) },
              { label: "7d Change", value: fmtPct(coin.market_data.price_change_percentage_7d) },
              { label: "30d Change", value: fmtPct(coin.market_data.price_change_percentage_30d) },
              { label: "Circulating", value: `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M` },
              { label: "Total Supply", value: coin.market_data.total_supply ? `${(coin.market_data.total_supply / 1e6).toFixed(2)}M` : "∞" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0a0b0f] rounded-xl p-3">
                <p className="text-gray-500 text-[11px] mb-1">{s.label}</p>
                <p className={`text-sm font-semibold ${s.label.includes("Change") ? (s.value.startsWith("+") ? "text-green-400" : "text-red-400") : "text-white"}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
            <p className="text-white font-semibold mb-2">About {coin.name}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}{desc.length >= 300 ? "…" : ""}</p>
          </div>
        )}

        {/* Buy / Sell buttons */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <button onClick={() => setShowBuy(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-sm transition-colors">
            Buy {coin.symbol.toUpperCase()}
          </button>
          <button onClick={() => setShowBuy(true)}
            className="bg-red-600/80 hover:bg-red-700 text-white font-semibold py-4 rounded-xl text-sm transition-colors">
            Sell {coin.symbol.toUpperCase()}
          </button>
        </div>
      </div>

      {showBuy && marketData && <BuyModal coin={marketData} onClose={() => setShowBuy(false)} />}
    </div>
  );
}
