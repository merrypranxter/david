const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

content = content.replace(/&bull; \{note\}/g, `<span className="font-bold">WRN //</span> {note}`);

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
