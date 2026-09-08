const fs = require('fs');
const text = fs.readFileSync('david_data_contracts.txt', 'utf8');

const output = `
export const DAVID_DATA_CONTRACTS_MODULE = \`
${text.replace(/`/g, '\\`')}
\`;
`;

fs.appendFileSync('lib/davidModules.ts', output, 'utf8');
