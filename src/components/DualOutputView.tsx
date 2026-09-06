import React, { useState } from 'react';
import { SynthesisPayload, TargetEngine } from '../types';
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
  const [copiedLiteralStyle, setCopiedLiteralStyle] = useState(false);
  const [copiedLiteralLyrics, setCopiedLiteralLyrics] = useState(false);

  const [copiedSlop, setCopiedSlop] = useState(false);
  const [copiedSlopStyle, setCopiedSlopStyle] = useState(false);
  const [copiedSlopLyrics, setCopiedSlopLyrics] = useState(false);

  const [copiedAll, setCopiedAll] = useState(false);

  const isSuno =
    target === 'suno' ||
    Boolean(data.literal.stylePrompt || data.slop.stylePrompt || data.literal.lyricsPrompt || data.slop.lyricsPrompt);

  const copyToClipboard = async (text: string, setter: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const getSunoCombinedCopy = (mode: 'literal' | 'slop') => {
    const item = mode === 'literal' ? data.literal : data.slop;
    return `[SUNO STYLE]\n${item.stylePrompt || item.prompt}\n\n[SUNO LYRICS]\n${item.lyricsPrompt || ''}`;
  };

  const getAllCombinedCopy = () => {
    if (isSuno) {
      return (
        `### [LITERAL] - THE SCALPEL\n` +
        `[STYLE - 1,000 CAP]\n${data.literal.stylePrompt || data.literal.prompt}\n\n` +
        `[LYRICS - 3,000 CAP]\n${data.literal.lyricsPrompt || ''}\n\n` +
        `### [SLOP] - THE DELUGE\n` +
        `[STYLE - 1,000 CAP]\n${data.slop.stylePrompt || data.slop.prompt}\n\n` +
        `[LYRICS - 3,000 CAP]\n${data.slop.lyricsPrompt || ''}`
      );
    }
    return `### [LITERAL] - THE SCALPEL\n${data.literal.prompt}\n\n### [SLOP] - THE DELUGE\n${data.slop.prompt}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Compiler Diagnostics */}
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
              {isSuno && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Suno Dual Buffer (1k Style + 3k Lyrics)
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
            onClick={() => copyToClipboard(getAllCombinedCopy(), setCopiedAll)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors border border-zinc-700"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
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
                  onClick={() =>
                    copyToClipboard(
                      isSuno ? getSunoCombinedCopy('literal') : data.literal.prompt,
                      setCopiedLiteral
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-emerald-300 border border-zinc-700 transition-colors"
                >
                  {copiedLiteral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLiteral ? 'Copied' : isSuno ? 'Copy Literal (Both)' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Suno Dual Boxes OR Single Visual Prompt Box */}
            {isSuno ? (
              <div className="space-y-4">
                {/* 1. Style Box (1k Cap) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      <span>1. Suno Style Box (1,000 Cap):</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">
                        {data.literal.stylePrompt?.length || data.literal.prompt.length} / 1,000 chars
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            data.literal.stylePrompt || data.literal.prompt,
                            setCopiedLiteralStyle
                          )
                        }
                        className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-emerald-300 flex items-center gap-1"
                      >
                        {copiedLiteralStyle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Style</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all max-h-56 overflow-y-auto">
                    {data.literal.stylePrompt || data.literal.prompt}
                  </div>
                </div>

                {/* 2. Lyrics Box (3k Cap) */}
                {data.literal.lyricsPrompt && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>2. Lyrics &amp; Directives (3,000 Cap):</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400">
                          {data.literal.lyricsPrompt.length} / 3,000 chars
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(data.literal.lyricsPrompt!, setCopiedLiteralLyrics)}
                          className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-emerald-300 flex items-center gap-1"
                        >
                          {copiedLiteralLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Lyrics</span>
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed select-all max-h-72 overflow-y-auto">
                      {data.literal.lyricsPrompt}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Prompt Length:</span>
                  <span className="text-emerald-400 font-bold">
                    {data.literal.prompt.length} characters
                  </span>
                </div>
                <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto">
                  {data.literal.prompt}
                </div>
              </div>
            )}

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
                  onClick={() =>
                    copyToClipboard(
                      isSuno ? getSunoCombinedCopy('slop') : data.slop.prompt,
                      setCopiedSlop
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-rose-300 border border-zinc-700 transition-colors"
                >
                  {copiedSlop ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlop ? 'Copied' : isSuno ? 'Copy Slop (Both)' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Suno Dual Boxes OR Single Visual Prompt Box */}
            {isSuno ? (
              <div className="space-y-4">
                {/* 1. Style Box (1k Cap) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      <span>1. Slop Style Box (1,000 Cap):</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">
                        {data.slop.stylePrompt?.length || data.slop.prompt.length} / 1,000 chars
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            data.slop.stylePrompt || data.slop.prompt,
                            setCopiedSlopStyle
                          )
                        }
                        className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-rose-300 flex items-center gap-1"
                      >
                        {copiedSlopStyle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Style</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-rose-300/90 whitespace-pre-wrap leading-relaxed select-all max-h-56 overflow-y-auto">
                    {data.slop.stylePrompt || data.slop.prompt}
                  </div>
                </div>

                {/* 2. Lyrics Box (3k Cap) */}
                {data.slop.lyricsPrompt && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>2. Gibberish Lyrics &amp; Paradoxes (3,000 Cap):</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400">
                          {data.slop.lyricsPrompt.length} / 3,000 chars
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(data.slop.lyricsPrompt!, setCopiedSlopLyrics)}
                          className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-rose-300 flex items-center gap-1"
                        >
                          {copiedSlopLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Lyrics</span>
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-rose-200/90 whitespace-pre-wrap leading-relaxed select-all max-h-72 overflow-y-auto">
                      {data.slop.lyricsPrompt}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Prompt Length:</span>
                  <span className="text-rose-400 font-bold">
                    {data.slop.prompt.length} characters
                  </span>
                </div>
                <div className="w-full bg-[#08090e] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-rose-300/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto">
                  {data.slop.prompt}
                </div>
              </div>
            )}

            {/* Hallucination Triggers & Contradictions */}
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

            {/* Injected Paradoxes & Domains if present */}
            {data.slop.seededContradictions && data.slop.seededContradictions.length > 0 && (
              <div className="mt-3">
                <span className="block text-[11px] font-mono text-amber-500/90 mb-1.5 uppercase tracking-wider">
                  Injected Paradoxes &amp; Impossible Pairings:
                </span>
                <ul className="space-y-1">
                  {data.slop.seededContradictions.map((contra, i) => (
                    <li
                      key={i}
                      className="text-xs font-mono text-amber-300/90 flex items-start gap-1.5 bg-amber-950/20 px-2 py-1 rounded border border-amber-500/20"
                    >
                      <span className="text-amber-400 shrink-0">&#9889;</span>
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Injected Domains Badges */}
            {data.slop.injectedDomains && data.slop.injectedDomains.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Domains:</span>
                {data.slop.injectedDomains.map((domain, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                  >
                    {domain}
                  </span>
                ))}
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
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              type="button"
              id="ouroboros-button"
              onClick={() => onOuroborosLoop(data.slop.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
              title="Feeds this high-entropy slop back as the seed prompt for recursive mutation"
            >
              <RotateCw className="w-3.5 h-3.5 text-rose-400" />
              <span>Ouroboros Mutate</span>
            </button>
            <button
              type="button"
              id="simulate-slop-button"
              onClick={() => onRunSimulation(data.slop.prompt, 'slop')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Collapse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logic Map */}
      {data.logicMap && data.logicMap.length > 0 && (
        <div className="bg-[#10121a] border border-zinc-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                David 8 Architectural Logic Map &amp; Latent Coordinates
              </h4>
            </div>
            {data.targetSummary && (
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                {data.targetSummary}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.logicMap.map((item, index) => (
              <div key={index} className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono text-amber-400/90 font-bold block">{item.phase}</span>
                <p className="text-xs font-mono text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
