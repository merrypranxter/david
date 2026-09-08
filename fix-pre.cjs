const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/<pre className=(["'])(.*?)\1/g, (match, quote, classes) => {
        let newClasses = classes.split(' ').filter(c => 
            !c.match(/^bg-theme-/) && 
            !c.match(/^border-phosphor/) &&
            !c.match(/^bg-zinc-/) &&
            !c.match(/^border-zinc-/) &&
            c !== 'terminal-border'
        ).join(' ');
        
        if (!newClasses.includes('specimen-chamber')) {
            newClasses = 'specimen-chamber terminal-border ' + newClasses;
        }
        return `<pre className=${quote}${newClasses}${quote}`;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = [
    'src/components/ExperimentMemoryModal.tsx',
    'src/components/GuidanceGeometryPanel.tsx',
    'src/components/SlopMethodsTab.tsx',
    'src/components/StructuralRelationalPanel.tsx'
];

files.forEach(processFile);
