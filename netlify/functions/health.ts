/**
 * Netlify Function backing GET /api/health.
 * Also reports whether the Gemini API key is configured in the deploy environment,
 * which is the most common cause of a dead "Synthesize" button.
 */
export default async (): Promise<Response> => {
  const body = {
    status: 'ok',
    entity: 'DAVID',
    vibeCodeVersion: '1.1',
    runtime: 'netlify-function',
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY),
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
