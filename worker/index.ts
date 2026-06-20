import { Env } from './types';
import { handleOptions, getCorsHeaders } from './lib/cors';
import { handleAnalyzeRoute } from './lib/analyze';

// In-memory rate limiting map
const ipRateLimits = new Map<string, { count: number; expiresAt: number }>();

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
      // In-memory rate limiter check
      const clientIp = request.headers.get('CF-Connecting-IP') || 'anonymous';
      const rateLimitKey = `${clientIp}:${url.pathname}`;
      const now = Date.now();
      
      const record = ipRateLimits.get(rateLimitKey);
      if (record && now < record.expiresAt) {
        if (record.count >= 5) {
          return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }), {
            status: 429,
            headers: {
              ...getCorsHeaders(request, env),
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((record.expiresAt - now) / 1000).toString()
            }
          });
        }
        record.count++;
      } else {
        ipRateLimits.set(rateLimitKey, {
          count: 1,
          expiresAt: now + 60 * 1000 // 60 seconds window
        });
      }

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
