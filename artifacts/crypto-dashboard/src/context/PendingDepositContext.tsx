import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const DURATION_MS = 7 * 60 * 60 * 1000;
const AMOUNT = 345560;
const SHARED_STARTED_AT = Date.parse("2026-09-05T09:09:20-07:00");

interface PendingDepositState {
  amount: number;
  confirmations: number;
  completed: boolean;
}

const PendingDepositContext = createContext<PendingDepositState | null>(null);

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
  const [state, setState] = useState(() => calculate(SHARED_STARTED_AT));

  useEffect(() => {
    const interval = window.setInterval(() => setState(calculate(SHARED_STARTED_AT)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <PendingDepositContext.Provider value={state}>{children}</PendingDepositContext.Provider>;
}

export function usePendingDeposit() {
  const context = useContext(PendingDepositContext);
  if (!context) throw new Error("usePendingDeposit must be used within PendingDepositProvider");
  return context;
}