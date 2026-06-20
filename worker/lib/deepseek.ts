import { Env, BusinessAuditResult } from '../types';
import { generateFallbackReport } from './fallback';

export function validateBusinessAuditResult(report: any): boolean {
  if (!report || typeof report !== 'object') return false;
  
  // Basic validation of critical top-level structures
  const requiredKeys = ['projectName', 'score', 'grade', 'summary', 'metrics', 'moneyPaths', 'targetBuyers', 'advantageMap', 'growthLevers', 'mentorReports', 'actionPlan', 'riskWarnings'];
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
  selectedMentors?: string[]
): BusinessAuditResult {
  const fallback = generateFallbackReport(url, projectName, analysisMode, selectedMentors);

  const safe = (val: any, def: any) => (val !== undefined && val !== null ? val : def);

  const normalizedSummary = {
    oneSentenceDiagnosis: safe(raw?.summary?.oneSentenceDiagnosis, fallback.summary.oneSentenceDiagnosis),
    biggestOpportunity: safe(raw?.summary?.biggestOpportunity, fallback.summary.biggestOpportunity),
    biggestWeakness: safe(raw?.summary?.biggestWeakness, fallback.summary.biggestWeakness),
    recommendedPositioning: safe(raw?.summary?.recommendedPositioning, fallback.summary.recommendedPositioning)
  };

  const normalizedMetrics = {
    commercialValue: typeof raw?.metrics?.commercialValue === 'number' ? raw.metrics.commercialValue : fallback.metrics.commercialValue,
    painkillerIndex: typeof raw?.metrics?.painkillerIndex === 'number' ? raw.metrics.painkillerIndex : fallback.metrics.painkillerIndex,
    monetizationClarity: typeof raw?.metrics?.monetizationClarity === 'number' ? raw.metrics.monetizationClarity : fallback.metrics.monetizationClarity,
    targetBuyerFit: typeof raw?.metrics?.targetBuyerFit === 'number' ? raw.metrics.targetBuyerFit : fallback.metrics.targetBuyerFit,
    advantageAmplification: typeof raw?.metrics?.advantageAmplification === 'number' ? raw.metrics.advantageAmplification : fallback.metrics.advantageAmplification,
    growthLeverage: typeof raw?.metrics?.growthLeverage === 'number' ? raw.metrics.growthLeverage : fallback.metrics.growthLeverage,
    executionFeasibility: typeof raw?.metrics?.executionFeasibility === 'number' ? raw.metrics.executionFeasibility : fallback.metrics.executionFeasibility
  };

  const normalizedMoneyPaths = Array.isArray(raw?.moneyPaths) 
    ? raw.moneyPaths.map((item: any) => ({
        name: safe(item?.name, 'Monetization Route'),
        model: safe(item?.model, 'subscription'),
        whyItFits: safe(item?.whyItFits, 'Matches standard project monetization profiles.'),
        suggestedPriceOrValueExchange: safe(item?.suggestedPriceOrValueExchange, 'Custom value-exchange pricing'),
        firstExperiment: safe(item?.firstExperiment, 'Define a target landing page callout trigger.')
      }))
    : fallback.moneyPaths;

  const normalizedTargetBuyers = Array.isArray(raw?.targetBuyers)
    ? raw.targetBuyers.map((item: any) => ({
        segment: safe(item?.segment, 'General Users'),
        willingnessToPay: typeof item?.willingnessToPay === 'number' ? item.willingnessToPay : 70,
        whyTheyBuy: safe(item?.whyTheyBuy, 'They require efficiency solutions.'),
        bestOffer: safe(item?.bestOffer, 'Basic tier pricing.')
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
        lever: safe(item?.lever, 'Viral Hook'),
        channel: safe(item?.channel, 'Social media channels'),
        whyItWorks: safe(item?.whyItWorks, 'Low barrier to sharing.'),
        firstAction: safe(item?.firstAction, 'Add visual sharing widgets.')
      }))
    : fallback.growthLevers;

  const normalizedMentorReports = Array.isArray(raw?.mentorReports)
    ? raw.mentorReports.map((item: any) => ({
        mentorId: safe(item?.mentorId, 'general_mentor'),
        mentorName: safe(item?.mentorName, 'Business Mentor'),
        lens: safe(item?.lens, 'General business evaluation lens'),
        score: typeof item?.score === 'number' ? item.score : 80,
        verdict: safe(item?.verdict, 'Satisfactory product design with room for growth.'),
        keyAdvice: Array.isArray(item?.keyAdvice) ? item.keyAdvice : ['Validate user engagement metrics early.'],
        blindSpot: safe(item?.blindSpot, 'Vulnerable to localized market saturation.')
      }))
    : fallback.mentorReports;

  const normalizedActionPlan = {
    next24Hours: Array.isArray(raw?.actionPlan?.next24Hours) ? raw.actionPlan.next24Hours : fallback.actionPlan.next24Hours,
    next7Days: Array.isArray(raw?.actionPlan?.next7Days) ? raw.actionPlan.next7Days : fallback.actionPlan.next7Days,
    next30Days: Array.isArray(raw?.actionPlan?.next30Days) ? raw.actionPlan.next30Days : fallback.actionPlan.next30Days,
    next90Days: Array.isArray(raw?.actionPlan?.next90Days) ? raw.actionPlan.next90Days : fallback.actionPlan.next90Days
  };

  const normalizedRiskWarnings = Array.isArray(raw?.riskWarnings)
    ? raw.riskWarnings.map((item: any) => ({
        risk: safe(item?.risk, 'Unforeseen engineering overheads.'),
        severity: safe(item?.severity, 'medium'),
        fix: safe(item?.fix, 'Introduce decoupled testing pipelines early.')
      }))
    : fallback.riskWarnings;

  return {
    projectName: safe(raw?.projectName, projectName),
    url: url,
    score: typeof raw?.score === 'number' ? raw.score : fallback.score,
    grade: safe(raw?.grade, fallback.grade) as 'S' | 'A' | 'B' | 'C' | 'D',
    summary: normalizedSummary,
    metrics: normalizedMetrics,
    moneyPaths: normalizedMoneyPaths,
    targetBuyers: normalizedTargetBuyers,
    advantageMap: normalizedAdvantageMap,
    growthLevers: normalizedGrowthLevers,
    mentorReports: normalizedMentorReports,
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
  env: Env
): Promise<BusinessAuditResult> {
  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const apiKey = env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn('DEEPSEEK_API_KEY is not defined. Falling back to local heuristics generator.');
    return generateFallbackReport(url, projectName, analysisMode, selectedMentors);
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
}`;

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
      return generateFallbackReport(url, projectName);
    }

    const responseData: any = await response.json();
    const content = responseData?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('DeepSeek returned empty content.');
      return generateFallbackReport(url, projectName, analysisMode, selectedMentors);
    }

    const parsed = JSON.parse(content.trim());
    
    // Normalize and validate response data
    return normalizeBusinessAuditResult(parsed, url, projectName, analysisMode, selectedMentors);
  } catch (err: any) {
    console.error('Failed to generate business audit report from DeepSeek:', err);
    return generateFallbackReport(url, projectName, analysisMode, selectedMentors);
  }
}
