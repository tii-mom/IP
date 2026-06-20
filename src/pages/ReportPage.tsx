import {
  Layout,
  ExternalLink,
  Printer,
  Share2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { BusinessAuditResult, MoneyPath, TargetBuyer, GrowthLever, RiskWarning } from '../types/audit';

interface ReportPageProps {
  auditResult: BusinessAuditResult;
  targetUrl: string;
  calcMonthlyTraffic: number;
  setCalcMonthlyTraffic: (val: number) => void;
  calcAOV: number;
  setCalcAOV: (val: number) => void;
  setIsPrintModalOpen: (open: boolean) => void;
  setIsCertificateModalOpen: (open: boolean) => void;
  handleReset: () => void;
}

export default function ReportPage({
  auditResult,
  targetUrl,
  calcMonthlyTraffic,
  setCalcMonthlyTraffic,
  calcAOV,
  setCalcAOV,
  setIsPrintModalOpen,
  setIsCertificateModalOpen,
}: ReportPageProps) {
  
  // Dynamic Score Logic based on simple metrics calculation
  const totalScore = auditResult.score;
  const grade = auditResult.grade;

  // Simple simulator calculation based on monetization metrics
  const conversionRate = 0.015; // 1.5% baseline
  const liftRate = 0.025; // 2.5% optimized baseline
  const beforeRev = calcMonthlyTraffic * conversionRate * calcAOV;
  const afterRev = calcMonthlyTraffic * liftRate * calcAOV;
  const monthlyLift = Math.max(0, afterRev - beforeRev);
  const annualLift = monthlyLift * 12;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow flex flex-col justify-start">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
              <Layout className="h-4 w-4" />
            </div>
            <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
              {auditResult.projectName} Startup Audit
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>AUDITED DOMAIN:</span>
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

        {/* Global Dashboard Actions */}
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

      {/* Overview Diagnosis Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Value Score gauge */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#312e81,transparent)] opacity-20 pointer-events-none" />
          
          <h3 className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold mb-4">
            Business Value Score
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
                strokeDashoffset={339 - (339 * totalScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="text-center relative">
              <span className="text-3xl font-black text-white font-display block select-none">
                {totalScore}
              </span>
              <span className="text-[11px] text-slate-400 font-medium font-mono">
                GRADE {grade}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-4">
            Assessed based on 7 core variables of independent leverage.
          </p>
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <div>
            <span className="text-[9.5px] text-indigo-400 font-mono uppercase font-bold tracking-wider">
              AI Business Mentor Diagnosis
            </span>
            <h4 className="text-sm font-bold text-white font-mono mt-1">
              {auditResult.summary.oneSentenceDiagnosis}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-950">
            <div className="space-y-1">
              <span className="text-[9px] text-emerald-400 font-mono uppercase block font-bold">
                ✓ Biggest Opportunity
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {auditResult.summary.biggestOpportunity}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-rose-400 font-mono uppercase block font-bold">
                ⚠ Biggest Weakness
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {auditResult.summary.biggestWeakness}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-950">
            <span className="text-[9px] text-cyan-400 font-mono uppercase block font-bold">
              ★ Recommended positioning
            </span>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-mono">
              {auditResult.summary.recommendedPositioning}
            </p>
          </div>
        </div>
      </div>

      {/* 7 Core Evaluation Metrics */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-900 space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          7 Core Evaluation Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(auditResult.metrics).map(([metricName, val]) => {
            // Map camelCase metricName to reader-friendly name
            const labelMap: Record<string, string> = {
              commercialValue: 'Commercial Value',
              painkillerIndex: 'Painkiller Index',
              monetizationClarity: 'Monetization Clarity',
              targetBuyerFit: 'Target Buyer Fit',
              advantageAmplification: 'Advantage Amplification',
              growthLeverage: 'Growth Leverage',
              executionFeasibility: 'Execution Feasibility'
            };
            return (
              <div key={metricName} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between h-28">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tight block font-bold leading-relaxed">
                  {labelMap[metricName] || metricName}
                </span>
                <div>
                  <span className="text-lg font-black font-display text-white">{val}%</span>
                  <div className="h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Money Paths & Target Buyers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Money Paths */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Money Paths
          </h3>
          <div className="space-y-4">
            {auditResult.moneyPaths.map((path: MoneyPath, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase">{path.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 font-mono uppercase">
                    {path.model}
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic">"{path.whyItFits}"</p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] border-t border-slate-900">
                  <div>
                    <span className="text-slate-500 block">Offer Suggestion:</span>
                    <span className="text-cyan-400 font-mono font-semibold">{path.suggestedPriceOrValueExchange}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">First Experiment:</span>
                    <span className="text-slate-200">{path.firstExperiment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Buyers */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Target Buyers Matrix
          </h3>
          <div className="space-y-4">
            {auditResult.targetBuyers.map((buyer: TargetBuyer, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase">{buyer.segment}</span>
                  <span className="text-xs font-mono text-emerald-400">
                    Willingness: {buyer.willingnessToPay}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">{buyer.whyTheyBuy}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">Best Offer Proposal:</span>
                  <span className="text-indigo-400 font-mono font-semibold">{buyer.bestOffer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantage Map & Growth Levers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Advantage Map */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Advantage Map & Moats
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-indigo-400 font-mono uppercase block font-bold">Strongest Asset:</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.strongestAsset}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono uppercase block font-bold">Hidden Underutilized Asset:</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.hiddenAsset}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-amber-500 font-mono uppercase block font-bold">Defensible Moat Potential:</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.moatPotential}</p>
            </div>
            <div className="pt-3 border-t border-slate-900 space-y-2">
              <span className="text-[9.5px] text-slate-500 font-mono uppercase font-bold block">How To Amplify Advantage:</span>
              <ul className="space-y-1.5">
                {auditResult.advantageMap.howToAmplify.map((item: string, i: number) => (
                  <li key={i} className="text-xs text-slate-350 flex items-start gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Growth Levers */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Growth Levers & Channels
          </h3>
          <div className="space-y-4">
            {auditResult.growthLevers.map((lever: GrowthLever, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase">{lever.lever}</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-900/30 text-[9px] text-cyan-400 font-mono">
                    {lever.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-455">{lever.whyItWorks}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">First Action Item:</span>
                  <span className="text-emerald-400 font-mono font-semibold">{lever.firstAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Startup Mentor Board Reports */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-900 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            AI Startup Mentor Board Reviews
          </h3>
          <p className="text-[11px] text-slate-500 italic">
            Reviews generated based on business leader philosophies and operational frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {auditResult.mentorReports.map((report) => (
            <div key={report.mentorId} className="p-5 bg-slate-950 border border-slate-850 rounded-xl flex flex-col justify-between min-h-[340px] relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono leading-none">{report.mentorName}</h4>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-1 block">
                      {report.lens}
                    </span>
                  </div>
                  <div className="h-10 w-10 bg-indigo-950/20 border border-indigo-900/40 rounded-xl flex items-center justify-center text-xs font-black text-indigo-400 font-mono">
                    {report.score}/100
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block">Verdict Opinion:</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed italic">
                    "{report.verdict}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold block">Key Advisory Advice:</span>
                  <ul className="space-y-1 text-xs text-slate-350">
                    {report.keyAdvice.map((adv, ai) => (
                      <li key={ai} className="flex items-start gap-1">
                        <span className="text-indigo-500 select-none">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900/60 mt-4">
                <span className="text-[9px] text-rose-400 font-mono uppercase font-bold block">Detected Blind Spot:</span>
                <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed font-medium">
                  {report.blindSpot}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Calculator Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 border border-indigo-900/40 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/40 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase font-bold">
              💰 Value Lift Calculator
            </div>
            <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
              Pricing Value Leak Calculator
            </h3>
            <p className="text-xs text-slate-400 font-sans max-w-xl">
              Simulate traffic acquisition and value captures to see revenue progression estimates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-slate-300 font-bold uppercase">Monthly Traffic</span>
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-slate-300 font-bold uppercase">Simulated AOV</span>
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
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/40 border border-slate-800/40 p-6 rounded-2xl">
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
              <span className="text-[9.5px] text-rose-400 font-mono uppercase tracking-wider font-bold block">
                🔴 Baseline Estimate (1.50% CR)
              </span>
              <div className="space-y-1">
                <span className="text-lg font-bold text-slate-200 font-mono">
                  ${Math.round(beforeRev).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
              <span className="text-[9.5px] text-emerald-400 font-mono uppercase tracking-wider font-bold block">
                🟢 Optimised Estimate (2.50% CR)
              </span>
              <div className="space-y-1">
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  ${Math.round(afterRev).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30">
              <span className="text-[9.5px] text-indigo-400 font-mono uppercase tracking-wider font-bold block">
                💎 Simulated Lift
              </span>
              <div className="space-y-1 flex flex-col justify-between">
                <span className="text-lg font-bold text-white font-mono font-black">
                  +${Math.round(monthlyLift).toLocaleString()} /mo
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  +${Math.round(annualLift).toLocaleString()} /yr ARR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plan & Risk Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Action Plan */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Execution Implementation Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">🚀 Next 24 Hours</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {auditResult.actionPlan.next24Hours.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">📅 Next 7 Days</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {auditResult.actionPlan.next7Days.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">📆 Next 30 Days</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {auditResult.actionPlan.next30Days.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">🏆 Next 90 Days</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {auditResult.actionPlan.next90Days.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Warnings */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Product Risk Warnings
          </h3>
          <div className="space-y-4">
            {auditResult.riskWarnings.map((risk: RiskWarning, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white font-mono uppercase flex items-center gap-1.5">
                    <AlertTriangle className={`h-3.5 w-3.5 ${risk.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                    <span>Risk Alert</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                    risk.severity === 'high'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {risk.severity} severity
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{risk.risk}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">Mitigation Fix:</span>
                  <span className="text-slate-200">{risk.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
