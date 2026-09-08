const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

// 1. Add onConsult to props
content = content.replace(
  /onSynthesize: \(\) => void;/g,
  `onSynthesize: () => void;\n  onConsult: () => void;`
);

content = content.replace(
  /onSynthesize,\n  isSynthesizing,/g,
  `onSynthesize,\n  onConsult,\n  isSynthesizing,`
);

// 2. Add the button next to Synthesize
const synthesizeBtnRegex = /(<button[^>]+onClick=\{onSynthesize\}[^>]+>.*?<\/button>)/s;

const newButtons = `
            <button
              type="button"
              onClick={onConsult}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold font-display uppercase tracking-[0.2em] transition-all bg-theme-bg text-phosphor border terminal-border hover:bg-phosphor/10 active:scale-95"
            >
              <MessageSquare size={14} className="opacity-80" />
              <span>CONSULT</span>
            </button>
            $1
`;

// Also need to import MessageSquare if not already there, but let's just use a normal button if not. Let's check imports.
if (content.includes('MessageSquare')) {
  content = content.replace(synthesizeBtnRegex, newButtons);
} else {
  // Try adding MessageSquare to lucide-react import
  content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
    if (!p1.includes('MessageSquare')) {
      return `import { ${p1}, MessageSquare } from 'lucide-react';`;
    }
    return match;
  });
  content = content.replace(synthesizeBtnRegex, newButtons);
}

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
