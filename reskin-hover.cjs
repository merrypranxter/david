const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
        let cls = classes.split(' ');
        
        cls = cls.map(c => {
            if (c.match(/^hover:bg-zinc-/)) return 'hover:bg-phosphor/10';
            if (c.match(/^hover:text-zinc-[12]00/)) return 'hover:text-phosphor';
            if (c.match(/^hover:border-zinc-/)) return 'hover:border-phosphor/50';
            if (c.match(/^bg-zinc-/)) return 'bg-theme-panel';
            if (c.match(/^text-zinc-/)) return 'text-phosphor/80';
            if (c.match(/^border-zinc-/)) return 'border-phosphor/20 terminal-border';
            if (c.match(/^rounded/)) return ''; // remove remaining rounded
            if (c.match(/^bg-\[#0a0b10\]/)) return 'bg-theme-panel';
            
            // Re-apply remaining color cleanups
            if (c.match(/amber|emerald|rose|blue|purple/)) {
                 if (c.startsWith('text-emerald-')) return c.replace(/emerald-\d+/, 'semantic-green');
                 if (c.startsWith('bg-emerald-')) return c.replace(/emerald-\d+(\/\d+)?/, 'semantic-green/10');
                 if (c.startsWith('border-emerald-')) return c.replace(/emerald-\d+(\/\d+)?/, 'semantic-green/30 terminal-border');
                 if (c.startsWith('hover:bg-emerald-')) return c.replace(/emerald-\d+(\/\d+)?/, 'semantic-green/20');
                 if (c.startsWith('hover:text-emerald-')) return c.replace(/emerald-\d+/, 'semantic-green');

                 if (c.startsWith('text-amber-')) return c.replace(/amber-\d+/, 'semantic-yellow');
                 if (c.startsWith('bg-amber-')) return c.replace(/amber-\d+(\/\d+)?/, 'semantic-yellow/10');
                 if (c.startsWith('border-amber-')) return c.replace(/amber-\d+(\/\d+)?/, 'semantic-yellow/30 terminal-border');
                 if (c.startsWith('hover:bg-amber-')) return c.replace(/amber-\d+(\/\d+)?/, 'semantic-yellow/20');
                 if (c.startsWith('hover:text-amber-')) return c.replace(/amber-\d+/, 'semantic-yellow');

                 if (c.startsWith('text-rose-')) return c.replace(/rose-\d+/, 'semantic-red');
                 if (c.startsWith('bg-rose-')) return c.replace(/rose-\d+(\/\d+)?/, 'semantic-red/10');
                 if (c.startsWith('border-rose-')) return c.replace(/rose-\d+(\/\d+)?/, 'semantic-red/30 terminal-border');
                 if (c.startsWith('hover:bg-rose-')) return c.replace(/rose-\d+(\/\d+)?/, 'semantic-red/20');
                 if (c.startsWith('hover:text-rose-')) return c.replace(/rose-\d+/, 'semantic-red');

                 if (c.startsWith('text-blue-')) return c.replace(/blue-\d+/, 'semantic-cyan');
                 if (c.startsWith('bg-blue-')) return c.replace(/blue-\d+(\/\d+)?/, 'semantic-cyan/10');
                 if (c.startsWith('border-blue-')) return c.replace(/blue-\d+(\/\d+)?/, 'semantic-cyan/30 terminal-border');
                 if (c.startsWith('hover:bg-blue-')) return c.replace(/blue-\d+(\/\d+)?/, 'semantic-cyan/20');
                 if (c.startsWith('hover:text-blue-')) return c.replace(/blue-\d+/, 'semantic-cyan');

                 if (c.startsWith('text-purple-')) return c.replace(/purple-\d+/, 'semantic-violet');
                 if (c.startsWith('bg-purple-')) return c.replace(/purple-\d+(\/\d+)?/, 'semantic-violet/10');
                 if (c.startsWith('border-purple-')) return c.replace(/purple-\d+(\/\d+)?/, 'semantic-violet/30 terminal-border');
                 if (c.startsWith('hover:bg-purple-')) return c.replace(/purple-\d+(\/\d+)?/, 'semantic-violet/20');
                 if (c.startsWith('hover:text-purple-')) return c.replace(/purple-\d+/, 'semantic-violet');
            }
            return c;
        }).filter(c => c !== '');
        
        // Remove redundant terminal-border
        cls = [...new Set(cls)];

        return `className=${quote}${cls.join(' ')}${quote}`;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
