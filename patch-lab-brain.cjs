const fs = require('fs');
const labText = fs.readFileSync('lab_brain.txt', 'utf8');

const output = `
export const DAVID_LAB_BRAIN_MODULE = \`
${labText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
