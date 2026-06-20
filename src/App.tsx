import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  CheckCircle,
  ExternalLink,
  Share2,
  Printer,
  Download,
  Check,
  X,
  Zap,
  Layout,
  RefreshCcw,
  Copy,
  Terminal,
  Award,
  Info,
} from 'lucide-react';

interface MetricState {
  willingnessToPay: number;
  pricingStructure: number;
  landingPageConversion: number;
  growthLoops: number;
}

interface Hotspot {
  id: number;
  category: 'copywriting' | 'pricing' | 'trust' | 'conversion';
  elementName: string;
  currentText: string;
  aiPrescription: string;
  severity: 'critical' | 'warning' | 'optimization';
  x: number;
  y: number;
  isFixed?: boolean;
}

interface MonetizationTier {
  tierName: string;
  price: string;
  willingnessFeedback: string;
  features: string[];
  psychologyMetric: string;
}

interface RoadmapItem {
  day: number;
  task: string;
  expectedResult: string;
}

interface AuditResult {
  projectName: string;
  score: number;
  grade: string;
  metrics: MetricState;
  hotspots: Hotspot[];
  monetizationTiers: MonetizationTier[];
  roadmap: RoadmapItem[];
}

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'home' | 'analyzing' | 'report'>('home');

  // Input States
  const [targetUrl, setTargetUrl] = useState('');
  const projectType = 'SaaS';
  const targetAudience = '';
  const additionalDetails = '';

  // Analysis Result State
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gamification: tracked list of hotspot fixes
  const [fixedHotspots, setFixedHotspots] = useState<number[]>([]);

  // Selected Hotspot details state in the Mockup Map
  const [selectedHotspotId, setSelectedHotspotId] = useState<number>(1);
  const [mockupMode, setMockupMode] = useState<'after' | 'before'>('after');

  // Certificate Modal State
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateTheme, setCertificateTheme] = useState<'neon' | 'cyberpunk' | 'sunset' | 'slate'>('slate');
  const [isCopied, setIsCopied] = useState(false);

  // Print Mode State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Terminal log animation lines inside AnalyzingView
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [logProgress, setLogProgress] = useState(0);

  // Pricing calculator values
  const [simulatedPrices, setSimulatedPrices] = useState<string[]>([]);

  // Interactive Live Custom Copywriting sandbox override values mapped to hotspot ID
  const [customTexts, setCustomTexts] = useState<Record<number, string>>({});

  // Dynamic values configured for the Revenue Lift Calculator
  const [calcMonthlyTraffic, setCalcMonthlyTraffic] = useState<number>(15000);
  const [calcAOV, setCalcAOV] = useState<number>(49);

  // Advanced debug togglers and inline state copy trackers
  const [showJsonSchema, setShowJsonSchema] = useState<boolean>(false);
  const [copiedPrescriptionId, setCopiedPrescriptionId] = useState<number | null>(null);

  // Reset all states back to home for a new scan
  const handleReset = () => {
    setCurrentView('home');
    setAuditResult(null);
    setFixedHotspots([]);
    setErrorMessage(null);
    setCustomTexts({});
    setShowJsonSchema(false);
    setCopiedPrescriptionId(null);
  };

  // Run URL Validation and Trigger API Call
  const handleStartAnalysis = async (e?: React.FormEvent, urlOverride?: string) => {
    if (e) e.preventDefault();
    const urlToAnalyze = urlOverride || targetUrl;
    if (!urlToAnalyze.trim()) return;

    if (urlOverride) {
      setTargetUrl(urlOverride);
    }

    // Direct user to terminal log flow
    setCurrentView('analyzing');
    setTerminalLogs([]);
    setLogProgress(0);

    // Initial Logs sequence
    const initialLogs = [
      '⚡ [0.1s] ideapilot_scan@kernel: boot complete',
      `📡 [0.3s] Resolving project parameters for host: ${urlToAnalyze}`,
      '🔍 [0.8s] Requesting HTML payload and structural metadata...',
      '📈 [1.4s] Running visual positioning heuristics models...',
      '💲 [2.0s] Simulating price anchoring parameters & payment conversion elasticity...',
      '🤖 [2.7s] Querying Gemini GPT-3.5-flash audit co-pilot context...',
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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlToAnalyze.trim(),
          projectType,
          audience: targetAudience,
          details: additionalDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Our co-pilot server encountered an auditing error. Please try again.');
      }

      const result: AuditResult = await response.json();

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

  // Score adjustments based on marked fixes
  const currentHotspotCount = auditResult?.hotspots.length || 1;
  const initialBaseScore = auditResult?.score || 75;
  const dynamicallyAdjustedScore = Math.min(100, initialBaseScore + Math.round((fixedHotspots.length / currentHotspotCount) * (100 - initialBaseScore)));

  const getDynamicGrade = (score: number) => {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    return 'C';
  };

  const dynamicGrade = getDynamicGrade(dynamicallyAdjustedScore);

  // Toggle hotspot fix state
  const handleToggleFix = (id: number) => {
    if (fixedHotspots.includes(id)) {
      setFixedHotspots((prev) => prev.filter((item) => item !== id));
    } else {
      setFixedHotspots((prev) => [...prev, id]);
    }
  };

  // Download Shared Certificate logic using HTML5 Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleGenerateAndDownloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !auditResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Base dimensions for HD graphics
    canvas.width = 1200;
    canvas.height = 675;

    // Theme values configuration
    let bgGradientStart = '#0f172a';
    let bgGradientEnd = '#020617';
    let brandColor = '#6366f1';
    let accentColor = '#22d3ee';
    let badgeBg = 'rgba(99, 102, 241, 0.1)';

    if (certificateTheme === 'neon') {
      bgGradientStart = '#180828';
      bgGradientEnd = '#05010d';
      brandColor = '#f43f5e';
      accentColor = '#e11d48';
      badgeBg = 'rgba(244, 63, 94, 0.1)';
    } else if (certificateTheme === 'cyberpunk') {
      bgGradientStart = '#1e1b4b';
      bgGradientEnd = '#090514';
      brandColor = '#eab308';
      accentColor = '#a855f7';
      badgeBg = 'rgba(234, 179, 8, 0.1)';
    } else if (certificateTheme === 'sunset') {
      bgGradientStart = '#2a081a';
      bgGradientEnd = '#0f020a';
      brandColor = '#ea580c';
      accentColor = '#f43f5e';
      badgeBg = 'rgba(234, 88, 12, 0.1)';
    }

    // 1. Render Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, bgGradientStart);
    gradient.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 675);

    // 2. Decorative glowing grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1200; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 675);
      ctx.stroke();
    }
    for (let j = 0; j < 675; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1200, j);
      ctx.stroke();
    }

    // Border Frame accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 595);

    ctx.strokeStyle = brandColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 100);
    ctx.lineTo(40, 40);
    ctx.lineTo(100, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1160, 100);
    ctx.lineTo(1160, 40);
    ctx.lineTo(1100, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, 575);
    ctx.lineTo(40, 635);
    ctx.lineTo(100, 635);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1160, 575);
    ctx.lineTo(1160, 635);
    ctx.lineTo(1100, 635);
    ctx.stroke();

    // 3. Brand Text Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Space Grotesk", sans-serif';
    ctx.fillText('IdeaPilot', 80, 100);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 14px monospace';
    ctx.fillText('• COMMERCIAL VALIDATION LABS', 230, 95);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText(`ID PIN: IP-${auditResult.projectName.toUpperCase().substring(0, 3)}-2026`, 940, 95);

    // 4. Main Certificate Text Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STARTUP MONETIZATION CERTIFICATE', 80, 210);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('This official seal verifies the landing page conversion and monetization potential audit for:', 80, 260);

    // Project URL Highlight Box
    ctx.fillStyle = badgeBg;
    ctx.fillRect(80, 290, 700, 60);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(80, 290, 700, 60);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(targetUrl, 105, 330);

    // Score Block Capsule Drawing on Right Side
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(840, 170, 280, 340);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(840, 170, 280, 340);

    // Grade Text Display
    ctx.fillStyle = brandColor;
    ctx.font = '800 120px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dynamicGrade, 980, 310);

    // Score Title and Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText(`SCORE: ${dynamicallyAdjustedScore} / 100`, 980, 370);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(880, 400, 200, 8);
    ctx.fillStyle = brandColor;
    ctx.fillRect(880, 400, (dynamicallyAdjustedScore / 100) * 200, 8);

    // Metrics Subtext inside Badge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`• LP Conv: ${auditResult.metrics.landingPageConversion}%`, 880, 440);
    ctx.fillText(`• Price Struct: ${auditResult.metrics.pricingStructure}%`, 880, 465);
    ctx.fillText(`• Willingness To Pay: ${auditResult.metrics.willingnessToPay}%`, 880, 490);

    // 5. Verification Footer Lines
    ctx.fillStyle = '#64748b';
    ctx.font = '15px monospace';
    ctx.fillText('ISSUED BY IDEAPILOT GPT EVALUATION SUITE', 80, 470);

    ctx.fillStyle = brandColor;
    ctx.font = 'bold 16px monospace';
    ctx.fillText('ideapilot.com/audit', 80, 500);

    // Signature Seal icon drawing
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(480, 480, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText('VERIFIED', 455, 483);

    // Create a data URL from the canvas and download it
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `IdeaPilot_Certificate_${auditResult.projectName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export high-res canvas seal:', e);
    }
  };

  // Re-run certificate draw on canvas whenever theme or scores adjust
  useEffect(() => {
    if (isCertificateModalOpen && canvasRef.current && auditResult) {
      // Small timeout to ensure canvas DOM mounted properly
      setTimeout(() => {
        handleGenerateAndDownloadCertificate();
      }, 50);
    }
  }, [isCertificateModalOpen, certificateTheme, dynamicallyAdjustedScore]);

  // Handle Clipboard Copy
  const shareCopyText = `Just audited my landing page on @IdeaPilot. Value potential score is ${dynamicallyAdjustedScore}/100 (Grade ${dynamicGrade})! \n\nCheck visual positioning hotspots and unlock hidden monetization potential:\nhttps://ideapilot.com/audit`;
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(shareCopyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col font-sans text-slate-200">
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
              v1.83
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentView === 'report' && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5 transition py-1 px-3 border border-slate-800 hover:bg-slate-900 rounded-lg"
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

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: LANDING PAGE FORM */}
        {currentView === 'home' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 flex-1 flex flex-col justify-center">
            {/* Title Hero */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
                <Sparkles className="h-3 w-3" />
                <span>CO-PILOT COMMERCIAL AUDIT ENGINE</span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight relative leading-none">
                Audit Your Landing Page <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
                  Value Capturing Strategy
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
                Submit your website URL. <span className="text-indigo-400 font-semibold font-mono">IdeaPilot</span> analyzes who will pay, why they will pay, copywriting friction, and delivers actionable pricing tiered solutions.
              </p>
            </div>

            {/* Input Submission Card */}
            <div className="max-w-2xl mx-auto w-full space-y-6">
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-sm animate-fade-in">
                <form onSubmit={(e) => handleStartAnalysis(e)} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
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

                  <button
                    type="submit"
                    disabled={!targetUrl.trim()}
                    className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-850 disabled:opacity-40 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 font-mono whitespace-nowrap"
                  >
                    <Zap className="h-4 w-4 animate-pulse text-yellow-300" />
                    <span>INITIALIZE AUDIT</span>
                  </button>
                </form>

                {/* Instant Popular Suggestions click triggers */}
                <div className="pt-6 border-t border-slate-800/60 mt-4 text-center space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">
                    💡 Click a popular demo website below to instantly simulated run the audit:
                  </span>
                  <div className="inline-flex flex-wrap gap-2 justify-center">
                    {['supabase.com', 'linear.app', 'resend.com', 'stripe.com'].map((sample) => (
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
        )}

        {/* VIEW 2: LOGSTREAMING AND PROGRESS */}
        {currentView === 'analyzing' && (
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
            {/* Ambient glowing circles */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px]" />

            <div className="w-full max-w-2xl bg-black border border-slate-800 rounded-2xl relative shadow-2xl overflow-hidden min-h-[420px] flex flex-col">
              {/* Terminal Frame Menu bar */}
              <div className="bg-slate-900/60 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                  <span className="text-[10px] text-slate-500 font-mono ml-1">ideapilot_scan@terminal: ~</span>
                </div>
                <Terminal className="h-4 w-4 text-slate-600" />
              </div>

              {/* Progress Bar inside scan */}
              <div className="bg-indigo-950/25 h-1 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${logProgress}%` }}
                />
              </div>

              {/* Logs output */}
              <div className="p-6 font-mono text-xs text-slate-300 space-y-2 flex-grow overflow-y-auto">
                {terminalLogs.map((log, index) => (
                  <p key={index} className="leading-relaxed whitespace-pre-wrap font-medium">
                    {log}
                  </p>
                ))}
                {logProgress < 100 && (
                  <div className="flex items-center gap-2 text-indigo-400 mt-4 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span className="text-[11px] font-semibold">Running multi-factor analysis...</span>
                  </div>
                )}
              </div>

              {/* Console info section */}
              <div className="bg-slate-955 border-t border-slate-900 p-4 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>IDEAPILOT ENGINE v1.83</span>
                <span>SECURE PARSING BLOCK</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RICH SCORE SUMMARY & CO-PILOT DASHBOARD */}
        {currentView === 'report' && auditResult && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow flex flex-col justify-start">
            
            {/* Dashboard Sub-head metadata */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                    <Layout className="h-4 w-4" />
                  </div>
                  <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    {auditResult.projectName} Landing Page Audit
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>URL UNDER AUDIT:</span>
                  <a
                    href={`https://${targetUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>{targetUrl}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Dashboard Global Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="flex-1 md:flex-initial py-2 px-4 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 rounded-xl text-xs text-slate-300 hover:text-white transition font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print PDF Report</span>
                </button>

                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="flex-1 md:flex-initial py-2 px-4 bg-indigo-600 hover:bg-indigo-500 hover:glow-indigo text-white rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg shadow-indigo-600/15"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Generate Seal Certificate</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics & Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Primary Adjusted Score Ring with customizable logic */}
              <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#312e81,transparent)] opacity-20 pointer-events-none" />
                
                <h3 className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold mb-4">
                  IdeaPilot Score
                </h3>

                {/* Simulated circular gauge using CSS */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
                    {/* Background ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="text-slate-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Glowing foreground ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="text-indigo-500 transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray={339}
                      strokeDashoffset={339 - (339 * dynamicallyAdjustedScore) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="text-center relative">
                    <span className="text-3xl font-black text-white font-display block select-none">
                      {dynamicallyAdjustedScore}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium font-mono">
                      GRADE {dynamicGrade}
                    </span>
                  </div>
                </div>

                {/* Dynamic gamified subtitle showing checklist state */}
                {fixedHotspots.length > 0 ? (
                  <div className="mt-4 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 font-mono">
                    📈 Reconstructed +{dynamicallyAdjustedScore - initialBaseScore} pts from fixes!
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-4">
                    Fix flagged layout hotspots below to boost your score to 100%.
                  </p>
                )}
              </div>

              {/* Sub attributes evaluation block */}
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block font-bold">
                      Willingness To Pay
                    </span>
                    <p className="text-sm text-slate-500 font-sans leading-relaxed mt-1">
                      Willingness to exchange currency for features.
                    </p>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-display">
                      {auditResult.metrics.willingnessToPay}%
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${auditResult.metrics.willingnessToPay}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block font-bold">
                      Pricing Adequacy
                    </span>
                    <p className="text-sm text-slate-500 font-sans leading-relaxed mt-1">
                      Tier optimization to anchor premium buyers.
                    </p>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-display">
                      {auditResult.metrics.pricingStructure}%
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full" style={{ width: `${auditResult.metrics.pricingStructure}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block font-bold">
                      Conversion Index
                    </span>
                    <p className="text-sm text-slate-500 font-sans leading-relaxed mt-1">
                      Friction factors blocking page signups.
                    </p>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-display">
                      {auditResult.metrics.landingPageConversion}%
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${auditResult.metrics.landingPageConversion}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block font-bold">
                      Growth Velocity
                    </span>
                    <p className="text-sm text-slate-500 font-sans leading-relaxed mt-1">
                      Embedded loops to scale organic reach.
                    </p>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-display">
                      {auditResult.metrics.growthLoops}%
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${auditResult.metrics.growthLoops}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB SECTION: VISUAL INTERACTIVE MOCKUP MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Landing Page Mockup Render Panel */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold">
                    Interactive Conversion Map
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">
                      Selected Element:
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded">
                      #{selectedHotspotId}
                    </span>
                  </div>
                </div>

                {/* Dynamic Navigation Shortcut Tab Items */}
                <div className="flex flex-wrap gap-1.5 py-1">
                  {auditResult.hotspots.map((hotspot) => {
                    const isSelected = selectedHotspotId === hotspot.id;
                    const isFixed = fixedHotspots.includes(hotspot.id);
                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        onClick={() => setSelectedHotspotId(hotspot.id)}
                        className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border transition duration-150 cursor-pointer flex items-center gap-1.5 select-none ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/10'
                            : isFixed
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isFixed ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                        <span>#{hotspot.id} {hotspot.elementName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Wireframe Sandbox Container */}
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl aspect-[16/10] w-full overflow-hidden shadow-2xl flex flex-col justify-between">
                  {/* Symmetrical Mock navbar with Before/After Mode Selectors */}
                  <div className="h-11 bg-slate-950 px-4 border-b border-slate-800/60 flex items-center justify-between select-none">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block animate-pulse" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tight truncate max-w-[140px] sm:max-w-xs">
                        🌎 https://{targetUrl}
                      </span>
                    </div>

                    {/* BEFORE / AFTER DUAL CONTROLLERS */}
                    <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex gap-0.5 shadow-inner grow-0">
                      <button
                        type="button"
                        onClick={() => setMockupMode('before')}
                        className={`text-[9px] font-mono px-2.5 py-1 rounded-md uppercase font-black transition-all cursor-pointer ${
                          mockupMode === 'before'
                            ? 'bg-rose-500 text-slate-950 shadow-md'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Before
                      </button>
                      <button
                        type="button"
                        onClick={() => setMockupMode('after')}
                        className={`text-[9px] font-mono px-2.5 py-1 rounded-md uppercase font-black transition-all cursor-pointer ${
                          mockupMode === 'after'
                            ? 'bg-emerald-400 text-slate-950 shadow-md'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        After
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Content Container */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col justify-center h-[calc(100%-44px)] overflow-y-auto relative bg-grid">
                    {(() => {
                      const activeHotspot = auditResult.hotspots.find((h) => h.id === selectedHotspotId) || auditResult.hotspots[0];
                      const isCopywritingActive = activeHotspot && activeHotspot.category === 'copywriting';
                      const isPricingActive = activeHotspot && activeHotspot.category === 'pricing';
                      const isTrustActive = activeHotspot && activeHotspot.category === 'trust';
                      const isConversionActive = activeHotspot && activeHotspot.category === 'conversion';

                      // Find specific category instances for individual progress indicators
                      const copywritingHotspot = auditResult.hotspots.find((h) => h.category === 'copywriting');
                      const pricingHotspot = auditResult.hotspots.find((h) => h.category === 'pricing');
                      const trustHotspot = auditResult.hotspots.find((h) => h.category === 'trust');
                      const conversionHotspot = auditResult.hotspots.find((h) => h.category === 'conversion');

                      const isCopywritingFixed = copywritingHotspot ? fixedHotspots.includes(copywritingHotspot.id) : false;
                      const isPricingFixed = pricingHotspot ? fixedHotspots.includes(pricingHotspot.id) : false;
                      const isTrustFixed = trustHotspot ? fixedHotspots.includes(trustHotspot.id) : false;
                      const isConversionFixed = conversionHotspot ? fixedHotspots.includes(conversionHotspot.id) : false;

                      // Symmetrical text interpolators with independent fix-aware fallbacks and custom live sandbox overrides
                      const headlineCopy = (copywritingHotspot && customTexts[copywritingHotspot.id]) || (copywritingHotspot
                        ? (mockupMode === 'after' || isCopywritingFixed ? copywritingHotspot.aiPrescription : copywritingHotspot.currentText)
                        : "Turn landing page value into recurring user revenue.");

                      const pricingCopy = (pricingHotspot && customTexts[pricingHotspot.id]) || (pricingHotspot
                        ? (mockupMode === 'after' || isPricingFixed ? pricingHotspot.aiPrescription : pricingHotspot.currentText)
                        : "Flexible tiered plans fit for scaling makers.");

                      const trustCopy = (trustHotspot && customTexts[trustHotspot.id]) || (trustHotspot
                        ? (mockupMode === 'after' || isTrustFixed ? trustHotspot.aiPrescription : trustHotspot.currentText)
                        : "Used dynamically by 10,000+ top makers around the globe.");

                      const ctaCopy = (conversionHotspot && customTexts[conversionHotspot.id]) || (conversionHotspot
                        ? (mockupMode === 'after' || isConversionFixed ? conversionHotspot.aiPrescription : conversionHotspot.currentText)
                        : "Claim Free Audit");

                      return (
                        <>
                          {/* Centered Headline Zone */}
                          <div className={`max-w-lg mx-auto text-center space-y-2 py-3 px-4 rounded-xl transition-all duration-300 border relative ${
                            isCopywritingActive
                              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 border-indigo-400'
                              : 'border-transparent'
                          } ${
                            isCopywritingFixed || (mockupMode === 'after' && copywritingHotspot)
                              ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                              : 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                          }`}>
                            {isCopywritingActive && (
                              <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white font-mono text-[7px] uppercase font-bold rounded shadow-lg">
                                Active Focus: Headline #1
                              </span>
                            )}
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="inline-flex items-center gap-1 text-[7px] font-mono text-cyan-400 font-bold uppercase py-0.5 px-2 bg-slate-950/80 border border-slate-800 rounded-full">
                                Value Proposition Header
                              </div>
                              {(isCopywritingFixed || (mockupMode === 'after' && copywritingHotspot)) && (
                                <span className="inline-flex items-center gap-1 text-[7px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-900/60 py-0.5 px-2 rounded-full uppercase font-bold animate-pulse">
                                  ★ Optimised
                                </span>
                              )}
                            </div>
                            <h2 className={`text-[10px] sm:text-xs font-bold font-sans tracking-tight leading-relaxed transition-colors duration-300 ${
                              isCopywritingFixed || (mockupMode === 'after' && copywritingHotspot) ? 'text-emerald-300' : 'text-slate-100'
                            }`}>
                              {headlineCopy}
                            </h2>
                            <div className="h-1 w-12 bg-slate-800 rounded mx-auto mt-2" />
                          </div>

                          {/* Features Pricing Layer */}
                          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 rounded-xl transition-all duration-300 border relative ${
                            isPricingActive
                              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 border-indigo-400'
                              : 'border-transparent'
                          } ${
                            isPricingFixed || (mockupMode === 'after' && pricingHotspot)
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-rose-500/5 border-rose-500/20'
                          }`}>
                            {isPricingActive && (
                              <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white font-mono text-[7px] uppercase font-bold rounded shadow-lg z-10 whitespace-nowrap">
                                Active Focus: Pricing Decoy #2
                              </span>
                            )}
                            <div className="border border-slate-800/60 p-2 rounded-lg bg-slate-950/40 space-y-1 text-center">
                              <span className="text-[7.5px] text-slate-500 font-mono font-bold block">TIER 1</span>
                              <div className="h-1.5 w-1/2 bg-slate-800 rounded mx-auto" />
                              <div className="text-[8.5px] text-slate-400 font-mono font-semibold">Starter</div>
                            </div>
                            <div className="border border-slate-800/60 p-2 rounded-lg bg-slate-950/40 space-y-1 text-center relative">
                              <span className="text-[7.5px] text-indigo-400 font-mono font-bold block">TIER 2 (POPULAR)</span>
                              <div className="h-1.5 w-2/3 bg-slate-800 rounded mx-auto" />
                              <p className={`text-[8px] font-sans leading-snug tracking-tight text-center truncate px-1 transition-colors ${
                                isPricingFixed || (mockupMode === 'after' && pricingHotspot) ? 'text-emerald-400 font-medium' : 'text-slate-400'
                              }`}>
                                {pricingCopy}
                              </p>
                            </div>
                            <div className="border border-slate-800/60 p-2 rounded-lg bg-slate-950/40 space-y-1 text-center">
                              <span className="text-[7.5px] text-slate-500 font-mono font-bold block">TIER 3</span>
                              <div className="h-1.5 w-1/3 bg-slate-800 rounded mx-auto" />
                              <div className="text-[8.5px] text-cyan-400 font-mono font-semibold">Scale</div>
                            </div>
                          </div>

                          {/* Social Proof Star Testimony */}
                          <div className={`border p-2.5 rounded-xl mx-auto max-w-sm space-y-1 transition-all duration-300 relative ${
                            isTrustActive
                              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 border-indigo-400'
                              : 'border-slate-800/40'
                          } ${
                            isTrustFixed || (mockupMode === 'after' && trustHotspot)
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-slate-950/40'
                          }`}>
                            {isTrustActive && (
                              <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white font-mono text-[7px] uppercase font-bold rounded shadow-lg z-10 whitespace-nowrap">
                                Active Focus: Social Proof #3
                              </span>
                            )}
                            <div className="flex gap-1 justify-center">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className="text-[8px] text-yellow-500 font-bold">★</span>
                              ))}
                            </div>
                            <p className={`text-[9px] text-center font-sans italic leading-relaxed transition-colors duration-300 ${
                              isTrustFixed || (mockupMode === 'after' && trustHotspot) ? 'text-emerald-300' : 'text-slate-300'
                            }`}>
                              "{trustCopy}"
                            </p>
                          </div>

                          {/* Active Conversion Call to Action */}
                          <div className={`p-2 rounded-xl max-w-xs mx-auto text-center transition-all duration-300 border relative ${
                            isConversionActive
                              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 border-indigo-400'
                              : 'border-transparent'
                          } ${
                            isConversionFixed || (mockupMode === 'after' && conversionHotspot)
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-transparent'
                          }`}>
                            {isConversionActive && (
                              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white font-mono text-[7px] uppercase font-bold rounded shadow-lg z-10 whitespace-nowrap">
                                Active Focus: CTA Call #4
                              </span>
                            )}
                            <button
                              type="button"
                              className={`px-5 py-1.5 rounded-lg font-mono text-[9px] font-black tracking-wider uppercase shadow-lg transition-all focus:outline-none cursor-default ${
                                isConversionFixed || (mockupMode === 'after' && conversionHotspot)
                                  ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/20 scale-105'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {ctaCopy}
                            </button>
                          </div>
                        </>
                      );
                    })()}

                    {/* ABSOLUTE POSITIONED HOTSPOT PIN MARKERS OVERLAY */}
                    {auditResult.hotspots.map((hotspot) => {
                      const isSelected = selectedHotspotId === hotspot.id;
                      const isFixed = fixedHotspots.includes(hotspot.id);

                      return (
                        <button
                          key={hotspot.id}
                          type="button"
                          onClick={() => setSelectedHotspotId(hotspot.id)}
                          className={`absolute h-8 w-8 z-30 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 focus:outline-none ${
                            isFixed
                              ? 'bg-emerald-500 border-2 border-slate-950 text-white shadow-lg shadow-emerald-500/30'
                              : isSelected
                              ? 'bg-indigo-500 border-2 border-slate-950 text-white scale-125 ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/40 z-40'
                              : hotspot.severity === 'critical'
                              ? 'bg-rose-500 border-2 border-slate-950 text-white animate-pulse'
                              : hotspot.severity === 'warning'
                              ? 'bg-amber-500 border-2 border-slate-950 text-white animate-pulse'
                              : 'bg-indigo-400/80 border-2 border-slate-950 text-white'
                          }`}
                          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        >
                          {isFixed ? <Check className="h-4 w-4 stroke-[3px]" /> : hotspot.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Hotspot AI Copy prescriptions insights display panel */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block">
                  Cops & Conversion Diagnostics
                </span>

                {(() => {
                  const activeHotspot = auditResult.hotspots.find((h) => h.id === selectedHotspotId) || auditResult.hotspots[0];
                  if (!activeHotspot) return null;
                  const isFixed = fixedHotspots.includes(activeHotspot.id);

                  return (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl relative min-h-[380px] flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Selected Diagnostic header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-mono font-bold ${
                              activeHotspot.category === 'copywriting'
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                : activeHotspot.category === 'pricing'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : activeHotspot.category === 'trust'
                                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}>
                              {activeHotspot.category}
                            </span>
                            <h3 className="text-sm font-bold text-white uppercase font-mono">
                              #{activeHotspot.id}: {activeHotspot.elementName}
                            </h3>
                          </div>

                          <div className={`px-2.5 py-1 rounded-lg border font-mono text-[9px] font-bold uppercase ${
                            activeHotspot.severity === 'critical'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : activeHotspot.severity === 'warning'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}>
                            {activeHotspot.severity}
                          </div>
                        </div>

                        {/* Current text / Problem layout description */}
                        <div className="space-y-1.5 p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">
                            Detected Problem Area:
                          </span>
                          <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
                            {activeHotspot.currentText}
                          </p>
                        </div>

                        {/* AI Copilot prescriptive recommendation with instant Copy utility */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider flex items-center gap-1 font-bold">
                              <Sparkles className="h-3.5 w-3.5 fill-current" /> AI COPILOT RECONSTRUCTION:
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(activeHotspot.aiPrescription);
                                setCopiedPrescriptionId(activeHotspot.id);
                                setTimeout(() => setCopiedPrescriptionId(null), 2000);
                              }}
                              className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-[10px] text-slate-400 hover:text-white rounded-lg flex items-center gap-1.5 transition cursor-pointer font-mono"
                            >
                              {copiedPrescriptionId === activeHotspot.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy Draft</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed bg-indigo-500/5 border border-indigo-500/15 p-4 rounded-xl font-medium">
                            {activeHotspot.aiPrescription}
                          </p>
                        </div>

                        {/* Live Copywriting Testing Sandbox */}
                        <div className="space-y-2 p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block font-bold">
                              ✍️ Sandbox Playground (Realtime custom overrides):
                            </span>
                            {customTexts[activeHotspot.id] && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...customTexts };
                                  delete updated[activeHotspot.id];
                                  setCustomTexts(updated);
                                }}
                                className="text-[9px] text-rose-400 hover:underline font-mono cursor-pointer"
                              >
                                Reset Text
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={2}
                            value={customTexts[activeHotspot.id] || ''}
                            placeholder={`Type your custom phrasing for mockup preview... (e.g. "We solve visual data layout pipelines for modern builders.")`}
                            onChange={(e) => {
                              setCustomTexts({
                                ...customTexts,
                                [activeHotspot.id]: e.target.value
                              });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition resize-none font-sans leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* CHECK BOX TO MARK FIXED & RE-CALCULATE SCORE */}
                      <div className="border-t border-slate-800/80 pt-4 mt-2">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isFixed}
                            onChange={() => handleToggleFix(activeHotspot.id)}
                            className="sr-only peer"
                          />
                          <div className="h-5 w-5 bg-slate-950 border border-slate-800 rounded peer-checked:bg-emerald-500 peer-checked:border-transparent flex items-center justify-center transition">
                            {isFixed && <Check className="h-3 w-3 text-black stroke-[3px]" />}
                          </div>
                          <div>
                            <span className="text-xs text-slate-200 font-semibold font-mono block">
                              Recalculate: Flag this as fixed inside my code
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Boosts IdeaPilot score and verifies progression validation
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* THREE-CARD MONETIZATION DESIGN BUILDER */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold">
                  Proposed Tiered Pricing Models
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  ADJUST SLIDERS TO SIMULATE REVENUE POTENTIAL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {auditResult.monetizationTiers.map((tier, index) => {
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[440px]"
                    >
                      <div className="space-y-4">
                        {/* Tier heading */}
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="font-display font-black text-slate-100 font-mono uppercase text-sm tracking-tight">
                            {tier.tierName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                            {tier.psychologyMetric}
                          </span>
                        </div>

                        {/* Flex simulated interactive Price box */}
                        <div className="p-4 bg-slate-950/50 rounded-xl space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">
                              Simulated price:
                            </span>
                            <span className="text-xl font-black text-white font-mono">
                              {simulatedPrices[index] || tier.price}
                            </span>
                          </div>
                          {/* Symmetrical Price adjustment pointer */}
                          <input
                            type="range"
                            min="5"
                            max="299"
                            step="5"
                            value={parseInt(simulatedPrices[index]?.replace(/[^0-9]/g, '') || '19')}
                            onChange={(e) => {
                              const list = [...simulatedPrices];
                              list[index] = `$${e.target.value}/mo`;
                              setSimulatedPrices(list);
                            }}
                            className="w-full accent-indigo-500 h-1 rounded"
                          />
                        </div>

                        {/* Features checking list */}
                        <div className="space-y-2">
                          <span className="text-[9.5px] text-slate-500 font-mono uppercase block font-bold">
                            FEATURES STACK:
                          </span>
                          <ul className="space-y-1.5">
                            {tier.features.map((feature, fIndex) => (
                              <li key={fIndex} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Elastic willingness subtext */}
                      <div className="pt-3.5 border-t border-slate-800/60 mt-2 space-y-1">
                        <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block">
                          HEURISTICS MODEL FEEDBACK:
                        </span>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed italic">
                          {tier.willingnessFeedback}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE VALUE SIMULATOR: REVENUE POTENTIAL CALCULATOR */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 border border-indigo-900/40 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Decorative light ring */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/40 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase font-bold">
                    💰 Conversions Urgency Engine
                  </div>
                  <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
                    Revenue Lift & Value Leak Calculator
                  </h3>
                  <p className="text-xs text-slate-400 font-sans max-w-xl">
                    See exactly how much revenue is leaking due to current conversion obstacles, and your immediate ROI potential when implementing our copywriting prescriptions.
                  </p>
                </div>
                
                {/* Visual score badge */}
                <div className="bg-slate-900/80 border border-slate-805 p-3 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-32">
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-black">Fix Progress</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {fixedHotspots.length} / {auditResult.hotspots.length} Resolved
                  </span>
                </div>
              </div>

              {/* Slider grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Sliders left */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs text-slate-300 font-bold uppercase">Monthly Traffic (Visits)</span>
                      <span className="text-sm font-black text-indigo-400">
                        {calcMonthlyTraffic.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="2500"
                      value={calcMonthlyTraffic}
                      onChange={(e) => setCalcMonthlyTraffic(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                      <span>1K</span>
                      <span>50K</span>
                      <span>100K max</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs text-slate-300 font-bold uppercase">Average Value (AOV)</span>
                      <span className="text-sm font-black text-cyan-400">
                        ${calcAOV} USD
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="5"
                      value={calcAOV}
                      onChange={(e) => setCalcAOV(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                      <span>$5</span>
                      <span>$150</span>
                      <span>$300 max</span>
                    </div>
                  </div>
                </div>

                {/* Simulated outputs center/right */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/40 border border-slate-800/40 p-6 rounded-2xl">
                  
                  {/* Current State Column */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
                    <span className="text-[9.5px] text-rose-450 font-mono uppercase tracking-wider font-bold block">
                      🔴 Current State (Before)
                    </span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">CR Estimate</span>
                      <span className="text-lg font-bold text-slate-200 font-mono">1.20%</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Monthly Revenue</span>
                      <span className="text-sm font-semibold text-slate-300 font-mono font-bold">
                        ${Math.round(calcMonthlyTraffic * 0.012 * calcAOV).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Optimized State Column */}
                  {(() => {
                    // CR boosts based on resolved hotspots
                    const resolvedRatio = auditResult.hotspots.length > 0 ? (fixedHotspots.length / auditResult.hotspots.length) : 0;
                    const crBoost = resolvedRatio * 0.018; // maximum 1.8% boost
                    const finalCR = 0.012 + crBoost;
                    const beforeRevenue = calcMonthlyTraffic * 0.012 * calcAOV;
                    const afterRevenue = calcMonthlyTraffic * finalCR * calcAOV;
                    const monthlyLift = Math.max(0, afterRevenue - beforeRevenue);
                    const annualLift = monthlyLift * 12;

                    return (
                      <>
                        <div className="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
                          <span className="text-[9.5px] text-emerald-400 font-mono uppercase tracking-wider font-bold block">
                            🟢 Optimized State (After)
                          </span>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">CR Estimate</span>
                            <span className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                              {(finalCR * 100).toFixed(2)}%
                              {fixedHotspots.length > 0 && (
                                <span className="text-[8px] bg-emerald-950 font-bold px-1 rounded text-emerald-300">
                                  +{(crBoost * 100).toFixed(2)}%
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">Simulated Revenue</span>
                            <span className="text-sm font-semibold text-emerald-300 font-mono font-bold">
                              ${Math.round(afterRevenue).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Annual Value Lift Highlight Card */}
                        <div className="space-y-3 p-4 rounded-xl bg-indigo-950/15 border border-indigo-900/30 flex flex-col justify-between">
                          <div>
                            <span className="text-[9.5px] text-indigo-400 font-mono uppercase tracking-wider font-bold block">
                              ✨ Projected Annual Growth
                            </span>
                            <div className="space-y-0.5 mt-2">
                              <span className="text-[10px] text-slate-500 font-mono uppercase block">Annual ARR Lift</span>
                              <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.15)] flex items-center">
                                ${Math.round(annualLift).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <span className="text-[8.5px] text-slate-400 font-sans italic leading-tight block">
                            *Multiply calculated metrics through fixing landing page errors.
                          </span>
                        </div>
                      </>
                    );
                  })()}

                </div>

              </div>
            </div>

            {/* ADVANCED TECHNICAL CONTROL PANEL: JSON AUDIT SCHEMA EXPORTER */}
            <div className="space-y-3 p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wide flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-400 shrink-0" /> Technical Data: JSON Audit Schema Exporter
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Integrated dynamic metadata schemas for CI/CD, webhooks or codebases
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJsonSchema(!showJsonSchema)}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono text-slate-400 hover:text-white rounded-lg transition cursor-pointer self-start"
                >
                  {showJsonSchema ? 'Hide Schema Code' : 'View Export Schema'}
                </button>
              </div>

              {showJsonSchema && (
                <div className="space-y-2 mt-3 animate-fadeIn">
                  <div className="flex justify-between items-center bg-slate-950 px-4 py-2 border-b border-slate-850 rounded-t-xl">
                    <span className="text-[9px] text-indigo-400 font-mono uppercase font-black">
                      ideapilot_schema_export.json
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        // generate clean metadata object for clipboard copying
                        const metadataPayload = {
                          auditId: "IP-AUDIT-2026-" + Math.floor(Math.random() * 90000 + 10000),
                          timestamp: new Date().toISOString(),
                          targetUrl: targetUrl,
                          metrics: auditResult.metrics,
                          roadmap: auditResult.roadmap,
                          hotspotsCount: auditResult.hotspots.length,
                          resolvedHotspots: fixedHotspots,
                          hotspotsMetadata: auditResult.hotspots.map(h => ({
                            id: h.id,
                            category: h.category,
                            severity: h.severity,
                            currentCopy: h.currentText,
                            prescriptionCopy: h.aiPrescription,
                            resolved: fixedHotspots.includes(h.id)
                          }))
                        };
                        navigator.clipboard.writeText(JSON.stringify(metadataPayload, null, 2));
                        setCopiedPrescriptionId(999);
                        setTimeout(() => setCopiedPrescriptionId(null), 2000);
                      }}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-805 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1.5 cursor-pointer transition"
                    >
                      {copiedPrescriptionId === 999 ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Schema Payload</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-[10px] text-cyan-500 font-mono rounded-b-xl overflow-x-auto max-h-56 leading-relaxed select-all">
                    {JSON.stringify({
                      auditId: "IP-AUDIT-2026-XF92",
                      timestamp: new Date().toISOString(),
                      targetUrl: targetUrl,
                      metrics: auditResult.metrics,
                      roadmap: auditResult.roadmap,
                      hotspotsCount: auditResult.hotspots.length,
                      resolvedHotspots: fixedHotspots,
                      hotspotsMetadata: auditResult.hotspots.map(h => ({
                        id: h.id,
                        category: h.category,
                        severity: h.severity,
                        currentCopy: h.currentText,
                        prescriptionCopy: h.aiPrescription,
                        resolved: fixedHotspots.includes(h.id)
                      }))
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* DAY 1-3-7 COMPREHENSIVE ACTION ROADMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-12 space-y-4">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block">
                  Actionable Growth Roadmap
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {auditResult.roadmap.map((step, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-900 space-y-3 relative overflow-hidden"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                        D-{step.day}
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                        Day {step.day} Implementation Goal
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.task}
                      </p>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                        <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block">
                          EXPECTED IMPACT CO-EFFICIENT:
                        </span>
                        <p className="text-xs text-cyan-400 font-medium mt-0.5 font-mono italic">
                          {step.expectedResult}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>

      {/* FOOTER METADATA SKELETON */}
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

      {/* MODAL WINDOW 1: STUNNING CERTIFICATE SHARING GRAPHIC */}
      {isCertificateModalOpen && auditResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Modal header tabs */}
            <div className="p-6 border-b border-indigo-950/30 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
                    IdeaPilot Verified Seal Certificate
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    GENERATING DYNAMIC CANVAS SEALS GRAPHICS
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="h-8 w-8 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal content layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
              
              {/* Left Canvas interactive area */}
              <div className="md:col-span-8 flex flex-col justify-center items-center">
                {/* Real Canvas element backing the dynamic generation */}
                <canvas
                  ref={canvasRef}
                  className="rounded-xl border border-slate-800 aspect-[16/9] w-full bg-slate-950 shadow-inner"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                <p className="text-[10px] text-slate-500 font-mono mt-3 leading-relaxed text-center">
                  Verify receipt contains dynamically parsed scores, URL stamps, crypto identification seals, and premium themed accents.
                </p>
              </div>

              {/* Right panel customizations & sharing captions */}
              <div className="md:col-span-4 space-y-5">
                {/* certificate themes selector */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider block">
                    Style Accent Presets:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCertificateTheme('slate')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase border cursor-pointer flex items-center gap-1.5 transition ${
                        certificateTheme === 'slate'
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Deep Slate</span>
                    </button>
                    <button
                      onClick={() => setCertificateTheme('neon')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase border cursor-pointer flex items-center gap-1.5 transition ${
                        certificateTheme === 'neon'
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>Neon Noir</span>
                    </button>
                    <button
                      onClick={() => setCertificateTheme('cyberpunk')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase border cursor-pointer flex items-center gap-1.5 transition ${
                        certificateTheme === 'cyberpunk'
                          ? 'bg-yellow-950/20 border-yellow-800/40 text-yellow-500'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span>Cyberpunk</span>
                    </button>
                    <button
                      onClick={() => setCertificateTheme('sunset')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase border cursor-pointer flex items-center gap-1.5 transition ${
                        certificateTheme === 'sunset'
                          ? 'bg-orange-950/20 border-orange-850 text-orange-400'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>Sunset Glow</span>
                    </button>
                  </div>
                </div>

                {/* X post caption presets suggestions */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider block">
                    Copy verified text receipt:
                  </span>
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl relative">
                    <p className="text-xs text-slate-300 italic font-mono leading-relaxed pr-10">
                      {shareCopyText}
                    </p>
                    <button
                      onClick={handleCopyCaption}
                      className="absolute right-2 top-2 h-8 w-8 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Sharing actions */}
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    onClick={handleGenerateAndDownloadCertificate}
                    className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-indigo-600/10"
                  >
                    <Download className="h-4 w-4 animate-bounce" />
                    <span>Download Image (.PNG)</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: FULL PRINT PREVIEW OVERLAY */}
      {isPrintModalOpen && auditResult && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-10">
          <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Sticky controls bar (Hidden on Print) */}
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
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Print document payload */}
            <div className="p-10 space-y-10 font-sans print-full">
              {/* Document stamp header */}
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
                  <div>VERSION: 1.83 (STABLE)</div>
                </div>
              </div>

              {/* Attributes evaluation grid */}
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

              {/* Content Sector: Target project metadata */}
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
                      <td className="p-2">IdeaPilot Co-Pilot Suite (Gemini Integrated)</td>
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

              {/* Layout hotspots list print representation */}
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

              {/* proposed pricing models print representation */}
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

              {/* Print Document seal footer stamp */}
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
