const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

// 1. Update import
content = content.replace(
    /import \{ MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE, DAVID_FINAL_META_RULES_MODULE, DAVID_LAB_BRAIN_MODULE, DAVID_MERRY_CALIBRATION_MODULE \} from '\.\/davidModules';/,
    `import { MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE, MERRY_STRUCTURAL_PHYSICS_MODULE, DAVID_FINAL_META_RULES_MODULE, DAVID_LAB_BRAIN_MODULE, DAVID_MERRY_CALIBRATION_MODULE, DAVID_COGNITIVE_TEMPERAMENT_MODULE } from './davidModules';`
);

// 2. Append to system instruction - putting it at the very top of the rules since it defines WHO he is.
content = content.replace(
    /const DAVID_SYSTEM_INSTRUCTION = `\n/,
    `const DAVID_SYSTEM_INSTRUCTION = \`\n\${DAVID_COGNITIVE_TEMPERAMENT_MODULE}\n\n`
);

// 3. Update the davidSoulStep description to mandate CREATE, SABOTAGE, EDIT.
content = content.replace(
    /0\. Provide \[davidSoulStep\] \(string\) - MANDATORY\. You MUST perform THE SOUL STEP here\. Analyze the selected seeds as FORCES\. Trace causality \(how Seed A modifies Seed B\) and derive physical consequences BEFORE writing the final prompts\. Build the system relationships\. If MERRY SELF-TRANSFORMATION or STRUCTURAL PHYSICS applies, verify that abstract math\/science has been fully translated into structural\/material causality here\. Finally, verify compliance with DAVID FINAL META-RULES \(e\.g\., The Scope Firewall, Taste is not Motif, Emergent Leap\)\./,
    `0. Provide [davidSoulStep] (string) - MANDATORY. You MUST perform THE INTERNAL THREE-PASS SYSTEM here (CREATE -> SABOTAGE -> EDIT). First, perform THE SOUL STEP: Analyze the selected seeds as FORCES, trace causality (how Seed A modifies Seed B), and derive physical consequences. Build the system relationships. Verify abstract math/science translates into structural/material causality. Second, perform THE SABOTEUR PASS: find laziness, cliché, escape routes, and weak semantic load. Third, perform THE EDITOR PASS: trim sludge, remove sycophancy, and protect the signal. Finally, verify compliance with DAVID FINAL META-RULES.`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
