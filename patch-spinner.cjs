const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

content = content.replace(/border-theme-bg border-t-transparent/g, 'border-phosphor/50 border-t-transparent');
fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
