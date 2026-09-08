const fs = require('fs');
let content = fs.readFileSync('lib/david.ts', 'utf8');

// 1. Update import
content = content.replace(
    /import \{ MERRY_SELF_TRANSFORM_MODULE \} from '\.\/davidModules';/,
    `import { MERRY_SELF_TRANSFORM_MODULE, DAVID_SOUL_STEP_MODULE } from './davidModules';`
);

// 2. Append to system instruction
content = content.replace(
    /\$\{MERRY_SELF_TRANSFORM_MODULE\}\n\`;/,
    `\${MERRY_SELF_TRANSFORM_MODULE}\n\n\${DAVID_SOUL_STEP_MODULE}\n\`;`
);

// 3. Update task json instruction (the step 0 reasoning field)
content = content.replace(
    /0\. Provide \[selfTransformReasoning\] \(string\) - If the MERRY SELF-TRANSFORMATION module applies, you MUST use this field to perform the 10-step self-check and reason about causal mechanism mapping before writing the prompts\. If it does not apply, output "N\/A"\./,
    `0. Provide [davidSoulStep] (string) - MANDATORY. You MUST perform THE SOUL STEP here. Analyze the selected seeds as FORCES. Trace causality (how Seed A modifies Seed B) and derive physical consequences BEFORE writing the final prompts. Build the system relationships. If MERRY SELF-TRANSFORMATION applies, execute its 10-step check here as well.`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
