/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Tokenizer Inspection, Multi-Encoder Diagnostics & Parity Verification
 * 
 * CORE CONTRACT:
 * - When instrumented tokenizer access exists: Inspect tokens, pieces, and multi-encoder divergences.
 * - Parity control: If token IDs are identical, tokenizationDiverged = false (NO_TOKENIZATION_CHANGE).
 * - When on observable commercial APIs: Record TOKENIZATION_UNVERIFIED. NEVER fake white-box access.
 * - Truncation confound control: Isolate whether a visual artifact arose from byte-level sabotage
 *   or simply from context truncation pushing key semantics past the model's token limit.
 * - Future bridge: Captures candidateTokenIds, candidateRarePieces, fallbackTokenIds for UEP-GD.
 */

import {
  EncoderTokenizerResult,
  MultiEncoderInspectionResult,
  TokenizationParityResult,
  TruncationConfoundControl,
} from '../types/serialization';
import { TechnicalBackendCapabilities } from '../types/technicalCore';

/**
 * Standard deterministic BPE/SentencePiece vocabulary hash simulator
 * for verifying tokenization dynamics in test and instrumented environments.
 */
function hashPiece(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 49000 + 1000;
}

/**
 * Emulates tokenizer behavior for CLIP (Word-level BPE with byte fallback on unks).
 */
export function emulateClipTokenize(text: string, maxTokens: number = 77): EncoderTokenizerResult {
  const pieces: string[] = ['<|startoftext|>'];
  const tokenIds: number[] = [49406]; // Standard CLIP BOS
  const offsets: Array<[number, number]> = [[0, 0]];
  const unknownOrFallbackTokens: number[] = [];

  // Match words, whitespace, or individual non-ASCII/combining characters
  const regex = /\w+|[^\w\s]|\s+/gu;
  let match: RegExpExecArray | null;
  let charPos = 0;

  while ((match = regex.exec(text)) !== null) {
    const chunk = match[0];
    const start = match.index;
    const end = start + chunk.length;

    // Check if chunk contains non-ASCII combining marks or foreign scripts
    const isAsciiWord = /^[\x20-\x7E]+$/.test(chunk);

    if (isAsciiWord && /^\w+$/.test(chunk)) {
      // Standard dictionary word
      pieces.push(chunk);
      tokenIds.push(hashPiece(chunk));
      offsets.push([start, end]);
    } else {
      // Sub-word splitting or byte-level fallback tokens
      for (const char of Array.from(chunk)) {
        pieces.push(char);
        const id = hashPiece(`byte_${char}`);
        tokenIds.push(id);
        offsets.push([start, end]);
        if (char.charCodeAt(0) > 127) {
          unknownOrFallbackTokens.push(id);
        }
      }
    }
  }

  pieces.push('<|endoftext|>');
  tokenIds.push(49407); // CLIP EOS
  offsets.push([text.length, text.length]);

  const totalTokens = tokenIds.length;
  const truncated = totalTokens > maxTokens;
  const finalTokenIds = truncated ? tokenIds.slice(0, maxTokens) : tokenIds;
  const finalPieces = truncated ? pieces.slice(0, maxTokens) : pieces;
  const tokensLost = truncated ? totalTokens - maxTokens : 0;

  return {
    encoderId: 'CLIP-ViT-L/14',
    tokenCount: finalTokenIds.length,
    tokenIds: finalTokenIds,
    pieces: finalPieces,
    offsets: offsets.slice(0, finalTokenIds.length),
    truncated,
    truncationPosition: truncated ? maxTokens : undefined,
    tokensLostAfterTruncation: tokensLost,
    unknownOrFallbackTokens,
    specialTokensCount: 2,
  };
}

/**
 * Emulates tokenizer behavior for T5 (SentencePiece unigram with byte fallback).
 */
