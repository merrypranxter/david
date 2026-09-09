const fs = require('fs');

const appPath = 'src/App.tsx';
const promptPath = 'src/components/PromptInputArea.tsx';

function patchPromptInputArea() {
  let content = fs.readFileSync(promptPath, 'utf8');

  if (!content.includes("../utils/davidWorkbenchBus")) {
    content = content.replace(
      "import { ModularPipelineSection } from './ModularPipelineSection';",
      "import { ModularPipelineSection } from './ModularPipelineSection';\nimport { dispatchDavidIntent } from '../utils/davidWorkbenchBus';"
    );
  }

  const oldInstrumental = ` onClick={() => {
 if (concept.toLowerCase().includes('instrumental')) {
 setConcept(concept.replace(/\\b(?:instrumental|no vocals)\\b/gi, '').trim());
 } else {
 setConcept(concept ? \`${'${concept.trim()}'} (Instrumental)\` : 'Instrumental acoustic piece');
 }
 }}`;

  const newInstrumental = ` onClick={() => {
 const currentlyInstrumental = concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals');
 dispatchDavidIntent({
  source: 'instrumental-mode',
  label: currentlyInstrumental ? 'Disable Instrumental Mode' : 'Enable Instrumental Mode',
  committed: true,
  changes: {
   target,
   instrumental: !currentlyInstrumental,
   instruction: currentlyInstrumental
    ? 'Remove the instrumental/no-vocals constraint from MAIN PROMPT while preserving every unrelated instruction and lock.'
    : 'Make MAIN PROMPT explicitly instrumental/no-vocals while preserving every unrelated instruction and lock.',
  },
 });
 }}`;

  if (content.includes(oldInstrumental)) {
    content = content.replace(oldInstrumental, newInstrumental);
  } else {
    const start = content.indexOf('id="toggle-instrumental-btn"');
    if (start >= 0) {
      const onClickStart = content.indexOf('onClick={() => {', start);
      const classStart = content.indexOf('\n className=', onClickStart);
      if (onClickStart >= 0 && classStart > onClickStart) {
        content = content.slice(0, onClickStart) + newInstrumental.trimStart() + content.slice(classStart);
      } else {
        console.warn('[job3-one-writer] Instrumental toggle handler markers not found.');
      }
    }
  }

  fs.writeFileSync(promptPath, content, 'utf8');
  console.log('[job3-one-writer] routed Instrumental toggle through DAVID');
}

function stripLegacyConsultFromApp() {
  let content = fs.readFileSync(appPath, 'utf8');

  content = content.replace(/^import\s+\{\s*ConsultChat\s*\}\s+from\s+['"]\.\/components\/ConsultChat['"];?\s*\n?/gm, '');
  content = content.replace(/\n\s*const\s+\[consultChatOpen,\s*setConsultChatOpen\]\s*=\s*useState<boolean>\(false\);?/g, '');
  content = content.replace(/\n\s*const\s+\[consultChatOpen,\s*setConsultChatOpen\]\s*=\s*useState\(false\);?/g, '');
  content = content.replace(/\s*<ConsultChat\b[\s\S]*?\/>\s*/gm, '\n');

  // Kill any obsolete floating launcher tied to the removed Consult state.
  content = content.replace(/\n\s*\{!consultChatOpen\s*&&\s*\([\s\S]*?\n\s*\)\}\s*/gm, '\n');

  fs.writeFileSync(appPath, content, 'utf8');
  console.log('[job3-one-writer] stripped remaining legacy ConsultChat mount/import/state');
}

patchPromptInputArea();
stripLegacyConsultFromApp();
