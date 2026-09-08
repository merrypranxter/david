import React, { useState, useEffect } from 'react';
import {
 X,
 FlaskConical,
 Dna,
 History,
 Bookmark,
 Sparkles,
 AlertTriangle,
 CheckCircle2,
 GitFork,
 ArrowRight,
 ShieldCheck,
 Eye,
 Sliders,
 Filter,
 Trash2,
 ThumbsUp,
 Tag,
 Lightbulb,
} from 'lucide-react';
import {
 EmpiricalRunRecord,
 ObservedOutcomeType,
 UserFeedbackJudgment,
 USER_FEEDBACK_OPTIONS,
 ALL_OBSERVED_OUTCOMES,
 QualitativeRating,
 ArtifactAction,
 DEFAULT_ARTIFACT_FAMILIES,
} from '../types/empiricalLearning';
import {
 loadAllRuns,
 getRun,
 updateRunRecord,
 recordUserFeedback,
 recordQualitativeRatings,
 toggleRunOutcome,
 addPreservedArtifact,
 markExcludeFromLearning,
 getModelProfileEvidence,
 saveModelOverride,
 generateExperimentRecommendations,
 recordAblation,
} from '../utils/empiricalLearningEngine';

interface ExperimentMemoryModalProps {
 isOpen: boolean;
 onClose: () => void;
 activeRunId?: string | null;
 initialRunId?: string | null;
 onApplyPromptToInput?: (prompt: string) => void;
 onSelectRun?: (run: EmpiricalRunRecord) => void;
 onApplyRecipeToPlanner?: (operators: string[], modelId?: string) => void;
}

