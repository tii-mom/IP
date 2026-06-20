import { Award } from 'lucide-react';

interface CreditsBadgeProps {
  balance: number;
  onOpenEarnModal: () => void;
}

export default function CreditsBadge({ balance, onOpenEarnModal }: CreditsBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-full text-xs font-mono shadow-inner shrink-0 select-none">
      <div className="flex items-center gap-1">
        <Award className="h-4 w-4 text-indigo-400" />
        <span className="text-slate-300">Credits:</span>
        <span className="font-bold text-white">{balance}</span>
      </div>
      <span className="text-slate-700">|</span>
      <button
        onClick={onOpenEarnModal}
        className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold cursor-pointer font-mono"
      >
        Earn Credits
      </button>
    </div>
  );
}
