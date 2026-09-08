/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4: Structural Syntax & Relational Traps Inspector Panel
 * 
 * Interactive diagnostic component offering:
 * - Graph comparison: ORIGINAL RELATION GRAPH vs. MUTATED RELATION GRAPH
 * - Applied Operators tracking & live parameter tuning
 * - Presets execution (ORPHAN_ATTRIBUTE, OUROBOROS, THE_CAMERA_IS_INSIDE_IT, FUTURE_SCAR, WRONG_OWNER, RELATIONAL_HELL)
 * - Modality translation switcher (Image, Video, Audio / Suno)
 * - Structural Syntax Wrapper dialects (Typed Relations, Nested Brackets, Math Mappings, Graph Edges)
 * - Live rendered output with copy and apply capabilities.
 */

import React, { useState, useMemo } from 'react';
import {
 Network,
 GitFork,
 Repeat,
 Camera,
 Clock,
 Code2,
 Copy,
 Check,
 Sparkles,
 ChevronDown,
 ChevronUp,
 AlertCircle,
 Activity,
 Maximize2,
 Sliders,
 Layers,
} from 'lucide-react';
import {
 StructuralPresetId,
 StructuralIntensityLevel,
 SyntaxSerializationStyle,
 StructuralPlan,
} from '../types/structuralRelational';
import { TechnicalModality } from '../types/technicalCore';
import { STRUCTURAL_PRESETS, buildPlanFromPreset } from '../utils/structuralPresets';
import { executeStructuralMutationPipeline } from '../utils/relationalGraphEngine';

interface StructuralRelationalPanelProps {
 currentPrompt: string;
 targetModality?: TechnicalModality;
 onApplyRenderedPrompt?: (rendered: string) => void;
}

