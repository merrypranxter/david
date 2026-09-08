const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = /<ConsultChat\s+isOpen=\{consultChatOpen\}/;
const replacement = `
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

      <ConsultChat isOpen={consultChatOpen}`;

if (content.match(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content, 'utf8');
  console.log("Replaced successfully");
} else {
  console.log("Could not find target");
}
