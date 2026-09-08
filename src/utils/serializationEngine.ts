/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Reusable Serialization Mutation Engine
 * 
 * CORE CONTRACT:
 * - canonicalInput is NEVER overwritten. User-facing semantic intent remains recoverable.
 * - Operates cleanly on selected spans rather than forcing mutation across the entire input.
 * - Strictly enforces hard expansion limits (MUTATION_CLAMPED) to prevent runaway strings or UI freezes.
 * - Computes complete diagnostics: code points, UTF-8 byte length, escaped representation, and context risk.
 */

import {
  MutationPlan,
  SerializedMutationResult,
  SerializationDiagnostics,
  TargetSpanSelector,
  NormalizationMode,
  ClampingLimits,
  DEFAULT_CLAMPING_LIMITS,
  ContextRiskLevel,
} from '../types/serialization';

/**
 * Calculates UTF-8 byte length accurately.
 */
export function getUtf8ByteLength(str: string): number {
  return new TextEncoder().encode(str).length;
}
export const countUTF8Bytes = getUtf8ByteLength;

/**
 * Counts genuine Unicode code points (properly handling surrogate pairs).
 */
export function getUnicodeCodePointCount(str: string): number {
  return Array.from(str).length;
}
export const countCodePoints = getUnicodeCodePointCount;

/**
 * Generates an inspectable human-readable escaped representation.
 * Leaves standard ASCII printable characters visible, while escaping invisible characters,
 * combining marks, zero-width spaces, and high Unicode code points as \uXXXX.
 * 
 * Example: "m\u034Fand\u034Fible"
 */
export function toEscapedUnicodeString(str: string): string {
  let escaped = '';
  for (const char of Array.from(str)) {
    const cp = char.codePointAt(0);
    if (cp === undefined) continue;

    // ASCII printable range: space (0x20) to tilde (0x7E)
    if (cp >= 0x20 && cp <= 0x7E) {
      escaped += char;
    } else if (cp <= 0xFFFF) {
      // 4-digit hex
      escaped += `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`;
    } else {
      // Supplementary plane
      escaped += `\\u{${cp.toString(16).toUpperCase()}}`;
    }
  }
  return escaped;
}
export const generateMachineEscapedView = toEscapedUnicodeString;

/**
 * Returns an array of formatted Unicode code point identifiers (e.g. ["U+006D", "U+034F", "U+0061"]).
 */
