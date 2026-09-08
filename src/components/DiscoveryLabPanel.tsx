import React, { useState, useEffect } from 'react';
import {
 FlaskConical,
 Sparkles,
 Sliders,
 Play,
 RotateCcw,
 CheckCircle2,
 AlertTriangle,
 Bookmark,
 Layers,
 Tag,
 Copy,
 Check,
 ChevronDown,
 ChevronUp,
 Zap,
 Split,
 Eye,
 Trash2,
 ArrowRight,
 TrendingUp,
 Award,
 HelpCircle,
 Dna,
 Shuffle,
 ShieldCheck,
 Compass,
} from 'lucide-react';
import { TargetEngine } from '../types';
import {
 ExperimentRecord,
 DiscoveryVariant,
 DiscoveryRecipe,
 PromotedOperator,
 DiscoveryUserRating,
 ObservableArtifactTag,
 CreativeValueTier,
 MechanismConfidenceTier,
 ExperimentType,
 OBSERVABLE_ARTIFACT_TAGS,
} from '../types/discoveryEngine';
import {
 buildDiscoveryExperimentFamily,
 saveDiscoveryRecipe,
 loadDiscoveryRecipes,
 deleteDiscoveryRecipe,
 buildReproductionTestFamily,
 confirmReproductionResult,
 mutateDiscoveryRecipe,
 promoteDiscoveryToOperator,
 loadPromotedOperators,
 deletePromotedOperator,
 evaluateVariantResult,
 loadExperimentRecords,
 getAllAvailableOperators,
} from '../utils/discoveryEngine';

interface DiscoveryLabPanelProps {
 currentConcept: string;
 targetEngine: TargetEngine | string;
 targetMedium?: 'image' | 'video' | 'audio';
 modelProfile?: string;
 lockedAnchors?: string[];
 activeOperators?: string[];
 entropyLevel?: number;
 onApplyPromptToInput?: (prompt: string) => void;
 onApplyRecipeToState?: (recipe: DiscoveryRecipe) => void;
}

