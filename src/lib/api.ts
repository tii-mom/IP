import { BusinessAuditResult, AnalyzeRequest } from '../types/audit';

export async function analyzeWebsite(params: AnalyzeRequest): Promise<BusinessAuditResult> {
  const apiBaseUrl = (import.meta as any).env.VITE_API_BASE_URL || '';
  
  const response = await fetch(`${apiBaseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: params.url,
      projectType: params.projectType,
      audience: params.audience,
      details: params.details,
      analysisMode: params.analysisMode,
      selectedMentors: params.selectedMentors,
      turnstileToken: params.turnstileToken || '1x00000000000000000000AA', // test key fallback
      language: params.language
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Our co-pilot server encountered an auditing error. Please try again.');
  }

  return response.json();
}

