import { Env, BusinessAuditResult } from '../types';
import { generateFallbackReport } from './fallback';

export function validateBusinessAuditResult(report: any): boolean {
  if (!report || typeof report !== 'object') return false;
  
  // Basic validation of critical top-level structures
  const requiredKeys = ['projectName', 'score', 'grade', 'summary', 'metrics', 'moneyPaths', 'targetBuyers', 'advantageMap', 'growthLevers', 'mentorReports', 'valuation', 'investorLensReports', 'actionPlan', 'riskWarnings'];
  for (const key of requiredKeys) {
    if (!(key in report)) {
      return false;
    }
  }
  return true;
}

export function normalizeBusinessAuditResult(
  raw: any,
  url: string,
  projectName: string,
  analysisMode?: 'quick_scan' | 'single_mentor' | 'mentor_board',
  selectedMentors?: string[],
  language: 'en' | 'zh-CN' = 'en'
): BusinessAuditResult {
  const fallback = generateFallbackReport(url, projectName, analysisMode, selectedMentors, language);

  const safe = (val: any, def: any) => (val !== undefined && val !== null ? val : def);

  const clampMetric = (val: any, def: number): number => {
    if (val === undefined || val === null || val === '') return def;
    const num = Number(val);
    return isNaN(num) ? def : Math.min(Math.max(num, 0), 100);
  };

  const normalizedSummary = {
    oneSentenceDiagnosis: safe(raw?.summary?.oneSentenceDiagnosis, fallback.summary.oneSentenceDiagnosis),
    biggestOpportunity: safe(raw?.summary?.biggestOpportunity, fallback.summary.biggestOpportunity),
    biggestWeakness: safe(raw?.summary?.biggestWeakness, fallback.summary.biggestWeakness),
    recommendedPositioning: safe(raw?.summary?.recommendedPositioning, fallback.summary.recommendedPositioning)
  };

  const normalizedMetrics = {
    commercialValue: clampMetric(raw?.metrics?.commercialValue, fallback.metrics.commercialValue),
    painkillerIndex: clampMetric(raw?.metrics?.painkillerIndex, fallback.metrics.painkillerIndex),
    monetizationClarity: clampMetric(raw?.metrics?.monetizationClarity, fallback.metrics.monetizationClarity),
    targetBuyerFit: clampMetric(raw?.metrics?.targetBuyerFit, fallback.metrics.targetBuyerFit),
    advantageAmplification: clampMetric(raw?.metrics?.advantageAmplification, fallback.metrics.advantageAmplification),
    growthLeverage: clampMetric(raw?.metrics?.growthLeverage, fallback.metrics.growthLeverage),
    executionFeasibility: clampMetric(raw?.metrics?.executionFeasibility, fallback.metrics.executionFeasibility)
  };

  const isZh = language === 'zh-CN';
  const defaultMoneyName = isZh ? '变现方案' : 'Monetization Route';
  const defaultMoneyWhy = isZh ? '匹配标准项目变现画像。' : 'Matches standard project monetization profiles.';
  const defaultMoneyPrice = isZh ? '自定义价值交换定价' : 'Custom value-exchange pricing';
  const defaultMoneyExp = isZh ? '设计目标落地页的转化触发器。' : 'Define a target landing page callout trigger.';

  const defaultBuyerSegment = isZh ? '大众用户' : 'General Users';
  const defaultBuyerWhy = isZh ? '他们需要效率解决方案。' : 'They require efficiency solutions.';
  const defaultBuyerOffer = isZh ? '基础档位定价。' : 'Basic tier pricing.';

  const defaultLeverName = isZh ? '病毒式传播钩子' : 'Viral Hook';
  const defaultLeverChannel = isZh ? '社交媒体渠道' : 'Social media channels';
  const defaultLeverWhy = isZh ? '分享门槛低。' : 'Low barrier to sharing.';
  const defaultLeverAction = isZh ? '添加视觉分享组件。' : 'Add visual sharing widgets.';

  const defaultMentorName = isZh ? '商业导师' : 'Business Mentor';
  const defaultMentorLens = isZh ? '通用商业评估视角' : 'General business evaluation lens';
  const defaultMentorVerdict = isZh ? '项目设计令人满意，但仍有成长空间。' : 'Satisfactory product design with room for growth.';
  const defaultMentorAdvice = isZh ? '尽早验证用户参与度指标。' : 'Validate user engagement metrics early.';
  const defaultMentorBlindSpot = isZh ? '容易受到局部市场饱和的影响。' : 'Vulnerable to localized market saturation.';

  const defaultRiskName = isZh ? '无法预见的工程开发开销。' : 'Unforeseen engineering overheads.';
  const defaultRiskFix = isZh ? '尽早引入解耦测试管道。' : 'Introduce decoupled testing pipelines early.';

  const normalizedMoneyPaths = Array.isArray(raw?.moneyPaths) 
    ? raw.moneyPaths.map((item: any) => ({
        name: safe(item?.name, defaultMoneyName),
        model: safe(item?.model, 'subscription'),
        whyItFits: safe(item?.whyItFits, defaultMoneyWhy),
        suggestedPriceOrValueExchange: safe(item?.suggestedPriceOrValueExchange, defaultMoneyPrice),
        firstExperiment: safe(item?.firstExperiment, defaultMoneyExp)
      }))
    : fallback.moneyPaths;

  const normalizedTargetBuyers = Array.isArray(raw?.targetBuyers)
    ? raw.targetBuyers.map((item: any) => ({
        segment: safe(item?.segment, defaultBuyerSegment),
        willingnessToPay: clampMetric(item?.willingnessToPay, 70),
        whyTheyBuy: safe(item?.whyTheyBuy, defaultBuyerWhy),
        bestOffer: safe(item?.bestOffer, defaultBuyerOffer)
      }))
    : fallback.targetBuyers;

  const normalizedAdvantageMap = {
    strongestAsset: safe(raw?.advantageMap?.strongestAsset, fallback.advantageMap.strongestAsset),
    hiddenAsset: safe(raw?.advantageMap?.hiddenAsset, fallback.advantageMap.hiddenAsset),
    moatPotential: safe(raw?.advantageMap?.moatPotential, fallback.advantageMap.moatPotential),
    howToAmplify: Array.isArray(raw?.advantageMap?.howToAmplify) ? raw.advantageMap.howToAmplify : fallback.advantageMap.howToAmplify
  };

  const normalizedGrowthLevers = Array.isArray(raw?.growthLevers)
    ? raw.growthLevers.map((item: any) => ({
        lever: safe(item?.lever, defaultLeverName),
        channel: safe(item?.channel, defaultLeverChannel),
        whyItWorks: safe(item?.whyItWorks, defaultLeverWhy),
        firstAction: safe(item?.firstAction, defaultLeverAction)
      }))
    : fallback.growthLevers;

  const normalizedMentorReports = Array.isArray(raw?.mentorReports)
    ? raw.mentorReports.map((item: any) => ({
        mentorId: safe(item?.mentorId, 'general_mentor'),
        mentorName: safe(item?.mentorName, defaultMentorName),
        lens: safe(item?.lens, defaultMentorLens),
        score: clampMetric(item?.score, 80),
        verdict: safe(item?.verdict, defaultMentorVerdict),
        keyAdvice: Array.isArray(item?.keyAdvice) ? item.keyAdvice : [defaultMentorAdvice],
        blindSpot: safe(item?.blindSpot, defaultMentorBlindSpot)
      }))
    : fallback.mentorReports;

  // Local calculation fallback if DeepSeek returns invalid valuation values
  const rawMin = raw?.valuation?.estimatedValueMin;
  const rawMax = raw?.valuation?.estimatedValueMax;
  
  const base = (typeof raw?.score === 'number' ? raw.score : fallback.score) * 1000;
  const multiplier =
    1
    + normalizedMetrics.commercialValue / 100
    + normalizedMetrics.monetizationClarity / 150
    + normalizedMetrics.targetBuyerFit / 150
    + normalizedMetrics.growthLeverage / 200;
  
  let calculatedMin = Math.round((base * multiplier * 0.35) / 1000) * 1000;
  let calculatedMax = Math.round((base * multiplier * 1.15) / 1000) * 1000;
  
  // Apply clamping rules
  calculatedMin = Math.min(Math.max(calculatedMin, 5000), 150000);
  calculatedMax = Math.min(Math.max(calculatedMax, calculatedMin + 5000), 500000);

  const finalMin = typeof rawMin === 'number' ? Math.min(Math.max(rawMin, 5000), 150000) : calculatedMin;
  const finalMax = typeof rawMax === 'number' ? Math.min(Math.max(rawMax, finalMin + 5000), 500000) : calculatedMax;

  const defaultRationale = isZh 
    ? '根据项目的商业价值及多项增长指标综合计算所得的早期参考估值。'
    : 'Score-weighted early project valuation based on commercial metrics and growth levers.';
  const defaultDrivers = isZh
    ? ['清晰的变现路线', '明确的买家画像', '可复制的增长策略']
    : ['Clear monetization roadmap', 'Identified target buyer profile', 'Scalable growth channels'];

  const normalizedValuation = {
    estimatedValueMin: finalMin,
    estimatedValueMax: finalMax,
    currency: 'USD' as const,
    label: safe(raw?.valuation?.label, isZh ? '早期项目 AI 估算价值' : 'Early-stage AI estimated project value'),
    confidence: clampMetric(raw?.valuation?.confidence, 75),
    valuationMethod: safe(raw?.valuation?.valuationMethod, isZh ? '基于商业化潜力及执行难度的多维度权重估值算法。' : 'Multi-factor weighted valuation algorithm based on commercial potential and execution feasibility.'),
    rationale: safe(raw?.valuation?.rationale, defaultRationale),
    valueDrivers: Array.isArray(raw?.valuation?.valueDrivers) && raw.valuation.valueDrivers.length > 0 ? raw.valuation.valueDrivers : defaultDrivers,
    disclaimer: safe(raw?.valuation?.disclaimer, isZh ? '该估值为 IdeaPilot AI 商业评估模型生成的参考区间，不构成投资、融资、收购或财务建议。' : 'This valuation is an AI-generated reference range and does not constitute investment, fundraising, acquisition, or financial advice.')
  };

  const defaultInvestorLenses = [
    {
      investorId: 'sequoia',
      investorName: 'Sequoia Capital',
      lens: isZh ? '红杉资本投资哲学启发式视角' : 'Sequoia-style Market Depth Lens',
      score: 75,
      thesis: isZh ? '受红杉资本投资哲学启发：聚焦市场空间与护城河。' : 'Inspired by Sequoia Capital’s investment philosophy: Focus on market size and category creation.',
      whyItCouldBeValuable: isZh ? '开发者工具的迁移成本极高。' : 'High retention and switching costs in developer workflows.',
      whatWouldIncreaseValuation: isZh ? ['支持企业级席位管理', '提供可集成的 API'] : ['Introduce enterprise workspaces', 'Expose secure API endpoints'],
      confidenceBoost: isZh ? '极具价值的切入点，专注于解决核心痛点以扩充市场深度！' : 'A powerful entry point. Keep focusing on solving the core pain point to expand market depth!'
    },
    {
      investorId: 'a16z',
      investorName: 'Andreessen Horowitz',
      lens: isZh ? 'a16z 式产品叙事视角' : 'a16z-style Product Narrative Lens',
      score: 82,
      thesis: isZh ? '受 a16z 投资哲学启发：软件正在吞噬世界，AI 导师叙事充满想象力。' : 'Inspired by a16z’s investment philosophy: Software is eating the world; AI mentoring represents a massive leverage play.',
      whyItCouldBeValuable: isZh ? '自服务式咨询比人工服务拥有极高的毛利率与分发速度。' : 'Self-serve business diagnostic provides higher margins than human consultants.',
      whatWouldIncreaseValuation: isZh ? ['引入个性化定制导师 Prompt 预设', '提供社交裂变分享网络机制'] : ['Custom mentor board prompt profiles', 'Viral invite-to-earn integration'],
      confidenceBoost: isZh ? 'AI 重塑了独立开发者的生产力，你的叙事十分性感，继续放大产品的传播属性！' : 'Your product narrative is compelling and taps directly into the current AI wave. Expand its viral shareability!'
    },
    {
      investorId: 'ycombinator',
      investorName: 'Y Combinator',
      lens: isZh ? 'YC 式创始人速度视角' : 'YC-style Founder Velocity Lens',
      score: 85,
      thesis: isZh ? '受 YC 投资哲学启发：快速上线，极致的交付与验证体验。' : 'Inspired by YC’s investment philosophy: Launch fast, talk to users, and iterate rapidly.',
      whyItCouldBeValuable: isZh ? '直观的评估工具直接解决了开发者无法量化估算项目可行性的痛点。' : 'Direct utility solves the exact builder pain of objectively measuring product viability.',
      whatWouldIncreaseValuation: isZh ? ['每日根据反馈微更新', '支持一键发布至 Product Hunt'] : ['Ship incremental feedback loop updates daily', 'Integrate one-click Product Hunt launcher'],
      confidenceBoost: isZh ? 'YC 强调“做用户想要的东西”。交付速度令人振奋，请继续保持与用户的极速沟通！' : 'Make something people want. Your launch speed is impressive—continue listening to builders!'
    },
    {
      investorId: 'benchmark',
      investorName: 'Benchmark',
      lens: isZh ? 'Benchmark 式 SaaS 指标视角' : 'Benchmark-style SaaS Metrics Lens',
      score: 80,
      thesis: isZh ? '受 Benchmark 投资哲学启发：我们关注 SaaS 指标质量、高效率增长、定价权以及长期客户留存潜力。' : 'Inspired by Benchmark’s investment philosophy: We look for SaaS metrics quality, efficient growth, pricing power, and long-term customer retention potential.',
      whyItCouldBeValuable: isZh ? 'SaaS 工具极具粘性，且流失率低。' : 'SaaS utility is highly sticky with low churn potential.',
      whatWouldIncreaseValuation: isZh ? ['实施清晰的基于用量的阶梯定价', '追踪并优化净收入留存率 (NRR)'] : ['Implement clear usage-based tiered pricing', 'Track and optimize net revenue retention (NRR)'],
      confidenceBoost: isZh ? '专注于高资本效率增长，卓越的 SaaS 留存指标是长期高估值最好的护城河！' : 'Focus on efficient capital growth. Benchmark SaaS metrics loops will reward high product quality and organic adoption!'
    },
    {
      investorId: 'accel',
      investorName: 'Accel',
      lens: isZh ? 'Accel 式增长进入市场视角' : 'Accel-style Go-to-Market Lens',
      score: 78,
      thesis: isZh ? '受 Accel 投资哲学启发：我们专注于进入市场 (GTM) 执行力、可重复的获客渠道、扩张速度以及战略市场时机。' : 'Inspired by Accel’s investment philosophy: We focus on go-to-market execution, repeatable acquisition channels, expansion velocity, and strategic market timing.',
      whyItCouldBeValuable: isZh ? '直接降低了独立开发者在获客链路上的摩擦。' : 'Solves a direct acquisition friction for indie builders.',
      whatWouldIncreaseValuation: isZh ? ['建立自动化的 SEO 目录提交循环', '与创业孵化平台合作进行批量授权'] : ['Establish automated seo directory submissions loops', 'Partner with startup incubator platforms for bulk licensing'],
      confidenceBoost: isZh ? '时机与执行力决定成败。加速你的 GTM 动作，以快速占领此细分市场！' : 'Timing and execution are everything. Accelerate your go-to-market motion to dominate this niche!'
    }
  ];

  const allowedIds = ['sequoia', 'a16z', 'ycombinator', 'benchmark', 'accel'];

  const normalizedInvestorLensReports = allowedIds.map(id => {
    const defaultMatch = defaultInvestorLenses.find(d => d.investorId === id)!;
    
    const rawReport = Array.isArray(raw?.investorLensReports)
      ? raw.investorLensReports.find((item: any) => item?.investorId === id)
      : null;

    if (!rawReport) {
      return defaultMatch;
    }

    return {
      investorId: id,
      investorName: defaultMatch.investorName,
      lens: defaultMatch.lens,
      score: clampMetric(rawReport?.score, defaultMatch.score),
      thesis: safe(rawReport?.thesis, defaultMatch.thesis),
      whyItCouldBeValuable: safe(rawReport?.whyItCouldBeValuable, defaultMatch.whyItCouldBeValuable),
      whatWouldIncreaseValuation: Array.isArray(rawReport?.whatWouldIncreaseValuation) && rawReport.whatWouldIncreaseValuation.length > 0 
        ? rawReport.whatWouldIncreaseValuation 
        : defaultMatch.whatWouldIncreaseValuation,
      confidenceBoost: safe(rawReport?.confidenceBoost, defaultMatch.confidenceBoost)
    };
  });

  const normalizedActionPlan = {
    next24Hours: Array.isArray(raw?.actionPlan?.next24Hours) ? raw.actionPlan.next24Hours : fallback.actionPlan.next24Hours,
    next7Days: Array.isArray(raw?.actionPlan?.next7Days) ? raw.actionPlan.next7Days : fallback.actionPlan.next7Days,
    next30Days: Array.isArray(raw?.actionPlan?.next30Days) ? raw.actionPlan.next30Days : fallback.actionPlan.next30Days,
    next90Days: Array.isArray(raw?.actionPlan?.next90Days) ? raw.actionPlan.next90Days : fallback.actionPlan.next90Days
  };

  const normalizedRiskWarnings = Array.isArray(raw?.riskWarnings)
    ? raw.riskWarnings.map((item: any) => ({
        risk: safe(item?.risk, defaultRiskName),
        severity: safe(item?.severity, 'medium'),
        fix: safe(item?.fix, defaultRiskFix)
      }))
    : fallback.riskWarnings;

  return {
    projectName: safe(raw?.projectName, projectName),
    url: url,
    score: typeof raw?.score === 'number' ? Math.min(Math.max(raw.score, 0), 100) : fallback.score,
    grade: safe(raw?.grade, fallback.grade) as 'S' | 'A' | 'B' | 'C' | 'D',
    language: language,
    summary: normalizedSummary,
    metrics: normalizedMetrics,
    moneyPaths: normalizedMoneyPaths,
    targetBuyers: normalizedTargetBuyers,
    advantageMap: normalizedAdvantageMap,
    growthLevers: normalizedGrowthLevers,
    mentorReports: normalizedMentorReports,
    valuation: normalizedValuation,
    investorLensReports: normalizedInvestorLensReports,
    actionPlan: normalizedActionPlan,
    riskWarnings: normalizedRiskWarnings
  };
}

