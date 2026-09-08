/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry Inspector & Control Panel
 * 
 * Interactive diagnostic and synthesis lab:
 * - 5 Logical Conditioning Force Channels:
 * Attractor A, Attractor B, Structural Force, Identity Anchor, Material Force
 * - Two Execution Modes:
 * Mode A: Direct Model Control (CFG vector / channel split)
 * Mode B: Serialized Approximation (honest black-box translation via structural consequence)
 * - Operator Controls:
 * Attractor Balance, Categorical Cancellation, Orthogonal Stabilizer, Guidance Asymmetry, Saddle Trap
 * - 4 Core Presets:
 * Category Civil War, Taxonomy Offline, Saddle Monster, Material Possession
 * - Comprehensive Failure Mode Detection & Recommendations:
 * Concept Dominance, Generic Hybrid, Structural Collapse, Unconditioned Regression, Condition Drop
 */

import React, { useState, useMemo } from 'react';
import {
 Compass,
 Sliders,
 Scale,
 ShieldCheck,
 Zap,
 AlertTriangle,
 CheckCircle2,
 Copy,
 Check,
 Layers,
 ChevronDown,
 ChevronUp,
 RotateCcw,
 Sparkles,
 Info,
 Radio,
 Cpu,
 Feather,
} from 'lucide-react';
import { TechnicalModality } from '../types/technicalCore';
import {
 GuidanceExecutionMode,
 ConceptualForceChannels,
 AttractorBalanceConfig,
 CategoricalCancellationConfig,
 OrthogonalStabilizerConfig,
 GuidanceAsymmetryConfig,
 SaddleTrapConfig,
 StructuralInvariantType,
 GuidanceGeometryPresetId,
} from '../types/guidanceGeometry';
import {
 createDefaultForceChannels,
 generateGuidanceInspectionReport,
} from '../utils/guidanceGeometryEngine';
import {
 GUIDANCE_GEOMETRY_PRESETS,
 buildPresetForPrompt,
} from '../utils/guidancePresets';

interface GuidanceGeometryPanelProps {
 currentPrompt: string;
 targetModality?: TechnicalModality;
 targetEngine?: string;
 onApplyRenderedPrompt: (prompt: string) => void;
}

