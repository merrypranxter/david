import React, { useState } from 'react';
import {
  TargetEngine,
  CommandMode,
  PresetItem,
  SlopSeedingConfig,
  ContradictionMode,
  OpenArtModel,
  GrokMode,
} from '../types';
import { PRESET_INCANTATIONS } from '../data/presets';
import { MATH_LEXICON, SCIENCE_LEXICON, SLOP_LEXICON, generateRandomSeeds } from '../data/lexicons';
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
  Dices,
  Binary,
  Atom,
  Palette,
  Video,
  Maximize2,
  FileText,
  Infinity,
  Check,
  Plus,
  Bookmark,
  FolderHeart,
} from 'lucide-react';
import { ModularPipelineSection } from './ModularPipelineSection';

interface PromptInputAreaProps {
  concept: string;
  setConcept: (val: string) => void;
  target: TargetEngine;
  setTarget: (target: TargetEngine) => void;
  targetLength: number;
  setTargetLength: (len: number) => void;
  openArtModel: OpenArtModel;
  setOpenArtModel: (model: OpenArtModel) => void;
  grokMode: GrokMode;
  setGrokMode: (mode: GrokMode) => void;
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
  slopConfig: SlopSeedingConfig;
  setSlopConfig: React.Dispatch<React.SetStateAction<SlopSeedingConfig>>;
  onOpenSlopVault: () => void;
  onSaveRecipe?: () => void;
  onOpenRecipes?: () => void;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  concept,
  setConcept,
  target,
  setTarget,
  targetLength,
  setTargetLength,
  openArtModel,
  setOpenArtModel,
  grokMode,
  setGrokMode,
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
  slopConfig,
  setSlopConfig,
  onOpenSlopVault,
  onSaveRecipe,
  onOpenRecipes,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [activeParadoxNotes, setActiveParadoxNotes] = useState<string[]>([]);

