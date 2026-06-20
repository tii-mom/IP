import {
  Layout,
  ExternalLink,
  Printer,
  Share2,
  CheckCircle,
  Terminal,
  Check,
  Copy,
  Sparkles
} from 'lucide-react';
import { AuditResult } from '../types/audit';
import RevenueCalculator from '../components/RevenueCalculator';

interface ReportPageProps {
  auditResult: AuditResult;
  targetUrl: string;
  dynamicallyAdjustedScore: number;
  dynamicGrade: string;
  initialBaseScore: number;
  fixedHotspots: number[];
  selectedHotspotId: number;
  setSelectedHotspotId: (id: number) => void;
  mockupMode: 'before' | 'after';
  setMockupMode: (mode: 'before' | 'after') => void;
  customTexts: Record<number, string>;
  setCustomTexts: (texts: Record<number, string>) => void;
  simulatedPrices: string[];
  setSimulatedPrices: (prices: string[]) => void;
  showJsonSchema: boolean;
  setShowJsonSchema: (show: boolean) => void;
  copiedPrescriptionId: number | null;
  setCopiedPrescriptionId: (id: number | null) => void;
  setIsPrintModalOpen: (open: boolean) => void;
  setIsCertificateModalOpen: (open: boolean) => void;
  handleToggleFix: (id: number) => void;
  calcMonthlyTraffic: number;
  setCalcMonthlyTraffic: (val: number) => void;
  calcAOV: number;
  setCalcAOV: (val: number) => void;
  handleReset: () => void;
}

export default function ReportPage({
  auditResult,
  targetUrl,
  dynamicallyAdjustedScore,
  dynamicGrade,
  initialBaseScore,
  fixedHotspots,
  selectedHotspotId,
  setSelectedHotspotId,
  mockupMode,
  setMockupMode,
  customTexts,
  setCustomTexts,
  simulatedPrices,
  setSimulatedPrices,
  showJsonSchema,
  setShowJsonSchema,
  copiedPrescriptionId,
  setCopiedPrescriptionId,
  setIsPrintModalOpen,
  setIsCertificateModalOpen,
  handleToggleFix,
  calcMonthlyTraffic,
  setCalcMonthlyTraffic,
  calcAOV,
  setCalcAOV,
}: ReportPageProps) {

  return (
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
        {/* Primary Adjusted Score Ring */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#312e81,transparent)] opacity-20 pointer-events-none" />
          
          <h3 className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold mb-4">
            IdeaPilot Score
          </h3>

          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
              <circle
                cx="64"
                cy="64"
                r="54"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
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
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
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
                
                const copywritingHotspot = auditResult.hotspots.find((h) => h.category === 'copywriting');
                const pricingHotspot = auditResult.hotspots.find((h) => h.category === 'pricing');
                const trustHotspot = auditResult.hotspots.find((h) => h.category === 'trust');
                const conversionHotspot = auditResult.hotspots.find((h) => h.category === 'conversion');

                const isCopywritingFixed = copywritingHotspot ? fixedHotspots.includes(copywritingHotspot.id) : false;
                const isPricingFixed = pricingHotspot ? fixedHotspots.includes(pricingHotspot.id) : false;
                const isTrustFixed = trustHotspot ? fixedHotspots.includes(trustHotspot.id) : false;
                const isConversionFixed = conversionHotspot ? fixedHotspots.includes(conversionHotspot.id) : false;

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
                      activeHotspot?.category === 'copywriting'
                        ? 'ring-2 ring-indigo-500 border-indigo-400'
                        : 'border-transparent'
                    } ${
                      isCopywritingFixed || (mockupMode === 'after' && copywritingHotspot)
                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                        : 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                    }`}>
                      {activeHotspot?.category === 'copywriting' && (
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
                      activeHotspot?.category === 'pricing'
                        ? 'ring-2 ring-indigo-500 border-indigo-400'
                        : 'border-transparent'
                    } ${
                      isPricingFixed || (mockupMode === 'after' && pricingHotspot)
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/5 border-rose-500/20'
                    }`}>
                      {activeHotspot?.category === 'pricing' && (
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
                      activeHotspot?.category === 'trust'
                        ? 'ring-2 ring-indigo-500 border-indigo-400'
                        : 'border-slate-800/40'
                    } ${
                      isTrustFixed || (mockupMode === 'after' && trustHotspot)
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-950/40'
                    }`}>
                      {activeHotspot?.category === 'trust' && (
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
                      activeHotspot?.category === 'conversion'
                        ? 'ring-2 ring-indigo-500 border-indigo-400'
                        : 'border-transparent'
                    } ${
                      isConversionFixed || (mockupMode === 'after' && conversionHotspot)
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-transparent'
                    }`}>
                      {activeHotspot?.category === 'conversion' && (
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
                        ? 'bg-rose-500 border-2 border-slate-950 text-white'
                        : hotspot.severity === 'warning'
                        ? 'bg-amber-500 border-2 border-slate-950 text-white'
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
                          className="text-[9px] text-rose-450 hover:underline font-mono cursor-pointer"
                        >
                          Reset Text
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={customTexts[activeHotspot.id] || ''}
                      placeholder={`Type your custom phrasing for mockup preview...`}
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
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="font-display font-black text-slate-100 font-mono uppercase text-sm tracking-tight">
                      {tier.tierName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                      {tier.psychologyMetric}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/50 rounded-xl space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">
                        Simulated price:
                      </span>
                      <span className="text-xl font-black text-white font-mono">
                        {simulatedPrices[index] || tier.price}
                      </span>
                    </div>
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

      {/* REVENUE LIFT CALCULATOR */}
      <RevenueCalculator
        auditResult={auditResult}
        fixedHotspots={fixedHotspots}
        calcMonthlyTraffic={calcMonthlyTraffic}
        setCalcMonthlyTraffic={setCalcMonthlyTraffic}
        calcAOV={calcAOV}
        setCalcAOV={setCalcAOV}
      />

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
          <div className="space-y-2 mt-3">
            <div className="flex justify-between items-center bg-slate-950 px-4 py-2 border-b border-slate-850 rounded-t-xl">
              <span className="text-[9px] text-indigo-400 font-mono uppercase font-black">
                ideapilot_schema_export.json
              </span>
              <button
                type="button"
                onClick={() => {
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
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-855 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1.5 cursor-pointer transition"
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
  );
}
