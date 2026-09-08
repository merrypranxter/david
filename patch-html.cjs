const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/class="bg-\[#0c0d12\] text-\[#e2e8f0\] font-sans antialiased selection:bg-amber-500\/30 selection:text-amber-200"/, 'class="bg-theme-bg text-phosphor font-sans antialiased selection:bg-phosphor/30 selection:text-phosphor"');

fs.writeFileSync('index.html', content, 'utf8');
