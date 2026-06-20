import { Env } from './types';
import { handleOptions, getCorsHeaders } from './lib/cors';
import { handleAnalyzeRoute } from './lib/analyze';

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url);

    // Preflight request handling
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    // Health check endpoint
    if (url.pathname === '/healthz') {
      return new Response(JSON.stringify({ status: 'healthy', env: env.APP_ENV || 'production' }), {
        status: 200,
        headers: {
          ...getCorsHeaders(request, env),
          'Content-Type': 'application/json'
        }
      });
    }

    // API analysis endpoint
    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      return handleAnalyzeRoute(request, env);
    }

    // Route not found
    return new Response(JSON.stringify({ error: `Not Found: ${url.pathname}` }), {
      status: 404,
      headers: {
        ...getCorsHeaders(request, env),
        'Content-Type': 'application/json'
      }
    });
  }
};
