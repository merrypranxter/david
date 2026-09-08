const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Replace typical output box styles with specimen-chamber where it makes sense
    content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
        if (classes.includes('max-h-') && classes.includes('overflow-y-auto') && (classes.includes('bg-theme-bg') || classes.includes('bg-theme-panel'))) {
            if (!classes.includes('specimen-chamber')) {
                // If it's a code or pre or just a big output block, let's add specimen-chamber and remove bg-theme-bg/bg-theme-panel and border-phosphor/20
                let newClasses = classes.split(' ').filter(c => 
                    !c.match(/^bg-theme-/) && 
                    !c.match(/^border-phosphor/) &&
                    c !== 'terminal-border'
                ).join(' ');
                newClasses = 'specimen-chamber terminal-border ' + newClasses;
                return `className=${quote}${newClasses}${quote}`;
            }
        }
        
        // Let's also fix redundant terminal-border terminal-border
        classes = classes.replace(/terminal-border terminal-border/g, 'terminal-border');
        
        return `className=${quote}${classes}${quote}`;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = [
    'src/components/GuidanceGeometryPanel.tsx',
    'src/components/ManifestoModal.tsx',
    'src/components/SimulatorModal.tsx',
    'src/components/SlopMethodsTab.tsx',
    'src/components/SlopRecipeModal.tsx',
    'src/components/SlopVaultModal.tsx',
    'src/components/StructuralRelationalPanel.tsx',
    'src/components/ZalgoToolbox.tsx',
    'src/components/EvolutionLineageView.tsx',
    'src/components/MutantFamilyView.tsx'
];

files.forEach(processFile);
