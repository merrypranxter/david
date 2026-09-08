const fs = require('fs');
let content = fs.readFileSync('src/components/PromptInputArea.tsx', 'utf8');

const newButton = `
                  {davidState === 'SYNTHESIZING' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-theme-bg border-t-transparent animate-spin rounded-full" />
                      <span>SYNTHESIZING...</span>
                    </>
                  ) : davidState === 'COMPLETE' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ORGANISM COMPILED</span>
                    </>
                  ) : (
                    <>
                      <CornerDownLeft className="w-4 h-4" />
                      <span>BEGIN SYNTHESIS</span>
                    </>
                  )}
`;

content = content.replace(/\{isSynthesizing \? \([\s\S]*?<\/>\s*\)}/s, newButton);

fs.writeFileSync('src/components/PromptInputArea.tsx', content, 'utf8');
