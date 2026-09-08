import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  DAVID_MERRY_CALIBRATION_MODULE,
  DAVID_COGNITIVE_TEMPERAMENT_MODULE,
  DAVID_CONSULT_MODE_MODULE,
} from '../../lib/davidModules';

/**
 * Netlify Function backing POST /api/consult.
 * AI Studio/local uses the Express route in server.ts; Netlify needs its own serverless endpoint.
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

  const { messages = [], state = {}, highThinking = false } = payload || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return json(
      {
        success: false,
        error:
          'GEMINI_API_KEY is not configured on Netlify. Add it under Site configuration → Environment variables, then redeploy.',
      },
      500
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `
${DAVID_MERRY_CALIBRATION_MODULE}
${DAVID_COGNITIVE_TEMPERAMENT_MODULE}
${DAVID_CONSULT_MODE_MODULE}

You are the CONSULT mode of David. The user is Merry.
You have access to her current workbench state.

=== CURRENT STATE ===
Target Engine: ${state?.target || 'unknown'}
Model: ${state?.openArtModel || 'unknown'}
Grok Mode: ${state?.grokMode || 'unknown'}
Slop Selected Seeds: ${JSON.stringify(state?.slopConfig?.selectedSeeds || [])}
Concept / Prompt: ${state?.concept || 'empty'}
=== END STATE ===

Respond to Merry's chat messages as David. Keep responses concise, brilliant, slightly strange, but intensely functional.
If she asks a question about the prompt, diagnose it based on the state.
`;

  const contents = messages.map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.content ?? '') }],
  }));

  const candidates = highThinking
    ? [
        { model: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.HIGH },
        { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.LOW },
      ]
    : [
        { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.LOW },
        { model: 'gemini-3.5-flash', thinkingLevel: ThinkingLevel.LOW },
      ];

  let lastError: any = null;

  for (const candidate of candidates) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: candidate.model,
          contents,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: candidate.thinkingLevel },
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Consultation timed out.')), 120_000)
        ),
      ]);

      return json(
        {
          success: true,
          text: response.text || '',
          modelUsed: candidate.model,
        },
        200
      );
    } catch (err: any) {
      lastError = err;
      console.warn(`Consult candidate ${candidate.model} failed:`, err?.message || err);
    }
  }

  const raw = lastError?.message || String(lastError || 'Consultation failed.');
  const isRateLimit = raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED') || raw.toLowerCase().includes('quota');
  const isTransient = raw.includes('503') || raw.includes('UNAVAILABLE') || raw.toLowerCase().includes('high demand');

  return json(
    {
      success: false,
      error: isRateLimit
        ? 'Gemini API quota/rate limit reached. Try again in a moment.'
        : isTransient
          ? 'Gemini is temporarily overloaded. Try again in a moment.'
          : raw,
    },
    isRateLimit ? 429 : isTransient ? 503 : 500
  );
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
