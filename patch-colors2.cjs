const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Handle generic hardcoded tailwind colors mapped to semantic equivalents
    const colorMap = {
        'cyan': 'semantic-cyan',
        'emerald': 'semantic-green',
        'amber': 'semantic-yellow',
        'yellow': 'semantic-yellow',
        'rose': 'semantic-red',
        'red': 'semantic-red',
        'blue': 'semantic-cyan',
        'purple': 'semantic-violet',
        'fuchsia': 'semantic-magenta',
        'sky': 'semantic-cyan',
        'green': 'semantic-green'
    };

    for (const [twColor, semColor] of Object.entries(colorMap)) {
        // e.g. text-cyan-400 -> text-semantic-cyan
        // bg-cyan-500/20 -> bg-semantic-cyan/20
        // border-cyan-500/40 -> border-semantic-cyan/40 terminal-border
        
        // This is a bit tricky, let's use a function to properly replace
        const regex = new RegExp(`(text|bg|border|hover:text|hover:bg|hover:border|from|to|via)-${twColor}-\\d{2,3}(\\/\\d{2,3})?`, 'g');
        content = content.replace(regex, (match, prefix, opacity) => {
            if (prefix.includes('text')) return `${prefix}-${semColor}`;
            if (prefix.includes('bg') || prefix.includes('from') || prefix.includes('to') || prefix.includes('via')) return `${prefix}-${semColor}${opacity || '/10'}`;
            if (prefix.includes('border')) {
                // to avoid double terminal-border we just return the border color. We'll append terminal-border if needed.
                return `${prefix}-${semColor}${opacity || '/30'}`;
            }
            return match;
        });
    }

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
