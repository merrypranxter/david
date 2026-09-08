const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Insert variables into body
content = content.replace(/body \{/, `body {
  --phosphor-bright: color-mix(in srgb, var(--phosphor) 85%, white);
  --phosphor-dim: color-mix(in srgb, var(--phosphor) 50%, transparent);
  --phosphor-muted: color-mix(in srgb, var(--phosphor) 20%, transparent);
`);

// Add to theme
content = content.replace(/--color-phosphor: var\(--phosphor\);/, `--color-phosphor: var(--phosphor);
  --color-phosphor-bright: var(--phosphor-bright);
  --color-phosphor-dim: var(--phosphor-dim);
  --color-phosphor-muted: var(--phosphor-muted);`);

fs.writeFileSync('src/index.css', content, 'utf8');
