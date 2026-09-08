const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

content = content.replace(
    /\$\{MERRY_STRUCTURAL_PHYSICS_MODULE\}/,
    `\${MERRY_STRUCTURAL_PHYSICS_MODULE}\n\n\${DAVID_FINAL_META_RULES_MODULE}`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
