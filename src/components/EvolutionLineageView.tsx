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
    <div className="bg-[#0b0d14] border border-amber-500/30 rounded-xl p-4 space-y-3.5 font-mono">
      {/* Header with Generation ID & Parents */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Dna className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <span>GENOTYPE: GEN #{generation.generationNumber}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
                {generation.generationId}
              </span>
            </div>
            {generation.parentGenerationIds && generation.parentGenerationIds.length > 0 && (
              <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                <GitMerge className="w-3 h-3 text-amber-500/60" />
                <span>Lineage Parents: {generation.parentGenerationIds.join(' x ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
            {totalActiveTraits} Active Traits
          </span>
          {scars.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/40 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>{scars.length} Scars</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary Narrative */}
      {generation.lineageSummary && (
        <p className="text-xs text-amber-200/80 bg-amber-950/20 p-2.5 rounded border border-amber-500/20 leading-relaxed">
          {generation.lineageSummary}
        </p>
      )}

      {/* Active Inherited & Acquired Traits */}
      <div className="space-y-2">
        <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
          Active Governing Traits:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {generation.inheritedTraits.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/40 rounded-lg p-2.5 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-500/70" />
                  <span>{t.label}</span>
                </span>
                <span className="text-zinc-500">Origin Gen #{t.originGen}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">{t.directive}</p>
              <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="uppercase text-amber-500/80">Inherited</span>
                <span>Strength: {Math.round(t.strength * 100)}%</span>
              </div>
            </div>
          ))}

          {generation.acquiredTraits.map((t) => (
            <div
              key={t.id}
              className="bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg p-2.5 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{t.label}</span>
                </span>
                <span className="text-emerald-500/80">Origin Gen #{t.originGen}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">{t.directive}</p>
              <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="uppercase text-emerald-400">Acquired</span>
                <span>Strength: {Math.round(t.strength * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Scars (if any) */}
      {scars.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="block text-[10px] text-rose-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Persistent Structural Scars (Irreversible Trauma):</span>
          </span>
          <div className="space-y-1.5">
            {scars.map((s) => (
              <div
                key={s.id}
                className="bg-rose-950/25 border border-rose-500/30 rounded-lg p-2.5 text-xs text-rose-200/90 leading-relaxed"
              >
                <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold mb-1">
                  <span>{s.label}</span>
                  <span className="text-zinc-500">Formed Gen #{s.originGen}</span>
                </div>
                <p className="text-[11px] text-zinc-300">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mutation Events */}
      {events.length > 0 && (
        <div className="space-y-1 pt-1">
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">
            Evolutionary Mutation Events:
          </span>
          <div className="space-y-1">
            {events.map((e, idx) => (
              <div
                key={idx}
                className="text-[10px] text-zinc-400 flex items-start gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800/80"
              >
                <span
                  className={`font-bold uppercase ${
                    e.type === 'scar_formed'
                      ? 'text-rose-400'
                      : e.type === 'misremember'
                      ? 'text-amber-400'
                      : e.type === 'reversion'
                      ? 'text-cyan-400'
                      : e.type === 'crossbreed'
                      ? 'text-purple-400'
                      : 'text-zinc-400'
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
          <span className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
            Dormant Sub-surface Traits (Available for Reversion):
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {dormant.map((d) => (
              <span
                key={d.id}
                className="text-[10px] text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800"
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
