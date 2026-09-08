const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

// 1. Add davidState to Props
content = content.replace(/onOpenRecipes\?: \(\) => void;/s, `onOpenRecipes?: () => void;\n  davidState?: 'IDLE' | 'READY' | 'SYNTHESIZING' | 'COMPLETE' | 'ERROR';`);
content = content.replace(/onOpenRecipes,\s*\}/, `onOpenRecipes,\n  davidState = 'IDLE',\n}`);

// 2. Change the button label and David message
// We can use a message block below the text area. Let's see where the text area is...
// In PromptInputArea, let's just find the Synthesize button text first.

content = content.replace(/\{isSynthesizing \? \([\s\S]*?\{isSynthesizing/s, (match) => {
    return `{isSynthesizing`; // keep looking
});

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
