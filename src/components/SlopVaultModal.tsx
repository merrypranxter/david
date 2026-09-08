import React, { useState, useMemo } from 'react';
import {
 MATH_LEXICON,
 SCIENCE_LEXICON,
 SLOP_LEXICON,
 generateRandomSeeds,
} from '../data/lexicons';
import { MUTATION_OPERATORS } from '../data/mutationOperators';
import { LATENT_ATTRACTORS } from '../data/latentFauna';
import { CREATIVE_PRESSURES } from '../data/creativePressures';
import {
 CreativePressureId,
 PromptGeneration,
 SlopSeedingConfig,
 TargetEngine,
} from '../types';
import { compileMutationRecipe, describeMutationRecipe } from '../utils/recipeCompiler';
import { getDormantBranches, dormantBranchToParentGeneration } from '../utils/branchArchive';
import {
 Search,
 X,
 Plus,
 Check,
 Sparkles,
 Binary,
 Atom,
 Zap,
 Sliders,
 Dices,
 Shield,
 Eye,
 AlertTriangle,
 Flame,
 GitBranch,
 ChevronDown,
 ChevronUp,
 Cpu,
} from 'lucide-react';
import { SlopMethodsTab } from './SlopMethodsTab';

interface SlopVaultModalProps {
 isOpen: boolean;
 onClose: () => void;
 selectedSeeds: string[];
 onToggleSeed: (seed: string) => void;
 onSelectMultipleSeeds: (seeds: string[]) => void;
 slopConfig: SlopSeedingConfig;
 setSlopConfig?: React.Dispatch<React.SetStateAction<SlopSeedingConfig>>;
 onUpdateSlopConfig?: (updater: (prev: SlopSeedingConfig) => SlopSeedingConfig) => void;
 entropyLevel?: number;
 currentConcept?: string;
 targetEngine?: TargetEngine;
 onCrossbreedBranch?: (parentA: PromptGeneration, parentB: PromptGeneration) => void;
 onApplyConcept?: (concept: string) => void;
}

