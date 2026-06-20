import { Terminal } from 'lucide-react';
import { useI18n } from '../i18n';

interface AnalyzingPageProps {
  logProgress: number;
  terminalLogs: string[];
}

export default function AnalyzingPage({
  logProgress,
  terminalLogs,
}: AnalyzingPageProps) {
  const { t, language } = useI18n();

  return (
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
              <span className="text-[11px] font-semibold">{t.loadingLogs.multiFactor}</span>
            </div>
          )}
        </div>

        {/* Console info section */}
        <div className="bg-slate-950 border-t border-slate-900 p-4 text-[10px] text-slate-500 font-mono flex items-center justify-between">
          <span>IDEAPILOT ENGINE v1.83</span>
          <span>{language === 'zh-CN' ? '安全解析安全模块' : 'SECURE PARSING BLOCK'}</span>
        </div>
      </div>
    </div>
  );
}
