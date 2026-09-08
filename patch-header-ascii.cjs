const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// import AsciiOrnament
if (!content.includes('AsciiOrnament')) {
    content = content.replace(/import React from 'react';/, "import React from 'react';\nimport { AsciiOrnament } from './AsciiOrnament';");
}

// Add it to the header next to "DAVID 8"
content = content.replace(/<span>DAVID 8<\/span>/, `<span>DAVID 8</span>\n                  <AsciiOrnament davidState={davidState} className="text-phosphor/40 ml-2" />`);

fs.writeFileSync('src/components/Header.tsx', content, 'utf8');
