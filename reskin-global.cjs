const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Global naive replacements
    const replacements = {
        'bg-zinc-950': 'bg-theme-bg',
        'bg-zinc-900': 'bg-theme-panel',
        'bg-zinc-800': 'bg-theme-panel',
        'bg-zinc-700': 'bg-theme-panel',
        'bg-zinc-900/90': 'bg-theme-bg',
        'bg-zinc-900/80': 'bg-theme-panel',
        'bg-zinc-900/70': 'bg-theme-panel',
        'bg-zinc-900/60': 'bg-theme-panel',
        'bg-zinc-900/50': 'bg-theme-panel',
        'bg-zinc-900/40': 'bg-theme-panel',
        'bg-zinc-800/80': 'bg-theme-panel',
        'bg-zinc-800/70': 'bg-theme-panel',
        'bg-zinc-800/60': 'bg-theme-panel',
        'bg-zinc-800/50': 'bg-theme-panel',
        'bg-zinc-800/40': 'bg-theme-panel',
        'bg-zinc-700/80': 'bg-theme-panel',
        
        'hover:bg-zinc-950': 'hover:bg-theme-bg',
        'hover:bg-zinc-900': 'hover:bg-phosphor/10',
        'hover:bg-zinc-800': 'hover:bg-phosphor/10',
        'hover:bg-zinc-700': 'hover:bg-phosphor/10',
        
        'text-zinc-100': 'text-phosphor',
        'text-zinc-200': 'text-phosphor',
        'text-zinc-300': 'text-phosphor/80',
        'text-zinc-400': 'text-phosphor/80',
        'text-zinc-500': 'text-phosphor/50',
        
        'hover:text-zinc-100': 'hover:text-phosphor',
        'hover:text-zinc-200': 'hover:text-phosphor',
        'hover:text-zinc-300': 'hover:text-phosphor/80',
        'hover:text-zinc-400': 'hover:text-phosphor/80',

        'border-zinc-800/80': 'border-phosphor/20 terminal-border',
        'border-zinc-800/70': 'border-phosphor/20 terminal-border',
        'border-zinc-800/60': 'border-phosphor/20 terminal-border',
        'border-zinc-800/50': 'border-phosphor/20 terminal-border',
        'border-zinc-800/40': 'border-phosphor/20 terminal-border',
        'border-zinc-800': 'border-phosphor/20 terminal-border',
        'border-zinc-700': 'border-phosphor/20 terminal-border',
        'border-zinc-900': 'border-phosphor/20 terminal-border',
        
        'hover:border-zinc-800': 'hover:border-phosphor/50',
        'hover:border-zinc-700': 'hover:border-phosphor/50',
        
        'bg-[#0a0b10]': 'bg-theme-panel',
        'bg-[#0c0e17]': 'bg-theme-bg'
    };

    for (const [key, val] of Object.entries(replacements)) {
        // use regex to only match whole words
        const regex = new RegExp(`(?<![a-zA-Z0-9_-])${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![a-zA-Z0-9_-])`, 'g');
        content = content.replace(regex, val);
    }
    
    // Replace rounded classes (rounded, rounded-lg, rounded-xl, rounded-md, rounded-t-lg, etc)
    content = content.replace(/(?<![a-zA-Z0-9_-])rounded(?:-[a-z]+)*\b/g, '');

    // Now replace semantic colors globally
    content = content.replace(/(text|bg|border|hover:text|hover:bg|hover:border)-(emerald|amber|rose|blue|purple)-(\d+)(\/\d+)?/g, (match, prefix, color, shade, alpha) => {
        let semanticColor = '';
        if (color === 'emerald') semanticColor = 'semantic-green';
        if (color === 'amber') semanticColor = 'semantic-yellow';
        if (color === 'rose') semanticColor = 'semantic-red';
        if (color === 'blue') semanticColor = 'semantic-cyan';
        if (color === 'purple') semanticColor = 'semantic-violet';
        
        if (prefix === 'text' || prefix === 'hover:text') return `${prefix}-${semanticColor}`;
        if (prefix === 'bg' || prefix === 'hover:bg') return `${prefix}-${semanticColor}/10`;
        if (prefix === 'border' || prefix === 'hover:border') return `${prefix}-${semanticColor}/30 terminal-border`;
        return match;
    });

    // Cleanup double spaces
    content = content.replace(/ +/g, ' ');

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
