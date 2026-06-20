import React from 'react';
import { Sparkles } from 'lucide-react';
import MentorSelector from '../components/MentorSelector';
import CreditsBadge from '../components/CreditsBadge';

interface HomePageProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  handleStartAnalysis: (e?: React.FormEvent, customUrl?: string) => void;
  analysisMode: 'quick_scan' | 'single_mentor' | 'mentor_board';
  setAnalysisMode: (mode: 'quick_scan' | 'single_mentor' | 'mentor_board') => void;
  selectedMentors: string[];
  setSelectedMentors: (mentors: string[]) => void;
  creditsBalance: number;
  onOpenEarnModal: () => void;
  creditsCost: number;
}

export default function HomePage({
  targetUrl,
  setTargetUrl,
  handleStartAnalysis,
  analysisMode,
  setAnalysisMode,
  selectedMentors,
  setSelectedMentors,
  creditsBalance,
  onOpenEarnModal,
  creditsCost,
}: HomePageProps) {
  const sampleUrls = ['stripe.com', 'linear.app', 'resend.com', 'supabase.com'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 flex-1 flex flex-col justify-center">
      {/* Title Hero */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
          <Sparkles className="h-3 w-3" />
          <span>AI BUSINESS MENTOR BOARD FOR INDIE BUILDERS</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight relative leading-none">
          Evaluate Your Product <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
            Commercial Viability Moat
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-350 font-sans leading-relaxed max-w-2xl mx-auto">
          Submit your product website and discover how it can make money, who would pay for it, and which advantages to amplify under custom business mentor lenses.
        </p>
      </div>

      {/* Input Submission Card & Mentor Selection Panel */}
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-950 pb-4">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
              Verify your API credits count:
            </span>
            <CreditsBadge balance={creditsBalance} onOpenEarnModal={onOpenEarnModal} />
          </div>

          <form onSubmit={(e) => handleStartAnalysis(e)} className="space-y-6">
            
            {/* Target URL inputs */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">
                Product Landing Page URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-mono text-sm pointer-events-none select-none">
                  https://
                </span>
                <input
                  id="url"
                  type="text"
                  required
                  placeholder="stripe.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full pl-[78px] pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                />
              </div>
            </div>

            {/* Mentor selection config block */}
            <MentorSelector
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              selectedMentors={selectedMentors}
              setSelectedMentors={setSelectedMentors}
            />

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold font-mono transition shadow-lg shadow-indigo-600/15 cursor-pointer uppercase tracking-wider"
            >
              Analyze Business Value (-{creditsCost} Credits)
            </button>
          </form>

          {/* Quick links samples */}
          <div className="pt-5 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] text-slate-550 font-mono uppercase font-bold tracking-wider">
              Or inspect verified samples:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleUrls.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleStartAnalysis(undefined, sample)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer font-mono font-medium"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
