import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data30d = [
  { t: "May 17", v: 720000 }, { t: "May 20", v: 728000 }, { t: "May 23", v: 735000 },
  { t: "May 26", v: 741000 }, { t: "May 29", v: 748000 }, { t: "Jun 1", v: 751630 },
  { t: "Jun 4", v: 749000 }, { t: "Jun 7", v: 752000 }, { t: "Jun 10", v: 754000 },
  { t: "Jun 13", v: 755894 }, { t: "Jun 16", v: 755894 },
];
const data7d = [
  { t: "Jun 10", v: 750000 }, { t: "Jun 11", v: 751200 }, { t: "Jun 12", v: 753400 },
  { t: "Jun 13", v: 754600 }, { t: "Jun 14", v: 753800 }, { t: "Jun 15", v: 755100 },
  { t: "Jun 16", v: 755894 },
];
const data90d = [
  { t: "Mar", v: 650000 }, { t: "Apr", v: 680000 }, { t: "May", v: 710000 }, { t: "Jun", v: 755894 },
];
const dataAll = [
  { t: "2023", v: 200000 }, { t: "Q2", v: 350000 }, { t: "Q3", v: 480000 }, { t: "Q4", v: 520000 },
  { t: "2024", v: 600000 }, { t: "Q2", v: 680000 }, { t: "Q3", v: 720000 }, { t: "2025", v: 755894 },
];

const tabs = ["24h", "7d", "30d", "90d", "All"] as const;
type Tab = typeof tabs[number];

const dataMap: Record<Tab, typeof data30d> = {
  "24h": data7d,
  "7d": data7d,
  "30d": data30d,
  "90d": data90d,
  "All": dataAll,
};

export default function PerformanceChart() {
  const [activeTab, setActiveTab] = useState<Tab>("30d");
  const chartData = dataMap[activeTab];

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold">Performance</p>
          <p className="text-gray-500 text-xs">Portfolio value over time</p>
        </div>
        <div className="flex gap-1 bg-[#0a0b0f] rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${activeTab === t ? "bg-white text-black" : "text-gray-400"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 8, color: "#fff", fontSize: 12 }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
            labelStyle={{ color: "#6b7280" }}
          />
          <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: "#22c55e" }} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center mt-2">
        <div className="bg-[#0a1226] rounded-lg px-3 py-1 text-white text-xs font-semibold">$751,630</div>
      </div>
    </div>
  );
}
