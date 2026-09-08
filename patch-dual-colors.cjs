const fs = require('fs');
let content = fs.readFileSync('src/components/DualOutputView.tsx', 'utf8');

// The prompt text containers:
content = content.replace(/text-semantic-(cyan|magenta)\/90/g, 'text-phosphor/90');
content = content.replace(/text-semantic-white/g, 'text-phosphor/90');

fs.writeFileSync('src/components/DualOutputView.tsx', content, 'utf8');
