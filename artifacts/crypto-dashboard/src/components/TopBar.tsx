import { useState } from "react";
import { Menu, X, Settings, Bell, ChevronDown, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const menuItems = [
    { label: "Cryptocurrencies", hasChildren: true },
    { label: "Dashboards", hasChildren: true },
    { label: "DexScan", hasChildren: true },
    { label: "Exchanges", hasChildren: true },
    { label: "Community", hasChildren: true },
    { label: "Products", hasChildren: true },
    { label: "Crypto AI", hasChildren: true, icon: "🤖" },
    { label: "Notifications", badge: 4 },
    { label: "Settings", isGreen: true },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#1e2530]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" />
            </svg>
          </div>
          <span className="font-bold text-white text-base">Crypto.com</span>
          <div className="flex items-center gap-1 ml-1">
            <span className="text-green-400 text-xs">▲ 2.43%</span>
            <span className="bg-green-900/40 text-green-400 text-[10px] px-1.5 py-0.5 rounded font-semibold">LIVE</span>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="text-white p-1">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-[82%] max-w-sm bg-[#0f1923] h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#1e2530]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" />
                  </svg>
                </div>
                <span className="font-bold text-white">Crypto.com</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-4 py-2">
              {menuItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4 border-b border-[#1e2530]">
                  <span className={`text-base ${item.isGreen ? "text-green-400" : "text-white"}`}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-blue-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                    {item.hasChildren && <ChevronDown className="w-4 h-4 text-gray-500" />}
                    {item.isGreen && <Settings className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-[#1e2530]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1e2530] text-white text-sm"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
