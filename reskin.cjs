const fs = require('fs');

const path = process.argv[2];
let content = fs.readFileSync(path, 'utf8');

// Replace classes in className="..."
content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
    let cls = classes.split(' ');
    
    // Remove rounded
    cls = cls.filter(c => !c.startsWith('rounded'));
    
    // Replace zinc backgrounds
    cls = cls.map(c => {
        if (c.match(/^bg-zinc-950/)) return 'bg-theme-bg';
        if (c.match(/^bg-zinc-/)) return 'bg-theme-panel';
        if (c.match(/^text-zinc-[12]00/)) return 'text-phosphor';
        if (c.match(/^text-zinc-[34]00/)) return 'text-phosphor/80';
        if (c.match(/^text-zinc-500/)) return 'text-phosphor/50';
        if (c.match(/^border-zinc-/)) return 'border-phosphor/20 terminal-border';
        
        // Semantic colors
        if (c.startsWith('text-emerald-')) return c.replace(/emerald-\d+/, 'semantic-green');
        if (c.startsWith('bg-emerald-')) return c.replace(/emerald-\d+(\/\d+)?/, 'semantic-green/10');
        if (c.startsWith('border-emerald-')) return c.replace(/emerald-\d+(\/\d+)?/, 'semantic-green/30 terminal-border');
        
        if (c.startsWith('text-amber-')) return c.replace(/amber-\d+/, 'semantic-yellow');
        if (c.startsWith('bg-amber-')) return c.replace(/amber-\d+(\/\d+)?/, 'semantic-yellow/10');
        if (c.startsWith('border-amber-')) return c.replace(/amber-\d+(\/\d+)?/, 'semantic-yellow/30 terminal-border');
        
        if (c.startsWith('text-rose-')) return c.replace(/rose-\d+/, 'semantic-red');
        if (c.startsWith('bg-rose-')) return c.replace(/rose-\d+(\/\d+)?/, 'semantic-red/10');
        if (c.startsWith('border-rose-')) return c.replace(/rose-\d+(\/\d+)?/, 'semantic-red/30 terminal-border');
        
        if (c.startsWith('text-blue-')) return c.replace(/blue-\d+/, 'semantic-cyan');
        if (c.startsWith('bg-blue-')) return c.replace(/blue-\d+(\/\d+)?/, 'semantic-cyan/10');
        if (c.startsWith('border-blue-')) return c.replace(/blue-\d+(\/\d+)?/, 'semantic-cyan/30 terminal-border');
        
        if (c.startsWith('text-purple-')) return c.replace(/purple-\d+/, 'semantic-violet');
        if (c.startsWith('bg-purple-')) return c.replace(/purple-\d+(\/\d+)?/, 'semantic-violet/10');
        if (c.startsWith('border-purple-')) return c.replace(/purple-\d+(\/\d+)?/, 'semantic-violet/30 terminal-border');

        return c;
    });

    // Make sure we have terminal-border if we have border
    if (cls.some(c => c.startsWith('border')) && !cls.includes('terminal-border') && !cls.includes('border-none')) {
        cls.push('terminal-border');
    }

    // Convert font-mono to font-display for headers/labels if they are uppercase
    // Actually, maybe too complex for regex.
    
    // Deduplicate
    cls = [...new Set(cls)];
    
    return `className=${quote}${cls.join(' ')}${quote}`;
});

fs.writeFileSync(path, content, 'utf8');
