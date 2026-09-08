const fs = require('fs');
const calibText = fs.readFileSync('merry_calibration.txt', 'utf8');

const output = `
export const DAVID_MERRY_CALIBRATION_MODULE = \`
${calibText.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
