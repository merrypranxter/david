import React, { useState, useMemo } from 'react';
import {
 SLOP_METHODS_LIBRARY,
 applyDestructiveVocabBan,
} from '../data/slopMethods';
import {
 Check,
 Copy,
 Terminal,
 BookOpen,
 Sparkles,
 AlertTriangle,
 Flame,
 CheckCircle2,
 Cpu,
 Layers,
 ArrowRight,
 ShieldAlert,
 Zap,
} from 'lucide-react';

interface SlopMethodsTabProps {
 currentConcept: string;
 onApplyConcept?: (concept: string) => void;
 entropyLevel: number;
}

export const SlopMethodsTab: React.FC<SlopMethodsTabProps> = ({
 currentConcept,
 onApplyConcept,
 entropyLevel,
}) => {
 const [subTab, setSubTab] = useState<
 'specimens' | 'predicate' | 'protocols' | 'syntax' | 'archives'
 >('specimens');
 const [searchTerm, setSearchTerm] = useState<string>('');
 const [copiedId, setCopiedId] = useState<string | null>(null);

 // Structural Test interactive checker state
 const [testText, setTestText] = useState<string>(currentConcept || '');

 // Copy helper
 const handleCopy = (text: string, id: string) => {
 navigator.clipboard.writeText(text);
 setCopiedId(id);
 setTimeout(() => setCopiedId(null), 2000);
 };

 // Heuristic analysis of test text for banned words
 const bannedVerbsFound = useMemo(() => {
 const banned = [
 'dissolve',
 'melt',
 'morph',
 'transform',
 'break apart',
 'shatter',
 'glitchy',
 'iridescent',
 'surreal',
 'bismuth textures',
 '8k',
 'photorealistic',
 ];
 const lower = testText.toLowerCase();
 return banned.filter((word) => lower.includes(word));
 }, [testText]);

 // Scrubbed version
 const handleAutoScrub = () => {
 const scrubbed = applyDestructiveVocabBan(testText);
 setTestText(scrubbed);
 };

 // Protocols extraction
 const wCoeffProtocol = useMemo(
 () => SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'w_coeff'),
 []
 );
 const antiClicheProtocol = useMemo(
 () => SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'anticliche_scrub'),
 []
 );
 const residueProtocol = useMemo(
 () => SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'recursion'),
 []
 );
 const baseRotationProtocol = useMemo(
 () => SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'base_rotation'),
 []
 );
 const familyResemblanceProtocol = useMemo(
 () => SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'family_resemblance'),
 []
 );

 // Syntax Injection formats
 const syntaxOp = useMemo(
 () => SLOP_METHODS_LIBRARY.operators.find((o) => o.id === 'syntax_injection'),
 []
 );
 const syntaxFormats = syntaxOp?.formats || {};

 // Calibration specimens
 const specimens = SLOP_METHODS_LIBRARY.mechanism_bank.calibration_specimens;

 const filteredSpecimens = useMemo(() => {
 if (!searchTerm.trim()) return specimens;
 const q = searchTerm.toLowerCase();
 return specimens.filter((s) => s.toLowerCase().includes(q));
 }, [specimens, searchTerm]);

 return (
 <div className="space-y-4">
 {/* Sub-navigation bar */}
 <div className="flex items-center justify-between border-b terminal-border pb-2.5 flex-wrap gap-2">
 <div className="flex items-center gap-1 bg-theme-panel border terminal-border p-0.5 text-xs font-mono">
 <button
 type="button"
 onClick={() => setSubTab('specimens')}
 className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
 subTab === 'specimens'
 ? 'bg-phosphor/20 text-phosphor font-bold border border-phosphor/40'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 <Sparkles className="w-3.5 h-3.5 text-phosphor" />
 <span>15 SPECIMENS</span>
 </button>

 <button
 type="button"
 onClick={() => setSubTab('predicate')}
 className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
 subTab === 'predicate'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 <ShieldAlert className="w-3.5 h-3.5 text-phosphor" />
 <span>GATING PREDICATE</span>
 </button>

 <button
 type="button"
 onClick={() => setSubTab('protocols')}
 className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
 subTab === 'protocols'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 <Layers className="w-3.5 h-3.5 text-phosphor" />
 <span>PROTOCOLS (W_COEFF)</span>
 </button>

 <button
 type="button"
 onClick={() => setSubTab('syntax')}
 className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
 subTab === 'syntax'
 ? 'bg-phosphor/10 text-phosphor font-bold border border-phosphor/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 <Terminal className="w-3.5 h-3.5 text-phosphor" />
 <span>SYNTAX VECTORS</span>
 </button>

 <button
 type="button"
 onClick={() => setSubTab('archives')}
 className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
 subTab === 'archives'
 ? 'bg-semantic-red/10 text-semantic-red font-bold border border-semantic-red/30 terminal-border'
 : 'text-phosphor/80 hover:text-phosphor'
 }`}
 >
 <BookOpen className="w-3.5 h-3.5 text-semantic-red" />
 <span>RESEARCH ARCHIVES</span>
 </button>
 </div>

 <span className="text-[11px] font-mono text-phosphor/50 hidden sm:inline">
 David 8 Slop Methods &bull; Mathematical Rigor
 </span>
 </div>

 {/* ========================================================= */}
 {/* SUBTAB 1: 15 CALIBRATION SPECIMENS */}
 {/* ========================================================= */}
 {subTab === 'specimens' && (
 <div className="space-y-3">
 <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
 <span className="text-phosphor/80">
 Gold-standard benchmark specimens demonstrating pure structural mutation over decorative adjectives:
 </span>
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Search specimens..."
 className="px-2.5 py-1 bg-theme-panel border terminal-border text-xs font-mono text-phosphor placeholder-phosphor/50 focus:outline-none focus:border-phosphor/50"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {filteredSpecimens.map((specimenText, idx) => {
 const specId = `specimen-${idx}`;
 const isCopied = copiedId === specId;
 const [title, ...descParts] = specimenText.split(': ');
 const description = descParts.join(': ');

 return (
 <div
 key={specId}
 className="p-3.5 border border-phosphor/25 bg-theme-panel hover:border-phosphor/50 transition-colors flex flex-col justify-between space-y-2.5 terminal-border"
 >
 <div>
 <div className="flex items-center justify-between gap-2 mb-1.5">
 <span className="text-xs font-bold font-mono text-phosphor capitalize">
 {title}
 </span>
 <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 uppercase terminal-border">
 Specimen #{idx + 1}
 </span>
 </div>

 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed bg-theme-bg p-2.5 border terminal-border select-all">
 "{description || specimenText}"
 </p>
 </div>

 <div className="pt-2 border-t terminal-border flex items-center justify-between gap-2">
 <span className="text-[10px] font-mono text-phosphor/50">
 Deterministic Topology
 </span>
 <div className="flex items-center gap-1.5">
 {onApplyConcept && (
 <button
 type="button"
 onClick={() => onApplyConcept(specimenText)}
 className="px-2 py-1 bg-phosphor/80 hover:bg-phosphor/10 text-phosphor border border-phosphor/60 text-[11px] font-mono flex items-center gap-1 transition-colors terminal-border"
 title="Apply this exact specimen into David's concept buffer"
 >
 <ArrowRight className="w-3 h-3" />
 <span>Load Concept</span>
 </button>
 )}
 <button
 type="button"
 onClick={() => handleCopy(specimenText, specId)}
 className="px-2 py-1 bg-theme-panel hover:bg-phosphor/10 text-phosphor/80 text-[11px] font-mono flex items-center gap-1 transition-colors"
 >
 {isCopied ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>{isCopied ? 'Copied' : 'Copy'}</span>
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================================= */}
 {/* SUBTAB 2: STRUCTURAL TEST GATING PREDICATE */}
 {/* ========================================================= */}
 {subTab === 'predicate' && (
 <div className="space-y-4">
 <div className="p-3.5 border border-phosphor/30 terminal-border bg-phosphor/10">
 <h4 className="text-xs font-bold font-mono text-phosphor uppercase tracking-wider mb-1 flex items-center gap-1.5">
 <ShieldAlert className="w-4 h-4 text-phosphor" />
 The Structural Test Gating Predicate
 </h4>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {SLOP_METHODS_LIBRARY.predicate.description}
 </p>
 </div>

 {/* 3 Core Rules Breakdown */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {SLOP_METHODS_LIBRARY.predicate.tests.map((testStr, testIdx) => (
 <div
 key={testStr}
 className="p-3 border terminal-border bg-theme-panel space-y-1.5"
 >
 <div className="flex items-center gap-2">
 <span className="w-5 h-5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border text-[10px] font-bold font-mono flex items-center justify-center">
 {testIdx + 1}
 </span>
 <h5 className="text-xs font-bold font-mono text-phosphor">
 Criterion {testIdx + 1}
 </h5>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 leading-snug">
 "{testStr}"
 </p>
 </div>
 ))}
 </div>

 {/* Side by side Fail vs Pass */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div className="p-3 border border-semantic-red/30 terminal-border bg-semantic-red/10 space-y-1.5">
 <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-semantic-red">
 <AlertTriangle className="w-4 h-4 text-semantic-red" />
 <span>FAILS STRUCTURAL TEST (Adjective Soup / AI Slop)</span>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 italic bg-theme-bg p-2.5 border border-semantic-red/30 terminal-border">
 "{SLOP_METHODS_LIBRARY.predicate.fail_example}"
 </p>
 <p className="text-[10px] font-mono text-phosphor/80">
 Why it fails: Normal human body with decorative adjective decals. Deleting "fractal" leaves an ordinary woman.
 </p>
 </div>

 <div className="p-3 border border-phosphor/30 terminal-border bg-phosphor/10 space-y-1.5">
 <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-phosphor">
 <CheckCircle2 className="w-4 h-4 text-phosphor" />
 <span>PASSES STRUCTURAL TEST (Topological Law)</span>
 </div>
 <p className="text-[11px] font-mono text-phosphor/80 italic bg-theme-bg p-2.5 border border-phosphor/30 terminal-border">
 "{SLOP_METHODS_LIBRARY.predicate.pass_example}"
 </p>
 <p className="text-[10px] font-mono text-phosphor/80">
 Why it passes: Rewrites the geometric boundary of interior and exterior. The strangeness is an inviolable rule.
 </p>
 </div>
 </div>

 {/* Interactive Tester Box */}
 <div className="p-3.5 border terminal-border bg-theme-panel space-y-3">
 <div className="flex items-center justify-between">
 <h5 className="text-xs font-bold font-mono text-phosphor">
 Interactive Concept Structural Check
 </h5>
 <div className="flex items-center gap-2">
 {bannedVerbsFound.length > 0 && (
 <button
 type="button"
 onClick={handleAutoScrub}
 className="px-2 py-1 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border text-[10px] font-mono transition-colors"
 >
 Auto-Scrub Banned Verbs ({bannedVerbsFound.length})
 </button>
 )}
 {onApplyConcept && (
 <button
 type="button"
 onClick={() => onApplyConcept(testText)}
 className="px-2.5 py-1 bg-phosphor/30 hover:bg-phosphor/50 text-phosphor border border-phosphor/50 text-[10px] font-mono transition-colors terminal-border"
 >
 Load into Concept
 </button>
 )}
 </div>
 </div>

 <textarea
 value={testText}
 onChange={(e) => setTestText(e.target.value)}
 rows={3}
 className="w-full bg-theme-bg border terminal-border p-2.5 text-xs font-mono text-phosphor placeholder-phosphor/50 focus:outline-none focus:border-phosphor/30 terminal-border leading-relaxed"
 placeholder="Enter a prompt sentence or concept to audit against structural test predicates..."
 />

 {bannedVerbsFound.length > 0 ? (
 <div className="p-2 bg-semantic-red/10 border border-semantic-red/30 terminal-border text-[11px] font-mono text-semantic-red flex items-center justify-between gap-2">
 <span>
 Banned destructive verbs detected: <strong>{bannedVerbsFound.join(', ')}</strong>.
 Substitute deterministic topological verbs (evert, retopologize, planar unwrap, facet).
 </span>
 </div>
 ) : (
 <div className="p-2 bg-phosphor/10 border border-phosphor/30 terminal-border text-[11px] font-mono text-phosphor flex items-center gap-2">
 <Check className="w-3.5 h-3.5 text-phosphor" />
 <span>Zero banned destructive verbs found. Concept uses structural, topological, or physical constraints.</span>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ========================================================= */}
 {/* SUBTAB 3: PROTOCOLS & WEIRDNESS COEFFICIENT */}
 {/* ========================================================= */}
 {subTab === 'protocols' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2">
 <span className="text-phosphor font-bold uppercase tracking-wider">
 Weirdness Coefficient (w_coeff) & Protocols
 </span>
 <p className="text-[11px] text-phosphor/80 mt-0.5">
 Strictly calibrates how far latent mutation wanders from standard consensus reality:
 </p>
 </div>

 {wCoeffProtocol && wCoeffProtocol.bands && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {wCoeffProtocol.bands.map((band) => (
 <div
 key={band.label}
 className="p-3.5 border terminal-border bg-theme-panel space-y-1.5"
 >
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold font-mono text-phosphor">
 Level {band.range[0]} - {band.range[1]}
 </span>
 <span className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor uppercase">
 {band.label}
 </span>
 </div>
 <div className="text-[11px] font-mono text-phosphor/80">
 Permitted Operators:
 </div>
 <div className="flex flex-wrap gap-1">
 {band.permits.map((p) => (
 <span
 key={p}
 className="px-1.5 py-0.5 bg-theme-panel text-[10px] font-mono text-phosphor/80"
 >
 {p}
 </span>
 ))}
 </div>
 {band.note && (
 <p className="text-[10px] font-mono text-phosphor/50 italic pt-1">
 {band.note}
 </p>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Operational Protocols */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
 {antiClicheProtocol && (
 <div className="p-3.5 border terminal-border bg-theme-panel space-y-1">
 <h5 className="text-xs font-bold font-mono text-phosphor flex items-center gap-1.5">
 <CheckCircle2 className="w-3.5 h-3.5 text-phosphor" />
 {antiClicheProtocol.name}
 </h5>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {antiClicheProtocol.description}
 </p>
 {antiClicheProtocol.operation && (
 <p className="text-[10px] font-mono text-phosphor/90 italic pt-1">
 Rule: "{antiClicheProtocol.operation}"
 </p>
 )}
 </div>
 )}

 {residueProtocol && (
 <div className="p-3.5 border terminal-border bg-theme-panel space-y-1">
 <h5 className="text-xs font-bold font-mono text-phosphor flex items-center gap-1.5">
 <Flame className="w-3.5 h-3.5 text-phosphor" />
 {residueProtocol.name}
 </h5>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {residueProtocol.description}
 </p>
 {residueProtocol.steps && (
 <ul className="list-disc pl-4 text-[10px] font-mono text-phosphor/80 space-y-0.5 pt-1">
 {residueProtocol.steps.map((step, idx) => (
 <li key={idx}>{step}</li>
 ))}
 </ul>
 )}
 </div>
 )}

 {baseRotationProtocol && (
 <div className="p-3.5 border terminal-border bg-theme-panel space-y-1">
 <h5 className="text-xs font-bold font-mono text-phosphor flex items-center gap-1.5">
 <Cpu className="w-3.5 h-3.5 text-phosphor" />
 {baseRotationProtocol.name}
 </h5>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {baseRotationProtocol.description}
 </p>
 {baseRotationProtocol.bank && (
 <div className="flex flex-wrap gap-1 pt-1">
 {baseRotationProtocol.bank.map((b) => (
 <span
 key={b}
 className="px-1.5 py-0.5 bg-theme-panel text-[9px] font-mono text-phosphor"
 >
 {b}
 </span>
 ))}
 </div>
 )}
 </div>
 )}

 {familyResemblanceProtocol && (
 <div className="p-3.5 border terminal-border bg-theme-panel space-y-1">
 <h5 className="text-xs font-bold font-mono text-phosphor flex items-center gap-1.5">
 <Layers className="w-3.5 h-3.5 text-phosphor" />
 {familyResemblanceProtocol.name}
 </h5>
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {familyResemblanceProtocol.description}
 </p>
 {familyResemblanceProtocol.operation && (
 <p className="text-[10px] font-mono text-phosphor/90 italic pt-1">
 Directive: "{familyResemblanceProtocol.operation}"
 </p>
 )}
 </div>
 )}
 </div>
 </div>
 )}

 {/* ========================================================= */}
 {/* SUBTAB 4: FOREIGN SYNTAX INJECTION VECTORS */}
 {/* ========================================================= */}
 {subTab === 'syntax' && (
 <div className="space-y-3">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2">
 <span className="text-phosphor font-bold uppercase tracking-wider">
 Structured Non-Prose Syntax Formats (Vectors A - R)
 </span>
 <p className="text-[11px] text-phosphor/80 mt-0.5">
 Interleaving rigid non-linguistic syntax carries pacing and structure, forcing models away from standard prose cliché clusters:
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {Object.entries(syntaxFormats).map(([formatKey, formatData]: [string, any]) => {
 const isCopied = copiedId === `syntax-${formatKey}`;
 return (
 <div
 key={formatKey}
 className="p-3 border border-phosphor/30 terminal-border bg-theme-panel flex flex-col justify-between space-y-2"
 >
 <div>
 <div className="flex items-center justify-between gap-1 mb-1">
 <span className="text-xs font-bold font-mono text-phosphor capitalize">
 {formatKey.replace(/_/g, ' ')}
 </span>
 <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">
 Vector
 </span>
 </div>

 <pre className="specimen-chamber terminal-border text-[10px] font-mono text-phosphor/90 p-2 border overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
 {formatData.example}
 </pre>

 <p className="text-[10px] font-mono text-phosphor/80 mt-1.5 line-clamp-2">
 {formatData.pacing_effect}
 </p>
 </div>

 <div className="pt-2 border-t terminal-border flex items-center justify-end gap-1.5">
 {onApplyConcept && (
 <button
 type="button"
 onClick={() =>
 onApplyConcept(
 `${currentConcept}\n\n[SYNTAX_INJECTION: ${formatKey.toUpperCase()}]\n${formatData.example}`
 )
 }
 className="px-2 py-0.5 bg-phosphor/10 hover:bg-phosphor/20 text-phosphor border border-phosphor/30 terminal-border text-[10px] font-mono flex items-center gap-1 transition-colors"
 >
 <Zap className="w-3 h-3" />
 <span>Inject</span>
 </button>
 )}
 <button
 type="button"
 onClick={() => handleCopy(formatData.example, `syntax-${formatKey}`)}
 className="px-2 py-0.5 bg-theme-panel hover:bg-phosphor/10 text-phosphor/80 text-[10px] font-mono flex items-center gap-1 transition-colors"
 >
 {isCopied ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>{isCopied ? 'Copied' : 'Copy'}</span>
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================================= */}
 {/* SUBTAB 5: RESEARCH CORPUS & UNMINED ARCHIVES */}
 {/* ========================================================= */}
 {subTab === 'archives' && (
 <div className="space-y-4">
 <div className="text-xs font-mono text-phosphor/80 border-b terminal-border pb-2">
 <span className="text-semantic-red font-bold uppercase tracking-wider">
 Research Corpus & Unmined Archives
 </span>
 <p className="text-[11px] text-phosphor/80 mt-0.5">
 Specific historical and scientific sub-corpora whose syntactic structure and conceptual density have not been exhausted:
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
 {SLOP_METHODS_LIBRARY.not_yet_mined.map((archive, idx) => (
 <div
 key={archive.id}
 className="p-3.5 border border-semantic-red/30 terminal-border bg-semantic-red/10 space-y-2"
 >
 <div className="flex items-center justify-between">
 <h5 className="text-xs font-bold font-mono text-semantic-red">
 {idx + 1}. {archive.title}
 </h5>
 <span className="text-[9px] font-mono px-1.5 py-0.5 bg-semantic-red/10 text-semantic-red border border-semantic-red/30 terminal-border">
 {archive.id}
 </span>
 </div>
 {archive.note && (
 <p className="text-[11px] font-mono text-phosphor/80 leading-relaxed">
 {archive.note}
 </p>
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
};
