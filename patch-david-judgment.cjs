const fs = require('fs');
const judgmentText = fs.readFileSync('david_judgment.txt', 'utf8');

const output = `
export const DAVID_CREATIVE_JUDGMENT_MODULE = \`
${judgmentText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
