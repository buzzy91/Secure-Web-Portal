import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Transaction {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  date: string;
}

export interface Holding {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  avgBuyPrice: number;
  totalInvested: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  holdings: Holding[];
  watchlist: string[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  toggleWatchlist: (coinId: string) => void;
  isWatchlisted: (coinId: string) => boolean;
  totalInvested: number;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

const STORAGE_KEY = "crypto_transactions_v3";
const WATCHLIST_KEY = "crypto_watchlist";

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '["bitcoin","ethereum","solana"]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const holdings: Holding[] = Object.values(
    transactions.reduce<Record<string, Holding>>((acc, tx) => {
      const key = tx.coinId;
      if (!acc[key]) {
        acc[key] = { coinId: tx.coinId, coinName: tx.coinName, coinSymbol: tx.coinSymbol, coinImage: tx.coinImage, amount: 0, avgBuyPrice: 0, totalInvested: 0 };
      }
      if (tx.type === "buy") {
        acc[key].totalInvested += tx.total;
        acc[key].amount += tx.amount;
        acc[key].avgBuyPrice = acc[key].totalInvested / acc[key].amount;
      } else {
        acc[key].amount = Math.max(0, acc[key].amount - tx.amount);
        acc[key].totalInvested = acc[key].amount * acc[key].avgBuyPrice;
      }
      return acc;
    }, {})
  ).filter((h) => h.amount > 0);

  const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);

  const addTransaction = (tx: Omit<Transaction, "id" | "date">) => {
    setTransactions((prev) => [
      { ...tx, id: Date.now().toString(), date: new Date().toISOString() },
      ...prev,
    ]);
  };

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  const isWatchlisted = (coinId: string) => watchlist.includes(coinId);

  return (
    <TransactionContext.Provider value={{ transactions, holdings, watchlist, addTransaction, toggleWatchlist, isWatchlisted, totalInvested }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}
