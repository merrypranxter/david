const fs = require('fs');
const cogText = fs.readFileSync('david_cognitive.txt', 'utf8');

const output = `
export const DAVID_COGNITIVE_TEMPERAMENT_MODULE = \`
${cogText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