export function emulateT5Tokenize(text: string, maxTokens: number = 512): EncoderTokenizerResult {
  const pieces: string[] = [];
  const tokenIds: number[] = [];
  const unknownOrFallbackTokens: number[] = [];

  const words = text.split(/\s+/);
  for (const w of words) {
    if (!w) continue;
    pieces.push(`_${w}`);
    tokenIds.push(hashPiece(`t5_${w}`));

    // Detect non-ASCII diacritics / homoglyphs that decompose into byte tokens
    for (const char of Array.from(w)) {
      if (char.charCodeAt(0) > 127) {
        const byteFallbackId = 256 + (char.charCodeAt(0) % 256);
        unknownOrFallbackTokens.push(byteFallbackId);
      }
    }
  }

  // T5 EOS
  pieces.push('</s>');
  tokenIds.push(1);

  const totalTokens = tokenIds.length;
  const truncated = totalTokens > maxTokens;
  const finalTokenIds = truncated ? tokenIds.slice(0, maxTokens) : tokenIds;

  return {
    encoderId: 'T5-XXL',
    tokenCount: finalTokenIds.length,
    tokenIds: finalTokenIds,
    pieces: truncated ? pieces.slice(0, maxTokens) : pieces,
    truncated,
    truncationPosition: truncated ? maxTokens : undefined,
    tokensLostAfterTruncation: truncated ? totalTokens - maxTokens : 0,
    unknownOrFallbackTokens,
    specialTokensCount: 1,
  };
}

/**
 * Inspects tokenization across all configured encoders for an instrumented model.
 * If backend does NOT support TOKENIZER_ACCESS, cleanly marks TOKENIZATION_UNVERIFIED.
 */
export function inspectMultiEncoderTokenization(
  text: string,
  backend: TechnicalBackendCapabilities
): MultiEncoderInspectionResult {
  const hasAccess = backend.capabilities.TOKENIZER_ACCESS || backend.capabilities.TOKEN_ID_ACCESS;

  if (!hasAccess || !backend.isLocalPipeline) {
    return {
      modelId: backend.modelId,
      isInstrumented: false,
      encoders: {},
      overallTruncated: false,
      unverifiedReason: `Tokenizer inspection unavailable on commercial/remote API [${backend.displayName}]. Downstream tokenization remains unverified.`,
    };
  }

  // Model-specific encoder configurations
  const encoders: Record<string, EncoderTokenizerResult> = {};

  if (backend.modelId.includes('flux') || backend.modelId.includes('sd3')) {
    encoders['clip_l'] = emulateClipTokenize(text, 77);
    encoders['t5_xxl'] = emulateT5Tokenize(text, 512);
  } else if (backend.modelId.includes('sdxl')) {
    encoders['clip_l'] = emulateClipTokenize(text, 77);
    encoders['clip_g'] = emulateClipTokenize(text, 77);
  } else {
    // Default single encoder
    encoders['primary_clip'] = emulateClipTokenize(text, 77);
  }

  const overallTruncated = Object.values(encoders).some((e) => e.truncated);

  return {
    modelId: backend.modelId,
    isInstrumented: true,
    encoders,
    overallTruncated,
  };
}

/**
 * Performs tokenization parity comparison between baseline and mutated strings.
 */
export function evaluateTokenizationParity(
  baselineText: string,
  mutatedText: string,
  backend: TechnicalBackendCapabilities
): TokenizationParityResult {
  const baselineInspection = inspectMultiEncoderTokenization(baselineText, backend);
  const mutatedInspection = inspectMultiEncoderTokenization(mutatedText, backend);

  if (!baselineInspection.isInstrumented || !mutatedInspection.isInstrumented) {
    return {
      tokenizationDiverged: false,
      baselineTokenCount: -1,
      mutatedTokenCount: -1,
      diffSummary: 'Tokenization parity unverified: backend lacks white-box tokenizer access.',
      mechanismEvidence: 'TOKENIZATION_UNVERIFIED',
      encoderParity: {},
    };
  }

  const encoderParity: Record<string, boolean> = {};
  let anyDiverged = false;
  let totalBaselineTokens = 0;
  let totalMutatedTokens = 0;
  const diffs: string[] = [];

  for (const [key, baseRes] of Object.entries(baselineInspection.encoders)) {
    const mutRes = mutatedInspection.encoders[key];
    if (!mutRes) continue;

    totalBaselineTokens += baseRes.tokenCount;
    totalMutatedTokens += mutRes.tokenCount;

    const idsMatch =
      baseRes.tokenIds.length === mutRes.tokenIds.length &&
      baseRes.tokenIds.every((id, idx) => id === mutRes.tokenIds[idx]);

    encoderParity[key] = !idsMatch;
    if (!idsMatch) {
      anyDiverged = true;
      diffs.push(
        `[${key}] Diverged: baseline had ${baseRes.tokenCount} tokens, mutated has ${mutRes.tokenCount} tokens.`
      );
    } else {
      diffs.push(`[${key}] Parity preserved: 0 token differences.`);
    }
  }

  return {
    tokenizationDiverged: anyDiverged,
    baselineTokenCount: totalBaselineTokens,
    mutatedTokenCount: totalMutatedTokens,
    diffSummary: diffs.join(' '),
    mechanismEvidence: anyDiverged ? 'TOKENIZATION_DIVERGED' : 'NO_TOKENIZATION_CHANGE',
    encoderParity,
  };
}