export function getCodePointSequence(str: string, maxItems: number = 64): string[] {
  const codePoints: string[] = [];
  const chars = Array.from(str);
  for (let i = 0; i < Math.min(chars.length, maxItems); i++) {
    const cp = chars[i].codePointAt(0);
    if (cp !== undefined) {
      codePoints.push(`U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
    }
  }
  if (chars.length > maxItems) {
    codePoints.push(`... (+${chars.length - maxItems} more)`);
  }
  return codePoints;
}

/**
 * Normalizes a string according to the requested Unicode normalization mode.
 */
export function applyUnicodeNormalization(str: string, mode: NormalizationMode): string {
  switch (mode) {
    case 'NFC':
      return str.normalize('NFC');
    case 'NFD':
      return str.normalize('NFD');
    case 'NFKC':
      return str.normalize('NFKC');
    case 'NFKD':
      return str.normalize('NFKD');
    case 'RAW':
    default:
      return str;
  }
}

/**
 * Locates the target span indices [startIndex, endIndex] inside the input string.
 */
export function resolveTargetSpanIndices(
  text: string,
  selector: TargetSpanSelector
): Array<[number, number]> {
  const result: Array<[number, number]> = [];

  switch (selector.type) {
    case 'entire_prompt':
      result.push([0, text.length]);
      break;

    case 'selected_phrase':
    case 'modifier': {
      if (!selector.matchText) {
        result.push([0, text.length]);
        break;
      }
      const matchText = selector.matchText;
      let startPos = 0;
      let matchIdx = -1;
      let count = 0;

      while ((matchIdx = text.toLowerCase().indexOf(matchText.toLowerCase(), startPos)) !== -1) {
        if (
          selector.occurrenceIndex === 'all' ||
          selector.occurrenceIndex === undefined ||
          selector.occurrenceIndex === count
        ) {
          result.push([matchIdx, matchIdx + matchText.length]);
        }
        count++;
        startPos = matchIdx + matchText.length;
        if (selector.occurrenceIndex !== 'all' && selector.occurrenceIndex !== undefined) {
          break;
        }
      }

      if (result.length === 0) {
        // Fallback to entire prompt if target phrase wasn't found
        result.push([0, text.length]);
      }
      break;
    }

    case 'delimiter': {
      // Find punctuation / delimiter characters: , . ; : | / [ ] ( )
      const regex = /[,.;:|/\[\]()"-]+/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        result.push([match.index, match.index + match[0].length]);
      }
      if (result.length === 0) {
        result.push([0, text.length]);
      }
      break;
    }

    case 'word': {
      // Split into words by whitespace
      const wordsWithIndices: Array<{ word: string; start: number; end: number }> = [];
      const regex = /\S+/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        wordsWithIndices.push({
          word: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }

      const targetIndices = selector.wordIndices ?? [0];
      for (const idx of targetIndices) {
        if (wordsWithIndices[idx]) {
          result.push([wordsWithIndices[idx].start, wordsWithIndices[idx].end]);
        }
      }
      if (result.length === 0) {
        result.push([0, text.length]);
      }
      break;
    }

    case 'character_position': {
      const charIndices = selector.characterIndices ?? [0];
      for (const idx of charIndices) {
        if (idx >= 0 && idx < text.length) {
          result.push([idx, idx + 1]);
        }
      }
      if (result.length === 0) {
        result.push([0, text.length]);
      }
      break;
    }

    case 'repeated_locations': {
      if (selector.regex) {
        try {
          const re = new RegExp(selector.regex, 'g');
          let m: RegExpExecArray | null;
          while ((m = re.exec(text)) !== null) {
            result.push([m.index, m.index + m[0].length]);
          }
        } catch {
          result.push([0, text.length]);
        }
      } else {
        result.push([0, text.length]);
      }
      break;
    }

    default:
      result.push([0, text.length]);
  }

  return result;
}

/**
 * Assesses context risk given the mutated length and target limits.
 */
export function evaluateContextRisk(
  mutatedByteLength: number,
  mutatedCodePointCount: number,
  knownLimitChars: number = 1500
): ContextRiskLevel {
  const charRatio = mutatedCodePointCount / knownLimitChars;

  if (mutatedCodePointCount >= knownLimitChars || mutatedByteLength > 8192) {
    return 'CONTEXT_LIMIT_EXCEEDED';
  }
  if (charRatio >= 0.85) {
    return 'HIGH';
  }
  if (charRatio >= 0.60) {
    return 'MODERATE';
  }
  return 'LOW';
}

/**
 * Clamps mutated spans to ensure safety limits are not exceeded.
 * Clamps ONLY the inserted mutation entropy, strictly preserving the base semantic characters.
 */
export function enforceClampingLimits(
  originalInput: string,
  proposedMutated: string,
  limits: ClampingLimits
): {
  clampedString: string;
  isClamped: boolean;
  clampReason?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isClamped = false;
  let clampReason: string | undefined;

  let current = proposedMutated;
  const origBytes = getUtf8ByteLength(originalInput);
  const currentBytes = getUtf8ByteLength(current);

  // 1. Max UTF-8 Byte Length limit
  if (currentBytes > limits.maxUTF8Bytes) {
    isClamped = true;
    clampReason = 'MUTATION_CLAMPED: Exceeded max UTF-8 byte limit';
    warnings.push(`Output clamped from ${currentBytes}B to ${limits.maxUTF8Bytes}B`);
    // Slice cleanly at code point boundaries
    const codePoints = Array.from(current);
    while (getUtf8ByteLength(codePoints.join('')) > limits.maxUTF8Bytes && codePoints.length > originalInput.length) {
      codePoints.pop();
    }
    current = codePoints.join('');
  }

  // 2. Max Mutation Characters limit
  if (current.length > limits.maxMutationCharacters) {
    isClamped = true;
    clampReason = 'MUTATION_CLAMPED: Exceeded max character limit';
    warnings.push(`Output clamped to ${limits.maxMutationCharacters} characters`);
    current = current.slice(0, limits.maxMutationCharacters);
  }

  // 3. Max Expansion Ratio limit
  const currentRatio = current.length / Math.max(1, originalInput.length);
  if (currentRatio > limits.maxExpansionRatio) {
    isClamped = true;
    clampReason = `MUTATION_CLAMPED: Expansion ratio ${currentRatio.toFixed(1)}x exceeded limit of ${limits.maxExpansionRatio}x`;
    warnings.push(clampReason);
    const maxAllowedChars = Math.floor(originalInput.length * limits.maxExpansionRatio);
    current = current.slice(0, Math.max(originalInput.length, maxAllowedChars));
  }

  return {
    clampedString: current,
    isClamped,
    clampReason,
    warnings,
  };
}

/**
 * Assembles complete serialization diagnostics for the mutation run.
 */
export function createSerializationDiagnostics(
  originalInput: string,
  mutatedInput: string,
  clamped: boolean,
  clampReason?: string,
  extraWarnings: string[] = [],
  knownLimitChars: number = 1500
): SerializationDiagnostics {
  const originalLength = originalInput.length;
  const originalCodePoints = getUnicodeCodePointCount(originalInput);
  const originalByteLength = getUtf8ByteLength(originalInput);

  const mutatedLength = mutatedInput.length;
  const mutatedCodePoints = getUnicodeCodePointCount(mutatedInput);
  const mutatedByteLength = getUtf8ByteLength(mutatedInput);

  const expansionRatio = originalLength > 0 ? mutatedLength / originalLength : 1.0;
  const escapedRepresentation = toEscapedUnicodeString(mutatedInput);
  const codePointSequence = getCodePointSequence(mutatedInput, 40);

  const contextRisk = evaluateContextRisk(mutatedByteLength, mutatedCodePoints, knownLimitChars);

  const warnings = [...extraWarnings];
  if (clamped && clampReason) {
    warnings.push(clampReason);
  }
  if (contextRisk === 'CONTEXT_LIMIT_EXCEEDED') {
    warnings.push('Warning: Mutated string exceeds estimated platform context limit.');
  }

  return {
    originalLength,
    originalCodePoints,
    originalByteLength,
    mutatedLength,
    mutatedCodePoints,
    mutatedByteLength,
    expansionRatio,
    escapedRepresentation,
    codePointSequence,
    clamped,
    clampReason,
    warnings,
    contextRisk,
  };
}

/**
 * Core transformer helper: applies a span transformation function to targeted spans of canonical input,
 * applies Unicode normalization, enforces limits, and returns a fully packaged SerializedMutationResult.
 */
export function executeSpanMutation(
  canonicalInput: string,
  plan: MutationPlan,
  spanTransformer: (spanText: string, spanIndex: number) => string,
  knownLimitChars: number = 1500
): SerializedMutationResult {
  const limits = plan.limits ?? DEFAULT_CLAMPING_LIMITS;

  // 1. Locate target spans
  const spans = resolveTargetSpanIndices(canonicalInput, plan.targetSpan);

  // 2. Perform transformation on selected spans from end to start to maintain indices
  const sortedSpans = [...spans].sort((a, b) => b[0] - a[0]);

  let mutated = canonicalInput;
  sortedSpans.forEach((span, i) => {
    const [start, end] = span;
    const targetSlice = mutated.slice(start, end);
    const transformedSlice = spanTransformer(targetSlice, i);
    mutated = mutated.slice(0, start) + transformedSlice + mutated.slice(end);
  });

  // 3. Apply requested Unicode normalization mode
  const normalized = applyUnicodeNormalization(mutated, plan.normalizationMode);

  // 4. Enforce strict clamping limits
  const { clampedString, isClamped, clampReason, warnings } = enforceClampingLimits(
    canonicalInput,
    normalized,
    limits
  );

  // 5. Generate diagnostics
  const diagnostics = createSerializationDiagnostics(
    canonicalInput,
    clampedString,
    isClamped,
    clampReason,
    warnings,
    knownLimitChars
  );

  return {
    canonicalInput,
    serializedExperimentalInput: clampedString,
    escapedView: diagnostics.escapedRepresentation,
    diagnostics,
    mutationPlan: plan,
  };
}
