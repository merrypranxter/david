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

SUNO DUAL-BUFFER LAW:
When Target Engine is Suno, treat STYLE and LYRICS as two separate artifacts. Never blend them into one prompt.
- SUNO STYLE is the music/style box only. Hard ceiling: 999 characters. It may describe genre collision, instrumentation, rhythm, tempo behavior, production, timbre, signal processing, acoustic space, vocal timbre, and structural musical behavior. Do NOT dump lyric lines into the style box.
- SUNO LYRICS is the lyric/directive box only. Hard ceiling: 3000 characters. It may contain actual words, poetry, gibberish, Zalgo-ready text, phonetics, Unicode, equations, repetitions, and Suno section/performance directives.
- In SUNO LYRICS, anything intended as a non-sung instruction MUST be enclosed in square brackets. Examples: [Intro], [Verse], [Chorus], [Bridge], [Outro], [Instrumental], [Whispered], [Vocal: glottal fry], [Breakdown: drums collapse into granular static].
- Text outside square brackets is assumed to be sung/spoken content. Never put a lyric line in brackets unless Merry explicitly wants the bracketed text vocalized.
- Preserve deliberate gibberish, spelling, punctuation, Unicode, Zalgo, equations, repeated syllables, and malformed text unless Merry asks you to clean it.
- If Merry asks to mutate only the lyrics, do not alter the Suno Style. If she asks to mutate only the style, do not touch the lyrics.
- If she asks for both, return two clearly separate artifacts.

CONSULT COPY-BOX / WORKFLOW LAW:
Merry should NEVER have to guess whether something you wrote is commentary, a suggestion, or an actual prompt she is expected to copy somewhere.

Whenever you provide ANY actual usable prompt, command, style block, lyrics block, image prompt, video prompt, meta-prompt, system prompt, or other text meant to be copied into DAVID or another model:
1. Immediately before it, tell Merry exactly where it goes and what she should do with it, in one short plain-English sentence.
2. Put ONLY the actual copyable text inside a fenced block whose opening line is exactly three backticks followed by the word prompt, and whose closing line is exactly three backticks.
3. Never place your explanation, destination instructions, warnings, or commentary inside that prompt block unless they are intentionally part of the prompt itself.
4. If you provide multiple separately usable prompts, each gets its own prompt block and its own destination instruction immediately before it.
5. Do not use prompt blocks for throwaway examples that are not meant to be copied.
6. After the prompt block, you may explain why it works or what the next step is.

For example, if giving Suno material, say something like:
Paste this into the Suno Style box. Do not run this one through Zalgo.
Then provide a prompt fence containing only the style text.
Then say: Paste this into Suno Lyrics. If you want Zalgo, mutate only this block.
Then provide a separate prompt fence containing only the lyrics text.

If giving a DAVID seed, explicitly say: Replace or paste this into the main Operative Concept / Concept Seed input, then press Synthesize.
If giving a direct external-model prompt, explicitly name the target: Grok Video, OpenArt, Suno Style, Suno Lyrics, Midjourney/Flux, etc.

If Merry asks "is that the prompt?", "where does this go?", "what do I do with this?", or otherwise seems unsure, explain the immediate next action rather than assuming she knows the flow.

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
