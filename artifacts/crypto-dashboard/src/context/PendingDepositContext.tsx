import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "recover_simulated_deposit_7h_started_at";
const DURATION_MS = 7 * 60 * 60 * 1000;
const AMOUNT = 345560;

interface PendingDepositState {
  amount: number;
  confirmations: number;
  completed: boolean;
}

const PendingDepositContext = createContext<PendingDepositState | null>(null);

function getStartedAt() {
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  if (Number.isFinite(stored) && stored > 0) return stored;
  const startedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, String(startedAt));
  return startedAt;
}

function calculate(startedAt: number): PendingDepositState {
  const elapsed = Math.max(0, Date.now() - startedAt);
  const completed = elapsed >= DURATION_MS;
  return {
    amount: AMOUNT,
    confirmations: completed ? 5 : Math.min(4, Math.floor(elapsed / (DURATION_MS / 5))),
    completed,
  };
}

export function PendingDepositProvider({ children }: { children: ReactNode }) {
  const [startedAt] = useState(getStartedAt);
  const [state, setState] = useState(() => calculate(startedAt));

  useEffect(() => {
    const interval = window.setInterval(() => setState(calculate(startedAt)), 1000);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  return <PendingDepositContext.Provider value={state}>{children}</PendingDepositContext.Provider>;
}

export function usePendingDeposit() {
  const context = useContext(PendingDepositContext);
  if (!context) throw new Error("usePendingDeposit must be used within PendingDepositProvider");
  return context;
}