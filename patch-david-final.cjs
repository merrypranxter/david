const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

// 1. Update import
content = content.replace(
    /import \{ MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE \} from '\.\/davidModules';/,
    `import { MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE, DAVID_FINAL_META_RULES_MODULE } from './davidModules';`
);

// 2. Append to system instruction
content = content.replace(
    /\$\{MERRY_STRUCTURAL_PHYSICS_MODULE\}\n\`;/,
    `\${MERRY_STRUCTURAL_PHYSICS_MODULE}\n\n\${DAVID_FINAL_META_RULES_MODULE}\n\`;`
);

// 3. Update task json instruction to mention meta-rules checking 
// (Optional but good, though I'll just leave it or slightly modify step 0)
content = content.replace(
    /If MERRY SELF-TRANSFORMATION or STRUCTURAL PHYSICS applies, verify that abstract math\/science has been fully translated into structural\/material causality here\./,
    `If MERRY SELF-TRANSFORMATION or STRUCTURAL PHYSICS applies, verify that abstract math/science has been fully translated into structural/material causality here. Finally, verify compliance with DAVID FINAL META-RULES (e.g., The Scope Firewall, Taste is not Motif, Emergent Leap).`
);


fs.writeFileSync('lib/david.ts', content, 'utf8');
