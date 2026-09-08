const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('POST_SYNTHESIS_WORKBENCH_V2')) {
  console.log('[post-synthesis-workbench-v2] already applied');
  process.exit(0);
}

const presetOld = ` const handleSelectPreset = (preset: PresetItem) => {
 setConcept(preset.concept);
 setTarget(preset.target);
 if (preset.target === 'openart') setTargetLength(3200);
 else if (preset.target === 'grok') setTargetLength(2000);
 setEntropyLevel(preset.entropyLevel);
 if (preset.straitjacket) setStraitjacketLevel(preset.straitjacket);
 handleSynthesize(preset.concept);
 };`;
const presetNew = ` const handleSelectPreset = (preset: PresetItem) => {
 // POST_SYNTHESIS_WORKBENCH_V2: presets update controls locally, but DAVID owns prompt integration.
 setTarget(preset.target);
 if (preset.target === 'openart') setTargetLength(3200);
 else if (preset.target === 'grok') setTargetLength(2000);
 setEntropyLevel(preset.entropyLevel);
 if (preset.straitjacket) setStraitjacketLevel(preset.straitjacket);
 dispatchDavidIntent({
  source: 'preset',
  label: 'Preset Apply',
  committed: true,
  changes: {
   presetPrompt: preset.concept,
   target: preset.target,
   entropyLevel: preset.entropyLevel,
   straitjacket: preset.straitjacket,
   instruction: 'Treat this preset as a completed section choice. Integrate it into MAIN PROMPT; do not synthesize automatically.',
  },
 });
 };`;
if (content.includes(presetOld)) content = content.replace(presetOld, presetNew);

const ouroOld = ` const handleOuroborosLoop = (slopPrompt: string, parentGen?: PromptGeneration) => {
 const parent = parentGen || currentResult?.generation;
 const nextGen = (parent?.generationNumber ?? ouroborosGenCount) + 1;
 setOuroborosGenCount(nextGen);
 setOuroborosSeed(slopPrompt);
 const mutatedConcept = \`Mutate & Evolve Gen #\${nextGen}: \${slopPrompt.slice(0, 180)}...\`;
 setConcept(mutatedConcept);
 handleSynthesize(mutatedConcept, slopPrompt, parent);
 };`;
const ouroNew = ` const handleOuroborosLoop = (slopPrompt: string, parentGen?: PromptGeneration) => {
 const parent = parentGen || currentResult?.generation;
 const nextGen = (parent?.generationNumber ?? ouroborosGenCount) + 1;
 setOuroborosGenCount(nextGen);
 setOuroborosSeed(slopPrompt);
 dispatchDavidIntent({
  source: 'post-synthesis-ouroboros',
  label: \`Ouroboros Gen #\${nextGen} Apply\`,
  committed: true,
  changes: {
   selectedOutput: slopPrompt,
   parentGeneration: parent || null,
   requestedGeneration: nextGen,
   instruction: 'Evolve this selected output into the next MAIN PROMPT. Preserve useful ancestry and locks. Do not synthesize yet; the user will press SYNTHESIZE when ready.',
  },
 });
 };`;
if (content.includes(ouroOld)) content = content.replace(ouroOld, ouroNew);

const crossOld = ` const handleCrossbreed = (parentA: PromptGeneration, parentB: PromptGeneration) => {
 const nextGen = Math.max(parentA.generationNumber, parentB.generationNumber) + 1;
 setOuroborosGenCount(nextGen);
 const crossConcept = \`Crossbreed Gen #\${parentA.generationNumber} (\${parentA.generationId.slice(0, 8)}) x Gen #\${parentB.generationNumber} (\${parentB.generationId.slice(0, 8)})\`;
 setConcept(crossConcept);
 handleSynthesize(crossConcept, undefined, parentA, parentB);
 };`;
const crossNew = ` const handleCrossbreed = (parentA: PromptGeneration, parentB: PromptGeneration) => {
 const nextGen = Math.max(parentA.generationNumber, parentB.generationNumber) + 1;
 setOuroborosGenCount(nextGen);
 dispatchDavidIntent({
  source: 'post-synthesis-crossbreed',
  label: \`Crossbreed Gen #\${nextGen} Apply\`,
  committed: true,
  changes: {
   parentA,
   parentB,
   requestedGeneration: nextGen,
   instruction: 'Crossbreed the useful structural ancestry of both parents into MAIN PROMPT. Do not replace the prompt with generation IDs and do not synthesize automatically.',
  },
 });
 };`;
if (content.includes(crossOld)) content = content.replace(crossOld, crossNew);

const transposeNeedle = ` const handleTranspose = () => {
 if (!currentResult) return;`;
if (content.includes(transposeNeedle)) {
  const endNeedle = ` previewImpact: \`[POLARITY TRANSPOSED]: Inverted the Scalpel and Deluge. Direct tokens now channeled through high-entropy filter.\`,
 });
 };`;
  const endReplacement = ` previewImpact: \`[POLARITY TRANSPOSED]: Inverted the Scalpel and Deluge. Direct tokens now channeled through high-entropy filter.\`,
 });
 dispatchDavidIntent({
  source: 'post-synthesis-transpose',
  label: 'Transpose Apply',
  committed: true,
  changes: {
   literalNow: slp.prompt || '',
   slopNow: lit.prompt || '',
   instruction: 'The user transposed the Scalpel/Deluge polarity. Reconcile that decision into MAIN PROMPT so the sidebar reflects the new creative state.',
  },
 });
 };`;
  if (content.includes(endNeedle)) content = content.replace(endNeedle, endReplacement);
}

const survivorEnd = ` setCurrentResult((prev) => {
 if (!prev) return null;
 const updatedFamily = prev.mutantFamily`;
// Add a DAVID intent after the existing setCurrentResult closure, using an exact tail.
const survivorTail = ` });
 };

 const handleExport = () => {`;
const survivorTailReplacement = ` });
 dispatchDavidIntent({
  source: 'post-synthesis-survivor',
  label: \`Mutant Survivor [\${candidate.candidateLetter}] Apply\`,
  committed: true,
  changes: {
   renderedPrompt: candidate.renderedPrompt,
   stylePrompt: candidate.stylePrompt,
   lyricsPrompt: candidate.lyricsPrompt,
   mutationRecipe: candidate.mutationRecipe,
   instruction: 'The user explicitly chose this mutant as the survivor. Make it the new MAIN PROMPT ancestry while preserving global locks and useful prior intent.',
  },
 });
 };

 const handleExport = () => {`;
if (content.includes(survivorEnd) && content.includes(survivorTail)) {
  content = content.replace(survivorTail, survivorTailReplacement);
}

// Loading a saved recipe is a restore operation. Controls restore locally; its stored
// prompt still goes through DAVID so MAIN PROMPT keeps one-writer ownership.
const recipePrompt = ` if (recipe.concept) setConcept(recipe.concept);`;
if (content.includes(recipePrompt)) {
  content = content.replace(
    recipePrompt,
    ` if (recipe.concept) {
 dispatchDavidIntent({
  source: 'saved-recipe',
  label: \`Restore Recipe: \${recipe.name}\`,
  committed: true,
  changes: {
   storedPrompt: recipe.concept,
   instruction: 'Restore this saved prompt faithfully as MAIN PROMPT, reconciling only current global locks. Do not creatively rewrite it unless needed to satisfy a current lock.',
  },
 });
 }`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('[post-synthesis-workbench-v2] post-synthesis, presets and recipe prompt changes now route through DAVID');
