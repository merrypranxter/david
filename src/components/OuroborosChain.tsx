import React, { useState } from 'react';
import { PromptGeneration, SynthesisHistoryItem } from '../types';
import { Flame, History, GitMerge, Dna, ShieldAlert, Trash2, CheckCircle2 } from 'lucide-react';

interface OuroborosChainProps {
 history: SynthesisHistoryItem[];
 onSelectGeneration: (item: SynthesisHistoryItem) => void;
 onClearHistory: () => void;
 onCrossbreed?: (parentA: PromptGeneration, parentB: PromptGeneration) => void;
}

export const OuroborosChain: React.FC<OuroborosChainProps> = ({
 history,
 onSelectGeneration,
 onClearHistory,
 onCrossbreed,
}) => {
 const [selectedParents, setSelectedParents] = useState<string[]>([]);

 if (history.length === 0) return null;

 const toggleParentSelection = (id: string, e: React.MouseEvent) => {
 e.stopPropagation();
 setSelectedParents((prev) => {
 if (prev.includes(id)) {
 return prev.filter((p) => p !== id);
 }
 if (prev.length >= 2) {
 return [prev[1], id];
 }
 return [...prev, id];
 });
 };

 const handleExecuteCrossbreed = () => {
 if (selectedParents.length !== 2 || !onCrossbreed) return;
 const itemA = history.find((h) => h.id === selectedParents[0]);
 const itemB = history.find((h) => h.id === selectedParents[1]);

 if (!itemA || !itemB) return;

 const parentA: PromptGeneration = itemA.lineage || {
 generationId: itemA.id,
 generationNumber: (itemA.generationIndex ?? 0) + 1,
 timestamp: itemA.timestamp,
 parentGenerationIds: [],
 sourceConcept: itemA.concept,
 renderedPrompt: itemA.result?.slop?.prompt || itemA.concept,
 inheritedTraits: [],
 acquiredTraits: [],
 lostTraits: [],
 dormantTraits: [],
 scars: [],
 preservedAnchors: itemA.result?.mutationRecipe?.preservedAnchors || [],
 mutationEvents: [],
 lineageSummary: `Parent Gen #${(itemA.generationIndex ?? 0) + 1}`,
 };

 const parentB: PromptGeneration = itemB.lineage || {
 generationId: itemB.id,
 generationNumber: (itemB.generationIndex ?? 0) + 1,
 timestamp: itemB.timestamp,
 parentGenerationIds: [],
 sourceConcept: itemB.concept,
 renderedPrompt: itemB.result?.slop?.prompt || itemB.concept,
 inheritedTraits: [],
 acquiredTraits: [],
 lostTraits: [],
 dormantTraits: [],
 scars: [],
 preservedAnchors: itemB.result?.mutationRecipe?.preservedAnchors || [],
 mutationEvents: [],
 lineageSummary: `Parent Gen #${(itemB.generationIndex ?? 0) + 1}`,
 };

 onCrossbreed(parentA, parentB);
 setSelectedParents([]);
 };

 return (
 <div className="bg-theme-panel border border-phosphor/30 terminal-border p-4 sm:p-5 space-y-3 font-mono">
 <div className="flex items-center justify-between border-b terminal-border pb-2.5 flex-wrap gap-2">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 bg-phosphor/10 border border-phosphor/30 terminal-border flex items-center justify-center text-phosphor">
 <Flame className="w-3.5 h-3.5" />
 </div>
 <h4 className="text-xs font-bold text-phosphor uppercase tracking-wider flex items-center gap-2">
 <span>Evolutionary Lineage &amp; Ouroboros Chain</span>
 <span className="text-[10px] px-2 py-0.5 bg-phosphor/10 text-phosphor">
 {history.length} Generations Logged
 </span>
 </h4>
 </div>

 <div className="flex items-center gap-2">
 {onCrossbreed && selectedParents.length === 2 && (
 <button
 type="button"
 onClick={handleExecuteCrossbreed}
 className="text-xs px-2.5 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border flex items-center gap-1.5 transition-colors cursor-pointer"
 >
 <GitMerge className="w-3 h-3 text-phosphor" />
 <span>Crossbreed Selected (2)</span>
 </button>
 )}

 <button
 type="button"
 onClick={onClearHistory}
 className="text-[11px] text-phosphor/50 hover:text-semantic-red flex items-center gap-1 transition-colors cursor-pointer"
 title="Clear history"
 >
 <Trash2 className="w-3 h-3" />
 <span>Reset Chain</span>
 </button>
 </div>
 </div>

 <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
 {history.map((item, idx) => {
 const genNumber = item.lineage?.generationNumber ?? (history.length - idx);
 const isSelectedForCrossbreed = selectedParents.includes(item.id);
 const traitsCount = (item.lineage?.inheritedTraits?.length || 0) + (item.lineage?.acquiredTraits?.length || 0);
 const scarsCount = item.lineage?.scars?.length || 0;

 return (
 <div
 key={item.id}
 onClick={() => onSelectGeneration(item)}
 className={`shrink-0 w-64 bg-theme-panel hover:bg-theme-panel border ${
 isSelectedForCrossbreed
 ? 'border-phosphor/30 terminal-border bg-phosphor/10'
 : 'border-phosphor/20 terminal-border hover:border-phosphor/30 terminal-border'
 } p-3 cursor-pointer transition-all space-y-2 group relative`}
 >
 <div className="flex items-center justify-between text-[10px]">
 <span className="text-phosphor font-bold flex items-center gap-1">
 <Dna className="w-3 h-3 text-phosphor" />
 <span>Gen #{genNumber}</span>
 </span>
 <span className="text-phosphor/50">{new Date(item.timestamp).toLocaleTimeString()}</span>
 </div>

 <p className="text-xs text-phosphor/80 truncate group-hover:text-phosphor">
 "{item.concept}"
 </p>

 {/* Genotype metrics badge */}
 <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
 {traitsCount > 0 && (
 <span className="px-1.5 py-0.5 bg-phosphor/10 text-phosphor/90 border border-phosphor/30 terminal-border">
 {traitsCount} traits
 </span>
 )}
 {scarsCount > 0 && (
 <span className="px-1.5 py-0.5 bg-semantic-red/10 text-semantic-red/90 border border-semantic-red/30 terminal-border flex items-center gap-0.5">
 <ShieldAlert className="w-2.5 h-2.5 text-semantic-red" />
 <span>{scarsCount} scar{scarsCount > 1 ? 's' : ''}</span>
 </span>
 )}
 </div>

 <div className="flex items-center justify-between text-[10px] text-phosphor/50 pt-1 border-t terminal-border">
 <span className="uppercase text-phosphor/80">{item.target}</span>
 {onCrossbreed ? (
 <button
 type="button"
 onClick={(e) => toggleParentSelection(item.id, e)}
 className={`text-[9px] px-1.5 py-0.5 border transition-colors ${
 isSelectedForCrossbreed
 ? 'bg-phosphor/10 text-phosphor border-phosphor/30 terminal-border'
 : 'bg-theme-panel text-phosphor/80 border-phosphor/20 terminal-border hover:text-phosphor hover:border-phosphor/30 terminal-border'
 }`}
 >
 {isSelectedForCrossbreed ? 'Selected' : '+ Parent'}
 </button>
 ) : (
 <span className="text-semantic-red">S{item.entropyLevel} Depth</span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
};
