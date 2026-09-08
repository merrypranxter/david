const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

// 1. Update import
content = content.replace(
    /import \{ MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE \} from '\.\/davidModules';/,
    `import { MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE } from './davidModules';`
);

// 2. Append to system instruction
content = content.replace(
    /\$\{DAVID_SOUL_STEP_MODULE\}\n\`;/,
    `\${DAVID_SOUL_STEP_MODULE}\n\n\${MERRY_STRUCTURAL_PHYSICS_MODULE}\n\`;`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
