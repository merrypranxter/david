const fs = require('fs');

const methodsPath = 'src/components/SlopMethodsTab.tsx';
const vaultPath = 'src/components/SlopVaultModal.tsx';

function patchMethods() {
  let content = fs.readFileSync(methodsPath, 'utf8');
  if (content.includes('SLOP_METHOD_STRENGTH_V2')) {
    console.log('[slop-methods-staging-v2] already applied');
    return;
  }

  content = content.replace(
    ' onApplyConcept?: (concept: string) => void;',
    ' onApplyConcept?: (concept: string, intensity?: number) => void;'
  );

  content = content.replace(
    " const [copiedId, setCopiedId] = useState<string | null>(null);",
    " const [copiedId, setCopiedId] = useState<string | null>(null);\n // SLOP_METHOD_STRENGTH_V2: local only until Mutation Lab APPLY.\n const [implementationStrength, setImplementationStrength] = useState<number>(0.8);"
  );

  const navMarker = ` <span className="text-[11px] font-mono text-phosphor/50 hidden sm:inline">
 David 8 Slop Methods &bull; Mathematical Rigor
 </span>`;
  const strengthUi = ` <div className="flex items-center gap-2 ml-auto min-w-[210px]">
  <span className="text-[10px] font-mono text-phosphor/50 uppercase whitespace-nowrap">Strength:</span>
  <input
   type="range"
   min="10"
   max="100"
   step="5"
   value={Math.round(implementationStrength * 100)}
   onChange={(e) => setImplementationStrength(Number(e.target.value) / 100)}
   className="flex-1 accent-phosphor"
   title="Local implementation strength. Moving this slider does not call David; only APPLY LAB does."
  />
  <span className="w-10 text-right text-[10px] font-mono font-bold text-phosphor">{Math.round(implementationStrength * 100)}%</span>
 </div>`;
  if (content.includes(navMarker)) content = content.replace(navMarker, strengthUi);

  content = content.replace(/onApplyConcept\(specimenText\)/g, 'onApplyConcept(specimenText, implementationStrength)');
  content = content.replace(/onApplyConcept\(testText\)/g, 'onApplyConcept(testText, implementationStrength)');

  const oldSyntax = `onApplyConcept(
 \`${'${currentConcept}'}\\n\\n[SYNTAX_INJECTION: ${'${formatKey.toUpperCase()}'}]\\n${'${formatData.example}'}\`
 )`;
  const newSyntax = `onApplyConcept(
 \`[SYNTAX_INJECTION: ${'${formatKey.toUpperCase()}'}]\\n${'${formatData.example}'}\`,
 implementationStrength
 )`;
  if (content.includes(oldSyntax)) content = content.replace(oldSyntax, newSyntax);

  content = content.replace(/<span>Load Concept<\/span>/g, '<span>ENGAGE</span>');
  content = content.replace(/>\n Load into Concept\n <\/button>/g, '>\n ENGAGE\n </button>');
  content = content.replace(/<span>Inject<\/span>/g, '<span>ENGAGE</span>');
  content = content.replace(
    "title=\"Apply this exact specimen into David's concept buffer\"",
    'title="Stage this specimen locally at the selected strength; it reaches MAIN PROMPT only when Mutation Lab is applied"'
  );

  fs.writeFileSync(methodsPath, content, 'utf8');
  console.log('[slop-methods-staging-v2] slop methods now ENGAGE multiple fragments with a local strength slider');
}

function patchVaultReceiver() {
  let content = fs.readFileSync(vaultPath, 'utf8');
  const oldReceiver = ` const onApplyConcept = (fragment: string) => {
  const clean = fragment.trim();
  if (!clean) return;
  setStagedPromptFragments((prev) =>
   prev.includes(clean) ? prev : [...prev, clean]
  );
 };`;
  const newReceiver = ` const onApplyConcept = (fragment: string, intensity: number = 0.8) => {
  const clean = fragment.trim();
  if (!clean) return;
  const staged = \`[IMPLEMENTATION STRENGTH: \${Math.round(intensity * 100)}%] \${clean}\`;
  setStagedPromptFragments((prev) =>
   prev.includes(staged) ? prev : [...prev, staged]
  );
 };`;
  if (content.includes(oldReceiver)) content = content.replace(oldReceiver, newReceiver);
  fs.writeFileSync(vaultPath, content, 'utf8');
}

patchMethods();
patchVaultReceiver();
