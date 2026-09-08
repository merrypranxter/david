const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

// Remove the CONSULT button
const buttonRegex = /<button[^>]+onClick=\{onConsult\}[^>]*>[\s\S]*?<\/button>/;
content = content.replace(buttonRegex, '');

// Remove onConsult from destructuring and interface to clean up
content = content.replace(/\s*onConsult:\s*\(\)\s*=>\s*void;/, '');
content = content.replace(/,\s*onConsult,/, ',');

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
