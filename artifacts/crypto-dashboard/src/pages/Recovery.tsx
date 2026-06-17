import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Lock, Bitcoin, CheckCircle, ChevronRight, Copy, Check } from "lucide-react";

const BTC_ADDRESS = "bc1qzjzddrzz4c82d7gn8tkv7u8x20jtm5gjyd3frl";

export default function RecoveryPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"info" | "payment">("info");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (document.getElementById("smartsupp-script")) return;
    const win = window as any;
    const _smartsupp = (win._smartsupp = win._smartsupp || {});
    _smartsupp.key = "928acc5bc26bfee1bc790e1fa9157b82ed817c30";
    win.smartsupp =
      win.smartsupp ||
      function (...args: any[]) {
        (win.smartsupp as any)._.push(args);
      };
    (win.smartsupp as any)._ = [];
    const s = document.getElementsByTagName("script")[0];
    const c = document.createElement("script");
    c.id = "smartsupp-script";
    c.type = "text/javascript";
    c.charset = "utf-8";
    c.async = true;
    c.src = "https://www.smartsuppchat.com/loader.js?";
    s.parentNode!.insertBefore(c, s);

    return () => {
      const el = document.getElementById("smartsupp-script");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-[#0d1117] border-b border-[#1e2530] sticky top-0 z-10">
        <button onClick={() => navigate("/portfolio")} className="w-8 h-8 rounded-full bg-[#1e2530] flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">Recovery Assistance</h1>
          <p className="text-gray-500 text-[11px]">Chriscore Cyberhelp Specialists</p>
        </div>
        <div className="flex items-center gap-1 bg-green-900/30 border border-green-700/30 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          <span className="text-green-400 text-[10px] font-bold">SECURE</span>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {step === "info" ? (
          <>
            {/* Hero banner */}
            <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0f1e40 0%, #0f0a30 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 50%, #4f7dfa 0%, transparent 60%)" }} />
              <div className="relative p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Wallet Recovery Service</p>
                    <p className="text-blue-300/70 text-xs">Powered by Chriscore Cyberhelp</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Our specialists will conduct a full security audit, recover access to your restricted funds, and set up enhanced account protection.
                </p>
              </div>
            </div>

            {/* Service fee card */}
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white font-bold text-base">Recovery Assistance Fee</p>
                <p className="text-white text-2xl font-black">$299.99</p>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Full Security Audit", desc: "Complete analysis of unusual activity" },
                  { label: "Fund Recovery Process", desc: "Lift restriction on pending $400 transaction" },
                  { label: "Account Protection Setup", desc: "Enhanced 2FA and wallet security" },
                  { label: "Specialist Support", desc: "Dedicated Chriscore agent assigned" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-semibold">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important notes */}
              <div className="bg-blue-950/40 border border-blue-800/30 rounded-xl p-3 space-y-2 mb-5">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Important Notes</p>
                {[
                  "This is a service fee, not a deposit unlock fee",
                  "Payment is only required if you choose to proceed with recovery",
                  "Full transparency is maintained before and during the process",
                ].map((note) => (
                  <div key={note} className="flex items-start gap-2">
                    <span className="text-blue-400 text-xs mt-0.5 flex-shrink-0">•</span>
                    <p className="text-gray-300 text-xs leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Payment step */}
            <div className="bg-[#0d1117] border border-[#1e2530] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white font-bold text-base">Secure Payment</p>
                <Lock className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-gray-500 text-xs mb-5">256-bit SSL encrypted · Crypto payments accepted</p>

              {/* Amount summary */}
              <div className="bg-[#0a0b0f] rounded-xl p-4 mb-5 flex items-center justify-between border border-[#1e2530]">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Amount due</p>
                  <p className="text-white text-xl font-black">$299.99 USD</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-0.5">Service</p>
                  <p className="text-white text-sm font-semibold">Recovery Assistance</p>
                </div>
              </div>

              {/* Payment method — Cryptocurrency only */}
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Payment Method</p>
              <div className="mb-5">
                <div className="border border-orange-500/50 bg-orange-950/10 rounded-xl">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0a0b0f] flex items-center justify-center flex-shrink-0">
                      <Bitcoin className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">Cryptocurrency</p>
                      <p className="text-gray-500 text-xs">Bitcoin (BTC)</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                  </div>

                  {/* Bitcoin wallet address */}
                  <div className="mx-4 mb-4 bg-[#0a0b0f] border border-orange-800/30 rounded-xl p-3">
                    <p className="text-orange-300/70 text-[10px] font-bold uppercase tracking-wider mb-2">Bitcoin (BTC) Wallet Address</p>
                    <p className="text-orange-200 text-[11px] font-mono break-all leading-relaxed mb-3">
                      {BTC_ADDRESS}
                    </p>
                    <button
                      onClick={handleCopy}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        copied
                          ? "bg-green-900/40 border border-green-700/40 text-green-400"
                          : "bg-orange-900/30 border border-orange-700/30 text-orange-300 hover:bg-orange-900/50"
                      }`}
                    >
                      {copied ? (
                        <><Check className="w-3.5 h-3.5" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy Address</>
                      )}
                    </button>
                    <p className="text-gray-600 text-[10px] mt-2 text-center">Send exactly $299.99 USD worth of BTC to this address</p>
                  </div>
                </div>
              </div>

              {/* Secure note */}
              <div className="bg-green-950/30 border border-green-800/20 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-xs leading-relaxed">
                  All payments are processed securely. Please contact support if you have any questions before proceeding.
                </p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 mb-3">
                <Lock className="w-4 h-4" /> Confirm Payment
              </button>
              <button onClick={() => setStep("info")} className="w-full bg-[#1e2530] text-gray-300 font-semibold py-3 rounded-xl text-sm hover:bg-[#252d3a] transition-colors">
                ← Back
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center gap-6">
              {[
                { icon: <Shield className="w-4 h-4 text-green-400" />, label: "SSL Secured" },
                { icon: <Lock className="w-4 h-4 text-blue-400" />, label: "256-bit Encrypted" },
                { icon: <CheckCircle className="w-4 h-4 text-purple-400" />, label: "Verified Service" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1">
                  {b.icon}
                  <p className="text-gray-500 text-[10px]">{b.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
