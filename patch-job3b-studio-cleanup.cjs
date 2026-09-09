const fs = require('fs');

const workbenchPath = 'src/components/DavidAppWorkbench.tsx';
const appPath = 'src/App.tsx';
const promptPath = 'src/components/PromptInputArea.tsx';

function patchWorkbenchCleanup() {
  let content = fs.readFileSync(workbenchPath, 'utf8');
  if (content.includes('JOB3B_STUDIO_CLEANUP')) {
    console.log('[job3b] cleanup already applied');
    return;
  }

  content = content.replace(
    '  const [collapsed, setCollapsed] = useState(false);',
    `  // JOB3B_STUDIO_CLEANUP\n  // Mobile should start out of the way instead of covering most of the app.\n  const [collapsed, setCollapsed] = useState(() =>\n    typeof window !== 'undefined' ? window.innerWidth < 1180 : false\n  );`
  );

  // If lock preflight succeeds but David returns the exact same prompt, the
  // prompt writer legitimately does nothing. Still clear the dirty flag so
  // the next synth does not pay for the same lock reconciliation again.
  content = content.replace(
    `        });\n      } catch (error: any) {`,
    `        });\n        setLocksDirty(false);\n      } catch (error: any) {`
  );

  fs.writeFileSync(workbenchPath, content, 'utf8');
  console.log('[job3b] mobile workbench starts collapsed + successful lock preflight clears dirty state');
}

function staticStudioAudit() {
  const app = fs.readFileSync(appPath, 'utf8');
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const workbench = fs.readFileSync(workbenchPath, 'utf8');
  const failures = [];

  if (!app.includes('workbenchSourceOfTruth: true')) failures.push('Synthesis source-of-truth flag missing.');
  if (!app.includes('enableMutationEngine: false')) failures.push('Hidden mutation engine is still enabled at synthesis.');
  if (!app.includes('<DavidAppWorkbench')) failures.push('DAVID app workbench mount missing.');

  const promptIndex = prompt.indexOf('id="operative-concept-input"');
  if (promptIndex >= 0) {
    const chunk = prompt.slice(Math.max(0, promptIndex - 250), promptIndex + 900);
    if (!/readOnly/.test(chunk)) failures.push('Visible MAIN PROMPT textarea is not read-only.');
  }

  if (/SLOP_LEXICON/.test(prompt)) failures.push('PromptInputArea still contains legacy SLOP_LEXICON after Merry DNA patching.');

  const instrumentalStart = prompt.indexOf('id="toggle-instrumental-btn"');
  if (instrumentalStart >= 0) {
    const instrumentalChunk = prompt.slice(instrumentalStart, instrumentalStart + 2200);
    if (!instrumentalChunk.includes('dispatchDavidIntent')) failures.push('Instrumental control bypasses DAVID.');
    if (/setConcept\s*\(/.test(instrumentalChunk)) failures.push('Instrumental control still writes MAIN PROMPT directly.');
  }

  if (!workbench.includes('setLocksDirty(false)')) failures.push('Successful lock reconciliation does not clear dirty state.');
  if (!workbench.includes('window.innerWidth < 1180')) failures.push('Mobile workbench does not default collapsed.');

  // Exact state restoration (startup draft, history/undo, saved-run restore) is
  // intentionally allowed to write state directly. Creative mutations are not.
  if (failures.length) {
    console.error('\n[job3b] STUDIO AUDIT FAILED');
    failures.forEach((failure) => console.error(' - ' + failure));
    process.exit(1);
  }

  console.log('[job3b] Studio-safe one-writer audit passed');
}

patchWorkbenchCleanup();
staticStudioAudit();
