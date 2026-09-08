const fs = require('fs');
const metaText = fs.readFileSync('meta_rules.txt', 'utf8');

const output = `
export const DAVID_FINAL_META_RULES_MODULE = \`
${metaText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
