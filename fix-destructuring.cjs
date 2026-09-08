const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

// Find the line with onSynthesize in the component parameter destructuring
content = content.replace(
  /onSynthesize,\n\s*isSynthesizing,/,
  'onSynthesize,\n  onConsult,\n  isSynthesizing,'
);
// Also try matching space instead of newline
content = content.replace(
  /onSynthesize, isSynthesizing,/,
  'onSynthesize, onConsult, isSynthesizing,'
);

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
