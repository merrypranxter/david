const fs = require('fs');
const consultText = fs.readFileSync('david_consult.txt', 'utf8');

const output = `
export const DAVID_CONSULT_MODE_MODULE = \`
${consultText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
