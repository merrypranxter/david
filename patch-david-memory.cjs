const fs = require('fs');
const text = fs.readFileSync('david_memory.txt', 'utf8');

const output = `
export const DAVID_EXPERIMENTAL_MEMORY_MODULE = \`
${text.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
