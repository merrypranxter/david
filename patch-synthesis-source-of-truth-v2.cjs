const fs = require('fs');

const appPath = 'src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

if (content.includes('WORKBENCH_SOURCE_OF_TRUTH_V2')) {
  console.log('[synthesis-source-of-truth-v2] already applied');
  process.exit(0);
}

const oldBlock = ` commandMode,
 recursiveSeed: overrideSeed ?? ouroborosSeed,
 parentGeneration: overrideParentGen,
 secondParentGeneration: overrideSecondParentGen,
 enableParadoxEngine: slopConfig.enableParadoxEngine,
 paradoxEngine: slopConfig.enableParadoxEngine,
 addMaths: slopConfig.addMaths,
 mathCategory: slopConfig.mathCategory,
 addSciences: slopConfig.addSciences,
 scienceCategory: slopConfig.scienceCategory,
 addSlop: slopConfig.addSlop,
 slopCategory: slopConfig.slopCategory,
 contradictionMode: slopConfig.contradictionMode,
 selectedSlopSeeds: slopConfig.selectedSeeds,
 activePipeline: slopConfig.activePipeline || [],
 slopConfig: { ...slopConfig },
 mutationMode: slopConfig.mutationMode,
 selectedOperators: slopConfig.selectedOperators,
 selectedAttractors: slopConfig.selectedAttractors,
 selectedPressures: slopConfig.selectedPressures,
 protectedAnchors: slopConfig.protectedAnchors,
 mutantSelectionMode: slopConfig.mutantSelectionMode,`;

const newBlock = ` commandMode,
 recursiveSeed: overrideSeed ?? ouroborosSeed,
 parentGeneration: overrideParentGen,
 secondParentGeneration: overrideSecondParentGen,
 // WORKBENCH_SOURCE_OF_TRUTH_V2
 // MAIN PROMPT has already been reconciled by DAVID. Synthesis must not secretly
 // re-apply Mutation Lab DNA/operators/pipelines a second time behind the user's back.
 workbenchSourceOfTruth: true,
 enableMutationEngine: false,
 enableParadoxEngine: false,
 paradoxEngine: false,
 addMaths: false,
 addSciences: false,
 addSlop: false,
 contradictionMode: 'free_drift',
 selectedSlopSeeds: [],
 activePipeline: [],
 selectedOperators: [],
 selectedAttractors: [],
 selectedContentSeeds: [],
 selectedPressures: [],
 protectedAnchors: [],
 mutantSelectionMode: 'off',
 slopConfig: {
  enableParadoxEngine: false,
  paradoxEngine: false,
  addMaths: false,
  addSciences: false,
  addSlop: false,
  contradictionMode: 'free_drift',
  selectedSeeds: [],
  activePipeline: [],
  selectedOperators: [],
  selectedAttractors: [],
  selectedPressures: [],
  protectedAnchors: [],
  mutantSelectionMode: 'off',
 },`;

if (!content.includes(oldBlock)) {
  console.error('[synthesis-source-of-truth-v2] synthesize payload shape not found');
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(appPath, content, 'utf8');
console.log('[synthesis-source-of-truth-v2] synthesis now uses visible MAIN PROMPT as sole creative source');
