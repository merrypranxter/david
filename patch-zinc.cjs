const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/placeholder-zinc-[0-9]+/g, 'placeholder-phosphor/50');
    content = content.replace(/from-zinc-[0-9]+\/\d+ to-zinc-[0-9]+\/\d+/g, 'from-theme-panel to-theme-bg');
    content = content.replace(/text-zinc-[0-9]+/g, 'text-theme-bg');
    content = content.replace(/divide-zinc-[0-9]+\/\d+/g, 'divide-phosphor/20');
    content = content.replace(/border-zinc-[0-9]+/g, 'border-phosphor/30 terminal-border');

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
