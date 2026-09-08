const fs = require('fs');

const appPath = 'src/App.tsx';
const promptPath = 'src/components/PromptInputArea.tsx';

function patchApp() {
  let content = fs.readFileSync(appPath, 'utf8');

  if (!content.includes("./components/DavidAppWorkbench")) {
    content = content.replace(
      "import { ConsultChat } from './components/ConsultChat';",
      "import { DavidAppWorkbench } from './components/DavidAppWorkbench';"
    );
  }

  if (!content.includes("./utils/davidWorkbenchBus")) {
    content = content.replace(
      "import { apiFetch } from './cloudRunFetchGuard';",
      "import { apiFetch } from './cloudRunFetchGuard';\nimport { dispatchDavidIntent } from './utils/davidWorkbenchBus';"
    );
  }

  if (!content.includes('<DavidAppWorkbench')) {
    const consultRegex = /\s*<ConsultChat[\s\S]*?\/>/m;
    if (!consultRegex.test(content)) {
      console.error('[workbench-v2] ConsultChat mount not found; APP not modified');
      process.exitCode = 1;
      return;
    }

    const replacement = `
      <DavidAppWorkbench
        mainPrompt={concept}
        currentState={{
          concept,
          target,
          targetLength,
          openArtModel,
          grokMode,
          slopConfig,
          entropyLevel,
          straitjacketLevel,
          commandMode,
          useSearch,
        }}
        highThinking={highThinking}
        onMainPromptUpdate={(text) => setConcept(text)}
        onSynthesize={(prompt) => handleSynthesize(prompt)}
        onApplySettings={(settings) => {
          if (typeof settings.entropyLevel === 'number') setEntropyLevel(Math.max(1, Math.min(10, settings.entropyLevel)));
          if (typeof settings.targetLength === 'number') setTargetLength(settings.targetLength);
          if (settings.straitjacketLevel) setStraitjacketLevel(settings.straitjacketLevel as StraitjacketLevel);
          if (settings.commandMode) setCommandMode(settings.commandMode as CommandMode);
          if (settings.target) setTarget(settings.target as TargetEngine);
          if (settings.grokMode) setGrokMode(settings.grokMode as GrokMode);
          if (settings.openArtModel) setOpenArtModel(settings.openArtModel as OpenArtModel);
        }}
      />`;

    content = content.replace(consultRegex, replacement);
  }

  // Existing technical labs already have explicit APPLY buttons. Route those
  // completed section results through DAVID instead of replacing MAIN PROMPT.
  const applyRoutes = [
    [
      'onApplyPromptToInput={(rendered) => setConcept(rendered)}',
      `onApplyPromptToInput={(rendered) => dispatchDavidIntent({ source: 'discovery-lab', label: 'Discovery Lab Apply', committed: true, changes: { renderedPrompt: rendered } })}`,
    ],
    [
      'onApplyRenderedPrompt={(rendered) => setConcept(rendered)}',
      `onApplyRenderedPrompt={(rendered) => dispatchDavidIntent({ source: 'guidance-geometry', label: 'Guidance Geometry Apply', committed: true, changes: { renderedPrompt: rendered } })}`,
    ],
    [
      'onApplyMutatedPrompt={(mutated) => setConcept(mutated)}',
      `onApplyMutatedPrompt={(mutated) => dispatchDavidIntent({ source: 'serialization-diagnostics', label: 'Serialization Apply', committed: true, changes: { renderedPrompt: mutated } })}`,
    ],
  ];

  for (const [from, to] of applyRoutes) {
    if (content.includes(from)) content = content.replace(from, to);
  }

  // There are multiple onApplyRenderedPrompt callbacks. The first replacement
  // above handles Guidance Geometry; replace the remaining exact callbacks in
  // source order with section-specific DAVID intents.
  const genericRendered = 'onApplyRenderedPrompt={(rendered) => setConcept(rendered)}';
  if (content.includes(genericRendered)) {
    content = content.replace(
      genericRendered,
      `onApplyRenderedPrompt={(rendered) => dispatchDavidIntent({ source: 'structural-relational', label: 'Structural / Relational Apply', committed: true, changes: { renderedPrompt: rendered } })}`
    );
  }
  if (content.includes(genericRendered)) {
    content = content.replace(
      genericRendered,
      `onApplyRenderedPrompt={(rendered) => dispatchDavidIntent({ source: 'context-diagnostics', label: 'Context Diagnostics Apply', committed: true, changes: { renderedPrompt: rendered } })}`
    );
  }

  const oldZalgo = ` const handleInjectZalgo = (glitchText: string) => {
 setConcept((prev) => (prev ? \`${'${prev.trim()} ${glitchText}'}\` : glitchText));
 setZalgoOpen(false);
 };`;
  const newZalgo = ` const handleInjectZalgo = (glitchText: string) => {
 dispatchDavidIntent({
  source: 'zalgo-toolbox',
  label: 'Zalgo / Serialization Apply',
  committed: true,
  changes: { glitchText },
 });
 setZalgoOpen(false);
 };`;
  if (content.includes(oldZalgo)) content = content.replace(oldZalgo, newZalgo);

  fs.writeFileSync(appPath, content, 'utf8');
  console.log('[workbench-v2] mounted persistent app workbench + routed explicit APPLY actions through DAVID');
}

function patchPromptOwnership() {
  let content = fs.readFileSync(promptPath, 'utf8');

  if (!content.includes("../utils/davidWorkbenchBus")) {
    content = content.replace(
      "import { ModularPipelineSection } from './ModularPipelineSection';",
      "import { ModularPipelineSection } from './ModularPipelineSection';\nimport { dispatchDavidIntent } from '../utils/davidWorkbenchBus';"
    );
  }

  const ids = ['operative-concept-input', 'suno-style-seed-input', 'suno-lyrics-seed-input'];
  for (const id of ids) {
    const pattern = new RegExp(`(<textarea\\s+id=\\"${id}\\")(?![\\s\\S]{0,80}readOnly)`);
    content = content.replace(pattern, '$1\n readOnly');
  }

  content = content.replace('04 // CONCEPT SEED', '04 // MAIN PROMPT // DAVID OWNED');
  content = content.replace('Operative Concept:', 'MAIN PROMPT:');
  content = content.replace(
    'placeholder="Describe your desired sensory output, acoustic paradox, or visual topology..."',
    'placeholder="MAIN PROMPT is written by David in the app sidebar."'
  );

  // Quick injection chips are explicit completed actions, so they go through
  // David once instead of mutating the prompt string themselves.
  const insertTagRegex = / const handleInsertTag = \(tag: string\) => \{[\s\S]*?\n \};/m;
  if (insertTagRegex.test(content)) {
    content = content.replace(
      insertTagRegex,
      ` const handleInsertTag = (tag: string) => {
 dispatchDavidIntent({
  source: 'quick-injection',
  label: \`Quick Injection: \${tag}\`,
  committed: true,
  changes: { add: tag, target },
 });
 };`
    );
  }

  fs.writeFileSync(promptPath, content, 'utf8');
  console.log('[workbench-v2] marked visible prompt buffers as David-owned/read-only');
}

patchApp();
patchPromptOwnership();
