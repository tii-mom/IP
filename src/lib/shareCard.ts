import { BusinessAuditResult } from '../types/audit';

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  language?: string
): number {
  if (!text) return y;
  
  // Split by character for Chinese, by word for other languages
  const tokens = language === 'zh-CN' ? text.split('') : text.split(' ');
  let line = '';
  let lines: string[] = [];

  for (let n = 0; n < tokens.length; n++) {
    const nextToken = tokens[n];
    const testLine = line + nextToken + (language === 'zh-CN' ? '' : ' ');
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = nextToken + (language === 'zh-CN' ? '' : ' ');
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Truncate and add ellipsis if too many lines
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLine = lines[lines.length - 1];
    if (lastLine.length > 3) {
      lines[lines.length - 1] = lastLine.slice(0, -3) + '...';
    } else {
      lines[lines.length - 1] = lastLine + '...';
    }
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }

  return y + lines.length * lineHeight;
}

interface DrawShareCardParams {
  canvas: HTMLCanvasElement;
  auditResult: BusinessAuditResult;
  targetUrl: string;
  language: string;
  t: any;
  score: number;
  grade: string;
  date: string;
}

export function drawShareCard({
  canvas,
  auditResult,
  targetUrl,
  language,
  t,
  score,
  grade,
  date,
}: DrawShareCardParams) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to 1200x675
  canvas.width = 1200;
  canvas.height = 675;

  // Set font fallbacks
  const sansFont = language === 'zh-CN'
    ? 'system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
    : '"Inter", "Outfit", system-ui, -apple-system, sans-serif';
  const monoFont = '"Space Grotesk", "JetBrains Mono", monospace';

  // Fill Background (light gray / white)
  ctx.fillStyle = '#f8fafc'; // slate-50
  ctx.fillRect(0, 0, 1200, 675);

  // Outer border
  ctx.strokeStyle = '#cbd5e1'; // slate-300
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 1120, 595);

  // Header accent bar
  ctx.fillStyle = '#4f46e5'; // Indigo-600
  ctx.fillRect(70, 75, 6, 50);

  // Header Left Text
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 13px ${monoFont}`;
  ctx.fillText('★ IDEAPILOT AI EXECUTIVE BRIEFING', 90, 92);

  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.font = `bold 26px ${sansFont}`;
  const headerTitle = language === 'zh-CN' ? '项目商业评估报告' : 'Startup Business Audit Report';
  ctx.fillText(headerTitle, 90, 125);

  // Header Right Text
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.font = `bold 12px ${monoFont}`;
  ctx.fillText(`DATE: ${date}`, 1130, 92);
  
  const scanId = `IP-${auditResult.projectName.toUpperCase().substring(0, 3)}-2026`;
  ctx.fillText(`${language === 'zh-CN' ? '扫描 ID' : 'SCAN ID'}: ${scanId}`, 1130, 120);

  // Reset text alignment
  ctx.textAlign = 'left';

  // Header separator line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 155);
  ctx.lineTo(1130, 155);
  ctx.stroke();

  // LEFT COLUMN: Diagnosis & Recommendations & URL (X = 70 to 690, width 620)
  
  // 1. One sentence diagnosis
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 12px ${monoFont}`;
  const labelDiagnosis = language === 'zh-CN' ? 'AI 商业导师诊断' : 'AI BUSINESS MENTOR DIAGNOSIS';
  ctx.fillText(labelDiagnosis, 70, 200);

  ctx.fillStyle = '#334155'; // slate-700
  ctx.font = `italic 16px ${sansFont}`;
  const diagnosisText = auditResult.summary.oneSentenceDiagnosis;
  wrapText(ctx, diagnosisText, 70, 230, 620, 26, 2, language);

  // 2. Recommended Positioning / Biggest Opportunity
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 12px ${monoFont}`;
  const labelPositioning = language === 'zh-CN' ? '推荐定位' : 'RECOMMENDED POSITIONING';
  ctx.fillText(labelPositioning, 70, 320);

  ctx.fillStyle = '#334155';
  ctx.font = `16px ${sansFont}`;
  const positioningText = auditResult.summary.recommendedPositioning || auditResult.summary.biggestOpportunity;
  wrapText(ctx, positioningText, 70, 350, 620, 26, 2, language);

  // 3. Project URL
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 12px ${monoFont}`;
  ctx.fillText(t.shareCard.projectUrl.toUpperCase(), 70, 445);

  ctx.fillStyle = '#0f172a';
  ctx.font = `bold 18px ${monoFont}`;
  const truncatedUrl = truncateText(targetUrl, 48);
  ctx.fillText(truncatedUrl, 70, 475);


  // RIGHT COLUMN: Score box, Valuation box & 3 Metrics (X = 760 to 1130, width 370)
  
  // 1. Score Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(760, 185, 370, 120);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(760, 185, 370, 120);

  // Score title & value
  ctx.fillStyle = '#64748b';
  ctx.font = `bold 11px ${monoFont}`;
  ctx.fillText(t.shareCard.businessValueScore.toUpperCase(), 785, 215);

  ctx.fillStyle = '#0f172a';
  ctx.font = `bold 28px ${sansFont}`;
  ctx.fillText(`${score} / 100`, 785, 255);

  // Grade title & value
  ctx.fillStyle = '#64748b';
  ctx.font = `bold 11px ${monoFont}`;
  ctx.fillText(t.shareCard.grade.toUpperCase(), 980, 215);

  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 28px ${sansFont}`;
  ctx.fillText(`${grade} RANK`, 980, 255);

  // 2. Project Valuation Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(760, 320, 370, 85);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(760, 320, 370, 85);

  // Valuation title
  ctx.fillStyle = '#64748b';
  ctx.font = `bold 11px ${monoFont}`;
  ctx.fillText(t.shareCard.estimatedValue.toUpperCase(), 785, 345);

  // Valuation Value
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 22px ${sansFont}`;
  const minVal = auditResult.valuation?.estimatedValueMin?.toLocaleString() || '18,000';
  const maxVal = auditResult.valuation?.estimatedValueMax?.toLocaleString() || '65,000';
  ctx.fillText(`$${minVal} - $${maxVal}`, 785, 385);

  // 3. 3 Metrics
  const metricsYStart = 435;
  const metricsSpacing = 35;

  const metricItems = [
    { label: t.report.metricLabels.commercialValue, val: auditResult.metrics.commercialValue },
    { label: t.report.metricLabels.painkillerIndex, val: auditResult.metrics.painkillerIndex },
    { label: t.report.metricLabels.monetizationClarity, val: auditResult.metrics.monetizationClarity }
  ];

  metricItems.forEach((item, index) => {
    const curY = metricsYStart + index * metricsSpacing;
    
    // Label
    ctx.fillStyle = '#334155';
    ctx.font = `bold 12px ${sansFont}`;
    ctx.fillText(item.label, 760, curY);

    // Value
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 12px ${monoFont}`;
    ctx.fillText(`${item.val}%`, 1130, curY);
    ctx.textAlign = 'left';

    // Progress Bar Track
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.fillRect(760, curY + 6, 370, 4);

    // Progress Bar Fill
    ctx.fillStyle = '#4f46e5'; // indigo-600
    const fillWidth = (item.val / 100) * 370;
    ctx.fillRect(760, curY + 6, fillWidth, 4);
  });


  // FOOTER AREA
  
  // Divider
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 545);
  ctx.lineTo(1130, 545);
  ctx.stroke();

  // Platform Intro
  ctx.fillStyle = '#64748b';
  ctx.font = `12px ${sansFont}`;
  ctx.fillText(t.shareCard.platformIntro, 70, 580);

  // Platform URL
  ctx.textAlign = 'right';
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold 12px ${monoFont}`;
  ctx.fillText('ideapilot-web.pages.dev', 1130, 580);
  ctx.textAlign = 'left';
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback if toBlob returns null
          const dataUrl = canvas.toDataURL('image/png');
          const binStr = atob(dataUrl.split(',')[1]);
          const len = binStr.length;
          const arr = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }
          resolve(new Blob([arr], { type: 'image/png' }));
        }
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (e) {
    console.error('Failed to download canvas PNG:', e);
  }
}

