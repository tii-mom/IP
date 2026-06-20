import { useState } from 'react';
import { X, Check, Copy, Award, AlertCircle } from 'lucide-react';
import { CreditState } from '../types/audit';
import { claimGrowthReward } from '../lib/credits';

interface EarnCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditState: CreditState;
  setCreditState: (state: CreditState) => void;
}

export default function EarnCreditsModal({
  isOpen,
  onClose,
  creditState,
  setCreditState,
}: EarnCreditsModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString();
  const referralLink = `https://app.ideapilot.com?ref=${creditState.inviteCode}`;

  const handleClaim = (taskId: string, reward: number, desc: string, once: boolean = false) => {
    setErrorMsg(null);
    const res = claimGrowthReward(taskId, reward, desc, once);
    if (res.success) {
      setCreditState(res.state);
    } else {
      setErrorMsg(res.error || 'Failed to claim reward.');
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    // Claim reward for copying referral link first time
    handleClaim('invite', 20, 'Copied referral invite link', true);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Save feedback locally
    const savedFeedbacks = JSON.parse(localStorage.getItem('pilot_feedbacks') || '[]');
    savedFeedbacks.push({ text: feedback, date: new Date().toISOString() });
    localStorage.setItem('pilot_feedbacks', JSON.stringify(savedFeedbacks));

    handleClaim('feedback', 8, 'Submitted user feedback', true);
    setFeedback('');
  };

  const shareOnX = () => {
    const text = encodeURIComponent(
      `I just used IdeaPilot to evaluate my product’s business value.\nIt shows how my website can make money, who would pay for it, and which advantages to amplify.\nTry it: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    handleClaim('share', 10, 'Shared validation results on X/Twitter', false);
  };

  // Status checks for disabling/stamping completed indicators
  const isCheckedInToday = creditState.completedTasks['daily_checkin'] === today;
  const isSharedToday = creditState.completedTasks['share_x'] === today;
  const isInvitedClaimed = !!creditState.completedTasks['invite'];
  const isFeedbackSubmitted = !!creditState.completedTasks['feedback'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-400" />
            <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
              Earn Pilot Credits
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Complete quick daily and growth tasks to unlock advanced startup business reviews.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs py-2 px-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Task Items List */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          
          {/* Check-in */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Task 1: Daily Check-in</span>
              <h4 className="text-xs font-bold text-white uppercase font-mono mt-0.5">Claim Daily Check-in Credits</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Log in once a day to secure 5 credits.</p>
            </div>
            <button
              onClick={() => handleClaim('daily_checkin', 5, 'Daily check-in reward', false)}
              disabled={isCheckedInToday}
              className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition cursor-pointer select-none ${
                isCheckedInToday
                  ? 'bg-slate-900 border border-slate-800 text-slate-650'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isCheckedInToday ? 'Claimed' : '+5 Credits'}
            </button>
          </div>

          {/* Share on X */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Task 2: Spread the Word</span>
              <h4 className="text-xs font-bold text-white uppercase font-mono mt-0.5">Share IdeaPilot on X / Twitter</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Share your reference url on Twitter daily.</p>
            </div>
            <button
              onClick={shareOnX}
              disabled={isSharedToday}
              className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition cursor-pointer select-none ${
                isSharedToday
                  ? 'bg-slate-900 border border-slate-800 text-slate-650'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isSharedToday ? 'Claimed' : '+10 Credits'}
            </button>
          </div>

          {/* Invite Code */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Task 3: Referral invite</span>
                <h4 className="text-xs font-bold text-white uppercase font-mono mt-0.5">Invite a Builder</h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Share your referral link with other founders.</p>
              </div>
              <button
                onClick={copyReferralLink}
                disabled={isInvitedClaimed && !isCopied}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  isCopied
                    ? 'bg-emerald-600 border border-emerald-500 text-white'
                    : isInvitedClaimed
                    ? 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>{isInvitedClaimed ? 'Copy Invite Link' : '+20 Credits'}</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-[10px] font-mono text-slate-400 select-all select-none">
              {referralLink}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Task 4: User Feedback</span>
              <h4 className="text-xs font-bold text-white uppercase font-mono mt-0.5">Submit Feedback</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Provide a suggestion to improve the evaluation engine.</p>
            </div>
            
            <form onSubmit={submitFeedback} className="flex gap-2">
              <input
                type="text"
                value={feedback}
                disabled={isFeedbackSubmitted}
                placeholder={isFeedbackSubmitted ? "Feedback submitted. Thank you!" : "What should we add or improve next?"}
                onChange={(e) => setFeedback(e.target.value)}
                className="flex-grow p-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isFeedbackSubmitted || !feedback.trim()}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition shrink-0 ${
                  isFeedbackSubmitted
                    ? 'bg-slate-900 border border-slate-800 text-slate-650 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                }`}
              >
                {isFeedbackSubmitted ? 'Submitted' : '+8 Credits'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
