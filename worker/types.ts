export interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_MODEL: string;
  DEEPSEEK_BASE_URL: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGINS: string;
  APP_ENV: string;
  SITE_URL: string;
  API_BASE_URL: string;
}

export interface AnalyzeRequest {
  url: string;
  projectType: string;
  audience: string;
  details: string;
  analysisMode: 'quick_scan' | 'single_mentor' | 'mentor_board';
  selectedMentors: string[];
  turnstileToken?: string;
  language?: 'en' | 'zh-CN';
}

export interface BusinessMetrics {
  commercialValue: number;
  painkillerIndex: number;
  monetizationClarity: number;
  targetBuyerFit: number;
  advantageAmplification: number;
  growthLeverage: number;
  executionFeasibility: number;
}

export interface MoneyPath {
  name: string;
  model: 'subscription' | 'one_time' | 'agency' | 'api' | 'marketplace' | 'enterprise' | 'ads' | 'affiliate' | 'data' | 'community';
  whyItFits: string;
  suggestedPriceOrValueExchange: string;
  firstExperiment: string;
}

export interface TargetBuyer {
  segment: string;
  willingnessToPay: number;
  whyTheyBuy: string;
  bestOffer: string;
}

export interface AdvantageMap {
  strongestAsset: string;
  hiddenAsset: string;
  moatPotential: string;
  howToAmplify: string[];
}

export interface GrowthLever {
  lever: string;
  channel: string;
  whyItWorks: string;
  firstAction: string;
}

export interface MentorReport {
  mentorId: string;
  mentorName: string;
  lens: string;
  score: number;
  verdict: string;
  keyAdvice: string[];
  blindSpot: string;
}

export interface RiskWarning {
  risk: string;
  severity: 'low' | 'medium' | 'high';
  fix: string;
}

export interface BusinessAuditResult {
  projectName: string;
  url: string;
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  language?: 'en' | 'zh-CN';
  summary: {
    oneSentenceDiagnosis: string;
    biggestOpportunity: string;
    biggestWeakness: string;
    recommendedPositioning: string;
  };
  metrics: BusinessMetrics;
  moneyPaths: MoneyPath[];
  targetBuyers: TargetBuyer[];
  advantageMap: AdvantageMap;
  growthLevers: GrowthLever[];
  mentorReports: MentorReport[];
  actionPlan: {
    next24Hours: string[];
    next7Days: string[];
    next30Days: string[];
    next90Days: string[];
  };
  riskWarnings: RiskWarning[];
}

// Transactions definitions for localStorage / future D1
export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'daily_checkin' | 'share' | 'invite' | 'feedback' | 'publish' | 'spend' | 'refund';
  description: string;
  timestamp: string;
}

export interface CreditState {
  balance: number;
  date: string;
  completedTasks: Record<string, string>;
  inviteCode: string;
  transactions: CreditTransaction[];
}
