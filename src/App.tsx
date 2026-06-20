import React, { useState } from 'react';
import {
  Zap,
  RefreshCcw,
  Info,
  X,
  Printer
} from 'lucide-react';

import { AuditResult } from './types/audit';
import { analyzeWebsite } from './lib/api';
import HomePage from './pages/HomePage';
import AnalyzingPage from './pages/AnalyzingPage';
import ReportPage from './pages/ReportPage';
import CertificateModal from './components/CertificateModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'analyzing' | 'report'>('home');

  const [targetUrl, setTargetUrl] = useState('');
  const projectType = 'SaaS';
  const targetAudience = '';
  const additionalDetails = '';

  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fixedHotspots, setFixedHotspots] = useState<number[]>([]);
  const [selectedHotspotId, setSelectedHotspotId] = useState<number>(1);
  const [mockupMode, setMockupMode] = useState<'after' | 'before'>('after');

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateTheme, setCertificateTheme] = useState<'neon' | 'cyberpunk' | 'sunset' | 'slate'>('slate');

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [logProgress, setLogProgress] = useState(0);

  const [simulatedPrices, setSimulatedPrices] = useState<string[]>([]);
  const [customTexts, setCustomTexts] = useState<Record<number, string>>({});
  const [copiedPrescriptionId, setCopiedPrescriptionId] = useState<number | null>(null);

  // Revenue simulator sliders (traffic + contract value)
  const [calcMonthlyTraffic, setCalcMonthlyTraffic] = useState(5000);
  const [calcAOV, setCalcAOV] = useState(49);

  const handleReset = () => {
    setCurrentView('home');
    setTargetUrl('');
    setAuditResult(null);
    setFixedHotspots([]);
    setCustomTexts({});
    setErrorMessage(null);
  };

  const handleToggleFix = (id: number) => {
    if (fixedHotspots.includes(id)) {
      setFixedHotspots(fixedHotspots.filter((h) => h !== id));
    } else {
      setFixedHotspots([...fixedHotspots, id]);
    }
  };

  const handleStartAnalysis = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const urlToAnalyze = customUrl || targetUrl;
    if (!urlToAnalyze) return;

    if (customUrl) {
      setTargetUrl(customUrl);
    }

    setErrorMessage(null);
    setCurrentView('analyzing');
    setTerminalLogs([]);
    setLogProgress(0);

    const initialLogs = [
      '⚡ [0.1s] Initiating secure sandbox crawler channel...',
      '🌐 [0.4s] Connecting to target URL apex domain...',
      '🔍 [0.8s] Requesting HTML payload and structural metadata...',
      '📈 [1.4s] Running visual positioning heuristics models...',
      '💲 [2.0s] Simulating price anchoring parameters & payment conversion elasticity...',
      '🤖 [2.7s] Querying DeepSeek V4 Flash co-pilot context...',
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
        details: additionalDetails
      });

      // Ensure logs finish and transit to report view
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          '✅ [3.5s] Context mapping parsed successfully!',
          '📊 [3.8s] Rendering interactive high-res mockup overlay...',
          '🚀 [4.0s] Ready to boot!',
        ]);
        setLogProgress(100);

        setTimeout(() => {
          setAuditResult(result);
          setSimulatedPrices(result.monetizationTiers.map((t) => t.price));
          if (result.hotspots.length > 0) {
            setSelectedHotspotId(result.hotspots[0].id);
          }
          setCurrentView('report');
        }, 500);
      }, 2500);

    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Auditing failed');
      setCurrentView('home');
    }
  };

  const currentHotspotCount = auditResult?.hotspots.length || 1;
  const initialBaseScore = auditResult?.score || 75;
  const dynamicallyAdjustedScore = Math.min(
    100,
    initialBaseScore + Math.round((fixedHotspots.length / currentHotspotCount) * (100 - initialBaseScore))
  );

  const getDynamicGrade = (score: number) => {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    return 'D';
  };
  const dynamicGrade = getDynamicGrade(dynamicallyAdjustedScore);



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
                <span>New Audit</span>
              </button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white transition font-mono"
            >
              Docs
            </a>
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

      {/* MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            handleStartAnalysis={handleStartAnalysis}
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
            dynamicallyAdjustedScore={dynamicallyAdjustedScore}
            dynamicGrade={dynamicGrade}
            initialBaseScore={initialBaseScore}
            fixedHotspots={fixedHotspots}
            selectedHotspotId={selectedHotspotId}
            setSelectedHotspotId={setSelectedHotspotId}
            mockupMode={mockupMode}
            setMockupMode={setMockupMode}
            customTexts={customTexts}
            setCustomTexts={setCustomTexts}
            simulatedPrices={simulatedPrices}
            setSimulatedPrices={setSimulatedPrices}
            showJsonSchema={false}
            setShowJsonSchema={() => {}}
            copiedPrescriptionId={copiedPrescriptionId}
            setCopiedPrescriptionId={setCopiedPrescriptionId}
            setIsPrintModalOpen={setIsPrintModalOpen}
            setIsCertificateModalOpen={setIsCertificateModalOpen}
            handleToggleFix={handleToggleFix}
            calcMonthlyTraffic={calcMonthlyTraffic}
            setCalcMonthlyTraffic={setCalcMonthlyTraffic}
            calcAOV={calcAOV}
            setCalcAOV={setCalcAOV}
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
            <span>© 2026 IdeaPilot Commercial Audit Engine. All legal rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Twitter / X</a>
            <a href="https://indiehackers.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Indie Hackers</a>
            <button onClick={handleReset} className="hover:text-white transition cursor-pointer">Re-Audit</button>
          </div>
        </div>
      </footer>

      {/* MODAL WINDOW 1: CERTIFICATE */}
      {auditResult && (
        <CertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          auditResult={auditResult}
          targetUrl={targetUrl}
          dynamicallyAdjustedScore={dynamicallyAdjustedScore}
          dynamicGrade={dynamicGrade}
          certificateTheme={certificateTheme}
          setCertificateTheme={setCertificateTheme}
        />
      )}

      {/* MODAL WINDOW 2: FULL PRINT PREVIEW OVERLAY */}
      {isPrintModalOpen && auditResult && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-10">
          <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print-hide">
              <span className="text-xs text-slate-600 font-mono uppercase font-bold">Print PDF Generation Board</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-1.5 px-3.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Execute Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-10 space-y-10 font-sans print-full">
              <div className="border-b-4 border-slate-900 pb-5 mb-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-indigo-700 font-mono tracking-widest block font-bold leading-none mb-2">
                    ★ IDEAPILOT AI EXECUTIVE MONETIZATION BRIEFING
                  </span>
                  <h1 className="font-display font-black text-2xl uppercase tracking-tight text-slate-900">
                    Commercial Potential Audit Report
                  </h1>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono leading-relaxed">
                  <div>DATE: {new Date().toLocaleDateString()}</div>
                  <div>SCAN ID: IP-{auditResult.projectName.toUpperCase().substring(0, 3)}-2026</div>
                  <div>VERSION: 2.0 (STABLE)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block leading-none">
                    POTENTIAL SCORE:
                  </span>
                  <span className="text-2xl font-black text-slate-900 block font-mono">
                    {dynamicallyAdjustedScore} / 100
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block leading-none">
                    EVALUATOR GRADE:
                  </span>
                  <span className="text-2xl font-black text-indigo-700 block font-mono">
                    {dynamicGrade} RANK
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block leading-none">
                    WTP CAPABILITY:
                  </span>
                  <span className="text-2xl font-black text-slate-900 block font-mono">
                    {auditResult.metrics.willingnessToPay}%
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block leading-none">
                    CONVERSION INDEX:
                  </span>
                  <span className="text-2xl font-black text-slate-900 block font-mono">
                    {auditResult.metrics.landingPageConversion}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-mono uppercase block font-bold">
                  PROJECT SPECIFICATIONS:
                </span>
                <table className="w-full text-xs border border-slate-200">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold bg-slate-50 w-1/3">Project Website Host</td>
                      <td className="p-2 font-mono">{targetUrl}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold bg-slate-50">Auditor Core Engine</td>
                      <td className="p-2">IdeaPilot Co-Pilot Suite (DeepSeek Integrated)</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold bg-slate-50">Configured Project Type</td>
                      <td className="p-2">{projectType}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold bg-slate-50">Target User Segment</td>
                      <td className="p-2">{targetAudience || 'unspecified'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <span className="text-xs text-slate-500 font-mono uppercase block font-bold">
                  CONVERSION FRICTION HOTSPOTS:
                </span>
                <div className="space-y-4 text-xs">
                  {auditResult.hotspots.map((hotspot) => (
                    <div key={hotspot.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 print-avoid-break">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-slate-900 text-sm">#{hotspot.id}: {hotspot.elementName} [ {hotspot.category.toUpperCase()} ]</span>
                        <span className="text-red-600 font-bold uppercase">{hotspot.severity}</span>
                      </div>
                      <p className="italic text-slate-600">Problem status: "{hotspot.currentText}"</p>
                      <p className="font-medium text-slate-800">Prescription design recommendation: {hotspot.aiPrescription}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 print-avoid-break">
                <span className="text-xs text-slate-500 font-mono uppercase block font-bold">
                  TIERED SUBSCRIPTION ARCHITECTURE PROPOSALS:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {auditResult.monetizationTiers.map((tier, index) => (
                    <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-center bg-slate-100 p-2 rounded">
                        <span className="font-bold text-slate-900">{tier.tierName}</span>
                        <span className="font-mono text-slate-600 font-bold">{simulatedPrices[index] || tier.price}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold mb-1">Proposed Capabilities:</span>
                        <ul className="space-y-1">
                          {tier.features.map((feature, fIndex) => (
                            <li key={fIndex} className="text-slate-700">• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold mb-0.5">Value Feedback:</span>
                        <p className="text-slate-600 leading-relaxed italic">{tier.willingnessFeedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 text-[10px] font-mono text-slate-400 flex justify-between select-none print-avoid-break">
                <span>© 2026 IdeaPilot Commercial Audit Engine. Printed Verification Copy.</span>
                <span>CRYPTO-SEAL #88092-A</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
