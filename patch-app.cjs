const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert logic to compute davidState and other states before returning
const computeLogic = `
  const isConceptEmpty = !concept.trim();
  let davidState: 'IDLE' | 'READY' | 'SYNTHESIZING' | 'COMPLETE' | 'ERROR' = 'IDLE';
  if (isSynthesizing) {
    davidState = 'SYNTHESIZING';
  } else if (currentResult) {
    davidState = 'COMPLETE';
  } else if (!isConceptEmpty) {
    davidState = 'READY';
  }
  
  const hasReference = slopConfig.protectedAnchors?.length > 0 || concept.includes('@merry');
  const isTransforming = (slopConfig.contradictionMode && slopConfig.enableParadoxEngine) || ['misinterpret', 'destabilize'].includes(straitjacketLevel);
  const hasOperators = slopConfig.selectedOperators?.length > 0;
`;

// Insert the logic before `return (`
content = content.replace(/return \(\s*<div className="min-h-screen/s, (match) => {
    return computeLogic + '\n' + match;
});

// Update the Header usage to pass the props
content = content.replace(/<Header[\s\S]*?\/>/, (match) => {
    // Add props
    return match.replace(/\/>/, `  davidState={davidState}
  hasReference={hasReference}
  isTransforming={isTransforming}
  hasOperators={hasOperators}
/>`);
});

// Change the synthesize button text based on davidState
// Wait, the synthesize button is in PromptInputArea. Let's pass davidState there too!
content = content.replace(/<PromptInputArea/, `<PromptInputArea davidState={davidState}`);

fs.writeFileSync('src/App.tsx', content, 'utf8');
