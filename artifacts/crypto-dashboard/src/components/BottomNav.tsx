import { useLocation } from "wouter";
import { BarChart2, Star, MessageSquare, Cpu } from "lucide-react";

export default function BottomNav() {
  const [location, navigate] = useLocation();

  const items = [
    { label: "Portfolio", icon: "briefcase", path: "/portfolio" },
    { label: "Markets", icon: "chart", path: "/markets" },
    { label: "Watchlist", icon: "star", path: "/watchlist" },
    { label: "Community", icon: "message", path: "/community" },
    { label: "Crypto AI", icon: "cpu", path: "/crypto-ai" },
  ];

  const isActive = (path: string) => location === path;

  const getIcon = (icon: string, active: boolean) => {
    const color = active ? "#4f7dfa" : "#6b7280";
    if (icon === "briefcase") return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    );
    if (icon === "chart") return <BarChart2 className="w-5 h-5" style={{ color }} />;
    if (icon === "star") return <Star className="w-5 h-5" style={{ color }} />;
    if (icon === "message") return <MessageSquare className="w-5 h-5" style={{ color }} />;
    if (icon === "cpu") return <Cpu className="w-5 h-5" style={{ color }} />;
    return null;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117] border-t border-[#1e2530] flex items-center justify-around py-2 z-40">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center gap-1 px-2 py-1"
        >
          {getIcon(item.icon, isActive(item.path))}
          <span className={`text-[10px] ${isActive(item.path) ? "text-blue-400" : "text-gray-500"}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
