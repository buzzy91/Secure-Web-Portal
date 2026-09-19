import { createContext, ReactNode, useContext } from "react";

const AMOUNT = 66320;

interface PendingDepositState {
  amount: number;
  confirmations: number;
  completed: boolean;
}

const PendingDepositContext = createContext<PendingDepositState | null>(null);

export function PendingDepositProvider({ children }: { children: ReactNode }) {
  const state: PendingDepositState = {
    amount: AMOUNT,
    confirmations: 5,
    completed: false,
  };

  return <PendingDepositContext.Provider value={state}>{children}</PendingDepositContext.Provider>;
}

export function usePendingDeposit() {
  const context = useContext(PendingDepositContext);
  if (!context) throw new Error("usePendingDeposit must be used within PendingDepositProvider");
  return context;
}