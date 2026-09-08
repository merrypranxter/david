const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/THE MATH HAS ENTERED THE FACE &bull; SEMANTIC DRIFT IN PROGRESS/, 'EXTRACTING SCALPEL &bull; INJECTING DELUGE');

fs.writeFileSync('src/App.tsx', content, 'utf8');
