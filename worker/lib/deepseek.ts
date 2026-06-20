import { Env, AuditResult } from '../types';
import { generateFallbackReport } from './fallback';

export async function generateIPValueReport(
  url: string,
  projectName: string,
  projectType: string,
  audience: string,
  details: string,
  env: Env
): Promise<AuditResult> {
  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const apiKey = env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn('DEEPSEEK_API_KEY is not defined. Falling back to local heuristics generator.');
    return generateFallbackReport(url, projectName);
  }

  const systemInstruction = `You are the IdeaPilot AI Commercialization Audit Engine.
Develop high-fidelity diagnostics, design presets, and monetization audits for digital product landing pages.
You must return your response in a valid JSON object matching the requested schema. Avoid markdown fences inside the JSON.
Do not return empty strings or placeholder values.`;

  const userPrompt = `Audit the following project website:
URL: ${url}
Estimated Project Name: ${projectName}
Project Type: ${projectType || 'SaaS'}
Target Audience: ${audience || 'General public'}
Provided Details/Mission: ${details || 'None'}

Generate real landing page metrics, conversion hotspots, tiered pricing guides, and a 3-step launch roadmap.

Return a JSON object conforming exactly to this structure:
{
  "projectName": "The cleaned up project name",
  "score": 85, // Overall score (65-95)
  "grade": "A", // "S", "A", "B", "C", "D" depending on score
  "metrics": {
    "willingnessToPay": 80, // rating (50-100)
    "pricingStructure": 75, // rating (50-100)
    "landingPageConversion": 70, // rating (50-100)
    "growthLoops": 65 // rating (50-100)
  },
  "hotspots": [
    {
      "id": 1,
      "category": "copywriting", // must be "copywriting", "pricing", "trust", or "conversion"
      "elementName": "Headline positioning",
      "currentText": "Current landing text",
      "aiPrescription": "Prescription details explaining what to change and WHY",
      "severity": "critical", // "critical", "warning", or "optimization"
      "x": 50, // horizontal percent position on mockup (10 to 90)
      "y": 20 // vertical percent position on mockup (10 to 90)
    }
  ],
  "monetizationTiers": [
    {
      "tierName": "Starter",
      "price": "$19/mo",
      "willingnessFeedback": "Why this price fits",
      "features": ["Feature 1", "Feature 2"],
      "psychologyMetric": "Anchoring Element"
    }
  ],
  "roadmap": [
    {
      "day": 1,
      "task": "Task explanation",
      "expectedResult": "Upside expected"
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
      console.error('DeepSeek returned empty message content.');
      return generateFallbackReport(url, projectName);
    }

    const auditResult: AuditResult = JSON.parse(content.trim());
    
    // Simple verification to ensure critical fields exist
    if (
      !auditResult.projectName ||
      typeof auditResult.score !== 'number' ||
      !auditResult.metrics ||
      !Array.isArray(auditResult.hotspots) ||
      !Array.isArray(auditResult.monetizationTiers) ||
      !Array.isArray(auditResult.roadmap)
    ) {
      throw new Error('Parsed DeepSeek result failed schema validation.');
    }

    return auditResult;
  } catch (err: any) {
    console.error('Failed to generate report from DeepSeek:', err);
    return generateFallbackReport(url, projectName);
  }
}
