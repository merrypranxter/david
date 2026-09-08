/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Homoglyph Library for Cross-Script Tokenization Divergence
 * 
 * CORE PRINCIPLE:
 * The technical purpose of homoglyphs is TOKENIZATION DIVERGENCE.
 * When cross-script characters are introduced into a target word, they may force
 * the subword tokenizer (BPE, SentencePiece, WordPiece) to split the word into
 * rare or foreign-vocabulary subword pieces, altering the embedding representations.
 * 
 * We use ONLY genuine, high-fidelity visually identical or near-identical glyphs
 * from an explicit whitelist, NEVER random or unrelated characters.
 */

import { HomoglyphEntry, HomoglyphScript } from '../types/serialization';

export const HOMOGLYPH_REGISTRY: HomoglyphEntry[] = [
  // -------------------------------------------------------------
  // LATIN <-> CYRILLIC (LOWERCASE)
  // -------------------------------------------------------------
  { sourceChar: 'a', sourceScript: 'latin', targetChar: 'а', targetScript: 'cyrillic', codePoint: 'U+0430', visualSimilarity: 1.0 },
  { sourceChar: 'c', sourceScript: 'latin', targetChar: 'с', targetScript: 'cyrillic', codePoint: 'U+0441', visualSimilarity: 1.0 },
  { sourceChar: 'e', sourceScript: 'latin', targetChar: 'е', targetScript: 'cyrillic', codePoint: 'U+0435', visualSimilarity: 1.0 },
  { sourceChar: 'i', sourceScript: 'latin', targetChar: 'і', targetScript: 'cyrillic', codePoint: 'U+0456', visualSimilarity: 1.0 },
  { sourceChar: 'j', sourceScript: 'latin', targetChar: 'ј', targetScript: 'cyrillic', codePoint: 'U+0458', visualSimilarity: 1.0 },
  { sourceChar: 'o', sourceScript: 'latin', targetChar: 'о', targetScript: 'cyrillic', codePoint: 'U+043E', visualSimilarity: 1.0 },
  { sourceChar: 'p', sourceScript: 'latin', targetChar: 'р', targetScript: 'cyrillic', codePoint: 'U+0440', visualSimilarity: 1.0 },
  { sourceChar: 's', sourceScript: 'latin', targetChar: 'ѕ', targetScript: 'cyrillic', codePoint: 'U+0455', visualSimilarity: 0.98 },
  { sourceChar: 'x', sourceScript: 'latin', targetChar: 'х', targetScript: 'cyrillic', codePoint: 'U+0445', visualSimilarity: 1.0 },
  { sourceChar: 'y', sourceScript: 'latin', targetChar: 'у', targetScript: 'cyrillic', codePoint: 'U+0443', visualSimilarity: 0.95 },

  // -------------------------------------------------------------
  // LATIN <-> GREEK (LOWERCASE)
  // -------------------------------------------------------------
  { sourceChar: 'o', sourceScript: 'latin', targetChar: 'ο', targetScript: 'greek', codePoint: 'U+03BF', visualSimilarity: 1.0 },
  { sourceChar: 'p', sourceScript: 'latin', targetChar: 'ρ', targetScript: 'greek', codePoint: 'U+03C1', visualSimilarity: 0.95 },
  { sourceChar: 'v', sourceScript: 'latin', targetChar: 'ν', targetScript: 'greek', codePoint: 'U+03BD', visualSimilarity: 0.92 },
  { sourceChar: 'x', sourceScript: 'latin', targetChar: 'χ', targetScript: 'greek', codePoint: 'U+03C7', visualSimilarity: 0.96 },

  // -------------------------------------------------------------
  // LATIN <-> CYRILLIC (UPPERCASE)
  // -------------------------------------------------------------
  { sourceChar: 'A', sourceScript: 'latin', targetChar: 'А', targetScript: 'cyrillic', codePoint: 'U+0410', visualSimilarity: 1.0 },
  { sourceChar: 'B', sourceScript: 'latin', targetChar: 'В', targetScript: 'cyrillic', codePoint: 'U+0412', visualSimilarity: 1.0 },
  { sourceChar: 'C', sourceScript: 'latin', targetChar: 'С', targetScript: 'cyrillic', codePoint: 'U+0421', visualSimilarity: 1.0 },
  { sourceChar: 'E', sourceScript: 'latin', targetChar: 'Е', targetScript: 'cyrillic', codePoint: 'U+0415', visualSimilarity: 1.0 },
  { sourceChar: 'H', sourceScript: 'latin', targetChar: 'Н', targetScript: 'cyrillic', codePoint: 'U+041D', visualSimilarity: 1.0 },
  { sourceChar: 'K', sourceScript: 'latin', targetChar: 'К', targetScript: 'cyrillic', codePoint: 'U+041A', visualSimilarity: 1.0 },
  { sourceChar: 'M', sourceScript: 'latin', targetChar: 'М', targetScript: 'cyrillic', codePoint: 'U+041C', visualSimilarity: 1.0 },
  { sourceChar: 'O', sourceScript: 'latin', targetChar: 'О', targetScript: 'cyrillic', codePoint: 'U+041E', visualSimilarity: 1.0 },
  { sourceChar: 'P', sourceScript: 'latin', targetChar: 'Р', targetScript: 'cyrillic', codePoint: 'U+0420', visualSimilarity: 1.0 },
  { sourceChar: 'T', sourceScript: 'latin', targetChar: 'Т', targetScript: 'cyrillic', codePoint: 'U+0422', visualSimilarity: 1.0 },
  { sourceChar: 'X', sourceScript: 'latin', targetChar: 'Х', targetScript: 'cyrillic', codePoint: 'U+0425', visualSimilarity: 1.0 },

  // -------------------------------------------------------------
  // LATIN <-> GREEK (UPPERCASE)
  // -------------------------------------------------------------
  { sourceChar: 'A', sourceScript: 'latin', targetChar: 'Α', targetScript: 'greek', codePoint: 'U+0391', visualSimilarity: 1.0 },
  { sourceChar: 'B', sourceScript: 'latin', targetChar: 'Β', targetScript: 'greek', codePoint: 'U+0392', visualSimilarity: 1.0 },
  { sourceChar: 'E', sourceScript: 'latin', targetChar: 'Ε', targetScript: 'greek', codePoint: 'U+0395', visualSimilarity: 1.0 },
  { sourceChar: 'H', sourceScript: 'latin', targetChar: 'Η', targetScript: 'greek', codePoint: 'U+0397', visualSimilarity: 1.0 },
  { sourceChar: 'I', sourceScript: 'latin', targetChar: 'Ι', targetScript: 'greek', codePoint: 'U+0399', visualSimilarity: 1.0 },
  { sourceChar: 'K', sourceScript: 'latin', targetChar: 'Κ', targetScript: 'greek', codePoint: 'U+039A', visualSimilarity: 1.0 },
  { sourceChar: 'M', sourceScript: 'latin', targetChar: 'Μ', targetScript: 'greek', codePoint: 'U+039C', visualSimilarity: 1.0 },
  { sourceChar: 'N', sourceScript: 'latin', targetChar: 'Ν', targetScript: 'greek', codePoint: 'U+039D', visualSimilarity: 1.0 },
  { sourceChar: 'O', sourceScript: 'latin', targetChar: 'Ο', targetScript: 'greek', codePoint: 'U+039F', visualSimilarity: 1.0 },
  { sourceChar: 'P', sourceScript: 'latin', targetChar: 'Ρ', targetScript: 'greek', codePoint: 'U+03A1', visualSimilarity: 1.0 },
  { sourceChar: 'T', sourceScript: 'latin', targetChar: 'Τ', targetScript: 'greek', codePoint: 'U+03A4', visualSimilarity: 1.0 },
  { sourceChar: 'X', sourceScript: 'latin', targetChar: 'Χ', targetScript: 'greek', codePoint: 'U+03A7', visualSimilarity: 1.0 },
  { sourceChar: 'Y', sourceScript: 'latin', targetChar: 'Υ', targetScript: 'greek', codePoint: 'U+03A5', visualSimilarity: 1.0 },
  { sourceChar: 'Z', sourceScript: 'latin', targetChar: 'Ζ', targetScript: 'greek', codePoint: 'U+0396', visualSimilarity: 1.0 },
];

