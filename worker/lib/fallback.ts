import { BusinessAuditResult } from '../types';

export function generateFallbackReport(url: string, projectName: string): BusinessAuditResult {
  const finalScore = 78;
  return {
    projectName: projectName,
    url: url,
    score: finalScore,
    grade: 'B',
    summary: {
      oneSentenceDiagnosis: `A utility-first builder tool for ${projectName} with strong technical leverage but missing enterprise sales positioning.`,
      biggestOpportunity: 'Package raw APIs into a B2B enterprise plan targeting developer studios.',
      biggestWeakness: 'High dependency on single developer resources and lack of organic virality loops.',
      recommendedPositioning: 'The zero-config deployment accelerator for high-velocity teams.'
    },
    metrics: {
      commercialValue: 80,
      painkillerIndex: 75,
      monetizationClarity: 70,
      targetBuyerFit: 85,
      advantageAmplification: 65,
      growthLeverage: 60,
      executionFeasibility: 90
    },
    moneyPaths: [
      {
        name: 'Developer Pro Tier',
        model: 'subscription',
        whyItFits: 'Developers are willing to pay for time saved and increased productivity limits.',
        suggestedPriceOrValueExchange: '$29/month flat',
        firstExperiment: 'Lock custom domain integration and premium API access logs.'
      },
      {
        name: 'Custom Team Setup',
        model: 'enterprise',
        whyItFits: 'Allows dev teams to integrate private servers with custom security controls.',
        suggestedPriceOrValueExchange: 'From $149/month',
        firstExperiment: 'Add a "Contact Sales" callout trigger card in the pricing panel.'
      }
    ],
    targetBuyers: [
      {
        segment: 'Solo Indie Hackers',
        willingnessToPay: 65,
        whyTheyBuy: 'Need quick validation metrics and instant PDF reports for social sharing.',
        bestOffer: 'Starter Tier ($19/mo) with standard access permissions.'
      },
      {
        segment: 'SaaS Agency Founders',
        willingnessToPay: 85,
        whyTheyBuy: 'Require high-volume scans to optimize client conversion funnels and validate pricing tiers.',
        bestOffer: 'Agency Studio Bundle ($79/mo) with unlimited scans.'
      }
    ],
    advantageMap: {
      strongestAsset: 'Excellent automated execution speed and high-fidelity heuristic suggestions.',
      hiddenAsset: 'Structured JSON exporter ready for automated database webhooks integration.',
      moatPotential: 'Dynamic scoring certificate network acting as organic viral acquisition loops.',
      howToAmplify: [
        'Place the verification certificate badge prominently on the user dashboard.',
        'Encourage users to tweet their value certificate output to trigger growth bonuses.'
      ]
    },
    growthLevers: [
      {
        lever: 'Build-in-Public Social Loops',
        channel: 'X / Twitter',
        whyItWorks: 'Founders love showing off validation scores and verification badges.',
        firstAction: 'Provide an instant one-click Share button prefilled with the certificate seal link.'
      },
      {
        lever: 'Side-project Marketing Directory',
        channel: 'Directory Listings',
        whyItWorks: 'Free submissions generate valuable backlinks and direct organic SEO index rankings.',
        firstAction: 'Submit the top-voted product audit pages to web search engine crawlers.'
      }
    ],
    mentorReports: [
      {
        mentorId: 'elon_musk',
        mentorName: 'Elon Musk',
        lens: 'Musk-style Scale Lens',
        score: 75,
        verdict: 'Good utility, but lacks massive system leverage to command broad market share.',
        keyAdvice: [
          'Automate the HTML extraction scraper to crawl thousands of sites concurrently.',
          'Open API hooks to build an ecosystem rather than a standalone dashboard.'
        ],
        blindSpot: 'Requires heavy upfront cloud infrastructure configuration.'
      },
      {
        mentorId: 'steve_jobs',
        mentorName: 'Steve Jobs',
        lens: 'Jobs-style Positioning Lens',
        score: 82,
        verdict: 'Clear layout value, but value proposition copy could be vastly simplified.',
        keyAdvice: [
          'Strip non-essential details from the dashboard to elevate focus on the score.',
          'Position the seal certificate as an emotional badge of honor.'
        ],
        blindSpot: 'Tends to overlook the raw engineering workflow requirements of developers.'
      },
      {
        mentorId: 'naval_ravikant',
        mentorName: 'Naval Ravikant',
        lens: 'Naval-style Solo Leverage Lens',
        score: 90,
        verdict: 'Excellent product for a solo developer utilizing code and content leverage.',
        keyAdvice: [
          'Keep running costs minimal by hosting backend functions exclusively on Cloudflare Workers.',
          'Let product quality drive word-of-mouth adoption without paid sales staff.'
        ],
        blindSpot: 'Vulnerable to sudden changes in upstream LLM api billing models.'
      }
    ],
    actionPlan: {
      next24Hours: [
        'Switch backend model prompts to focus strictly on commercial diagnostic vectors.',
        'Remove Visual Hotspot elements from UI view state configurations.'
      ],
      next7Days: [
        'Deploy the local localStorage Pilot Credits engine in the frontend SPA.',
        'Hook up Earn Credits growth panel checks.'
      ],
      next30Days: [
        'Launch public mentor boards with selected business leader opinions.',
        'Introduce direct verification certificate image sharing intents.'
      ],
      next90Days: [
        'Evaluate integration of D1 SQL database schemas for global invite leaderboards.',
        'Scale API query endpoints to process batch requests from external apps.'
      ]
    },
    riskWarnings: [
      {
        risk: 'High dependency on upstream AI response stability.',
        severity: 'high',
        fix: 'Implement robust fallback JSON report triggers in the API middleware.'
      },
      {
        risk: 'Indie builders bypassing Turnstile validation endpoints.',
        severity: 'medium',
        fix: 'Activate Cloudflare Web Application Firewall (WAF) managed rulesets.'
      }
    ]
  };
}
