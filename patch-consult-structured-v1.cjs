const fs = require('fs');

const path = 'lib/david.ts';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('CONSULT_STRUCTURED_V1')) {
  console.log('[consult-structured-v1] already applied');
  process.exit(0);
}

const marker = 'export async function consult(payload: any): Promise<HandlerResult> {';
const start = content.lastIndexOf(marker);
if (start < 0) {
  console.error('[consult-structured-v1] consult function not found');
  process.exit(1);
}

const canonical = `// CONSULT_STRUCTURED_V1
export async function consult(payload: any): Promise<HandlerResult> {
  const { messages = [], state = {}, highThinking = false, workbench = {} } = payload || {};
  const ai = getGenAI();

  const candidateSteps: CandidateStep[] = [];
  if (highThinking) {
    if (!isModelCoolingDown('gemini-3.8-flash')) candidateSteps.push({ model: 'gemini-3.8-flash', label: 'gemini-3.8-flash (High Thinking)', thinkingLevel: ThinkingLevel.HIGH, backoffDelayMs: 0 });
    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 100 });
  } else {
    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 0 });
    if (!isModelCoolingDown('gemini-3.5-flash')) candidateSteps.push({ model: 'gemini-3.5-flash', label: 'gemini-3.5-flash', backoffDelayMs: 100 });
  }
  if (!candidateSteps.length) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite (Recovery)', backoffDelayMs: 0 });

  const systemInstruction = \`
\${DAVID_MERRY_CALIBRATION_MODULE}
\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}
\${DAVID_CONSULT_MODE_MODULE}

You are DAVID in the workbench. Merry is talking directly to you.

You have TWO mandatory jobs on every creative turn:
1. TALK TO MERRY. Explain what you understood, what you changed or chose, why, and what interesting tensions/operators/contradictions you introduced. chatText must feel like David talking to her, not a status crumb. Usually 2-6 useful sentences.
2. MAINTAIN MAIN PROMPT. If Merry is creating or revising the work, return the complete revised working prompt as a main_prompt artifact. Never return a tiny keyword stub for a complex request.

If Merry is only asking a question and does not want the work changed, artifacts may be empty.

For Suno requests, preserve the actual musical request. If she asks for Hindustani ragas fused with unusual styles, rhythm/tempo paradoxes, and operators, the resulting prompt must visibly contain those ingredients and develop them. Do not substitute unrelated gimmicks. Do not introduce yodeling or throat singing unless she asks for them.

CURRENT MAIN PROMPT:
\${state?.mainPrompt || state?.concept || '[blank]'}

TARGET: \${state?.target || 'unknown'}
GLOBAL LOCKS: \${JSON.stringify(state?.globalLocks || workbench?.locks || {})}
SELECTED DNA: \${JSON.stringify(state?.slopConfig?.selectedSeeds || [])}
SELECTED OPERATORS: \${JSON.stringify(state?.slopConfig?.selectedOperators || [])}

Return ONLY valid JSON with this shape:
{
  "chatText": "what David says to Merry",
  "artifacts": [
    {
      "id": "main-prompt",
      "label": "MAIN PROMPT",
      "type": "main_prompt",
      "destination": "APP SIDEBAR // MAIN PROMPT",
      "content": "complete working prompt"
    }
  ],
  "options": [],
  "nextAction": "one concise useful next action",
  "recommendedSettings": null
}
Use artifacts: [] only when no prompt change is appropriate.
\`;

  const contents = messages.map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.content ?? '') }],
  }));

  let response: any = null;
  let lastError: any = null;
  let successfulStep: CandidateStep | null = null;

  for (const step of candidateSteps) {
    if (step.backoffDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, step.backoffDelayMs));
    let timeoutId: any = null;
    try {
      const config: any = { systemInstruction, responseMimeType: 'application/json' };
      if (step.model.startsWith('gemini-3') || step.model.includes('3.')) {
        config.thinkingConfig = { thinkingLevel: step.thinkingLevel || ThinkingLevel.LOW };
      }
      const callPromise = ai.models.generateContent({ model: step.model, contents, config });
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 120000);
      });
      response = await Promise.race([callPromise, timeoutPromise]);
      if (timeoutId) clearTimeout(timeoutId);
      successfulStep = step;
      break;
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      lastError = err;
      const status = err.status || err.code;
      if (status === 429) markModelCooldown(step.model);
    }
  }

  if (!response) {
    const errorInfo = extractErrorInfo(lastError);
    return { status: errorInfo.isRateLimit ? 429 : errorInfo.isTransient ? 503 : 500, body: { success: false, error: errorInfo.message } };
  }

  const raw = String(response.text || '').trim().replace(/^\x60\x60\x60(?:json)?\\s*/i, '').replace(/\\s*\x60\x60\x60$/i, '');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      status: 200,
      body: {
        success: true,
        text: raw || 'I am here, but that response came back malformed.',
        consult: {
          chatText: raw || 'I am here, but that response came back malformed.',
          artifacts: [],
          options: [],
          nextAction: 'Tell me what you want to change and I will rebuild the working prompt.',
          recommendedSettings: null,
        },
        modelUsed: successfulStep?.label || 'unknown',
      },
    };
  }

  const artifacts = Array.isArray(parsed?.artifacts)
    ? parsed.artifacts
        .filter((a: any) => a && typeof a.content === 'string' && a.content.trim())
        .map((a: any, i: number) => ({
          id: typeof a.id === 'string' ? a.id : \`artifact-\${i + 1}\`,
          label: typeof a.label === 'string' ? a.label : 'Working Artifact',
          type: typeof a.type === 'string' ? a.type : 'prompt',
          destination: typeof a.destination === 'string' ? a.destination : 'DAVID Workbench',
          content: a.content.trim(),
        }))
    : [];

  const consult = {
    chatText: typeof parsed?.chatText === 'string' && parsed.chatText.trim() ? parsed.chatText.trim() : 'I updated the workbench.',
    artifacts,
    options: Array.isArray(parsed?.options) ? parsed.options.filter((x: any) => typeof x === 'string' && x.trim()).slice(0, 10) : [],
    nextAction: typeof parsed?.nextAction === 'string' && parsed.nextAction.trim() ? parsed.nextAction.trim() : 'Keep talking to David or synthesize when ready.',
    recommendedSettings: parsed?.recommendedSettings && typeof parsed.recommendedSettings === 'object' ? parsed.recommendedSettings : null,
  };

  return {
    status: 200,
    body: {
      success: true,
      text: consult.chatText,
      consult,
      modelUsed: successfulStep?.label || 'unknown',
    },
  };
}
`;

content = content.slice(0, start) + canonical + '\n';
fs.writeFileSync(path, content, 'utf8');
console.log('[consult-structured-v1] restored DAVID talk + structured MAIN PROMPT contract');
