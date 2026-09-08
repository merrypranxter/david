const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I also need the MessageSquare icon in App.tsx
if (!content.includes('MessageSquare')) {
  content = content.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    (match, p1) => `import { ${p1}, MessageSquare } from 'lucide-react';`
  );
}

const consultChatTag = /<ConsultChat/;
const fabCode = `
      {/* MASSIVE GLOWING CONSULT BUTTON */}
      {!consultChatOpen && (
        <button
          onClick={() => setConsultChatOpen(true)}
          className="fixed bottom-6 right-6 z-[60] bg-phosphor text-theme-bg px-6 py-4 rounded-full shadow-[0_0_30px_var(--color-phosphor)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all animate-pulse-slow border-2 border-theme-bg"
          title="Open David's Workbench"
        >
          <MessageSquare size={24} className="fill-theme-bg" />
          <span className="font-display font-bold uppercase tracking-[0.2em] text-lg mt-1">CONSULT DAVID</span>
        </button>
      )}
      
      <ConsultChat`;

content = content.replace(consultChatTag, fabCode);

// Ensure the animation is smooth, maybe add a custom animation in index.css if animate-pulse-slow doesn't exist, but animate-pulse is built into tailwind. 
// I'll just use tailwind's built-in animate-pulse or just a heavy shadow. Let's stick to the inline styles for the heavy shadow.

fs.writeFileSync('src/App.tsx', content, 'utf8');
