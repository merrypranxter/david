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
 <div className="mb-4 border border-phosphor/30 terminal-border bg-theme-panel overflow-hidden text-xs font-mono shadow-md">
 {/* Compact Indicator Header (Job 8, Part 21) */}
 <div className="p-3 bg-theme-panel flex items-center justify-between gap-3 border-b terminal-border">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="p-1 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 <Award className="w-3.5 h-3.5" />
 </span>
 <span className="font-bold text-phosphor uppercase tracking-wider">
 Mutant Family Engine:
 </span>
 <span className="px-2 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border">
 {candidates.length} variants explored &bull; 1 survivor selected
 </span>
 <span className="text-[11px] text-phosphor font-medium hidden md:inline">
 [{survivor.candidateLetter}] {selectionReason}
 </span>
 </div>

 <button
 type="button"
 onClick={() => setIsExpanded(!isExpanded)}
 className="flex items-center gap-1 text-phosphor/80 hover:text-phosphor px-2 py-1 bg-theme-panel hover:bg-phosphor/10 transition-colors shrink-0"
 >
 <span>{isExpanded ? 'Collapse Family' : 'Inspect Variants'}</span>
 {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
 </button>
 </div>

 {/* Niches Badges Strip */}
 <div className="px-3 py-1.5 bg-theme-panel border-b terminal-border flex items-center gap-2 overflow-x-auto text-[11px]">
 <span className="text-phosphor/50 uppercase tracking-wider shrink-0">Niches Explored:</span>
 {nichesRepresented.map((niche) => (
 <span
 key={niche}
 className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border whitespace-nowrap"
 >
 {formatNicheLabel(niche)}
 </span>
 ))}
 </div>

 {/* Expandable Candidates Grid (Job 8, Part 22) */}
 {isExpanded && (
 <div className="p-3 bg-theme-panel space-y-3">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {candidates.map((cand) => {
 const isSelectedSurvivor = cand.id === survivorCandidateId;
 const evalScore = cand.evaluation;

 return (
 <div
 key={cand.id}
 className={`p-3 border flex flex-col justify-between space-y-2.5 transition-all ${
 isSelectedSurvivor
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border shadow-lg ring-1 ring-phosphor/40'
 : 'bg-theme-panel/50 border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 {/* Top Bar: Letter & Status */}
 <div className="space-y-1">
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5">
 <span
 className={`w-5 h-5 flex items-center justify-center font-bold text-xs ${
 isSelectedSurvivor
 ? 'bg-phosphor/10 text-theme-bg'
 : 'bg-theme-panel text-phosphor/80 border border-phosphor/20 terminal-border'
 }`}
 >
 {cand.candidateLetter}
 </span>
 <span className="font-bold text-phosphor">
 Variant {cand.candidateLetter}
 </span>
 </div>

 <span
 className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold ${
 isSelectedSurvivor
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : 'bg-theme-panel text-phosphor/80 border border-phosphor/20 terminal-border'
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
 className="text-[9px] px-1.5 py-0.2 bg-phosphor/50 text-phosphor border border-phosphor/30 terminal-border"
 >
 {formatNicheLabel(n)}
 </span>
 ))}
 </div>
 </div>

 {/* Prompt Excerpt */}
 <div className="bg-theme-bg p-2 border terminal-border text-[11px] text-phosphor/80 line-clamp-3 leading-relaxed relative">
 {cand.renderedPrompt}
 </div>

 {/* Scores Grid */}
 {evalScore && (
 <div className="grid grid-cols-4 gap-1 text-[10px] bg-theme-bg p-1.5 border terminal-border">
 <div className="text-center">
 <div className="text-phosphor/50">Novelty</div>
 <div className="font-bold text-phosphor">
 {Math.round(evalScore.structuralNovelty * 100)}%
 </div>
 </div>
 <div className="text-center">
 <div className="text-phosphor/50">Anchors</div>
 <div className="font-bold text-phosphor">
 {Math.round(evalScore.anchorSurvival * 100)}%
 </div>
 </div>
 <div className="text-center">
 <div className="text-phosphor/50">Legibility</div>
 <div className="font-bold text-phosphor">
 {Math.round(evalScore.targetLegibility * 100)}%
 </div>
 </div>
 <div className="text-center">
 <div className="text-phosphor font-bold">Fitness</div>
 <div className="font-bold text-phosphor">
 {Math.round(evalScore.totalFitness * 100)}%
 </div>
 </div>
 </div>
 )}

 {/* Actions Bar */}
 <div className="pt-2 border-t terminal-border flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={() => handleCopyPrompt(cand.id, cand.renderedPrompt)}
 className="px-2 py-1 bg-theme-panel hover:bg-phosphor/10 text-phosphor/80 text-[11px] flex items-center gap-1"
 >
 {copiedId === cand.id ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3 text-phosphor/80" />}
 <span>{copiedId === cand.id ? 'Copied' : 'Copy'}</span>
 </button>

 {!isSelectedSurvivor && onSelectManualSurvivor && (
 <button
 type="button"
 onClick={() => onSelectManualSurvivor(cand)}
 className="px-2.5 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border text-[11px] font-bold transition-colors"
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
