const fs = require('fs');

const path = 'src/components/SlopVaultModal.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('MUTATION LAB STAGING V2')) {
  console.log('[mutation-staging-v2] already applied');
  process.exit(0);
}

content = content.replace(
  "import React, { useState, useMemo } from 'react';",
  "import React, { useState, useMemo, useEffect } from 'react';"
);

if (!content.includes("../utils/davidWorkbenchBus")) {
  content = content.replace(
    "import { getDormantBranches, dormantBranchToParentGeneration } from '../utils/branchArchive';",
    "import { getDormantBranches, dormantBranchToParentGeneration } from '../utils/branchArchive';\nimport { dispatchDavidIntent } from '../utils/davidWorkbenchBus';"
  );
}

const oldStart = `export const SlopVaultModal: React.FC<SlopVaultModalProps> = ({
 isOpen,
 onClose,
 selectedSeeds,
 onToggleSeed,
 onSelectMultipleSeeds,
 slopConfig,
 setSlopConfig,
 onUpdateSlopConfig,
 entropyLevel = 7,
 currentConcept = 'A surreal sensory scene',
 targetEngine = 'nano',
 onCrossbreedBranch,
 onApplyConcept,
}) => {
 // Main Navigation: 6 Core Tabs (Job 7 & Slop Methods)`;

const newStart = `export const SlopVaultModal: React.FC<SlopVaultModalProps> = ({
 isOpen,
 onClose,
 selectedSeeds: committedSelectedSeeds,
 onToggleSeed: commitToggleSeed,
 onSelectMultipleSeeds: commitSelectMultipleSeeds,
 slopConfig: committedSlopConfig,
 setSlopConfig: commitSetSlopConfig,
 onUpdateSlopConfig: commitUpdateSlopConfig,
 entropyLevel = 7,
 currentConcept = 'A surreal sensory scene',
 targetEngine = 'nano',
 onCrossbreedBranch,
 onApplyConcept: commitApplyConcept,
}) => {
 // MUTATION LAB STAGING V2
 // Nothing in this modal touches MAIN PROMPT or committed app state until APPLY LAB.
 const [slopConfig, setDraftSlopConfig] = useState<SlopSeedingConfig>(committedSlopConfig);
 const [selectedSeeds, setDraftSelectedSeeds] = useState<string[]>(committedSelectedSeeds);
 const [stagedPromptFragments, setStagedPromptFragments] = useState<string[]>([]);

 useEffect(() => {
  if (!isOpen) return;
  setDraftSlopConfig(committedSlopConfig);
  setDraftSelectedSeeds(committedSelectedSeeds);
  setStagedPromptFragments([]);
 }, [isOpen]);

 const onToggleSeed = (seed: string) => {
  setDraftSelectedSeeds((prev) =>
   prev.includes(seed) ? prev.filter((item) => item !== seed) : [...prev, seed]
  );
 };

 const onSelectMultipleSeeds = (seeds: string[]) => {
  setDraftSelectedSeeds((prev) => Array.from(new Set([...prev, ...seeds])));
 };

 // Slop Methods used to REPLACE the whole concept. Now they stage one or many
 // candidate fragments so DAVID can decide how to integrate them on APPLY LAB.
 const onApplyConcept = (fragment: string) => {
  const clean = fragment.trim();
  if (!clean) return;
  setStagedPromptFragments((prev) =>
   prev.includes(clean) ? prev : [...prev, clean]
  );
 };

 // Main Navigation: 6 Core Tabs (Job 7 & Slop Methods)`;

if (!content.includes(oldStart)) {
  console.error('[mutation-staging-v2] component start shape not found');
  process.exit(1);
}
content = content.replace(oldStart, newStart);

const oldUpdateConfig = ` const updateConfig = (updater: (prev: SlopSeedingConfig) => SlopSeedingConfig) => {
 if (onUpdateSlopConfig) {
 onUpdateSlopConfig(updater);
 } else if (setSlopConfig) {
 setSlopConfig(updater);
 }
 };`;
const newUpdateConfig = ` const updateConfig = (updater: (prev: SlopSeedingConfig) => SlopSeedingConfig) => {
 // Local only. Sliders, toggles, DNA, operators, fauna and pressures are staged.
 setDraftSlopConfig(updater);
 };`;
if (!content.includes(oldUpdateConfig)) {
  console.error('[mutation-staging-v2] updateConfig shape not found');
  process.exit(1);
}
content = content.replace(oldUpdateConfig, newUpdateConfig);

