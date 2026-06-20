import { Env } from '../types';

export async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env
): Promise<{ success: boolean; error?: string }> {
  // If no secret key is set or we are in development and token is missing/special, bypass
  if (!env.TURNSTILE_SECRET_KEY) {
    console.warn('TURNSTILE_SECRET_KEY is not defined. Bypassing Turnstile verification.');
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'Turnstile token is required.' };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || undefined,
      }),
    });

    const data: any = await response.json();
    
    if (data && data.success) {
      return { success: true };
    }
    
    return { 
      success: false, 
      error: data?.['error-codes']?.join(', ') || 'Turnstile verification failed.' 
    };
  } catch (err: any) {
    return { success: false, error: `Turnstile fetch error: ${err.message}` };
  }
}
