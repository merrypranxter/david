const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/accent-(emerald|rose|amber|cyan|purple|green|red|blue|yellow)-\d{3}/g, (match, color) => {
        if (color === 'emerald' || color === 'green') return 'accent-semantic-green';
        if (color === 'rose' || color === 'red') return 'accent-semantic-red';
        if (color === 'amber' || color === 'yellow') return 'accent-semantic-yellow';
        if (color === 'cyan' || color === 'blue') return 'accent-semantic-cyan';
        if (color === 'purple') return 'accent-semantic-violet';
        return match;
    });

    content = content.replace(/ring-(emerald|rose|amber|cyan|purple|green|red|blue|yellow)-\d{3}(\/\d{2,3})?/g, (match, color, opacity) => {
        let sem = '';
        if (color === 'emerald' || color === 'green') sem = 'semantic-green';
        else if (color === 'rose' || color === 'red') sem = 'semantic-red';
        else if (color === 'amber' || color === 'yellow') sem = 'semantic-yellow';
        else if (color === 'cyan' || color === 'blue') sem = 'semantic-cyan';
        else if (color === 'purple') sem = 'semantic-violet';
        return sem ? `ring-${sem}${opacity || ''}` : match;
    });

    content = content.replace(/fill-(emerald|rose|amber|cyan|purple|green|red|blue|yellow)-\d{3}/g, (match, color) => {
        if (color === 'emerald' || color === 'green') return 'fill-semantic-green';
        if (color === 'rose' || color === 'red') return 'fill-semantic-red';
        if (color === 'amber' || color === 'yellow') return 'fill-semantic-yellow';
        if (color === 'cyan' || color === 'blue') return 'fill-semantic-cyan';
        if (color === 'purple') return 'fill-semantic-violet';
        return match;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
