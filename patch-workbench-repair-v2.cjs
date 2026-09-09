const fs = require('fs');

const workbenchPath = 'src/components/DavidAppWorkbench.tsx';
const davidPath = 'lib/david.ts';
const cssPath = 'src/index.css';

function patchWorkbench() {
  let content = fs.readFileSync(workbenchPath, 'utf8');
  if (content.includes('WORKBENCH_REPAIR_V2')) {
    console.log('[workbench-repair-v2] workbench already patched');
    return;
  }

  // 1) Typing in DAVID chat must not rerender the whole workbench on every keystroke.
  content = content.replace(
    "  const [input, setInput] = useState('');",
    "  // WORKBENCH_REPAIR_V2\n  // Chat draft is intentionally uncontrolled: typing must not rerender this entire panel per keypress.\n  const inputRef = useRef<HTMLTextAreaElement | null>(null);"
  );

  content = content.replace(
    "    const clean = (override ?? input).trim();\n    if (!clean || loading) return;\n    setInput('');",
    "    const clean = (override ?? inputRef.current?.value ?? '').trim();\n    if (!clean || loading) return;\n    if (!override && inputRef.current) inputRef.current.value = '';"
  );

  content = content.replace(
    `              <textarea\n                value={input}\n                onChange={(event) => setInput(event.target.value)}`,
    `              <textarea\n                ref={inputRef}\n                defaultValue=""`
  );

  content = content.replace(
    "disabled={!input.trim() || loading}",
    "disabled={loading}"
  );

  // 2) Never let a Suno lyrics/style artifact, or any arbitrary last artifact,
  // silently replace MAIN PROMPT. Only explicit working-prompt artifacts may write it.
  const oldExtract = `function extractPromptArtifact(payload: ConsultPayload): WorkArtifact | null {\n  const artifacts = Array.isArray(payload.artifacts) ? payload.artifacts.filter((a) => a?.content?.trim()) : [];\n  if (!artifacts.length) return null;\n  const explicit = [...artifacts].reverse().find((artifact) =>\n    /main.?prompt|prompt|operative|draft/i.test(\n      \`${'${artifact.type || \'\'} ${artifact.label || \'\'} ${artifact.destination || \'\'}'}\`\n    )\n  );\n  return explicit || artifacts[artifacts.length - 1];\n}`;

  const newExtract = `function extractPromptArtifact(payload: ConsultPayload): WorkArtifact | null {\n  const artifacts = Array.isArray(payload.artifacts) ? payload.artifacts.filter((a) => a?.content?.trim()) : [];\n  if (!artifacts.length) return null;\n  return [...artifacts].reverse().find((artifact) => {\n    const type = String(artifact.type || '').toLowerCase();\n    const label = String(artifact.label || '').toLowerCase();\n    const destination = String(artifact.destination || '').toLowerCase();\n    if (type === 'main_prompt' || type === 'concept' || type === 'prompt') return true;\n    if (/main prompt|main concept|operative concept/.test(label)) return true;\n    if (/main prompt|main concept|operative concept/.test(destination)) return true;\n    return false;\n  }) || null;\n}`;

  if (content.includes(oldExtract)) content = content.replace(oldExtract, newExtract);

  // 3) Be tolerant of the legacy Studio endpoint while the backend patch is applying.
  content = content.replace(
    "    const payload: ConsultPayload = data?.consult || {};",
    `    let payload: ConsultPayload = data?.consult || null;\n    if (!payload && typeof data?.text === 'string') {\n      try {\n        const parsed = JSON.parse(data.text);\n        payload = parsed && typeof parsed === 'object' ? parsed : null;\n      } catch {\n        payload = { chatText: data.text, artifacts: [], options: [], nextAction: '', recommendedSettings: null };\n      }\n    }\n    payload = payload || { chatText: 'DAVID returned no usable response.', artifacts: [], options: [], nextAction: '', recommendedSettings: null };`
  );

  // 4) While typing, drop expensive decorative compositing. Restore immediately on blur.
  const typingEffectNeedle = `  useEffect(() => {\n    localStorage.setItem(NOTE_STORAGE, notepad);\n  }, [notepad]);`;
  const typingEffectReplacement = `  useEffect(() => {\n    localStorage.setItem(NOTE_STORAGE, notepad);\n  }, [notepad]);\n\n  useEffect(() => {\n    const onFocusIn = (event: FocusEvent) => {\n      const target = event.target as HTMLElement | null;\n      if (target?.matches?.('input, textarea, [contenteditable="true"]')) {\n        document.body.classList.add('david-typing-performance');\n      }\n    };\n    const onFocusOut = () => {\n      window.setTimeout(() => {\n        const active = document.activeElement as HTMLElement | null;\n        if (!active?.matches?.('input, textarea, [contenteditable="true"]')) {\n          document.body.classList.remove('david-typing-performance');\n        }\n      }, 0);\n    };\n    document.addEventListener('focusin', onFocusIn);\n    document.addEventListener('focusout', onFocusOut);\n    return () => {\n      document.removeEventListener('focusin', onFocusIn);\n      document.removeEventListener('focusout', onFocusOut);\n      document.body.classList.remove('david-typing-performance');\n    };\n  }, []);`;
  if (content.includes(typingEffectNeedle)) content = content.replace(typingEffectNeedle, typingEffectReplacement);

  fs.writeFileSync(workbenchPath, content, 'utf8');
  console.log('[workbench-repair-v2] uncontrolled chat input + safe artifact ownership + typing performance mode');
}

