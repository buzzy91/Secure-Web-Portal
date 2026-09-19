import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AMOUNT = 66320;
const TOTAL_CONFIRMATIONS = 5;
const CONFIRMATION_INTERVAL_MS = (4 * 60 * 60 * 1000) / TOTAL_CONFIRMATIONS;
const STARTED_AT_KEY = "crypto_pending_deposit_started_at";

interface PendingDepositState {
  amount: number;
  confirmations: number;
  completed: boolean;
  availableAmount: number;
}

const PendingDepositContext = createContext<PendingDepositState | null>(null);

export function PendingDepositProvider({ children }: { children: ReactNode }) {
  const [startedAt] = useState(() => {
    try {
      const stored = Number(localStorage.getItem(STARTED_AT_KEY));
      if (Number.isFinite(stored) && stored > 0) return stored;
      const now = Date.now();
      localStorage.setItem(STARTED_AT_KEY, String(now));
      return now;
    } catch {
      return Date.now();
    }
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const confirmations = Math.min(
    TOTAL_CONFIRMATIONS,
    Math.floor(Math.max(0, now - startedAt) / CONFIRMATION_INTERVAL_MS),
  );
  const completed = confirmations >= TOTAL_CONFIRMATIONS;
  const availableAmount = completed ? AMOUNT : 0;
  const state: PendingDepositState = { amount: AMOUNT, confirmations, completed, availableAmount };

  return <PendingDepositContext.Provider value={state}>{children}</PendingDepositContext.Provider>;
}

export function usePendingDeposit() {
  const context = useContext(PendingDepositContext);
  if (!context) throw new Error("usePendingDeposit must be used within PendingDepositProvider");
  return context;
}