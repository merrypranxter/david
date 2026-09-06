import React, { useState } from 'react';
import { MutantFamilyResult, MutationCandidate } from '../types';
import { formatNicheLabel } from '../utils/mutantNiches';
import {
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface MutantFamilyViewProps {
  familyResult: MutantFamilyResult;
  onSelectManualSurvivor?: (candidate: MutationCandidate) => void;
}

export const MutantFamilyView: React.FC<MutantFamilyViewProps> = ({
  familyResult,
  onSelectManualSurvivor,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { candidates, survivorCandidateId, selectionReason, nichesRepresented } = familyResult;

  if (!candidates || candidates.length <= 1) {
    return null;
  }

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const survivor = candidates.find((c) => c.id === survivorCandidateId) || candidates[0];

  return (
    <div className="mb-4 rounded-xl border border-amber-500/40 bg-[#121420] overflow-hidden text-xs font-mono shadow-md">
      {/* Compact Indicator Header (Job 8, Part 21) */}
      <div className="p-3 bg-[#171a2b] flex items-center justify-between gap-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Award className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-zinc-100 uppercase tracking-wider">
            Mutant Family Engine:
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            {candidates.length} variants explored &bull; 1 survivor selected
          </span>
          <span className="text-[11px] text-amber-400 font-medium hidden md:inline">
            [{survivor.candidateLetter}] {selectionReason}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <span>{isExpanded ? 'Collapse Family' : 'Inspect Variants'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Niches Badges Strip */}
      <div className="px-3 py-1.5 bg-[#0f111c] border-b border-zinc-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-zinc-500 uppercase tracking-wider shrink-0">Niches Explored:</span>
        {nichesRepresented.map((niche) => (
          <span
            key={niche}
            className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/80 whitespace-nowrap"
          >
            {formatNicheLabel(niche)}
          </span>
        ))}
      </div>

      {/* Expandable Candidates Grid (Job 8, Part 22) */}
      {isExpanded && (
        <div className="p-3 bg-[#0d0e17] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidates.map((cand) => {
              const isSelectedSurvivor = cand.id === survivorCandidateId;
              const evalScore = cand.evaluation;

              return (
                <div
                  key={cand.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                    isSelectedSurvivor
                      ? 'bg-amber-950/20 border-amber-500/70 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Top Bar: Letter & Status */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelectedSurvivor
                              ? 'bg-amber-500 text-zinc-950'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {cand.candidateLetter}
                        </span>
                        <span className="font-bold text-zinc-200">
                          Variant {cand.candidateLetter}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                          isSelectedSurvivor
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {isSelectedSurvivor ? 'Selected Survivor' : 'Runner-Up'}
                      </span>
                    </div>

                    {/* Niches */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cand.mutationNiches.map((n) => (
                        <span
                          key={n}
                          className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-500/30"
                        >
                          {formatNicheLabel(n)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Excerpt */}
                  <div className="bg-zinc-950/80 p-2 rounded border border-zinc-800/80 text-[11px] text-zinc-300 line-clamp-3 leading-relaxed relative">
                    {cand.renderedPrompt}
                  </div>

                  {/* Scores Grid */}
                  {evalScore && (
                    <div className="grid grid-cols-4 gap-1 text-[10px] bg-zinc-950/50 p-1.5 rounded border border-zinc-800/60">
                      <div className="text-center">
                        <div className="text-zinc-500">Novelty</div>
                        <div className="font-bold text-zinc-200">
                          {Math.round(evalScore.structuralNovelty * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-zinc-500">Anchors</div>
                        <div className="font-bold text-zinc-200">
                          {Math.round(evalScore.anchorSurvival * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-zinc-500">Legibility</div>
                        <div className="font-bold text-zinc-200">
                          {Math.round(evalScore.targetLegibility * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400 font-bold">Fitness</div>
                        <div className="font-bold text-amber-300">
                          {Math.round(evalScore.totalFitness * 100)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(cand.id, cand.renderedPrompt)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                    >
                      {copiedId === cand.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                      <span>{copiedId === cand.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    {!isSelectedSurvivor && onSelectManualSurvivor && (
                      <button
                        type="button"
                        onClick={() => onSelectManualSurvivor(cand)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors"
                        title="Override selection: Make this variant the active output and evolutionary parent"
                      >
                        Make Survivor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