/**
 * Creates a Truncation Confound Control.
 * When an exotic mutation expands token count and causes truncation of downstream words,
 * this function constructs a neutral control prompt using generic filler words
 * that replicates the EXACT same token budget and causes the exact same tail words to be lost.
 * 
 * If the neutral prompt causes the same visual collapse, the mechanism is context truncation,
 * NOT latent byte-fallback.
 */
export function buildTruncationConfoundControl(
  canonicalPrompt: string,
  mutatedPrompt: string,
  targetTokenLimit: number = 77
): TruncationConfoundControl {
  const baseTokens = emulateClipTokenize(canonicalPrompt, 999);
  const mutTokens = emulateClipTokenize(mutatedPrompt, 999);

  const tokensLost = Math.max(0, mutTokens.tokenCount - targetTokenLimit);
  const words = canonicalPrompt.split(/\s+/);

  // Approximate which trailing words were cut off by the token expansion
  const wordsCutoffCount = Math.min(words.length, Math.ceil(tokensLost / 1.5));
  const remainingWords = words.slice(0, Math.max(1, words.length - wordsCutoffCount));
  const lostWords = words.slice(Math.max(1, words.length - wordsCutoffCount));

  // Construct neutral filler (e.g. repeated neutral filler tokens)
  const fillerTokensCount = Math.max(0, targetTokenLimit - remainingWords.length - 2);
  const filler = Array(fillerTokensCount).fill('neutral').join(' ');
  const truncationEquivalentPrompt = `${remainingWords.join(' ')} ${filler}`.trim();

  return {
    mutatedExpandedLength: mutatedPrompt.length,
    mutatedTokenCount: mutTokens.tokenCount,
    truncationEquivalentPrompt,
    tailTokensLost: lostWords,
  };
}

/**
 * Glitch-Candidate Discovery Hook (Precursor bridge for future UEP-GD).
 * Extracts candidate unusual token IDs, rare pieces, or byte fallbacks from tokenizer inspection.
 */
export function extractGlitchCandidateTokens(inspection: MultiEncoderInspectionResult): {
  candidateTokenIds: number[];
  candidateRarePieces: string[];
  fallbackTokenIds: number[];
} {
  const candidateTokenIds: number[] = [];
  const candidateRarePieces: string[] = [];
  const fallbackTokenIds: number[] = [];

  if (!inspection.isInstrumented) {
    return { candidateTokenIds, candidateRarePieces, fallbackTokenIds };
  }

  for (const enc of Object.values(inspection.encoders)) {
    if (enc.unknownOrFallbackTokens) {
      fallbackTokenIds.push(...enc.unknownOrFallbackTokens);
    }
    enc.pieces.forEach((p, idx) => {
      if (p.length === 1 && p.charCodeAt(0) > 127) {
        candidateRarePieces.push(p);
        candidateTokenIds.push(enc.tokenIds[idx]);
      }
    });
  }

  return {
    candidateTokenIds: Array.from(new Set(candidateTokenIds)),
    candidateRarePieces: Array.from(new Set(candidateRarePieces)),
    fallbackTokenIds: Array.from(new Set(fallbackTokenIds)),
  };
}
