import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { BusinessAuditResult } from '../types/audit';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: BusinessAuditResult;
  targetUrl: string;
  dynamicallyAdjustedScore: number;
  dynamicGrade: string;
  certificateTheme: 'neon' | 'cyberpunk' | 'sunset' | 'slate';
  setCertificateTheme: (theme: 'neon' | 'cyberpunk' | 'sunset' | 'slate') => void;
}

export default function CertificateModal({
  isOpen,
  onClose,
  auditResult,
  targetUrl,
  dynamicallyAdjustedScore,
  dynamicGrade,
  certificateTheme,
  setCertificateTheme,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleGenerateAndDownloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !auditResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

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

    const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, bgGradientStart);
    gradient.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 675);

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

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Space Grotesk", sans-serif';
    ctx.fillText('IdeaPilot', 80, 100);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 14px monospace';
    ctx.fillText('• COMMERCIAL VALIDATION LABS', 230, 95);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText(`ID PIN: IP-${auditResult.projectName.toUpperCase().substring(0, 3)}-2026`, 940, 95);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STARTUP MONETIZATION CERTIFICATE', 80, 210);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('This official seal verifies the landing page conversion and monetization potential audit for:', 80, 260);

    ctx.fillStyle = badgeBg;
    ctx.fillRect(80, 290, 700, 60);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(80, 290, 700, 60);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(targetUrl, 105, 330);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(840, 170, 280, 340);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(840, 170, 280, 340);

    ctx.fillStyle = brandColor;
    ctx.font = '800 120px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dynamicGrade, 980, 310);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText(`SCORE: ${dynamicallyAdjustedScore} / 100`, 980, 370);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(880, 400, 200, 8);
    ctx.fillStyle = brandColor;
    ctx.fillRect(880, 400, (dynamicallyAdjustedScore / 100) * 200, 8);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`• Comm Value: ${auditResult.metrics.commercialValue}%`, 880, 440);
    ctx.fillText(`• Painkiller Index: ${auditResult.metrics.painkillerIndex}%`, 880, 465);
    ctx.fillText(`• Monetization: ${auditResult.metrics.monetizationClarity}%`, 880, 490);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px monospace';
    ctx.fillText('ISSUED BY IDEAPILOT GPT EVALUATION SUITE', 80, 470);

    ctx.fillStyle = brandColor;
    ctx.font = 'bold 16px monospace';
    ctx.fillText('ideapilot.com/audit', 80, 500);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(480, 480, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText('VERIFIED', 455, 483);

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

  useEffect(() => {
    if (isOpen && canvasRef.current && auditResult) {
      const timer = setTimeout(() => {
        handleGenerateAndDownloadCertificate();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, certificateTheme]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
            Generating Dynamic Certificate
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Customize theme profile matching brand styling prior to distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <div className="aspect-video w-full rounded-2xl border border-slate-800 overflow-hidden relative bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="flex gap-2">
              {(['slate', 'neon', 'cyberpunk', 'sunset'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setCertificateTheme(theme)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono capitalize border ${
                    certificateTheme === theme
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  } transition`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-slate-300">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Verification Stats
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-mono">
                <span>Score:</span>
                <span className="text-white font-bold">{dynamicallyAdjustedScore}/100</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Grade:</span>
                <span className="text-white font-bold">{dynamicGrade}</span>
              </div>
              <hr className="border-slate-900" />
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <p>• Comm Value: {auditResult.metrics.commercialValue}%</p>
                <p>• Painkiller: {auditResult.metrics.painkillerIndex}%</p>
                <p>• Monetization: {auditResult.metrics.monetizationClarity}%</p>
              </div>
            </div>

            <button
              onClick={handleGenerateAndDownloadCertificate}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
