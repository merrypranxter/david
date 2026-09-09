const fs = require('fs');

const appPath = 'src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

if (content.includes('DRAGGABLE_DAVID_LAUNCHER_V1')) {
  console.log('[draggable-david-launcher-v1] already applied');
  process.exit(0);
}

if (!content.includes("./components/DraggableDavidLauncher")) {
  content = content.replace(
    "import { DavidAppWorkbench } from \"./components/DavidAppWorkbench\";",
    "import { DavidAppWorkbench } from \"./components/DavidAppWorkbench\";\nimport { DraggableDavidLauncher } from \"./components/DraggableDavidLauncher\";"
  );
}

const launcherRegex = /\n\s*\{\/\* MASSIVE GLOWING CONSULT BUTTON \*\/\}[\s\S]*?<\/button>/m;
if (!launcherRegex.test(content)) {
  console.error('[draggable-david-launcher-v1] old fixed DAVID launcher not found');
  process.exit(1);
}

content = content.replace(
  launcherRegex,
  `\n      {/* DRAGGABLE_DAVID_LAUNCHER_V1 */}\n      <DraggableDavidLauncher />`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('[draggable-david-launcher-v1] DAVID launcher can be dragged anywhere and remembers its position');