interface BuildCaptionParams {
  targetUrl: string;
  score: number;
  grade: string;
  language: string;
}

export function buildShareCaption({
  targetUrl,
  score,
  grade,
  language,
}: BuildCaptionParams): string {
  if (language === 'zh-CN') {
    return `我刚用 IdeaPilot 评估了我的项目商业价值。\n商业价值评分：${score} / 100\n评级：${grade} RANK\n项目：${targetUrl}\nIdeaPilot 会分析网站如何赚钱、谁会付费，以及最值得放大的增长杠杆。\n体验地址: https://ideapilot-web.pages.dev`;
  } else {
    return `I just audited my product with IdeaPilot.\nBusiness Value Score: ${score} / 100\nGrade: ${grade} RANK\nProject: ${targetUrl}\nIdeaPilot helps indie builders find monetization paths, target buyers, and growth leverage.\nTry it: https://ideapilot-web.pages.dev`;
  }
}

interface ShareCanvasImageParams {
  canvas: HTMLCanvasElement;
  projectName: string;
  caption: string;
  t: any;
  onShowNotice: (msg: string) => void;
}

export async function shareCanvasImage({
  canvas,
  projectName,
  caption,
  t,
  onShowNotice,
}: ShareCanvasImageParams) {
  const filename = `IdeaPilot_Audit_${projectName}.png`;
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
      await navigator.share({
        title: 'IdeaPilot Business Audit',
        text: caption,
        files: [file],
      });
    } else {
      // Fallback: Download, Copy and open X
      downloadCanvasPng(canvas, filename);
      await navigator.clipboard.writeText(caption);
      onShowNotice(t.shareCard.shareFallbackNotice);
      setTimeout(() => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
      }, 1200);
    }
  } catch (err) {
    console.error('Failed to share card:', err);
    // Fallback: Download, Copy and open X
    downloadCanvasPng(canvas, filename);
    await navigator.clipboard.writeText(caption);
    onShowNotice(t.shareCard.shareFallbackNotice);
    setTimeout(() => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, '_blank');
    }, 1200);
  }
}
