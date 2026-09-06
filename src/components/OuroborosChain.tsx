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
    <div className="bg-[#12141d] border border-amber-500/20 rounded-xl p-4 sm:p-5 space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <span>Evolutionary Lineage &amp; Ouroboros Chain</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
              {history.length} Generations Logged
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {onCrossbreed && selectedParents.length === 2 && (
            <button
              type="button"
              onClick={handleExecuteCrossbreed}
              className="text-xs px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitMerge className="w-3 h-3 text-purple-300" />
              <span>Crossbreed Selected (2)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearHistory}
            className="text-[11px] text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
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
              className={`shrink-0 w-64 bg-[#0a0b10] hover:bg-zinc-900 border ${
                isSelectedForCrossbreed
                  ? 'border-purple-500/80 bg-purple-950/20'
                  : 'border-zinc-800 hover:border-amber-500/50'
              } rounded-lg p-3 cursor-pointer transition-all space-y-2 group relative`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Dna className="w-3 h-3 text-amber-500" />
                  <span>Gen #{genNumber}</span>
                </span>
                <span className="text-zinc-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>

              <p className="text-xs text-zinc-300 truncate group-hover:text-amber-200">
                "{item.concept}"
              </p>

              {/* Genotype metrics badge */}
              <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
                {traitsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300/90 border border-amber-500/30">
                    {traitsCount} traits
                  </span>
                )}
                {scarsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300/90 border border-rose-500/40 flex items-center gap-0.5">
                    <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                    <span>{scarsCount} scar{scarsCount > 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="uppercase text-emerald-400/80">{item.target}</span>
                {onCrossbreed ? (
                  <button
                    type="button"
                    onClick={(e) => toggleParentSelection(item.id, e)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                      isSelectedForCrossbreed
                        ? 'bg-purple-500/30 text-purple-200 border-purple-400'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-purple-300 hover:border-purple-500/40'
                    }`}
                  >
                    {isSelectedForCrossbreed ? 'Selected' : '+ Parent'}
                  </button>
                ) : (
                  <span className="text-rose-400">S{item.entropyLevel} Depth</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
