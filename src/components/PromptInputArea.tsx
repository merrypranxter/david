import React, { useState } from 'react';
import {
 TargetEngine,
 CommandMode,
 PresetItem,
 SlopSeedingConfig,
 ContradictionMode,
 OpenArtModel,
 GrokMode,
 StraitjacketLevel,
} from '../types';
import { PRESET_INCANTATIONS } from '../data/presets';
import { MATH_LEXICON, SCIENCE_LEXICON, generateRandomSeeds } from '../data/lexicons';
import { MERRY_DNA_BANKS } from '../data/merryDnaBanks';
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
 Layers, MessageSquare } from 'lucide-react';
import { ModularPipelineSection } from './ModularPipelineSection';
import { dispatchDavidIntent } from '../utils/davidWorkbenchBus';

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
 straitjacketLevel: StraitjacketLevel;
 setStraitjacketLevel: (lvl: StraitjacketLevel) => void;
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
  davidState?: 'IDLE' | 'READY' | 'SYNTHESIZING' | 'COMPLETE' | 'ERROR';
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
 straitjacketLevel,
 setStraitjacketLevel,
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
  davidState = 'IDLE',
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

 const parseSunoBuffers = (raw: string) => {
 const styleMatch = raw.match(/<<<SUNO_STYLE_SEED_START>>>\n?([\s\S]*?)\n?<<<SUNO_STYLE_SEED_END>>>/);
 const lyricsMatch = raw.match(/<<<SUNO_LYRICS_SEED_START>>>\n?([\s\S]*?)\n?<<<SUNO_LYRICS_SEED_END>>>/);
 if (styleMatch || lyricsMatch) {
 return { style: styleMatch?.[1] || '', lyrics: lyricsMatch?.[1] || '' };
 }
 return { style: raw || '', lyrics: '' };
 };

 const encodeSunoBuffers = (style: string, lyrics: string) =>
 `<<<SUNO_STYLE_SEED_START>>>\n${style}\n<<<SUNO_STYLE_SEED_END>>>\n<<<SUNO_LYRICS_SEED_START>>>\n${lyrics}\n<<<SUNO_LYRICS_SEED_END>>>`;

 const sunoBuffers = parseSunoBuffers(concept);
 const setSunoBuffer = (buffer: 'style' | 'lyrics', value: string) => {
 const nextStyle = buffer === 'style' ? value : sunoBuffers.style;
 const nextLyrics = buffer === 'lyrics' ? value : sunoBuffers.lyrics;
 setConcept(encodeSunoBuffers(nextStyle, nextLyrics));
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
 if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
 e.preventDefault();
 onSynthesize();
 }
 };

 const handleInsertTag = (tag: string) => {
 dispatchDavidIntent({
  source: 'quick-injection',
  label: `Quick Injection: ${tag}`,
  committed: true,
  changes: { add: tag, target },
 });
 };

 const getEntropyLabel = (lvl: number) => {
 if (lvl <= 2) return { text: 'Subtle Drift', color: 'text-phosphor', desc: 'Small semantic shifts; strong anchor preservation' };
 if (lvl <= 4) return { text: 'Mutation', color: 'text-phosphor', desc: 'A few structural transformations; mild attractor influence' };
 if (lvl <= 6) return { text: 'Structural Distortion', color: 'text-phosphor', desc: 'Multiple operators; ontology changes become possible' };
 if (lvl <= 8) return { text: 'Deep Reinterpretation', color: 'text-phosphor', desc: 'Competing systems, recursive reversal and strong conceptual drift' };
 return { text: 'Epistemic Collapse', color: 'text-semantic-red', desc: 'Aggressive representational mutation while protected anchors survive' };
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
 <div className="bg-theme-panel terminal-border p-4 sm:p-5 shadow-xl space-y-4 relative">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[10px] font-display font-bold uppercase tracking-widest">01 // SUBJECT</div>
 
 {/* Top Toolbar: Preset selector & Target Engine */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b terminal-border pb-3">
 {/* Preset Selector */}
 <div className="flex items-center gap-2">
 <Wand2 className="w-4 h-4 text-phosphor shrink-0" />
 <span className="text-xs font-display text-phosphor/70 uppercase tracking-wider">ARCHIVE:</span>
 <select
 id="seed-preset-select"
 value={selectedPresetId}
 onChange={(e) => {
 const id = e.target.value;
 setSelectedPresetId(id);
 const found = PRESET_INCANTATIONS.find((p) => p.id === id);
 if (found) onSelectPreset(found);
 }}
 className="bg-theme-bg terminal-border text-xs font-mono text-phosphor px-2.5 py-1.5 focus:outline-none focus:border-phosphor max-w-[280px] sm:max-w-[340px] appearance-none"
 >
 <option value="">Load preset...</option>
 {PRESET_INCANTATIONS.map((preset) => (
 <option key={preset.id} value={preset.id}>
 [{preset.category}] {preset.title}
 </option>
 ))}
 </select>
 </div>

 {/* Mode selector */}
 <div className="flex items-center gap-1.5 bg-theme-bg p-1 terminal-border self-start lg:self-auto">
 <span className="text-[11px] font-display text-phosphor/60 px-2 uppercase">CMD_MODE:</span>
 {(['dual', 'literal', 'slop', 'bypass'] as CommandMode[]).map((mode) => (
 <button
 key={mode}
 type="button"
 id={`mode-btn-${mode}`}
 onClick={() => setCommandMode(mode)}
 className={`text-xs font-mono px-2.5 py-1 transition-colors uppercase ${
 commandMode === mode
 ? 'bg-phosphor text-theme-bg'
 : 'text-phosphor/50 hover:text-phosphor hover:bg-phosphor/10'
 }`}
 >
 {mode}
 </button>
 ))}
 </div>
 </div>

 {/* Target Engine Selector */}
 <div>
 <label className="block text-[11px] font-display text-phosphor/60 mb-2 uppercase tracking-widest">
 02 // SELECT TARGET ENGINE
 </label>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
 {targetOptions.map((opt) => (
 <button
 key={opt.id}
 type="button"
 id={`target-engine-${opt.id}`}
 onClick={() => {
 setTarget(opt.id);
 if (opt.id === 'openart') setTargetLength(3100);
 else if (opt.id === 'grok') setTargetLength(1900);
 else if (opt.id === 'midjourney_flux') setTargetLength(1900);
 else if (opt.id === 'suno') setTargetLength(3800);
 else if (opt.id === 'llm_agent') setTargetLength(3800);
 else if (opt.id === 'void') setTargetLength(2850);
 }}
 className={`flex flex-col items-start p-2.5 border text-left transition-all ${
 target === opt.id
 ? 'border-phosphor bg-phosphor/10 text-phosphor shadow-md'
 : 'border-phosphor/20 bg-theme-panel text-phosphor/50 hover:border-phosphor/50 hover:text-phosphor'
 }`}
 >
 <div className="flex items-center gap-1.5 font-bold font-mono text-xs mb-0.5">
 <span className={target === opt.id ? 'text-phosphor phosphor-glow' : 'text-phosphor/40'}>{opt.icon}</span>
 <span>{opt.label}</span>
 </div>
 <span className="text-[10px] font-mono text-phosphor/50 line-clamp-1">{opt.desc}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Sub-engine & Length controls depending on Target */}
 <div className="bg-theme-panel terminal-border p-3 space-y-3 relative">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor/20 text-phosphor text-[9px] font-display uppercase tracking-widest border-b border-l terminal-border">03 // SUB-ROUTINES</div>
 
 {target === 'suno' ? (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono pt-3 sm:pt-0">
 <div className="flex items-center gap-2 text-phosphor">
 <Music className="w-4 h-4 text-phosphor shrink-0" />
 <span className="font-bold uppercase tracking-wider">Suno AI Audio Phenotype Protocol:</span>
 </div>
 <div className="flex items-center gap-2 text-phosphor/50 flex-wrap">
 <span className="px-2 py-0.5 bg-theme-bg terminal-border text-phosphor/80">
 Style Box: ~950 chars (cap 1,000)
 </span>
 <span className="px-2 py-0.5 bg-theme-bg terminal-border text-phosphor/80">
 Lyrics Box: ~2,800 chars (cap 3,000)
 </span>
 <button
 type="button"
 id="toggle-instrumental-btn"
 onClick={() => {
 const currentlyInstrumental = concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals');
 dispatchDavidIntent({
  source: 'instrumental-mode',
  label: currentlyInstrumental ? 'Disable Instrumental Mode' : 'Enable Instrumental Mode',
  committed: true,
  changes: {
   target,
   instrumental: !currentlyInstrumental,
   instruction: currentlyInstrumental
    ? 'Remove the instrumental/no-vocals constraint from MAIN PROMPT while preserving every unrelated instruction and lock.'
    : 'Make MAIN PROMPT explicitly instrumental/no-vocals while preserving every unrelated instruction and lock.',
  },
 });
 }}
 className={`px-2 py-0.5 border text-[11px] font-mono transition-colors ${
 concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals')
 ? 'bg-phosphor/20 text-phosphor border-phosphor/60 font-bold'
 : 'bg-theme-bg text-phosphor/50 terminal-border hover:text-phosphor'
 }`}
 >
 {concept.toLowerCase().includes('instrumental') || concept.toLowerCase().includes('no vocals')
 ? '✓ Instrumental Mode Active'
 : '+ Force Instrumental'}
 </button>
 </div>
 </div>
 ) : (
 <div className="space-y-2.5 pt-3 sm:pt-0">
 {/* Engine sub-options */}
 {target === 'openart' && (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b terminal-border pb-2">
 <div className="flex items-center gap-2 text-xs font-mono">
 <Palette className="w-4 h-4 text-phosphor shrink-0" />
 <span className="text-phosphor font-bold uppercase">OpenArt Sub-Model:</span>
 <div className="flex items-center gap-1 flex-wrap">
 {(['banana', 'nano_bananas', 'pro', 'light', 'seadream'] as OpenArtModel[]).map((m) => (
 <button
 key={m}
 type="button"
 onClick={() => setOpenArtModel(m)}
 className={`text-[11px] font-mono px-2 py-0.5 transition-colors ${
 openArtModel === m
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/50 font-bold'
 : 'bg-theme-bg text-phosphor/50 hover:text-phosphor border terminal-border'
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
 <span className="text-[10px] font-mono text-phosphor/50">
 {openArtModel === 'seadream' ? 'SeaDream dense visual prose (cap 3,200 chars)' : 'Natural observable phenomena (cap 3,200 chars)'}
 </span>
 </div>
 )}

 {target === 'midjourney_flux' && (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b terminal-border pb-2 text-xs font-mono">
 <div className="flex items-center gap-2 text-phosphor">
 <Eye className="w-4 h-4 text-phosphor shrink-0" />
 <span>Compact visual hierarchy (Subject → structural transformation → spatial → optics)</span>
 </div>
 <span className="text-[10px] font-mono text-phosphor/50">
 Parameters appended: <code className="text-phosphor/80">--ar 16:9 --v 6.1 --style raw</code> (cap 2,000 chars)
 </span>
 </div>
 )}

 {target === 'grok' && (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b terminal-border pb-2">
 <div className="flex items-center gap-2 text-xs font-mono">
 <Video className="w-4 h-4 text-phosphor shrink-0" />
 <span className="text-phosphor font-bold uppercase">Grok Engine Mode:</span>
 <div className="flex items-center gap-1">
 {(['grok_image', 'grok_video'] as GrokMode[]).map((gm) => (
 <button
 key={gm}
 type="button"
 onClick={() => {
 setGrokMode(gm);
 if (gm === 'grok_video') setTargetLength(1900);
 }}
 className={`text-[11px] font-mono px-2.5 py-0.5 transition-colors ${
 grokMode === gm
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/50 font-bold'
 : 'bg-theme-bg text-phosphor/50 hover:text-phosphor border terminal-border'
 }`}
 >
 {gm === 'grok_image' ? 'Grok Image' : 'Grok Video (Motion/Physics)'}
 </button>
 ))}
 </div>
 </div>
 <span className="text-[10px] font-mono text-phosphor/50">
 Grok video prompt capacity: <strong>~1,900-2,000 chars</strong>
 </span>
 </div>
 )}

 {/* Prompt Character Length Controller */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-phosphor/70 uppercase tracking-wider flex items-center gap-1">
 <Maximize2 className="w-3.5 h-3.5 text-phosphor" />
 <span>Target Output Capacity:</span>
 </span>
 <span className="text-phosphor font-bold px-2 py-0.5 bg-phosphor/10 border terminal-border">
 {targetLength} chars
 </span>
 <span className="text-[10px] text-phosphor/80 font-mono bg-phosphor/20 px-2 py-0.5 border font-bold terminal-border">
 90–95% Radical Saturation Active
 </span>
 <div className="flex items-center gap-1 flex-wrap mt-1 lg:mt-0">
 {[
 { label: '1,900 (Grok/Midjourney 95%)', val: 1900 },
 { label: '2,850 (Universal 95%)', val: 2850 },
 { label: '3,100 (OpenArt 97%)', val: 3100 },
 { label: '3,800 (Agent/Suno 95%)', val: 3800 },
 ].map((p) => (
 <button
 key={p.val}
 type="button"
 onClick={() => setTargetLength(p.val)}
 className={`text-[10px] font-mono px-2 py-0.5 transition-colors ${
 targetLength === p.val
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/50 font-bold'
 : 'bg-theme-bg text-phosphor/50 hover:text-phosphor border terminal-border'
 }`}
 >
 {p.label}
 </button>
 ))}
 </div>
 </div>

 <div className="flex items-center gap-2 sm:max-w-xs flex-1 mt-2 sm:mt-0">
 <input
 type="range"
 min={1000}
 max={4000}
 step={50}
 value={targetLength}
 onChange={(e) => setTargetLength(Number(e.target.value))}
 className="w-full cursor-pointer h-1 bg-phosphor/20 appearance-none"
 style={{ accentColor: 'var(--color-phosphor)' }}
 />
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Primary Concept / Suno Dual Buffers */}
 {target === 'suno' ? (
 <div className="relative pt-2 space-y-3">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[10px] font-display font-bold uppercase tracking-widest z-10">04 // SUNO DUAL INPUT</div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-3">
 <div className="bg-theme-bg terminal-border p-3 space-y-2">
 <div className="flex items-center justify-between gap-2">
 <label className="text-[11px] font-display text-phosphor uppercase tracking-widest flex items-center gap-1.5">
 <Music className="w-3.5 h-3.5" /> SUNO STYLE
 </label>
 <span className={`text-[10px] font-mono ${sunoBuffers.style.length > 999 ? 'text-semantic-red' : 'text-phosphor/60'}`}>
 {sunoBuffers.style.length}/999
 </span>
 </div>
 <textarea
 id="suno-style-seed-input"
 readOnly
 value={sunoBuffers.style}
 maxLength={999}
 onChange={(e) => setSunoBuffer('style', e.target.value)}
 onKeyDown={handleKeyDown}
 rows={5}
 placeholder="Music only: genre collisions, instrumentation, rhythm, production, timbre, acoustic space, vocal character, signal behavior..."
 className="w-full bg-theme-panel terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed"
 />
 <p className="text-[10px] font-mono text-phosphor/45 leading-relaxed">
 Style is its own organism. Hard ceiling: 999 characters. No lyric lines in this buffer.
 </p>
 </div>

 <div className="bg-theme-bg terminal-border p-3 space-y-2">
 <div className="flex items-center justify-between gap-2">
 <label className="text-[11px] font-display text-phosphor uppercase tracking-widest flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5" /> SUNO LYRICS
 </label>
 <span className={`text-[10px] font-mono ${sunoBuffers.lyrics.length > 3000 ? 'text-semantic-red' : 'text-phosphor/60'}`}>
 {sunoBuffers.lyrics.length}/3000
 </span>
 </div>
 <textarea
 id="suno-lyrics-seed-input"
 readOnly
 value={sunoBuffers.lyrics}
 maxLength={3000}
 onChange={(e) => setSunoBuffer('lyrics', e.target.value)}
 onKeyDown={handleKeyDown}
 rows={9}
 placeholder="Paste a poem, gibberish, phonetics, equations, Unicode, Zalgo-ready text, or actual lyrics here. David mutates THIS separately from the style."
 className="w-full bg-theme-panel terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed"
 />
 <div className="text-[10px] font-mono text-phosphor/45 leading-relaxed space-y-1">
 <p><span className="text-phosphor">BRACKET LAW:</span> anything not meant to be sung belongs in [square brackets].</p>
 <p>Examples: [Verse], [Chorus], [Whispered], [Instrumental], [Breakdown: voice fractures into granular static]. Text outside brackets is vocal content.</p>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="relative pt-2">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[10px] font-display font-bold uppercase tracking-widest z-10">04 // MAIN PROMPT // DAVID OWNED</div>
 <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
 <label className="text-[11px] font-display text-phosphor/60 uppercase tracking-widest flex items-center gap-1.5">
 <span>MAIN PROMPT:</span>
 <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold ${concept.length > 1000 ? 'bg-phosphor/20 text-phosphor border border-phosphor/30' : 'bg-theme-bg text-phosphor/40'}`}>
 {concept.length} chars
 </span>
 </label>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-mono text-phosphor bg-phosphor/10 px-2 py-0.5 border terminal-border">
 Target Output: ~{targetLength} chars (90–95% budget)
 </span>
 <span className="text-[10px] font-mono text-phosphor/40 hidden sm:inline">Ctrl/Cmd + Enter to compile</span>
 </div>
 </div>
 <textarea
 id="operative-concept-input"
 readOnly
 value={concept}
 onChange={(e) => {
 const val = e.target.value;
 setConcept(val);
 if (val.length > targetLength && val.length > 1200) {
 const ceiling = target === 'openart' ? 3100 : target === 'midjourney_flux' || target === 'grok' ? 1900 : 3800;
 setTargetLength(Math.min(ceiling, Math.max(targetLength, Math.floor(val.length * 1.1))));
 }
 }}
 onKeyDown={handleKeyDown}
 rows={3}
 placeholder="MAIN PROMPT is written by David in the app sidebar."
 className="w-full bg-theme-bg terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed"
 />
 <div className="flex flex-wrap items-center gap-1.5 mt-2">
 <span className="text-[10px] font-display text-phosphor/50 uppercase tracking-widest">INJECTIONS:</span>
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
 className="text-[10px] font-mono bg-theme-bg/70 hover:bg-phosphor/20 text-phosphor/70 hover:text-phosphor px-2 py-0.5 border terminal-border hover:border-phosphor transition-colors"
 >
 +{tag}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* AI SLOP SEEDING & CONTRADICTION MATRIX */}
 <div className="p-3.5 sm:p-4 bg-theme-panel terminal-border shadow-lg space-y-3.5 relative">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor/20 text-phosphor border-b border-l terminal-border text-[9px] font-display uppercase tracking-widest">05 // WEIRDNESS / LATENT INTERVENTION</div>
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b terminal-border pb-2.5 pt-3 sm:pt-0">
 <div className="flex items-center gap-2">
 <div className="p-1 bg-phosphor/20 text-phosphor border border-phosphor/40 terminal-border">
 <Zap className="w-4 h-4" />
 </div>
 <div>
 <span className="text-xs font-bold font-display text-phosphor uppercase tracking-wider">
 AI Slop Seeding &amp; Paradox Options
 </span>
 <p className="text-[10px] font-mono text-phosphor/50">
 Injected specifically into the [SLOP] Deluge prompt (keeps literal prompt clean)
 </p>
 </div>
 </div>
 
 <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
 {/* Mutant Selection Mode Toggle (Job 8, Part 34) */}
 <div className="flex items-center gap-1 bg-theme-bg terminal-border p-0.5 text-[11px] font-mono">
 <span className="text-phosphor/50 px-1.5 hidden md:inline">QD Engine:</span>
 <button
 type="button"
 onClick={() =>
 setSlopConfig((prev) => ({
 ...prev,
 mutantSelectionMode: prev.mutantSelectionMode === 'off' ? 'auto' : 'off',
 }))
 }
 className={`px-2 py-0.5 transition-colors ${
 slopConfig.mutantSelectionMode !== 'off'
 ? 'bg-phosphor/20 text-phosphor font-bold border border-phosphor/40'
 : 'text-phosphor/50 hover:text-phosphor'
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
 className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-bg hover:bg-phosphor/10 text-phosphor border border-phosphor/40 text-[11px] font-display uppercase tracking-widest transition-colors terminal-border"
 >
 <Sparkles className="w-3.5 h-3.5 text-phosphor" />
 <span>Mutation Lab &amp; Vault</span>
 {((slopConfig.selectedOperators?.length || 0) > 0 || (slopConfig.selectedAttractors?.length || 0) > 0) && (
 <span className="w-2 h-2 bg-phosphor animate-pulse" />
 )}
 </button>
 </div>
 </div>

 {/* Active Mutation Strip (Job 7) */}
 {((slopConfig.selectedOperators?.length || 0) > 0 ||
 (slopConfig.selectedAttractors?.length || 0) > 0 ||
 (slopConfig.selectedPressures?.length || 0) > 0 ||
 (slopConfig.protectedAnchors?.length || 0) > 0) && (
 <div className="flex items-center gap-2 flex-wrap py-1.5 px-3 bg-theme-bg terminal-border text-[11px] font-mono">
 <span className="text-phosphor/50 uppercase font-bold">Active Mutation:</span>
 {slopConfig.mutationMode === 'curated' && (
 <span className="px-1.5 py-0.2 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 CURATED MODE
 </span>
 )}
 {(slopConfig.selectedOperators?.length || 0) > 0 && (
 <span className="px-1.5 py-0.2 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {slopConfig.selectedOperators?.length} Operators
 </span>
 )}
 {(slopConfig.selectedAttractors?.length || 0) > 0 && (
 <span className="px-1.5 py-0.2 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {slopConfig.selectedAttractors?.length} Fauna
 </span>
 )}
 {(slopConfig.selectedPressures?.length || 0) > 0 && (
 <span className="px-1.5 py-0.2 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {slopConfig.selectedPressures?.length} Pressures
 </span>
 )}
 {(slopConfig.protectedAnchors?.length || 0) > 0 && (
 <span className="px-1.5 py-0.2 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 Anchors: {slopConfig.protectedAnchors?.join(', ')}
 </span>
 )}
 </div>
 )}

 {/* PARADOX ENGINE TOGGLE CARD */}
 <div
 id="paradox-engine-card"
 className={`p-3.5 border transition-all ${
 slopConfig.enableParadoxEngine
 ? 'bg-semantic-red/10 border-semantic-red shadow-[0_0_15px_var(--color-semantic-red-30)]'
 : 'bg-theme-bg terminal-border text-phosphor/50'
 }`}
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-start sm:items-center gap-2.5">
 <div
 className={`p-1.5 border shrink-0 transition-colors ${
 slopConfig.enableParadoxEngine
 ? 'bg-semantic-red/20 text-semantic-red border-semantic-red/50 shadow-inner'
 : 'bg-theme-bg text-phosphor/30 terminal-border'
 }`}
 >
 <Infinity className={`w-4 h-4 ${slopConfig.enableParadoxEngine ? 'animate-pulse text-semantic-red' : ''}`} />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-bold font-display uppercase tracking-widest text-phosphor">
 Paradox Engine
 </span>
 <span
 className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase tracking-wider ${
 slopConfig.enableParadoxEngine
 ? 'bg-semantic-red/20 text-semantic-red border border-semantic-red/40'
 : 'bg-theme-bg text-phosphor/40 border terminal-border'
 }`}
 >
 {slopConfig.enableParadoxEngine ? 'ACTIVE // LOGIC DEFIANCE ENGAGED' : 'STANDBY // BYPASSED'}
 </span>
 </div>
 <p className="text-[10px] font-mono text-phosphor/50 mt-0.5">
 Injects logic-defying combinations, ontological contradictions, and impossible constraints directly into prompt generation
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
 <span className="text-[11px] font-display uppercase tracking-widest text-phosphor/80 select-none">
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
 className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
 slopConfig.enableParadoxEngine ? 'bg-semantic-red' : 'bg-theme-bg terminal-border'
 }`}
 role="switch"
 aria-checked={slopConfig.enableParadoxEngine}
 title={slopConfig.enableParadoxEngine ? 'Disable Paradox Engine' : 'Enable Paradox Engine'}
 >
 <span
 className={`pointer-events-none inline-block h-5 w-5 transform shadow ring-0 transition duration-200 ease-in-out ${
 slopConfig.enableParadoxEngine ? 'translate-x-5 bg-theme-panel' : 'translate-x-0 bg-phosphor/30'
 }`}
 />
 </button>
 </div>
 </div>

 {/* Quick Impossible Constraints (When Paradox Engine is Active) */}
 {slopConfig.enableParadoxEngine && (
 <div className="mt-2.5 pt-2.5 border-t border-semantic-red/20 terminal-border">
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <span className="text-[10px] font-mono text-semantic-red uppercase tracking-wider flex items-center gap-1">
 <Sparkles className="w-3 h-3 text-semantic-red" />
 <span>Quick Impossible Constraints:</span>
 </span>
 <span className="text-[10px] font-mono text-phosphor/50">Click to inject into slop seeds</span>
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
 className={`text-[10px] font-mono px-2 py-0.5 border transition-colors flex items-center gap-1 ${
 isSelected
 ? 'bg-semantic-red/30 text-semantic-red border-semantic-red font-bold'
 : 'bg-theme-bg/80 hover:bg-phosphor/10 text-phosphor/70 terminal-border hover:border-phosphor/50 hover:text-phosphor'
 }`}
 >
 {isSelected ? <Check className="w-2.5 h-2.5 text-semantic-red" /> : <Plus className="w-2.5 h-2.5 text-phosphor/50" />}
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
 className={`p-3 border transition-all ${
 slopConfig.addMaths
 ? 'bg-phosphor/10 border-phosphor text-phosphor'
 : 'bg-theme-bg terminal-border text-phosphor/50'
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <label className="flex items-center gap-2 cursor-pointer select-none">
 <input
 type="checkbox"
 id="add-maths-checkbox"
 checked={slopConfig.addMaths}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, addMaths: e.target.checked }))}
 className="bg-theme-panel text-phosphor focus:ring-0 terminal-border"
 />
 <Binary className="w-4 h-4 text-phosphor" />
 <span className="text-[11px] font-bold font-display uppercase tracking-widest">
 + Add Maths
 </span>
 </label>
 <span className="text-[10px] font-mono px-1.5 py-0.5 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {MATH_LEXICON.length} Nodes
 </span>
 </div>
 <select
 value={slopConfig.mathCategory || ''}
 disabled={!slopConfig.addMaths}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, mathCategory: e.target.value || undefined }))}
 className="w-full bg-theme-panel border terminal-border text-[11px] font-mono text-phosphor px-2 py-1 focus:outline-none focus:border-phosphor disabled:opacity-40"
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
 className={`p-3 border transition-all ${
 slopConfig.addSciences
 ? 'bg-phosphor/10 border-phosphor text-phosphor'
 : 'bg-theme-bg terminal-border text-phosphor/50'
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <label className="flex items-center gap-2 cursor-pointer select-none">
 <input
 type="checkbox"
 id="add-sciences-checkbox"
 checked={slopConfig.addSciences}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, addSciences: e.target.checked }))}
 className="bg-theme-panel text-phosphor focus:ring-0 terminal-border"
 />
 <Atom className="w-4 h-4 text-phosphor" />
 <span className="text-[11px] font-bold font-display uppercase tracking-widest">
 + Add Sciences
 </span>
 </label>
 <span className="text-[10px] font-mono px-1.5 py-0.5 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {SCIENCE_LEXICON.length} Nodes
 </span>
 </div>
 <select
 value={slopConfig.scienceCategory || ''}
 disabled={!slopConfig.addSciences}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, scienceCategory: e.target.value || undefined }))}
 className="w-full bg-theme-panel border terminal-border text-[11px] font-mono text-phosphor px-2 py-1 focus:outline-none focus:border-phosphor disabled:opacity-40"
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
 className={`p-3 border transition-all ${
 slopConfig.addSlop
 ? 'bg-phosphor/10 border-phosphor text-phosphor'
 : 'bg-theme-bg terminal-border text-phosphor/50'
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <label className="flex items-center gap-2 cursor-pointer select-none">
 <input
 type="checkbox"
 id="add-slop-checkbox"
 checked={slopConfig.addSlop}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, addSlop: e.target.checked }))}
 className="bg-theme-panel text-phosphor focus:ring-0 terminal-border"
 />
 <Zap className="w-4 h-4 text-phosphor" />
 <span className="text-[11px] font-bold font-display uppercase tracking-widest">
 + Add Slop
 </span>
 </label>
 <span className="text-[10px] font-mono px-1.5 py-0.5 bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border">
 {MERRY_DNA_BANKS.length} Merry DNA Categories
 </span>
 </div>
 <select
 value={slopConfig.slopCategory || ''}
 disabled={!slopConfig.addSlop}
 onChange={(e) => setSlopConfig((prev) => ({ ...prev, slopCategory: e.target.value || undefined }))}
 className="w-full bg-theme-panel border terminal-border text-[11px] font-mono text-phosphor px-2 py-1 focus:outline-none focus:border-phosphor disabled:opacity-40"
 >
 <option value="">Random / All Internet &amp; Glitch Slop</option>
 {MERRY_DNA_BANKS.map((sl) => (
 <option key={sl.id} value={sl.id}>
 {sl.name}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* Contradiction & Paradox Logic Bar */}
 <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t terminal-border/80 terminal-border">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-display text-phosphor/60 uppercase tracking-widest flex items-center gap-1.5">
 <span>Contradiction Mode:</span>
 {!slopConfig.enableParadoxEngine && (
 <span className="text-[10px] text-phosphor/40 font-mono italic">(Engine Standby)</span>
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
 className={`text-[11px] font-mono px-2.5 py-1 transition-colors ${
 slopConfig.contradictionMode === mode.id && slopConfig.enableParadoxEngine
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/50 font-bold'
 : 'bg-theme-bg text-phosphor/50 hover:text-phosphor border terminal-border'
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
 className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-phosphor/20 hover:bg-phosphor/30 text-phosphor border border-phosphor/40 text-[11px] font-display uppercase tracking-widest transition-colors font-bold terminal-border"
 >
 <Dices className="w-4 h-4 text-phosphor" />
 <span>Roll Random Seeds</span>
 </button>
 </div>

 {/* Display Active Seeds & Generated Paradox Notes */}
 {(slopConfig.selectedSeeds.length > 0 || activeParadoxNotes.length > 0) && (
 <div className="bg-theme-bg/60 p-3 border terminal-border space-y-2">
 {slopConfig.selectedSeeds.length > 0 && (
 <div className="flex flex-wrap items-center gap-1.5">
 <span className="text-[10px] font-display text-phosphor/50 uppercase tracking-widest">SEEDED:</span>
 {slopConfig.selectedSeeds.map((seed) => (
 <span
 key={seed}
 className="inline-flex items-center gap-1 bg-theme-bg border terminal-border text-phosphor px-2 py-0.5 text-[11px] font-mono"
 >
 <span>{seed}</span>
 <button
 type="button"
 onClick={() => handleRemoveSeed(seed)}
 className="text-phosphor/50 hover:text-semantic-red ml-0.5"
 >
 &times;
 </button>
 </span>
 ))}
 </div>
 )}
 {activeParadoxNotes.map((note, idx) => (
 <div key={idx} className="text-[11px] font-mono text-phosphor/90 italic">
 <span className="font-bold">WRN //</span> {note}
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

 {/* Bottom Controls: Straitjacket, Entropy Slider & Compile Button */}
 <div className="flex flex-col gap-4 pt-4 border-t terminal-border relative">
 <div className="absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[9px] font-display uppercase tracking-widest font-bold z-10">06 // COMPILER DIRECTIVES</div>
 {/* Straitjacket Control */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
 <div className="space-y-2 flex-1 w-full sm:max-w-xl">
 <div className="flex items-center gap-1.5 text-[11px] font-display uppercase tracking-widest text-phosphor/80">
 <Layers className="w-3.5 h-3.5 text-phosphor" />
 <span>Straitjacket Constraint:</span>
 </div>
 <div className="grid grid-cols-5 gap-1 p-1 bg-theme-bg border terminal-border">
 {(['normal', 'loosen', 'misinterpret', 'destabilize', 'remove_subject'] as const).map((level) => (
 <button
 key={level}
 type="button"
 onClick={() => setStraitjacketLevel(level)}
 className={`px-2 py-1.5 text-[9px] sm:text-[10px] font-display font-medium transition-colors text-center uppercase tracking-wider ${
 straitjacketLevel === level
 ? 'bg-phosphor/20 text-phosphor border border-phosphor/50 shadow-sm'
 : 'text-phosphor/50 hover:text-phosphor hover:bg-phosphor/10 border border-transparent'
 }`}
 title={`Set straitjacket constraint to ${level}`}
 >
 {level.replace('_', ' ')}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
 {/* Entropy Slider */}
 <div className="space-y-1 sm:max-w-xs flex-1">
 <div className="flex justify-between items-center text-[11px] font-display uppercase tracking-widest">
 <span className="text-phosphor/80 flex items-center gap-1">
 <Flame className="w-3.5 h-3.5 text-semantic-red" />
 <span>Entropy Depth [S-Scale]:</span>
 </span>
 <span className={`font-bold font-mono ${
 entropyLevel <= 3 ? 'text-phosphor' : entropyLevel <= 7 ? 'text-phosphor' : 'text-semantic-red animate-pulse'
 }`}>
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
 className="w-full cursor-pointer h-1 bg-phosphor/20 appearance-none mt-2"
 style={{ accentColor: entropyLevel <= 3 ? 'var(--color-phosphor)' : entropyLevel <= 7 ? 'var(--color-phosphor)' : 'var(--color-semantic-red)' }}
 />
 <div className="flex justify-between text-[9px] font-display uppercase tracking-widest text-phosphor/50 mt-1">
 <span>S1 (Subtle)</span>
 <span>S5 (Distortion)</span>
 <span>S10 (Collapse)</span>
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
 className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-display font-bold uppercase tracking-widest border border-phosphor/40 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm terminal-border"
 title="Save current setup, seeds, matrices, and targets into a reusable Slop Recipe"
 >
 <Bookmark className="w-3.5 h-3.5 text-phosphor" />
 <span>Save Recipe</span>
 </button>
 )}

 {/* Open Recipes Vault Button */}
 {onOpenRecipes && (
 <button
 type="button"
 id="open-recipes-trigger-btn"
 onClick={onOpenRecipes}
 className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-display font-bold uppercase tracking-widest border terminal-border bg-theme-bg hover:bg-phosphor/10 text-phosphor/80 hover:text-phosphor transition-colors shadow-sm"
 title="View, load, or export saved Slop Recipes"
 >
 <FolderHeart className="w-3.5 h-3.5 text-phosphor" />
 <span>Recipes Vault</span>
 </button>
 )}

 {/* Search Grounding toggle */}
 <label className="flex items-center gap-1.5 text-[11px] font-display uppercase tracking-widest text-phosphor/70 cursor-pointer select-none">
 <input
 type="checkbox"
 id="search-grounding-checkbox"
 checked={useSearch}
 onChange={(e) => setUseSearch(e.target.checked)}
 className="bg-theme-panel text-phosphor focus:ring-0 focus:ring-offset-0 terminal-border"
 />
 <Search className="w-3.5 h-3.5 text-phosphor" />
 <span>Search Grounding</span>
 </label>

 {/* Synthesize Button */}
 
            
            <button
 type="button"
 id="synthesize-button"
 onClick={onSynthesize}
 disabled={isSynthesizing || !concept.trim()}
 className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold font-display uppercase tracking-[0.2em] transition-all shadow-lg ${
 isSynthesizing || !concept.trim()
 ? 'bg-theme-bg text-phosphor/30 cursor-not-allowed border terminal-border'
 : 'bg-phosphor text-theme-bg shadow-[0_0_15px_var(--color-phosphor)] hover:bg-phosphor hover:shadow-[0_0_15px_var(--color-phosphor)] cursor-pointer active:scale-95 border border-transparent'
 }`}
 >
 
                  {davidState === 'SYNTHESIZING' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-phosphor/50 border-t-transparent animate-spin " />
                      <span>SYNTHESIZING...</span>
                    </>
                  ) : davidState === 'COMPLETE' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ORGANISM COMPILED</span>
                    </>
                  ) : (
                    <>
                      <CornerDownLeft className="w-4 h-4" />
                      <span>BEGIN SYNTHESIS</span>
                    </>
                  )}

 </button>

 </div>
 </div>
 </div>
 </div>
);
};
