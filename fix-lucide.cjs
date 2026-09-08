const fs = require('fs');
let text = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');
text = text.replace(/Layers,\s*,\s*MessageSquare/g, 'Layers, MessageSquare');
fs.writeFileSync('src/components/PromptInputArea.tsx', text, 'utf8');
