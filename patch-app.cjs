const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('ConsultChat')) {
  content = content.replace(
    /import \{ SlopRecipeModal \} from '\.\/components\/SlopRecipeModal';/,
    `import { SlopRecipeModal } from './components/SlopRecipeModal';\nimport { ConsultChat } from './components/ConsultChat';`
  );

  content = content.replace(
    /const \[recipeModalOpen, setRecipeModalOpen\] = useState\(false\);/,
    `const [recipeModalOpen, setRecipeModalOpen] = useState(false);\n  const [consultChatOpen, setConsultChatOpen] = useState(false);`
  );

  content = content.replace(
    /onSynthesize=\{[^}]+\}/,
    `$& onConsult={() => setConsultChatOpen(!consultChatOpen)}`
  );

  content = content.replace(
    /<\/div>\n  \);\n\}/,
    `  <ConsultChat 
        isOpen={consultChatOpen} 
        onClose={() => setConsultChatOpen(false)} 
        currentState={{ concept, target, targetLength, openArtModel, grokMode, slopConfig, entropyLevel, straitjacketLevel }}
        highThinking={highThinking}
      />
      </div>
  );
}`
  );

  fs.writeFileSync('src/App.tsx', content, 'utf8');
}
