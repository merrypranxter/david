const fs = require('fs');
const promptArchText = fs.readFileSync('david_prompt_architecture.txt', 'utf8');

const output = `
export const DAVID_PROMPT_ARCHITECTURE_MODULE = \`
${promptArchText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
