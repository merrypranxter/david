/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Serialization Diagnostics & Machine-String Preview Panel
 * 
 * CORE CONTRACT:
 * - Displays Human Canonical Input alongside Mutated Serialized Input.
 * - Shows escaped representation (e.g. m\u034Fand\u034Fible) to reveal invisible Unicode boundary marks.
 * - Details code point sequences, UTF-8 byte lengths, expansion ratio, and context-risk warnings.
 * - Inspects tokenization parity and multi-encoder states (or marks TOKENIZATION_UNVERIFIED on commercial APIs).
 * - Flags MUTATION_CLAMPED if safety caps were reached without truncating user semantic prompt.
 */

import React, { useState, useMemo } from 'react';
import {
 SerializedMutationResult,
 SerializationPresetId,
 TargetSpanType,
 NormalizationMode,
} from '../types/serialization';
import { SERIALIZATION_PRESETS } from '../utils/serializationPresets';
import {
 executeAsndMutation,
 executeHmcSpsMutation,
 executeDsBfahMutation,
 checkOperatorCompositionCompatibility,
} from '../operators/serializationOperators';
import {
 getBackendTechnicalCapabilities,
} from '../utils/technicalCapabilities';
import {
 inspectMultiEncoderTokenization,
 evaluateTokenizationParity,
} from '../utils/tokenizerInspection';
import {
 Terminal,
 Binary,
 Copy,
 Check,
 ChevronDown,
 ChevronUp,
 AlertTriangle,
 Info,
 Sliders,
 Eye,
 ShieldAlert,
} from 'lucide-react';

interface SerializationDiagnosticsPanelProps {
 currentPrompt: string;
 activeModelId?: string;
 onApplyMutatedPrompt?: (mutated: string) => void;
}

