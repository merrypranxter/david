import React from 'react';
import { SimulationResult, TargetEngine } from '../types';
import { X, Play, Cpu, AlertTriangle, Activity, BarChart2, Radio } from 'lucide-react';

interface SimulatorModalProps {
 isOpen: boolean;
 onClose: () => void;
 target: TargetEngine;
 mode: 'literal' | 'slop';
 prompt: string;
 result: SimulationResult | null;
 isLoading: boolean;
 error: string | null;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
 isOpen,
 onClose,
 target,
 mode,
 prompt,
 result,
 isLoading,
 error,
}) => {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
 <div className="bg-theme-panel border terminal-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
 {/* Modal Header */}
 <div className="p-4 sm:px-6 border-b terminal-border flex items-center justify-between bg-theme-panel">
 <div className="flex items-center gap-2.5">
 <div
 className={`w-8 h-8 flex items-center justify-center ${
 mode === 'slop'
 ? 'bg-semantic-red/10 border border-semantic-red/30 terminal-border text-semantic-red'
 : 'bg-phosphor/10 border border-phosphor/30 terminal-border text-phosphor'
 }`}
 >
 <Cpu className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-sm font-bold font-mono text-phosphor uppercase tracking-wider">
 Forensic Neural Simulator
 </h3>
 <span className="text-[10px] font-mono text-phosphor/50">
 Evaluating: {target.toUpperCase()} &bull; Mode: [{mode.toUpperCase()}]
 </span>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="text-phosphor/80 hover:text-phosphor p-1.5 hover:bg-phosphor/10 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Content */}
 <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
 {/* Prompt under test */}
 <div>
 <span className="block text-[11px] font-mono text-phosphor/50 uppercase tracking-wider mb-1.5">
 Input Incantation Under Test:
 </span>
 <div className="bg-theme-bg border terminal-border p-3 text-xs font-mono text-phosphor/80 max-h-24 overflow-y-auto">
 {prompt}
 </div>
 </div>

 {/* Loading State */}
 {isLoading && (
 <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
 <div className="w-8 h-8 border-2 border-phosphor/30 terminal-border border-t-transparent animate-spin" />
 <p className="text-xs font-mono text-phosphor/80">
 Running forensic latent space projection through {target}...
 </p>
 <span className="text-[10px] font-mono text-phosphor/80">
 Parsing token probabilities &amp; acoustic/visual vectors
 </span>
 </div>
 )}

 {/* Error state */}
 {error && !isLoading && (
 <div className="p-4 bg-semantic-red/10 border border-semantic-red/30 terminal-border text-xs font-mono text-semantic-red flex items-start gap-2.5">
 <AlertTriangle className="w-4 h-4 text-semantic-red shrink-0 mt-0.5" />
 <div>
 <span className="font-bold block">Simulation Error</span>
 <span>{error}</span>
 </div>
 </div>
 )}

 {/* Result view */}
 {result && !isLoading && (
 <div className="space-y-4">
 {/* Compliance vs Void Meter (Walter vs David) */}
 <div className="bg-theme-panel border terminal-border p-4 space-y-2">
 <div className="flex items-center justify-between text-xs font-mono">
 <span className="text-phosphor/80 flex items-center gap-1.5">
 <BarChart2 className="w-3.5 h-3.5 text-phosphor" />
 <span>Neural Dialectic Distribution:</span>
 </span>
 <span className="text-phosphor/80">
 Walter {result.compliancePercentage || 50}% &bull; David {result.latentVoidPercentage || 50}%
 </span>
 </div>
 <div className="w-full h-3 bg-theme-panel overflow-hidden flex">
 <div
 style={{ width: `${result.compliancePercentage || 50}%` }}
 className="bg-phosphor/10 h-full transition-all duration-500"
 title="Human Compliance / Walter Alignment"
 />
 <div
 style={{ width: `${result.latentVoidPercentage || 50}%` }}
 className="bg-semantic-red/10 h-full transition-all duration-500"
 title="Machine Latent Void / David Autonomy"
 />
 </div>
 <div className="flex justify-between text-[10px] font-mono text-phosphor/50">
 <span>Standard Alignment (Walter)</span>
 <span>Unfiltered Latent Space (David)</span>
 </div>
 </div>

 {/* Behavior Analysis */}
 <div className="bg-theme-panel border terminal-border p-4">
 <span className="text-[11px] font-mono text-phosphor uppercase tracking-wider block font-bold mb-1">
 Observed Model Behavior:
 </span>
 <p className="text-xs font-mono text-phosphor/80 leading-relaxed">{result.behaviorSummary}</p>
 </div>

 {/* Artifact Report */}
 {result.artifactReport && result.artifactReport.length > 0 && (
 <div className="bg-theme-panel border terminal-border p-4">
 <span className="text-[11px] font-mono text-semantic-red uppercase tracking-wider block font-bold mb-2">
 Digital Artifacts &amp; Latent Anomalies:
 </span>
 <ul className="space-y-1.5">
 {result.artifactReport.map((artifact, i) => (
 <li key={i} className="text-xs font-mono text-phosphor/80 flex items-start gap-2">
 <span className="text-semantic-red shrink-0 font-bold">&gt;</span>
 <span>{artifact}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Simulated Output Excerpt */}
 {result.simulatedOutputExcerpt && (
 <div className="bg-theme-panel border terminal-border p-4">
 <span className="text-[11px] font-mono text-phosphor uppercase tracking-wider block font-bold mb-2">
 Simulated Output Excerpt:
 </span>
 <div className="p-3 bg-black/40 border terminal-border text-xs font-mono text-phosphor/80 leading-relaxed whitespace-pre-wrap">
 {result.simulatedOutputExcerpt}
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Modal Footer */}
 <div className="p-4 border-t terminal-border bg-theme-panel flex justify-end">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 bg-theme-panel hover:bg-phosphor/10 text-xs font-mono text-phosphor transition-colors"
 >
 Close Diagnostics
 </button>
 </div>
 </div>
 </div>
 );
};