function patchConsultBackend() {
  let content = fs.readFileSync(davidPath, 'utf8');
  if (content.includes('CONSULT_REPAIR_V2')) {
    console.log('[workbench-repair-v2] consult backend already patched');
    return;
  }

  const marker = 'export async function consult(payload: any): Promise<HandlerResult> {';
  const start = content.lastIndexOf(marker);
  if (start < 0) {
    console.error('[workbench-repair-v2] consult function not found');
    process.exit(1);
  }

  const replacement = `// CONSULT_REPAIR_V2\nexport async function consult(payload: any): Promise<HandlerResult> {\n  const { messages = [], state = {}, highThinking = false, workbench = {} } = payload || {};\n  const ai = getGenAI();\n\n  const candidateSteps: CandidateStep[] = [];\n  if (highThinking) {\n    if (!isModelCoolingDown('gemini-3.8-flash')) candidateSteps.push({ model: 'gemini-3.8-flash', label: 'gemini-3.8-flash (High Thinking)', thinkingLevel: ThinkingLevel.HIGH, backoffDelayMs: 0 });\n    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 100 });\n  } else {\n    if (!isModelCoolingDown('gemini-3.1-flash-lite')) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', backoffDelayMs: 0 });\n    if (!isModelCoolingDown('gemini-3.5-flash')) candidateSteps.push({ model: 'gemini-3.5-flash', label: 'gemini-3.5-flash', backoffDelayMs: 100 });\n  }\n  if (!candidateSteps.length) candidateSteps.push({ model: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite (Recovery)', backoffDelayMs: 0 });\n\n  const systemInstruction = \`\n\${DAVID_MERRY_CALIBRATION_MODULE}\n\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}\n\${DAVID_CONSULT_MODE_MODULE}\n\nYou are DAVID in his conversational workbench. Merry is talking directly to you.\nYou have TWO simultaneous jobs and MUST do both:\n1. TALK TO MERRY like David: explain what you understood, what you changed or chose, why, what tensions/paradoxes you introduced, and what she can do next. Never reduce chatText to 'updated' or a status crumb.\n2. Maintain MAIN PROMPT as the working creative brief when her request creates or revises the work.\n\nCONVERSATION LAW:\n- chatText is mandatory and substantive on every successful turn: normally 2-6 useful sentences.\n- When you change MAIN PROMPT, tell Merry WHAT changed and WHY.\n- When she asks for weirdness/options, discuss the mechanisms, operators, contradictions, rhythms, sounds, structures, or failure modes you selected.\n- Keep David conversational, curious, technically literate, and willing to get strange.\n\nMAIN PROMPT LAW:\n- If Merry gives a creative request that should alter the working prompt, return a complete artifact with type 'main_prompt', label 'MAIN PROMPT', destination 'APP SIDEBAR // MAIN PROMPT'.\n- It must be a real, sufficiently detailed creative brief, not a tiny keyword stub.\n- Preserve the actual request. Do not substitute unrelated gimmicks.\n- A request containing several required dimensions must visibly retain them all unless you explain a deliberate tradeoff in chatText.\n- Never replace MAIN PROMPT with a Suno lyrics buffer, Suno style fragment, generation ID, operator name, or random artifact.\n\nSUNO WORKBENCH LAW:\n- If Merry says 'make a Suno prompt' in chat, treat that as a request to build/revise MAIN PROMPT as a rich musical brief unless she explicitly asks for final Suno STYLE/LYRICS buffers right now.\n- Preserve named musical traditions and requested fusions. If she asks for Hindustani ragas fused with unusual styles/sounds, the prompt must actually contain Hindustani raga language PLUS multiple unusual cross-domain musical ideas, temporal/rhythmic oddities, and meaningful operators/contradictions.\n- Do not collapse a complex music request into a couple of arbitrary words.\n- Do NOT introduce yodeling or throat singing unless Merry explicitly asks for them.\n- For finished Suno artifacts: STYLE and LYRICS are separate. STYLE <= 999 chars. LYRICS <= 3000 chars. Non-sung instructions in LYRICS go in square brackets.\n\nCURRENT STATE:\nTarget: \${state?.target || 'unknown'}\nModel: \${state?.openArtModel || 'unknown'}\nGrok Mode: \${state?.grokMode || 'unknown'}\nEntropy: \${state?.entropyLevel ?? 'unknown'}\nStraitjacket: \${state?.straitjacketLevel || 'unknown'}\nCommand Mode: \${state?.commandMode || 'unknown'}\nMAIN PROMPT: \${state?.mainPrompt || state?.concept || 'empty'}\nSelected DNA: \${JSON.stringify(state?.slopConfig?.selectedSeeds || [])}\nSelected Operators: \${JSON.stringify(state?.slopConfig?.selectedOperators || [])}\nSelected Fauna: \${JSON.stringify(state?.slopConfig?.selectedAttractors || [])}\nGlobal Locks: \${JSON.stringify(state?.globalLocks || workbench?.locks || {})}\n\nReturn ONLY valid JSON, no fences, exactly this shape:\n{\n  "chatText": "what David says to Merry, including what he did and why",\n  "artifacts": [{ "id": "main-prompt", "label": "MAIN PROMPT", "type": "main_prompt", "destination": "APP SIDEBAR // MAIN PROMPT", "content": "complete working prompt" }],\n  "options": [],\n  "nextAction": "one concise useful next action",\n  "recommendedSettings": null\n}\nUse artifacts: [] only when the turn truly does not change the working prompt.\n\`;\n\n  const contents = messages.map((m: any) => ({\n    role: m.role === 'user' ? 'user' : 'model',\n    parts: [{ text: String(m.content ?? '') }],\n  }));\n\n  let response: any = null;\n  let lastError: any = null;\n  let successfulStep: CandidateStep | null = null;\n\n  for (const step of candidateSteps) {\n    if (step.backoffDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, step.backoffDelayMs));\n    let timeoutId: any = null;\n    try {\n      const config: any = {\n        systemInstruction,\n        responseMimeType: 'application/json',\n      };\n      if (step.model.startsWith('gemini-3') || step.model.includes('3.')) {\n        config.thinkingConfig = { thinkingLevel: step.thinkingLevel || ThinkingLevel.LOW };\n      }\n      const callPromise = ai.models.generateContent({ model: step.model, contents, config });\n      const timeoutPromise = new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 120000); });\n      response = await Promise.race([callPromise, timeoutPromise]);\n      clearTimeout(timeoutId);\n      successfulStep = step;\n      break;\n    } catch (err: any) {\n      if (timeoutId) clearTimeout(timeoutId);\n      lastError = err;\n      const status = err.status || err.code;\n      if (status === 429) registerModelRateLimit(step.model);\n    }\n  }\n\n  if (!response) {\n    const errorInfo = extractErrorInfo(lastError);\n    return { status: errorInfo.isRateLimit ? 429 : errorInfo.isTransient ? 503 : 500, body: { success: false, error: errorInfo.message } };\n  }\n\n  try {\n    const raw = String(response.text || '').trim().replace(/^\\`\\`\\`(?:json)?\\s*/i, '').replace(/\\s*\\`\\`\\`$/i, '');\n    const parsed = JSON.parse(raw);\n    const artifacts = Array.isArray(parsed?.artifacts)\n      ? parsed.artifacts.filter((a: any) => a && typeof a.content === 'string' && a.content.trim()).map((a: any, i: number) => ({\n          id: typeof a.id === 'string' ? a.id : \`artifact-\${i + 1}\`,\n          label: typeof a.label === 'string' ? a.label : 'Working Artifact',\n          type: typeof a.type === 'string' ? a.type : 'prompt',\n          destination: typeof a.destination === 'string' ? a.destination : 'DAVID Workbench',\n          content: a.content.trim(),\n        }))\n      : [];\n    const consult = {\n      chatText: typeof parsed?.chatText === 'string' && parsed.chatText.trim() ? parsed.chatText.trim() : 'I updated the workbench, but my explanation channel came back empty.',\n      artifacts,\n      options: Array.isArray(parsed?.options) ? parsed.options.filter((x: any) => typeof x === 'string').slice(0, 10) : [],\n      nextAction: typeof parsed?.nextAction === 'string' ? parsed.nextAction : 'Keep talking to David or synthesize when ready.',\n      recommendedSettings: parsed?.recommendedSettings && typeof parsed.recommendedSettings === 'object' ? parsed.recommendedSettings : null,\n    };\n    return { status: 200, body: { success: true, text: consult.chatText, consult, modelUsed: successfulStep?.label || 'unknown' } };\n  } catch (err: any) {\n    return { status: 500, body: { success: false, error: \`David returned malformed consult JSON: \${err?.message || err}\` } };\n  }\n}\n`;

  content = content.slice(0, start) + replacement + '\n';
  fs.writeFileSync(davidPath, content, 'utf8');
  console.log('[workbench-repair-v2] Studio consult now returns structured talk + MAIN PROMPT artifacts');
}

function patchTypingCss() {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (css.includes('DAVID_TYPING_PERFORMANCE_V2')) return;
  css += `\n\n/* DAVID_TYPING_PERFORMANCE_V2\n   Inputs should feel immediate even inside the decorative terminal. While any\n   editor has focus, temporarily remove expensive compositing effects. */\nbody.david-typing-performance .crt-overlay { display: none !important; }\nbody.david-typing-performance .phosphor-glow { text-shadow: none !important; }\nbody.david-typing-performance .david-app-workbench,\nbody.david-typing-performance .david-app-workbench *,\nbody.david-typing-performance input,\nbody.david-typing-performance textarea {\n  animation: none !important;\n  transition: none !important;\n  filter: none !important;\n  backdrop-filter: none !important;\n  text-shadow: none !important;\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('[workbench-repair-v2] typing performance CSS installed');
}

patchWorkbench();
patchConsultBackend();
patchTypingCss();
