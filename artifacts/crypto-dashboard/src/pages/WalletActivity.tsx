import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, CheckCircle, ExternalLink, ArrowDownLeft, ArrowUpRight, AlertTriangle } from "lucide-react";
import {
  CHARLES_WALLET,
  RECIPIENT_WALLET,
  WALLET_TRANSACTIONS,
  RECIPIENT_ACCOUNT,
  USDT_STATS,
  TOTAL_SENT,
  TOTAL_RECEIVED,
  type WalletTx,
} from "@/data/walletHistory";

function shortAddr(addr: string) {
  if (addr.length <= 20) return addr;
  return addr.slice(0, 10) + "..." + addr.slice(-6);
}

function TxDetail({ tx, onClose }: { tx: WalletTx; onClose: () => void }) {
  const isSent = tx.type === "sent";
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-[#0f1923] rounded-t-3xl border-t border-[#1e2530] p-5 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-bold px-2 py-1 rounded-lg ${isSent ? "bg-red-900/40 text-red-400" : "bg-green-900/40 text-green-400"}`}>
            {isSent ? "Sent" : "Received"}
          </span>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        <div className="text-center mb-5">
          <p className="text-white text-3xl font-bold mb-1">
            ≈ ${tx.usdValue.toFixed(2)}
          </p>
          <p className={`text-lg font-semibold ${isSent ? "text-red-400" : "text-green-400"}`}>
            {isSent ? "-" : "+"}{tx.amount} USDT
          </p>
        </div>

        <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4 space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Status</span>
            <span className="text-green-400 text-sm font-semibold">{tx.status}</span>
          </div>
          {tx.to && (
            <div className="flex justify-between items-start border-t border-[#1e2530] pt-3">
              <span className="text-gray-400 text-sm">Recipient</span>
              <span className="text-white text-xs font-mono text-right max-w-[180px] break-all">{shortAddr(tx.to)}</span>
            </div>
          )}
          {tx.from && tx.type === "received" && (
            <div className="flex justify-between items-start border-t border-[#1e2530] pt-3">
              <span className="text-gray-400 text-sm">From</span>
              <span className="text-white text-xs font-mono text-right max-w-[180px] break-all">{shortAddr(tx.from)}</span>
            </div>
          )}
          {tx.networkFee && (
            <div className="flex justify-between items-center border-t border-[#1e2530] pt-3">
              <span className="text-gray-400 text-sm">Network fee</span>
              <span className="text-white text-sm">{tx.networkFee}</span>
            </div>
          )}
        </div>

        {tx.confirmedBlocks && (
          <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4 space-y-3 mb-4">
            <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Blockchain Details (TRONSCAN)</p>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Status</span>
              <span className="text-green-400 text-xs font-semibold">CONFIRMED — {tx.confirmedBlocks}+ blocks</span>
            </div>
            <div className="flex justify-between border-t border-[#1e2530] pt-2">
              <span className="text-gray-400 text-xs">Confirmed SRs</span>
              <span className="text-white text-xs">{tx.confirmedSRs}</span>
            </div>
            {tx.bandwidth && (
              <div className="flex justify-between border-t border-[#1e2530] pt-2">
                <span className="text-gray-400 text-xs">Bandwidth</span>
                <span className="text-white text-xs">{tx.bandwidth}</span>
              </div>
            )}
            {tx.energy && (
              <div className="flex justify-between border-t border-[#1e2530] pt-2">
                <span className="text-gray-400 text-xs">Energy</span>
                <span className="text-white text-xs">{tx.energy.toLocaleString()}</span>
              </div>
            )}
            {tx.from && (
              <div className="border-t border-[#1e2530] pt-2">
                <p className="text-gray-400 text-xs mb-1">From</p>
                <p className="text-white text-xs font-mono break-all">{tx.from}</p>
              </div>
            )}
            {tx.to && (
              <div className="border-t border-[#1e2530] pt-2">
                <p className="text-gray-400 text-xs mb-1">To</p>
                <p className="text-white text-xs font-mono break-all">{tx.to}</p>
              </div>
            )}
          </div>
        )}

        <a href={`https://tronscan.org/#/address/${tx.to}`} target="_blank" rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-600/40 text-blue-400 text-sm font-medium">
          <ExternalLink className="w-4 h-4" /> View on block explorer
        </a>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-1 text-gray-500 hover:text-blue-400 transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function WalletActivityPage() {
  const [, navigate] = useLocation();
  const [selectedTx, setSelectedTx] = useState<WalletTx | null>(null);
  const [activeTab, setActiveTab] = useState<"history" | "wallet" | "recipient">("history");

  const netLoss = TOTAL_SENT - TOTAL_RECEIVED;

  return (
    <div className="min-h-screen bg-[#0a0b0f] pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1117] border-b border-[#1e2530] sticky top-0 z-10">
        <button onClick={() => navigate("/portfolio")} className="text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white font-bold text-base">Wallet Activity</h1>
          <p className="text-gray-400 text-[11px]">TRON / USDT — Evidence Record</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Alert banner */}
        <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-semibold mb-1">Unauthorized Transfers Detected</p>
            <p className="text-gray-300 text-xs leading-relaxed">
               {WALLET_TRANSACTIONS.filter(t => t.type === "sent").length} outbound USDT transactions were recorded from William's wallet to an external address. Total drained: <span className="text-red-400 font-bold">{TOTAL_SENT.toFixed(2)} USDT</span>
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530]">
            <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Total Sent</p>
            <p className="text-red-400 text-sm font-bold">{TOTAL_SENT.toFixed(1)} USDT</p>
          </div>
          <div className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530]">
            <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Received</p>
            <p className="text-green-400 text-sm font-bold">{TOTAL_RECEIVED.toFixed(1)} USDT</p>
          </div>
          <div className="bg-[#0d1117] rounded-xl p-3 border border-[#1e2530]">
            <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Net Loss</p>
            <p className="text-red-400 text-sm font-bold">{netLoss.toFixed(1)} USDT</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex bg-[#0d1117] rounded-xl p-1 border border-[#1e2530]">
          {([["history", "Transactions"], ["wallet", "My Wallet"], ["recipient", "Recipient"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === key ? "bg-white text-black" : "text-gray-400"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* TRANSACTION HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            <p className="text-gray-400 text-xs mb-3">Tap any row for details</p>
            <div className="space-y-2">
              {WALLET_TRANSACTIONS.map((tx) => (
                <button key={tx.id} onClick={() => setSelectedTx(tx)}
                  className="w-full bg-[#0d1117] rounded-xl p-4 border border-[#1e2530] flex items-center gap-3 text-left hover:border-blue-600/40 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "sent" ? "bg-red-900/30" : "bg-green-900/30"}`}>
                    {tx.type === "sent"
                      ? <ArrowUpRight className="w-4 h-4 text-red-400" />
                      : <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold capitalize">{tx.type}</p>
                    <p className="text-gray-400 text-xs truncate">
                      {tx.type === "sent" ? `To: ${shortAddr(tx.to ?? "")}` : `From: ${shortAddr(tx.from ?? "")}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === "sent" ? "text-red-400" : "text-green-400"}`}>
                      {tx.type === "sent" ? "-" : "+"}{tx.amount} USDT
                    </p>
                    <p className="text-gray-500 text-xs">≈ ${tx.usdValue.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MY WALLET TAB */}
        {activeTab === "wallet" && (
          <div className="space-y-4">
            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
               <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">William's Wallet Address</p>
              <div className="bg-[#0a0b0f] rounded-xl p-3 flex items-center justify-between gap-2 mb-1">
                <p className="text-white text-xs font-mono break-all flex-1">{CHARLES_WALLET}</p>
                <CopyBtn text={CHARLES_WALLET} />
              </div>
              <p className="text-gray-500 text-[11px]">TRON network · USDT (TRC-20)</p>
            </div>

            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">Balance at Time of Loss</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Your balance</span>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">$0.00</p>
                  <p className="text-gray-500 text-xs">0 USDT</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#0a0b0f] rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">Energy</p>
                  <p className="text-white text-sm font-bold">0</p>
                </div>
                <div className="flex-1 bg-[#0a0b0f] rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">Bandwidth</p>
                  <p className="text-white text-sm font-bold">389</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">USDT Network Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Market Cap", value: USDT_STATS.marketCap },
                  { label: "24h Volume", value: USDT_STATS.volume24h },
                  { label: "Circulating Supply", value: USDT_STATS.circulatingSupply },
                  { label: "Liquidity", value: USDT_STATS.liquidity },
                  { label: "Security Risk", value: USDT_STATS.securityRisk },
                  { label: "Token Created", value: USDT_STATS.created },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0a0b0f] rounded-xl p-3">
                    <p className="text-gray-500 text-[10px] mb-1">{s.label}</p>
                    <p className={`text-xs font-semibold ${s.value === "No risk found" ? "text-green-400" : "text-white"}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECIPIENT TAB */}
        {activeTab === "recipient" && (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-4">
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">⚠ Scammer Wallet — TRONSCAN</p>
              <p className="text-gray-300 text-xs">All outbound transactions from William's wallet were routed to this address.</p>
            </div>

            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">Recipient Address</p>
              <div className="bg-[#0a0b0f] rounded-xl p-3 flex items-center justify-between gap-2 mb-1">
                <p className="text-white text-xs font-mono break-all flex-1">{RECIPIENT_WALLET}</p>
                <CopyBtn text={RECIPIENT_WALLET} />
              </div>
              <a href={`https://tronscan.org/#/address/${RECIPIENT_WALLET}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 text-xs mt-2">
                <ExternalLink className="w-3 h-3" /> View on TRONSCAN
              </a>
            </div>

            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">Account Info (TRONSCAN)</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Assets", value: `$${RECIPIENT_ACCOUNT.assets.toFixed(2)}`, highlight: true },
                  { label: "TRX Available", value: `${RECIPIENT_ACCOUNT.trxAvailable} TRX` },
                  { label: "TRX Staked", value: `${RECIPIENT_ACCOUNT.trxStaked} TRX` },
                  { label: "Total Transactions", value: String(RECIPIENT_ACCOUNT.transactions) },
                  { label: "Total Transfers", value: `${RECIPIENT_ACCOUNT.transfers.total} (↓${RECIPIENT_ACCOUNT.transfers.out} ↑${RECIPIENT_ACCOUNT.transfers.in})` },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-3 ${s.highlight ? "bg-red-900/20 border border-red-800/40" : "bg-[#0a0b0f]"}`}>
                    <p className="text-gray-500 text-[10px] mb-1">{s.label}</p>
                    <p className={`text-xs font-semibold break-all ${s.highlight ? "text-red-400" : "text-white"}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-2xl border border-[#1e2530] p-4">
              <p className="text-white text-sm font-semibold mb-3">Funds Sent to This Address</p>
              <div className="space-y-2">
                {WALLET_TRANSACTIONS.filter((t) => t.type === "sent" && t.to === RECIPIENT_WALLET).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-[#1e2530] last:border-0">
                    <div>
                      {tx.bandwidth && <p className="text-gray-500 text-[11px]">BW: {tx.bandwidth} · Energy: {tx.energy?.toLocaleString()}</p>}
                    </div>
                    <p className="text-red-400 text-sm font-bold">-{tx.amount} USDT</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-gray-400 text-xs font-semibold">Total Drained</p>
                  <p className="text-red-400 font-bold">
                    -{WALLET_TRANSACTIONS.filter(t => t.type === "sent" && t.to === RECIPIENT_WALLET).reduce((s, t) => s + t.amount, 0).toFixed(1)} USDT
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedTx && <TxDetail tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
}
