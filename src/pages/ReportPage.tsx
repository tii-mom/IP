import {
  Layout,
  ExternalLink,
  RefreshCcw,
  Share2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { BusinessAuditResult, MoneyPath, TargetBuyer, GrowthLever, RiskWarning } from '../types/audit';
import { useI18n } from '../i18n';

interface ReportPageProps {
  auditResult: BusinessAuditResult;
  targetUrl: string;
  setIsShareModalOpen: (open: boolean) => void;
  handleReset: () => void;
}

export default function ReportPage({
  auditResult,
  targetUrl,
  setIsShareModalOpen,
  handleReset,
}: ReportPageProps) {
  const { t, language } = useI18n();

  // Dynamic Score Logic based on simple metrics calculation
  const totalScore = auditResult.score;
  const grade = auditResult.grade;

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
              {auditResult.projectName} {t.report.auditTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>{t.report.auditedDomain}</span>
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
            onClick={handleReset}
            className="flex-1 md:flex-initial py-2 px-4 border border-slate-880 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 rounded-xl text-xs text-slate-300 hover:text-white transition font-mono flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>{t.common.newAudit}</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 md:flex-initial py-2 px-4 bg-indigo-600 hover:bg-indigo-500 hover:glow-indigo text-white rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg shadow-indigo-600/15"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{t.shareCard.generate}</span>
          </button>
        </div>
      </div>

      {/* Language mismatch warning banner */}
      {auditResult.language && auditResult.language !== language && (
        <div className="bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>
            {language === 'zh-CN'
              ? `这份报告是用${auditResult.language === 'zh-CN' ? '中文' : '英文'}生成的。如需中文报告，请重新进行评估。`
              : `This report was generated in ${auditResult.language === 'zh-CN' ? 'Chinese' : 'English'}. Re-run the audit to generate an English version.`}
          </span>
        </div>
      )}

      {/* Overview Diagnosis Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Value Score gauge */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#312e81,transparent)] opacity-20 pointer-events-none" />
          
          <h3 className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold mb-4">
            {t.report.businessValueScore}
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
                {t.report.grade} {grade}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-4">
            {t.report.assessedVariables}
          </p>
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <div>
            <span className="text-[9.5px] text-indigo-400 font-mono uppercase font-bold tracking-wider">
              {t.report.mentorDiagnosis}
            </span>
            <h4 className="text-sm font-bold text-white font-mono mt-1 font-sans">
              {auditResult.summary.oneSentenceDiagnosis}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-950">
            <div className="space-y-1">
              <span className="text-[9px] text-emerald-400 font-mono uppercase block font-bold">
                {t.report.biggestOpportunity}
              </span>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                {auditResult.summary.biggestOpportunity}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-rose-400 font-mono uppercase block font-bold">
                {t.report.biggestWeakness}
              </span>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                {auditResult.summary.biggestWeakness}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-950">
            <span className="text-[9px] text-cyan-400 font-mono uppercase block font-bold">
              {t.report.recommendedPositioning}
            </span>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans">
              {auditResult.summary.recommendedPositioning}
            </p>
          </div>
        </div>
      </div>

      {/* 7 Core Evaluation Metrics */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-900 space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          {t.report.sevenMetrics}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(auditResult.metrics).map(([metricName, val]) => {
            const labelMap: Record<string, string> = {
              commercialValue: t.report.metricLabels.commercialValue,
              painkillerIndex: t.report.metricLabels.painkillerIndex,
              monetizationClarity: t.report.metricLabels.monetizationClarity,
              targetBuyerFit: t.report.metricLabels.targetBuyerFit,
              advantageAmplification: t.report.metricLabels.advantageAmplification,
              growthLeverage: t.report.metricLabels.growthLeverage,
              executionFeasibility: t.report.metricLabels.executionFeasibility
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
            {t.report.moneyPaths}
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
                <p className="text-xs text-slate-350 italic">"{path.whyItFits}"</p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] border-t border-slate-900">
                  <div>
                    <span className="text-slate-500 block">{t.report.offerSuggestion}</span>
                    <span className="text-cyan-400 font-mono font-semibold">{path.suggestedPriceOrValueExchange}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.report.firstExperiment}</span>
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
            {t.report.targetBuyers}
          </h3>
          <div className="space-y-4">
            {auditResult.targetBuyers.map((buyer: TargetBuyer, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase">{buyer.segment}</span>
                  <span className="text-xs font-mono text-emerald-400">
                    {t.report.willingness}: {buyer.willingnessToPay}%
                  </span>
                </div>
                <p className="text-xs text-slate-350">{buyer.whyTheyBuy}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">{t.report.bestOffer}</span>
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
            {t.report.advantageMap}
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-indigo-400 font-mono uppercase block font-bold">{t.report.strongestAsset}</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.strongestAsset}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono uppercase block font-bold">{t.report.hiddenAsset}</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.hiddenAsset}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-amber-500 font-mono uppercase block font-bold">{t.report.moatPotential}</span>
              <p className="text-xs text-slate-200">{auditResult.advantageMap.moatPotential}</p>
            </div>
            <div className="pt-3 border-t border-slate-900 space-y-2">
              <span className="text-[9.5px] text-slate-500 font-mono uppercase font-bold block">{t.report.howToAmplify}</span>
              <ul className="space-y-1.5">
                {auditResult.advantageMap.howToAmplify.map((item: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
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
            {t.report.growthLevers}
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
                <p className="text-xs text-slate-350">{lever.whyItWorks}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">{t.report.firstActionItem}</span>
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
            {t.report.mentorReports}
          </h3>
          <p className="text-[11px] text-slate-500 italic">
            {t.report.mentorReportsDesc}
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
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block">{t.report.verdictOpinion}</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed italic font-sans">
                    "{report.verdict}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold block">{t.report.keyAdvice}</span>
                  <ul className="space-y-1 text-xs text-slate-350">
                    {report.keyAdvice.map((adv, ai) => (
                      <li key={ai} className="flex items-start gap-1 font-sans">
                        <span className="text-indigo-500 select-none">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900/60 mt-4">
                <span className="text-[9px] text-rose-400 font-mono uppercase font-bold block">{t.report.blindSpot}</span>
                <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed font-medium">
                  {report.blindSpot}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Project Valuation System Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 border border-indigo-900/40 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/40 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase font-bold">
              💰 {t.valuation.title}
            </div>
            <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
              {t.valuation.rangeLabel}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Large Valuation Area */}
          <div className="lg:col-span-4 p-6 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col justify-center items-center text-center h-full min-h-[180px]">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
              {t.valuation.title}
            </span>
            <span className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 my-3 select-none">
              ${auditResult.valuation?.estimatedValueMin?.toLocaleString()} - ${auditResult.valuation?.estimatedValueMax?.toLocaleString()}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span>{t.valuation.confidence}: {auditResult.valuation?.confidence}%</span>
            </div>
          </div>

          {/* Rationale & Drivers Area */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase block font-bold tracking-wider">
                {t.valuation.rationale}
              </span>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed font-sans">
                {auditResult.valuation?.rationale}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-950 space-y-2">
              <span className="text-[10px] text-cyan-400 font-mono uppercase block font-bold tracking-wider">
                {t.valuation.valueDrivers}
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {auditResult.valuation?.valueDrivers?.map((driver, i) => (
                  <li key={i} className="text-xs text-slate-350 flex items-start gap-1.5 font-sans">
                    <span className="text-indigo-500 select-none font-bold">•</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-indigo-950/40 text-[10px] text-slate-500 font-sans italic leading-relaxed">
          {t.valuation.disclaimer}
        </div>
      </div>

      {/* Investor Lens Review Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-900 space-y-6">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            🔍 {t.investorLens.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
            {t.investorLens.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {auditResult.investorLensReports?.map((lensReport) => (
            <div key={lensReport.investorId} className="p-5 bg-slate-950 border border-slate-850 rounded-xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono leading-none">{lensReport.investorName}</h4>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-1.5 block">
                      {lensReport.lens}
                    </span>
                  </div>
                  <div className="h-10 w-10 bg-indigo-950/20 border border-indigo-900/40 rounded-xl flex items-center justify-center text-xs font-black text-indigo-400 font-mono">
                    {lensReport.score}/100
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block">{t.investorLens.thesis}</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed italic font-sans">
                    "{lensReport.thesis}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold block">{t.investorLens.whyValuable}</span>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    {lensReport.whyItCouldBeValuable}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-cyan-400 font-mono uppercase font-bold block">{t.investorLens.increaseValuation}</span>
                  <ul className="space-y-1 text-xs text-slate-350">
                    {lensReport.whatWouldIncreaseValuation?.map((item, ai) => (
                      <li key={ai} className="flex items-start gap-1 font-sans">
                        <span className="text-cyan-500 select-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900/60 mt-4 bg-indigo-950/10 p-2.5 rounded-lg border border-indigo-900/20">
                <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold block">{t.investorLens.confidenceBoost}</span>
                <p className="text-xs text-emerald-350 font-sans mt-0.5 leading-relaxed font-medium">
                  {lensReport.confidenceBoost}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan & Risk Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Action Plan */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            {t.report.actionPlan}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">{t.report.next24Hours}</span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
                {auditResult.actionPlan.next24Hours.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">{t.report.next7Days}</span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
                {auditResult.actionPlan.next7Days.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">{t.report.next30Days}</span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
                {auditResult.actionPlan.next30Days.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block font-bold">{t.report.next90Days}</span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
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
            {t.report.riskWarnings}
          </h3>
          <div className="space-y-4">
            {auditResult.riskWarnings.map((risk: RiskWarning, index: number) => (
              <div key={index} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white font-mono uppercase flex items-center gap-1.5">
                    <AlertTriangle className={`h-3.5 w-3.5 ${risk.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                    <span>{t.report.riskAlert}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                    risk.severity === 'high'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {risk.severity === 'high' ? (language === 'zh-CN' ? '高风险' : 'high severity') : (language === 'zh-CN' ? '中低风险' : 'medium severity')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{risk.risk}</p>
                <div className="pt-2 text-[10px] border-t border-slate-900">
                  <span className="text-slate-500 block">{t.report.mitigationFix}</span>
                  <span className="text-slate-200 font-sans">{risk.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
