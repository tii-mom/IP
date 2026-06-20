import { Env } from '../types';
import { verifyTurnstile } from './turnstile';
import { generateIPValueReport } from './deepseek';
import { getCorsHeaders } from './cors';

export async function handleAnalyzeRoute(request: Request, env: Env): Promise<Response> {
  const corsHeaders = getCorsHeaders(request, env);

  try {
    const body: any = await request.json();
    const { url, projectType, audience, details, turnstileToken } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: 'Project landing page URL is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify Cloudflare Turnstile token
    const verifyResult = await verifyTurnstile(turnstileToken, request, env);
    if (!verifyResult.success) {
      return new Response(JSON.stringify({ error: verifyResult.error || 'Turnstile verification failed.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Clean up domain name from URL to estimate a project name
    let projectName = 'My App';
    try {
      const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
      projectName = cleanUrl.split('.')[0];
      projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);
    } catch {
      projectName = 'My App';
    }

    // Call DeepSeek audit completion generator
    const report = await generateIPValueReport(url, projectName, projectType, audience, details, env);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('API Error in handleAnalyzeRoute:', err);
    return new Response(JSON.stringify({ error: `Internal Server Error: ${err.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