export const SerializationDiagnosticsPanel: React.FC<SerializationDiagnosticsPanelProps> = ({
 currentPrompt,
 activeModelId = 'gemini-3.1-flash-lite',
 onApplyMutatedPrompt,
}) => {
 const [isOpen, setIsOpen] = useState<boolean>(false);
 const [selectedOperator, setSelectedOperator] = useState<'ASND' | 'HMC-SPS' | 'DS-BFAH'>('ASND');
 const [targetSpanType, setTargetSpanType] = useState<TargetSpanType>('entire_prompt');
 const [targetPhrase, setTargetPhrase] = useState<string>('');
 const [normalizationMode, setNormalizationMode] = useState<NormalizationMode>('RAW');

 // Operator specific params
 const [asndDensity, setAsndDensity] = useState<number>(0.35);
 const [asndStrategy, setAsndStrategy] = useState<string>('combining_grapheme_joiner');

 const [hmcRatio, setHmcRatio] = useState<number>(0.30);
 const [hmcScripts, setHmcScripts] = useState<'cyrillic' | 'greek' | 'cyrillic_greek'>('cyrillic_greek');

 const [dsDepth, setDsDepth] = useState<number>(15);
 const [dsPool, setDsPool] = useState<'balanced' | 'high_marks' | 'low_marks' | 'strike_overlay'>('balanced');

 const [copiedEscaped, setCopiedEscaped] = useState<boolean>(false);
 const [copiedRaw, setCopiedRaw] = useState<boolean>(false);

 // Compute active mutation result dynamically based on controls
 const mutationResult: SerializedMutationResult = useMemo(() => {
 const textToMutate = currentPrompt.trim() || 'A hyper-detailed cybernetic arachnid perched on Obsidian glass';
 const spanSelector = {
 type: targetSpanType,
 matchText: targetPhrase.trim() || undefined,
 };

 if (selectedOperator === 'ASND') {
 return executeAsndMutation(textToMutate, spanSelector, {
 mutationDensity: asndDensity,
 boundaryStrategy: asndStrategy,
 normalizationMode,
 seed: 42,
 });
 } else if (selectedOperator === 'HMC-SPS') {
 return executeHmcSpsMutation(textToMutate, spanSelector, {
 substitutionRatio: hmcRatio,
 targetScripts: hmcScripts,
 normalizationMode,
 seed: 42,
 });
 } else {
 return executeDsBfahMutation(textToMutate, spanSelector, {
 stackDepth: dsDepth,
 combiningMarkPool: dsPool,
 normalizationMode,
 seed: 42,
 });
 }
 }, [
 currentPrompt,
 selectedOperator,
 targetSpanType,
 targetPhrase,
 normalizationMode,
 asndDensity,
 asndStrategy,
 hmcRatio,
 hmcScripts,
 dsDepth,
 dsPool,
 ]);

 // Derive backend capabilities & tokenization evaluation
 const backendCaps = useMemo(() => {
 return getBackendTechnicalCapabilities(activeModelId);
 }, [activeModelId]);

 const tokenizationInspection = useMemo(() => {
 return inspectMultiEncoderTokenization(
 mutationResult.serializedExperimentalInput,
 backendCaps
 );
 }, [mutationResult.serializedExperimentalInput, backendCaps]);

 const parityCheck = useMemo(() => {
 return evaluateTokenizationParity(
 mutationResult.canonicalInput,
 mutationResult.serializedExperimentalInput,
 backendCaps
 );
 }, [mutationResult.canonicalInput, mutationResult.serializedExperimentalInput, backendCaps]);

 const copyToClipboard = (text: string, isEscaped: boolean) => {
 navigator.clipboard.writeText(text);
 if (isEscaped) {
 setCopiedEscaped(true);
 setTimeout(() => setCopiedEscaped(false), 2000);
 } else {
 setCopiedRaw(true);
 setTimeout(() => setCopiedRaw(false), 2000);
 }
 };

 const handleApplyPreset = (presetId: SerializationPresetId) => {
 const preset = SERIALIZATION_PRESETS[presetId];
 if (!preset) return;

 if (preset.operatorId.includes('asnd')) {
 setSelectedOperator('ASND');
 if (preset.defaultParameters.boundaryStrategy) {
 setAsndStrategy(preset.defaultParameters.boundaryStrategy);
 }
 if (typeof preset.defaultParameters.mutationDensity === 'number') {
 setAsndDensity(preset.defaultParameters.mutationDensity);
 }
 } else if (preset.operatorId.includes('hmc')) {
 setSelectedOperator('HMC-SPS');
 if (typeof preset.defaultParameters.substitutionRatio === 'number') {
 setHmcRatio(preset.defaultParameters.substitutionRatio);
 }
 if (preset.defaultParameters.targetScripts) {
 setHmcScripts(preset.defaultParameters.targetScripts);
 }
 } else if (preset.operatorId.includes('ds_bfah')) {
 setSelectedOperator('DS-BFAH');
 if (typeof preset.defaultParameters.stackDepth === 'number') {
 setDsDepth(preset.defaultParameters.stackDepth);
 }
 if (preset.defaultParameters.combiningMarkPool) {
 setDsPool(preset.defaultParameters.combiningMarkPool);
 }
 }
 };

 const compositionCheck = useMemo(() => {
 return checkOperatorCompositionCompatibility([selectedOperator]);
 }, [selectedOperator]);

 return (
 <div className="bg-theme-panel border terminal-border text-phosphor text-[10px] font-mono transition-all">
 {/* Header Bar */}
 <div
 onClick={() => setIsOpen(!isOpen)}
 className="px-4 py-2.5 bg-theme-bg flex items-center justify-between cursor-pointer select-none hover:bg-phosphor/10 transition-colors border-b terminal-border "
 >
 <div className="flex items-center gap-2.5">
 <div className="w-6 h-6 bg-phosphor/10 border terminal-border border-phosphor/40 flex items-center justify-center text-phosphor">
 <Binary className="w-3.5 h-3.5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-display tracking-widest font-bold uppercase">
 Tokenizer & Serialization Lab
 </span>
 <span className="text-[9px] px-1.5 py-0.5 bg-phosphor/10 border terminal-border border-phosphor/30 text-phosphor font-display uppercase tracking-widest font-bold">
 JOB 2 ENGINE
 </span>
 {mutationResult.diagnostics.clamped && (
 <span className="text-[9px] px-1.5 py-0.5 bg-semantic-red/10 border terminal-border border-semantic-red/40 text-semantic-red font-display uppercase tracking-widest font-bold animate-pulse">
 MUTATION_CLAMPED
 </span>
 )}
 </div>
 <p className="text-[9px] text-phosphor/60 font-display uppercase tracking-widest mt-1">
 Active Operator: <strong className="text-phosphor">{selectedOperator}</strong> &bull; Bytes: {mutationResult.diagnostics.mutatedByteLength}B ({mutationResult.diagnostics.expansionRatio.toFixed(1)}x) &bull; Code Points: {mutationResult.diagnostics.mutatedCodePoints}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 font-display uppercase tracking-widest font-bold">
 {mutationResult.diagnostics.contextRisk === 'HIGH' && (
 <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 bg-phosphor/10 text-phosphor border terminal-border border-phosphor/30">
 <AlertTriangle className="w-3 h-3" /> Context Risk High
 </span>
 )}
 {mutationResult.diagnostics.contextRisk === 'CONTEXT_LIMIT_EXCEEDED' && (
 <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 bg-semantic-red/10 text-semantic-red border terminal-border border-semantic-red/40">
 <AlertTriangle className="w-3 h-3" /> Context Exceeded
 </span>
 )}
 <button
 type="button"
 className="p-1 text-phosphor/50 hover:text-phosphor transition-colors"
 >
 {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </button>
 </div>
 </div>

 {/* Collapsible Laboratory Body */}
 {isOpen && (
 <div className="p-4 space-y-4">
 {/* Quick Preset Selector */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-[9px] font-display uppercase tracking-widest">
 <span className="font-bold flex items-center gap-1.5">
 <Sliders className="w-3 h-3 text-phosphor" /> Serialization Presets
 </span>
 <span className="text-phosphor/50">Auto-configures dose parameters</span>
 </div>
 <div className="flex flex-wrap gap-1.5">
 {(Object.keys(SERIALIZATION_PRESETS) as SerializationPresetId[]).map((presetId) => {
 const p = SERIALIZATION_PRESETS[presetId];
 return (
 <button
 key={presetId}
 type="button"
 onClick={() => handleApplyPreset(presetId)}
 className="px-2.5 py-1 bg-theme-bg hover:bg-phosphor/10 border terminal-border text-phosphor/80 hover:text-phosphor hover:border-phosphor/50 text-[9px] font-display uppercase tracking-widest transition-all"
 title={p.notes}
 >
 {p.name.replace(' Sweep', '').replace(' Verification', '')}
 </button>
 );
 })}
 </div>
 </div>

 {/* Operator Controls Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-theme-bg border terminal-border ">
 {/* Operator Selection */}
 <div>
 <label className="block text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/60 mb-1">
 Technical Operator
 </label>
 <div className="flex gap-1">
 {(['ASND', 'HMC-SPS', 'DS-BFAH'] as const).map((op) => (
 <button
 key={op}
 type="button"
 onClick={() => setSelectedOperator(op)}
 className={`flex-1 py-1 px-2 text-[9px] font-display uppercase tracking-widest font-bold border terminal-border transition-all ${
 selectedOperator === op
 ? 'bg-phosphor/20 border-phosphor/50 text-phosphor shadow-sm'
 : 'bg-theme-panel border-phosphor/20 text-phosphor/50 hover:text-phosphor'
 }`}
 >
 {op}
 </button>
 ))}
 </div>
 <div className="mt-1 text-[9px] font-mono text-phosphor/50">
 {selectedOperator === 'ASND' && 'Invisible sub-word boundary sharding'}
 {selectedOperator === 'HMC-SPS' && 'Cross-script homoglyphic phase shift'}
 {selectedOperator === 'DS-BFAH' && 'Diacritic saturation (Mechanism Uncertain)'}
 </div>
 </div>

 {/* Target Span & Target Phrase */}
 <div>
 <label className="block text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/60 mb-1">
 Span Selector
 </label>
 <div className="flex gap-1 mb-1">
 <select
 value={targetSpanType}
 onChange={(e) => setTargetSpanType(e.target.value as TargetSpanType)}
 className="w-full bg-theme-panel border terminal-border px-2 py-1 text-phosphor text-[9px] font-display uppercase tracking-widest focus:outline-none focus:border-phosphor"
 >
 <option value="entire_prompt">Entire Prompt</option>
 <option value="selected_phrase">Selected Phrase</option>
 <option value="modifier">Modifier / Adjective</option>
 <option value="delimiter">Delimiters & Punctuation</option>
 </select>
 </div>
 {targetSpanType !== 'entire_prompt' && (
 <input
 type="text"
 placeholder="Target substring (e.g. obsidian)..."
 value={targetPhrase}
 onChange={(e) => setTargetPhrase(e.target.value)}
 className="w-full bg-theme-panel border terminal-border px-2 py-0.5 text-phosphor text-[10px] font-mono focus:outline-none focus:border-phosphor placeholder-phosphor/40"
 />
 )}
 </div>

 {/* Dynamic Operator Parameter Sliders */}
 <div>
 {selectedOperator === 'ASND' && (
 <div className="space-y-1.5 font-display uppercase tracking-widest">
 <div className="flex justify-between text-[9px]">
 <span className="text-phosphor/60 font-bold">Insertion Density:</span>
 <span className="text-phosphor font-bold">{asndDensity.toFixed(2)}</span>
 </div>
 <input
 type="range"
 min="0"
 max="1"
 step="0.05"
 value={asndDensity}
 onChange={(e) => setAsndDensity(parseFloat(e.target.value))}
 className="w-full h-1 bg-theme-panel border terminal-border appearance-none cursor-pointer"
 style={{ WebkitAppearance: 'none' }}
 />
 <select
 value={asndStrategy}
 onChange={(e) => setAsndStrategy(e.target.value)}
 className="w-full bg-theme-panel border terminal-border px-2 py-0.5 text-phosphor text-[9px] font-bold"
 >
 <option value="combining_grapheme_joiner">CGJ (U+034F)</option>
 <option value="zero_width_space">ZWSP (U+200B)</option>
 <option value="soft_hyphen">Soft Hyphen (U+00AD)</option>
 <option value="alternating_separators">Alternating Mix</option>
 </select>
 </div>
 )}

 {selectedOperator === 'HMC-SPS' && (
 <div className="space-y-1.5 font-display uppercase tracking-widest">
 <div className="flex justify-between text-[9px]">
 <span className="text-phosphor/60 font-bold">Homoglyph Ratio:</span>
 <span className="text-phosphor font-bold">{(hmcRatio * 100).toFixed(0)}%</span>
 </div>
 <input
 type="range"
 min="0"
 max="1"
 step="0.05"
 value={hmcRatio}
 onChange={(e) => setHmcRatio(parseFloat(e.target.value))}
 className="w-full h-1 bg-theme-panel border terminal-border appearance-none cursor-pointer"
 style={{ WebkitAppearance: 'none' }}
 />
 <select
 value={hmcScripts}
 onChange={(e) => setHmcScripts(e.target.value as any)}
 className="w-full bg-theme-panel border terminal-border px-2 py-0.5 text-phosphor text-[9px] font-bold"
 >
 <option value="cyrillic_greek">Cyrillic + Greek</option>
 <option value="cyrillic">Cyrillic Only</option>
 <option value="greek">Greek Only</option>
 </select>
 </div>
 )}

 {selectedOperator === 'DS-BFAH' && (
 <div className="space-y-1.5 font-display uppercase tracking-widest">
 <div className="flex justify-between text-[9px]">
 <span className="text-phosphor/60 font-bold">Stack Depth:</span>
 <span className="text-phosphor font-bold">{dsDepth} marks/char</span>
 </div>
 <input
 type="range"
 min="0"
 max="60"
 step="5"
 value={dsDepth}
 onChange={(e) => setDsDepth(parseInt(e.target.value, 10))}
 className="w-full h-1 bg-theme-panel border terminal-border appearance-none cursor-pointer"
 style={{ WebkitAppearance: 'none' }}
 />
 <select
 value={dsPool}
 onChange={(e) => setDsPool(e.target.value as any)}
 className="w-full bg-theme-panel border terminal-border px-2 py-0.5 text-phosphor text-[9px] font-bold"
 >
 <option value="balanced">Balanced Diacritics</option>
 <option value="high_marks">High Diacritics</option>
 <option value="low_marks">Low Diacritics</option>
 <option value="strike_overlay">Strike / Overlay</option>
 </select>
 </div>
 )}
 </div>
 </div>

 {/* Machine-Facing Output Preview Section */}
 <div className="space-y-3">
 {/* Escaped Representation (m\u034Fand\u034Fible view) */}
 <div className="p-3 bg-theme-bg border terminal-border ">
 <div className="flex items-center justify-between mb-1.5">
 <span className="text-[10px] uppercase font-bold text-phosphor flex items-center gap-1.5 font-display tracking-widest">
 <Eye className="w-3 h-3 text-phosphor" />
 Human-Readable Escaped Representation
 </span>
 <button
 type="button"
 onClick={() => copyToClipboard(mutationResult.escapedView, true)}
 className="flex items-center gap-1 text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-panel border terminal-border transition-colors"
 >
 {copiedEscaped ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 {copiedEscaped ? 'Copied' : 'Copy Escaped'}
 </button>
 </div>
 <div className="p-2 bg-theme-panel border terminal-border font-mono text-[10px] text-phosphor/90 break-all select-all leading-relaxed max-h-24 overflow-y-auto">
 {mutationResult.escapedView}
 </div>
 <p className="text-[9px] font-mono text-phosphor/50 mt-1">
 Reveals non-rendering Unicode separators and combining marks (e.g. \u034F, \u200B) without modifying the raw serialized payload.
 </p>
 </div>

 {/* Mutated String & Action Bar */}
 <div className="p-3 bg-theme-bg border terminal-border ">
 <div className="flex items-center justify-between mb-1.5">
 <span className="text-[10px] uppercase font-bold text-phosphor flex items-center gap-1.5 font-display tracking-widest">
 <Terminal className="w-3 h-3 text-phosphor/60" />
 Machine-Serialized Payload (Rendered View)
 </span>
 <div className="flex items-center gap-1.5">
 <button
 type="button"
 onClick={() => copyToClipboard(mutationResult.serializedExperimentalInput, false)}
 className="flex items-center gap-1 text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-panel border terminal-border transition-colors"
 >
 {copiedRaw ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 {copiedRaw ? 'Copied Raw' : 'Copy Machine String'}
 </button>
 {onApplyMutatedPrompt && (
 <button
 type="button"
 onClick={() => onApplyMutatedPrompt(mutationResult.serializedExperimentalInput)}
 className="px-2.5 py-0.5 bg-phosphor/10 hover:bg-phosphor/20 border terminal-border border-phosphor/40 text-phosphor text-[9px] font-display uppercase tracking-widest font-bold transition-all shadow-sm"
 >
 APPLY SECTION → DAVID
 </button>
 )}
 </div>
 </div>
 <div className="specimen-chamber font-mono text-[10px] text-phosphor break-all leading-relaxed max-h-20 overflow-y-auto">
 {mutationResult.serializedExperimentalInput}
 </div>
 </div>

 {/* Diagnostic Metrics Matrix */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
 <div className="p-2 bg-theme-bg border terminal-border ">
 <div className="text-phosphor/50 text-[9px] font-display uppercase tracking-widest">Characters (JS Units)</div>
 <div className="font-bold text-phosphor mt-0.5">
 {mutationResult.diagnostics.originalLength} &rarr; <span className="text-phosphor">{mutationResult.diagnostics.mutatedLength}</span>
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border ">
 <div className="text-phosphor/50 text-[9px] font-display uppercase tracking-widest">Unicode Code Points</div>
 <div className="font-bold text-phosphor mt-0.5">
 {mutationResult.diagnostics.originalCodePoints} &rarr; <span className="text-phosphor">{mutationResult.diagnostics.mutatedCodePoints}</span>
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border ">
 <div className="text-phosphor/50 text-[9px] font-display uppercase tracking-widest">UTF-8 Byte Length</div>
 <div className="font-bold text-phosphor mt-0.5">
 {mutationResult.diagnostics.originalByteLength}B &rarr; <span className="text-phosphor">{mutationResult.diagnostics.mutatedByteLength}B</span>
 </div>
 </div>

 <div className="p-2 bg-theme-bg border terminal-border ">
 <div className="text-phosphor/50 text-[9px] font-display uppercase tracking-widest">Context / Expansion</div>
 <div className="font-bold text-phosphor mt-0.5">
 {mutationResult.diagnostics.expansionRatio.toFixed(1)}x &bull;{' '}
 <span className={mutationResult.diagnostics.contextRisk === 'LOW' ? 'text-phosphor' : 'text-phosphor'}>
 {mutationResult.diagnostics.contextRisk}
 </span>
 </div>
 </div>
 </div>

 {/* Tokenizer Parity & White-Box Inspection Box */}
 <div className="p-3 bg-theme-bg border terminal-border ">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase font-bold text-phosphor flex items-center gap-1.5 font-display tracking-widest">
 <ShieldAlert className="w-3.5 h-3.5 text-phosphor/60" />
 Tokenizer State & Parity Verification
 </span>
 <span
 className={`text-[9px] font-display uppercase tracking-widest font-bold px-2 py-0.5 border terminal-border ${
 parityCheck.mechanismEvidence === 'TOKENIZATION_DIVERGED'
 ? 'bg-phosphor/10 border-phosphor/40 text-phosphor'
 : parityCheck.mechanismEvidence === 'NO_TOKENIZATION_CHANGE'
 ? 'bg-phosphor/10 border-phosphor/40 text-phosphor'
 : 'bg-theme-panel border-phosphor/30 text-phosphor/60'
 }`}
 >
 {parityCheck.mechanismEvidence}
 </span>
 </div>

 {!tokenizationInspection.isInstrumented ? (
 <div className="text-[10px] text-phosphor/60 space-y-1 font-mono">
 <p>
 <strong className="text-phosphor">Downstream Tokenization:</strong>{' '}
 <span className="text-phosphor">TOKENIZATION_UNVERIFIED</span>. Active backend is commercial black-box [<strong className="text-phosphor">{backendCaps.displayName}</strong>].
 </p>
 <p className="text-[9px] text-phosphor/40 italic">
 DAVID records empirical inputs and outputs, but does not claim white-box tokenizer confirmation on closed APIs.
 </p>
 </div>
 ) : (
 <div className="text-[10px] text-phosphor space-y-1.5 font-mono">
 <p className="text-phosphor/60">{parityCheck.diffSummary}</p>
 {Object.entries(tokenizationInspection.encoders).map(([encId, encRes]) => (
 <div key={encId} className="flex items-center justify-between text-[9px] bg-theme-panel px-2 py-1 border terminal-border font-display uppercase tracking-widest">
 <span className="font-bold text-phosphor">{encId}:</span>
 <span>{encRes.tokenCount} tokens ({encRes.pieces.length} subwords)</span>
 <span>Truncated: {encRes.truncated ? 'YES' : 'NO'}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Warnings and Clamping Notices */}
 {mutationResult.diagnostics.warnings.length > 0 && (
 <div className="p-2.5 bg-phosphor/10 border terminal-border border-phosphor/40 text-phosphor space-y-1 text-[10px] font-mono">
 {mutationResult.diagnostics.warnings.map((w, idx) => (
 <div key={idx} className="flex items-start gap-1.5">
 <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-phosphor" />
 <span>{w}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
};
