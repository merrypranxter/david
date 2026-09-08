const fs = require('fs');

const colorRegex = /(text|bg|border|fill|ring|accent|hover:text|hover:bg|hover:border)-indigo-\d{3}(\/\d{2,3})?/g;

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(colorRegex, (match, prefix, opacity) => {
        return `${prefix}-phosphor${opacity || ''}`;
    });

    fs.writeFileSync(path, content, 'utf8');
}

const files = fs.readdirSync('src/components/').filter(f => f.endsWith('.tsx')).map(f => 'src/components/' + f);
files.push('src/App.tsx');
files.forEach(processFile);
