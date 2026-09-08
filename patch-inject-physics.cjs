const fs = require('fs');

let content = fs.readFileSync('lib/david.ts', 'utf8');

// Find where DAVID_SYSTEM_INSTRUCTION ends
const searchString = `If the resulting prompt could plausibly have been produced simply by asking an AI to "make this more detailed," you have not transformed it enough.`;

content = content.replace(searchString, `${searchString}

\${MERRY_SELF_TRANSFORM_MODULE}

\${DAVID_SOUL_STEP_MODULE}

\${MERRY_STRUCTURAL_PHYSICS_MODULE}
`);

fs.writeFileSync('lib/david.ts', content, 'utf8');
