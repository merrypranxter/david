const fs = require('fs');

let content = fs.readFileSync('lib/david.ts', 'utf8');

// Find where DAVID_SYSTEM_INSTRUCTION ends
// It ends with: "Holy shit, that went somewhere."\`;
const searchString = '"Holy shit, that went somewhere."\n`;';

content = content.replace(searchString, `"Holy shit, that went somewhere."

\${MERRY_SELF_TRANSFORM_MODULE}
\`;`);

fs.writeFileSync('lib/david.ts', content, 'utf8');
