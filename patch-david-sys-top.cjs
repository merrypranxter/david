const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

content = content.replace(
    /export const DAVID_SYSTEM_INSTRUCTION = \`/,
    `export const DAVID_SYSTEM_INSTRUCTION = \`\n\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}\n\n\${DAVID_CONSULT_MODE_MODULE}\n\n`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
