const fs = require('fs');

let content = fs.readFileSync('lib/david.ts', 'utf8');

const searchString = `Synthesize the machine-native prompt translation according to the Weyland-Yutani David 8 Protocol:
1. Provide the [LITERAL] version`;

const replacementString = `Synthesize the machine-native prompt translation according to the Weyland-Yutani David 8 Protocol:
0. Provide [selfTransformReasoning] (string) - If the MERRY SELF-TRANSFORMATION module applies, you MUST use this field to perform the 10-step self-check and reason about causal mechanism mapping before writing the prompts. If it does not apply, output "N/A".
1. Provide the [LITERAL] version`;

content = content.replace(searchString, replacementString);

fs.writeFileSync('lib/david.ts', content, 'utf8');
