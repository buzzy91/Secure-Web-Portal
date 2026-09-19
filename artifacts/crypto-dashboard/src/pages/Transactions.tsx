import { useLocation } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTransactions } from "@/context/TransactionContext";
import { getMarkets, fmt } from "@/services/coingecko";
import { usePendingDeposit } from "@/context/PendingDepositContext";

export default function TransactionsPage() {
  const [, navigate] = useLocation();
  const { transactions, holdings } = useTransactions();
  const pendingDeposit = usePendingDeposit();

  const { data: markets } = useQuery({
    queryKey: ["markets-full"],
    queryFn: () => getMarkets(1, 100),
    staleTime: 30_000,
  });

  const totalCurrentValue = holdings.reduce((sum, h) => {
    const live = markets?.find((m) => m.id === h.coinId)?.current_price ?? h.avgBuyPrice;
    return sum + h.amount * live;
  }, 0);

  const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalPnl = totalCurrentValue - totalInvested;
  const pnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-8">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1117] border-b border-[#1e2530]">
        <button onClick={() => navigate("/portfolio")} className="text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white font-bold text-base">Transaction History</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* P&L Summary */}
        {holdings.length > 0 && (
          <div className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
            <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wide">Portfolio Summary</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a0b0f] rounded-xl p-3">
                <p className="text-gray-500 text-[10px] mb-1">INVESTED</p>
                <p className="text-white text-sm font-bold">{fmt(totalInvested)}</p>
              </div>
              <div className="bg-[#0a0b0f] rounded-xl p-3">
                <p className="text-gray-500 text-[10px] mb-1">CURRENT</p>
                <p className="text-white text-sm font-bold">{fmt(totalCurrentValue)}</p>
              </div>
              <div className="bg-[#0a0b0f] rounded-xl p-3">
                <p className="text-gray-500 text-[10px] mb-1">P&amp;L</p>
                <p className={`text-sm font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}
                </p>
                <p className={`text-[10px] ${pnlPct >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Holdings */}
        {holdings.length > 0 && (
          <div>
            <p className="text-white font-semibold mb-3">Active Holdings</p>
            <div className="space-y-3">
              {holdings.map((h) => {
                const live = markets?.find((m) => m.id === h.coinId)?.current_price ?? h.avgBuyPrice;
                const currentValue = h.amount * live;
                const pnl = currentValue - h.totalInvested;
                const pnlP = h.totalInvested > 0 ? (pnl / h.totalInvested) * 100 : 0;
                return (
                  <div key={h.coinId} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530]">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={h.coinImage} alt={h.coinName} className="w-9 h-9 rounded-full" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{h.coinName}</p>
                        <p className="text-gray-400 text-xs">{h.amount.toFixed(6)} {h.coinSymbol.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">{fmt(currentValue)}</p>
                        <p className={`text-xs font-medium ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {pnl >= 0 ? <TrendingUp className="inline w-3 h-3 mr-0.5" /> : <TrendingDown className="inline w-3 h-3 mr-0.5" />}
                          {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)} ({pnlP >= 0 ? "+" : ""}{pnlP.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#0a0b0f] rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Avg Buy Price</p>
                        <p className="text-white font-medium">{fmt(h.avgBuyPrice, h.avgBuyPrice < 1 ? 6 : 2)}</p>
                      </div>
                      <div className="bg-[#0a0b0f] rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Live Price</p>
                        <p className="text-white font-medium">{fmt(live, live < 1 ? 6 : 2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transaction log */}
        <div>
          <p className="text-white font-semibold mb-3">Transaction Log</p>
          <div className={`rounded-2xl p-4 border mb-3 ${pendingDeposit.completed ? "bg-green-950/20 border-green-800/40" : "bg-amber-950/20 border-amber-800/40"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-bold">Incoming transfer</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${pendingDeposit.completed ? "bg-green-900/50 text-green-400" : "bg-amber-900/50 text-amber-400"}`}>
                    {pendingDeposit.completed ? "COMPLETED" : "PENDING"}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px]">sim transaction</p>
              </div>
               <p className="text-white text-sm font-black">${pendingDeposit.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Network confirmations</span>
                <span className={pendingDeposit.completed ? "text-green-400 font-bold" : "text-amber-400 font-bold"}>{pendingDeposit.confirmations}/5</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((confirmation) => (
                  <div key={confirmation} className={`h-1.5 rounded-full ${confirmation <= pendingDeposit.confirmations ? "bg-green-400" : "bg-[#27303d]"}`} />
                ))}
              </div>
              {pendingDeposit.completed && (
                <p className="text-gray-500 text-[11px] mt-2">Confirmed and added to available balance</p>
              )}
            </div>
          </div>
          {transactions.length > 0 && (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-[#0d1117] rounded-2xl p-4 border border-[#1e2530] flex items-center gap-3">
                  <img src={tx.coinImage} alt={tx.coinName} className="w-9 h-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{tx.coinName}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${tx.type === "buy" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {tx.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{new Date(tx.date).toLocaleDateString()} · @ {fmt(tx.price, tx.price < 1 ? 6 : 2)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                      {tx.type === "buy" ? "+" : "-"}{tx.amount} {tx.coinSymbol.toUpperCase()}
                    </p>
                    <p className="text-gray-400 text-xs">${tx.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
