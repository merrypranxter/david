import React, { useState } from 'react';
import { LiteralResult, MutationCandidate, PromptGeneration, SlopResult, SynthesisPayload, TargetEngine } from '../types';
import { EvolutionLineageView } from './EvolutionLineageView';
import { MutantFamilyView } from './MutantFamilyView';
import {
 Copy,
 Check,
 Scissors,
 Flame,
 Activity,
 Play,
 RotateCw,
 Sparkles,
 Music,
 FileText,
 Layers,
 ChevronDown,
 ShieldCheck,
 Dna,
 Cpu,
 Lock,
 Magnet,
 GitFork,
 AlertTriangle,
 Compass,
 FlaskConical,
 Bookmark,
 ThumbsUp,
} from 'lucide-react';
import {
 recordUserFeedback,
 getRun,
 addPreservedArtifact,
} from '../utils/empiricalLearningEngine';
import { UserFeedbackJudgment, ArtifactAction } from '../types/empiricalLearning';

interface DualOutputViewProps {
 data: SynthesisPayload;
 target: TargetEngine;
 modelUsed?: string;
 activeRunId?: string | null;
 onOpenExperimentMemory?: (runId?: string) => void;
 onRunSimulation: (prompt: string, mode: 'literal' | 'slop') => void;
 onOuroborosLoop: (slopPrompt: string, parentGen?: PromptGeneration) => void;
 onTranspose: () => void;
 onSelectManualSurvivor?: (candidate: MutationCandidate) => void;
}

/**
 * Strips any Suno-specific tags (like [SUNO STYLE], [SUNO LYRICS], vocoder tags,
 * song-structure markers) from output when the user is targeting Grok or other visual models.
 */
export function stripSunoArtifacts(text: string): string {
 if (!text) return '';
 return text
 // Strip Suno section headers
 .replace(/\[SUNO\s+(?:STYLE|LYRICS)\]/gi, '')
 .replace(/\[(?:STYLE|LYRICS)\s*-\s*\d+[,\d]*\s*CAP\]/gi, '')
 // Strip Suno vocoder directive tags
 .replace(/\[VOCAL_TEXTURE:[^\]]*\]/gi, '')
 .replace(/\[(?:Intro|Verse|Chorus|Bridge|Drop|Break|Solo|Outro|Choreography):[^\]]*\]/gi, '')
 // Strip empty leftover bracket pairs
 .replace(/\[\s*\]/g, '')
 // Clean up excessive blank lines
 .replace(/\n{3,}/g, '\n\n')
 .trim();
}

/**
 * Strips all bracketed instruction tokens (e.g. [SUBJECT: ...], [LIGHTING: ...])
 * for users who want 100% natural language text.
 */
export function stripAllBracketTags(text: string): string {
 if (!text) return '';
 return text
 .replace(/\[[A-Z0-9_\-/\s.:]+\]/gi, '')
 .replace(/\s{2,}/g, ' ')
 .trim();
}

