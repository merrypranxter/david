const fs = require('fs');

const appPath = 'src/App.tsx';
const workbenchPath = 'src/components/DavidAppWorkbench.tsx';

function extractFunction(source, name) {
  const start = source.indexOf(`const ${name} =`);
  if (start < 0) return '';
  const next = source.indexOf('\n const ', start + 8);
  return source.slice(start, next > start ? next : Math.min(source.length, start + 12000));
}

function assertNoCreativeBypass(app, functionName) {
  const chunk = extractFunction(app, functionName);
  if (!chunk) return [`Missing ${functionName}.`];
  const failures = [];
  if (/setConcept\s*\(/.test(chunk)) failures.push(`${functionName} still writes MAIN PROMPT directly.`);
  if (/handleSynthesize\s*\(/.test(chunk)) failures.push(`${functionName} still auto-synthesizes instead of returning through DAVID.`);
  if (!/dispatchDavidIntent\s*\(/.test(chunk)) failures.push(`${functionName} does not route the creative decision through DAVID.`);
  return failures;
}

function runGuardrails() {
  const app = fs.readFileSync(appPath, 'utf8');
  const workbench = fs.readFileSync(workbenchPath, 'utf8');
  const failures = [];

  // The visible MAIN PROMPT is the creative source of truth.
  if (!app.includes('workbenchSourceOfTruth: true')) failures.push('Missing workbenchSourceOfTruth synthesis flag.');
  if (!app.includes('enableMutationEngine: false')) failures.push('Hidden mutation engine can still run during synthesis.');
  if (!app.includes('enableParadoxEngine: false')) failures.push('Hidden paradox engine can still re-inject state during synthesis.');
  if (!app.includes('selectedSlopSeeds: []')) failures.push('Hidden selected DNA can still leak into synthesis.');
  if (!app.includes('selectedOperators: []')) failures.push('Hidden operators can still leak into synthesis.');
  if (!app.includes('activePipeline: []')) failures.push('Hidden pipeline can still leak into synthesis.');

  // Workbench must pass the exact reconciled prompt into synthesis.
  if (!/onSynthesize=\{\(prompt\) => handleSynthesize\(prompt\)\}/.test(app)) {
    failures.push('Workbench does not pass the exact visible MAIN PROMPT to handleSynthesize.');
  }
  if (!workbench.includes('onSynthesize(promptRef.current)')) {
    failures.push('Workbench synthesis does not use promptRef.current after lock preflight.');
  }

  // Post-synthesis creative decisions must become the next MAIN PROMPT first.
  ['handleOuroborosLoop', 'handleCrossbreed'].forEach((name) => {
    failures.push(...assertNoCreativeBypass(app, name));
  });

  const transpose = extractFunction(app, 'handleTranspose');
  if (transpose && !transpose.includes('dispatchDavidIntent')) {
    failures.push('Transpose does not reconcile its creative state through DAVID.');
  }

  const survivor = extractFunction(app, 'handleSelectMutantSurvivor');
  if (survivor && !survivor.includes('dispatchDavidIntent')) {
    failures.push('Mutant survivor selection does not reconcile through DAVID.');
  }

  const recipe = extractFunction(app, 'handleApplyRecipe');
  if (recipe) {
    if (/if \(recipe\.concept\) setConcept\(recipe\.concept\)/.test(recipe)) {
      failures.push('Saved recipe prompt still bypasses DAVID.');
    }
    if (!recipe.includes("source: 'saved-recipe'")) {
      failures.push('Saved recipe prompt is not routed through DAVID.');
    }
  }

  // Retry is intentionally allowed to synthesize the same already-committed MAIN PROMPT.
  // It is not a creative mutation and therefore does not need another DAVID pass.

  if (failures.length) {
    console.error('\n[final-synthesis-guardrails] FAILED');
    failures.forEach((failure) => console.error(' - ' + failure));
    process.exit(1);
  }

  console.log('[final-synthesis-guardrails] PASS: visible MAIN PROMPT is sole synthesis source; post-synthesis decisions return through DAVID');
}

runGuardrails();