export const StructuralRelationalPanel: React.FC<StructuralRelationalPanelProps> = ({
 currentPrompt,
 targetModality = 'IMAGE',
 onApplyRenderedPrompt,
}) => {
 const [activeTab, setActiveTab] = useState<'PRESETS' | 'INSPECTOR' | 'SYNTAX'>('PRESETS');
 const [selectedPreset, setSelectedPreset] = useState<StructuralPresetId>('ORPHAN_ATTRIBUTE');
 const [modality, setModality] = useState<TechnicalModality>(targetModality);
 const [copied, setCopied] = useState<boolean>(false);

 // Custom active operators and intensity
 const [intensity, setIntensity] = useState<StructuralIntensityLevel>('MEDIUM');
 const [activeOps, setActiveOps] = useState<string[]>([
 'remote_binding_cleavage',
 'attribute_orphaning',
 ]);

 // Syntax wrapper settings
 const [enableFormalSyntax, setEnableFormalSyntax] = useState<boolean>(false);
 const [syntaxStyle, setSyntaxStyle] = useState<SyntaxSerializationStyle>('TYPED_RELATIONS');
 const [syntaxDensity, setSyntaxDensity] = useState<number>(0.6);

 // Detailed parameters
 const [bindingDistance, setBindingDistance] = useState<number>(0.75);
 const [ownershipWeakening, setOwnershipWeakening] = useState<number>(0.8);
 const [inversionRate, setInversionRate] = useState<number>(0.5);
 const [cycleLength, setCycleLength] = useState<number>(3);
 const [observerCoupling, setObserverCoupling] = useState<number>(0.8);
 const [futureLeak, setFutureLeak] = useState<number>(0.8);

 // Build and execute current plan
 const result = useMemo(() => {
 const input = currentPrompt.trim() || 'obsidian carapace beetle with crystalline mandibles';

 const plan: StructuralPlan = {
 planId: `plan_user_${Date.now()}`,
 intensity,
 targetModality: modality,
 activeOperatorIds: enableFormalSyntax
 ? [...activeOps, 'structural_syntax_wrapper']
 : activeOps,
 rbcConfig: {
 bindingDistance,
 interferenceDensity: 0.6,
 orphanPressure: 0.85,
 },
 aoConfig: {
 ownershipWeakening,
 hostMultiplicity: 'ambient_background',
 preserveAttribute: 0.95,
 },
 rdiConfig: {
 inversionRate,
 depth: 'single_relation',
 consistency: 'high_unified_rule',
 },
 cdConfig: {
 cycleLength,
 recursionStrength: 0.85,
 domainMix: ['geometry', 'material', 'physics'],
 },
 mtConfig: {
 paradoxType: 'WHOLE_CONTAINED_IN_PART',
 wholePartDepth: 2,
 scaleRecursion: true,
 boundaryLeakage: 0.75,
 },
 orConfig: {
 observerCoupling,
 viewpointFeedback: 'camera_as_topology',
 reentryDepth: 'dynamic_feedback_loop',
 videoMotionCoupling: true,
 },
 tclConfig: {
 timeDirection: 'reverse',
 delay: 'medium',
 topologyDebt: 0.8,
 futureLeak,
 imageTranslationMode: 'future_scars',
 },
 sswConfig: enableFormalSyntax
 ? {
 syntaxDensity,
 closureMode: 'cyclic',
 delimiterPressure: 'medium',
 style: syntaxStyle,
 }
 : undefined,
 seed: 42,
 };

 return executeStructuralMutationPipeline(input, plan);
 }, [
 currentPrompt,
 intensity,
 modality,
 activeOps,
 enableFormalSyntax,
 syntaxStyle,
 syntaxDensity,
 bindingDistance,
 ownershipWeakening,
 inversionRate,
 cycleLength,
 observerCoupling,
 futureLeak,
 ]);

 const handleSelectPreset = (pId: StructuralPresetId) => {
 setSelectedPreset(pId);
 const presetPlan = buildPlanFromPreset(pId, modality, 42);
 setIntensity(presetPlan.intensity);
 setActiveOps(presetPlan.activeOperatorIds);
 };

 const handleToggleOp = (opId: string) => {
 setActiveOps((prev) =>
 prev.includes(opId) ? prev.filter((o) => o !== opId) : [...prev, opId]
 );
 };

 const handleCopy = () => {
 navigator.clipboard.writeText(result.renderedPrompt);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="bg-theme-bg border terminal-border p-4 my-4 font-mono text-xs text-phosphor/80">
 {/* Header */}
 <div className="flex flex-wrap items-center justify-between pb-3 border-b terminal-border gap-2">
 <div className="flex items-center gap-2">
 <Network className="w-4 h-4 text-phosphor" />
 <span className="font-semibold text-phosphor tracking-wider">
 STRUCTURAL SYNTAX & RELATIONAL TRAPS
 </span>
 <span className="px-1.5 py-0.5 text-[10px] bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor">
 JOB 4 ACTIVE
 </span>
 </div>

 {/* Modality and View Tabs */}
 <div className="flex items-center gap-2">
 {/* Target Modality Selector */}
 <div className="flex items-center gap-1 bg-theme-panel border terminal-border p-0.5 text-[10px]">
 {(['IMAGE', 'VIDEO', 'AUDIO'] as TechnicalModality[]).map((m) => (
 <button
 key={m}
 onClick={() => setModality(m)}
 className={`px-2 py-0.5 ${
 modality === m ? 'bg-phosphor/10 text-phosphor font-bold' : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 {m}
 </button>
 ))}
 </div>

 {/* Sub-tab Navigation */}
 <div className="flex items-center gap-1 bg-theme-panel border terminal-border p-0.5">
 <button
 onClick={() => setActiveTab('PRESETS')}
 className={`px-2 py-1 transition-colors ${
 activeTab === 'PRESETS' ? 'bg-theme-panel text-phosphor' : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Presets
 </button>
 <button
 onClick={() => setActiveTab('INSPECTOR')}
 className={`px-2 py-1 transition-colors ${
 activeTab === 'INSPECTOR' ? 'bg-theme-panel text-phosphor' : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Graph Inspector ({result.metrics.edgeCount} Edges)
 </button>
 <button
 onClick={() => setActiveTab('SYNTAX')}
 className={`px-2 py-1 transition-colors ${
 activeTab === 'SYNTAX' ? 'bg-theme-panel text-phosphor' : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Formal Syntax
 </button>
 </div>
 </div>
 </div>

 {/* Main Content Area */}
 {activeTab === 'PRESETS' && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
 {/* Preset Buttons */}
 <div className="space-y-2">
 <span className="text-[11px] text-phosphor/80 block mb-1">
 Select Experimental Preset:
 </span>
 <div className="grid grid-cols-1 gap-2">
 {(Object.keys(STRUCTURAL_PRESETS) as StructuralPresetId[]).map((pId) => {
 const p = STRUCTURAL_PRESETS[pId];
 const isSelected = selectedPreset === pId;
 return (
 <button
 key={pId}
 onClick={() => handleSelectPreset(pId)}
 className={`text-left p-2.5 border transition-colors ${
 isSelected
 ? 'border-phosphor/30 terminal-border bg-phosphor/10 text-phosphor'
 : 'border-phosphor/20 terminal-border bg-theme-panel/50 text-phosphor/80 hover:border-phosphor/20 terminal-border'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-semibold text-phosphor text-xs">{p.name}</span>
 <span className="text-[9px] px-1 py-0.5 bg-theme-panel text-phosphor/80">
 {p.intensity}
 </span>
 </div>
 <div className="text-[10px] text-phosphor/80 mt-1">{p.shortDescription}</div>
 <div className="text-[9px] text-phosphor/50 mt-1 font-mono">{p.conceptSummary}</div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Telemetry & Output */}
 <div className="space-y-3">
 {/* Relational Metrics Banner */}
 <div className="p-3 bg-theme-panel border terminal-border space-y-2">
 <div className="flex items-center justify-between text-[11px] text-phosphor/80 pb-1.5 border-b terminal-border">
 <span className="flex items-center gap-1.5 text-phosphor font-semibold">
 <Activity className="w-3.5 h-3.5" />
 RELATIONAL METRICS
 </span>
 <span>Anchor: <strong className="text-phosphor">{result.originalGraph.originalSubject}</strong></span>
 </div>
 <div className="grid grid-cols-3 gap-2 text-[10px]">
 <div>
 <span className="text-phosphor/50 block">INVERTED EDGES</span>
 <span className="font-bold text-phosphor">{result.metrics.invertedEdges}</span>
 </div>
 <div>
 <span className="text-phosphor/50 block">ORPHANED ATTRS</span>
 <span className="font-bold text-phosphor">{result.metrics.orphanedAttributes}</span>
 </div>
 <div>
 <span className="text-phosphor/50 block">CYCLIC LOOPS</span>
 <span className="font-bold text-phosphor">{result.metrics.cyclicLoopsDetected}</span>
 </div>
 </div>
 </div>

 {/* Rendered Prompt Output */}
 <div>
 <div className="flex justify-between items-center text-phosphor/80 mb-1">
 <span>Relational Prompt Output ({modality})</span>
 <button
 onClick={handleCopy}
 className="flex items-center gap-1 text-[10px] text-phosphor/80 hover:text-phosphor px-1.5 py-0.5 bg-theme-panel border terminal-border"
 >
 {copied ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 {copied ? 'Copied' : 'Copy'}
 </button>
 </div>
 <div className="specimen-chamber terminal-border p-2.5 border text-phosphor font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto select-all">
 {result.renderedPrompt}
 </div>

 {onApplyRenderedPrompt && (
 <button
 onClick={() => onApplyRenderedPrompt(result.renderedPrompt)}
 className="mt-2 w-full flex items-center justify-center gap-1.5 py-1 px-2 bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor hover:bg-phosphor/20 transition-colors text-xs"
 >
 <Sparkles className="w-3.5 h-3.5" />
 Apply Relational Sequence to Main Prompt
 </button>
 )}
 </div>
 </div>
 </div>
 )}

 {/* Inspector Tab: Original vs Mutated Graph */}
 {activeTab === 'INSPECTOR' && (
 <div className="mt-4 space-y-4">
 <p className="text-phosphor/80 text-[11px]">
 Comparative graph trace showing how the canonical subject-attribute hierarchy was mutated into non-standard topologies.
 </p>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* Original Graph */}
 <div className="p-3 bg-theme-panel border terminal-border space-y-2">
 <div className="font-semibold text-phosphor/80 text-[11px] pb-1 border-b terminal-border">
 ORIGINAL RELATION GRAPH (Baseline)
 </div>
 <div className="space-y-1 max-h-60 overflow-y-auto">
 {result.originalGraph.edges.map((e) => {
 const src = result.originalGraph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
 const dst = result.originalGraph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
 return (
 <div key={e.id} className="p-1.5 bg-theme-panel border terminal-border text-[10px] flex items-center justify-between">
 <span className="text-phosphor/80 font-medium">"{src}"</span>
 <span className="px-1 py-0.5 bg-theme-panel text-phosphor/80 font-mono text-[9px]">
 --[{e.relation}]--&gt;
 </span>
 <span className="text-phosphor/80">"{dst}"</span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Mutated Graph */}
 <div className="p-3 bg-theme-panel border border-phosphor/30 terminal-border space-y-2">
 <div className="font-semibold text-phosphor text-[11px] pb-1 border-b terminal-border flex justify-between">
 <span>MUTATED RELATION GRAPH</span>
 <span className="text-phosphor/50 font-normal">Active Ops: {result.appliedOperatorIds.length}</span>
 </div>
 <div className="space-y-1 max-h-60 overflow-y-auto">
 {result.mutatedGraph.edges.map((e) => {
 const src = result.mutatedGraph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
 const dst = result.mutatedGraph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
 const badge = e.isOrphaned
 ? 'ORPHANED'
 : e.isInverted
 ? 'INVERTED'
 : e.isCyclic
 ? 'CYCLIC'
 : 'MUTATED';
 return (
 <div key={e.id} className="p-1.5 bg-theme-panel border terminal-border text-[10px] flex items-center justify-between">
 <span className="text-phosphor/80 font-medium truncate max-w-[100px]">"{src}"</span>
 <div className="flex items-center gap-1">
 <span className="px-1 py-0.5 bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor text-[9px]">
 {e.relation}
 </span>
 <span className="text-[8px] text-phosphor/50 font-mono">[{badge}]</span>
 </div>
 <span className="text-phosphor/80 truncate max-w-[100px]">"{dst}"</span>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Operator Toggles */}
 <div className="p-3 bg-theme-panel border terminal-border space-y-2">
 <span className="font-semibold text-phosphor/80 text-[11px] block">
 Toggle Individual Structural Operators:
 </span>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
 {[
 { id: 'remote_binding_cleavage', label: 'Remote Binding Cleavage' },
 { id: 'attribute_orphaning', label: 'Attribute Orphaning' },
 { id: 'relation_direction_inversion', label: 'Direction Inversion' },
 { id: 'cyclic_dependency', label: 'Cyclic Dependency' },
 { id: 'mereological_trap', label: 'Mereological Trap' },
 { id: 'observer_reentry', label: 'Observer Re-Entry' },
 { id: 'temporal_causal_loop', label: 'Temporal Causal Loop' },
 ].map((op) => {
 const isActive = activeOps.includes(op.id);
 return (
 <button
 key={op.id}
 onClick={() => handleToggleOp(op.id)}
 className={`p-1.5 border text-left transition-colors ${
 isActive
 ? 'border-phosphor/30 terminal-border bg-phosphor/10 text-phosphor'
 : 'border-phosphor/20 terminal-border bg-theme-panel text-phosphor/50 hover:text-phosphor/80'
 }`}
 >
 {isActive ? '[x]' : '[ ]'} {op.label}
 </button>
 );
 })}
 </div>
 </div>
 </div>
 )}

 {/* Formal Syntax Tab */}
 {activeTab === 'SYNTAX' && (
 <div className="mt-4 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-phosphor/80 font-semibold text-[11px]">
 STRUCTURAL SYNTAX WRAPPER CONFIG
 </span>
 <label className="flex items-center gap-1.5 text-xs text-phosphor cursor-pointer">
 <input
 type="checkbox"
 checked={enableFormalSyntax}
 onChange={(e) => setEnableFormalSyntax(e.target.checked)}
 className="accent-phosphor"
 />
 <span>Activate Formal Syntax Encoding</span>
 </label>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div>
 <label className="text-phosphor/80 text-[10px] block mb-1">Formal Syntax Dialect</label>
 <select
 value={syntaxStyle}
 onChange={(e) => setSyntaxStyle(e.target.value as SyntaxSerializationStyle)}
 className="w-full bg-theme-panel border terminal-border p-1.5 text-phosphor text-xs"
 >
 <option value="TYPED_RELATIONS">Typed Relations (@Entity, @Relation)</option>
 <option value="NESTED_BRACKETS">Nested Brackets ([SYSTEM_ROOT] -&gt; [RELATION])</option>
 <option value="MATHEMATICAL_MAPPING">Mathematical Mapping (f(S) := g(E))</option>
 <option value="GRAPH_EDGE_NOTATION">Graph Edge Notation (A --|rel|--&gt; B)</option>
 <option value="SET_MEMBERSHIP">Set Membership (Ω := &#123;...&#125;, x ∈ y)</option>
 </select>
 </div>

 <div>
 <div className="flex justify-between text-[10px] text-phosphor/80 mb-1">
 <span>Syntax Density</span>
 <span className="text-phosphor">{(syntaxDensity * 100).toFixed(0)}%</span>
 </div>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.1"
 value={syntaxDensity}
 onChange={(e) => setSyntaxDensity(parseFloat(e.target.value))}
 className="w-full accent-phosphor"
 />
 <div className="flex justify-between text-[9px] text-phosphor/50">
 <span>0.0 (Natural Language)</span>
 <span>1.0 (Full Formalism)</span>
 </div>
 </div>
 </div>

 {result.formalSyntaxPrompt && (
 <div className="space-y-1">
 <span className="text-phosphor/80 text-[10px]">Rendered Formal Syntax:</span>
 <pre className="specimen-chamber terminal-border p-2.5 border text-phosphor font-mono text-[10px] overflow-x-auto select-all whitespace-pre-wrap max-h-48">
 {result.formalSyntaxPrompt}
 </pre>
 </div>
 )}
 </div>
 )}
 </div>
 );
};