export const SlopVaultModal: React.FC<SlopVaultModalProps> = ({
 isOpen,
 onClose,
 selectedSeeds,
 onToggleSeed,
 onSelectMultipleSeeds,
 slopConfig,
 setSlopConfig,
 onUpdateSlopConfig,
 entropyLevel = 7,
 currentConcept = 'A surreal sensory scene',
 targetEngine = 'nano',
 onCrossbreedBranch,
 onApplyConcept,
}) => {
 // Main Navigation: 6 Core Tabs (Job 7 & Slop Methods)
 const [activeMainTab, setActiveMainTab] = useState<'dna' | 'operators' | 'fauna' | 'methods' | 'pressures' | 'branches'>('dna');
 // Content DNA sub-tab
 const [dnaSubTab, setDnaSubTab] = useState<'all' | 'maths' | 'sciences' | 'slop'>('all');
 const [searchTerm, setSearchTerm] = useState<string>('');
 const [newAnchorInput, setNewAnchorInput] = useState<string>('');
 const [showRecipePreview, setShowRecipePreview] = useState<boolean>(false);

 // Active selections in slopConfig
 const mutationMode = slopConfig.mutationMode || 'auto';
 const selectedOps = slopConfig.selectedOperators || [];
 const selectedAttractors = slopConfig.selectedAttractors || [];
 const selectedPressures = slopConfig.selectedPressures || [];
 const protectedAnchors = slopConfig.protectedAnchors || [];

 // Content DNA entries
 const allDnaEntries = useMemo(() => {
 return [
 ...MATH_LEXICON.map((e) => ({ ...e, domainLabel: 'Maths' })),
 ...SCIENCE_LEXICON.map((e) => ({ ...e, domainLabel: 'Sciences' })),
 ...SLOP_LEXICON.map((e) => ({ ...e, domainLabel: 'Slop' })),
 ];
 }, []);

 const filteredDnaEntries = useMemo(() => {
 let list = allDnaEntries;
 if (dnaSubTab !== 'all') {
 list = list.filter((e) => e.domain === dnaSubTab);
 }
 if (searchTerm.trim()) {
 const q = searchTerm.toLowerCase();
 list = list.filter(
 (e) =>
 e.name.toLowerCase().includes(q) ||
 e.tagline.toLowerCase().includes(q) ||
 e.keywords.some((k) => k.toLowerCase().includes(q))
 );
 }
 return list;
 }, [allDnaEntries, dnaSubTab, searchTerm]);

 // Filtered Operators
 const filteredOperators = useMemo(() => {
 if (!searchTerm.trim() || activeMainTab !== 'operators') return MUTATION_OPERATORS;
 const q = searchTerm.toLowerCase();
 return MUTATION_OPERATORS.filter(
 (op) =>
 op.name.toLowerCase().includes(q) ||
 op.description.toLowerCase().includes(q) ||
 op.category.toLowerCase().includes(q) ||
 op.tags.some((t) => t.toLowerCase().includes(q))
 );
 }, [searchTerm, activeMainTab]);

 // Filtered Fauna
 const filteredFauna = useMemo(() => {
 if (!searchTerm.trim() || activeMainTab !== 'fauna') return LATENT_ATTRACTORS;
 const q = searchTerm.toLowerCase();
 return LATENT_ATTRACTORS.filter(
 (a) =>
 a.name.toLowerCase().includes(q) ||
 a.description.toLowerCase().includes(q) ||
 a.category.toLowerCase().includes(q) ||
 a.tags.some((t) => t.toLowerCase().includes(q))
 );
 }, [searchTerm, activeMainTab]);

 const updateConfig = (updater: (prev: SlopSeedingConfig) => SlopSeedingConfig) => {
 if (onUpdateSlopConfig) {
 onUpdateSlopConfig(updater);
 } else if (setSlopConfig) {
 setSlopConfig(updater);
 }
 };

 // Extinct Dormant Branches
 const dormantBranches = useMemo(() => {
 return getDormantBranches();
 }, [isOpen]);

 // Live compiled recipe preview
 const previewRecipe = useMemo(() => {
 try {
 return compileMutationRecipe({
 concept: currentConcept,
 entropyLevel,
 config: slopConfig,
 selectedOperators: selectedOps.map((op) => ({ id: op.id, weight: op.weight ?? 1.0, intensity: op.intensity })),
 selectedAttractors: selectedAttractors.map((at) => ({ id: at.id, weight: at.weight ?? 1.0, intensity: at.intensity })),
 selectedContentSeeds: selectedSeeds,
 targetEngine,
 preservedAnchors: protectedAnchors,
 pressures: selectedPressures,
 });
 } catch {
 return null;
 }
 }, [currentConcept, entropyLevel, slopConfig, selectedOps, selectedAttractors, selectedSeeds, targetEngine, protectedAnchors, selectedPressures]);

 if (!isOpen) return null;

 // Toggle Operator selection
 const handleToggleOperator = (opId: string) => {
 updateConfig((prev) => {
 const current = prev.selectedOperators || [];
 const exists = current.some((o) => (typeof o === 'string' ? o : o.id) === opId);
 const next = exists
 ? current.filter((o) => (typeof o === 'string' ? o : o.id) !== opId)
 : [...current, { id: opId, weight: 1.0, intensity: 0.8 }];
 return {
 ...prev,
 selectedOperators: next,
 };
 });
 };

 // Set Operator Intensity
 const handleSetOperatorIntensity = (opId: string, intensity: number) => {
 updateConfig((prev) => {
 const current = prev.selectedOperators || [];
 const next = current.map((o) => {
 const id = typeof o === 'string' ? o : o.id;
 if (id === opId) {
 return { id, weight: 1.0, intensity };
 }
 return typeof o === 'string' ? { id: o, weight: 1.0, intensity: 0.8 } : o;
 });
 return { ...prev, selectedOperators: next };
 });
 };

 // Toggle Fauna selection
 const handleToggleFauna = (faunaId: string) => {
 updateConfig((prev) => {
 const current = prev.selectedAttractors || [];
 const exists = current.some((a) => (typeof a === 'string' ? a : a.id) === faunaId);
 const next = exists
 ? current.filter((a) => (typeof a === 'string' ? a : a.id) !== faunaId)
 : [...current, { id: faunaId, weight: 1.0, intensity: 0.8 }];
 return { ...prev, selectedAttractors: next };
 });
 };

 // Set Fauna Weight
 const handleSetFaunaWeight = (faunaId: string, weight: number) => {
 updateConfig((prev) => {
 const current = prev.selectedAttractors || [];
 const next = current.map((a) => {
 const id = typeof a === 'string' ? a : a.id;
 if (id === faunaId) {
 return { id, weight, intensity: 0.8 };
 }
 return typeof a === 'string' ? { id: a, weight: 1.0, intensity: 0.8 } : a;
 });
 return { ...prev, selectedAttractors: next };
 });
 };

 // Toggle Pressure selection
 const handleTogglePressure = (pressureId: CreativePressureId) => {
 updateConfig((prev) => {
 const current = prev.selectedPressures || [];
 const next = current.includes(pressureId)
 ? current.filter((p) => p !== pressureId)
 : [...current, pressureId];
 return { ...prev, selectedPressures: next };
 });
 };

 // Add Custom Anchor
 const handleAddAnchor = (e: React.FormEvent) => {
 e.preventDefault();
 const clean = newAnchorInput.trim();
 if (!clean) return;
 const formatted = clean.startsWith('@') ? clean : `@${clean}`;
 updateConfig((prev) => {
 const current = prev.protectedAnchors || [];
 if (current.includes(formatted)) return prev;
 return { ...prev, protectedAnchors: [...current, formatted] };
 });
 setNewAnchorInput('');
 };

 // Remove Anchor
 const handleRemoveAnchor = (anchorToRemove: string) => {
 updateConfig((prev) => ({
 ...prev,
 protectedAnchors: (prev.protectedAnchors || []).filter((a) => a !== anchorToRemove),
 }));
 };

 // Roll Random Mutation (Job 7)
 const handleRollMutation = () => {
 // 1. Content seeds
 const seedRes = generateRandomSeeds({
 addMaths: true,
 addSciences: true,
 addSlop: true,
 contradictionMode: slopConfig.contradictionMode,
 count: 4,
 });
 onSelectMultipleSeeds(seedRes.seeds);

 // 2. Pick 1-3 compatible operators based on entropy
 const eligibleOps = MUTATION_OPERATORS.filter((o) => o.minEntropy <= entropyLevel);
 const shuffledOps = [...eligibleOps].sort(() => 0.5 - Math.random());
 const opCount = Math.min(shuffledOps.length, Math.max(1, Math.min(3, Math.floor(entropyLevel / 3) + 1)));
 const pickedOps = shuffledOps.slice(0, opCount).map((o) => ({ id: o.id, weight: 1.0, intensity: 0.8 }));

 // 3. Pick 1-2 compatible fauna
 const eligibleFauna = LATENT_ATTRACTORS.filter((a) => a.minEntropy <= entropyLevel);
 const shuffledFauna = [...eligibleFauna].sort(() => 0.5 - Math.random());
 const faunaCount = Math.min(shuffledFauna.length, Math.max(1, Math.floor(entropyLevel / 4)));
 const pickedFauna = shuffledFauna.slice(0, faunaCount).map((a) => ({ id: a.id, weight: 1.0, intensity: 0.8 }));

 updateConfig((prev) => ({
 ...prev,
 selectedOperators: pickedOps,
 selectedAttractors: pickedFauna,
 }));
 };

 // Clear all mutation selections
 const handleClearAll = () => {
 onSelectMultipleSeeds([]);
 updateConfig((prev) => ({
 ...prev,
 selectedOperators: [],
 selectedAttractors: [],
 selectedPressures: [],
 protectedAnchors: [],
 }));
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
 <div className="bg-theme-panel border terminal-border w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-phosphor">
 
 {/* Modal Header */}
 <div className="px-5 py-3.5 border-b terminal-border flex items-center justify-between bg-theme-panel">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-phosphor">
 Mutation Lab &bull; Synthetic Ontologies
 </h2>
 <span className="text-[10px] font-mono px-2 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border">
 Entropy S{entropyLevel}
 </span>
 </div>
 <p className="text-xs font-mono text-phosphor/80 hidden sm:block">
 Content DNA &bull; 18 Mutation Operators &bull; 16 Latent Fauna &bull; 5 Optimization Pressures
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {/* Mode Selector: AUTO vs CURATED (Job 7) */}
 <div className="flex items-center gap-1 bg-theme-panel border terminal-border p-0.5 text-xs font-mono">
 <button
 type="button"
 onClick={() => updateConfig((prev) => ({ ...prev, mutationMode: 'auto' }))}
 className={`px-2.5 py-1 transition-colors ${
 mutationMode === 'auto'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 title="DAVID chooses operators & fauna dynamically according to concept & entropy"
 >
 AUTO
 </button>
 <button
 type="button"
 onClick={() => updateConfig((prev) => ({ ...prev, mutationMode: 'curated' }))}
 className={`px-2.5 py-1 transition-colors ${
 mutationMode === 'curated'
 ? 'bg-semantic-red/10 text-semantic-red font-bold border border-semantic-red/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 title="Strictly uses your selected operators, fauna, and pressures"
 >
 CURATED
 </button>
 </div>

 {/* Roll Mutation Button */}
 <button
 type="button"
 onClick={handleRollMutation}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-panel hover:bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border text-xs font-mono transition-colors"
 title="Randomize compatible operators, fauna & seeds for current entropy"
 >
 <Dices className="w-4 h-4 text-phosphor" />
 <span className="hidden sm:inline">Roll Mutation</span>
 </button>

 {/* Close Button */}
 <button
 type="button"
 onClick={onClose}
 className="p-1.5 hover:bg-phosphor/10 text-phosphor/80 hover:text-phosphor transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Primary 4-Tab Navigation (Job 7) */}
 <div className="px-5 py-2.5 bg-theme-panel border-b terminal-border flex flex-col md:flex-row md:items-center justify-between gap-3">
 <div className="flex items-center gap-1.5 overflow-x-auto">
 <button
 type="button"
 onClick={() => setActiveMainTab('dna')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'dna'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <Zap className="w-3.5 h-3.5 text-phosphor" />
 <span>CONTENT DNA ({selectedSeeds.length})</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveMainTab('operators')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'operators'
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/40 font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <Sliders className="w-3.5 h-3.5 text-phosphor" />
 <span>OPERATORS ({selectedOps.length})</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveMainTab('fauna')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'fauna'
 ? 'bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <Eye className="w-3.5 h-3.5 text-semantic-red" />
 <span>LATENT FAUNA ({selectedAttractors.length})</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveMainTab('pressures')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'pressures'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <Shield className="w-3.5 h-3.5 text-phosphor" />
 <span>PRESSURES ({selectedPressures.length})</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveMainTab('methods')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'methods'
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/40 font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <Cpu className="w-3.5 h-3.5 text-phosphor" />
 <span>SLOP METHODS & SPECIMENS</span>
 </button>

 {dormantBranches.length > 0 && (
 <button
 type="button"
 onClick={() => setActiveMainTab('branches')}
 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
 activeMainTab === 'branches'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-bold'
 : 'text-phosphor/80 hover:text-phosphor hover:bg-theme-panel/60'
 }`}
 >
 <GitBranch className="w-3.5 h-3.5 text-phosphor" />
 <span>EXTINCT BRANCHES ({dormantBranches.length})</span>
 </button>
 )}
 </div>

 {/* Search bar */}
 <div className="relative flex-1 md:max-w-xs">
 <Search className="w-3.5 h-3.5 text-phosphor/50 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder={`Search ${activeMainTab.toUpperCase()}...`}
 className="w-full bg-theme-panel border terminal-border pl-8 pr-3 py-1 text-xs font-mono text-phosphor placeholder-phosphor/50 focus:outline-none focus:border-phosphor/30 terminal-border"
 />
 {searchTerm && (
 <button
 type="button"
 onClick={() => setSearchTerm('')}
 className="absolute right-2 top-1/2 -translate-y-1/2 text-phosphor/50 hover:text-phosphor/80"
 >
 &times;
 </button>
 )}
 </div>
 </div>

 {/* Protected Anchors Strip (Job 7) */}
 <div className="px-5 py-2 bg-theme-panel border-b terminal-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
 <div className="flex items-center gap-2 flex-wrap flex-1">
 <span className="text-phosphor/80 uppercase tracking-wider flex items-center gap-1 shrink-0">
 <Shield className="w-3.5 h-3.5 text-phosphor" />
 <span>Protected Anchors:</span>
 </span>
 {protectedAnchors.length === 0 ? (
 <span className="text-phosphor/50 italic text-[11px]">No custom anchors protected (e.g. @merry)</span>
 ) : (
 protectedAnchors.map((anchor) => (
 <span
 key={anchor}
 className="inline-flex items-center gap-1 bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor px-2 py-0.5 text-[11px]"
 >
 <span>{anchor}</span>
 <button
 type="button"
 onClick={() => handleRemoveAnchor(anchor)}
 className="hover:text-semantic-red text-phosphor/80"
 >
 &times;
 </button>
 </span>
 ))
 )}
 </div>

 <form onSubmit={handleAddAnchor} className="flex items-center gap-1.5 shrink-0">
 <input
 type="text"
 value={newAnchorInput}
 onChange={(e) => setNewAnchorInput(e.target.value)}
 placeholder="+ Protect anchor (@subject)..."
 className="bg-theme-panel border terminal-border px-2 py-1 text-[11px] font-mono text-phosphor placeholder-phosphor/50 focus:outline-none focus:border-phosphor/30 terminal-border w-44"
 />
 <button
 type="submit"
 disabled={!newAnchorInput.trim()}
 className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border text-[11px] font-bold disabled:opacity-40"
 >
 Add
 </button>
 </form>
 </div>

 {/* TAB CONTENT BODY */}
 <div className="flex-1 overflow-y-auto p-4 sm:p-5">
 {/* ========================================= */}
 {/* TAB 1: CONTENT DNA */}
 {/* ========================================= */}
 {activeMainTab === 'dna' && (
 <div className="space-y-4">
 {/* DNA Sub-categories */}
 <div className="flex items-center gap-2 border-b terminal-border pb-2 overflow-x-auto text-xs font-mono">
 <span className="text-phosphor/50 uppercase text-[11px]">Vocabulary:</span>
 {(['all', 'maths', 'sciences', 'slop'] as const).map((sub) => (
 <button
 key={sub}
 type="button"
 onClick={() => setDnaSubTab(sub)}
 className={`px-2.5 py-1 transition-colors ${
 dnaSubTab === sub
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-bold'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 {sub === 'all'
 ? 'All DNA'
 : sub === 'maths'
 ? 'Higher Mathematics'
 : sub === 'sciences'
 ? 'Physical Instabilities'
 : 'Internet & Glitch Slop'}
 </button>
 ))}
 </div>

 {/* DNA Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {filteredDnaEntries.map((entry) => {
 const hasSelectedKeywords = entry.keywords.some((k) => selectedSeeds.includes(k));
 return (
 <div
 key={entry.id}
 className={`p-3.5 border transition-all flex flex-col justify-between ${
 hasSelectedKeywords
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border shadow-md'
 : 'bg-theme-panel/40 border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <h4 className="text-xs font-bold font-mono text-phosphor">{entry.name}</h4>
 <span
 className={`text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider ${
 entry.domain === 'maths'
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/30'
 : entry.domain === 'sciences'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : 'bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border'
 }`}
 >
 {entry.domain}
 </span>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 mb-2 leading-relaxed">
 {entry.tagline}
 </p>
 </div>

 {/* Keywords Tokens */}
 <div className="flex flex-wrap items-center gap-1 pt-2 border-t terminal-border">
 {entry.keywords.map((k) => {
 const isSelected = selectedSeeds.includes(k);
 return (
 <button
 key={k}
 type="button"
 onClick={() => onToggleSeed(k)}
 className={`text-[10px] font-mono px-1.5 py-0.5 border transition-colors flex items-center gap-1 ${
 isSelected
 ? 'bg-phosphor/10 text-phosphor border-phosphor/30 terminal-border font-bold'
 : 'bg-theme-panel text-phosphor/80 hover:text-phosphor border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 {isSelected ? <Check className="w-2.5 h-2.5 text-phosphor" /> : <Plus className="w-2.5 h-2.5 text-phosphor/50" />}
 <span>{k}</span>
 </button>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================= */}
 {/* TAB 2: OPERATORS */}
 {/* ========================================= */}
 {activeMainTab === 'operators' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 flex items-center justify-between border-b terminal-border pb-2">
 <span>
 <strong>18 Mutation Operators:</strong> Formal algorithmic transformation rules operating on semantic organs.
 </span>
 <span className="text-[11px] text-phosphor">
 {selectedOps.length} Active in Curated Set
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {filteredOperators.map((op) => {
 const selectedObj = selectedOps.find((o) => (typeof o === 'string' ? o : o.id) === op.id);
 const isSelected = Boolean(selectedObj);
 const intensity = typeof selectedObj === 'object' && selectedObj.intensity ? selectedObj.intensity : 0.8;

 return (
 <div
 key={op.id}
 className={`p-3.5 border transition-all flex flex-col justify-between ${
 isSelected
 ? 'bg-phosphor/25 border-phosphor/60 shadow-md'
 : 'bg-theme-panel/40 border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <div className="flex items-center gap-1.5">
 <h4 className="text-xs font-bold font-mono text-phosphor">{op.name}</h4>
 {op.experimental && (
 <span className="text-[9px] font-mono px-1 py-0.2 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 EXP
 </span>
 )}
 </div>
 <span className="text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider bg-theme-panel text-phosphor/80 border terminal-border">
 {op.category}
 </span>
 </div>

 <p className="text-[11px] font-mono text-phosphor/80 mb-2 leading-relaxed">
 {op.description}
 </p>

 <div className="text-[10px] font-mono text-phosphor/50 mb-2 flex items-center gap-2">
 <span>Min: S{op.minEntropy}</span>
 <span>&bull;</span>
 <span>Tags: {op.tags.slice(0, 2).join(', ')}</span>
 </div>
 </div>

 {/* Controls: Toggle + Intensity */}
 <div className="pt-2 border-t terminal-border flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={() => handleToggleOperator(op.id)}
 className={`px-3 py-1 text-xs font-mono transition-colors flex items-center gap-1.5 font-bold ${
 isSelected
 ? 'bg-phosphor/30 text-phosphor border border-phosphor/60'
 : 'bg-theme-panel hover:bg-theme-panel text-phosphor/80 border border-phosphor/20 terminal-border'
 }`}
 >
 {isSelected ? <Check className="w-3 h-3 text-phosphor" /> : <Plus className="w-3 h-3 text-phosphor/50" />}
 <span>{isSelected ? 'ACTIVE' : 'SELECT'}</span>
 </button>

 {isSelected && (
 <div className="flex items-center gap-1 text-[10px] font-mono">
 <span className="text-phosphor/50">Power:</span>
 {[
 { label: 'LO', val: 0.4 },
 { label: 'MED', val: 0.8 },
 { label: 'HI', val: 1.0 },
 ].map((lvl) => (
 <button
 key={lvl.label}
 type="button"
 onClick={() => handleSetOperatorIntensity(op.id, lvl.val)}
 className={`px-1.5 py-0.5 transition-colors ${
 intensity === lvl.val
 ? 'bg-phosphor/40 text-phosphor border border-phosphor font-bold'
 : 'bg-theme-panel text-phosphor/50 hover:text-phosphor/80'
 }`}
 >
 {lvl.label}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================= */}
 {/* TAB 3: LATENT FAUNA */}
 {/* ========================================= */}
 {activeMainTab === 'fauna' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2 space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-semantic-red font-bold uppercase tracking-wider">
 Latent Fauna &bull; 16 Research-Inspired Interpretive Ontologies
 </span>
 <span className="text-[11px] text-semantic-red">
 {selectedAttractors.length} Active in Curated Set
 </span>
 </div>
 <p className="text-[11px] text-phosphor/80">
 These are NOT fictional personas. They are structured conceptual lenses altering relationships, categorization, causality, and material assumptions.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {filteredFauna.map((fauna) => {
 const selectedObj = selectedAttractors.find((a) => (typeof a === 'string' ? a : a.id) === fauna.id);
 const isSelected = Boolean(selectedObj);
 const weight = typeof selectedObj === 'object' && selectedObj.weight ? selectedObj.weight : 1.0;

 return (
 <div
 key={fauna.id}
 className={`p-3.5 border transition-all flex flex-col justify-between ${
 isSelected
 ? 'bg-semantic-red/10 border-semantic-red/30 terminal-border shadow-md'
 : 'bg-theme-panel/40 border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <h4 className="text-xs font-bold font-mono text-phosphor flex items-center gap-1.5">
 <span className="text-semantic-red">&bull;</span>
 <span>{fauna.name}</span>
 </h4>
 <span className="text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider bg-theme-panel text-phosphor/80 border terminal-border">
 {fauna.category}
 </span>
 </div>

 <p className="text-[11px] font-mono text-phosphor/80 mb-2 leading-relaxed">
 {fauna.description}
 </p>

 {/* Literalization warning */}
 <div className="bg-theme-bg p-2 border border-semantic-red/30 terminal-border text-[10px] font-mono text-semantic-red/90 mb-2 flex items-start gap-1.5">
 <AlertTriangle className="w-3.5 h-3.5 text-semantic-red shrink-0 mt-0.5" />
 <span>{fauna.literalizationWarning}</span>
 </div>

 <div className="text-[10px] font-mono text-phosphor/50 mb-2">
 Destabilizes: {fauna.destabilizes.slice(0, 3).join(', ')}
 </div>
 </div>

 {/* Controls: Toggle + Weight slider */}
 <div className="pt-2 border-t terminal-border flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={() => handleToggleFauna(fauna.id)}
 className={`px-3 py-1 text-xs font-mono transition-colors flex items-center gap-1.5 font-bold ${
 isSelected
 ? 'bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border'
 : 'bg-theme-panel hover:bg-theme-panel text-phosphor/80 border border-phosphor/20 terminal-border'
 }`}
 >
 {isSelected ? <Check className="w-3 h-3 text-semantic-red" /> : <Plus className="w-3 h-3 text-phosphor/50" />}
 <span>{isSelected ? 'LOCKED IN' : 'ENGAGE'}</span>
 </button>

 {isSelected && (
 <div className="flex items-center gap-1.5 text-[10px] font-mono">
 <span className="text-phosphor/50">Weight:</span>
 {[0.5, 0.8, 1.0].map((w) => (
 <button
 key={w}
 type="button"
 onClick={() => handleSetFaunaWeight(fauna.id, w)}
 className={`px-1.5 py-0.5 transition-colors ${
 weight === w
 ? 'bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border font-bold'
 : 'bg-theme-panel text-phosphor/50 hover:text-phosphor/80'
 }`}
 >
 {Math.round(w * 100)}%
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================= */}
 {/* TAB 4: PRESSURES */}
 {/* ========================================= */}
 {activeMainTab === 'pressures' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2">
 <span className="text-phosphor font-bold uppercase tracking-wider">
 5 Creative Pressures &bull; Optimization Vectors
 </span>
 <p className="text-[11px] text-phosphor/80 mt-0.5">
 Govern how the quality-diversity selector and recipe compiler balance identity protection, radical novelty, and target syntax fidelity.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
 {CREATIVE_PRESSURES.map((p) => {
 const isSelected = selectedPressures.includes(p.id);
 return (
 <div
 key={p.id}
 onClick={() => handleTogglePressure(p.id)}
 className={`p-4 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
 isSelected
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border shadow-md'
 : 'bg-theme-panel/40 border-phosphor/20 terminal-border hover:border-phosphor/20 terminal-border'
 }`}
 >
 <div className="space-y-1.5 flex-1">
 <div className="flex items-center gap-2">
 <div
 className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
 isSelected
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border'
 : 'border-phosphor/30 terminal-border bg-theme-panel'
 }`}
 >
 {isSelected && <Check className="w-2.5 h-2.5 text-phosphor/80 stroke-[3]" />}
 </div>
 <h4 className="text-xs font-bold font-mono text-phosphor">{p.name}</h4>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {p.description}
 </p>
 <div className="text-[10px] font-mono text-phosphor/90 italic pt-1">
 &bull; Directive: "{p.directive}"
 </div>
 </div>

 <span
 className={`text-[10px] font-mono px-2 py-0.5 shrink-0 ${
 isSelected
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border font-bold'
 : 'bg-theme-panel text-phosphor/50'
 }`}
 >
 {isSelected ? 'ACTIVE' : 'OFF'}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================= */}
 {/* TAB: SLOP METHODS, SPECIMENS & PROTOCOLS */}
 {/* ========================================= */}
 {activeMainTab === 'methods' && (
 <SlopMethodsTab
 currentConcept={currentConcept}
 onApplyConcept={onApplyConcept}
 entropyLevel={entropyLevel}
 />
 )}

 {/* ========================================= */}
 {/* TAB 5: EXTINCT DORMANT BRANCHES */}
 {/* ========================================= */}
 {activeMainTab === 'branches' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2">
 <span className="text-phosphor font-bold uppercase tracking-wider">
 Extinct Evolutionary Branches &bull; Diversity Archive
 </span>
 <p className="text-[11px] text-phosphor/80 mt-0.5">
 High-novelty sibling mutations that lost immediate selection but survive as genetic donor material for crossbreeding.
 </p>
 </div>

 {dormantBranches.length === 0 ? (
 <div className="py-12 text-center text-xs font-mono text-phosphor/50">
 No extinct branches archived yet. Run multi-candidate mutations at Entropy S5-10 to populate.
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
 {dormantBranches.map((branch) => (
 <div
 key={branch.candidateId}
 className="p-3.5 border border-phosphor/30 terminal-border bg-phosphor/10 flex flex-col justify-between space-y-2"
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-1">
 <span className="text-xs font-bold font-mono text-phosphor">
 Gen #{branch.generationNumber} Branch ({branch.niches.join(', ')})
 </span>
 <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 {branch.fitnessHighlights}
 </span>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 line-clamp-2 italic">
 "{branch.renderedPromptExcerpt}"
 </p>
 <div className="text-[10px] font-mono text-phosphor/50 mt-1">
 Operators: {branch.operators.join(', ')} &bull; Fauna: {branch.attractors.join(', ')}
 </div>
 </div>

 {onCrossbreedBranch && (
 <div className="pt-2 border-t border-phosphor/30 terminal-border flex justify-end">
 <button
 type="button"
 onClick={() => {
 const virtualParent = dormantBranchToParentGeneration(branch);
 onCrossbreedBranch(virtualParent, virtualParent);
 onClose();
 }}
 className="px-2.5 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border text-xs font-mono flex items-center gap-1"
 >
 <GitBranch className="w-3.5 h-3.5 text-phosphor" />
 <span>Infect Lineage (Crossbreed)</span>
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>

 {/* Collapsible Live Recipe Preview (Job 7) */}
 {previewRecipe && (
 <div className="border-t terminal-border bg-theme-panel">
 <button
 type="button"
 onClick={() => setShowRecipePreview(!showRecipePreview)}
 className="w-full px-5 py-2 flex items-center justify-between text-xs font-mono text-phosphor/80 hover:text-phosphor"
 >
 <div className="flex items-center gap-2">
 <Cpu className="w-3.5 h-3.5 text-phosphor" />
 <span className="font-bold uppercase tracking-wider text-phosphor/80">
 Compiled Recipe Preview:
 </span>
 <span className="text-[11px] text-phosphor/50 truncate max-w-xl">
 {describeMutationRecipe(previewRecipe)}
 </span>
 </div>
 <div className="flex items-center gap-1 text-[11px]">
 <span>{showRecipePreview ? 'Hide Details' : 'Expand Details'}</span>
 {showRecipePreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
 </div>
 </button>

 {showRecipePreview && (
 <div className="px-5 py-2.5 border-t terminal-border text-[11px] font-mono text-phosphor/80 space-y-1 bg-theme-bg">
 <div>
 <strong className="text-phosphor/80">Operators ({previewRecipe.operators.length}):</strong>{' '}
 {previewRecipe.operators.map((o) => o.id).join(', ')}
 </div>
 <div>
 <strong className="text-phosphor/80">Attractors ({previewRecipe.attractors?.length || 0}):</strong>{' '}
 {(previewRecipe.attractors || []).map((a) => a.id).join(', ') || 'None'}
 </div>
 <div>
 <strong className="text-phosphor/80">Entropy Gate:</strong> S{previewRecipe.entropyLevel} &bull;{' '}
 <strong className="text-phosphor/80">Semantic Hops:</strong> {previewRecipe.semanticNeighborHops} &bull;{' '}
 <strong className="text-phosphor/80">Preserved Anchors:</strong>{' '}
 {previewRecipe.preservedAnchors?.join(', ') || 'None'}
 </div>
 </div>
 )}
 </div>
 )}

 {/* Modal Footer: Active Mutation Strip & Action Buttons */}
 <div className="px-5 py-3 border-t terminal-border bg-theme-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
 {/* Active Summary Strip (Job 7) */}
 <div className="flex items-center gap-2 flex-wrap flex-1 overflow-x-auto text-[11px]">
 <span className="text-phosphor/50 font-bold uppercase">Active Strip:</span>
 {selectedSeeds.length > 0 && (
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 {selectedSeeds.length} DNA Seeds
 </span>
 )}
 {selectedOps.length > 0 && (
 <span className="px-2 py-0.5 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {selectedOps.length} Operators
 </span>
 )}
 {selectedAttractors.length > 0 && (
 <span className="px-2 py-0.5 bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border">
 {selectedAttractors.length} Fauna
 </span>
 )}
 {selectedPressures.length > 0 && (
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 {selectedPressures.length} Pressures
 </span>
 )}
 {selectedSeeds.length === 0 && selectedOps.length === 0 && selectedAttractors.length === 0 && selectedPressures.length === 0 && (
 <span className="text-phosphor/50 italic">No manual overrides active (Auto mode dynamically selects)</span>
 )}
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <button
 type="button"
 onClick={handleClearAll}
 className="px-3 py-1.5 bg-theme-panel hover:bg-phosphor/10 text-phosphor/80 hover:text-semantic-red text-xs font-mono transition-colors"
 >
 Reset All
 </button>
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-1.5 bg-gradient-to-r from-phosphor/10 to-orange-500 hover:from-phosphor/10 hover:to-orange-400 text-phosphor/80 font-bold text-xs font-mono transition-all shadow-md"
 >
 Apply To Generator
 </button>
 </div>
 </div>

 </div>
 </div>
 );
};
