const fs = require('fs');

const colorRegex = /var\(--color-semantic-(cyan|magenta|violet|green|yellow)(-[0-9]+)?\)/g;

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(colorRegex, 'var(--color-phosphor$2)');
    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
