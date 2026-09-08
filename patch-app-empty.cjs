const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newIdle = `
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-theme-bg/50 border border-dashed border-phosphor/20 terminal-border">
          <div className="text-[10px] font-display font-bold uppercase tracking-widest text-phosphor/50 mb-1">SYSTEMS NOMINAL</div>
          <h3 className="text-sm font-mono text-phosphor uppercase tracking-widest">
            GOOD MORNING, MERRY.
          </h3>
          <p className="text-[11px] font-mono text-phosphor/70 max-w-md uppercase tracking-widest">
            Awaiting semantic baseline. Structural mutation authorized.
          </p>
        </div>
`;

const newSynth = `
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-theme-panel border border-phosphor/20 terminal-border">
          <div className="w-10 h-10 border-2 border-semantic-yellow/20 terminal-border border-t-semantic-yellow animate-spin" />
          <h3 className="text-sm font-bold font-mono text-semantic-yellow uppercase tracking-widest">
            SYNTHESIZING...
          </h3>
          <p className="text-[11px] font-mono text-semantic-yellow/70 max-w-md uppercase tracking-widest">
            THE MATH HAS ENTERED THE FACE &bull; SEMANTIC DRIFT IN PROGRESS
          </p>
        </div>
`;

content = content.replace(/<div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-\[#11131c\][\s\S]*?<\/div>/, newSynth.trim());
content = content.replace(/<div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-2\.5 bg-\[#0e1018\]\/50[\s\S]*?<\/div>/, newIdle.trim());

fs.writeFileSync('src/App.tsx', content, 'utf8');
