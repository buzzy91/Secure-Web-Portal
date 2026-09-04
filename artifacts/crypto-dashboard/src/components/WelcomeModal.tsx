interface Props {
  onViewAssets: () => void;
  onClose: () => void;
}

export default function WelcomeModal({ onViewAssets, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-sm bg-[#0f1923] rounded-2xl border border-[#1e2530] p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-900/60 flex items-center justify-center mb-4 border border-blue-700/40">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M12 1L3 5.5v6.5c0 5 3.8 9.7 9 10.9 5.2-1.2 9-5.9 9-10.9V5.5L12 1z" stroke="#4f7dfa" strokeWidth="1.5" fill="#0a1a3d" />
              <path d="M9 12l2 2 4-4" stroke="#4f7dfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">SECURE ACCESS GRANTED</p>
          <h2 className="text-2xl font-bold text-white mb-1">
            Welcome back,
          </h2>
          <h2 className="text-2xl font-bold text-blue-400 mb-3">Nicholas</h2>
          <p className="text-gray-400 text-sm">Your account has been successfully verified.</p>
        </div>

        <div className="bg-[#0a1e15] border border-green-900/40 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" />
                <path d="M8 12l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold mb-1">Investigation Complete — Assets Released</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Following the completion of the compliance investigation, your portfolio assets have been reviewed and cleared. The following holdings are now{" "}
                <span className="text-green-400">available for withdrawal.</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onViewAssets}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
            <path d="M23 6l-9.5 9.5-5-5L1 18" />
            <path d="M17 6h6v6" />
          </svg>
          View Available Assets
        </button>
      </div>
    </div>
  );
}
