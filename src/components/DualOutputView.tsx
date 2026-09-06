import React, { useState } from 'react';
import { MutationCandidate, PromptGeneration, SynthesisPayload, TargetEngine } from '../types';
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
} from 'lucide-react';

interface DualOutputViewProps {
  data: SynthesisPayload;
  target: TargetEngine;
  modelUsed?: string;
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
  data: rawData,
  target,
  modelUsed,
  onRunSimulation,
  onOuroborosLoop,
  onTranspose,
  onSelectManualSurvivor,
}) => {
  // Guard against malformed/partial synthesis responses (e.g. a model reply
  // that omits [LITERAL] or [SLOP]) so a missing field never crashes the
  // whole app down to a blank screen - it degrades to empty output instead.
  const data: SynthesisPayload = {
    ...rawData,
    literal: rawData.literal || ({ prompt: '' } as SynthesisPayload['literal']),
    slop: rawData.slop || ({ prompt: '' } as SynthesisPayload['slop']),
  };

  const [copiedLiteral, setCopiedLiteral] = useState(false);
  const [copiedLiteralClean, setCopiedLiteralClean] = useState(false);
  const [copiedLiteralStyle, setCopiedLiteralStyle] = useState(false);
  const [copiedLiteralLyrics, setCopiedLiteralLyrics] = useState(false);

  const [copiedSlop, setCopiedSlop] = useState(false);
  const [copiedSlopClean, setCopiedSlopClean] = useState(false);
  const [copiedSlopStyle, setCopiedSlopStyle] = useState(false);
  const [copiedSlopLyrics, setCopiedSlopLyrics] = useState(false);

  const [copiedAll, setCopiedAll] = useState(false);

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

  const literalPrompt = getCleanPrompt(data.literal?.prompt || '');
  const slopPrompt = getCleanPrompt(data.slop?.prompt || '');

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
      <div className="bg-gradient-to-r from-zinc-900 via-[#141724] to-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>Dual Output Synthesized</span>
              {modelUsed && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono">
                  {modelUsed}
                </span>
              )}
              {isSuno ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Suno Audio Dual Buffer Active
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Target: {target.toUpperCase()} (Zero Audio Tags)</span>
                </span>
              )}
            </div>
            {data.previewImpact && (
              <p className="text-xs text-zinc-400 mt-1 font-mono leading-relaxed">{data.previewImpact}</p>
            )}
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
        {/* Column 1: [LITERAL] - The Scalpel                         */}
        {/* ========================================================= */}
        <div className="bg-[#11131c] border border-emerald-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                    [LITERAL] <span className="text-emerald-400 font-normal text-xs">// The Scalpel</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/50 shadow transition-colors"
                title="Copy clean prompt to clipboard"
              >
                {copiedLiteral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLiteral ? 'Copied!' : isSuno ? 'Copy Literal (Both)' : getCopyButtonLabel('literal')}</span>
              </button>
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
              /* NON-SUNO: Clean Single Prompt View for Grok/OpenArt/Midjourney */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span>Prompt Content:</span>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Cleaned &bull; Zero Audio Tags
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">
                      {literalPrompt.length} characters
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(stripAllBracketTags(literalPrompt), setCopiedLiteralClean)
                      }
                      className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                      title="Copies pure prose text with all bracketed tokens [LIKE THIS] stripped"
                    >
                      {copiedLiteralClean ? 'Copied Pure' : 'Copy Pure (No Tags)'}
                    </button>
                  </div>
                </div>

                <div className="w-full bg-[#08090e] border border-emerald-500/30 rounded-lg p-4 text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto shadow-inner">
                  {literalPrompt}
                </div>
              </div>
            )}

            {/* Collapsible Latent Telemetry & Parameters to avoid cluttering the view */}
            {((data.literal.tokenWeights && data.literal.tokenWeights.length > 0) || data.literal.targetParameters) && (
              <details className="group border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
                <summary className="px-3 py-2 cursor-pointer text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center justify-between select-none bg-zinc-900/50 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Technical Diagnostics &amp; Attention Vectors</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform text-zinc-500" />
                </summary>

                <div className="p-3 space-y-3 border-t border-zinc-800/80">
                  {data.literal.tokenWeights && data.literal.tokenWeights.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
                        Prioritized Attention Vectors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.literal.tokenWeights.map((token, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.literal.targetParameters && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                        Target Parameters:
                      </span>
                      <code className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 block">
                        {data.literal.targetParameters}
                      </code>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>

          {/* Bottom Actions for Literal */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500">The Scalpel (Mode 1)</span>
            <button
              type="button"
              id="simulate-literal-button"
              onClick={() => onRunSimulation(literalPrompt, 'literal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Model Response</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Column 2: [SLOP] - The Deluge                             */}
        {/* ========================================================= */}
        <div className="bg-[#11131c] border border-rose-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
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

              {/* Primary Copy Button for Slop */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  S{data.slop.entropyScore || 5}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-xs font-mono font-bold text-rose-300 border border-rose-500/50 shadow transition-colors"
                  title="Copy high-entropy slop prompt to clipboard"
                >
                  {copiedSlop ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlop ? 'Copied!' : isSuno ? 'Copy Slop (Both)' : getCopyButtonLabel('slop')}</span>
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
              /* NON-SUNO: Clean Single Prompt View for Grok/OpenArt/Midjourney */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span>High-Entropy Slop Prompt:</span>
                    <span className="text-[10px] text-rose-400 px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                      Cleaned &bull; Zero Audio Tags
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">
                      {slopPrompt.length} characters
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(stripAllBracketTags(slopPrompt), setCopiedSlopClean)
                      }
                      className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                      title="Copies pure text with all bracket tags stripped"
                    >
                      {copiedSlopClean ? 'Copied Pure' : 'Copy Pure (No Tags)'}
                    </button>
                  </div>
                </div>

                <div className="w-full bg-[#08090e] border border-rose-500/30 rounded-lg p-4 text-xs font-mono text-rose-200/90 whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto shadow-inner">
                  {slopPrompt}
                </div>
              </div>
            )}

            {/* Evolutionary Lineage / Genotype Inspector (Job 6) */}
            {data.generation && (
              <EvolutionLineageView generation={data.generation} />
            )}

            {/* Collapsible Latent Diagnostics to prevent clutter */}
            {(data.slop.hallucinationTriggers?.length ||
              data.slop.seededContradictions?.length ||
              data.slop.glitchAnchors ||
              data.slop.injectedDomains?.length ||
              data.slop.activeOperators?.length ||
              data.slop.activeAttractors?.length ||
              data.slop.mutationSummary) && (
              <details className="group border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
                <summary className="px-3 py-2 cursor-pointer text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center justify-between select-none bg-zinc-900/50 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span>Mutation Architecture &amp; Latent Diagnostics</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform text-zinc-500" />
                </summary>

                <div className="p-3 space-y-3 border-t border-zinc-800/80">
                  {data.slop.mutationSummary && (
                    <div className="bg-rose-950/20 p-2.5 rounded border border-rose-500/20 text-[11px] font-mono text-rose-300/90 leading-relaxed">
                      <span className="text-rose-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                        Mutation Recipe Summary:
                      </span>
                      {data.slop.mutationSummary}
                    </div>
                  )}

                  {data.slop.activeOperators && data.slop.activeOperators.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                        Active Mutation Operators:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {data.slop.activeOperators.map((op, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-rose-300 border border-rose-500/30"
                          >
                            {op.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.slop.activeAttractors && data.slop.activeAttractors.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                        Latent Fauna Attractors:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {data.slop.activeAttractors.map((at, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-amber-300 border border-amber-500/30"
                          >
                            {at.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.slop.preservedAnchors && data.slop.preservedAnchors.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-emerald-500 mb-1 uppercase tracking-wider">
                        Preserved Invariant Anchors:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {data.slop.preservedAnchors.map((anchor, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                          >
                            {anchor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.slop.hallucinationTriggers && data.slop.hallucinationTriggers.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
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

                  {data.slop.seededContradictions && data.slop.seededContradictions.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono text-amber-400/90 mb-1 uppercase tracking-wider">
                        Injected Paradoxes:
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

                  {data.slop.injectedDomains && data.slop.injectedDomains.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
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

                  {data.slop.glitchAnchors && (
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
                        Glitch Anchors:
                      </span>
                      <code className="text-xs font-mono text-rose-400/80 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 block">
                        {data.slop.glitchAnchors}
                      </code>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>

          {/* Bottom Actions for Slop */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              type="button"
              id="ouroboros-button"
              onClick={() => onOuroborosLoop(slopPrompt, data.generation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
              title="Feeds this high-entropy slop back as the seed prompt for recursive mutation"
            >
              <RotateCw className="w-3.5 h-3.5 text-rose-400" />
              <span>Ouroboros Mutate</span>
            </button>
            <button
              type="button"
              id="simulate-slop-button"
              onClick={() => onRunSimulation(slopPrompt, 'slop')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Collapse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible David 8 Architectural Logic Map */}
      {data.logicMap && data.logicMap.length > 0 && (
        <details className="group border border-zinc-800 rounded-xl overflow-hidden bg-[#10121a] shadow-lg">
          <summary className="p-4 cursor-pointer text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider flex items-center justify-between select-none hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>David 8 Architectural Logic Map &amp; Latent Coordinates</span>
            </div>
            <div className="flex items-center gap-2">
              {data.targetSummary && (
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  {data.targetSummary}
                </span>
              )}
              <span className="text-[10px] text-zinc-500 font-normal">Click to expand/collapse</span>
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-zinc-500" />
            </div>
          </summary>

          <div className="p-4 pt-2 border-t border-zinc-800/80 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.logicMap.map((item, index) => (
                <div key={index} className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400/90 font-bold block">{item.phase}</span>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  );
};
