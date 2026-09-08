const fs = require('fs');
const text = fs.readFileSync('david_model_translator.txt', 'utf8');

const output = `
export const DAVID_MODEL_TRANSLATOR_MODULE = \`
${text.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
