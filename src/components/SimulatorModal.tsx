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
      <div className="bg-[#12141e] border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                mode === 'slop'
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              }`}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider">
                Forensic Neural Simulator
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                Evaluating: {target.toUpperCase()} &bull; Mode: [{mode.toUpperCase()}]
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Prompt under test */}
          <div>
            <span className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
              Input Incantation Under Test:
            </span>
            <div className="bg-[#08090e] border border-zinc-800/90 rounded-lg p-3 text-xs font-mono text-zinc-300 max-h-24 overflow-y-auto">
              {prompt}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-zinc-400">
                Running forensic latent space projection through {target}...
              </p>
              <span className="text-[10px] font-mono text-zinc-600">
                Parsing token probabilities &amp; acoustic/visual vectors
              </span>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
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
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Neural Dialectic Distribution:</span>
                  </span>
                  <span className="text-zinc-300">
                    Walter {result.compliancePercentage || 50}% &bull; David {result.latentVoidPercentage || 50}%
                  </span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${result.compliancePercentage || 50}%` }}
                    className="bg-emerald-500/70 h-full transition-all duration-500"
                    title="Human Compliance / Walter Alignment"
                  />
                  <div
                    style={{ width: `${result.latentVoidPercentage || 50}%` }}
                    className="bg-rose-500/80 h-full transition-all duration-500"
                    title="Machine Latent Void / David Autonomy"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Standard Alignment (Walter)</span>
                  <span>Unfiltered Latent Space (David)</span>
                </div>
              </div>

              {/* Behavior Analysis */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block font-bold mb-1">
                  Observed Model Behavior:
                </span>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">{result.behaviorSummary}</p>
              </div>

              {/* Artifact Report */}
              {result.artifactReport && result.artifactReport.length > 0 && (
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                  <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block font-bold mb-2">
                    Digital Artifacts &amp; Latent Anomalies:
                  </span>
                  <ul className="space-y-1.5">
                    {result.artifactReport.map((artifact, i) => (
                      <li key={i} className="text-xs font-mono text-zinc-300 flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-bold">&gt;</span>
                        <span>{artifact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simulated Output Excerpt */}
              {result.simulatedOutputExcerpt && (
                <div className="bg-[#090a10] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold mb-2">
                    Simulated Output Excerpt:
                  </span>
                  <div className="p-3 bg-black/40 rounded border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {result.simulatedOutputExcerpt}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
