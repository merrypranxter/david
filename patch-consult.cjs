const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = /const \[recipeModalOpen,\s*setRecipeModalOpen\]\s*=\s*useState<boolean>\(false\);/;
if (content.match(hookTarget)) {
  content = content.replace(
    hookTarget,
    `const [recipeModalOpen, setRecipeModalOpen] = useState<boolean>(false);\n  const [consultChatOpen, setConsultChatOpen] = useState<boolean>(false);`
  );
  fs.writeFileSync('src/App.tsx', content, 'utf8');
} else {
  console.log("Hook target not found");
}
