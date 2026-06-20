import { useRef, useEffect, useState } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import { BusinessAuditResult } from '../types/audit';
import { useI18n } from '../i18n';
import {
  drawShareCard,
  downloadCanvasPng,
  buildShareCaption,
  shareCanvasImage
} from '../lib/shareCard';

interface SocialShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: BusinessAuditResult;
  targetUrl: string;
  dynamicallyAdjustedScore: number;
  dynamicGrade: string;
}

export default function SocialShareCardModal({
  isOpen,
  onClose,
  auditResult,
  targetUrl,
  dynamicallyAdjustedScore,
  dynamicGrade,
}: SocialShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t, language } = useI18n();
  const [isPrinting, setIsPrinting] = useState(true);
  const [copied, setCopied] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Drawing canvas preview on open
  useEffect(() => {
    if (isOpen && canvasRef.current && auditResult) {
      setIsPrinting(true);
      setNoticeMessage(null);

      const renderShareCardPreview = () => {
        const dateStr = new Date().toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
        drawShareCard({
          canvas: canvasRef.current!,
          auditResult,
          targetUrl,
          language,
          t,
          score: dynamicallyAdjustedScore,
          grade: dynamicGrade,
          date: dateStr,
        });
      };

      const drawTimer = setTimeout(() => {
        renderShareCardPreview();
      }, 50);

      const animTimer = setTimeout(() => {
        setIsPrinting(false);
      }, 1250);

      return () => {
        clearTimeout(drawTimer);
        clearTimeout(animTimer);
      };
    }
  }, [isOpen, auditResult, language, targetUrl, dynamicallyAdjustedScore, dynamicGrade, t]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current || !auditResult) return;
    const filename = `IdeaPilot_ShareCard_${auditResult.projectName}.png`;
    downloadCanvasPng(canvasRef.current, filename);
  };

  const handleShare = async () => {
    if (!canvasRef.current || !auditResult) return;
    const caption = buildShareCaption({
      targetUrl,
      score: dynamicallyAdjustedScore,
      grade: dynamicGrade,
      language
    });
    await shareCanvasImage({
      canvas: canvasRef.current,
      projectName: auditResult.projectName,
      caption,
      t,
      onShowNotice: (msg) => setNoticeMessage(msg)
    });
  };

  const handleCopyCaption = async () => {
    if (!auditResult) return;
    const caption = buildShareCaption({
      targetUrl,
      score: dynamicallyAdjustedScore,
      grade: dynamicGrade,
      language
    });
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <style>{`
        @keyframes printReveal {
          from { clip-path: inset(0 0 100% 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes scannerLine {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .print-canvas-animate {
          animation: printReveal 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .scanner-line-animate {
          animation: scannerLine 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .print-canvas-animate {
            animation: none !important;
          }
          .scanner-line-animate {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
            {t.shareCard.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.shareCard.subtitle}
          </p>
        </div>

        {noticeMessage && (
          <div className="bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-xs py-2.5 px-4 rounded-xl">
            {noticeMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <div className="relative aspect-[16/9] w-full rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain ${isPrinting ? 'print-canvas-animate' : ''}`}
              />
              {isPrinting && (
                <div className="absolute left-0 right-0 h-0.5 bg-indigo-500/80 shadow-[0_0_8px_#6366f1] pointer-events-none scanner-line-animate" />
              )}
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {isPrinting ? t.shareCard.printing : t.shareCard.ready}
              </span>
            </div>
          </div>

          <div className="space-y-4 bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-slate-300">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              {t.shareCard.ready}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-mono">
                <span>{t.shareCard.businessValueScore}:</span>
                <span className="text-white font-bold">{dynamicallyAdjustedScore}/100</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>{t.shareCard.grade}:</span>
                <span className="text-white font-bold">{dynamicGrade}</span>
              </div>
              <hr className="border-slate-900" />
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <p>• {t.report.metricLabels.commercialValue}: {auditResult.metrics.commercialValue}%</p>
                <p>• {t.report.metricLabels.painkillerIndex}: {auditResult.metrics.painkillerIndex}%</p>
                <p>• {t.report.metricLabels.monetizationClarity}: {auditResult.metrics.monetizationClarity}%</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleShare}
                disabled={isPrinting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>{t.shareCard.share}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isPrinting}
                className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{t.shareCard.downloadPng}</span>
              </button>

              <button
                onClick={handleCopyCaption}
                disabled={isPrinting}
                className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? t.shareCard.copied : t.shareCard.copyCaption}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
