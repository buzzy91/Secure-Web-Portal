import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const FAILURE_REASON =
  "Minimum withdrawal on the dashboard is $800,000.00.";

const REVIEW_PERIOD_MS = 24 * 60 * 60 * 1000;

export interface WithdrawalTx {
  id: string;
  amount: number;
  method: string;
  asset: string;
  accountHolder: string;
  date: string;
  expiresAt: string;
  status: "pending" | "failed";
  failureReason?: string;
}

interface WithdrawalContextType {
  withdrawals: WithdrawalTx[];
  addWithdrawal: (w: Omit<WithdrawalTx, "id" | "date" | "expiresAt" | "status">) => void;
  markFailed: (id: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = "crypto_withdrawals_v3";

const PRESEEDED: WithdrawalTx[] = [];

const WithdrawalContext = createContext<WithdrawalContextType | null>(null);

function migrateWithdrawals(value: unknown): WithdrawalTx[] {
  if (!Array.isArray(value)) return PRESEEDED;

  const now = Date.now();
  return value.map((withdrawal) => {
    const submittedAt = new Date(withdrawal.date).getTime();
    const storedExpiry = new Date(withdrawal.expiresAt).getTime();
    const expiresAt = Number.isFinite(submittedAt)
      ? submittedAt + REVIEW_PERIOD_MS
      : Number.isFinite(storedExpiry)
        ? storedExpiry
        : now;
    const expired = expiresAt <= now;

    return {
      ...withdrawal,
      expiresAt: new Date(expiresAt).toISOString(),
      status: withdrawal.status === "failed" || expired ? "failed" : "pending",
      failureReason:
        withdrawal.status === "failed" || expired ? FAILURE_REASON : undefined,
    };
  });
}

export function WithdrawalProvider({ children }: { children: ReactNode }) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalTx[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return migrateWithdrawals(stored);
    } catch {
      return PRESEEDED;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.status === "pending" && new Date(w.expiresAt).getTime() <= now
            ? { ...w, status: "failed", failureReason: FAILURE_REASON }
            : w
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addWithdrawal = (w: Omit<WithdrawalTx, "id" | "date" | "expiresAt" | "status">) => {
    const now = new Date();
    setWithdrawals((prev) => [
      {
        ...w,
        id: `wd-${Date.now()}`,
        date: now.toISOString(),
        expiresAt: new Date(now.getTime() + REVIEW_PERIOD_MS).toISOString(),
        status: "pending",
      },
      ...prev,
    ]);
  };

  const markFailed = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: "failed", failureReason: FAILURE_REASON } : w
      )
    );
  };

  const clearAll = () => setWithdrawals(PRESEEDED);

  return (
    <WithdrawalContext.Provider value={{ withdrawals, addWithdrawal, markFailed, clearAll }}>
      {children}
    </WithdrawalContext.Provider>
  );
}

export function useWithdrawals() {
  const ctx = useContext(WithdrawalContext);
  if (!ctx) throw new Error("useWithdrawals must be used within WithdrawalProvider");
  return ctx;
}
