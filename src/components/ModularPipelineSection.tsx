import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  X,
  Trash2,
  Play,
  RotateCcw,
  Copy,
  ChevronRight,
  Cpu,
  Flame,
  Binary,
  Radio,
  Shuffle,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import {
  SLOP_MATRIX_MODULES,
  PIPELINE_PRESETS,
  executePipeline,
  MatrixModule,
} from '../data/slopMatrix';
import { SlopSeedingConfig } from '../types';

interface ModularPipelineSectionProps {
  slopConfig: SlopSeedingConfig;
  setSlopConfig: React.Dispatch<React.SetStateAction<SlopSeedingConfig>>;
  activeConcept: string;
  onInjectConcept: (glitchedToken: string) => void;
  onReplaceConcept?: (fullText: string) => void;
}

export const ModularPipelineSection: React.FC<ModularPipelineSectionProps> = ({
  slopConfig,
  setSlopConfig,
  activeConcept,
  onInjectConcept,
  onReplaceConcept,
}) => {
  const activePipeline = slopConfig.activePipeline || [];
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<
    'all' | 'category_a' | 'category_b' | 'category_c'
  >('all');
  const [sandboxInput, setSandboxInput] = useState<string>('Victorian Space-Travel');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(true);

  // Toggle or append a module to the pipeline
  const toggleModule = (id: string) => {
    setSlopConfig((prev) => {
      const current = prev.activePipeline || [];
      const exists = current.includes(id);
      const updated = exists ? current.filter((m) => m !== id) : [...current, id];
      return {
        ...prev,
        activePipeline: updated,
      };
    });
  };

  // Move stage left
  const moveStageLeft = (index: number) => {
    if (index === 0) return;
    setSlopConfig((prev) => {
      const current = [...(prev.activePipeline || [])];
      const temp = current[index - 1];
      current[index - 1] = current[index];
      current[index] = temp;
      return { ...prev, activePipeline: current };
    });
  };

  // Move stage right
  const moveStageRight = (index: number) => {
    const current = slopConfig.activePipeline || [];
    if (index >= current.length - 1) return;
    setSlopConfig((prev) => {
      const updated = [...(prev.activePipeline || [])];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, activePipeline: updated };
    });
  };

  // Remove single stage
  const removeStage = (id: string) => {
    setSlopConfig((prev) => ({
      ...prev,
      activePipeline: (prev.activePipeline || []).filter((m) => m !== id),
    }));
  };

  // Clear all
  const clearPipeline = () => {
    setSlopConfig((prev) => ({
      ...prev,
      activePipeline: [],
    }));
  };

  // Load preset
  const loadPreset = (moduleIds: string[]) => {
    setSlopConfig((prev) => ({
      ...prev,
      activePipeline: [...moduleIds],
    }));
  };

  // Execute pipeline in sandbox
  const executionSteps = useMemo(() => {
    return executePipeline(sandboxInput, activePipeline);
  }, [sandboxInput, activePipeline]);

  // Final transformed result
  const finalPipelineOutput =
    executionSteps.length > 0
      ? executionSteps[executionSteps.length - 1].textAfter
      : sandboxInput;

  // Filter modules
  const allModules = Object.values(SLOP_MATRIX_MODULES);
  const filteredModules = useMemo(() => {
    if (selectedCategoryTab === 'category_a') {
      return allModules.filter(
        (m) => m.category === 'system_disruptor' || m.category === 'encoding_glitch'
      );
    }
    if (selectedCategoryTab === 'category_b') {
      return allModules.filter((m) => m.category === 'conceptual_paradox');
    }
    if (selectedCategoryTab === 'category_c') {
      return allModules.filter((m) => m.category === 'obscure_seed');
    }
    return allModules;
  }, [selectedCategoryTab, allModules]);

  const handleCopy = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 1800);
  };

  return (
    <div
      id="modular-pipeline-container"
      className="mt-4 rounded-xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950 p-4 sm:p-5 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-72 h-40 bg-rose-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-zinc-100 flex items-center gap-2">
                <span>Modular Injection Pipeline</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-normal bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SLOP MATRIX ENGINE
                </span>
              </h3>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Stack system-level disruptors, conceptual paradoxes, and deep-layer seed vectors into an exponential permutation chain.
            </p>
          </div>
        </div>

        {/* Permutation counter & actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong className="text-amber-300">{activePipeline.length}</strong> Filters Active
            </span>
          </div>

          {activePipeline.length > 0 && (
            <button
              type="button"
              onClick={clearPipeline}
              className="px-2 py-1 rounded bg-zinc-800/80 hover:bg-rose-950/40 text-[10px] font-mono text-zinc-400 hover:text-rose-300 border border-zinc-700/60 hover:border-rose-500/40 transition-colors flex items-center gap-1"
              title="Clear all active pipeline modules"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. ACTIVE PIPELINE STACK BAR */}
      <div className="mt-3.5 p-3 rounded-lg bg-black/50 border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Pipeline Execution Sequence:</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {activePipeline.length === 0 ? 'No filters stacked' : 'Filters execute left to right'}
          </span>
        </div>

        {activePipeline.length === 0 ? (
          <div className="py-4 px-3 text-center rounded border border-dashed border-zinc-800 text-zinc-500 text-xs font-mono">
            <span>Pipeline is empty. Click any module below or select a Quick-Stack Preset to engage disruptions.</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {activePipeline.map((modId, idx) => {
              const mod = SLOP_MATRIX_MODULES[modId];
              if (!mod) return null;
              const isFirst = idx === 0;
              const isLast = idx === activePipeline.length - 1;

              return (
                <React.Fragment key={`${modId}-${idx}`}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-amber-500/40 shadow-sm group">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center border border-amber-500/40">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-zinc-200 leading-tight">
                        {mod.name}
                      </span>
                      <span className="text-[9px] font-mono text-amber-400/80">
                        {mod.categoryTag} // {mod.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 ml-1.5 border-l border-zinc-700/60 pl-1">
                      <button
                        type="button"
                        onClick={() => moveStageLeft(idx)}
                        disabled={isFirst}
                        className={`text-[9px] px-1 py-0.5 font-mono rounded ${
                          isFirst
                            ? 'text-zinc-600 cursor-not-allowed'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Move stage left"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStageRight(idx)}
                        disabled={isLast}
                        className={`text-[9px] px-1 py-0.5 font-mono rounded ${
                          isLast
                            ? 'text-zinc-600 cursor-not-allowed'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Move stage right"
                      >
                        ▶
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStage(modId)}
                        className="text-zinc-500 hover:text-rose-400 p-0.5 ml-0.5 transition-colors"
                        title="Remove stage"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {!isLast && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. QUICK-STACK PRESETS */}
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Curated Permutation Stacks:</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">One-click filter chains</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PIPELINE_PRESETS.map((preset) => {
            const isActive =
              preset.modules.length === activePipeline.length &&
              preset.modules.every((m, i) => activePipeline[i] === m);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset.modules)}
                className={`p-2 rounded-lg text-left transition-all border font-mono flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-sm'
                    : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold leading-tight truncate">
                      {preset.name}
                    </span>
                    {isActive && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.tagline}
                  </p>
                </div>
                <div className="mt-1.5 pt-1 border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-500">
                  <span>{preset.modules.length} modules</span>
                  <span className="text-amber-400/80">Stack ➔</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SLOP MATRIX MODULE BROWSER */}
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
              The Slop Matrix Catalog:
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Click to add/remove filters from active stack
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'category_a', label: 'Cat A: System Disruptors' },
              { id: 'category_b', label: 'Cat B: Paradoxes' },
              { id: 'category_c', label: 'Cat C: Obscure Seeds' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategoryTab(tab.id as any)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                  selectedCategoryTab === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {filteredModules.map((mod) => {
            const inStackIndex = activePipeline.indexOf(mod.id);
            const isInStack = inStackIndex !== -1;

            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between select-none ${
                  isInStack
                    ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 shadow-sm'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          mod.categoryTag === 'Category A' || mod.categoryTag === 'Encoding'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : mod.categoryTag === 'Category B'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        }`}
                      >
                        {mod.categoryTag} // {mod.code}
                      </span>
                    </div>

                    {isInStack ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/60 flex items-center gap-1 shrink-0">
                        <Check className="w-2.5 h-2.5 text-amber-300" />
                        <span>Stage {inStackIndex + 1}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 shrink-0">
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-mono font-bold text-zinc-100 mt-1.5 flex items-center gap-1.5">
                    <span>{mod.name}</span>
                  </h4>

                  <p className="text-[11px] font-mono text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {mod.tagline}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex flex-wrap gap-1">
                    {mod.examples.slice(0, 3).map((ex, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-zinc-800/80 truncate max-w-[200px]"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. INTERACTIVE LIVE PIPELINE SANDBOX (THE "HAUNTED MACHINE" TRANSFORMER) */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className="flex items-center gap-2 text-left"
          >
            <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                <span>Live Pipeline Execution Sandbox</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                  Real-time Token Glitcher
                </span>
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (activeConcept && activeConcept.trim().length > 0) {
                setSandboxInput(activeConcept);
              } else {
                setSandboxInput('Victorian Space-Travel');
              }
            }}
            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
          >
            <span>Load Entire Active Concept ({activeConcept ? `${activeConcept.length} chars` : 'empty'})</span>
          </button>
        </div>

        {isSandboxOpen && (
          <div className="p-3.5 rounded-lg bg-black/70 border border-zinc-800 font-mono">
            {/* Input prompt to transform */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Input Concept to Process:</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {sandboxInput.length} characters (100% full text preserved across pipeline)
                </span>
              </div>
              <textarea
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                rows={3}
                placeholder="Enter or paste your entire concept here (no truncation, any length)..."
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-amber-500 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 font-mono leading-relaxed focus:outline-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    if (activeConcept && activeConcept.trim().length > 0) {
                      setSandboxInput(activeConcept);
                    }
                  }}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
                >
                  Pull Full Concept from Editor
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSandboxInput('')}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded bg-zinc-800"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleSeeds = [
                        'Victorian Space-Travel through a Liquid Granite Nebula with brass chronometers and transparent lead observation domes',
                        'Ancient cybernetic cathedral constructed from mineral-based anatomy and vibrating acoustic crystals under cryogenic combustion',
                        'Corporate boardroom commercial for luxury shampoo that continuously folds into a non-Euclidean vacuum without altering marketing rhetoric',
                      ];
                      const pick = sampleSeeds[Math.floor(Math.random() * sampleSeeds.length)];
                      setSandboxInput(pick);
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] flex items-center gap-1 border border-zinc-700"
                    title="Roll random seed concept"
                  >
                    <Shuffle className="w-3 h-3 text-amber-400" />
                    <span>Sample Seed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Stages Display */}
            {activePipeline.length === 0 ? (
              <div className="p-3 text-center text-xs text-zinc-500 rounded border border-dashed border-zinc-800">
                <span>Select at least 1 module above to view the live execution stages.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Initial state */}
                <div className="flex items-start gap-2 text-xs p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                    RAW SEED
                  </span>
                  <div className="flex-1 break-words whitespace-pre-wrap text-zinc-300 text-xs">
                    {sandboxInput}
                  </div>
                </div>

                {/* Step-by-step transformations */}
                {executionSteps.map((step) => (
                  <div
                    key={step.step}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs p-2.5 rounded bg-zinc-900 border border-amber-500/20"
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        STEP {step.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-zinc-400 font-bold mb-1">
                          {step.moduleName} ({step.categoryTag})
                        </div>
                        <div className="break-words whitespace-pre-wrap text-amber-200 font-mono text-xs leading-relaxed selection:bg-amber-500 selection:text-black">
                          {step.textAfter}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopy(step.textAfter, step.step)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] flex items-center gap-1"
                        title="Copy this step result"
                      >
                        {copiedStep === step.step ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Final Result Card with Injection & Replacement Triggers */}
                <div className="mt-3 p-3.5 rounded-lg bg-gradient-to-r from-amber-950/40 via-zinc-900 to-rose-950/40 border border-amber-500/40 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Final Transformed Concept ({finalPipelineOutput.length} characters):</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        Entire Concept Preserved
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-xs text-zinc-100 font-mono break-words whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto selection:bg-amber-400 selection:text-black">
                      {finalPipelineOutput}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(finalPipelineOutput, 999)}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 border border-zinc-700"
                    >
                      {copiedStep === 999 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied Output</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onInjectConcept(finalPipelineOutput)}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 text-xs flex items-center gap-1 transition-colors"
                      title="Append to your existing concept"
                    >
                      <span>+ Append to Concept</span>
                    </button>

                    {onReplaceConcept && (
                      <button
                        type="button"
                        onClick={() => onReplaceConcept(finalPipelineOutput)}
                        className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                        title="Replace entire active concept in main editor with this complete transformed result"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Replace Entire Concept in Editor</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