const clearMarker = ` // Clear all mutation selections
 const handleClearAll = () => {
 onSelectMultipleSeeds([]);
 updateConfig((prev) => ({
 ...prev,
 selectedOperators: [],
 selectedAttractors: [],
 selectedPressures: [],
 protectedAnchors: [],
 }));
 };

 return (`;

const clearReplacement = ` // Clear all mutation selections (still local until APPLY LAB)
 const handleClearAll = () => {
 setDraftSelectedSeeds([]);
 setStagedPromptFragments([]);
 updateConfig((prev) => ({
 ...prev,
 selectedSeeds: [],
 selectedOperators: [],
 selectedAttractors: [],
 selectedPressures: [],
 protectedAnchors: [],
 }));
 };

 const handleApplyLab = () => {
  const finalizedConfig: SlopSeedingConfig = {
   ...slopConfig,
   selectedSeeds: [...selectedSeeds],
  };

  // Commit app state once, after the user is finished with the lab.
  if (commitUpdateSlopConfig) {
   commitUpdateSlopConfig(() => finalizedConfig);
  } else if (commitSetSlopConfig) {
   commitSetSlopConfig(finalizedConfig);
  } else if (commitSelectMultipleSeeds) {
   commitSelectMultipleSeeds(selectedSeeds);
  }

  dispatchDavidIntent({
   source: 'mutation-lab',
   label: 'Mutation Lab Apply',
   summary: 'Integrate the finished Mutation Lab configuration into MAIN PROMPT using judgment, not tag dumping.',
   committed: true,
   priority: 'standard',
   changes: {
    activeSection: activeMainTab,
    contentDna: selectedSeeds,
    mutationMode: finalizedConfig.mutationMode,
    operators: finalizedConfig.selectedOperators || [],
    latentFauna: finalizedConfig.selectedAttractors || [],
    pressures: finalizedConfig.selectedPressures || [],
    protectedAnchors: finalizedConfig.protectedAnchors || [],
    paradoxEngine: finalizedConfig.enableParadoxEngine,
    contradictionMode: finalizedConfig.contradictionMode,
    activePipeline: finalizedConfig.activePipeline || [],
    stagedPromptFragments,
    targetEngine,
    entropyLevel,
   },
  });

  setStagedPromptFragments([]);
  onClose();
 };

 return (`;

if (!content.includes(clearMarker)) {
  console.error('[mutation-staging-v2] clear marker not found');
  process.exit(1);
}
content = content.replace(clearMarker, clearReplacement);

const closeMarker = ` {/* Close Button */}
 <button
 type="button"
 onClick={onClose}`;

const applyButton = ` {/* APPLY LAB: the only point where this modal talks to DAVID / committed prompt state */}
 <button
 type="button"
 onClick={handleApplyLab}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-phosphor text-theme-bg border border-phosphor text-xs font-mono font-bold transition-opacity hover:opacity-90"
 title="Commit this finished Mutation Lab session and let David reconcile it into MAIN PROMPT"
 >
 <Check className="w-4 h-4" />
 <span>APPLY LAB → DAVID</span>
 </button>

 {stagedPromptFragments.length > 0 && (
  <span className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
   {stagedPromptFragments.length} staged prompt fragment{stagedPromptFragments.length === 1 ? '' : 's'}
  </span>
 )}

 {/* Close Button */}
 <button
 type="button"
 onClick={onClose}`;

if (!content.includes(closeMarker)) {
  console.error('[mutation-staging-v2] close button marker not found');
  process.exit(1);
}
content = content.replace(closeMarker, applyButton);

content = content.replace(
  'Content DNA &bull; 18 Mutation Operators &bull; 16 Latent Fauna &bull; 5 Optimization Pressures',
  'LOCAL STAGING · nothing reaches MAIN PROMPT until APPLY LAB'
);

// Silence intentionally-unused aliased props on stricter TS configs while keeping
// backwards compatibility with the public component contract.
content = content.replace(
  ' // Main Navigation: 6 Core Tabs (Job 7 & Slop Methods)',
  ` void commitToggleSeed;\n void commitApplyConcept;\n\n // Main Navigation: 6 Core Tabs (Job 7 & Slop Methods)`
);

fs.writeFileSync(path, content, 'utf8');
console.log('[mutation-staging-v2] Mutation Lab now stages locally and applies once through DAVID');