export const GuidanceGeometryPanel: React.FC<GuidanceGeometryPanelProps> = ({
 currentPrompt,
 targetModality = 'IMAGE',
 targetEngine = 'general',
 onApplyRenderedPrompt,
}) => {
 const [isOpen, setIsOpen] = useState<boolean>(true);
 const [copied, setCopied] = useState<boolean>(false);
 const [executionMode, setExecutionMode] = useState<GuidanceExecutionMode>(
 'SERIALIZED_APPROXIMATION'
 );
 const [activeTab, setActiveTab] = useState<
 'BALANCE' | 'CANCELLATION' | 'STABILIZER' | 'ASYMMETRY' | 'SADDLE'
 >('SADDLE');

 // Working Forces state
 const [forces, setForces] = useState<ConceptualForceChannels>(() =>
 createDefaultForceChannels(currentPrompt, targetModality)
 );

 // Operator configs
 const [balanceConfig, setBalanceConfig] = useState<AttractorBalanceConfig>({
 attractorA: 'rigid faceted mineral lattice',
 attractorAWeight: 0.5,
 attractorB: 'pulsing arterial vascular tissue',
 attractorBWeight: 0.5,
 balanceMode: 'NEAR_EQUILIBRIUM',
 competitionStrength: 0.85,
 persistBoth: true,
 preserveNonCategoricalStructure: true,
 });

 const [cancellationConfig, setCancellationConfig] =
 useState<CategoricalCancellationConfig>({
 categorySuppression: 0.75,
 structuralCompulsion: 0.9,
 categoryPairCount: 2,
 taxonomicAmbiguity: 'HIGH',
 suppressedCategories: ['animal', 'machine'],
 compulsoryStructures: ['hinge articulation', 'continuous boundary', 'fluid pressure'],
 });

 const [stabilizerConfig, setStabilizerConfig] =
 useState<OrthogonalStabilizerConfig>({
 stabilizerStrength: 0.92,
 structuralInvariantType: 'CONTINUOUS_BOUNDARY',
 invariantCount: 2,
 strictness: 'STRICT',
 targetModality,
 });

 const [asymmetryConfig, setAsymmetryConfig] =
 useState<GuidanceAsymmetryConfig>({
 primaryWeight: 0.5,
 secondaryWeight: 0.5,
 structuralWeight: 0.9,
 identityWeight: 0.7,
 materialWeight: 0.65,
 presetType: 'CUSTOM',
 });

 const [saddleConfig, setSaddleConfig] = useState<SaddleTrapConfig>({
 abBalance: 0.5,
 structuralForce: 0.92,
 saddleWidth: 0.15,
 driftTolerance: 0.1,
 escapeResponse: 'REINFORCE_STRUCTURE',
 });

 // Keep modality synchronized
 const effectiveModality: TechnicalModality = useMemo(() => {
 if (targetEngine === 'suno') return 'AUDIO';
 if (['runway', 'luma', 'pika', 'kling'].includes(targetEngine)) return 'VIDEO';
 return targetModality;
 }, [targetEngine, targetModality]);

 // Generate real-time inspection report
 const inspectionReport = useMemo(() => {
 return generateGuidanceInspectionReport(
 forces,
 balanceConfig,
 cancellationConfig,
 { ...stabilizerConfig, targetModality: effectiveModality },
 asymmetryConfig,
 saddleConfig,
 executionMode,
 effectiveModality
 );
 }, [
 forces,
 balanceConfig,
 cancellationConfig,
 stabilizerConfig,
 asymmetryConfig,
 saddleConfig,
 executionMode,
 effectiveModality,
 ]);

 // Preset Application
 const handleApplyPreset = (presetId: GuidanceGeometryPresetId) => {
 const preset = buildPresetForPrompt(presetId, currentPrompt);
 setForces(preset.forces);
 setBalanceConfig(preset.balanceConfig);
 setCancellationConfig(preset.cancellationConfig);
 setStabilizerConfig({
 ...preset.stabilizerConfig,
 targetModality: effectiveModality,
 });
 setAsymmetryConfig(preset.asymmetryConfig);
 setSaddleConfig(preset.saddleConfig);
 };

 // Synchronize weight changes across connected channels
 const handleUpdateAttractorAWeight = (val: number) => {
 setForces((prev) => ({
 ...prev,
 primaryAttractorA: { ...prev.primaryAttractorA, weight: val },
 }));
 setBalanceConfig((prev) => ({ ...prev, attractorAWeight: val }));
 };

 const handleUpdateAttractorBWeight = (val: number) => {
 setForces((prev) => ({
 ...prev,
 primaryAttractorB: { ...prev.primaryAttractorB, weight: val },
 }));
 setBalanceConfig((prev) => ({ ...prev, attractorBWeight: val }));
 };

 const handleUpdateStructuralWeight = (val: number) => {
 setForces((prev) => ({
 ...prev,
 structuralForce: { ...prev.structuralForce, weight: val },
 }));
 setStabilizerConfig((prev) => ({ ...prev, stabilizerStrength: val }));
 setSaddleConfig((prev) => ({ ...prev, structuralForce: val }));
 };

 const handleUpdateIdentityWeight = (val: number) => {
 setForces((prev) => ({
 ...prev,
 identityAnchor: { ...prev.identityAnchor, weight: val },
 }));
 setAsymmetryConfig((prev) => ({ ...prev, identityWeight: val }));
 };

 const handleUpdateMaterialWeight = (val: number) => {
 setForces((prev) => ({
 ...prev,
 materialForce: { ...prev.materialForce, weight: val },
 }));
 setAsymmetryConfig((prev) => ({ ...prev, materialWeight: val }));
 };

 const handleCopy = () => {
 navigator.clipboard.writeText(inspectionReport.renderedPrompt);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div
 id="guidance-geometry-panel"
 className="bg-theme-bg border border-phosphor/30 terminal-border overflow-hidden shadow-2xl transition-all"
 >
 {/* Header Bar */}
 <div className="bg-theme-panel border-b terminal-border px-4 py-3 flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <div className="p-1.5 bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor">
 <Compass className="w-4 h-4" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-sm font-semibold text-phosphor tracking-wide">
 GUIDANCE GEOMETRY
 </span>
 <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Job 5A Competing Forces
 </span>
 <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border">
 {effectiveModality}
 </span>
 </div>
 <p className="text-xs text-phosphor/80 mt-0.5">
 Replaces scalar guidance with competing conceptual vectors, saddle traps, and orthogonal stabilizers.
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {/* Mode Switcher */}
 <div className="flex items-center bg-theme-bg border terminal-border p-0.5 text-xs font-mono">
 <button
 onClick={() => setExecutionMode('SERIALIZED_APPROXIMATION')}
 className={`px-2.5 py-1 transition-all flex items-center gap-1.5 ${
 executionMode === 'SERIALIZED_APPROXIMATION'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border shadow-sm'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 title="Black-box mode: Expresses force balance through independent structural consequences (honest approximation)"
 >
 <Feather className="w-3 h-3" />
 <span>Prompt Approx</span>
 </button>
 <button
 onClick={() => setExecutionMode('DIRECT_MODEL_CONTROL')}
 className={`px-2.5 py-1 transition-all flex items-center gap-1.5 ${
 executionMode === 'DIRECT_MODEL_CONTROL'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border shadow-sm'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 title="Instrumented mode: Directly inspects CFG vectors and discrete channel weights"
 >
 <Cpu className="w-3 h-3" />
 <span>Direct Control</span>
 </button>
 </div>

 <button
 onClick={() => setIsOpen(!isOpen)}
 className="p-1.5 hover:bg-phosphor/10 text-phosphor/80 hover:text-phosphor transition-colors"
 >
 {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </button>
 </div>
 </div>

 {isOpen && (
 <div className="p-4 space-y-4">
 {/* Mode Notice Banner */}
 <div
 className={`px-3 py-2 text-xs flex items-start gap-2.5 border ${
 executionMode === 'SERIALIZED_APPROXIMATION'
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border text-phosphor'
 : 'bg-phosphor/10 border-phosphor/30 terminal-border text-phosphor'
 }`}
 >
 <Info className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
 <div className="leading-relaxed">
 {executionMode === 'SERIALIZED_APPROXIMATION' ? (
 <>
 <strong className="font-semibold">Prompt-Level Serialization (Black-Box Compatible):</strong>{' '}
 Commercial models do not expose separate internal CFG vectors. DAVID does not fake hidden internal sliders; instead, guidance geometry is translated into independent structural consequences, invariant clauses, and non-collapsing contradiction locks.
 </>
 ) : (
 <>
 <strong className="font-semibold">Direct Model Control Mode:</strong> Synthesizes discrete channel conditioning vectors (CFG delta split, per-channel weights, negative channel guidance) for controllable open-weights pipelines and multi-pass crucibles.
 </>
 )}
 </div>
 </div>

 {/* Quick Presets Bar */}
 <div>
 <div className="text-[11px] font-mono text-phosphor/80 uppercase tracking-wider mb-2 flex items-center justify-between">
 <span>Core Guidance Presets</span>
 <span className="text-[10px] text-phosphor/50">1-click force topologies</span>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
 {(
 [
 'PRESET_CATEGORY_CIVIL_WAR',
 'PRESET_TAXONOMY_OFFLINE',
 'PRESET_SADDLE_MONSTER',
 'PRESET_MATERIAL_POSSESSION',
 ] as GuidanceGeometryPresetId[]
 ).map((pId) => {
 const preset = GUIDANCE_GEOMETRY_PRESETS[pId];
 return (
 <button
 key={pId}
 onClick={() => handleApplyPreset(pId)}
 className="text-left p-2.5 border terminal-border bg-theme-panel hover:bg-phosphor/10 hover:border-phosphor/30 terminal-border transition-all group"
 >
 <div className="font-mono text-xs font-medium text-phosphor group-hover:text-phosphor flex items-center justify-between">
 <span>{preset.name}</span>
 <Zap className="w-3 h-3 text-phosphor opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 <div className="text-[10px] text-phosphor/80 mt-1 line-clamp-1 leading-tight">
 {preset.tagline}
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Master 5-Force Channel Vector Readout */}
 <div className="bg-theme-panel border terminal-border p-3.5 space-y-3">
 <div className="flex items-center justify-between border-b terminal-border pb-2">
 <div className="flex items-center gap-2">
 <Scale className="w-3.5 h-3.5 text-phosphor" />
 <span className="font-mono text-xs font-semibold text-phosphor uppercase">
 Active Force Vector Channels
 </span>
 </div>
 <div className="flex items-center gap-2 text-[11px] font-mono">
 <span className="text-phosphor/80">Dominant:</span>
 <span className="text-phosphor font-bold px-1.5 py-0.5 bg-phosphor/10 border border-phosphor/30 terminal-border">
 {inspectionReport.dominantForce}
 </span>
 <span className="text-phosphor/50">|</span>
 <span className="text-phosphor/80">State:</span>
 <span className="text-phosphor/80 font-medium">
 {inspectionReport.balanceState}
 </span>
 </div>
 </div>

 <div className="space-y-2.5 text-xs font-mono">
 {/* Channel 1: Attractor A */}
 <div>
 <div className="flex justify-between items-center mb-1">
 <span className="text-phosphor font-medium">Attractor A (Primary):</span>
 <span className="text-phosphor font-bold">{forces.primaryAttractorA.weight.toFixed(2)}</span>
 </div>
 <div className="w-full bg-theme-bg h-1.5 overflow-hidden border terminal-border">
 <div
 className="bg-phosphor/10 h-full transition-all duration-300"
 style={{ width: `${forces.primaryAttractorA.weight * 100}%` }}
 />
 </div>
 <input
 type="text"
 value={forces.primaryAttractorA.concept}
 onChange={(e) =>
 setForces((prev) => ({
 ...prev,
 primaryAttractorA: { ...prev.primaryAttractorA, concept: e.target.value },
 }))
 }
 className="mt-1 w-full bg-theme-bg border terminal-border px-2 py-0.5 text-[11px] text-phosphor/80 font-sans focus:border-phosphor/30 terminal-border outline-none"
 placeholder="Attractor A concept..."
 />
 </div>

 {/* Channel 2: Attractor B */}
 <div>
 <div className="flex justify-between items-center mb-1">
 <span className="text-semantic-red font-medium">Attractor B (Secondary):</span>
 <span className="text-semantic-red font-bold">{forces.primaryAttractorB.weight.toFixed(2)}</span>
 </div>
 <div className="w-full bg-theme-bg h-1.5 overflow-hidden border terminal-border">
 <div
 className="bg-semantic-red/10 h-full transition-all duration-300"
 style={{ width: `${forces.primaryAttractorB.weight * 100}%` }}
 />
 </div>
 <input
 type="text"
 value={forces.primaryAttractorB.concept}
 onChange={(e) =>
 setForces((prev) => ({
 ...prev,
 primaryAttractorB: { ...prev.primaryAttractorB, concept: e.target.value },
 }))
 }
 className="mt-1 w-full bg-theme-bg border terminal-border px-2 py-0.5 text-[11px] text-phosphor/80 font-sans focus:border-semantic-red/30 terminal-border outline-none"
 placeholder="Attractor B concept..."
 />
 </div>

 {/* Channel 3: Structural Force */}
 <div>
 <div className="flex justify-between items-center mb-1">
 <span className="text-phosphor font-medium">Structural Invariance:</span>
 <span className="text-phosphor font-bold">{forces.structuralForce.weight.toFixed(2)}</span>
 </div>
 <div className="w-full bg-theme-bg h-1.5 overflow-hidden border terminal-border">
 <div
 className="bg-phosphor/10 h-full transition-all duration-300"
 style={{ width: `${forces.structuralForce.weight * 100}%` }}
 />
 </div>
 </div>

 {/* Channel 4: Identity Anchor */}
 <div>
 <div className="flex justify-between items-center mb-1">
 <span className="text-phosphor font-medium">Identity Anchor ({forces.identityAnchor.subject || 'none'}):</span>
 <span className="text-phosphor font-bold">{forces.identityAnchor.weight.toFixed(2)}</span>
 </div>
 <div className="w-full bg-theme-bg h-1.5 overflow-hidden border terminal-border">
 <div
 className="bg-phosphor/10 h-full transition-all duration-300"
 style={{ width: `${forces.identityAnchor.weight * 100}%` }}
 />
 </div>
 </div>

 {/* Channel 5: Material Force */}
 <div>
 <div className="flex justify-between items-center mb-1">
 <span className="text-phosphor font-medium">Material Pressure:</span>
 <span className="text-phosphor font-bold">{forces.materialForce.weight.toFixed(2)}</span>
 </div>
 <div className="w-full bg-theme-bg h-1.5 overflow-hidden border terminal-border">
 <div
 className="bg-phosphor/10 h-full transition-all duration-300"
 style={{ width: `${forces.materialForce.weight * 100}%` }}
 />
 </div>
 </div>
 </div>
 </div>

 {/* Interactive Operator Tuning Tabs */}
 <div className="bg-theme-panel border terminal-border p-3 space-y-3">
 <div className="flex items-center gap-1 border-b terminal-border pb-2 overflow-x-auto">
 {[
 { id: 'SADDLE', label: 'Saddle Trap', short: 'ST' },
 { id: 'BALANCE', label: 'Attractor Balance', short: 'AB' },
 { id: 'CANCELLATION', label: 'Categorical Cancellation', short: 'CC' },
 { id: 'STABILIZER', label: 'Orthogonal Stabilizer', short: 'OS' },
 { id: 'ASYMMETRY', label: 'Guidance Asymmetry', short: 'GA' },
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`px-2.5 py-1 text-xs font-mono transition-colors shrink-0 ${
 activeTab === tab.id
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-medium'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/50'
 }`}
 >
 <span className="text-[10px] text-phosphor/50 mr-1">[{tab.short}]</span>
 {tab.label}
 </button>
 ))}
 </div>

 {/* TAB 1: SADDLE TRAP */}
 {activeTab === 'SADDLE' && (
 <div className="space-y-3 text-xs">
 <div className="flex items-center justify-between">
 <span className="font-mono text-phosphor/80 font-medium">Saddle Equilibrium Point (A vs B)</span>
 <span className="font-mono text-phosphor">{saddleConfig.abBalance.toFixed(2)}</span>
 </div>

 {/* Saddle Ridge Visualizer */}
 <div className="bg-theme-bg p-2.5 border terminal-border space-y-1.5">
 <div className="flex justify-between text-[10px] font-mono text-phosphor/50">
 <span className="text-phosphor">Basin A (0.0)</span>
 <span className="text-phosphor font-semibold">Saddle Ridge (0.50)</span>
 <span className="text-semantic-red">Basin B (1.0)</span>
 </div>
 <div className="relative w-full h-4 bg-theme-panel overflow-hidden border terminal-border">
 {/* Saddle Region Zone */}
 <div
 className="absolute top-0 bottom-0 bg-phosphor/10 border-x border-phosphor/30 terminal-border"
 style={{
 left: `${Math.max(0, (0.5 - saddleConfig.saddleWidth) * 100)}%`,
 width: `${saddleConfig.saddleWidth * 200}%`,
 }}
 />
 {/* Active Marker */}
 <div
 className="absolute top-0 bottom-0 w-2 bg-phosphor/10 shadow-[0_0_8px_rgba(52,211,153,0.8)] -ml-1 transition-all"
 style={{ left: `${saddleConfig.abBalance * 100}%` }}
 />
 </div>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.01"
 value={saddleConfig.abBalance}
 onChange={(e) => {
 const val = parseFloat(e.target.value);
 setSaddleConfig((prev) => ({ ...prev, abBalance: val }));
 handleUpdateAttractorAWeight(1.0 - val);
 handleUpdateAttractorBWeight(val);
 }}
 className="w-full accent-phosphor cursor-pointer"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
 <div>
 <label className="block text-phosphor/80 mb-1">Saddle Width (Tolerance)</label>
 <input
 type="range"
 min="0.05"
 max="0.4"
 step="0.01"
 value={saddleConfig.saddleWidth}
 onChange={(e) =>
 setSaddleConfig((prev) => ({
 ...prev,
 saddleWidth: parseFloat(e.target.value),
 }))
 }
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50 mt-0.5">
 {saddleConfig.saddleWidth.toFixed(2)} (narrower = higher tension)
 </div>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Structural Hold Force</label>
 <input
 type="range"
 min="0.2"
 max="1.0"
 step="0.05"
 value={saddleConfig.structuralForce}
 onChange={(e) => handleUpdateStructuralWeight(parseFloat(e.target.value))}
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50 mt-0.5">
 {saddleConfig.structuralForce.toFixed(2)} (prevents collapse off saddle)
 </div>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Escape Response</label>
 <select
 value={saddleConfig.escapeResponse}
 onChange={(e) =>
 setSaddleConfig((prev) => ({
 ...prev,
 escapeResponse: e.target.value as any,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="REINFORCE_STRUCTURE">Reinforce Structure</option>
 <option value="REBALANCE">Rebalance Forces</option>
 <option value="FLIP_DOMINANCE">Flip Dominance</option>
 <option value="ALLOW_COLLAPSE">Allow Collapse</option>
 </select>
 </div>
 </div>
 </div>
 )}

 {/* TAB 2: ATTRACTOR BALANCE */}
 {activeTab === 'BALANCE' && (
 <div className="space-y-3 text-xs">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-phosphor/80 mb-1">Attractor A Weight</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={balanceConfig.attractorAWeight}
 onChange={(e) => handleUpdateAttractorAWeight(parseFloat(e.target.value))}
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor">
 {balanceConfig.attractorAWeight.toFixed(2)}
 </div>
 </div>
 <div>
 <label className="block text-phosphor/80 mb-1">Attractor B Weight</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={balanceConfig.attractorBWeight}
 onChange={(e) => handleUpdateAttractorBWeight(parseFloat(e.target.value))}
 className="w-full accent-semantic-red"
 />
 <div className="text-[10px] font-mono text-semantic-red">
 {balanceConfig.attractorBWeight.toFixed(2)}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-phosphor/80 mb-1">Balance Mode</label>
 <select
 value={balanceConfig.balanceMode}
 onChange={(e) =>
 setBalanceConfig((prev) => ({
 ...prev,
 balanceMode: e.target.value as any,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="NEAR_EQUILIBRIUM">Near Equilibrium</option>
 <option value="A_DOMINANT">A Dominant</option>
 <option value="B_DOMINANT">B Dominant</option>
 <option value="RANDOMIZED_EQUILIBRIUM">Randomized Equilibrium</option>
 </select>
 </div>
 <div>
 <label className="block text-phosphor/80 mb-1">Competition Strength</label>
 <input
 type="range"
 min="0.1"
 max="1.0"
 step="0.05"
 value={balanceConfig.competitionStrength}
 onChange={(e) =>
 setBalanceConfig((prev) => ({
 ...prev,
 competitionStrength: parseFloat(e.target.value),
 }))
 }
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50">
 {balanceConfig.competitionStrength.toFixed(2)} (mutual exclusion pressure)
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TAB 3: CATEGORICAL CANCELLATION */}
 {activeTab === 'CANCELLATION' && (
 <div className="space-y-3 text-xs">
 <p className="text-phosphor/80 text-[11px] leading-relaxed">
 Weakens nominal class classification (animal, machine, plant) while maintaining strong physical relations and kinematics (hinges, pressure, continuous manifold).
 </p>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-phosphor/80 mb-1">Category Suppression (Taxonomy)</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={cancellationConfig.categorySuppression}
 onChange={(e) =>
 setCancellationConfig((prev) => ({
 ...prev,
 categorySuppression: parseFloat(e.target.value),
 }))
 }
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50">
 {cancellationConfig.categorySuppression.toFixed(2)} (higher = weaker taxonomy)
 </div>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Structural Compulsion (Physics/Junctions)</label>
 <input
 type="range"
 min="0.2"
 max="1.0"
 step="0.05"
 value={cancellationConfig.structuralCompulsion}
 onChange={(e) =>
 setCancellationConfig((prev) => ({
 ...prev,
 structuralCompulsion: parseFloat(e.target.value),
 }))
 }
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50">
 {cancellationConfig.structuralCompulsion.toFixed(2)} (higher = stronger physical laws)
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-phosphor/80 mb-1">Taxonomic Ambiguity</label>
 <select
 value={cancellationConfig.taxonomicAmbiguity}
 onChange={(e) =>
 setCancellationConfig((prev) => ({
 ...prev,
 taxonomicAmbiguity: e.target.value as any,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="LOW">Low</option>
 <option value="MEDIUM">Medium</option>
 <option value="HIGH">High (Unresolvable Class)</option>
 </select>
 </div>
 <div>
 <label className="block text-phosphor/80 mb-1">Competing Category Pairs</label>
 <select
 value={cancellationConfig.categoryPairCount}
 onChange={(e) =>
 setCancellationConfig((prev) => ({
 ...prev,
 categoryPairCount: parseInt(e.target.value) as any,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="1">1 Pair (e.g. Machine vs Animal)</option>
 <option value="2">2 Pairs (e.g. Machine/Animal + Mineral/Plant)</option>
 <option value="3">3 Pairs (Tripartite Conflict)</option>
 </select>
 </div>
 </div>
 </div>
 )}

 {/* TAB 4: ORTHOGONAL STABILIZER */}
 {activeTab === 'STABILIZER' && (
 <div className="space-y-3 text-xs">
 <p className="text-phosphor/80 text-[11px] leading-relaxed">
 Enforces structural requirements perpendicular to semantic warfare, preventing disintegration into blur or generic particulate.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div>
 <label className="block text-phosphor/80 mb-1">Structural Invariant Type</label>
 <select
 value={stabilizerConfig.structuralInvariantType}
 onChange={(e) =>
 setStabilizerConfig((prev) => ({
 ...prev,
 structuralInvariantType: e.target.value as StructuralInvariantType,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="CONTINUOUS_BOUNDARY">Continuous Outer Boundary</option>
 <option value="CONSERVED_TOPOLOGY">Conserved Genus / Apertures</option>
 <option value="PRESERVED_SILHOUETTE">Preserved Silhouette Contour</option>
 <option value="PRESSURE_BALANCE">Isobaric Pressure Equilibrium</option>
 <option value="HINGE_COUNT">Fixed 3-Hinge Articulation</option>
 <option value="SYMMETRY_COUNT">Bilateral Axial Symmetry</option>
 <option value="RHYTHMIC_GRID">Spatial Metric Grid</option>
 <option value="MOTION_TRAJECTORY">Continuous Motion Centroid</option>
 <option value="FIXED_FRAME_OCCUPANCY">Strict 68% Frame Occupancy</option>
 <option value="CONNECTED_REGIONS">Exact Dual-Chamber Connectivity</option>
 </select>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Strictness Level</label>
 <select
 value={stabilizerConfig.strictness}
 onChange={(e) =>
 setStabilizerConfig((prev) => ({
 ...prev,
 strictness: e.target.value as any,
 }))
 }
 className="w-full bg-theme-bg border terminal-border p-1.5 text-phosphor text-xs font-mono"
 >
 <option value="LOOSE">Loose</option>
 <option value="MODERATE">Moderate</option>
 <option value="STRICT">Strict</option>
 <option value="AXIOMATIC">Axiomatic (Zero Violation)</option>
 </select>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Stabilizer Strength</label>
 <input
 type="range"
 min="0.2"
 max="1.0"
 step="0.05"
 value={stabilizerConfig.stabilizerStrength}
 onChange={(e) => handleUpdateStructuralWeight(parseFloat(e.target.value))}
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor/50">
 {stabilizerConfig.stabilizerStrength.toFixed(2)}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TAB 5: GUIDANCE ASYMMETRY */}
 {activeTab === 'ASYMMETRY' && (
 <div className="space-y-3 text-xs">
 <div className="grid grid-cols-3 gap-2">
 <div>
 <label className="block text-phosphor/80 mb-1">Primary Weight</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={asymmetryConfig.primaryWeight}
 onChange={(e) => {
 const v = parseFloat(e.target.value);
 setAsymmetryConfig((p) => ({ ...p, primaryWeight: v }));
 handleUpdateAttractorAWeight(v);
 }}
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor">{asymmetryConfig.primaryWeight.toFixed(2)}</div>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Secondary Weight</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={asymmetryConfig.secondaryWeight}
 onChange={(e) => {
 const v = parseFloat(e.target.value);
 setAsymmetryConfig((p) => ({ ...p, secondaryWeight: v }));
 handleUpdateAttractorBWeight(v);
 }}
 className="w-full accent-semantic-red"
 />
 <div className="text-[10px] font-mono text-semantic-red">{asymmetryConfig.secondaryWeight.toFixed(2)}</div>
 </div>

 <div>
 <label className="block text-phosphor/80 mb-1">Material Weight</label>
 <input
 type="range"
 min="0.0"
 max="1.0"
 step="0.05"
 value={asymmetryConfig.materialWeight}
 onChange={(e) => {
 const v = parseFloat(e.target.value);
 handleUpdateMaterialWeight(v);
 }}
 className="w-full accent-phosphor"
 />
 <div className="text-[10px] font-mono text-phosphor">{asymmetryConfig.materialWeight.toFixed(2)}</div>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Inspector Status: The 4 Key Verification Questions */}
 <div className="bg-theme-panel border terminal-border p-3">
 <div className="text-[11px] font-mono text-phosphor/80 uppercase tracking-wider mb-2 flex items-center gap-2">
 <ShieldCheck className="w-3.5 h-3.5 text-phosphor" />
 <span>Diagnostic Inspector Verification Check</span>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
 <div className="p-2 bg-theme-bg border terminal-border">
 <div className="text-[10px] text-phosphor/50">Attractor Dropped?</div>
 <div className="flex items-center gap-1.5 mt-1">
 {inspectionReport.didOneAttractorGetDropped ? (
 <>
 <AlertTriangle className="w-3.5 h-3.5 text-semantic-red" />
 <span className="text-semantic-red font-medium">YES (FAIL)</span>
 </>
 ) : (
 <>
 <CheckCircle2 className="w-3.5 h-3.5 text-phosphor" />
 <span className="text-phosphor font-medium">NO (PASS)</span>
 </>
 )}
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border">
 <div className="text-[10px] text-phosphor/50">Generic Mixture Collapse?</div>
 <div className="flex items-center gap-1.5 mt-1">
 {inspectionReport.didOutputCollapseIntoGenericMixture ? (
 <>
 <AlertTriangle className="w-3.5 h-3.5 text-phosphor" />
 <span className="text-phosphor font-medium">YES (FAIL)</span>
 </>
 ) : (
 <>
 <CheckCircle2 className="w-3.5 h-3.5 text-phosphor" />
 <span className="text-phosphor font-medium">NO (PASS)</span>
 </>
 )}
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border">
 <div className="text-[10px] text-phosphor/50">Structural Invariant Survived?</div>
 <div className="flex items-center gap-1.5 mt-1">
 {inspectionReport.didStructuralInvariantSurvive ? (
 <>
 <CheckCircle2 className="w-3.5 h-3.5 text-phosphor" />
 <span className="text-phosphor font-medium">YES (HOLD)</span>
 </>
 ) : (
 <>
 <AlertTriangle className="w-3.5 h-3.5 text-semantic-red" />
 <span className="text-semantic-red font-medium">NO (RUPTURE)</span>
 </>
 )}
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border">
 <div className="text-[10px] text-phosphor/50">New Intermediate Form?</div>
 <div className="flex items-center gap-1.5 mt-1">
 {inspectionReport.didNewIntermediateFormAppear ? (
 <>
 <Sparkles className="w-3.5 h-3.5 text-phosphor" />
 <span className="text-phosphor font-medium">EMERGED</span>
 </>
 ) : (
 <span className="text-phosphor/50">UNRESOLVED</span>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Real-Time Failure Detection & Corrective Recommendations */}
 {inspectionReport.activeFailures.length > 0 && (
 <div className="space-y-2">
 <div className="text-[11px] font-mono text-phosphor/80 uppercase tracking-wider flex items-center gap-1.5">
 <AlertTriangle className="w-3.5 h-3.5 text-phosphor" />
 <span>Detected Failure Surfaces & Corrective Pathways</span>
 </div>
 <div className="space-y-2">
 {inspectionReport.activeFailures.map((failure, idx) => (
 <div
 key={idx}
 className="p-3 bg-theme-bg border border-phosphor/30 terminal-border space-y-2 text-xs"
 >
 <div className="flex items-center justify-between">
 <span className="font-mono font-semibold text-phosphor">
 {failure.title}
 </span>
 <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 {failure.severity}
 </span>
 </div>
 <p className="text-phosphor/80 text-xs leading-relaxed">{failure.diagnosis}</p>
 <div className="space-y-1 pt-1 border-t terminal-border">
 <div className="text-[10px] font-mono text-phosphor uppercase">
 Recommended Adjustments:
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
 {failure.recommendations.map((rec, rIdx) => (
 <div
 key={rIdx}
 className="bg-theme-panel border terminal-border p-1.5 text-[11px]"
 >
 <span className="font-mono text-phosphor font-medium">
 {rec.action}:
 </span>{' '}
 <span className="text-phosphor/80">{rec.suggestedAdjustment}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Rendered Output Preview */}
 <div className="bg-theme-panel border terminal-border p-3 space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-mono text-phosphor/80 uppercase tracking-wider">
 {executionMode === 'SERIALIZED_APPROXIMATION'
 ? 'Serialized Structural Prompt (Black-Box Compatible)'
 : 'Direct Conditioning Control Specification'}
 </span>
 <div className="flex items-center gap-2">
 <button
 onClick={handleCopy}
 className="px-2 py-1 bg-theme-panel hover:bg-phosphor/10 text-phosphor/80 text-xs font-mono flex items-center gap-1 transition-colors"
 >
 {copied ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>{copied ? 'Copied' : 'Copy'}</span>
 </button>
 <button
 onClick={() => onApplyRenderedPrompt(inspectionReport.renderedPrompt)}
 className="px-3 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
 >
 <Sparkles className="w-3.5 h-3.5" />
 <span>Apply to Prompt Canvas</span>
 </button>
 </div>
 </div>

 {executionMode === 'SERIALIZED_APPROXIMATION' ? (
 <pre className="specimen-chamber p-3 border text-phosphor text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed terminal-border">
 {inspectionReport.renderedPrompt}
 </pre>
 ) : (
 <div className="space-y-2">
 <div className="specimen-chamber terminal-border p-2.5 border text-phosphor text-xs font-mono max-h-48 overflow-y-auto">
 <div className="text-phosphor text-[10px] mb-1 font-semibold">
 // CHANNEL CONDITIONING WEIGHTS & CFG SPLITS
 </div>
 <pre>{JSON.stringify(inspectionReport.directControlSpec, null, 2)}</pre>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
};
