const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I also need the MessageSquare icon in App.tsx
if (!content.includes('MessageSquare')) {
  content = content.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    (match, p1) => `import { ${p1}, MessageSquare } from 'lucide-react';`
  );
}

const appendCode = `
      {/* MASSIVE GLOWING CONSULT BUTTON */}
      {!consultChatOpen && (
        <button
          onClick={() => setConsultChatOpen(true)}
          className="fixed bottom-6 right-6 z-[60] bg-phosphor text-theme-bg px-6 py-4 rounded-full shadow-[0_0_30px_var(--color-phosphor)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all border-2 border-theme-bg"
          title="Open David's Workbench"
        >
          <MessageSquare size={24} className="fill-theme-bg" />
          <span className="font-display font-bold uppercase tracking-[0.2em] text-lg mt-1">CONSULT DAVID</span>
        </button>
      )}

      <ConsultChat 
        isOpen={consultChatOpen} 
        onClose={() => setConsultChatOpen(false)} 
        currentState={{ concept, target, targetLength, openArtModel, grokMode, slopConfig, entropyLevel, straitjacketLevel }}
        highThinking={highThinking}
      />
    </div>
  );
}
`;

// replace the end of the file
content = content.replace(/<\/div>\s*\);\s*\}/, appendCode);

fs.writeFileSync('src/App.tsx', content, 'utf8');
