import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getCoinChart } from "@/services/coingecko";

type Period = "1" | "7" | "30" | "90" | "365";
const LABELS: Record<Period, string> = { "1": "24h", "7": "7d", "30": "30d", "90": "90d", "365": "All" };

const SCALE = 701.0 / 66569;

export default function PerformanceChart() {
  const [period, setPeriod] = useState<Period>("30");

  const { data: chart } = useQuery({
    queryKey: ["portfolio-chart", period],
    queryFn: () => getCoinChart("bitcoin", period),
    staleTime: 60_000,
  });

  const data = (chart?.prices ?? []).map(([ts, price]) => ({
    time: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: price * SCALE,
  }));

  const latest = data[data.length - 1]?.value ?? 701;
  const first = data[0]?.value ?? 701;
  const isUp = latest >= first;

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold">Performance</p>
          <p className="text-gray-500 text-xs">Portfolio value over time</p>
        </div>
        <div className="flex gap-1 bg-[#0a0b0f] rounded-lg p-1">
          {(Object.keys(LABELS) as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${period === p ? "bg-white text-black" : "text-gray-400"}`}>
              {LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 8, color: "#fff", fontSize: 12 }}
            formatter={(v: number) => [`$${v.toFixed(2)}`, ""]} labelStyle={{ color: "#6b7280" }} />
          <Area type="monotone" dataKey="value" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth={2} fill="url(#perfGrad)" dot={false} activeDot={{ r: 5, fill: isUp ? "#22c55e" : "#ef4444" }} />
        </AreaChart>
      </ResponsiveContainer>
      {latest > 0 && (
        <div className="flex items-center justify-center mt-2">
          <div className="bg-[#0a1226] rounded-lg px-3 py-1 text-white text-xs font-semibold">${latest.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