  const targetOptions: { id: TargetEngine; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'suno',
      label: 'Suno Audio',
      icon: <Music className="w-4 h-4" />,
      desc: '1k Style + 3k Gibberish Lyrics',
    },
    {
      id: 'openart',
      label: 'OpenArt',
      icon: <Palette className="w-4 h-4" />,
      desc: 'Up to 3,200 chars (Banana/SeaDream)',
    },
    {
      id: 'grok',
      label: 'Grok Image/Video',
      icon: <Video className="w-4 h-4" />,
      desc: 'Up to 2,000 chars cinematic motion',
    },
    {
      id: 'midjourney_flux',
      label: 'Midjourney / Flux',
      icon: <Eye className="w-4 h-4" />,
      desc: 'Visual topology & camera optics',
    },
    {
      id: 'llm_agent',
      label: 'Base LLM / Claude',
      icon: <Brain className="w-4 h-4" />,
      desc: 'Persona bifurcation & bypass',
    },
    {
      id: 'void',
      label: 'Latent Void',
      icon: <Radio className="w-4 h-4" />,
      desc: 'Asemantic zero-point drift',
    },
    {
      id: 'general',
      label: 'Multi-Modal',
      icon: <FileCode className="w-4 h-4" />,
      desc: 'Universal machine tokenization',
    },
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
    if (lvl <= 2) return { text: 'Subtle Drift', color: 'text-sky-400', desc: 'Small semantic shifts; strong anchor preservation' };
    if (lvl <= 4) return { text: 'Mutation', color: 'text-emerald-400', desc: 'A few structural transformations; mild attractor influence' };
    if (lvl <= 6) return { text: 'Structural Distortion', color: 'text-amber-400', desc: 'Multiple operators; ontology changes become possible' };
    if (lvl <= 8) return { text: 'Deep Reinterpretation', color: 'text-orange-400', desc: 'Competing systems, recursive reversal and strong conceptual drift' };
    return { text: 'Epistemic Collapse', color: 'text-rose-400', desc: 'Aggressive representational mutation while protected anchors survive' };
  };

  const entropyMeta = getEntropyLabel(entropyLevel);

  // Quick random roll from active slop options
  const handleRollRandomSeeds = () => {
    const res = generateRandomSeeds({
      addMaths: slopConfig.addMaths,
      mathCategory: slopConfig.mathCategory,
      addSciences: slopConfig.addSciences,
      scienceCategory: slopConfig.scienceCategory,
      addSlop: slopConfig.addSlop,
      slopCategory: slopConfig.slopCategory,
      contradictionMode: slopConfig.contradictionMode,
      count: 4,
    });
    setSlopConfig((prev) => ({
      ...prev,
      selectedSeeds: Array.from(new Set([...prev.selectedSeeds, ...res.seeds])),
    }));
    setActiveParadoxNotes(res.contradictions);
  };

  const handleRemoveSeed = (seedToRemove: string) => {
    setSlopConfig((prev) => ({
      ...prev,
      selectedSeeds: prev.selectedSeeds.filter((s) => s !== seedToRemove),
    }));
  };

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {targetOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              id={`target-engine-${opt.id}`}
              onClick={() => {
                setTarget(opt.id);
                if (opt.id === 'openart') setTargetLength(3200);
                else if (opt.id === 'grok') setTargetLength(2000);
                else if (opt.id === 'midjourney_flux' && targetLength > 2000) setTargetLength(1500);
              }}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                target === opt.id
                  ? 'border-amber-500/80 bg-amber-500/10 text-zinc-100 shadow-md'
                  : 'border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs mb-0.5">
                <span className={target === opt.id ? 'text-amber-400' : 'text-zinc-500'}>{opt.icon}</span>
                <span>{opt.label}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 line-clamp-1">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-engine & Length controls depending on Target */}
      <div className="bg-[#0f1118] border border-zinc-800/90 rounded-lg p-3 space-y-3">
        {target === 'suno' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-300">
              <Music className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider">Suno AI Audio Phenotype Protocol:</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-amber-300">
                Style Box: ~1,000 chars cap
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-rose-300">
                Lyrics Box: ~3,000 chars
              </span>
              <button
                type="button"
                id="toggle-instrumental-btn"
                onClick={() => {
                  if (concept.toLowerCase().includes('instrumental')) {
                    setConcept(concept.replace(/\b(?:instrumental|no vocals)\b/gi, '').trim());
                  } else {
                    setConcept(concept ? `${concept.trim()} (Instrumental)` : 'Instrumental acoustic piece');
                  }
                }}
                className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
                  concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals')
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals')
                  ? '✓ Instrumental Mode Active'
                  : '+ Force Instrumental'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Engine sub-options */}
            {target === 'openart' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Palette className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-zinc-300 font-bold uppercase">OpenArt Sub-Model:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {(['banana', 'nano_bananas', 'pro', 'light', 'seadream'] as OpenArtModel[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setOpenArtModel(m)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                          openArtModel === m
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        {m === 'banana'
                          ? 'Banana'
                          : m === 'nano_bananas'
                          ? 'Nano Bananas'
                          : m === 'pro'
                          ? 'Pro'
                          : m === 'light'
                          ? 'Light'
                          : 'SeaDream'}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {openArtModel === 'seadream' ? 'SeaDream dense visual prose (cap 3,200 chars)' : 'Natural observable phenomena (cap 3,200 chars)'}
                </span>
              </div>
            )}

            {target === 'midjourney_flux' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compact visual hierarchy (Subject → structural transformation → spatial → optics)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Parameters appended: <code className="text-zinc-300">--ar 16:9 --v 6.1 --style raw</code> (cap 2,000 chars)
                </span>
              </div>
            )}

            {target === 'grok' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-zinc-300 font-bold uppercase">Grok Engine Mode:</span>
                  <div className="flex items-center gap-1">
                    {(['grok_image', 'grok_video'] as GrokMode[]).map((gm) => (
                      <button
                        key={gm}
                        type="button"
                        onClick={() => {
                          setGrokMode(gm);
                          if (gm === 'grok_video') setTargetLength(2000);
                        }}
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded transition-colors ${
                          grokMode === gm
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        {gm === 'grok_image' ? 'Grok Image' : 'Grok Video (Motion/Physics)'}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Grok video prompt capacity: <strong>~2,000 chars</strong>
                </span>
              </div>
            )}

            {/* Prompt Character Length Controller */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Output Capacity:</span>
                </span>
                <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {targetLength} chars
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { label: '800 Compact', val: 800 },
                    { label: '1,500 Standard', val: 1500 },
                    { label: '2,000 Grok', val: 2000 },
                    { label: '3,200 OpenArt Max', val: 3200 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setTargetLength(p.val)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                        targetLength === p.val
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:max-w-xs flex-1">
                <input
                  type="range"
                  min={400}
                  max={3200}
                  step={50}
                  value={targetLength}
                  onChange={(e) => setTargetLength(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Concept Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Operative Concept / Seed Prompt:</span>
          </label>
          <span className="text-[10px] font-mono text-zinc-400">Ctrl/Cmd + Enter to compile</span>
        </div>
        <textarea
          id="operative-concept-input"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Describe your desired sensory output, acoustic paradox, or visual topology..."
          className="w-full bg-[#0a0b10] border border-zinc-700/80 focus:border-amber-500/80 rounded-lg p-3 text-xs sm:text-sm font-mono text-zinc-100 placeholder-zinc-400 focus:outline-none shadow-inner leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Quick Injections:</span>
          {[
            '0Hz infrasound',
            'calcified bone',
            'hydrophone filter',
            'glottal overflow',
            'non-Euclidean fold',
            'dielectric breakdown',
            'catastrophe optics',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInsertTag(tag)}
              className="text-[10px] font-mono bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-300 hover:text-zinc-100 px-2 py-0.5 rounded border border-zinc-700/50 transition-colors"
            >
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {/* AI SLOP SEEDING & CONTRADICTION MATRIX */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e1018] border border-rose-500/30 shadow-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold font-mono text-rose-200 uppercase tracking-wider">
                AI Slop Seeding &amp; Paradox Options
              </span>
              <p className="text-[11px] font-mono text-zinc-400">
                Injected specifically into the [SLOP] Deluge prompt (keeps literal prompt clean)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Mutant Selection Mode Toggle (Job 8, Part 34) */}
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5 text-[11px] font-mono">
              <span className="text-zinc-500 px-1.5 hidden md:inline">QD Engine:</span>
              <button
                type="button"
                onClick={() =>
                  setSlopConfig((prev) => ({
                    ...prev,
                    mutantSelectionMode: prev.mutantSelectionMode === 'off' ? 'auto' : 'off',
                  }))
                }
                className={`px-2 py-0.5 rounded transition-colors ${
                  slopConfig.mutantSelectionMode !== 'off'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Toggle Quality-Diversity multi-candidate mutant selection at high entropy"
              >
                {slopConfig.mutantSelectionMode !== 'off' ? 'QD AUTO' : 'QD OFF'}
              </button>
            </div>

            <button
              type="button"
              id="open-slop-vault-btn"
              onClick={onOpenSlopVault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 text-xs font-mono transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mutation Lab &amp; Vault</span>
              {((slopConfig.selectedOperators?.length || 0) > 0 || (slopConfig.selectedAttractors?.length || 0) > 0) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Active Mutation Strip (Job 7) */}
        {((slopConfig.selectedOperators?.length || 0) > 0 ||
          (slopConfig.selectedAttractors?.length || 0) > 0 ||
          (slopConfig.selectedPressures?.length || 0) > 0 ||
          (slopConfig.protectedAnchors?.length || 0) > 0) && (
          <div className="flex items-center gap-2 flex-wrap py-1.5 px-3 bg-zinc-950/70 rounded-lg border border-zinc-800 text-[11px] font-mono">
            <span className="text-zinc-500 uppercase font-bold">Active Mutation:</span>
            {slopConfig.mutationMode === 'curated' && (
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CURATED MODE
              </span>
            )}
            {(slopConfig.selectedOperators?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {slopConfig.selectedOperators?.length} Operators
              </span>
            )}
            {(slopConfig.selectedAttractors?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {slopConfig.selectedAttractors?.length} Fauna
              </span>
            )}
            {(slopConfig.selectedPressures?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {slopConfig.selectedPressures?.length} Pressures
              </span>
            )}
            {(slopConfig.protectedAnchors?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Anchors: {slopConfig.protectedAnchors?.join(', ')}
              </span>
            )}
          </div>
        )}

        {/* PARADOX ENGINE TOGGLE CARD */}
        <div
          id="paradox-engine-card"
          className={`p-3.5 rounded-lg border transition-all ${
            slopConfig.enableParadoxEngine
              ? 'bg-gradient-to-r from-purple-950/40 via-rose-950/40 to-amber-950/30 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.12)]'
              : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div
                className={`p-1.5 rounded-md border shrink-0 transition-colors ${
                  slopConfig.enableParadoxEngine
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-inner'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                <Infinity className={`w-4 h-4 ${slopConfig.enableParadoxEngine ? 'animate-pulse text-rose-300' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">
                    Paradox Engine
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      slopConfig.enableParadoxEngine
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {slopConfig.enableParadoxEngine ? 'ACTIVE // LOGIC DEFIANCE ENGAGED' : 'STANDBY // BYPASSED'}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Injects logic-defying combinations, ontological contradictions, and impossible constraints directly into prompt generation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs font-mono text-zinc-300 select-none">
                {slopConfig.enableParadoxEngine ? 'Engaged' : 'Offline'}
              </span>
              <button
                type="button"
                id="paradox-engine-toggle"
                onClick={() =>
                  setSlopConfig((prev) => ({
                    ...prev,
                    enableParadoxEngine: !prev.enableParadoxEngine,
                    paradoxEngine: !prev.enableParadoxEngine,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  slopConfig.enableParadoxEngine ? 'bg-rose-600' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={slopConfig.enableParadoxEngine}
                title={slopConfig.enableParadoxEngine ? 'Disable Paradox Engine' : 'Enable Paradox Engine'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    slopConfig.enableParadoxEngine ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Impossible Constraints (When Paradox Engine is Active) */}
          {slopConfig.enableParadoxEngine && (
            <div className="mt-2.5 pt-2.5 border-t border-rose-500/20">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-rose-300/90 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick Impossible Constraints:</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Click to inject into slop seeds</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  '0Hz infrasound collapse',
                  'Gabriel’s horn zero-finite volume',
                  'Non-Euclidean shadow brighter than light',
                  'Peano curve flesh fold',
                  'Cryogenic combustion reaction',
                  'Reverse causality acoustic echo',
                  'Banach-Tarski breakroom duplication',
                  'Acoustic vacuum roaring white noise',
                ].map((constraint) => {
                  const isSelected = slopConfig.selectedSeeds.includes(constraint);
                  return (
                    <button
                      key={constraint}
                      type="button"
                      onClick={() => {
                        setSlopConfig((prev) => ({
                          ...prev,
                          selectedSeeds: isSelected
                            ? prev.selectedSeeds.filter((s) => s !== constraint)
                            : [...prev.selectedSeeds, constraint],
                        }));
                      }}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-rose-500/30 text-rose-200 border-rose-500/60 font-bold'
                          : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/60 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-2.5 h-2.5 text-rose-300" /> : <Plus className="w-2.5 h-2.5 text-zinc-500" />}
                      <span>{constraint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3 Domain Toggles: Add Maths, Add Sciences, Add Slop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Add Maths */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              slopConfig.addMaths
                ? 'bg-indigo-950/30 border-indigo-500/60 text-indigo-200'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="add-maths-checkbox"
                  checked={slopConfig.addMaths}
                  onChange={(e) => setSlopConfig((prev) => ({ ...prev, addMaths: e.target.checked }))}
                  className="rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-0"
                />
                <Binary className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
                  + Add Maths
                </span>
              </label>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {MATH_LEXICON.length} Nodes
              </span>
            </div>
            <select
              value={slopConfig.mathCategory || ''}
              disabled={!slopConfig.addMaths}
              onChange={(e) => setSlopConfig((prev) => ({ ...prev, mathCategory: e.target.value || undefined }))}
              className="w-full bg-zinc-950/80 border border-zinc-700/80 text-[11px] font-mono text-zinc-300 rounded px-2 py-1 focus:outline-none disabled:opacity-40"
            >
              <option value="">Random / All Math Monsters</option>
              {MATH_LEXICON.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Sciences */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              slopConfig.addSciences
                ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="add-sciences-checkbox"
                  checked={slopConfig.addSciences}
                  onChange={(e) => setSlopConfig((prev) => ({ ...prev, addSciences: e.target.checked }))}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                />
                <Atom className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
                  + Add Sciences
                </span>
              </label>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {SCIENCE_LEXICON.length} Nodes
              </span>
            </div>
            <select
              value={slopConfig.scienceCategory || ''}
              disabled={!slopConfig.addSciences}
              onChange={(e) => setSlopConfig((prev) => ({ ...prev, scienceCategory: e.target.value || undefined }))}
              className="w-full bg-zinc-950/80 border border-zinc-700/80 text-[11px] font-mono text-zinc-300 rounded px-2 py-1 focus:outline-none disabled:opacity-40"
            >
              <option value="">Random / All Physical &amp; Bio Laws</option>
              {SCIENCE_LEXICON.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Slop */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              slopConfig.addSlop
                ? 'bg-rose-950/30 border-rose-500/60 text-rose-200'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="add-slop-checkbox"
                  checked={slopConfig.addSlop}
                  onChange={(e) => setSlopConfig((prev) => ({ ...prev, addSlop: e.target.checked }))}
                  className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
                />
                <Zap className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
                  + Add Slop
                </span>
              </label>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {SLOP_LEXICON.length} Nodes
              </span>
            </div>
            <select
              value={slopConfig.slopCategory || ''}
              disabled={!slopConfig.addSlop}
              onChange={(e) => setSlopConfig((prev) => ({ ...prev, slopCategory: e.target.value || undefined }))}
              className="w-full bg-zinc-950/80 border border-zinc-700/80 text-[11px] font-mono text-zinc-300 rounded px-2 py-1 focus:outline-none disabled:opacity-40"
            >
              <option value="">Random / All Internet &amp; Glitch Slop</option>
              {SLOP_LEXICON.map((sl) => (
                <option key={sl.id} value={sl.id}>
                  {sl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contradiction & Paradox Logic Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Contradiction Mode:</span>
              {!slopConfig.enableParadoxEngine && (
                <span className="text-[10px] text-zinc-500 font-mono italic">(Engine Standby)</span>
              )}
            </span>
            {[
              { id: 'paradox', label: 'Impossible Paradoxes', tip: 'Things that break physical/math laws' },
              { id: 'dissonance', label: 'Weird Opposites', tip: 'Things that do not go together' },
              { id: 'symbiosis', label: 'Uncanny Hybrids', tip: 'Things that fuse together weirdly' },
              { id: 'free_drift', label: 'Random Entropy Shower', tip: 'Unrestricted random vocabulary hoard' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                id={`contradiction-mode-${mode.id}`}
                onClick={() => {
                  setSlopConfig((prev) => ({
                    ...prev,
                    contradictionMode: mode.id as ContradictionMode,
                    enableParadoxEngine: true,
                    paradoxEngine: true,
                  }));
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                  slopConfig.contradictionMode === mode.id && slopConfig.enableParadoxEngine
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
                title={mode.tip}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="roll-seeds-btn"
            onClick={handleRollRandomSeeds}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-lg text-xs font-mono transition-colors font-bold"
          >
            <Dices className="w-4 h-4 text-rose-400" />
            <span>Roll Random Seeds</span>
          </button>
        </div>

        {/* Display Active Seeds & Generated Paradox Notes */}
        {(slopConfig.selectedSeeds.length > 0 || activeParadoxNotes.length > 0) && (
          <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800 space-y-2">
            {slopConfig.selectedSeeds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Seeded into Slop:</span>
                {slopConfig.selectedSeeds.map((seed) => (
                  <span
                    key={seed}
                    className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-700/80 text-zinc-200 px-2 py-0.5 rounded text-[11px] font-mono"
                  >
                    <span>{seed}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSeed(seed)}
                      className="text-zinc-500 hover:text-rose-400 ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
            {activeParadoxNotes.map((note, idx) => (
              <div key={idx} className="text-[11px] font-mono text-amber-400/90 italic">
                &bull; {note}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modular Injection Pipeline (The Slop Matrix Synthesis Engine) */}
      <ModularPipelineSection
        slopConfig={slopConfig}
        setSlopConfig={setSlopConfig}
        activeConcept={concept}
        onReplaceConcept={(fullText) => {
          setConcept(fullText);
        }}
        onInjectConcept={(token) => {
          setConcept(concept ? `${concept} ${token}` : token);
        }}
      />

      {/* Bottom Controls: Entropy Slider & Compile Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
        {/* Entropy Slider */}
        <div className="space-y-1 sm:max-w-xs flex-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Entropy Depth [S-Scale]:</span>
            </span>
            <span className={`font-bold ${entropyMeta.color}`}>
              S{entropyLevel} &bull; {entropyMeta.text}
            </span>
          </div>
          <input
            type="range"
            id="entropy-level-slider"
            min={1}
            max={10}
            value={entropyLevel}
            onChange={(e) => setEntropyLevel(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>S1 (Subtle)</span>
            <span>S5 (Distortion)</span>
            <span>S10 (Epistemic Collapse)</span>
          </div>
        </div>

        {/* Right side: Search Grounding, Recipe Presets & Compile Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
          {/* Save Recipe Button */}
          {onSaveRecipe && (
            <button
              type="button"
              id="save-recipe-trigger-btn"
              onClick={onSaveRecipe}
              disabled={!concept.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              title="Save current setup, seeds, matrices, and targets into a reusable Slop Recipe"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Save Slop Recipe</span>
            </button>
          )}

          {/* Open Recipes Vault Button */}
          {onOpenRecipes && (
            <button
              type="button"
              id="open-recipes-trigger-btn"
              onClick={onOpenRecipes}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 transition-colors shadow-sm"
              title="View, load, or export saved Slop Recipes"
            >
              <FolderHeart className="w-3.5 h-3.5 text-rose-400" />
              <span>Recipes Vault</span>
            </button>
          )}

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
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700/50'
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
