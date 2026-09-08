const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the davidState logic
content = content.replace(/let davidState:[\s\S]*?\n  const hasReference =/s, `
  let davidState: 'IDLE' | 'READY' | 'SYNTHESIZING' | 'COMPLETE' | 'ERROR' = 'IDLE';
  if (errorMessage) {
    davidState = 'ERROR';
  } else if (isSynthesizing) {
    davidState = 'SYNTHESIZING';
  } else if (currentResult) {
    davidState = 'COMPLETE';
  } else if (!isConceptEmpty) {
    davidState = 'READY';
  }
  
  const hasReference =`);

content = content.replace(/<span className="font-bold block uppercase tracking-wider">Synthesis Protocol Status<\/span>/, `<span className="font-bold block uppercase tracking-wider">ERR // SYNTHESIS INTERRUPTED</span>`);

fs.writeFileSync('src/App.tsx', content, 'utf8');