export const ExperimentMemoryModal: React.FC<ExperimentMemoryModalProps> = ({
 isOpen,
 onClose,
 activeRunId,
 initialRunId,
 onApplyPromptToInput,
 onSelectRun,
 onApplyRecipeToPlanner,
}) => {
 const effectiveInitialRunId = initialRunId || activeRunId || null;
 const [runs, setRuns] = useState<Record<string, EmpiricalRunRecord>>({});
 const [selectedRunId, setSelectedRunId] = useState<string | null>(effectiveInitialRunId);
 const [activeTab, setActiveTab] = useState<'runs' | 'evidence' | 'artifacts' | 'recommendations'>('runs');
 const [modelFilter, setModelFilter] = useState<string>('all');
 const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
 const [newArtifactName, setNewArtifactName] = useState('');
 const [newArtifactAction, setNewArtifactAction] = useState<ArtifactAction>('PRESERVE');
 const [selectedModelIdForEvidence, setSelectedModelIdForEvidence] = useState<string>('openart_banana');

 // Refresh runs whenever modal opens or activeRunId changes
 useEffect(() => {
 if (isOpen) {
 const all = loadAllRuns();
 setRuns(all);
 if (activeRunId && all[activeRunId]) {
 setSelectedRunId(activeRunId);
 } else if (!selectedRunId || !all[selectedRunId]) {
 const keys = Object.keys(all);
 if (keys.length > 0) {
 setSelectedRunId(keys[keys.length - 1]);
 }
 }
 }
 }, [isOpen, activeRunId]);

 if (!isOpen) return null;

 const runList = Object.values(runs).sort(
 (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
 );

 const filteredRuns = runList.filter((r) => {
 if (modelFilter !== 'all' && r.model !== modelFilter) return false;
 if (outcomeFilter !== 'all' && !r.outcomes.includes(outcomeFilter as ObservedOutcomeType)) return false;
 return true;
 });

 const currentRun = selectedRunId ? runs[selectedRunId] : filteredRuns[0] || null;

 const handleFeedback = (judgment: UserFeedbackJudgment) => {
 if (!currentRun) return;
 const updated = recordUserFeedback(currentRun.runId, judgment);
 if (updated) {
 setRuns((prev) => ({ ...prev, [updated.runId]: updated }));
 }
 };

 const handleRatingChange = (type: 'creative' | 'mechanism', value: QualitativeRating) => {
 if (!currentRun) return;
 const creative = type === 'creative' ? value : currentRun.creativeUtility;
 const mechanism = type === 'mechanism' ? value : currentRun.mechanismConfidence;
 const updated = recordQualitativeRatings(currentRun.runId, creative, mechanism);
 if (updated) {
 setRuns((prev) => ({ ...prev, [updated.runId]: updated }));
 }
 };

 const handleToggleOutcome = (outcome: ObservedOutcomeType) => {
 if (!currentRun) return;
 const updated = toggleRunOutcome(currentRun.runId, outcome);
 if (updated) {
 setRuns((prev) => ({ ...prev, [updated.runId]: updated }));
 }
 };

 const handleToggleExclude = () => {
 if (!currentRun) return;
 const updated = markExcludeFromLearning(currentRun.runId, !currentRun.excludeFromLearning);
 if (updated) {
 setRuns((prev) => ({ ...prev, [updated.runId]: updated }));
 }
 };

 const handleAddArtifact = (e: React.FormEvent) => {
 e.preventDefault();
 if (!currentRun || !newArtifactName.trim()) return;
 addPreservedArtifact(currentRun.runId, {
 name: newArtifactName.trim(),
 action: newArtifactAction,
 });
 setNewArtifactName('');
 const reloaded = loadAllRuns();
 setRuns(reloaded);
 };

 const modelEvidence = getModelProfileEvidence(selectedModelIdForEvidence);
 const recommendations = generateExperimentRecommendations(currentRun?.runId, currentRun?.model);

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
 <div className="bg-theme-panel border terminal-border w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
 {/* Header Bar */}
 <div className="px-5 py-3.5 border-b terminal-border flex items-center justify-between bg-theme-panel">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-phosphor/10 border border-phosphor/30 terminal-border flex items-center justify-center text-phosphor shadow-inner">
 <FlaskConical className="w-4 h-4" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-sm tracking-wider uppercase text-phosphor">
 Experiment Memory & Empirical Learning
 </span>
 <span className="text-[10px] px-2 py-0.5 bg-theme-panel text-phosphor border border-phosphor/30 terminal-border">
 {runList.length} Runs Logged
 </span>
 </div>
 <p className="text-[11px] text-phosphor/80">
 Separating Creative Utility from Mechanism Confidence &bull; Empirical Observation Layer
 </p>
 </div>
 </div>

 {/* Tab Navigation */}
 <div className="flex items-center gap-1.5 bg-theme-panel p-1 border terminal-border">
 <button
 type="button"
 onClick={() => setActiveTab('runs')}
 className={`px-3 py-1 text-[11px] transition-colors ${
 activeTab === 'runs'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Runs & Lineage
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('evidence')}
 className={`px-3 py-1 text-[11px] transition-colors ${
 activeTab === 'evidence'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Model Evidence
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('artifacts')}
 className={`px-3 py-1 text-[11px] transition-colors ${
 activeTab === 'artifacts'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Preserved Artifacts
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('recommendations')}
 className={`px-3 py-1 text-[11px] transition-colors ${
 activeTab === 'recommendations'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 Next Experiments
 </button>
 </div>

 <button
 type="button"
 onClick={onClose}
 className="p-1.5 text-phosphor/50 hover:text-phosphor hover:bg-phosphor/10 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Main Body */}
 <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
 {activeTab === 'runs' && (
 <>
 {/* Left Column: Runs List & Filters */}
 <div className="w-full md:w-80 border-r terminal-border flex flex-col bg-theme-panel">
 {/* Filters */}
 <div className="p-3 border-b terminal-border space-y-2">
 <div className="flex items-center justify-between text-[11px] text-phosphor/80">
 <span className="flex items-center gap-1 font-semibold uppercase">
 <Filter className="w-3.5 h-3.5 text-phosphor" />
 Filter Runs
 </span>
 <span className="text-[10px] text-phosphor/50">{filteredRuns.length} shown</span>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <select
 value={modelFilter}
 onChange={(e) => setModelFilter(e.target.value)}
 className="bg-theme-panel border terminal-border px-2 py-1 text-[11px] text-phosphor/80"
 >
 <option value="all">All Models</option>
 {Array.from(new Set(runList.map((r) => r.model))).map((m) => (
 <option key={m} value={m}>
 {m}
 </option>
 ))}
 </select>

 <select
 value={outcomeFilter}
 onChange={(e) => setOutcomeFilter(e.target.value)}
 className="bg-theme-panel border terminal-border px-2 py-1 text-[11px] text-phosphor/80"
 >
 <option value="all">All Outcomes</option>
 <option value="interesting_accident">Interesting Accident</option>
 <option value="success">Clean Success</option>
 <option value="seed_erased">Seed Erased</option>
 <option value="cliche_collapse">Cliché Collapse</option>
 <option value="catastrophic_collapse">Collapse</option>
 </select>
 </div>
 </div>

 {/* Runs Scroll List */}
 <div className="flex-1 overflow-y-auto divide-y divide-phosphor/20">
 {filteredRuns.length === 0 ? (
 <div className="p-6 text-center text-phosphor/50 text-xs">
 No matching runs found. Generate a prompt to record the first experiment.
 </div>
 ) : (
 filteredRuns.map((r) => {
 const isSelected = r.runId === currentRun?.runId;
 const hasAccident = r.outcomes.includes('interesting_accident');
 const hasPreserved = r.preservedArtifacts && r.preservedArtifacts.length > 0;
 return (
 <button
 key={r.runId}
 type="button"
 onClick={() => setSelectedRunId(r.runId)}
 className={`w-full text-left p-3 transition-colors flex flex-col gap-1.5 ${
 isSelected
 ? 'bg-phosphor/10 border-l-2 border-phosphor/30 terminal-border'
 : 'hover:bg-theme-panel/60'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-bold text-[11px] text-phosphor truncate max-w-[140px]">
 {r.runId}
 </span>
 <span className="text-[10px] text-phosphor/50">
 {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>

 <div className="text-[11px] text-phosphor/80 line-clamp-1 italic">
 &ldquo;{r.sourcePrompt}&rdquo;
 </div>

 <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
 <span className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80">
 {r.model}
 </span>
 {r.iterationDepth > 0 && (
 <span className="px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Depth {r.iterationDepth}
 </span>
 )}
 {hasAccident && (
 <span className="px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Accident
 </span>
 )}
 {hasPreserved && (
 <span className="px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Preserved
 </span>
 )}
 {r.excludeFromLearning && (
 <span className="px-1.5 py-0.5 bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border">
 Excluded
 </span>
 )}
 </div>
 </button>
 );
 })
 )}
 </div>
 </div>

 {/* Right Column: Run Detail & Evaluation */}
 <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-theme-panel">
 {currentRun ? (
 <>
 {/* Top Run Metadata Bar */}
 <div className="p-4 bg-theme-panel border terminal-border space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-bold text-phosphor text-sm">{currentRun.runId}</span>
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border text-[10px] uppercase font-bold">
 {currentRun.targetMedium} &bull; {currentRun.model}
 </span>
 {currentRun.isAblation && (
 <span className="px-2 py-0.5 bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border text-[10px] font-bold">
 Ablation of {currentRun.ablationOfRunId}
 </span>
 )}
 {currentRun.parentRunId && (
 <span className="flex items-center gap-1 text-[10px] text-phosphor/80">
 <GitFork className="w-3 h-3 text-phosphor" />
 Child of {currentRun.parentRunId} (Depth {currentRun.iterationDepth})
 </span>
 )}
 </div>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={handleToggleExclude}
 className={`px-2.5 py-1 text-[11px] font-bold transition-colors border ${
 currentRun.excludeFromLearning
 ? 'bg-semantic-red/10 text-semantic-red border-semantic-red/30 terminal-border'
 : 'bg-theme-panel text-phosphor/80 hover:text-phosphor border-phosphor/20 terminal-border'
 }`}
 title="Exclude from empirical profile training"
 >
 {currentRun.excludeFromLearning ? 'Excluded from Learning' : 'Exclude from Learning'}
 </button>
 </div>
 </div>

 {/* Source Prompt */}
 <div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-phosphor/50">
 Source Seed Intent
 </span>
 <p className="text-phosphor text-xs mt-0.5 bg-black/40 p-2.5 border terminal-border">
 {currentRun.sourcePrompt}
 </p>
 </div>

 {/* Content DNA Snapshot Strip */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
 <div className="p-2 bg-black/30 border terminal-border">
 <span className="text-phosphor/50 block text-[10px] uppercase">Locked Anchors</span>
 <span className="text-phosphor font-bold">
 {currentRun.lockedAnchors.join(', ') || 'None locked'}
 </span>
 </div>
 <div className="p-2 bg-black/30 border terminal-border">
 <span className="text-phosphor/50 block text-[10px] uppercase">Active Operators</span>
 <span className="text-phosphor font-bold">
 {currentRun.activeOperators.join(', ') || 'None'}
 </span>
 </div>
 <div className="p-2 bg-black/30 border terminal-border">
 <span className="text-phosphor/50 block text-[10px] uppercase">Attractors</span>
 <span className="text-phosphor font-bold">
 {currentRun.activeAttractors.join(', ') || 'Neutral'}
 </span>
 </div>
 </div>
 </div>

 {/* Section 4 & 5: Rigorous Evaluation & Feedback */}
 <div className="p-4 bg-theme-panel border terminal-border space-y-4">
 <div className="flex items-center justify-between">
 <span className="font-bold text-phosphor text-xs uppercase flex items-center gap-1.5">
 <ThumbsUp className="w-3.5 h-3.5 text-phosphor" />
 First-Class User Feedback & Qualitative Scales
 </span>
 <span className="text-[10px] text-phosphor/50">
 Creative Utility &ne; Mechanism Confidence
 </span>
 </div>

 {/* User Feedback Buttons */}
 <div className="space-y-1.5">
 <span className="text-[10px] text-phosphor/80 uppercase font-bold">Feedback Verdict:</span>
 <div className="flex flex-wrap gap-1.5">
 {USER_FEEDBACK_OPTIONS.map((opt) => {
 const active = currentRun.userFeedback === opt;
 return (
 <button
 key={opt}
 type="button"
 onClick={() => handleFeedback(opt)}
 className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors border ${
 active
 ? 'bg-phosphor/10 text-phosphor border-phosphor/30 terminal-border shadow-md'
 : 'bg-theme-panel/80 hover:bg-theme-panel text-phosphor/80 border-phosphor/20 terminal-border/60'
 }`}
 >
 {opt}
 </button>
 );
 })}
 </div>
 </div>

 {/* Dual Qualitative Scales: Creative Utility vs Mechanism Confidence */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t terminal-border">
 {/* Creative Utility */}
 <div className="space-y-2">
 <div>
 <span className="text-xs font-bold text-phosphor uppercase block">
 1. Creative Utility
 </span>
 <span className="text-[10px] text-phosphor/50">
 Did this result produce something compelling, weird, beautiful, or useful?
 </span>
 </div>
 <div className="flex gap-1">
 {(['UNKNOWN', 'LOW', 'MEDIUM', 'HIGH'] as QualitativeRating[]).map((r) => (
 <button
 key={r}
 type="button"
 onClick={() => handleRatingChange('creative', r)}
 className={`flex-1 py-1 text-[10px] font-bold border transition-colors ${
 currentRun.creativeUtility === r
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border text-phosphor'
 : 'bg-theme-panel/60 border-phosphor/20 terminal-border text-phosphor/80 hover:text-phosphor'
 }`}
 >
 {r}
 </button>
 ))}
 </div>
 </div>

 {/* Mechanism Confidence */}
 <div className="space-y-2">
 <div>
 <span className="text-xs font-bold text-phosphor uppercase block">
 2. Mechanism Confidence
 </span>
 <span className="text-[10px] text-phosphor/50">
 How confident are we that the assigned operator/recipe actually caused it?
 </span>
 </div>
 <div className="flex gap-1">
 {(['UNKNOWN', 'LOW', 'MEDIUM', 'HIGH'] as QualitativeRating[]).map((r) => (
 <button
 key={r}
 type="button"
 onClick={() => handleRatingChange('mechanism', r)}
 className={`flex-1 py-1 text-[10px] font-bold border transition-colors ${
 currentRun.mechanismConfidence === r
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border text-phosphor'
 : 'bg-theme-panel/60 border-phosphor/20 terminal-border text-phosphor/80 hover:text-phosphor'
 }`}
 >
 {r}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Section 2: Observable Outcomes (Multi-tagger) */}
 <div className="p-4 bg-theme-panel border terminal-border space-y-2.5">
 <span className="font-bold text-phosphor text-xs uppercase flex items-center gap-1.5">
 <Eye className="w-3.5 h-3.5 text-phosphor" />
 Observed Phenomenon Outcomes (Multiple Allowed)
 </span>
 <p className="text-[10px] text-phosphor/50">
 Tag empirical outcomes observed in the generated result:
 </p>

 <div className="flex flex-wrap gap-1.5">
 {ALL_OBSERVED_OUTCOMES.map((out) => {
 const active = currentRun.outcomes.includes(out);
 return (
 <button
 key={out}
 type="button"
 onClick={() => handleToggleOutcome(out)}
 className={`px-2 py-0.5 text-[10px] transition-colors border ${
 active
 ? 'bg-phosphor/10 border-phosphor/30 terminal-border text-phosphor font-bold'
 : 'bg-theme-panel/60 border-phosphor/20 terminal-border/60 text-phosphor/80 hover:text-phosphor'
 }`}
 >
 {out.replace(/_/g, ' ')}
 </button>
 );
 })}
 </div>
 </div>

 {/* Section 3: Preserved Artifacts */}
 <div className="p-4 bg-theme-panel border terminal-border space-y-3">
 <div className="flex items-center justify-between">
 <span className="font-bold text-phosphor text-xs uppercase flex items-center gap-1.5">
 <Bookmark className="w-3.5 h-3.5 text-phosphor" />
 Preserved Accidental Artifacts
 </span>
 <span className="text-[10px] text-phosphor/50">
 Accidents are seeds for future repeatable techniques
 </span>
 </div>

 {/* Artifact Form */}
 <form onSubmit={handleAddArtifact} className="flex gap-2">
 <input
 type="text"
 value={newArtifactName}
 onChange={(e) => setNewArtifactName(e.target.value)}
 placeholder="e.g. connective tissue webbing, screen-space pinning, metallic weld scar..."
 className="flex-1 bg-black/40 border terminal-border px-3 py-1.5 text-xs text-phosphor placeholder-phosphor/50"
 />
 <select
 value={newArtifactAction}
 onChange={(e) => setNewArtifactAction(e.target.value as ArtifactAction)}
 className="bg-theme-panel border terminal-border px-2 text-xs text-phosphor font-bold"
 >
 <option value="PRESERVE">PRESERVE</option>
 <option value="AMPLIFY">AMPLIFY</option>
 <option value="IGNORE">IGNORE</option>
 <option value="AVOID">AVOID</option>
 </select>
 <button
 type="submit"
 className="px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor font-bold text-xs transition-colors"
 >
 Save Artifact
 </button>
 </form>

 {/* Existing Artifacts */}
 {currentRun.preservedArtifacts && currentRun.preservedArtifacts.length > 0 ? (
 <div className="space-y-1.5 pt-1">
 {currentRun.preservedArtifacts.map((art) => (
 <div
 key={art.id}
 className="flex items-center justify-between p-2 bg-black/30 border terminal-border"
 >
 <div className="flex items-center gap-2">
 <span
 className={`px-1.5 py-0.5 text-[9px] font-bold ${
 art.action === 'PRESERVE' || art.action === 'AMPLIFY'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : 'bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border'
 }`}
 >
 {art.action}
 </span>
 <span className="text-phosphor font-semibold">{art.name}</span>
 </div>
 <span className="text-[10px] text-phosphor/50">
 Observed in {art.observedInModel}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-phosphor/50 text-[11px] italic">
 No specific artifacts cataloged for this run yet.
 </p>
 )}
 </div>

 {/* Prompts Inspection */}
 {currentRun.slopPrompt && (
 <div className="p-4 bg-black/40 border terminal-border space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase text-phosphor">
 Generated Prompt Output
 </span>
 {onApplyPromptToInput && (
 <button
 type="button"
 onClick={() => onApplyPromptToInput(currentRun.slopPrompt!)}
 className="text-[10px] text-phosphor hover:underline"
 >
 Load Prompt into Input
 </button>
 )}
 </div>
 <pre className="specimen-chamber terminal-border p-3 text-phosphor/80 text-[11px] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border">
 {currentRun.slopPrompt}
 </pre>
 </div>
 )}
 </>
 ) : (
 <div className="text-center py-20 text-phosphor/50">Select a run on the left to view details.</div>
 )}
 </div>
 </>
 )}

 {/* TAB 2: MODEL EVIDENCE VIEW (Section 19) */}
 {activeTab === 'evidence' && (
 <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-theme-panel">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b terminal-border pb-4">
 <div>
 <h3 className="text-sm font-bold text-phosphor uppercase tracking-wider flex items-center gap-2">
 <ShieldCheck className="w-4 h-4 text-phosphor" />
 Model Behavioral Profile Evidence View
 </h3>
 <p className="text-xs text-phosphor/80">
 Distinguishing ASSUMED priors from EMPIRICALLY OBSERVED behaviors &bull; Grounded in run counts
 </p>
 </div>

 <div className="flex items-center gap-2">
 <span className="text-phosphor/80 text-xs">Model:</span>
 <select
 value={selectedModelIdForEvidence}
 onChange={(e) => setSelectedModelIdForEvidence(e.target.value)}
 className="bg-theme-panel border terminal-border px-3 py-1.5 text-xs text-phosphor font-bold"
 >
 <option value="openart_banana">OpenArt Banana</option>
 <option value="openart_seadream">OpenArt SeaDream</option>
 <option value="midjourney_flux">Midjourney Flux</option>
 <option value="suno_v4">Suno v4</option>
 <option value="kling_v1">Kling v1</option>
 <option value="gemini_flash">Gemini 3.8 Flash</option>
 </select>
 </div>
 </div>

 {/* Model Evidence Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Object.values(modelEvidence.dimensions).map((dim) => (
 <div key={dim.dimension} className="p-4 bg-theme-panel border terminal-border space-y-2">
 <div className="flex items-center justify-between">
 <span className="font-bold text-phosphor text-xs">{dim.dimension}</span>
 <span
 className={`px-2 py-0.5 text-[10px] font-bold ${
 dim.evidenceTier === 'HIGH CONFIDENCE' || dim.evidenceTier === 'REPEATED'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : dim.evidenceTier === 'OBSERVED'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : dim.evidenceTier === 'ANECDOTAL'
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : 'bg-theme-panel text-phosphor/80 border border-phosphor/20 terminal-border'
 }`}
 >
 {dim.evidenceTier} ({dim.relevantRunCount} runs)
 </span>
 </div>

 <div className="space-y-1 text-xs">
 <div className="flex justify-between text-phosphor/80 text-[11px]">
 <span>Assumed Prior:</span>
 <span className="text-phosphor/80">{dim.currentAssumed}</span>
 </div>
 <div className="flex justify-between text-phosphor/80 text-[11px]">
 <span>Empirical Verdict:</span>
 <span className="text-phosphor font-bold">{dim.empiricallyObserved}</span>
 </div>
 </div>

 <p className="text-[10px] text-phosphor/50 border-t terminal-border pt-1.5 italic">
 {dim.notes}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* TAB 3: PRESERVED ARTIFACTS & FAMILIES (Section 14) */}
 {activeTab === 'artifacts' && (
 <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-theme-panel">
 <div>
 <h3 className="text-sm font-bold text-phosphor uppercase tracking-wider flex items-center gap-2">
 <Bookmark className="w-4 h-4 text-phosphor" />
 Artifact Families & Preserved Anomalies
 </h3>
 <p className="text-xs text-phosphor/80">
 Accidental model discoveries preserved for repeatable creative exploitation
 </p>
 </div>

 {/* Artifact Families Archetypes */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {DEFAULT_ARTIFACT_FAMILIES.map((fam) => (
 <div key={fam.id} className="p-4 bg-theme-panel border terminal-border space-y-3">
 <div className="flex items-center justify-between">
 <span className="font-bold text-phosphor text-sm">{fam.name}</span>
 <span className="px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border text-[10px] font-bold">
 {fam.confidence}
 </span>
 </div>
 <p className="text-xs text-phosphor/80 leading-relaxed">{fam.description}</p>
 <div className="space-y-1 text-[11px] text-phosphor/80">
 <div>
 <span className="text-phosphor/50 uppercase text-[10px]">Associated Operators: </span>
 <span className="text-phosphor font-bold">{fam.associatedOperators.join(', ')}</span>
 </div>
 <div>
 <span className="text-phosphor/50 uppercase text-[10px]">Observed In: </span>
 <span className="text-phosphor/80">{fam.modelsObserved.join(', ')}</span>
 </div>
 </div>
 <div className="p-2 bg-black/40 border terminal-border text-[10px] text-phosphor">
 <span className="font-bold block">Amplification Directive:</span>
 {fam.amplificationMethods.join('; ')}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* TAB 4: RECOMMENDATIONS (Section 20) */}
 {activeTab === 'recommendations' && (
 <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-theme-panel">
 <div>
 <h3 className="text-sm font-bold text-phosphor uppercase tracking-wider flex items-center gap-2">
 <Lightbulb className="w-4 h-4 text-phosphor" />
 Grounded Experiment Recommendations
 </h3>
 <p className="text-xs text-phosphor/80">
 Scientifically motivated suggestions derived from recorded empirical runs
 </p>
 </div>

 <div className="space-y-3">
 {recommendations.length > 0 ? (
 recommendations.map((rec) => (
 <div
 key={rec.id}
 className="p-4 bg-theme-panel border terminal-border hover:border-phosphor/30 terminal-border transition-colors flex items-start justify-between gap-4"
 >
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <span className="font-bold text-phosphor text-sm">{rec.title}</span>
 <span className="px-2 py-0.5 bg-theme-panel text-phosphor/80 text-[10px] uppercase font-bold">
 {rec.type.replace(/_/g, ' ')}
 </span>
 </div>
 <p className="text-xs text-phosphor/80 leading-relaxed">{rec.reason}</p>
 <span className="text-[10px] text-phosphor/50 block italic">
 {rec.evidenceSource}
 </span>
 </div>

 {rec.suggestedAction.operators && onApplyRecipeToPlanner && (
 <button
 type="button"
 onClick={() => onApplyRecipeToPlanner(rec.suggestedAction.operators!, currentRun?.model)}
 className="px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
 >
 <span>Apply Recipe</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 ))
 ) : (
 <div className="text-center py-16 text-phosphor/50">
 Run more experiments to unlock grounded hypothesis recommendations.
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};
