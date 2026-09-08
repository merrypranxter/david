const fs = require('fs');
const text = fs.readFileSync('david_orchestration.txt', 'utf8');

const output = `
export const DAVID_CEREBRAL_WIRING_MODULE = \`
${text.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
