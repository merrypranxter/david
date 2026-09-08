const fs = require('fs');
let content = fs.readFileSync('src/components/DualOutputView.tsx', 'utf8');

content = content.replace(
    /<div className="absolute top-0 left-0 px-2 py-0\.5 bg-semantic-green text-theme-bg text-\[9px\] font-display uppercase tracking-widest font-bold">SYNTHESIS COMPLETE<\/div>/,
    '<div className="absolute top-0 left-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[9px] font-display uppercase tracking-widest font-bold">OUT // ORGANISM COMPILED</div>'
);

// also let's check for any other places to update
content = content.replace(/Dual Output Matrix/g, 'SYNTHETIC SPECIMEN DATA');

fs.writeFileSync('src/components/DualOutputView.tsx', content, 'utf8');