/**
 * Retrieves candidate homoglyphs for a given source character.
 */
export function getHomoglyphsForChar(
  char: string,
  targetScripts: HomoglyphScript[] = ['cyrillic', 'greek'],
  minSimilarity: number = 0.90
): HomoglyphEntry[] {
  return HOMOGLYPH_REGISTRY.filter(
    (entry) =>
      entry.sourceChar === char &&
      targetScripts.includes(entry.targetScript) &&
      entry.visualSimilarity >= minSimilarity
  );
}

/**
 * Simple deterministic seeded pseudo-random number generator for repeatability.
 */
function createSeededRandom(seed: number = 42) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Selectively replaces characters in target string with visually similar homoglyphs.
 * 
 * @param text The input substring
 * @param substitutionRatio Between 0.0 (baseline, untouched) and 1.0 (all eligible substituted)
 * @param targetScripts Allowed script families to draw glyphs from
 * @param seed Optional seed for deterministic execution
 */
export function applyHomoglyphSubstitution(
  text: string,
  substitutionRatio: number = 0.3,
  targetScripts: HomoglyphScript[] = ['cyrillic', 'greek'],
  seed: number = 42
): {
  mutatedText: string;
  substitutionsCount: number;
  eligibleCount: number;
  substitutedPositions: number[];
} {
  if (substitutionRatio <= 0) {
    return {
      mutatedText: text,
      substitutionsCount: 0,
      eligibleCount: 0,
      substitutedPositions: [],
    };
  }

  const rng = createSeededRandom(seed);
  const chars = Array.from(text);

  // Find all indices that have valid homoglyphs
  const eligibleIndices: number[] = [];
  chars.forEach((c, idx) => {
    const candidates = getHomoglyphsForChar(c, targetScripts);
    if (candidates.length > 0) {
      eligibleIndices.push(idx);
    }
  });

  if (eligibleIndices.length === 0) {
    return {
      mutatedText: text,
      substitutionsCount: 0,
      eligibleCount: 0,
      substitutedPositions: [],
    };
  }

  // Determine how many to substitute based on ratio
  const targetCount = Math.min(
    eligibleIndices.length,
    Math.max(1, Math.round(eligibleIndices.length * substitutionRatio))
  );

  // Shuffle eligible indices deterministically
  const shuffled = [...eligibleIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const chosenIndices = new Set(shuffled.slice(0, targetCount));
  const substitutedPositions: number[] = [];

  const mutatedChars = chars.map((char, index) => {
    if (chosenIndices.has(index)) {
      const candidates = getHomoglyphsForChar(char, targetScripts);
      if (candidates.length > 0) {
        // Pick one deterministically
        const pick = candidates[Math.floor(rng() * candidates.length)];
        substitutedPositions.push(index);
        return pick.targetChar;
      }
    }
    return char;
  });

  return {
    mutatedText: mutatedChars.join(''),
    substitutionsCount: substitutedPositions.length,
    eligibleCount: eligibleIndices.length,
    substitutedPositions,
  };
}
