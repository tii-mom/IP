import { Env } from '../types';

export function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS || '*';
  
  let allowedOrigin = '*';
  if (allowed !== '*') {
    const list = allowed.split(',').map(item => item.trim());
    if (origin && list.includes(origin)) {
      allowedOrigin = origin;
    } else {
      // Default to first in list if no matching origin
      allowedOrigin = list[0];
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions(request: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env),
  });
}
