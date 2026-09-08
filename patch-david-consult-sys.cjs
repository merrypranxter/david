const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

// 1. Update import
content = content.replace(
    /import \{ MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE, DAVID_FINAL_META_RULES_MODULE, DAVID_LAB_BRAIN_MODULE, DAVID_MERRY_CALIBRATION_MODULE, DAVID_COGNITIVE_TEMPERAMENT_MODULE \} from '\.\/davidModules';/,
    `import { MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE, DAVID_FINAL_META_RULES_MODULE, DAVID_LAB_BRAIN_MODULE, DAVID_MERRY_CALIBRATION_MODULE, DAVID_COGNITIVE_TEMPERAMENT_MODULE, DAVID_CONSULT_MODE_MODULE } from './davidModules';`
);

// 2. Append to system instruction right after cognitive temperament
content = content.replace(
    /\$\{DAVID_COGNITIVE_TEMPERAMENT_MODULE\}\n\n/,
    `\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}\n\n\${DAVID_CONSULT_MODE_MODULE}\n\n`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