export const DualOutputView: React.FC<DualOutputViewProps> = ({
 data,
 target,
 modelUsed,
 activeRunId,
 onOpenExperimentMemory,
 onRunSimulation,
 onOuroborosLoop,
 onTranspose,
 onSelectManualSurvivor,
}) => {
 const [copiedLiteral, setCopiedLiteral] = useState(false);
 const [copiedLiteralClean, setCopiedLiteralClean] = useState(false);
 const [copiedLiteralStyle, setCopiedLiteralStyle] = useState(false);
 const [copiedLiteralLyrics, setCopiedLiteralLyrics] = useState(false);

 const [copiedSlop, setCopiedSlop] = useState(false);
 const [copiedSlopClean, setCopiedSlopClean] = useState(false);
 const [copiedSlopStyle, setCopiedSlopStyle] = useState(false);
 const [copiedSlopLyrics, setCopiedSlopLyrics] = useState(false);

 const [copiedAll, setCopiedAll] = useState(false);
 const [quickFeedbackSelected, setQuickFeedbackSelected] = useState<string | null>(null);
 const [quickArtifactSaved, setQuickArtifactSaved] = useState(false);
 const [quickArtifactInput, setQuickArtifactInput] = useState('');
 const [showArtifactInput, setShowArtifactInput] = useState(false);

 // CRITICAL: isSuno is strictly based on the user's active target selection
 const isSuno = target === 'suno';

 const copyToClipboard = async (text: string, setter: (val: boolean) => void) => {
 try {
 await navigator.clipboard.writeText(text);
 setter(true);
 setTimeout(() => setter(false), 2000);
 } catch (e) {
 console.error('Failed to copy', e);
 }
 };

 const getCleanPrompt = (rawPrompt: string) => {
 return isSuno ? rawPrompt : stripSunoArtifacts(rawPrompt);
 };

 // Defensive fallbacks to prevent undefined evaluation crashes
 const safeLiteral: LiteralResult = data?.literal || {
 prompt: typeof (data as any)?.prompt === 'string' ? (data as any).prompt : '',
 stylePrompt: '',
 lyricsPrompt: '',
 tokenWeights: [],
 targetParameters: '',
 charCount: 0,
 };
 const safeSlop: SlopResult = data?.slop || {
 prompt: typeof (data as any)?.prompt === 'string' ? (data as any).prompt : '',
 stylePrompt: '',
 lyricsPrompt: '',
 entropyScore: 5,
 hallucinationTriggers: [],
 seededContradictions: [],
 injectedDomains: [],
 activeOperators: [],
 activeAttractors: [],
 preservedAnchors: [],
 charCount: 0,
 glitchAnchors: undefined,
 mutationSummary: undefined,
 };

 const literalPrompt = getCleanPrompt(safeLiteral.prompt || '');
 const slopPrompt = getCleanPrompt(safeSlop.prompt || '');

 const getSunoCombinedCopy = (mode: 'literal' | 'slop') => {
 const item = mode === 'literal' ? safeLiteral : safeSlop;
 return `[SUNO STYLE]\n${item.stylePrompt || item.prompt || ''}\n\n[SUNO LYRICS]\n${item.lyricsPrompt || ''}`;
 };

 const getAllCombinedCopy = () => {
 if (isSuno) {
 return (
 `### [LITERAL] - THE SCALPEL\n` +
 `[STYLE - 999 CAP]\n${safeLiteral.stylePrompt || safeLiteral.prompt || ''}\n\n` +
 `[LYRICS - 3,000 CAP]\n${safeLiteral.lyricsPrompt || ''}\n\n` +
 `### [SLOP] - THE DELUGE\n` +
 `[STYLE - 999 CAP]\n${safeSlop.stylePrompt || safeSlop.prompt || ''}\n\n` +
 `[LYRICS - 3,000 CAP]\n${safeSlop.lyricsPrompt || ''}`
 );
 }
 return `=== [LITERAL] - THE SCALPEL ===\n${literalPrompt}\n\n=== [SLOP] - THE DELUGE ===\n${slopPrompt}`;
 };

 const getCopyButtonLabel = (mode: 'literal' | 'slop') => {
 if (target === 'grok') {
 return mode === 'literal' ? 'Copy Grok Prompt' : 'Copy Grok Slop';
 }
 if (target === 'openart') {
 return mode === 'literal' ? 'Copy OpenArt Prompt' : 'Copy OpenArt Slop';
 }
 if (target === 'midjourney_flux') {
 return mode === 'literal' ? 'Copy Midjourney Prompt' : 'Copy Midjourney Slop';
 }
 return mode === 'literal' ? 'Copy Literal Prompt' : 'Copy Slop Prompt';
 };

 return (
 <div className="space-y-6">
 {/* Top Banner: Status & Global Actions */}
 <div className="bg-theme-bg border terminal-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg relative">
 <div className="absolute top-0 left-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[9px] font-display uppercase tracking-widest font-bold">OUT // ORGANISM COMPILED</div>
 
 <div className="flex items-start gap-3 mt-3">
 <Activity className="w-5 h-5 text-phosphor shrink-0 mt-0.5" />
 <div>
 <div className="text-[11px] font-display font-bold text-phosphor uppercase tracking-widest flex items-center gap-2 flex-wrap">
 <span>SYNTHETIC SPECIMEN DATA</span>
 {modelUsed && (
 <span className="text-[9px] px-1.5 py-0.5 bg-theme-panel text-phosphor font-display uppercase tracking-widest border terminal-border">
 {modelUsed}
 </span>
 )}
 {isSuno ? (
 <span className="text-[9px] px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 font-display uppercase tracking-widest terminal-border">
 Suno Audio Dual Buffer Active
 </span>
 ) : (
 <span className="text-[9px] px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 font-display uppercase tracking-widest flex items-center gap-1 terminal-border">
 <ShieldCheck className="w-3 h-3 text-phosphor" />
 <span>Target: {target.toUpperCase()} (Zero Audio Tags)</span>
 </span>
 )}
 </div>
 {data.previewImpact && (
 <p className="text-[10px] text-phosphor/50 mt-1 font-mono leading-relaxed">{data.previewImpact}</p>
 )}
 </div>
 </div>

 {/* Global Action Tools */}
 <div className="flex items-center gap-2 self-start sm:self-center shrink-0 mt-3 sm:mt-0">
 <button
 type="button"
 id="transpose-button"
 onClick={onTranspose}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-panel hover:bg-phosphor/10 text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/80 hover:text-phosphor transition-colors border terminal-border"
 title="Inverts polarity between the Scalpel and Deluge"
 >
 <RotateCw className="w-3.5 h-3.5 text-phosphor" />
 <span>[[VC:TRANSPOSE]]</span>
 </button>
 <button
 type="button"
 id="copy-both-button"
 onClick={() => copyToClipboard(getAllCombinedCopy(), setCopiedAll)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-panel hover:bg-phosphor/10 text-[9px] font-display uppercase tracking-widest font-bold text-phosphor/80 hover:text-phosphor transition-colors border terminal-border"
 >
 {copiedAll ? <Check className="w-3.5 h-3.5 text-phosphor" /> : <Copy className="w-3.5 h-3.5" />}
 <span>{copiedAll ? 'Copied Both' : 'Copy Both Prompts'}</span>
 </button>
 </div>
 </div>

 {/* Quality-Diversity Mutant Family Indicator & Inspector (Job 8) */}
 {data.mutantFamily && (
 <MutantFamilyView
 familyResult={data.mutantFamily}
 onSelectManualSurvivor={onSelectManualSurvivor}
 />
 )}

 {/* Dual Column Workspace */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* ========================================================= */}
 {/* Column 1: [LITERAL] - The Scalpel */}
 {/* ========================================================= */}
 <div className="bg-theme-panel border terminal-border p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[9px] font-display uppercase tracking-widest font-bold z-10">LITERAL-01</div>

 <div className="space-y-4 pt-2">
 {/* Column Header */}
 <div className="flex items-center justify-between border-b terminal-border pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 bg-phosphor/10 border border-phosphor/30 flex items-center justify-center text-phosphor terminal-border">
 <Scissors className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-sm font-bold font-display text-phosphor flex items-center gap-2 uppercase tracking-widest">
 [LITERAL] <span className="text-phosphor font-normal text-[10px]">// The Scalpel</span>
 </h3>
 <span className="text-[9px] font-mono text-phosphor/50">
 Protocol DIRECT_INTERLINK &bull; Max Execution Fidelity
 </span>
 </div>
 </div>

 {/* Primary Copy Button for Literal */}
 <button
 type="button"
 id="copy-literal-button"
 onClick={() =>
 copyToClipboard(
 isSuno ? getSunoCombinedCopy('literal') : literalPrompt,
 setCopiedLiteral
 )
 }
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 text-[10px] font-display font-bold uppercase tracking-widest text-phosphor border border-phosphor/50 shadow transition-colors terminal-border"
 title="Copy clean prompt to clipboard"
 >
 {copiedLiteral ? <Check className="w-3.5 h-3.5 text-phosphor" /> : <Copy className="w-3.5 h-3.5" />}
 <span>{copiedLiteral ? 'Copied!' : isSuno ? 'Copy Literal (Both)' : getCopyButtonLabel('literal')}</span>
 </button>
 </div>

 {/* Suno Dual Boxes OR Single Visual Prompt Box */}
 {isSuno ? (
 <div className="space-y-4">
 {/* 1. Style Box (1k Cap) */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-[11px] font-display tracking-widest uppercase">
 <span className="text-phosphor font-bold flex items-center gap-1.5">
 <Music className="w-3.5 h-3.5" />
 <span>1. Suno Style Box (999 Cap):</span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor/70 font-mono text-[10px]">
 {safeLiteral.stylePrompt?.length || safeLiteral.prompt?.length || 0} chars
 </span>
 <button
 type="button"
 onClick={() =>
 copyToClipboard(
 safeLiteral.stylePrompt || safeLiteral.prompt || '',
 setCopiedLiteralStyle
 )
 }
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors flex items-center gap-1"
 >
 {copiedLiteralStyle ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>Copy Style</span>
 </button>
 </div>
 </div>
 <div className="w-full bg-theme-bg border terminal-border p-3.5 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-56 overflow-y-auto specimen-chamber shadow-inner">
 {safeLiteral.stylePrompt || safeLiteral.prompt}
 </div>
 </div>

 {/* 2. Lyrics Box (3k Cap) */}
 {safeLiteral.lyricsPrompt && (
 <div className="space-y-1.5 pt-2 border-t terminal-border border-dashed">
 <div className="flex items-center justify-between text-[11px] font-display tracking-widest uppercase">
 <span className="text-phosphor font-bold flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5" />
 <span>2. Lyrics &amp; Directives (3,000 Cap):</span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor/70 font-mono text-[10px]">
 {safeLiteral.lyricsPrompt.length} chars
 </span>
 <button
 type="button"
 onClick={() => copyToClipboard(safeLiteral.lyricsPrompt!, setCopiedLiteralLyrics)}
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors flex items-center gap-1"
 >
 {copiedLiteralLyrics ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>Copy Lyrics</span>
 </button>
 </div>
 </div>
 <div className="w-full bg-theme-bg border terminal-border p-3.5 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-72 overflow-y-auto specimen-chamber shadow-inner">
 {safeLiteral.lyricsPrompt}
 </div>
 </div>
 )}
 </div>
 ) : (
 /* NON-SUNO: Clean Single Prompt View for Grok/OpenArt/Midjourney */
 <div className="space-y-2">
 <div className="flex items-center justify-between text-[10px] font-display uppercase tracking-widest">
 <span className="text-phosphor/50 flex items-center gap-1.5">
 <span>Prompt Content:</span>
 <span className="text-[9px] text-phosphor px-1.5 py-0.5 bg-phosphor/10 border border-phosphor/20 terminal-border">
 Cleaned &bull; Zero Audio Tags
 </span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor font-bold font-mono text-[11px]">
 {literalPrompt.length} chars
 </span>
 <button
 type="button"
 onClick={() =>
 copyToClipboard(stripAllBracketTags(literalPrompt), setCopiedLiteralClean)
 }
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors"
 title="Copies pure prose text with all bracketed tokens [LIKE THIS] stripped"
 >
 {copiedLiteralClean ? 'Copied Pure' : 'Copy Pure (No Tags)'}
 </button>
 </div>
 </div>

 <div className="w-full bg-semantic-white/5 border border-semantic-white/20 p-4 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto shadow-inner specimen-chamber terminal-border">
 {literalPrompt}
 </div>
 </div>
 )}

 {/* Collapsible Latent Telemetry & Parameters to avoid cluttering the view */}
 {((safeLiteral.tokenWeights && safeLiteral.tokenWeights.length > 0) || safeLiteral.targetParameters) && (
 <details className="group border terminal-border overflow-hidden bg-theme-bg">
 <summary className="px-3 py-2 cursor-pointer text-[10px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor flex items-center justify-between select-none bg-phosphor/5 transition-colors">
 <span className="flex items-center gap-1.5">
 <Sparkles className="w-3 h-3 text-phosphor" />
 <span>Technical Diagnostics &amp; Attention Vectors</span>
 </span>
 <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform text-phosphor/50" />
 </summary>

 <div className="p-3 space-y-3 border-t terminal-border">
 {safeLiteral.tokenWeights && safeLiteral.tokenWeights.length > 0 && (
 <div>
 <span className="block text-[9px] font-display text-phosphor/40 mb-1.5 uppercase tracking-widest">
 Prioritized Attention Vectors:
 </span>
 <div className="flex flex-wrap gap-1.5">
 {safeLiteral.tokenWeights.map((token, i) => (
 <span
 key={i}
 className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border"
 >
 {token}
 </span>
 ))}
 </div>
 </div>
 )}

 {safeLiteral.targetParameters && (
 <div>
 <span className="block text-[9px] font-display text-phosphor/40 mb-1 uppercase tracking-widest">
 Target Parameters:
 </span>
 <code className="text-xs font-mono text-phosphor/70 bg-theme-panel px-2 py-1 border terminal-border block mt-1">
 {safeLiteral.targetParameters}
 </code>
 </div>
 )}
 </div>
 </details>
 )}
 </div>

 {/* Bottom Actions for Literal */}
 <div className="pt-3 border-t terminal-border flex items-center justify-between mt-auto">
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/40">The Scalpel (Mode 1)</span>
 <button
 type="button"
 id="simulate-literal-button"
 onClick={() => onRunSimulation(literalPrompt, 'literal')}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 text-[10px] font-display uppercase tracking-widest font-bold transition-colors cursor-pointer terminal-border"
 >
 <Play className="w-3.5 h-3.5 text-phosphor" />
 <span>Simulate Output</span>
 </button>
 </div>
 </div>

 {/* ========================================================= */}
 {/* Column 2: [SLOP] - The Deluge */}
 {/* ========================================================= */}
 <div className="bg-theme-panel border terminal-border p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[9px] font-display uppercase tracking-widest font-bold z-10">SLOP-02</div>

 <div className="space-y-4 pt-2">
 {/* Column Header */}
 <div className="flex items-center justify-between border-b terminal-border pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 bg-phosphor/10 border border-phosphor/30 flex items-center justify-center text-phosphor terminal-border">
 <Flame className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-sm font-bold font-display text-phosphor flex items-center gap-2 uppercase tracking-widest">
 [SLOP] <span className="text-phosphor font-normal text-[10px]">// The Deluge</span>
 </h3>
 <span className="text-[9px] font-mono text-phosphor/50">
 Protocol SLOP_MANIFEST &bull; S{safeSlop.entropyScore || 5} Depth
 </span>
 </div>
 </div>

 {/* Primary Copy Button for Slop */}
 <div className="flex items-center gap-2">
 <span className="text-[9px] font-display uppercase tracking-widest font-bold px-2 py-0.5 bg-phosphor/20 text-phosphor border border-phosphor/40 terminal-border">
 S{safeSlop.entropyScore || 5}
 </span>
 <button
 type="button"
 id="copy-slop-button"
 onClick={() =>
 copyToClipboard(
 isSuno ? getSunoCombinedCopy('slop') : slopPrompt,
 setCopiedSlop
 )
 }
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-phosphor/10 hover:bg-phosphor/20 text-[10px] font-display font-bold uppercase tracking-widest text-phosphor border border-phosphor/50 shadow transition-colors terminal-border"
 title="Copy high-entropy slop prompt to clipboard"
 >
 {copiedSlop ? <Check className="w-3.5 h-3.5 text-phosphor" /> : <Copy className="w-3.5 h-3.5" />}
 <span>{copiedSlop ? 'Copied!' : isSuno ? 'Copy Slop (Both)' : getCopyButtonLabel('slop')}</span>
 </button>
 </div>
 </div>

 {/* Suno Dual Boxes OR Single Visual Prompt Box */}
 {isSuno ? (
 <div className="space-y-4">
 {/* 1. Style Box (1k Cap) */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-[11px] font-display tracking-widest uppercase">
 <span className="text-phosphor font-bold flex items-center gap-1.5">
 <Music className="w-3.5 h-3.5" />
 <span>1. Slop Style Box (999 Cap):</span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor/70 font-mono text-[10px]">
 {safeSlop.stylePrompt?.length || safeSlop.prompt?.length || 0} chars
 </span>
 <button
 type="button"
 onClick={() =>
 copyToClipboard(
 safeSlop.stylePrompt || safeSlop.prompt || '',
 setCopiedSlopStyle
 )
 }
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors flex items-center gap-1"
 >
 {copiedSlopStyle ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>Copy Style</span>
 </button>
 </div>
 </div>
 <div className="w-full bg-theme-bg border terminal-border p-3.5 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-56 overflow-y-auto specimen-chamber shadow-inner">
 {safeSlop.stylePrompt || safeSlop.prompt}
 </div>
 </div>

 {/* 2. Lyrics Box (3k Cap) */}
 {safeSlop.lyricsPrompt && (
 <div className="space-y-1.5 pt-2 border-t terminal-border border-dashed">
 <div className="flex items-center justify-between text-[11px] font-display tracking-widest uppercase">
 <span className="text-phosphor font-bold flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5" />
 <span>2. Gibberish Lyrics &amp; Paradoxes (3k Cap):</span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor/70 font-mono text-[10px]">
 {safeSlop.lyricsPrompt.length} chars
 </span>
 <button
 type="button"
 onClick={() => copyToClipboard(safeSlop.lyricsPrompt!, setCopiedSlopLyrics)}
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors flex items-center gap-1"
 >
 {copiedSlopLyrics ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>Copy Lyrics</span>
 </button>
 </div>
 </div>
 <div className="w-full bg-theme-bg border terminal-border p-3.5 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-72 overflow-y-auto specimen-chamber shadow-inner">
 {safeSlop.lyricsPrompt}
 </div>
 </div>
 )}
 </div>
 ) : (
 /* NON-SUNO: Clean Single Prompt View for Grok/OpenArt/Midjourney */
 <div className="space-y-2">
 <div className="flex items-center justify-between text-[10px] font-display uppercase tracking-widest">
 <span className="text-phosphor/50 flex items-center gap-1.5">
 <span>High-Entropy Slop Prompt:</span>
 <span className="text-[9px] text-phosphor px-1.5 py-0.5 bg-phosphor/10 border border-phosphor/20 terminal-border">
 Cleaned &bull; Zero Audio Tags
 </span>
 </span>
 <div className="flex items-center gap-2">
 <span className="text-phosphor font-bold font-mono text-[11px]">
 {slopPrompt.length} chars
 </span>
 <button
 type="button"
 onClick={() =>
 copyToClipboard(stripAllBracketTags(slopPrompt), setCopiedSlopClean)
 }
 className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor px-2 py-0.5 bg-theme-bg border terminal-border transition-colors"
 title="Copies pure text with all bracket tags stripped"
 >
 {copiedSlopClean ? 'Copied Pure' : 'Copy Pure (No Tags)'}
 </button>
 </div>
 </div>

 <div className="w-full bg-semantic-white/5 border border-semantic-white/20 p-4 text-xs font-mono text-phosphor/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto shadow-inner specimen-chamber terminal-border">
 {slopPrompt}
 </div>
 </div>
 )}

 {/* Evolutionary Lineage / Genotype Inspector (Job 6) */}
 {data.generation && (
 <EvolutionLineageView generation={data.generation} />
 )}

 {/* Collapsible Latent Diagnostics to prevent clutter */}
 {(safeSlop.hallucinationTriggers?.length ||
 safeSlop.seededContradictions?.length ||
 safeSlop.glitchAnchors ||
 safeSlop.injectedDomains?.length ||
 safeSlop.activeOperators?.length ||
 safeSlop.activeAttractors?.length ||
 safeSlop.mutationSummary) && (
 <details className="group border terminal-border overflow-hidden bg-theme-bg">
 <summary className="px-3 py-2 cursor-pointer text-[10px] font-display uppercase tracking-widest text-phosphor/50 hover:text-phosphor flex items-center justify-between select-none bg-phosphor/5 transition-colors">
 <span className="flex items-center gap-1.5">
 <Sparkles className="w-3 h-3 text-phosphor" />
 <span>Mutation Architecture &amp; Latent Diagnostics</span>
 </span>
 <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform text-phosphor/50" />
 </summary>

 <div className="p-3 space-y-3 border-t terminal-border">
 {safeSlop.mutationSummary && (
 <div className="bg-phosphor/10 p-2.5 border border-phosphor/20 text-[10px] font-mono text-phosphor/90 leading-relaxed terminal-border">
 <span className="text-phosphor font-bold block mb-1 uppercase tracking-widest text-[9px] font-display">
 Mutation Recipe Summary:
 </span>
 {safeSlop.mutationSummary}
 </div>
 )}

 {safeSlop.activeOperators && safeSlop.activeOperators.length > 0 && (
 <div>
 <span className="block text-[9px] font-display text-phosphor/40 mb-1 uppercase tracking-widest">
 Active Mutation Operators:
 </span>
 <div className="flex items-center gap-1.5 flex-wrap mt-1">
 {safeSlop.activeOperators.map((op, i) => (
 <span
 key={i}
 className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border"
 >
 {op.replace(/_/g, ' ').toUpperCase()}
 </span>
 ))}
 </div>
 </div>
 )}

 {safeSlop.activeAttractors && safeSlop.activeAttractors.length > 0 && (
 <div className="pt-2 border-t terminal-border border-dashed">
 <span className="block text-[9px] font-display text-phosphor/40 mb-1 uppercase tracking-widest">
 Latent Fauna Attractors:
 </span>
 <div className="flex items-center gap-1.5 flex-wrap mt-1">
 {safeSlop.activeAttractors.map((at, i) => (
 <span
 key={i}
 className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border"
 >
 {at.toUpperCase()}
 </span>
 ))}
 </div>
 </div>
 )}

 {safeSlop.preservedAnchors && safeSlop.preservedAnchors.length > 0 && (
 <div>
 <span className="block text-[10px] font-mono text-phosphor mb-1 uppercase tracking-wider">
 Preserved Invariant Anchors:
 </span>
 <div className="flex items-center gap-1.5 flex-wrap">
 {safeSlop.preservedAnchors.map((anchor, i) => (
 <span
 key={i}
 className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border"
 >
 {anchor}
 </span>
 ))}
 </div>
 </div>
 )}

 {safeSlop.hallucinationTriggers && safeSlop.hallucinationTriggers.length > 0 && (
 <div>
 <span className="block text-[10px] font-mono text-phosphor/50 mb-1 uppercase tracking-wider">
 Surgical Contradictions &amp; Folds:
 </span>
 <ul className="space-y-1">
 {safeSlop.hallucinationTriggers.map((trigger, i) => (
 <li key={i} className="text-xs font-mono text-phosphor/80 flex items-start gap-1.5">
 <span className="text-semantic-red shrink-0">&bull;</span>
 <span>{trigger}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {safeSlop.seededContradictions && safeSlop.seededContradictions.length > 0 && (
 <div>
 <span className="block text-[10px] font-mono text-phosphor/90 mb-1 uppercase tracking-wider">
 Injected Paradoxes:
 </span>
 <ul className="space-y-1">
 {safeSlop.seededContradictions.map((contra, i) => (
 <li
 key={i}
 className="text-xs font-mono text-phosphor/90 flex items-start gap-1.5 bg-phosphor/10 px-2 py-1 border border-phosphor/30 terminal-border"
 >
 <span className="text-phosphor shrink-0">&#9889;</span>
 <span>{contra}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {safeSlop.injectedDomains && safeSlop.injectedDomains.length > 0 && (
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className="text-[10px] font-mono text-phosphor/50 uppercase">Domains:</span>
 {safeSlop.injectedDomains.map((domain, i) => (
 <span
 key={i}
 className="text-[10px] font-mono px-2 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border"
 >
 {domain}
 </span>
 ))}
 </div>
 )}

 {safeSlop.glitchAnchors && (
 <div>
 <span className="block text-[10px] font-mono text-phosphor/50 mb-1 uppercase tracking-wider">
 Glitch Anchors:
 </span>
 <code className="text-xs font-mono text-semantic-red/80 bg-theme-panel px-2 py-1 border terminal-border block">
 {safeSlop.glitchAnchors}
 </code>
 </div>
 )}
 </div>
 </details>
 )}
 </div>

 {/* Bottom Actions for Slop */}
 <div className="pt-3 border-t terminal-border flex items-center justify-between">
 <button
 type="button"
 id="ouroboros-button"
 onClick={() => onOuroborosLoop(slopPrompt, data.generation)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-semantic-red/10 hover:bg-semantic-red/20 text-semantic-red border border-semantic-red/30 terminal-border text-xs font-mono transition-colors cursor-pointer"
 title="Feeds this high-entropy slop back as the seed prompt for recursive mutation"
 >
 <RotateCw className="w-3.5 h-3.5 text-semantic-red" />
 <span>Ouroboros Mutate</span>
 </button>
 <button
 type="button"
 id="simulate-slop-button"
 onClick={() => onRunSimulation(slopPrompt, 'slop')}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-semantic-red/10 hover:bg-semantic-red/20 text-semantic-red border border-semantic-red/30 terminal-border text-xs font-mono transition-colors cursor-pointer"
 >
 <Play className="w-3.5 h-3.5 text-semantic-red" />
 <span>Simulate Collapse</span>
 </button>
 </div>
 </div>
 </div>

 {/* Radical Transformation Engine Verification Card (Job 1) */}
 {data.transformationVerification && (
 <div className="border terminal-border bg-theme-panel p-4 shadow-md font-mono text-xs space-y-3">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b terminal-border pb-2.5">
 <div className="flex items-center gap-2">
 <ShieldCheck className={`w-4 h-4 ${data.transformationVerification.passed ? 'text-phosphor' : 'text-phosphor'}`} />
 <span className="font-bold tracking-wider uppercase text-phosphor">
 Radical Transformation Engine (Job 1 Audit)
 </span>
 <span className={`px-2 py-0.5 text-[10px] font-bold ${
 data.transformationVerification.passed
 ? 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 : 'bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border'
 }`}>
 {data.transformationVerification.passed ? 'PASSED (90–95% SATURATED)' : 'ACTIVE MUTATION'}
 </span>
 </div>
 <div className="text-[11px] text-phosphor/80 flex items-center gap-3">
 <span>Budget: <strong className="text-phosphor">{data.transformationVerification.actualCharacters}</strong> / {data.transformationVerification.budgetMax} chars ({data.transformationVerification.budgetUtilizationPercent}%)</span>
 <span>Preserved Invariants: <strong className="text-phosphor">{data.transformationVerification.preservedAnchorsFound.length}</strong></span>
 <span>Active Mutations: <strong className="text-semantic-red">{data.transformationVerification.mutationsDetectedCount}</strong></span>
 </div>
 </div>
 <p className="text-phosphor/80 leading-relaxed text-[11px]">
 {data.transformationVerification.verdictSummary}
 </p>
 </div>
 )}

 {/* Model Organism Profile Card (Job 6) */}
 {data.modelProfile && (
 <div className="border border-phosphor/40 bg-theme-panel p-4 shadow-md font-mono text-xs space-y-3 terminal-border">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b border-phosphor/40 pb-2.5 terminal-border">
 <div className="flex items-center gap-2">
 <Cpu className="w-4 h-4 text-phosphor" />
 <span className="font-bold tracking-wider uppercase text-phosphor">
 Model Organism Registry (Job 6): {data.modelProfile.technicalFacts.modelName} ({data.modelProfile.technicalFacts.version})
 </span>
 <span className="px-2 py-0.5 text-[10px] font-bold bg-phosphor/60 text-phosphor border border-phosphor/40 uppercase terminal-border">
 {data.modelProfile.epistemicStatus}
 </span>
 <span className="text-[10px] text-phosphor/50">
 Confidence: <strong className="text-phosphor/80 uppercase">{data.modelProfile.confidence}</strong>
 </span>
 </div>
 <div className="text-[11px] text-phosphor/80 flex items-center gap-2 flex-wrap">
 <span className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border text-[10px]">
 Ref Grip: <strong className="text-phosphor uppercase">{data.modelProfile.fingerprint.referenceGrip}</strong>
 </span>
 <span className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border text-[10px]">
 Literalness: <strong className="text-phosphor uppercase">{data.modelProfile.fingerprint.promptLiteralness}</strong>
 </span>
 <span className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border text-[10px]">
 Contradiction: <strong className="text-phosphor uppercase">{data.modelProfile.fingerprint.contradictionTolerance}</strong>
 </span>
 <span className="px-1.5 py-0.5 bg-theme-panel text-phosphor/80 border terminal-border text-[10px]">
 Retention: <strong className="text-phosphor uppercase">{data.modelProfile.fingerprint.longPromptBehavior}</strong>
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-phosphor/80">
 {data.modelProfile.easyOuts && data.modelProfile.easyOuts.length > 0 && (
 <div className="bg-semantic-red/10 border border-semantic-red/30 terminal-border p-2">
 <span className="text-semantic-red font-bold block mb-1">
 Blocked Easy-Outs:
 </span>
 <span className="text-phosphor/80">{data.modelProfile.easyOuts.join(', ')}</span>
 </div>
 )}
 {data.modelProfile.knownStrengths && data.modelProfile.knownStrengths.length > 0 && (
 <div className="bg-phosphor/10 border border-phosphor/30 terminal-border p-2">
 <span className="text-phosphor font-bold block mb-1">
 Organism Strengths:
 </span>
 <span className="text-phosphor/80">{data.modelProfile.knownStrengths.slice(0, 3).join('; ')}</span>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Experiment Memory & Empirical Feedback Card (Job 7) */}
 <div className="border terminal-border bg-theme-panel p-4 shadow-md font-mono text-xs space-y-3">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b terminal-border pb-2.5">
 <div className="flex items-center gap-2">
 <FlaskConical className="w-4 h-4 text-phosphor" />
 <span className="font-bold tracking-widest uppercase text-phosphor text-[10px] font-display">
 Experiment Memory &amp; Empirical Learning
 </span>
 {activeRunId && (
 <span className="px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-widest bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Run ID: {activeRunId}
 </span>
 )}
 <span className="px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-widest bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 LOGGED TO ARCHIVE
 </span>
 </div>

 <div className="flex items-center gap-2">
 {onOpenExperimentMemory && (
 <button
 type="button"
 onClick={() => onOpenExperimentMemory(activeRunId || undefined)}
 className="px-2.5 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 text-[9px] font-display uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors terminal-border"
 >
 <FlaskConical className="w-3.5 h-3.5" />
 <span>Open Experiment Lab History</span>
 </button>
 )}
 </div>
 </div>

 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-phosphor text-[11px]">
 {/* Quick Feedback Buttons */}
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className="text-phosphor/50 uppercase text-[9px] font-display tracking-widest font-bold mr-1">Quick Feedback:</span>
 {(['LOVE IT', 'GOOD ACCIDENT', 'KEEP THIS ERROR', 'LOST THE SUBJECT', 'TOO DESTROYED'] as UserFeedbackJudgment[]).map((fb) => (
 <button
 key={fb}
 type="button"
 onClick={() => {
 if (activeRunId) {
 recordUserFeedback(activeRunId, fb);
 setQuickFeedbackSelected(fb);
 }
 }}
 className={`px-2 py-1 text-[9px] font-display tracking-widest font-bold uppercase transition-colors border ${
 quickFeedbackSelected === fb
 ? 'bg-phosphor text-theme-bg border-phosphor shadow-[0_0_10px_var(--color-phosphor)]'
 : 'bg-theme-bg hover:bg-phosphor/10 text-phosphor border-phosphor/30'
 }`}
 >
 {fb}
 </button>
 ))}
 </div>

 {/* Quick Preserve Artifact Action */}
 <div className="flex items-center gap-2">
 {!showArtifactInput ? (
 <button
 type="button"
 onClick={() => setShowArtifactInput(true)}
 className="px-2.5 py-1 bg-theme-bg hover:bg-phosphor/10 text-phosphor border border-phosphor/30 text-[9px] font-display tracking-widest font-bold flex items-center gap-1 transition-colors terminal-border"
 >
 <Bookmark className="w-3 h-3 text-phosphor" />
 <span>Preserve Artifact</span>
 </button>
 ) : (
 <div className="flex items-center gap-1.5">
 <input
 type="text"
 value={quickArtifactInput}
 onChange={(e) => setQuickArtifactInput(e.target.value)}
 placeholder="Artifact name (e.g. skin delamination)..."
 className="bg-theme-bg border terminal-border px-2 py-0.5 text-[10px] font-mono text-phosphor focus:border-phosphor focus:outline-none focus:ring-1 focus:ring-phosphor placeholder:text-phosphor/30"
 />
 <button
 type="button"
 onClick={() => {
 if (activeRunId && quickArtifactInput.trim()) {
 addPreservedArtifact(activeRunId, {
 name: quickArtifactInput.trim(),
 action: 'PRESERVE',
 });
 setQuickArtifactSaved(true);
 setShowArtifactInput(false);
 setQuickArtifactInput('');
 setTimeout(() => setQuickArtifactSaved(false), 3000);
 }
 }}
 className="px-2 py-0.5 bg-phosphor text-theme-bg font-bold font-display uppercase tracking-widest text-[9px]"
 >
 Save
 </button>
 <button
 type="button"
 onClick={() => setShowArtifactInput(false)}
 className="text-phosphor/50 hover:text-phosphor text-[12px] px-1"
 >
 &times;
 </button>
 </div>
 )}
 {quickArtifactSaved && (
 <span className="text-phosphor font-bold font-display uppercase tracking-widest text-[9px]">Saved to Lab!</span>
 )}
 </div>
 </div>
 </div>

 {/* Collapsible David 8 Architectural Logic Map & Guidance Geometry */}
 {data.logicMap && data.logicMap.length > 0 && (
 <details className="group border terminal-border overflow-hidden bg-theme-panel">
 <summary className="p-4 cursor-pointer text-[11px] font-bold font-display uppercase tracking-widest text-phosphor select-none hover:bg-phosphor/5 transition-colors border-b terminal-border border-transparent group-open:">
 <div className="flex items-center justify-between w-full">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-phosphor" />
 <span>Guidance Geometry &amp; Architectural Logic Map</span>
 {data.contentDna && (
 <span className="ml-2 px-2 py-0.5 text-[9px] font-display uppercase tracking-widest bg-phosphor/10 border border-phosphor/30 text-phosphor flex items-center gap-1 terminal-border">
 <Dna className="w-3 h-3" />
 DNA Active
 </span>
 )}
 </div>
 <div className="flex items-center gap-2">
 {data.targetSummary && (
 <span className="text-[9px] font-display uppercase tracking-widest text-phosphor/50 hidden sm:inline">
 {data.targetSummary}
 </span>
 )}
 <span className="text-[9px] text-phosphor/40 font-display uppercase tracking-widest ml-2">Click to toggle</span>
 <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-phosphor/50" />
 </div>
 </div>
 </summary>

 <div className="p-4 space-y-4">
 {data.contentDna && (
 <div className="flex flex-wrap items-center gap-2 p-2.5 bg-theme-bg border terminal-border text-[9px] font-display tracking-widest uppercase text-phosphor/50">
 <span className="text-phosphor/30">CONTENT DNA:</span>
 <span className="text-phosphor font-bold">Seed [{data.contentDna.seedIdentity}]</span>
 <span className="text-phosphor/30">•</span>
 <span className="text-phosphor">{data.contentDna.lockedAnchors?.length || 0} Invariant Locks</span>
 <span className="text-phosphor/30">•</span>
 <span className="text-phosphor">{data.contentDna.activeAttractors?.length || 0} Attractors</span>
 <span className="text-phosphor/30">•</span>
 <span className="text-phosphor">{data.contentDna.activeOperators?.length || 0} Operators</span>
 <span className="text-phosphor/30">•</span>
 <span className="text-semantic-red">Medium: {data.contentDna.targetMedium.toUpperCase()}</span>
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
 {data.logicMap.map((item, index) => {
 const p = (item.phase || '').toUpperCase();
 let borderCls = 'border-phosphor/30 bg-theme-bg';
 let badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 let IconComp = Layers;

 if (p.includes('SEED')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = Compass;
 } else if (p.includes('LOCK')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = Lock;
 } else if (p.includes('ATTRACTOR')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = Magnet;
 } else if (p.includes('OPERATOR')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = Cpu;
 } else if (p.includes('INTERACTION') || p.includes('CHAIN')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = GitFork;
 } else if (p.includes('TARGET') || p.includes('TRANSLATION')) {
 borderCls = 'border-semantic-white/30 bg-theme-bg';
 badgeCls = 'text-phosphor/90 bg-semantic-white/10 border-semantic-white/30';
 IconComp = Sparkles;
 } else if (p.includes('ARTIFACT') || p.includes('PRESERVED')) {
 borderCls = 'border-phosphor/30 bg-theme-bg';
 badgeCls = 'text-phosphor bg-phosphor/10 border-phosphor/30';
 IconComp = Layers;
 } else if (p.includes('WARN')) {
 borderCls = 'border-semantic-red/30 bg-theme-bg';
 badgeCls = 'text-semantic-red bg-semantic-red/10 border-semantic-red/30';
 IconComp = AlertTriangle;
 }

 return (
 <div key={index} className={`p-3 border terminal-border ${borderCls} space-y-2`}>
 <div className="flex items-center gap-1.5">
 <span className={`px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-widest border ${badgeCls} inline-flex items-center gap-1`}>
 <IconComp className="w-3 h-3" />
 {item.phase}
 </span>
 </div>
 <p className="text-xs font-mono text-phosphor/80 leading-relaxed">{item.description}</p>
 </div>
 );
 })}
 </div>
 </div>
 </details>
 )}
 </div>
 );
};
