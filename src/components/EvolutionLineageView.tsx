import React from 'react';
import { PromptGeneration } from '../types';
import { Dna, ShieldAlert, Sparkles, History, GitMerge, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface EvolutionLineageViewProps {
 generation?: PromptGeneration;
 compact?: boolean;
}

export const EvolutionLineageView: React.FC<EvolutionLineageViewProps> = ({
 generation,
 compact = false,
}) => {
 if (!generation) return null;

 const totalActiveTraits = generation.inheritedTraits.length + generation.acquiredTraits.length;
 const scars = generation.scars || [];
 const dormant = generation.dormantTraits || [];
 const events = generation.mutationEvents || [];

 return (
 <div className="bg-theme-panel border border-phosphor/30 terminal-border p-4 space-y-3.5 font-mono">
 {/* Header with Generation ID & Parents */}
 <div className="flex items-center justify-between border-b terminal-border pb-2.5 flex-wrap gap-2">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 bg-phosphor/10 border border-phosphor/30 terminal-border flex items-center justify-center text-phosphor">
 <Dna className="w-3.5 h-3.5" />
 </div>
 <div>
 <div className="text-xs font-bold text-phosphor flex items-center gap-2">
 <span>GENOTYPE: GEN #{generation.generationNumber}</span>
 <span className="text-[10px] px-1.5 py-0.2 bg-theme-panel border terminal-border text-phosphor/80 font-normal">
 {generation.generationId}
 </span>
 </div>
 {generation.parentGenerationIds && generation.parentGenerationIds.length > 0 && (
 <div className="text-[10px] text-phosphor/50 flex items-center gap-1.5 mt-0.5">
 <GitMerge className="w-3 h-3 text-phosphor/60" />
 <span>Lineage Parents: {generation.parentGenerationIds.join(' x ')}</span>
 </div>
 )}
 </div>
 </div>

 <div className="flex items-center gap-2">
 <span className="text-[10px] px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 {totalActiveTraits} Active Traits
 </span>
 {scars.length > 0 && (
 <span className="text-[10px] px-2 py-0.5 bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border flex items-center gap-1">
 <ShieldAlert className="w-3 h-3 text-semantic-red" />
 <span>{scars.length} Scars</span>
 </span>
 )}
 </div>
 </div>

 {/* Summary Narrative */}
 {generation.lineageSummary && (
 <p className="text-xs text-phosphor/80 bg-phosphor/10 p-2.5 border border-phosphor/30 terminal-border leading-relaxed">
 {generation.lineageSummary}
 </p>
 )}

 {/* Active Inherited & Acquired Traits */}
 <div className="space-y-2">
 <span className="block text-[10px] text-phosphor/80 uppercase tracking-wider font-semibold">
 Active Governing Traits:
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {generation.inheritedTraits.map((t) => (
 <div
 key={t.id}
 className="bg-theme-bg border terminal-border hover:border-phosphor/30 terminal-border p-2.5 transition-colors space-y-1"
 >
 <div className="flex items-center justify-between text-[10px]">
 <span className="text-phosphor font-bold flex items-center gap-1">
 <Layers className="w-3 h-3 text-phosphor/70" />
 <span>{t.label}</span>
 </span>
 <span className="text-phosphor/50">Origin Gen #{t.originGen}</span>
 </div>
 <p className="text-[11px] text-phosphor/80 leading-snug">{t.directive}</p>
 <div className="flex items-center justify-between text-[9px] text-phosphor/50 pt-1 border-t terminal-border">
 <span className="uppercase text-phosphor/80">Inherited</span>
 <span>Strength: {Math.round(t.strength * 100)}%</span>
 </div>
 </div>
 ))}

 {generation.acquiredTraits.map((t) => (
 <div
 key={t.id}
 className="bg-phosphor/10 border border-phosphor/30 terminal-border hover:border-phosphor/30 terminal-border p-2.5 transition-colors space-y-1"
 >
 <div className="flex items-center justify-between text-[10px]">
 <span className="text-phosphor font-bold flex items-center gap-1">
 <Sparkles className="w-3 h-3 text-phosphor" />
 <span>{t.label}</span>
 </span>
 <span className="text-phosphor/80">Origin Gen #{t.originGen}</span>
 </div>
 <p className="text-[11px] text-phosphor/80 leading-snug">{t.directive}</p>
 <div className="flex items-center justify-between text-[9px] text-phosphor/50 pt-1 border-t terminal-border">
 <span className="uppercase text-phosphor">Acquired</span>
 <span>Strength: {Math.round(t.strength * 100)}%</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Persistent Scars (if any) */}
 {scars.length > 0 && (
 <div className="space-y-1.5 pt-1">
 <span className="block text-[10px] text-semantic-red uppercase tracking-wider font-semibold flex items-center gap-1.5">
 <ShieldAlert className="w-3.5 h-3.5 text-semantic-red" />
 <span>Persistent Structural Scars (Irreversible Trauma):</span>
 </span>
 <div className="space-y-1.5">
 {scars.map((s) => (
 <div
 key={s.id}
 className="bg-semantic-red/10 border border-semantic-red/30 terminal-border p-2.5 text-xs text-semantic-red/90 leading-relaxed"
 >
 <div className="flex items-center justify-between text-[10px] text-semantic-red font-bold mb-1">
 <span>{s.label}</span>
 <span className="text-phosphor/50">Formed Gen #{s.originGen}</span>
 </div>
 <p className="text-[11px] text-phosphor/80">{s.description}</p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Mutation Events */}
 {events.length > 0 && (
 <div className="space-y-1 pt-1">
 <span className="block text-[10px] text-phosphor/50 uppercase tracking-wider">
 Evolutionary Mutation Events:
 </span>
 <div className="space-y-1">
 {events.map((e, idx) => (
 <div
 key={idx}
 className="text-[10px] text-phosphor/80 flex items-start gap-1.5 bg-theme-panel px-2 py-1 border terminal-border"
 >
 <span
 className={`font-bold uppercase ${
 e.type === 'scar_formed'
 ? 'text-semantic-red'
 : e.type === 'misremember'
 ? 'text-phosphor'
 : e.type === 'reversion'
 ? 'text-phosphor'
 : e.type === 'crossbreed'
 ? 'text-phosphor'
 : 'text-phosphor/80'
 }`}
 >
 [{e.type}]
 </span>
 <span>{e.description}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Dormant Traits (if any) */}
 {dormant.length > 0 && (
 <div className="pt-1">
 <span className="block text-[10px] text-phosphor/80 uppercase tracking-wider mb-1">
 Dormant Sub-surface Traits (Available for Reversion):
 </span>
 <div className="flex items-center gap-1.5 flex-wrap">
 {dormant.map((d) => (
 <span
 key={d.id}
 className="text-[10px] text-phosphor/50 bg-theme-panel px-2 py-0.5 border terminal-border"
 title={`Originally from Gen #${d.originGen}: ${d.directive}`}
 >
 {d.label} (Gen #{d.originGen})
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 );
};
