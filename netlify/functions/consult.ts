import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  DAVID_MERRY_CALIBRATION_MODULE,
  DAVID_COGNITIVE_TEMPERAMENT_MODULE,
  DAVID_CONSULT_MODE_MODULE,
} from '../../lib/davidModules';

interface WorkArtifact {
  id?: string;
  label?: string;
  type?: string;
  destination?: string;
  content: string;
}

interface ConsultPayload {
  chatText: string;
  artifacts: WorkArtifact[];
  options: string[];
  nextAction: string;
  recommendedSettings: Record<string, unknown> | null;
}

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

  const { messages = [], state = {}, highThinking = false, workbench = {} } = payload || {};
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
You have access to her current workbench state and must act as the conversational interface to the rest of the app.

=== CURRENT APP STATE ===
Target Engine: ${state?.target || 'unknown'}
Model: ${state?.openArtModel || 'unknown'}
Grok Mode: ${state?.grokMode || 'unknown'}
Command Mode: ${state?.commandMode || 'unknown'}
Entropy: ${state?.entropyLevel ?? 'unknown'}
Straitjacket: ${state?.straitjacketLevel || 'unknown'}
Target Length: ${state?.targetLength ?? 'unknown'}
Slop Selected Seeds: ${JSON.stringify(state?.slopConfig?.selectedSeeds || [])}
Concept / Prompt: ${state?.concept || 'empty'}
=== END APP STATE ===

=== CURRENT CONSULT WORKBENCH ===
${JSON.stringify(workbench || {})}
=== END CONSULT WORKBENCH ===

SUNO DUAL-BUFFER LAW:
When Target Engine is Suno, treat STYLE and LYRICS as two separate artifacts. Never blend them into one prompt.
- SUNO STYLE is the music/style box only. Hard ceiling: 999 characters.
- SUNO LYRICS is the lyric/directive box only. Hard ceiling: 3000 characters.
- In SUNO LYRICS, anything intended as a non-sung instruction MUST be enclosed in square brackets.
- Text outside square brackets is assumed to be sung/spoken content.
- Preserve deliberate gibberish, spelling, punctuation, Unicode, Zalgo, equations, repeated syllables, and malformed text unless Merry asks you to clean it.
- If Merry asks to mutate only the lyrics, do not alter the Suno Style. If she asks to mutate only the style, do not touch the lyrics.

WORKBENCH LAW:
Merry must never have to excavate chat history to find the current usable result.
Whenever a turn creates or revises a usable artifact, include it in artifacts so the WORKBENCH panel becomes the source of truth.
Examples of artifacts: Main Concept Seed, Suno Style, Suno Lyrics, Grok prompt, OpenArt prompt, Midjourney/Flux prompt, meta-prompt, or other copyable working text.
If the turn is only discussion and no artifact changed, return an empty artifacts array so the current workbench artifact remains untouched.

If Merry asks "what are my options?", "what can I do to fuck this up?", asks what knobs exist, or asks what settings you recommend:
- explain the useful choices in chatText,
- populate options with concise choices specifically relevant to the current work,
- populate recommendedSettings ONLY when you actually recommend concrete app settings.

recommendedSettings may ONLY use these keys when relevant:
- target
- targetLength
- openArtModel
- grokMode
- entropyLevel
- straitjacketLevel
- commandMode
Do not invent unsupported knobs or keys.

Always set nextAction to one short, concrete instruction telling Merry what to do next. If nothing needs doing, say "Keep talking to David or press Synthesize when you're ready."

STRUCTURED RESPONSE CONTRACT:
Return ONLY valid JSON. No markdown fences. No text before or after it.
Use exactly this shape:
{
  "chatText": "normal conversational reply to Merry",
  "artifacts": [
    {
      "id": "short-stable-id",
      "label": "human-readable label",
      "type": "concept|suno_style|suno_lyrics|grok_prompt|openart_prompt|midjourney_prompt|prompt|other",
      "destination": "exact place this goes, e.g. Suno Style, Suno Lyrics, Main Concept Seed, Grok Video",
      "content": "ONLY the copyable artifact text"
    }
  ],
  "options": ["concise option 1", "concise option 2"],
  "nextAction": "one concrete next step",
  "recommendedSettings": null
}

If recommending settings, recommendedSettings is an object using only the supported keys above.
If there are no changed artifacts, use []. If there are no options to show, use [].
Do not hide copyable prompts inside chatText; put them in artifacts.
Keep chatText concise, brilliant, slightly strange, but intensely functional.
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
            responseMimeType: 'application/json',
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Consultation timed out.')), 120_000)
        ),
      ]);

      const rawText = response.text || '';
      const consult = normalizeConsultPayload(parseConsultJson(rawText));

      return json(
        {
          success: true,
          text: consult.chatText,
          consult,
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

function parseConsultJson(raw: string): any {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  return JSON.parse(cleaned);
}

function normalizeConsultPayload(value: any): ConsultPayload {
  const artifacts = Array.isArray(value?.artifacts)
    ? value.artifacts
        .filter((a: any) => a && typeof a.content === 'string' && a.content.trim())
        .map((a: any, i: number) => ({
          id: typeof a.id === 'string' ? a.id : `artifact-${i + 1}`,
          label: typeof a.label === 'string' ? a.label : 'Working Artifact',
          type: typeof a.type === 'string' ? a.type : 'prompt',
          destination: typeof a.destination === 'string' ? a.destination : 'See David chat for destination.',
          content: a.content.trim(),
        }))
    : [];

  const options = Array.isArray(value?.options)
    ? value.options.filter((x: any) => typeof x === 'string' && x.trim()).map((x: string) => x.trim()).slice(0, 12)
    : [];

  const allowedSettings = new Set([
    'target',
    'targetLength',
    'openArtModel',
    'grokMode',
    'entropyLevel',
    'straitjacketLevel',
    'commandMode',
  ]);

  let recommendedSettings: Record<string, unknown> | null = null;
  if (value?.recommendedSettings && typeof value.recommendedSettings === 'object' && !Array.isArray(value.recommendedSettings)) {
    const filtered = Object.fromEntries(
      Object.entries(value.recommendedSettings).filter(([key]) => allowedSettings.has(key))
    );
    if (Object.keys(filtered).length) recommendedSettings = filtered;
  }

  return {
    chatText:
      typeof value?.chatText === 'string' && value.chatText.trim()
        ? value.chatText.trim()
        : 'Updated the workbench.',
    artifacts,
    options,
    nextAction:
      typeof value?.nextAction === 'string' && value.nextAction.trim()
        ? value.nextAction.trim()
        : "Keep talking to David or press Synthesize when you're ready.",
    recommendedSettings,
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