export const DiscoveryLabPanel: React.FC<DiscoveryLabPanelProps> = ({
 currentConcept,
 targetEngine,
 targetMedium = 'image',
 modelProfile = 'openart_flux',
 lockedAnchors = [],
 activeOperators = [],
 onApplyPromptToInput,
 onApplyRecipeToState,
}) => {
 // Panel expansion state
 const [isOpen, setIsOpen] = useState(false);
 const [activeTab, setActiveTab] = useState<'experiment' | 'hypothesis' | 'archive' | 'promoted'>('experiment');

 // Experiment Builder Configuration State
 const [experimentType, setExperimentType] = useState<ExperimentType>('operator_interaction');
 const [selectedOpA, setSelectedOpA] = useState<string>('scale_schism');
 const [selectedOpB, setSelectedOpB] = useState<string>('recursive_reversal');
 const [variantCount, setVariantCount] = useState<number>(4);

 // Active Experiment State
 const [currentExperiment, setCurrentExperiment] = useState<ExperimentRecord | null>(null);
 const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

 // Archive & Promoted Operators
 const [savedRecipes, setSavedRecipes] = useState<Record<string, DiscoveryRecipe>>({});
 const [promotedOperators, setPromotedOperators] = useState<Record<string, PromotedOperator>>({});
 const [availableOperators, setAvailableOperators] = useState<any[]>([]);

 // UI status helpers
 const [copiedId, setCopiedId] = useState<string | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);
 const [saveModalVariant, setSaveModalVariant] = useState<DiscoveryVariant | null>(null);
 const [discoveryNameInput, setDiscoveryNameInput] = useState('');

 // Refresh data on mount & tab switches
 const refreshData = () => {
 const recipes = loadDiscoveryRecipes();
 setSavedRecipes(recipes);
 const promoted = loadPromotedOperators();
 setPromotedOperators(promoted);
 setAvailableOperators(getAllAvailableOperators());

 const expRecords = loadExperimentRecords();
 const expList = Object.values(expRecords);
 if (expList.length > 0 && !currentExperiment) {
 // Load latest experiment by default
 const latest = expList.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
 setCurrentExperiment(latest);
 setSelectedVariantId(latest.controlVariant.id);
 }
 };

 useEffect(() => {
 refreshData();
 }, []);

 // Update operator selections if parent passes active operators
 useEffect(() => {
 if (activeOperators.length > 0) {
 if (activeOperators[0]) setSelectedOpA(activeOperators[0]);
 if (activeOperators[1]) setSelectedOpB(activeOperators[1]);
 }
 }, [activeOperators]);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 3500);
 };

 // Build a new experiment family
 const handleBuildExperiment = () => {
 const record = buildDiscoveryExperimentFamily({
 concept: currentConcept,
 targetEngine,
 targetMedium,
 modelProfile,
 activeOperators: [selectedOpA, selectedOpB],
 lockedAnchors,
 config: {
 experimentType,
 variantCount,
 operatorA: selectedOpA,
 operatorB: selectedOpB,
 includeAblation: true,
 preserveIdentityAnchor: true,
 iterationDepth: 1,
 },
 });

 setCurrentExperiment(record);
 setSelectedVariantId(record.controlVariant.id);
 setActiveTab('experiment');
 showToast(`Built experiment family: 1 Control + ${record.experimentalVariants.length} Variants`);
 };

 // Evaluate a variant
 const handleRateVariant = (
 variantId: string,
 rating: DiscoveryUserRating,
 creativeValue: CreativeValueTier = 'interesting'
 ) => {
 if (!currentExperiment) return;
 const currentVariant =
 variantId === currentExperiment.controlVariant.id
 ? currentExperiment.controlVariant
 : currentExperiment.experimentalVariants.find((v) => v.id === variantId);

 const existingTags = currentVariant?.taggedArtifacts || [];
 const updated = evaluateVariantResult({
 experimentId: currentExperiment.id,
 variantId,
 userRating: rating,
 taggedArtifacts: existingTags,
 creativeValue,
 });

 if (updated) {
 setCurrentExperiment({ ...updated });
 showToast(`Logged rating "${rating}" for ${currentVariant?.label || 'variant'}`);
 }
 };

 // Toggle artifact tag on variant
 const handleToggleArtifactTag = (variantId: string, tag: ObservableArtifactTag) => {
 if (!currentExperiment) return;
 const variant =
 variantId === currentExperiment.controlVariant.id
 ? currentExperiment.controlVariant
 : currentExperiment.experimentalVariants.find((v) => v.id === variantId);

 if (!variant) return;

 const exists = variant.taggedArtifacts.includes(tag);
 const updatedTags = exists
 ? variant.taggedArtifacts.filter((t) => t !== tag)
 : [...variant.taggedArtifacts, tag];

 const updated = evaluateVariantResult({
 experimentId: currentExperiment.id,
 variantId,
 userRating: variant.userRating || 'INTERESTING',
 taggedArtifacts: updatedTags,
 });

 if (updated) {
 setCurrentExperiment({ ...updated });
 }
 };

 // Save Discovery Recipe
 const handleSaveDiscovery = () => {
 if (!currentExperiment || !saveModalVariant) return;
 const recipe = saveDiscoveryRecipe({
 experimentId: currentExperiment.id,
 variantId: saveModalVariant.id,
 name: discoveryNameInput.trim() || undefined,
 });

 if (recipe) {
 refreshData();
 setSaveModalVariant(null);
 setDiscoveryNameInput('');
 showToast(`Saved Discovery Recipe: "${recipe.name}"`);
 }
 };

 // Run reproduction test
 const handleTestReproducibility = (recipeId: string) => {
 const reproExperiment = buildReproductionTestFamily(recipeId);
 if (reproExperiment) {
 setCurrentExperiment(reproExperiment);
 setSelectedVariantId(reproExperiment.controlVariant.id);
 setActiveTab('experiment');
 showToast(`Generated reproduction test family (3 seed perturbations + control)`);
 }
 };

 // Confirm reproduction result
 const handleConfirmReproduction = (recipeId: string, reproduced: boolean) => {
 const updated = confirmReproductionResult({ recipeId, reproduced });
 if (updated) {
 refreshData();
 showToast(
 reproduced
 ? `Reproducibility confirmed: incremented timesObserved (${updated.timesObserved}) and confidence (${updated.confidence})`
 : `Marked recipe as seed-sensitive (low confidence)`
 );
 }
 };

 // Mutate Discovery Recipe
 const handleMutateRecipe = (recipeId: string, dimension: any) => {
 const mutatedExp = mutateDiscoveryRecipe({
 recipeId,
 dimension,
 sourceConcept: currentConcept,
 });

 if (mutatedExp) {
 setCurrentExperiment(mutatedExp);
 setSelectedVariantId(mutatedExp.controlVariant.id);
 setActiveTab('experiment');
 showToast(`Generated evolutionary mutation branch (${dimension})`);
 }
 };

 // Promote Discovery to Operator
 const handlePromoteToOperator = (recipeId: string) => {
 const promoted = promoteDiscoveryToOperator(recipeId);
 if (promoted) {
 refreshData();
 showToast(`Promoted "${promoted.name}" to Reusable Operator Library!`);
 }
 };

 // Copy prompt text
 const handleCopyPrompt = (text: string, id: string) => {
 navigator.clipboard.writeText(text);
 setCopiedId(id);
 setTimeout(() => setCopiedId(null), 2000);
 };

 return (
 <section className="border border-phosphor/30 bg-gradient-to-b from-theme-panel to-theme-bg shadow-xl backdrop-blur-md overflow-hidden transition-all duration-200 terminal-border">
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-phosphor/90 border border-phosphor/30 text-phosphor text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 terminal-border">
 <CheckCircle2 className="w-4 h-4 text-phosphor shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Header Bar */}
 <div
 className="p-4 bg-theme-panel border-b terminal-border flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
 onClick={() => setIsOpen(!isOpen)}
 >
 <div className="flex items-center gap-3">
 <div className="p-2 border terminal-border bg-theme-bg text-phosphor">
 <Compass className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-display text-[12px] font-bold tracking-widest text-phosphor uppercase">
 Discovery Lab
 </span>
 <span className="text-[9px] font-display uppercase tracking-widest px-2 py-0.5 border terminal-border bg-phosphor/10 text-phosphor font-bold">
 Job 8 Experimental Core
 </span>
 </div>
 <p className="text-[10px] text-phosphor/60 font-mono mt-0.5 uppercase tracking-widest">
 Empirical hypothesis testing, controlled dose sweeps, operator interaction discovery, and procedure archiving
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <div className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 flex items-center gap-2">
 <span className="px-2 py-0.5 border terminal-border bg-theme-bg text-phosphor/70">
 {Object.keys(savedRecipes).length} Discoveries
 </span>
 <span className="px-2 py-0.5 border terminal-border bg-theme-bg text-phosphor/70">
 {Object.keys(promotedOperators).length} Promoted Ops
 </span>
 </div>
 <button
 type="button"
 className="p-1 border terminal-border border-transparent hover: text-phosphor/50 hover:text-phosphor transition-colors"
 >
 {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Expandable Body */}
 {isOpen && (
 <div className="p-4 sm:p-6 space-y-6">
 {/* Mode Navigation Tabs */}
 <div className="flex flex-wrap items-center justify-between gap-2 border-b terminal-border pb-3">
 <div className="flex flex-wrap items-center gap-1 font-display uppercase tracking-widest text-[9px] font-bold">
 <button
 type="button"
 onClick={() => setActiveTab('experiment')}
 className={`px-3 py-1.5 border terminal-border transition-colors flex items-center gap-1.5 ${
 activeTab === 'experiment'
 ? 'bg-phosphor/20 border-phosphor text-phosphor'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 <FlaskConical className="w-3.5 h-3.5" />
 <span>Experiment & Variants</span>
 {currentExperiment && (
 <span className="text-[9px] px-1.5 py-0.5 bg-phosphor/30 text-phosphor border terminal-border">
 {1 + currentExperiment.experimentalVariants.length}
 </span>
 )}
 </button>

 <button
 type="button"
 onClick={() => setActiveTab('hypothesis')}
 className={`px-3 py-1.5 border terminal-border transition-colors flex items-center gap-1.5 ${
 activeTab === 'hypothesis'
 ? 'bg-phosphor/20 border-phosphor text-phosphor'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 <Dna className="w-3.5 h-3.5" />
 <span>Hypothesis & Tension</span>
 </button>

 <button
 type="button"
 onClick={() => {
 refreshData();
 setActiveTab('archive');
 }}
 className={`px-3 py-1.5 border terminal-border transition-colors flex items-center gap-1.5 ${
 activeTab === 'archive'
 ? 'bg-phosphor/20 border-phosphor text-phosphor'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 <Bookmark className="w-3.5 h-3.5" />
 <span>Discovery Archive</span>
 <span className="text-[9px] px-1.5 py-0.5 bg-phosphor/30 text-phosphor border terminal-border">
 {Object.keys(savedRecipes).length}
 </span>
 </button>

 <button
 type="button"
 onClick={() => {
 refreshData();
 setActiveTab('promoted');
 }}
 className={`px-3 py-1.5 border terminal-border transition-colors flex items-center gap-1.5 ${
 activeTab === 'promoted'
 ? 'bg-phosphor/20 border-phosphor text-phosphor'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 <Award className="w-3.5 h-3.5" />
 <span>Promoted Operators</span>
 <span className="text-[9px] px-1.5 py-0.5 bg-phosphor/30 text-phosphor border terminal-border">
 {Object.keys(promotedOperators).length}
 </span>
 </button>
 </div>

 {/* Quick action: Re-generate or clear */}
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={handleBuildExperiment}
 className="px-3 py-1.5 bg-phosphor hover:bg-phosphor/80 text-theme-bg border terminal-border font-display uppercase tracking-widest text-[9px] font-bold transition-all shadow-md flex items-center gap-1.5"
 >
 <Play className="w-3.5 h-3.5 fill-theme-bg text-theme-bg" />
 <span>Build New Family</span>
 </button>
 </div>
 </div>

 {/* TAB 1: EXPERIMENT & VARIANTS */}
 {activeTab === 'experiment' && (
 <div className="space-y-6">
 {/* Parameter titration & control bar */}
 <div className="p-3.5 bg-theme-panel border terminal-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
 <div>
 <label className="text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 block mb-1">
 Experiment Type
 </label>
 <select
 value={experimentType}
 onChange={(e) => setExperimentType(e.target.value as ExperimentType)}
 className="w-full px-2.5 py-1.5 bg-theme-bg border terminal-border text-phosphor text-[10px] font-mono focus:outline-none focus:border-phosphor"
 >
 <option value="operator_interaction">Operator Interaction & Path Dependency (A, B, A→B, B→A, A+B)</option>
 <option value="dose_sweep">Dose-Response Sweep (Low, Med, High, Maximal + Control)</option>
 <option value="anchor_ablation">Anchor Constraint & Permeability Ablation</option>
 <option value="custom_bounded">Custom Bounded Intensity Steps</option>
 </select>
 </div>

 <div>
 <label className="text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 block mb-1">
 Primary Operator (A)
 </label>
 <select
 value={selectedOpA}
 onChange={(e) => setSelectedOpA(e.target.value)}
 className="w-full px-2.5 py-1.5 bg-theme-bg border terminal-border text-phosphor text-[10px] font-mono focus:outline-none focus:border-phosphor"
 >
 {availableOperators.map((op) => (
 <option key={op.id} value={op.id}>
 {op.name} ({op.family})
 </option>
 ))}
 </select>
 </div>

 <div>
 <label className="text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 block mb-1">
 Secondary Operator (B)
 </label>
 <select
 value={selectedOpB}
 onChange={(e) => setSelectedOpB(e.target.value)}
 className="w-full px-2.5 py-1.5 bg-theme-bg border terminal-border text-phosphor text-[10px] font-mono focus:outline-none focus:border-phosphor"
 >
 {availableOperators.map((op) => (
 <option key={op.id} value={op.id}>
 {op.name} ({op.family})
 </option>
 ))}
 </select>
 </div>

 <div className="flex items-center gap-2">
 <div className="flex-1">
 <label className="text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 block mb-1">
 Variant Count (Bounded)
 </label>
 <select
 value={variantCount}
 onChange={(e) => setVariantCount(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-theme-bg border terminal-border text-phosphor text-[10px] font-mono focus:outline-none focus:border-phosphor"
 >
 <option value={2}>2 Variants + 1 Control</option>
 <option value={3}>3 Variants + 1 Control</option>
 <option value={4}>4 Variants + 1 Control (Default)</option>
 <option value={5}>5 Variants + 1 Control (Max)</option>
 </select>
 </div>
 <button
 type="button"
 onClick={handleBuildExperiment}
 className="px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 border terminal-border border-phosphor/50 text-phosphor font-display uppercase tracking-widest text-[9px] font-bold transition-colors mt-4"
 title="Re-run builder with chosen parameters"
 >
 Update
 </button>
 </div>
 </div>

 {/* Active Experiment Overview Banner */}
 {currentExperiment && (
 <div className="p-4 bg-theme-panel border terminal-border space-y-3">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="font-mono text-[11px] font-bold text-phosphor">
 {currentExperiment.title}
 </span>
 <span className="text-[9px] font-mono px-2 py-0.5 bg-theme-bg text-phosphor/60 border terminal-border ">
 ID: {currentExperiment.id}
 </span>
 </div>

 <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest">
 {currentExperiment.pathDependencyDetected && (
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border terminal-border border-phosphor/40 font-bold animate-pulse">
 ⚡ Path Dependency Detected (A→B ≠ B→A)
 </span>
 )}
 {currentExperiment.interactionEffectDetected && (
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border terminal-border border-phosphor/40 font-bold">
 ✨ Synergistic Interaction Observed
 </span>
 )}
 <span className="text-phosphor/50">
 Target: {currentExperiment.targetMedium} / {currentExperiment.targetEngine}
 </span>
 </div>
 </div>

 {/* Compact Hypothesis Display */}
 <div className="p-3 bg-theme-bg border terminal-border text-[10px] font-mono space-y-1">
 <div className="text-phosphor font-bold">
 HYPOTHESIS: <span className="text-phosphor font-normal">{currentExperiment.hypothesis.hypothesis}</span>
 </div>
 <div className="text-phosphor">
 TENSION: <span className="text-phosphor/70 font-normal">{currentExperiment.hypothesis.tension}</span>
 </div>
 <div className="text-phosphor">
 CONTROL: <span className="text-phosphor/70 font-normal">{currentExperiment.hypothesis.control}</span>
 </div>
 </div>
 </div>
 )}

 {/* Variants Grid: Control (always first) + Experimental Variants */}
 {currentExperiment ? (
 <div className="space-y-4">
 <div className="text-[10px] font-display uppercase tracking-widest font-bold text-phosphor/60 flex items-center justify-between">
 <span>Experiment Family (1 Control + {currentExperiment.experimentalVariants.length} Variants)</span>
 <span className="text-[9px] text-phosphor/40">
 Bounded to prevent combinatorial explosion • Distinguishes causality from seed luck
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {/* 1. CONTROL VARIANT (Section 2) */}
 <div
 key={currentExperiment.controlVariant.id}
 className={`p-4 border terminal-border transition-all flex flex-col justify-between cursor-pointer ${
 selectedVariantId === currentExperiment.controlVariant.id
 ? 'bg-phosphor/10 border-phosphor shadow-[0_0_15px_rgba(var(--color-phosphor),0.15)]'
 : 'bg-theme-panel border-phosphor/40 hover:border-phosphor/60'
 }`}
 onClick={() => setSelectedVariantId(currentExperiment.controlVariant.id)}
 >
 <div className="space-y-2.5">
 <div className="flex items-center justify-between gap-2">
 <span className="text-[9px] font-display tracking-widest uppercase px-2 py-0.5 bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 font-bold">
 CONTROL BASELINE
 </span>
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/50">
 Neutralized Mutation
 </span>
 </div>

 <div className="font-mono text-[11px] font-bold text-phosphor">
 {currentExperiment.controlVariant.label}
 </div>

 <p className="text-[10px] font-mono text-phosphor/60 leading-relaxed">
 {currentExperiment.controlVariant.description}
 </p>

 <div className="p-2.5 bg-theme-bg border terminal-border text-[10px] font-mono text-phosphor select-all max-h-24 overflow-y-auto">
 {currentExperiment.controlVariant.promptText}
 </div>
 </div>

 {/* Control Actions & Rating */}
 <div className="pt-3 mt-3 border-t terminal-border space-y-2">
 <div className="flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleCopyPrompt(
 currentExperiment.controlVariant.promptText,
 currentExperiment.controlVariant.id
 );
 }}
 className="text-[9px] font-display uppercase tracking-widest px-2 py-1 bg-theme-bg hover:bg-phosphor/10 text-phosphor border terminal-border flex items-center gap-1 transition-colors"
 >
 {copiedId === currentExperiment.controlVariant.id ? (
 <Check className="w-3 h-3 text-phosphor" />
 ) : (
 <Copy className="w-3 h-3 text-phosphor/50" />
 )}
 <span>Copy Prompt</span>
 </button>

 {onApplyPromptToInput && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 onApplyPromptToInput(currentExperiment.controlVariant.promptText);
 showToast('Applied Control Prompt to Synthesis Input');
 }}
 className="text-[9px] font-display uppercase tracking-widest font-bold px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 transition-colors"
 >
 Apply to Input
 </button>
 )}
 </div>

 {/* Fast Rating */}
 <div className="flex items-center gap-1 pt-1 font-display tracking-widest uppercase text-[9px]">
 <span className="text-phosphor/50 mr-1">Rate:</span>
 {(['BORING', 'BROKEN BAD', 'INTERESTING', 'JACKPOT'] as DiscoveryUserRating[]).map(
 (rating) => (
 <button
 key={rating}
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleRateVariant(currentExperiment.controlVariant.id, rating);
 }}
 className={`px-1.5 py-0.5 border terminal-border transition-colors ${
 currentExperiment.controlVariant.userRating === rating
 ? 'bg-phosphor/30 border-phosphor text-phosphor font-bold'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 {rating === 'BROKEN BAD' ? 'BAD' : rating}
 </button>
 )
 )}
 </div>
 </div>
 </div>

 {/* 2. EXPERIMENTAL VARIANTS */}
 {currentExperiment.experimentalVariants.map((variant) => (
 <div
 key={variant.id}
 className={`p-4 border terminal-border transition-all flex flex-col justify-between cursor-pointer ${
 selectedVariantId === variant.id
 ? 'bg-phosphor/10 border-phosphor shadow-[0_0_15px_rgba(var(--color-phosphor),0.15)]'
 : 'bg-theme-panel border-phosphor/20 hover:border-phosphor/40'
 }`}
 onClick={() => setSelectedVariantId(variant.id)}
 >
 <div className="space-y-2.5">
 <div className="flex items-center justify-between gap-2">
 <span
 className={`text-[9px] font-display uppercase tracking-widest px-2 py-0.5 font-bold border terminal-border ${
 variant.role === 'order_test'
 ? 'bg-phosphor/20 text-phosphor border-phosphor/40'
 : variant.role === 'interaction'
 ? 'bg-phosphor/20 text-phosphor border-phosphor/40'
 : variant.role === 'ablation'
 ? 'bg-semantic-red/20 text-semantic-red border-semantic-red/40'
 : 'bg-phosphor/20 text-phosphor border-phosphor/40'
 }`}
 >
 {variant.role.toUpperCase()}
 </span>
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/50">
 Intensity: {variant.mutationIntensity}/10
 </span>
 </div>

 <div className="font-mono text-[11px] font-bold text-phosphor">
 {variant.label}
 </div>

 <p className="text-[10px] font-mono text-phosphor/60 leading-relaxed">
 {variant.description}
 </p>

 <div className="p-2.5 bg-theme-bg border terminal-border text-[10px] font-mono text-phosphor select-all max-h-24 overflow-y-auto">
 {variant.promptText}
 </div>

 {/* Artifact Tags on this Variant */}
 <div className="space-y-1 pt-1">
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 block">
 Observed Artifacts:
 </span>
 <div className="flex flex-wrap gap-1">
 {variant.taggedArtifacts.length > 0 ? (
 variant.taggedArtifacts.map((tag) => (
 <span
 key={tag}
 className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 text-phosphor border terminal-border border-phosphor/30 flex items-center gap-1"
 >
 <Tag className="w-2.5 h-2.5" />
 {tag}
 </span>
 ))
 ) : (
 <span className="text-[10px] font-mono text-phosphor/40 italic">
 None tagged yet
 </span>
 )}
 </div>
 </div>
 </div>

 {/* Variant Actions, Rating & Save Discovery */}
 <div className="pt-3 mt-3 border-t terminal-border space-y-2">
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-1">
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleCopyPrompt(variant.promptText, variant.id);
 }}
 className="text-[9px] font-display tracking-widest uppercase px-2 py-1 bg-theme-bg hover:bg-phosphor/10 text-phosphor border terminal-border flex items-center gap-1 transition-colors"
 >
 {copiedId === variant.id ? (
 <Check className="w-3 h-3 text-phosphor" />
 ) : (
 <Copy className="w-3 h-3 text-phosphor/50" />
 )}
 <span>Copy</span>
 </button>

 {onApplyPromptToInput && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 onApplyPromptToInput(variant.promptText);
 showToast('Applied Variant Prompt to Synthesis Input');
 }}
 className="text-[9px] font-display uppercase tracking-widest font-bold px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 transition-colors"
 >
 Apply
 </button>
 )}
 </div>

 {/* Save Discovery Trigger */}
 {(variant.userRating === 'INTERESTING' || variant.userRating === 'JACKPOT') && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setSaveModalVariant(variant);
 setDiscoveryNameInput(
 `${variant.operators.join(' + ')} (${currentExperiment.targetMedium.toUpperCase()})`
 );
 }}
 className="text-[9px] font-display uppercase tracking-widest px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/50 font-bold flex items-center gap-1 animate-pulse"
 >
 <Bookmark className="w-3 h-3" />
 <span>Save Discovery</span>
 </button>
 )}
 </div>

 {/* Fast Rating Buttons (Section 8) */}
 <div className="flex items-center gap-1 font-display uppercase tracking-widest text-[9px]">
 <span className="text-phosphor/50 mr-1">Rate:</span>
 {(['BORING', 'BROKEN BAD', 'INTERESTING', 'JACKPOT'] as DiscoveryUserRating[]).map(
 (rating) => (
 <button
 key={rating}
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleRateVariant(variant.id, rating);
 }}
 className={`px-1.5 py-0.5 border terminal-border transition-colors ${
 variant.userRating === rating
 ? rating === 'JACKPOT'
 ? 'bg-phosphor/30 border-phosphor text-phosphor font-bold'
 : rating === 'INTERESTING'
 ? 'bg-phosphor/30 border-phosphor text-phosphor font-bold'
 : 'bg-theme-bg border-phosphor text-phosphor font-bold'
 : 'bg-theme-bg border-phosphor/30 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 {rating === 'BROKEN BAD' ? 'BAD' : rating}
 </button>
 )
 )}
 </div>

 {/* Quick Tagging Popover Trigger */}
 <div className="pt-1">
 <details className="text-[9px] font-display uppercase tracking-widest text-phosphor/50">
 <summary className="cursor-pointer hover:text-phosphor select-none">
 + Tag Observable Artifacts ({variant.taggedArtifacts.length})
 </summary>
 <div className="p-2 mt-1 bg-theme-bg border terminal-border flex flex-wrap gap-1 max-h-32 overflow-y-auto">
 {OBSERVABLE_ARTIFACT_TAGS.map((tag) => {
 const active = variant.taggedArtifacts.includes(tag);
 return (
 <button
 key={tag}
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleToggleArtifactTag(variant.id, tag);
 }}
 className={`px-1.5 py-0.5 text-[9px] border terminal-border transition-colors font-mono ${
 active
 ? 'bg-phosphor/20 border-phosphor text-phosphor font-bold'
 : 'bg-theme-panel border-phosphor/30 text-phosphor/60 hover:border-phosphor'
 }`}
 >
 {tag}
 </button>
 );
 })}
 </div>
 </details>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 ) : (
 <div className="p-8 text-center font-display uppercase tracking-widest font-bold text-phosphor/40 text-[10px] border-dashed terminal-border ">
 Click "Build New Family" to synthesize an empirical experiment family from your current input.
 </div>
 )}
 </div>
 )}

 {/* TAB 2: HYPOTHESIS & TENSION BLUEPRINT */}
 {activeTab === 'hypothesis' && currentExperiment && (
 <div className="space-y-4 font-mono text-[10px]">
 <div className="p-4 bg-theme-panel border terminal-border border-phosphor/30 space-y-4">
 <div className="flex items-center gap-2 text-phosphor font-display uppercase tracking-widest font-bold text-[11px] border-b terminal-border pb-2">
 <Dna className="w-4 h-4 text-phosphor" />
 <span>Structured Hypothesis Blueprint (Job 8 Section 4)</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="p-3 bg-theme-bg border terminal-border space-y-1">
 <span className="text-[9px] text-phosphor font-display uppercase tracking-widest font-bold block">
 1. Scientific Hypothesis
 </span>
 <p className="text-phosphor leading-relaxed">
 {currentExperiment.hypothesis.hypothesis}
 </p>
 </div>

 <div className="p-3 bg-theme-bg border terminal-border space-y-1">
 <span className="text-[9px] text-phosphor font-display uppercase tracking-widest font-bold block">
 2. Boundary Tension
 </span>
 <p className="text-phosphor leading-relaxed">
 {currentExperiment.hypothesis.tension}
 </p>
 </div>

 <div className="p-3 bg-theme-bg border terminal-border space-y-1">
 <span className="text-[9px] text-phosphor font-display uppercase tracking-widest font-bold block">
 3. Control Neutralization
 </span>
 <p className="text-phosphor leading-relaxed">
 {currentExperiment.hypothesis.control}
 </p>
 </div>

 <div className="p-3 bg-theme-bg border terminal-border space-y-1">
 <span className="text-[9px] text-semantic-red font-display uppercase tracking-widest font-bold block">
 4. Ablation Contrast
 </span>
 <p className="text-phosphor leading-relaxed">
 {currentExperiment.hypothesis.ablation}
 </p>
 </div>
 </div>

 <div className="p-3 bg-theme-bg border terminal-border space-y-1">
 <span className="text-[9px] text-phosphor font-display uppercase tracking-widest font-bold block">
 5. Expected Failure Artifacts
 </span>
 <p className="text-phosphor leading-relaxed">
 {currentExperiment.hypothesis.expectedFailure}
 </p>
 </div>

 <div className="p-3 bg-theme-bg border terminal-border text-[10px] text-phosphor/60 space-y-1">
 <div className="text-phosphor font-display uppercase tracking-widest font-bold">Scientific Hygiene Guarantee:</div>
 <p className="opacity-80 leading-relaxed">
 DAVID evaluates empirical output behavior without pretending to measure hidden proprietary weights or unmeasurable activations.
 All observations describe observable output structures.
 </p>
 </div>
 </div>
 </div>
 )}

 {/* TAB 3: DISCOVERY ARCHIVE (SAVED RECIPES) */}
 {activeTab === 'archive' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between text-[10px] font-display">
 <span className="text-phosphor/60 uppercase tracking-widest font-bold">
 Saved Generative Procedures ({Object.keys(savedRecipes).length})
 </span>
 <span className="text-[9px] text-phosphor/50 uppercase tracking-widest">
 Stores procedures (operator chains & relative strengths), not merely static prompt text
 </span>
 </div>

 {Object.keys(savedRecipes).length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Object.values(savedRecipes).map((recipe) => (
 <div
 key={recipe.id}
 className="p-4 bg-theme-panel border terminal-border space-y-3 font-mono text-[10px] flex flex-col justify-between hover:border-phosphor/50 transition-colors"
 >
 <div className="space-y-2.5">
 <div className="flex items-start justify-between gap-2">
 <div>
 <div className="font-bold text-phosphor text-[11px] font-mono">{recipe.name}</div>
 <div className="text-[9px] text-phosphor/50">ID: {recipe.id}</div>
 </div>
 <div className="flex flex-col items-end gap-1">
 <span className="text-[9px] px-2 py-0.5 bg-theme-bg text-phosphor/70 border terminal-border uppercase">
 {recipe.targetMedium}
 </span>
 <span
 className={`text-[9px] px-2 py-0.5 border terminal-border uppercase font-bold ${
 recipe.confidence === 'strong'
 ? 'bg-phosphor/20 text-phosphor border-phosphor/40'
 : recipe.confidence === 'repeated'
 ? 'bg-phosphor/20 text-phosphor border-phosphor/40'
 : 'bg-theme-bg text-phosphor/60 border-phosphor/30'
 }`}
 >
 Conf: {recipe.confidence} ({recipe.timesObserved}x)
 </span>
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border text-[10px] text-phosphor space-y-1">
 <div className="text-phosphor font-bold font-mono">
 Operator Chain: {recipe.ordering.join(' → ')}
 </div>
 <div className="text-phosphor/60 text-[9px]">
 Failure Surface: {recipe.usefulFailureSurface.join(', ')}
 </div>
 </div>

 <p className="text-phosphor/70 text-[10px] leading-relaxed">
 {recipe.mechanismHypothesis}
 </p>
 </div>

 {/* Recipe Actions (Section 14) */}
 <div className="pt-3 border-t terminal-border space-y-2">
 <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-display uppercase tracking-widest font-bold">
 {/* 1. Reuse Recipe */}
 {onApplyRecipeToState && (
 <button
 type="button"
 onClick={() => {
 onApplyRecipeToState(recipe);
 showToast(`Loaded "${recipe.name}" into active synthesis configuration`);
 }}
 className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 transition-colors"
 >
 Reuse
 </button>
 )}

 {/* 2. Test Reproducibility */}
 <button
 type="button"
 onClick={() => handleTestReproducibility(recipe.id)}
 className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 flex items-center gap-1 transition-colors"
 >
 <Shuffle className="w-3 h-3" />
 <span>Test Repro</span>
 </button>

 {/* Confirm Repro Buttons */}
 <button
 type="button"
 onClick={() => handleConfirmReproduction(recipe.id, true)}
 className="px-1.5 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/30 transition-colors"
 title="Confirm that the artifact family recurs across seeds (+confidence)"
 >
 ✓ Recurred
 </button>

 {/* 3. Mutate Discovery (Section 13) */}
 <details className="relative inline-block">
 <summary className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 cursor-pointer select-none transition-colors">
 Mutate ▾
 </summary>
 <div className="absolute left-0 bottom-full mb-1 z-30 w-48 p-1.5 bg-theme-panel border terminal-border shadow-xl space-y-1 font-mono normal-case tracking-normal font-normal">
 <button
 type="button"
 onClick={() => handleMutateRecipe(recipe.id, 'reverse_order')}
 className="w-full text-left px-2 py-1 hover:bg-theme-bg text-[10px] text-phosphor/80 transition-colors"
 >
 Reverse Operator Order
 </button>
 <button
 type="button"
 onClick={() => handleMutateRecipe(recipe.id, 'titrate_strength')}
 className="w-full text-left px-2 py-1 hover:bg-theme-bg text-[10px] text-phosphor/80 transition-colors"
 >
 Titrate Pressure (+35%)
 </button>
 <button
 type="button"
 onClick={() => handleMutateRecipe(recipe.id, 'substitute_operator')}
 className="w-full text-left px-2 py-1 hover:bg-theme-bg text-[10px] text-phosphor/80 transition-colors"
 >
 Substitute Secondary Op
 </button>
 <button
 type="button"
 onClick={() => handleMutateRecipe(recipe.id, 'transfer_modality')}
 className="w-full text-left px-2 py-1 hover:bg-theme-bg text-[10px] text-phosphor/80 transition-colors"
 >
 Cross-Modality Transfer
 </button>
 </div>
 </details>

 {/* 4. Promote to Operator (Section 10) */}
 {!recipe.promotedToOperator ? (
 <button
 type="button"
 onClick={() => handlePromoteToOperator(recipe.id)}
 className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 flex items-center gap-1 transition-colors"
 >
 <Award className="w-3 h-3" />
 <span>Promote</span>
 </button>
 ) : (
 <span className="text-[9px] text-phosphor px-1.5 py-0.5 bg-phosphor/5 border terminal-border border-phosphor/40">
 Promoted
 </span>
 )}

 {/* Delete */}
 <button
 type="button"
 onClick={() => {
 deleteDiscoveryRecipe(recipe.id);
 refreshData();
 showToast('Deleted recipe from archive');
 }}
 className="p-1 text-phosphor/40 hover:text-semantic-red ml-auto transition-colors"
 title="Delete recipe"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="p-8 text-center font-display uppercase tracking-widest font-bold text-[10px] text-phosphor/40 border-dashed terminal-border ">
 No discoveries saved yet. Rate an experimental variant as "INTERESTING" or "JACKPOT" to save its generative procedure here.
 </div>
 )}
 </div>
 )}

 {/* TAB 4: PROMOTED OPERATORS */}
 {activeTab === 'promoted' && (
 <div className="space-y-4 font-mono text-xs">
 <div className="flex items-center justify-between font-display">
 <span className="text-phosphor/60 uppercase tracking-widest font-bold text-[10px]">
 Promoted Operators Library ({Object.keys(promotedOperators).length})
 </span>
 <span className="text-[9px] text-phosphor/40 uppercase tracking-widest">
 Marked as EXPERIMENTAL / USER-DISCOVERED • Directly selectable across DAVID
 </span>
 </div>

 {Object.keys(promotedOperators).length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Object.values(promotedOperators).map((promoted) => (
 <div
 key={promoted.id}
 className="p-4 bg-theme-panel border terminal-border border-phosphor/30 space-y-3 flex flex-col justify-between"
 >
 <div className="space-y-2">
 <div className="flex items-start justify-between gap-2">
 <div>
 <div className="font-bold text-phosphor text-[11px]">{promoted.name}</div>
 <div className="text-[9px] text-phosphor/50">ID: {promoted.id}</div>
 </div>
 <span className="text-[9px] font-display px-2 py-0.5 bg-phosphor/20 text-phosphor border terminal-border border-phosphor/40 font-bold uppercase tracking-widest">
 {promoted.origin}
 </span>
 </div>

 <p className="text-phosphor/80 text-[10px] leading-relaxed">
 {promoted.shortDescription}
 </p>

 <div className="p-2.5 bg-theme-bg border terminal-border text-[10px] space-y-1">
 <div className="text-phosphor">
 Mechanism Hypothesis: <span className="text-phosphor/80">{promoted.mechanismHypothesis}</span>
 </div>
 <div className="text-phosphor">
 Expected Failure Surface: <span className="text-phosphor/80">{promoted.expectedFailureSurface.join(', ')}</span>
 </div>
 <div className="text-phosphor">
 Confidence Level: <span className="text-phosphor/80">{promoted.confidence}</span>
 </div>
 </div>
 </div>

 <div className="pt-2 border-t terminal-border flex items-center justify-between font-display uppercase tracking-widest font-bold">
 <span className="text-[9px] text-phosphor/50">
 Target Medium: {promoted.targetMedium}
 </span>
 <button
 type="button"
 onClick={() => {
 deletePromotedOperator(promoted.id);
 refreshData();
 showToast(`Removed promoted operator ${promoted.name}`);
 }}
 className="text-[9px] text-phosphor/50 hover:text-semantic-red flex items-center gap-1 transition-colors"
 >
 <Trash2 className="w-3 h-3" />
 <span>Demote / Remove</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="p-8 text-center font-display uppercase tracking-widest font-bold text-[10px] text-phosphor/40 border-dashed terminal-border ">
 No operators promoted yet. In the Discovery Archive tab, click "Promote" on any confirmed discovery recipe.
 </div>
 )}
 </div>
 )}
 </div>
 )}

 {/* SAVE DISCOVERY MODAL */}
 {saveModalVariant && (
 <div className="fixed inset-0 z-50 bg-theme-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="w-full max-w-md bg-theme-panel border terminal-border border-phosphor/50 p-6 space-y-4 font-mono text-[10px] shadow-2xl animate-in zoom-in-95">
 <div className="flex items-center justify-between border-b terminal-border pb-3">
 <div className="flex items-center gap-2 text-phosphor font-display uppercase tracking-widest font-bold text-[10px]">
 <Bookmark className="w-4 h-4" />
 <span>Save Generative Discovery Recipe</span>
 </div>
 <button
 type="button"
 onClick={() => setSaveModalVariant(null)}
 className="text-phosphor/50 hover:text-phosphor text-lg leading-none transition-colors"
 >
 &times;
 </button>
 </div>

 <div className="space-y-3">
 <div>
 <label className="text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/60 block mb-1">
 Discovery Name
 </label>
 <input
 type="text"
 value={discoveryNameInput}
 onChange={(e) => setDiscoveryNameInput(e.target.value)}
 placeholder="e.g. Chitinous Lattice Seam"
 className="w-full px-3 py-2 bg-theme-bg border terminal-border text-phosphor text-[10px] focus:outline-none focus:border-phosphor transition-colors"
 />
 </div>

 <div className="p-3 bg-theme-bg border terminal-border text-[10px] text-phosphor/80 space-y-1">
 <div>
 <span className="text-phosphor/50">Operators:</span>{' '}
 <span className="text-phosphor font-bold">{saveModalVariant.operators.join(' → ')}</span>
 </div>
 <div>
 <span className="text-phosphor/50">Artifacts Tagged:</span>{' '}
 <span className="text-phosphor font-bold">
 {saveModalVariant.taggedArtifacts.length > 0
 ? saveModalVariant.taggedArtifacts.join(', ')
 : 'None'}
 </span>
 </div>
 <div className="text-[9px] text-phosphor/40 pt-1 font-display uppercase tracking-widest">
 Saves the generative procedure, ordering, and failure conditions so prompts can be reconstructed later.
 </div>
 </div>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t terminal-border ">
 <button
 type="button"
 onClick={() => setSaveModalVariant(null)}
 className="px-3 py-1.5 bg-theme-bg hover:bg-phosphor/10 text-phosphor/60 font-display uppercase tracking-widest font-bold text-[9px] border terminal-border transition-colors"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={handleSaveDiscovery}
 className="px-4 py-1.5 bg-phosphor hover:bg-phosphor/80 text-theme-bg font-display uppercase tracking-widest font-bold text-[9px] flex items-center gap-1.5 border terminal-border transition-colors"
 >
 <Bookmark className="w-3.5 h-3.5 fill-theme-bg" />
 <span>Save Discovery</span>
 </button>
 </div>
 </div>
 </div>
 )}
 </section>
 );
};
