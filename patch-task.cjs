const fs = require('fs');

let content = fs.readFileSync('lib/david.ts', 'utf8');

// Update the step 0 reasoning field to mention the physics module
content = content.replace(
    /If MERRY SELF-TRANSFORMATION applies, execute its 10-step check here as well\./,
    `If MERRY SELF-TRANSFORMATION or STRUCTURAL PHYSICS applies, verify that abstract math/science has been fully translated into structural/material causality here.`
);

fs.writeFileSync('lib/david.ts', content, 'utf8');
