import { useState, useEffect } from 'react';
import {
  Zap,
  RefreshCcw,
  Info,
  X
} from 'lucide-react';

import { BusinessAuditResult, CreditState } from './types/audit';
import { analyzeWebsite } from './lib/api';
import { loadCreditState, spendCredits, refundCredits } from './lib/credits';
import { normalizeUrlForHref } from './lib/url';
import HomePage from './pages/HomePage';
import AnalyzingPage from './pages/AnalyzingPage';
import ReportPage from './pages/ReportPage';
import SocialShareCardModal from './components/SocialShareCardModal';
import EarnCreditsModal from './components/EarnCreditsModal';

import { LanguageProvider, useI18n } from './i18n';
import LanguageToggle from './components/LanguageToggle';

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}

function AppShell() {
  const { t, language } = useI18n();

  const [currentView, setCurrentView] = useState<'home' | 'analyzing' | 'report'>('home');

  const [targetUrl, setTargetUrl] = useState('');
  const projectType = 'SaaS';
  const targetAudience = '';
  const additionalDetails = '';

  // Analysis Result States
  const [auditResult, setAuditResult] = useState<BusinessAuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Credit and task states
  const [creditState, setCreditState] = useState<CreditState>({
    balance: 10,
    date: '',
    completedTasks: {},
    inviteCode: '',
    transactions: []
  });
  const [isEarnModalOpen, setIsEarnModalOpen] = useState(false);

  // Mentor Selection Modes
  const [analysisMode, setAnalysisMode] = useState<'quick_scan' | 'single_mentor' | 'mentor_board'>('quick_scan');
  const [selectedMentors, setSelectedMentors] = useState<string[]>(['naval_ravikant']);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [logProgress, setLogProgress] = useState(0);



  // Initialize credits state on mount
  useEffect(() => {
    setCreditState(loadCreditState());
  }, []);

  const handleReset = () => {
    setCurrentView('home');
    setTargetUrl('');
    setAuditResult(null);
    setErrorMessage(null);
  };

  // Calculate Credit Cost dynamically based on mode
  const getCreditsCost = () => {
    if (analysisMode === 'quick_scan') return 3;
    if (analysisMode === 'single_mentor') return 5;
    return 12;
  };
  const creditsCost = getCreditsCost();

  const handleStartAnalysis = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const rawUrl = customUrl || targetUrl;
    if (!rawUrl) return;
    
    const urlToAnalyze = normalizeUrlForHref(rawUrl);
    setTargetUrl(urlToAnalyze);
    setErrorMessage(null);

    // Verify credits availability
    const cost = getCreditsCost();
    if (creditState.balance < cost) {
      setIsEarnModalOpen(true);
      return;
    }

    // Deduct credits prior to launching API request
    const spendRes = spendCredits(cost, `Triggered ${analysisMode} scan for ${urlToAnalyze}`);
    if (!spendRes.success || !spendRes.state) {
      setIsEarnModalOpen(true);
      return;
    }
    setCreditState(spendRes.state);

    setCurrentView('analyzing');
    setTerminalLogs([]);
    setLogProgress(0);

    const initialLogs = [
      `⚡ [0.1s] ${t.loadingLogs.initiating}`,
      `🌐 [0.4s] ${t.loadingLogs.connecting}`,
      `🔍 [0.8s] ${t.loadingLogs.requesting}`,
      `📈 [1.4s] ${t.loadingLogs.running}`,
      `🤖 [2.0s] ${t.loadingLogs.booting}`,
      `🤖 [2.7s] ${t.loadingLogs.querying}`,
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < initialLogs.length) {
        setTerminalLogs((prev) => [...prev, initialLogs[logIndex]]);
        setLogProgress(((logIndex + 1) / initialLogs.length) * 80);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const result = await analyzeWebsite({
        url: urlToAnalyze,
        projectType,
        audience: targetAudience,
        details: additionalDetails,
        analysisMode,
        selectedMentors,
        language
      });

      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          `✅ [3.5s] ${t.loadingLogs.parsed}`,
          `📊 [3.8s] ${t.loadingLogs.compiling}`,
          `🚀 [4.0s] ${t.loadingLogs.complete}`,
        ]);
        setLogProgress(100);

        setTimeout(() => {
          setAuditResult(result);
          setCurrentView('report');
        }, 500);
      }, 2500);

    } catch (err: any) {
      clearInterval(interval);
      
      // Refund credits on API failure
      const refundedState = refundCredits(cost, `Refund for failed API scan: ${err.message}`);
      setCreditState(refundedState);

      const displayError = language === 'zh-CN' && err.message === 'Our co-pilot server encountered an auditing error. Please try again.'
        ? t.errors.analyzeFailed
        : (err.message || t.errors.analyzeFailed);

      setErrorMessage(displayError);
      setCurrentView('home');
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans text-slate-200 bg-slate-950">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Idea<span className="text-cyan-400">Pilot</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-gray-400 font-mono">
              v2.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentView === 'report' && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5 transition py-1 px-3 border border-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                <RefreshCcw className="h-3 w-3" />
                <span>{t.common.newAudit}</span>
              </button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white transition font-mono"
            >
              {t.common.docs}
            </a>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="bg-red-950/40 border-b border-red-500/20 text-red-300 text-xs py-3 px-4 text-center flex items-center justify-center gap-2">
          <Info className="h-4 w-4 text-red-400" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="h-4 w-4 hover:bg-red-900/30 rounded ml-2">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            handleStartAnalysis={handleStartAnalysis}
            analysisMode={analysisMode}
            setAnalysisMode={setAnalysisMode}
            selectedMentors={selectedMentors}
            setSelectedMentors={setSelectedMentors}
            creditsBalance={creditState.balance}
            onOpenEarnModal={() => setIsEarnModalOpen(true)}
            creditsCost={creditsCost}
          />
        )}

        {currentView === 'analyzing' && (
          <AnalyzingPage
            logProgress={logProgress}
            terminalLogs={terminalLogs}
          />
        )}

        {currentView === 'report' && auditResult && (
          <ReportPage
            auditResult={auditResult}
            targetUrl={targetUrl}
            setIsShareModalOpen={setIsShareModalOpen}
            handleReset={handleReset}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded flex items-center justify-center">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span>© 2026 IdeaPilot Startup Audit. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {auditResult && (
        <SocialShareCardModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          auditResult={auditResult}
          targetUrl={targetUrl}
          dynamicallyAdjustedScore={auditResult.score}
          dynamicGrade={auditResult.grade}
        />
      )}

      <EarnCreditsModal
        isOpen={isEarnModalOpen}
        onClose={() => setIsEarnModalOpen(false)}
        creditState={creditState}
        setCreditState={setCreditState}
      />
    </div>
  );
}
