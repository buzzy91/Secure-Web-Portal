import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "@/context/TransactionContext";
import { fmt, type CoinMarket } from "@/services/coingecko";

interface Props {
  coin: CoinMarket;
  onClose: () => void;
  defaultType?: "buy" | "sell";
}

export default function BuyModal({ coin, onClose, defaultType = "buy" }: Props) {
  const [type, setType] = useState<"buy" | "sell">(defaultType);
  const [amount, setAmount] = useState("");
  const { addTransaction, holdings } = useTransactions();

  const price = coin.current_price;
  const total = parseFloat(amount || "0") * price;
  const holding = holdings.find((h) => h.coinId === coin.id);

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (type === "sell" && (!holding || holding.amount < amt)) {
      toast.error("Insufficient balance");
      return;
    }
    addTransaction({
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      type,
      amount: amt,
      price,
      total,
    });
    toast.success(`${type === "buy" ? "Bought" : "Sold"} ${amt} ${coin.symbol.toUpperCase()} for $${total.toFixed(2)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f1923] rounded-t-3xl border-t border-[#1e2530] p-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
            {type === "buy" ? "Buy" : "Sell"} {coin.name}
          </h3>
          <button onClick={onClose} className="text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* Buy / Sell toggle */}
        <div className="flex bg-[#0d1117] rounded-xl p-1 mb-5 border border-[#1e2530]">
          {(["buy", "sell"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors ${type === t ? (t === "buy" ? "bg-green-600 text-white" : "bg-red-600 text-white") : "text-gray-400"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Current price */}
        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530] mb-4 flex justify-between items-center">
          <span className="text-gray-400 text-sm">Current Price</span>
          <span className="text-white font-bold">{fmt(price, price < 1 ? 6 : 2)}</span>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs mb-2 block">Amount ({coin.symbol.toUpperCase()})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter ${coin.symbol.toUpperCase()} amount`}
            min="0"
            step="any"
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Total */}
        <div className="bg-[#0a1226] rounded-xl p-3 border border-blue-900/30 mb-5 flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total (USD)</span>
          <span className="text-white font-bold">${total > 0 ? total.toFixed(2) : "0.00"}</span>
        </div>

        {holding && (
          <p className="text-gray-500 text-xs mb-4">Balance: {holding.amount.toFixed(6)} {coin.symbol.toUpperCase()}</p>
        )}

        <button onClick={handleSubmit}
          className={`w-full py-4 rounded-xl text-white font-semibold text-sm transition-colors ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
          Confirm {type === "buy" ? "Buy" : "Sell"}
        </button>
      </div>
    </div>
  );
}
