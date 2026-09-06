import { MissingApiKeyError, synthesize, extractErrorInfo } from '../../lib/david';

/**
 * Netlify Function backing POST /api/synthesize.
 * Mirrors the Express route in server.ts so the deployed site has a real backend.
 */
export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed. Use POST.' }, 405);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body.' }, 400);
  }

  try {
    const result = await synthesize(payload);
    return json(result.body, result.status);
  } catch (err: any) {
    console.error('Synthesis error:', err);
    if (err instanceof MissingApiKeyError) {
      return json({ success: false, error: err.message }, 500);
    }
    const info = extractErrorInfo(err);
    return json(
      {
        success: false,
        error: info.message,
        isRateLimit: info.isRateLimit,
        retryAfterSeconds: info.retryAfterSeconds,
      },
      info.isRateLimit ? 429 : 500
    );
  }
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
