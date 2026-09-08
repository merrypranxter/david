const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Remove border-phosphor/\d+ if terminal-border is on the same line
    content = content.replace(/(class|className)="[^"]*"/g, (match) => {
        if (match.includes('terminal-border') && match.match(/border-phosphor\/\d+/)) {
            return match.replace(/border-phosphor\/\d+/g, '').replace(/\s+/g, ' ');
        }
        return match;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
