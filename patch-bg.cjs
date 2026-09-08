const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/bg-\[#[a-fA-F0-9]{6}\](?:\/\d+)?/g, (match) => {
        if (match.includes('08090e') || match.includes('0c0e16') || match.includes('0a0b10') || match.includes('0c0d12')) {
            return 'bg-theme-bg';
        }
        return 'bg-theme-panel';
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
