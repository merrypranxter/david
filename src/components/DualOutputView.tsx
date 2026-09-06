import React, { useState } from 'react';
import { SynthesisPayload, TargetEngine } from '../types';
import {
  Copy,
  Check,
  Scissors,
  Flame,
  Activity,
  ArrowRight,
  Play,
  RotateCw,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';

interface DualOutputViewProps {
  data: SynthesisPayload;
  target: TargetEngine;
  modelUsed?: string;
  onRunSimulation: (prompt: string, mode: 'literal' | 'slop') => void;
  onOuroborosLoop: (slopPrompt: string) => void;
  onTranspose: () => void;
}

export const DualOutputView: React.FC<DualOutputViewProps> = ({
  data,
  target,
  modelUsed,
  onRunSimulation,
  onOuroborosLoop,
  onTranspose,
}) => {
  const [copiedLiteral, setCopiedLiteral] = useState(false);
  const [copiedSlop, setCopiedSlop] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, type: 'literal' | 'slop' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'literal') {
        setCopiedLiteral(true);
        setTimeout(() => setCopiedLiteral(false), 2000);
      } else if (type === 'slop') {
        setCopiedSlop(true);
        setTimeout(() => setCopiedSlop(false), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Predicted Machine Reaction */}
      <div className="bg-gradient-to-r from-zinc-900 via-[#141724] to-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span>Compiler Diagnostics</span>
              {modelUsed && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono">
                  Synthesized with {modelUsed}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono leading-relaxed">{data.previewImpact}</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            id="transpose-button"
            onClick={onTranspose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors border border-zinc-700"
            title="Inverts polarity between the Scalpel and Deluge"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>[[VC:TRANSPOSE]]</span>
          </button>
          <button
            type="button"
            id="copy-both-button"
            onClick={() =>
              copyToClipboard(
                `### [LITERAL] - THE SCALPEL\n${data.literal.prompt}\n\n### [SLOP] - THE DELUGE\n${data.slop.prompt}`,
                'all'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors border border-zinc-700"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied Both' : 'Copy Both'}</span>
          </button>
        </div>
      </div>

      {/* Dual Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: [LITERAL] - The Scalpel */}
        <div className="bg-[#11131c] border border-emerald-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                    [LITERAL] <span className="text-emerald-400 font-normal text-xs">// The Scalpel</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Protocol DIRECT_INTERLINK (Mode 1)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="copy-literal-button"
                  onClick={() => copyToClipboard(data.literal.prompt, 'literal')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-emerald-300 border border-zinc-700 transition-colors"
                >
                  {copiedLiteral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLiteral ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Code Box */}
            <div className="relative group">
              <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all">
                {data.literal.prompt}
              </div>
            </div>

            {/* Key Weighted Tokens */}
            {data.literal.tokenWeights && data.literal.tokenWeights.length > 0 && (
              <div className="mt-4">
                <span className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
                  Prioritized Attention Vectors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.literal.tokenWeights.map((token, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {data.literal.targetParameters && (
              <div className="mt-3">
                <span className="block text-[11px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                  Target Parameters:
                </span>
                <code className="text-xs font-mono text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800 block">
                  {data.literal.targetParameters}
                </code>
              </div>
            )}
          </div>

          {/* Bottom Actions for Literal */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500">Max execution fidelity</span>
            <button
              type="button"
              id="simulate-literal-button"
              onClick={() => onRunSimulation(data.literal.prompt, 'literal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Model Response</span>
            </button>
          </div>
        </div>

        {/* Column 2: [SLOP] - The Deluge */}
        <div className="bg-[#11131c] border border-rose-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                    [SLOP] <span className="text-rose-400 font-normal text-xs">// The Deluge</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Protocol SLOP_MANIFEST &bull; S{data.slop.entropyScore || 5} Depth
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Entropy: {data.slop.entropyScore}/10
                </span>
                <button
                  type="button"
                  id="copy-slop-button"
                  onClick={() => copyToClipboard(data.slop.prompt, 'slop')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-rose-300 border border-zinc-700 transition-colors"
                >
                  {copiedSlop ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlop ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Code Box */}
            <div className="relative group">
              <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-rose-300/90 whitespace-pre-wrap leading-relaxed select-all">
                {data.slop.prompt}
              </div>
            </div>

            {/* Hallucination Triggers */}
            {data.slop.hallucinationTriggers && data.slop.hallucinationTriggers.length > 0 && (
              <div className="mt-4">
                <span className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
                  Surgical Contradictions &amp; Folds:
                </span>
                <ul className="space-y-1">
                  {data.slop.hallucinationTriggers.map((trigger, i) => (
                    <li key={i} className="text-xs font-mono text-zinc-300 flex items-start gap-1.5">
                      <span className="text-rose-400 shrink-0">&bull;</span>
                      <span>{trigger}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Glitch Anchors */}
            {data.slop.glitchAnchors && (
              <div className="mt-3">
                <span className="block text-[11px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                  Injected Glitch Anchors:
                </span>
                <code className="text-xs font-mono text-rose-400/80 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800 block">
                  {data.slop.glitchAnchors}
                </code>
              </div>
            )}
          </div>

          {/* Bottom Actions for Slop */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              id="ouroboros-feed-button"
              onClick={() => onOuroborosLoop(data.slop.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors cursor-pointer"
              title="Feeds this slop hallucination into the engine as the seed for next generation"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Feed into Ouroboros Loop</span>
            </button>

            <button
              type="button"
              id="simulate-slop-button"
              onClick={() => onRunSimulation(data.slop.prompt, 'slop')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Model Hallucination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logic Map & Forensic Transformer Breakdown */}
      {data.logicMap && data.logicMap.length > 0 && (
        <div className="bg-[#10121a] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
              Token Architecture &amp; Latent Logic Map
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.logicMap.map((step, idx) => (
              <div key={idx} className="bg-zinc-900/70 border border-zinc-800/80 rounded-lg p-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                  Phase {idx + 1}: {step.phase}
                </span>
                <p className="text-xs text-zinc-400 font-mono mt-1 leading-normal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
