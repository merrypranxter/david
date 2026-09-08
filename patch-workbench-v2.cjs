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
        onSynthesize={() => handleSynthesize()}
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

  fs.writeFileSync(appPath, content, 'utf8');
  console.log('[workbench-v2] mounted persistent app workbench');
}

function patchPromptOwnership() {
  let content = fs.readFileSync(promptPath, 'utf8');

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

  fs.writeFileSync(promptPath, content, 'utf8');
  console.log('[workbench-v2] marked visible prompt buffers as David-owned/read-only');
}

patchApp();
patchPromptOwnership();
