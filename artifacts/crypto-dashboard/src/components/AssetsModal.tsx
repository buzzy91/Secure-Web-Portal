interface Props {
  onProceed: () => void;
  onClose: () => void;
  portfolioValue?: number;
}

export default function AssetsModal({ onProceed, onClose, portfolioValue = 345560.00 }: Props) {
  const holdings = [
    { symbol: "B", name: "Bitcoin", sub: "3.5144 BTC", value: null, color: "#f7931a" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-sm bg-[#0f1923] rounded-2xl border border-[#1e2530] p-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-green-900/60 border border-green-700/40 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M8 12l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Assets Available for Withdrawal</h2>
            <p className="text-gray-400 text-xs">Cleared after compliance review · Nicholas</p>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          {holdings.map((h) => (
            <div key={h.name} className="bg-[#0d1117] rounded-xl p-3 flex items-center gap-3 border border-[#1e2530]">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: h.color }}>{h.symbol}</div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{h.name}</p>
                <p className="text-gray-400 text-xs">{h.sub}</p>
              </div>
              <div className="text-right">
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin ml-auto" aria-label="Available balance pending" />
                <p className="text-green-400 text-xs">Available</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#0a1226] rounded-xl p-4 flex items-center justify-between mb-4 border border-blue-900/30">
          <p className="text-gray-400 text-xs">Total Available for Withdrawal</p>
          <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" aria-label="Total available balance pending" />
        </div>
        <button onClick={onProceed} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors text-sm">
          Proceed to Dashboard
        </button>
      </div>
    </div>
  );
}
