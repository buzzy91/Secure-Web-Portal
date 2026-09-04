import { useState } from "react";
import { Menu, X, Settings, ChevronDown, LogOut, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMarkets } from "@/services/coingecko";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { logout } = useAuth();

  const { data: markets } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const btc = markets?.find((m) => m.id === "bitcoin");
  const pct = btc?.price_change_percentage_24h ?? 2.43;
  const isUp = pct >= 0;

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#1e2530]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 1L3 5.5v6.5c0 5 3.8 9.7 9 10.9 5.2-1.2 9-5.9 9-10.9V5.5L12 1z" /></svg>
          </div>
          <span className="font-bold text-white text-base">Recover.com</span>
          <div className="flex items-center gap-1 ml-1">
            <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>{isUp ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${isUp ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>LIVE</span>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="text-white p-1"><Menu className="w-5 h-5" /></button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-[82%] max-w-sm bg-[#0f1923] h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#1e2530]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 1L3 5.5v6.5c0 5 3.8 9.7 9 10.9 5.2-1.2 9-5.9 9-10.9V5.5L12 1z" /></svg>
                </div>
                <span className="font-bold text-white">Recover.com</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 px-4 py-2">
              {[
                { label: "Portfolio", path: "/portfolio" },
                { label: "Markets", path: "/markets" },
                { label: "Watchlist", path: "/watchlist" },
                { label: "Community", path: "/community" },
                { label: "Crypto AI", path: "/crypto-ai" },
                { label: "Transactions", path: "/transactions" },
              ].map((item) => (
                <button key={item.path} onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  className="w-full flex items-center justify-between py-4 border-b border-[#1e2530]">
                  <span className={`text-base ${(item as any).alert ? "text-red-400 flex items-center gap-2" : "text-white"}`}>
                    {(item as any).alert && <span className="w-2 h-2 rounded-full bg-red-400 inline-block animate-pulse" />}
                    {item.label}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" className="w-4 h-4"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              ))}
              <button className="w-full flex items-center justify-between py-4 border-b border-[#1e2530]">
                <span className="text-white text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>
                <span className="bg-blue-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">4</span>
              </button>
              <button className="w-full flex items-center justify-between py-4 border-b border-[#1e2530]">
                <span className="text-green-400 text-base flex items-center gap-2"><Settings className="w-4 h-4 text-green-400" /> Settings</span>
              </button>
            </div>
            <div className="px-4 py-4 border-t border-[#1e2530]">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1e2530] text-white text-sm">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