export async function generateIPValueReport(
  url: string,
  projectName: string,
  projectType: string,
  audience: string,
  details: string,
  analysisMode: 'quick_scan' | 'single_mentor' | 'mentor_board',
  selectedMentors: string[],
  env: Env,
  language: 'en' | 'zh-CN' = 'en'
): Promise<BusinessAuditResult> {
  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const apiKey = env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn('DEEPSEEK_API_KEY is not defined. Falling back to local heuristics generator.');
    return generateFallbackReport(url, projectName, analysisMode, selectedMentors, language);
  }

  // Define mentor profile mapping
  const mentorGlossary: Record<string, { name: string; lens: string; focus: string }> = {
    elon_musk: { name: 'Elon Musk', lens: 'Musk-style Scale Lens', focus: '10x scaling potential, deep technical automation leverage, and long-term mission strength.' },
    larry_ellison: { name: 'Larry Ellison', lens: 'Ellison-style Enterprise Lens', focus: 'Enterprise readiness, raw corporate pricing power, sales narrative locks, and account expansion.' },
    mark_zuckerberg: { name: 'Mark Zuckerberg', lens: 'Zuckerberg-style Growth Lens', focus: 'Viral loop mechanics, user sharing incentives, retention, and network effects.' },
    steve_jobs: { name: 'Steve Jobs', lens: 'Jobs-style Positioning Lens', focus: 'Positioning clarity, product soul, simplicity, and category sharpness.' },
    jeff_bezos: { name: 'Jeff Bezos', lens: 'Bezos-style Flywheel Lens', focus: 'Customer obsession, data flywheels, long-term moats, and operational cost curves.' },
    naval_ravikant: { name: 'Naval Ravikant', lens: 'Naval-style Solo Leverage Lens', focus: 'Solo founder product fit, code leverage, content leverage, and asymmetric upside.' }
  };

  // Determine which mentors to ask DeepSeek to generate assessments for
  let mentorsToScan = selectedMentors.length > 0 ? selectedMentors : ['elon_musk', 'steve_jobs', 'naval_ravikant'];
  if (analysisMode === 'quick_scan') {
    mentorsToScan = ['naval_ravikant']; // quick scan uses solo mentor lens to preserve tokens
  } else if (analysisMode === 'single_mentor') {
    mentorsToScan = selectedMentors.length > 0 ? [selectedMentors[0]] : ['steve_jobs'];
  }

  const mentorsFocusText = mentorsToScan.map(m => {
    const prof = mentorGlossary[m] || { name: m, lens: `${m}-style Lens`, focus: 'General business evaluation.' };
    return `- Mentor ID: "${m}", Name: "${prof.name}", Lens: "${prof.lens}", Focus area: "${prof.focus}"`;
  }).join('\n');

  const systemInstruction = `You are the IdeaPilot AI Startup Business Mentor Engine.
Conduct a high-fidelity diagnostic audit of digital products, startups, and websites to assess their monetization and commercial potential.
You must return your response in a valid JSON object matching the requested schema. Avoid markdown code block wraps inside the JSON response.
Do not refer to the mentors as if real people reviewed it. Write as: "Inspired by [Name]'s business philosophy" and "[Name]-style [Lens]".`;

  const userPrompt = `Evaluate this product website:
URL: ${url}
Estimated Project Name: ${projectName}
Project Type: ${projectType || 'SaaS'}
Target Audience: ${audience || 'General builders'}
Provided Mission: ${details || 'None'}
Analysis Mode: ${analysisMode}

Assess the project across these 7 metrics:
1. commercialValue
2. painkillerIndex
3. monetizationClarity
4. targetBuyerFit
5. advantageAmplification
6. growthLeverage
7. executionFeasibility

Evaluate under the following mentor viewpoints:
${mentorsFocusText}

Return a JSON object conforming exactly to this structure:
{
  "projectName": "${projectName}",
  "score": 82, // Business Value Score (65-95)
  "grade": "A", // S, A, B, C, D depending on score
  "summary": {
    "oneSentenceDiagnosis": "One sentence summary",
    "biggestOpportunity": "Description of biggest commercial opportunity",
    "biggestWeakness": "Description of biggest structural risk/weakness",
    "recommendedPositioning": "How to position the product in marketing"
  },
  "metrics": {
    "commercialValue": 80,
    "painkillerIndex": 75,
    "monetizationClarity": 70,
    "targetBuyerFit": 85,
    "advantageAmplification": 65,
    "growthLeverage": 60,
    "executionFeasibility": 90
  },
  "moneyPaths": [
    {
      "name": "Subscription Plan",
      "model": "subscription", // must be subscription, one_time, agency, api, marketplace, enterprise, ads, affiliate, data, or community
      "whyItFits": "Reason why this fits",
      "suggestedPriceOrValueExchange": "Recommended pricing structure",
      "firstExperiment": "How to test this model with minimal effort"
    }
  ],
  "targetBuyers": [
    {
      "segment": "Target segment name",
      "willingnessToPay": 80, // 50-100 rating
      "whyTheyBuy": "What triggers their purchase behavior",
      "bestOffer": "Pricing bundle tailored to them"
    }
  ],
  "advantageMap": {
    "strongestAsset": "Description of current strongest asset",
    "hiddenAsset": "Underutilized asset that could be leveraged",
    "moatPotential": "How to build a long-term defensible moat",
    "howToAmplify": ["Action item 1", "Action item 2"]
  },
  "growthLevers": [
    {
      "lever": "Growth Lever name",
      "channel": "Distribution channel name",
      "whyItWorks": "Reason why it works",
      "firstAction": "Direct first step to execute"
    }
  ],
  "mentorReports": [
    {
      "mentorId": "elon_musk", // must match one of the Mentor IDs listed above
      "mentorName": "Elon Musk",
      "lens": "Musk-style Scale Lens",
      "score": 75,
      "verdict": "Overall perspective from this lens style",
      "keyAdvice": ["Advice 1", "Advice 2"],
      "blindSpot": "Blind spot warning"
    }
  ],
  "valuation": {
    "estimatedValueMin": 18000,
    "estimatedValueMax": 65000,
    "currency": "USD",
    "label": "Early-stage AI estimated project value",
    "confidence": 72,
    "valuationMethod": "Score-weighted early project valuation based on commercial value, monetization clarity, buyer fit, and growth leverage.",
    "rationale": "Why this valuation range makes sense.",
    "valueDrivers": ["driver 1", "driver 2", "driver 3"],
    "disclaimer": "This valuation is an AI-generated reference range and does not constitute investment, fundraising, acquisition, or financial advice."
  },
  "investorLensReports": [
    {
      "investorId": "sequoia", // must return all 5 in the list: sequoia, a16z, ycombinator, benchmark, accel
      "investorName": "Sequoia Capital",
      "lens": "Sequoia-style Market Depth Lens",
      "score": 78,
      "thesis": "Inspired by Sequoia Capital's investment philosophy, our investment thesis focuses on...",
      "whyItCouldBeValuable": "Why this project might become valuable.",
      "whatWouldIncreaseValuation": ["Action 1", "Action 2"],
      "confidenceBoost": "Encouraging but grounded message for the developer."
    },
    {
      "investorId": "a16z",
      "investorName": "Andreessen Horowitz",
      "lens": "a16z-style Product Narrative Lens",
      "score": 82,
      "thesis": "Inspired by Andreessen Horowitz's investment philosophy...",
      "whyItCouldBeValuable": "Why this project might become valuable.",
      "whatWouldIncreaseValuation": ["Action 1", "Action 2"],
      "confidenceBoost": "Encouraging but grounded message for the developer."
    },
    {
      "investorId": "ycombinator",
      "investorName": "Y Combinator",
      "lens": "YC-style Founder Velocity Lens",
      "score": 85,
      "thesis": "Inspired by Y Combinator's investment philosophy...",
      "whyItCouldBeValuable": "Why this project might become valuable.",
      "whatWouldIncreaseValuation": ["Action 1", "Action 2"],
      "confidenceBoost": "Encouraging but grounded message for the developer."
    },
    {
      "investorId": "benchmark",
      "investorName": "Benchmark",
      "lens": "Benchmark-style SaaS Metrics Lens",
      "score": 80,
      "thesis": "Inspired by Benchmark's investment philosophy...",
      "whyItCouldBeValuable": "Why this SaaS project might become valuable.",
      "whatWouldIncreaseValuation": ["Action 1", "Action 2"],
      "confidenceBoost": "Encouraging but grounded message for the developer."
    },
    {
      "investorId": "accel",
      "investorName": "Accel",
      "lens: "Accel-style Go-to-Market Lens",
      "score": 78,
      "thesis": "Inspired by Accel's investment philosophy...",
      "whyItCouldBeValuable": "Why this project timing is strategic.",
      "whatWouldIncreaseValuation": ["Action 1", "Action 2"],
      "confidenceBoost": "Encouraging but grounded message for the developer."
    }
  ],
  "actionPlan": {
    "next24Hours": ["Step 1", "Step 2"],
    "next7Days": ["Step 1", "Step 2"],
    "next30Days": ["Step 1"],
    "next90Days": ["Step 1"]
  },
  "riskWarnings": [
    {
      "risk": "Risk description",
      "severity": "high", // low, medium, or high
      "fix": "Actionable way to fix or mitigate this risk"
    }
  ]
}

Output Language Rule:
- If the language requested is "zh-CN", all human-readable string values in the JSON must be written in Simplified Chinese.
- If the language requested is "en", all human-readable string values in the JSON must be written in English.
- JSON keys must always remain in English.
- Do not translate enum values such as subscription, one_time, agency, api, marketplace, enterprise, ads, affiliate, data, community.
- Do not translate mentorId, investorId.
- Do not force-translate projectName, URLs, product names, brand names, or technical names.
- Mentor names and Investor names may remain in English, but explanations, thesis, rationale, verdicts, advice, risks, summaries, money paths, target buyer descriptions, action plans, and warnings must follow the selected language.
- Under investorLensReports, thesis must start with: "Inspired by [Investor Name]'s investment philosophy" or "受 [中文译名] 投资哲学启发：".

Requested Output Language: ${language}`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API returned error status ${response.status}: ${errorText}`);
      return generateFallbackReport(url, projectName, analysisMode, selectedMentors, language);
    }

    const responseData: any = await response.json();
    const content = responseData?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('DeepSeek returned empty content.');
      return generateFallbackReport(url, projectName, analysisMode, selectedMentors, language);
    }

    const parsed = JSON.parse(content.trim());
    
    // Normalize and validate response data
    return normalizeBusinessAuditResult(parsed, url, projectName, analysisMode, selectedMentors, language);
  } catch (err: any) {
    console.error('Failed to generate business audit report from DeepSeek:', err);
    return generateFallbackReport(url, projectName, analysisMode, selectedMentors, language);
  }
}
