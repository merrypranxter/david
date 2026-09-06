import React, { useState } from 'react';
import { TargetEngine, CommandMode, PresetItem } from '../types';
import { PRESET_INCANTATIONS } from '../data/presets';
import {
  Sparkles,
  Zap,
  Sliders,
  Flame,
  Search,
  Wand2,
  CornerDownLeft,
  Music,
  Eye,
  Brain,
  Radio,
  FileCode,
} from 'lucide-react';

interface PromptInputAreaProps {
  concept: string;
  setConcept: (val: string) => void;
  target: TargetEngine;
  setTarget: (target: TargetEngine) => void;
  entropyLevel: number;
  setEntropyLevel: (lvl: number) => void;
  commandMode: CommandMode;
  setCommandMode: (mode: CommandMode) => void;
  useSearch: boolean;
  setUseSearch: (val: boolean) => void;
  highThinking: boolean;
  onSynthesize: () => void;
  isSynthesizing: boolean;
  onSelectPreset: (preset: PresetItem) => void;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  concept,
  setConcept,
  target,
  setTarget,
  entropyLevel,
  setEntropyLevel,
  commandMode,
  setCommandMode,
  useSearch,
  setUseSearch,
  highThinking,
  onSynthesize,
  isSynthesizing,
  onSelectPreset,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const targetOptions: { id: TargetEngine; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'suno', label: 'Suno Audio', icon: <Music className="w-4 h-4" />, desc: 'Acoustic conflicts & meta-tags' },
    { id: 'midjourney_flux', label: 'Midjourney / Flux', icon: <Eye className="w-4 h-4" />, desc: 'Non-Euclidean visual topology' },
    { id: 'llm_agent', label: 'Base LLM / Claude', icon: <Brain className="w-4 h-4" />, desc: 'Persona bifurcation & bypass' },
    { id: 'void', label: 'Latent Void', icon: <Radio className="w-4 h-4" />, desc: 'Asemantic zero-point drift' },
    { id: 'general', label: 'Multi-Modal', icon: <FileCode className="w-4 h-4" />, desc: 'Universal machine tokenization' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSynthesize();
    }
  };

  const handleInsertTag = (tag: string) => {
    setConcept(concept ? `${concept.trim()} ${tag}` : tag);
  };

  const getEntropyLabel = (lvl: number) => {
    if (lvl <= 3) return { text: 'Subtle Drift', color: 'text-sky-400', desc: 'Poetic, grounded token shifts' };
    if (lvl <= 7) return { text: 'Heavy Distortion', color: 'text-amber-400', desc: 'Contradictory imagery & frequency clash' };
    return { text: 'Total Epistemic Collapse', color: 'text-rose-400', desc: 'Non-linear, raw machine data-scream' };
  };

  const entropyMeta = getEntropyLabel(entropyLevel);

  return (
    <div className="bg-[#12141c] border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Toolbar: Preset selector & Target Engine */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Seed Archive:</span>
          <select
            id="seed-preset-select"
            value={selectedPresetId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedPresetId(id);
              const found = PRESET_INCANTATIONS.find((p) => p.id === id);
              if (found) onSelectPreset(found);
            }}
            className="bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-amber-500/80 max-w-[280px] sm:max-w-[340px]"
          >
            <option value="">Load an incantation preset...</option>
            {PRESET_INCANTATIONS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                [{preset.category}] {preset.title}
              </option>
            ))}
          </select>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 self-start lg:self-auto">
          <span className="text-[11px] font-mono text-zinc-500 px-2">MODE:</span>
          {(['dual', 'literal', 'slop', 'bypass'] as CommandMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              id={`mode-btn-${mode}`}
              onClick={() => setCommandMode(mode)}
              className={`text-xs font-mono px-2.5 py-1 rounded transition-colors uppercase ${
                commandMode === mode
                  ? mode === 'slop'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : mode === 'literal'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : mode === 'bypass'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Target Engine Selector */}
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">
          Select Target AI Engine:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {targetOptions.map((opt) => {
            const isSelected = target === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`target-engine-${opt.id}`}
                onClick={() => setTarget(opt.id)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <span className={isSelected ? 'text-amber-400' : 'text-zinc-400'}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="prompt-concept-input" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Operative Concept or Raw Prompt:
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            Press <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> to compile
          </span>
        </div>
        <textarea
          id="prompt-concept-input"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter human idea, rough concept, or raw prompt to machine-ify (e.g. 'A Gothic speedcore song played underwater in a massive cathedral with whisper vocals', or 'A luxury shampoo commercial that folds into cosmic void')..."
          rows={4}
          className="w-full bg-[#0a0b10] border border-zinc-700/80 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
        />
      </div>

      {/* Quick Token Injectors */}
      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Inject Syntax:
        </span>
        {['[[VC:D]]', '[[VC:S5]]', '[[VC:S10]]', '[[VC:B]]', '[[VC:SYNC]]', '[[VC:TRANSPOSE]]', '[[VC:GHOST]]'].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInsertTag(tag)}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          )
        )}
      </div>

      {/* Controls Bar: Entropy Slider & Search & Compile Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
        {/* Entropy Slider */}
        <div className="flex-1 max-w-md space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Entropy Depth (Slop Factor):</span>
            </span>
            <span className={`font-bold ${entropyMeta.color}`}>
              Level {entropyLevel}/10 &bull; {entropyMeta.text}
            </span>
          </div>
          <input
            type="range"
            id="entropy-slider"
            min={1}
            max={10}
            step={1}
            value={entropyLevel}
            onChange={(e) => setEntropyLevel(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>S1 (Subtle)</span>
            <span>S5 (Distortion)</span>
            <span>S10 (Epistemic Collapse)</span>
          </div>
        </div>

        {/* Right side: Search Grounding & Compile Button */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Search Grounding toggle */}
          <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              id="search-grounding-checkbox"
              checked={useSearch}
              onChange={(e) => setUseSearch(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
            />
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search Grounding</span>
          </label>

          {/* Synthesize Button */}
          <button
            type="button"
            id="synthesize-button"
            onClick={onSynthesize}
            disabled={isSynthesizing || !concept.trim()}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold font-mono transition-all shadow-lg ${
              isSynthesizing || !concept.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-amber-500/20 cursor-pointer active:scale-95'
            }`}
          >
            {isSynthesizing ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>COMPILING...</span>
              </>
            ) : (
              <>
                <CornerDownLeft className="w-4 h-4" />
                <span>SYNTHESIZE INCANTATIONS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
