import { AuditResult } from '../types/audit';

interface RevenueCalculatorProps {
  auditResult: AuditResult;
  fixedHotspots: number[];
  calcMonthlyTraffic: number;
  setCalcMonthlyTraffic: (val: number) => void;
  calcAOV: number;
  setCalcAOV: (val: number) => void;
}

export default function RevenueCalculator({
  auditResult,
  fixedHotspots,
  calcMonthlyTraffic,
  setCalcMonthlyTraffic,
  calcAOV,
  setCalcAOV,
}: RevenueCalculatorProps) {
  // CR boosts based on resolved hotspots
  const resolvedRatio = auditResult.hotspots.length > 0 ? (fixedHotspots.length / auditResult.hotspots.length) : 0;
  const crBoost = resolvedRatio * 0.018; // maximum 1.8% boost
  const finalCR = 0.012 + crBoost;
  const beforeRevenue = calcMonthlyTraffic * 0.012 * calcAOV;
  const afterRevenue = calcMonthlyTraffic * finalCR * calcAOV;
  const monthlyLift = Math.max(0, afterRevenue - beforeRevenue);
  const annualLift = monthlyLift * 12;

  return (
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
            <span className="text-[9.5px] text-rose-400 font-mono uppercase tracking-wider font-bold block">
              🔴 Current State (Before)
            </span>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">CR Estimate</span>
              <span className="text-lg font-bold text-slate-200 font-mono">1.20%</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Monthly Revenue</span>
              <span className="text-sm font-semibold text-slate-300 font-mono font-bold">
                ${Math.round(beforeRevenue).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Optimized State Column */}
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

          {/* Value Captured Lift Column */}
          <div className="space-y-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30">
            <span className="text-[9.5px] text-indigo-400 font-mono uppercase tracking-wider font-bold block">
              💎 Simulated Value Lift
            </span>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Monthly Lift</span>
              <span className="text-lg font-bold text-white font-mono font-black">
                +${Math.round(monthlyLift).toLocaleString()}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Annual Realized</span>
              <span className="text-sm font-semibold text-cyan-400 font-mono font-bold">
                +${Math.round(annualLift).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
