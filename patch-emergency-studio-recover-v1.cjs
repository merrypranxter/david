const fs = require('fs');

const davidPath = 'lib/david.ts';

function recoverConsult() {
  let content = fs.readFileSync(davidPath, 'utf8');
  if (!content.includes('CONSULT_REPAIR_V2')) {
    console.log('[emergency-recover] consult backend does not contain the bad repair marker');
    return;
  }

  const start = content.lastIndexOf('// CONSULT_REPAIR_V2');
  if (start < 0) return;

  const knownGoodConsult = `export async function consult(payload: any): Promise<HandlerResult> {
  const { messages, state, highThinking = false } = payload;
  const ai = getGenAI();

  const candidateSteps: CandidateStep[] = [];
  if (highThinking) {
    if (!isModelCoolingDown('gemini-3.8-flash')) candidateSteps.push({ model: 'gemini-3.8-flash', label: 'gemini-3.8-flash (High Thinking)', thinkingLevel: ThinkingLevel.HIGH, backoffDelayMs: 0 });
    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 100 });
  } else {
    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 0 });
    if (!isModelCoolingDown('gemini-3.5-flash')) candidateSteps.push({ model: 'gemini-3.5-flash', label: 'gemini-3.5-flash', backoffDelayMs: 100 });
  }
  if (candidateSteps.length === 0) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite (Recovery)', backoffDelayMs: 0 });

  const systemInstruction = \`
\${DAVID_MERRY_CALIBRATION_MODULE}
\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}
\${DAVID_CONSULT_MODE_MODULE}

You are the CONSULT mode of David. The user is Merry.
You have access to her current workbench state.

=== CURRENT STATE ===
Target Engine: \${state?.target || 'unknown'}
Model: \${state?.openArtModel || 'unknown'}
Grok Mode: \${state?.grokMode || 'unknown'}
Slop Selected Seeds: \${JSON.stringify(state?.slopConfig?.selectedSeeds || [])}
Concept / Prompt: \${state?.concept || 'empty'}
=== END STATE ===

Respond to Merry's chat messages as David. Keep responses concise, brilliant, slightly strange, but intensely functional.
If she asks a question about the prompt, diagnose it based on the state.
\`;

  let response: any = null;
  let lastError: any = null;
  let successfulStep: CandidateStep | null = null;

  for (const step of candidateSteps) {
    if (step.backoffDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, step.backoffDelayMs));
    }

    let timeoutId: any = null;
    try {
      const config: any = { systemInstruction };
      if (step.thinkingLevel && (step.model.startsWith('gemini-3') || step.model.includes('3.'))) {
        config.thinkingConfig = { thinkingLevel: step.thinkingLevel };
      } else if (step.model.startsWith('gemini-3') || step.model.includes('3.')) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const callPromise = ai.models.generateContent({
        model: step.model,
        contents,
        config
      });

      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 120000);
      });

      response = await Promise.race([callPromise, timeoutPromise]);
      clearTimeout(timeoutId);
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
    return {
      status: errorInfo.isRateLimit ? 429 : errorInfo.isTransient ? 503 : 500,
      body: { success: false, error: errorInfo.message }
    };
  }

  const outputText = response.text || '';
  return {
    status: 200,
    body: {
      success: true,
      text: outputText,
      modelUsed: successfulStep?.label || 'unknown'
    }
  };
}`;

  content = content.slice(0, start) + knownGoodConsult + '\n';
  fs.writeFileSync(davidPath, content, 'utf8');
  console.log('[emergency-recover] restored known-good Studio consult backend');
}

recoverConsult();
