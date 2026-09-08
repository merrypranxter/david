const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('onApplySettings={(settings) => {')) {
  console.log('[consult-workbench] already wired');
  process.exit(0);
}

const oldBlock = `      <ConsultChat \n        isOpen={consultChatOpen} \n        onClose={() => setConsultChatOpen(false)} \n        currentState={{ concept, target, targetLength, openArtModel, grokMode, slopConfig, entropyLevel, straitjacketLevel }}\n        highThinking={highThinking}\n      />`;

const newBlock = `      <ConsultChat \n        isOpen={consultChatOpen} \n        onClose={() => setConsultChatOpen(false)} \n        currentState={{ concept, target, targetLength, openArtModel, grokMode, slopConfig, entropyLevel, straitjacketLevel, commandMode }}\n        highThinking={highThinking}\n        onApplyConcept={(text) => setConcept(text)}\n        onApplySettings={(settings) => {\n          if (typeof settings.entropyLevel === 'number') setEntropyLevel(Math.max(1, Math.min(10, settings.entropyLevel)));\n          if (typeof settings.targetLength === 'number') setTargetLength(settings.targetLength);\n          if (settings.straitjacketLevel) setStraitjacketLevel(settings.straitjacketLevel as StraitjacketLevel);\n          if (settings.commandMode) setCommandMode(settings.commandMode as CommandMode);\n          if (settings.target) setTarget(settings.target as TargetEngine);\n          if (settings.grokMode) setGrokMode(settings.grokMode as GrokMode);\n          if (settings.openArtModel) setOpenArtModel(settings.openArtModel as OpenArtModel);\n        }}\n      />`;

if (!content.includes(oldBlock)) {
  console.error('[consult-workbench] ConsultChat mount shape not found; no changes made');
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(path, content, 'utf8');
console.log('[consult-workbench] wired ConsultChat to live app state');
