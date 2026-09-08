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
 className="mt-4 border terminal-border bg-theme-panel p-4 sm:p-5 shadow-2xl relative overflow-hidden"
 >
 {/* Decorative ambient glow removed for terminal styling */}

 {/* Header bar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b terminal-border pb-3.5">
 <div className="flex items-center gap-2.5">
 <div className="p-2 border terminal-border bg-theme-bg text-phosphor shrink-0">
 <Layers className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-[12px] font-bold tracking-widest uppercase font-display text-phosphor flex items-center gap-2">
 <span>Modular Injection Pipeline</span>
 <span className="text-[9px] px-1.5 py-0.5 font-display tracking-widest bg-phosphor/10 text-phosphor border terminal-border font-bold">
 SLOP MATRIX ENGINE
 </span>
 </h3>
 </div>
 <p className="text-[10px] font-mono text-phosphor/50 mt-0.5">
 Stack system-level disruptors, conceptual paradoxes, and deep-layer seed vectors into an exponential permutation chain.
 </p>
 </div>
 </div>

 {/* Permutation counter & actions */}
 <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
 <div className="px-2 py-1 border terminal-border bg-theme-bg text-[10px] font-display uppercase tracking-widest font-bold text-phosphor flex items-center gap-1.5">
 <span className="w-2 h-2 bg-phosphor animate-pulse" />
 <span>
 <strong className="text-phosphor">{activePipeline.length}</strong> Filters Active
 </span>
 </div>

 {activePipeline.length > 0 && (
 <button
 type="button"
 onClick={clearPipeline}
 className="px-2 py-1 bg-theme-bg hover:bg-semantic-red/20 text-[9px] font-display tracking-widest font-bold uppercase text-phosphor/50 hover:text-semantic-red border terminal-border transition-colors flex items-center gap-1"
 title="Clear all active pipeline modules"
 >
 <Trash2 className="w-3 h-3" />
 <span>Clear</span>
 </button>
 )}
 </div>
 </div>

 {/* 1. ACTIVE PIPELINE STACK BAR */}
 <div className="mt-3.5 p-3 border terminal-border bg-theme-bg">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[9px] font-display font-bold uppercase tracking-widest text-phosphor/60 flex items-center gap-1.5">
 <Cpu className="w-3.5 h-3.5 text-phosphor" />
 <span>Active Pipeline Execution Sequence:</span>
 </span>
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/40">
 {activePipeline.length === 0 ? 'No filters stacked' : 'Filters execute left to right'}
 </span>
 </div>

 {activePipeline.length === 0 ? (
 <div className="py-4 px-3 text-center border-dashed terminal-border text-phosphor/40 text-[10px] font-mono">
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
 <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel border terminal-border shadow-sm group">
 <span className="w-4 h-4 bg-phosphor/10 text-phosphor text-[10px] font-display font-bold flex items-center justify-center border terminal-border">
 {idx + 1}
 </span>
 <div className="flex flex-col">
 <span className="text-[10px] font-mono font-bold text-phosphor leading-tight">
 {mod.name}
 </span>
 <span className="text-[9px] font-mono text-phosphor/80">
 {mod.categoryTag} // {mod.code}
 </span>
 </div>

 <div className="flex items-center gap-0.5 ml-1.5 border-l terminal-border pl-1">
 <button
 type="button"
 onClick={() => moveStageLeft(idx)}
 disabled={isFirst}
 className={`text-[9px] px-1 py-0.5 font-mono ${
 isFirst
 ? 'text-phosphor/20 cursor-not-allowed'
 : 'text-phosphor/50 hover:text-phosphor hover:bg-phosphor/10'
 }`}
 title="Move stage left"
 >
 ◀
 </button>
 <button
 type="button"
 onClick={() => moveStageRight(idx)}
 disabled={isLast}
 className={`text-[9px] px-1 py-0.5 font-mono ${
 isLast
 ? 'text-phosphor/20 cursor-not-allowed'
 : 'text-phosphor/50 hover:text-phosphor hover:bg-phosphor/10'
 }`}
 title="Move stage right"
 >
 ▶
 </button>
 <button
 type="button"
 onClick={() => removeStage(modId)}
 className="text-phosphor/50 hover:text-semantic-red p-0.5 ml-0.5 transition-colors"
 title="Remove stage"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 {!isLast && (
 <ArrowRight className="w-3.5 h-3.5 text-phosphor/40 shrink-0" />
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
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/60 flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-phosphor" />
 <span>Curated Permutation Stacks:</span>
 </span>
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/40">One-click filter chains</span>
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
 className={`p-2 transition-all border terminal-border flex flex-col justify-between ${
 isActive
 ? 'bg-phosphor/20 border-phosphor text-phosphor shadow-sm'
 : 'bg-theme-bg hover:bg-phosphor/5 border-phosphor/30 text-phosphor/60 hover:text-phosphor'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-1">
 <span className="text-[10px] font-display uppercase tracking-widest font-bold leading-tight truncate">
 {preset.name}
 </span>
 {isActive && <Check className="w-3 h-3 text-phosphor shrink-0" />}
 </div>
 <p className="text-[9px] font-mono mt-1 line-clamp-2 leading-relaxed opacity-80">
 {preset.tagline}
 </p>
 </div>
 <div className="mt-1.5 pt-1 border-t terminal-border flex items-center justify-between text-[9px] font-display tracking-widest uppercase opacity-70">
 <span>{preset.modules.length} modules</span>
 <span className={isActive ? "text-phosphor" : "text-phosphor"}>Stack ➔</span>
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* 3. SLOP MATRIX MODULE BROWSER */}
 <div className="mt-4 pt-3 border-t terminal-border">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
 <div className="flex items-center gap-2">
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor font-bold">
 The Slop Matrix Catalog:
 </span>
 <span className="text-[9px] font-display tracking-widest uppercase text-phosphor/40">
 Click to add/remove filters from active stack
 </span>
 </div>

 {/* Category Tabs */}
 <div className="flex flex-wrap items-center gap-1 bg-theme-bg p-1 border terminal-border">
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
 className={`text-[9px] font-display uppercase tracking-widest px-2.5 py-1 transition-colors border ${
 selectedCategoryTab === tab.id
 ? 'bg-phosphor/20 text-phosphor border-phosphor font-bold'
 : 'text-phosphor/50 hover:text-phosphor border-transparent'
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
 className={`p-3 border terminal-border cursor-pointer transition-all flex flex-col justify-between select-none ${
 isInStack
 ? 'bg-phosphor/10 border-phosphor/50 hover:border-phosphor shadow-sm'
 : 'bg-theme-panel hover:bg-phosphor/5 border-phosphor/30 hover:border-phosphor/60 text-phosphor'
 }`}
 >
 <div>
 <div className="flex items-start justify-between gap-2">
 <div className="flex items-center gap-1.5">
 <span
 className={`text-[9px] font-display tracking-widest uppercase font-bold px-1.5 py-0.5 border terminal-border ${
 mod.categoryTag === 'Category A' || mod.categoryTag === 'Encoding'
 ? 'bg-semantic-red/10 border-semantic-red/30 text-semantic-red'
 : mod.categoryTag === 'Category B'
 ? 'bg-phosphor/10 border-phosphor/30 text-phosphor'
 : 'bg-phosphor/10 border-phosphor/30 text-phosphor'
 }`}
 >
 {mod.categoryTag} // {mod.code}
 </span>
 </div>

 {isInStack ? (
 <span className="text-[9px] font-display tracking-widest uppercase font-bold px-2 py-0.5 bg-phosphor/30 text-phosphor border border-phosphor/60 flex items-center gap-1 shrink-0 terminal-border">
 <Check className="w-2.5 h-2.5 text-phosphor" />
 <span>Stage {inStackIndex + 1}</span>
 </span>
 ) : (
 <span className="text-[9px] font-display tracking-widest uppercase text-phosphor/50 hover:text-phosphor flex items-center gap-0.5 shrink-0">
 <Plus className="w-3 h-3" />
 <span>Add</span>
 </span>
 )}
 </div>

 <h4 className="text-[10px] font-mono font-bold text-phosphor mt-1.5 flex items-center gap-1.5">
 <span>{mod.name}</span>
 </h4>

 <p className="text-[10px] font-mono text-phosphor/60 mt-1 line-clamp-2 leading-relaxed">
 {mod.tagline}
 </p>
 </div>

 <div className="mt-2 pt-2 border-t terminal-border ">
 <div className="flex flex-wrap gap-1">
 {mod.examples.slice(0, 3).map((ex, i) => (
 <span
 key={i}
 className="text-[9px] font-mono px-1.5 py-0.5 bg-theme-bg text-phosphor/50 border terminal-border truncate max-w-[200px]"
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
 <div className="mt-4 pt-3.5 border-t terminal-border ">
 <div className="flex items-center justify-between mb-2">
 <button
 type="button"
 onClick={() => setIsSandboxOpen(!isSandboxOpen)}
 className="flex items-center gap-2 text-left"
 >
 <div className="p-1 border terminal-border bg-theme-panel text-phosphor">
 <Terminal className="w-3.5 h-3.5" />
 </div>
 <div>
 <span className="text-[10px] font-display font-bold uppercase tracking-widest text-phosphor flex items-center gap-1.5">
 <span>Live Pipeline Execution Sandbox</span>
 <span className="text-[9px] px-1.5 py-0.5 border terminal-border bg-phosphor/10 text-phosphor font-normal">
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
 className="text-[9px] font-display uppercase tracking-widest text-phosphor hover:text-phosphor/80 underline underline-offset-2 flex items-center gap-1"
 >
 <span>Load Active Concept ({activeConcept ? `${activeConcept.length} chars` : 'empty'})</span>
 </button>
 </div>

 {isSandboxOpen && (
 <div className="p-3.5 border terminal-border bg-theme-bg font-mono">
 {/* Input prompt to transform */}
 <div className="space-y-1.5 mb-3">
 <div className="flex items-center justify-between text-[10px]">
 <span className="text-phosphor font-bold font-display uppercase tracking-widest flex items-center gap-1.5">
 <Terminal className="w-3.5 h-3.5 text-phosphor" />
 <span>Input Concept to Process:</span>
 </span>
 <span className="text-[9px] font-display tracking-widest uppercase text-phosphor/50">
 {sandboxInput.length} characters (100% full text preserved across pipeline)
 </span>
 </div>
 <textarea
 value={sandboxInput}
 onChange={(e) => setSandboxInput(e.target.value)}
 rows={3}
 placeholder="Enter or paste your entire concept here (no truncation, any length)..."
 className="w-full bg-theme-panel border terminal-border focus:border-phosphor p-2.5 text-[10px] text-phosphor placeholder-phosphor/30 font-mono leading-relaxed focus:outline-none"
 />
 <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
 <button
 type="button"
 onClick={() => {
 if (activeConcept && activeConcept.trim().length > 0) {
 setSandboxInput(activeConcept);
 }
 }}
 className="text-[9px] font-display tracking-widest uppercase text-phosphor hover:text-phosphor/80 underline underline-offset-2 flex items-center gap-1"
 >
 Pull Full Concept from Editor
 </button>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setSandboxInput('')}
 className="text-[9px] font-display tracking-widest uppercase text-phosphor/50 hover:text-phosphor px-2 py-0.5 border terminal-border hover: transition-colors"
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
 className="px-2.5 py-1 bg-theme-panel hover:bg-phosphor/10 text-phosphor text-[9px] font-display tracking-widest uppercase flex items-center gap-1 border terminal-border transition-colors"
 title="Roll random seed concept"
 >
 <Shuffle className="w-3 h-3 text-phosphor" />
 <span>Sample Seed</span>
 </button>
 </div>
 </div>
 </div>

 {/* Execution Stages Display */}
 {activePipeline.length === 0 ? (
 <div className="p-3 text-center text-[10px] font-display uppercase tracking-widest text-phosphor/40 border-dashed terminal-border ">
 <span>Select at least 1 module above to view the live execution stages.</span>
 </div>
 ) : (
 <div className="space-y-2">
 {/* Initial state */}
 <div className="flex items-start gap-2 p-2.5 bg-theme-panel border terminal-border ">
 <span className="text-[9px] font-display tracking-widest font-bold px-1.5 py-0.5 bg-theme-bg border terminal-border text-phosphor/60 shrink-0">
 RAW SEED
 </span>
 <div className="flex-1 break-words whitespace-pre-wrap text-phosphor text-[10px] opacity-80">
 {sandboxInput}
 </div>
 </div>

 {/* Step-by-step transformations */}
 {executionSteps.map((step) => (
 <div
 key={step.step}
 className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-2.5 bg-theme-bg border terminal-border border-phosphor/30"
 >
 <div className="flex items-start gap-2 flex-1 min-w-0">
 <span className="text-[9px] font-display tracking-widest uppercase font-bold px-1.5 py-0.5 bg-phosphor/10 text-phosphor border terminal-border border-phosphor/40 shrink-0">
 STEP {step.step}
 </span>
 <div className="min-w-0 flex-1">
 <div className="text-[9px] text-phosphor/50 font-display tracking-widest uppercase font-bold mb-1">
 {step.moduleName} ({step.categoryTag})
 </div>
 <div className="break-words whitespace-pre-wrap text-phosphor font-mono text-[10px] leading-relaxed selection:bg-phosphor selection:text-theme-bg">
 {step.textAfter}
 </div>
 </div>
 </div>

 <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
 <button
 type="button"
 onClick={() => handleCopy(step.textAfter, step.step)}
 className="px-2 py-1 bg-theme-panel hover:bg-phosphor/10 text-phosphor hover:text-phosphor/80 text-[9px] font-display tracking-widest uppercase flex items-center gap-1 border terminal-border "
 title="Copy this step result"
 >
 {copiedStep === step.step ? (
 <>
 <Check className="w-2.5 h-2.5 text-phosphor" />
 <span className="text-phosphor">Copied</span>
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
 <div className="mt-3 p-3.5 bg-theme-panel border terminal-border border-phosphor space-y-3">
 <div>
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <span className="text-[10px] font-bold font-display uppercase tracking-widest text-phosphor flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-phosphor" />
 <span>Final Transformed Concept ({finalPipelineOutput.length} chars):</span>
 </span>
 <span className="text-[9px] text-phosphor font-display uppercase tracking-widest font-bold">
 Entire Concept Preserved
 </span>
 </div>
 <div className="p-2.5 bg-theme-bg border terminal-border text-[10px] text-phosphor font-mono break-words whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto selection:bg-phosphor selection:text-theme-bg shadow-inner">
 {finalPipelineOutput}
 </div>
 </div>

 <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
 <button
 type="button"
 onClick={() => handleCopy(finalPipelineOutput, 999)}
 className="px-2.5 py-1.5 bg-theme-bg hover:bg-phosphor/10 text-phosphor text-[9px] font-display tracking-widest uppercase flex items-center gap-1 border terminal-border"
 >
 {copiedStep === 999 ? (
 <>
 <Check className="w-3 h-3 text-phosphor" />
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
 className="px-2.5 py-1.5 bg-theme-bg hover:bg-phosphor/10 text-phosphor border terminal-border border-phosphor/50 text-[9px] font-display tracking-widest uppercase font-bold flex items-center gap-1 transition-colors"
 title="Append to your existing concept"
 >
 <span>+ Append to Concept</span>
 </button>

 {onReplaceConcept && (
 <button
 type="button"
 onClick={() => onReplaceConcept(finalPipelineOutput)}
 className="px-3.5 py-1.5 bg-phosphor hover:bg-phosphor/80 text-theme-bg font-display tracking-widest uppercase font-bold text-[9px] flex items-center gap-1.5 border terminal-border transition-colors shadow-lg"
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
