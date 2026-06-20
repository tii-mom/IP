export interface MetricState {
  willingnessToPay: number;
  pricingStructure: number;
  landingPageConversion: number;
  growthLoops: number;
}

export interface Hotspot {
  id: number;
  category: 'copywriting' | 'pricing' | 'trust' | 'conversion';
  elementName: string;
  currentText: string;
  aiPrescription: string;
  severity: 'critical' | 'warning' | 'optimization';
  x: number;
  y: number;
  isFixed?: boolean;
}

export interface MonetizationTier {
  tierName: string;
  price: string;
  willingnessFeedback: string;
  features: string[];
  psychologyMetric: string;
}

export interface RoadmapItem {
  day: number;
  task: string;
  expectedResult: string;
}

export interface AuditResult {
  projectName: string;
  score: number;
  grade: string;
  metrics: MetricState;
  hotspots: Hotspot[];
  monetizationTiers: MonetizationTier[];
  roadmap: RoadmapItem[];
}
