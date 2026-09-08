const fs = require('fs');
const text = fs.readFileSync('david_ui_language.txt', 'utf8');

const output = `
export const DAVID_CONTROL_SURFACE_MODULE = \`
${text.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
