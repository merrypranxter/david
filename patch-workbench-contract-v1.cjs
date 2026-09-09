const fs = require('fs');

const path = 'src/components/DavidAppWorkbench.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('WORKBENCH_CONTRACT_V1')) {
  console.log('[workbench-contract-v1] already applied');
  process.exit(0);
}

content = content.replace(
  'function extractPromptArtifact(payload: ConsultPayload): WorkArtifact | null {',
  '// WORKBENCH_CONTRACT_V1\nfunction extractPromptArtifact(payload: ConsultPayload): WorkArtifact | null {'
);

content = content.replace(
  `  const explicit = [...artifacts].reverse().find((artifact) =>\n    /main.?prompt|prompt|operative|draft/i.test(\n      \`${'${artifact.type || \'\'} ${artifact.label || \'\'} ${artifact.destination || \'\'}'}\`\n    )\n  );\n  return explicit || artifacts[artifacts.length - 1];`,
  `  const explicit = [...artifacts].reverse().find((artifact) => {\n    const type = String(artifact.type || '').toLowerCase();\n    const label = String(artifact.label || '').toLowerCase();\n    const destination = String(artifact.destination || '').toLowerCase();\n    return type === 'main_prompt' || type === 'concept' || /main prompt|main concept|operative concept/.test(label + ' ' + destination);\n  });\n  return explicit || null;`
);

content = content.replace(
  "    const payload: ConsultPayload = data?.consult || {};",
  `    let payload: ConsultPayload = data?.consult || null;\n    if (!payload && typeof data?.text === 'string') {\n      try {\n        const parsed = JSON.parse(data.text);\n        payload = parsed && typeof parsed === 'object' ? parsed : null;\n      } catch {\n        payload = { chatText: data.text, artifacts: [], options: [], nextAction: '', recommendedSettings: null };\n      }\n    }\n    payload = payload || { chatText: 'DAVID returned no usable response.', artifacts: [], options: [], nextAction: '', recommendedSettings: null };`
);

content = content.replace(
  `  const workbenchStatus = loading\n    ? 'DAVID THINKING'\n    : pendingItems.length\n      ? \`LOCAL STAGED \${pendingItems.length}\`\n      : 'PROMPT COMMITTED';`,
  `  const workbenchStatus = loading\n    ? 'DAVID THINKING'\n    : pendingItems.length\n      ? \`LOCAL STAGED \${pendingItems.length}\`\n      : mainPrompt.trim()\n        ? 'PROMPT COMMITTED'\n        : 'NO PROMPT YET';`
);

content = content.replace(
  "className={`david-app-workbench__status ${loading ? 'is-working' : pendingItems.length ? 'is-staged' : 'is-committed'}`}",
  "className={`david-app-workbench__status ${loading ? 'is-working' : pendingItems.length ? 'is-staged' : mainPrompt.trim() ? 'is-committed' : ''}`}"
);

fs.writeFileSync(path, content, 'utf8');
console.log('[workbench-contract-v1] DAVID chat response + MAIN PROMPT artifact contract repaired');
