/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Controlled Library of Unicode Boundary Perturbations & Separators
 * 
 * CORE PRINCIPLE:
 * Keep the library inspectable, categorised, and finite.
 * Do NOT indiscriminately inject exotic Unicode or turn this into an uncontrolled garbage generator.
 */

import { UnicodeCandidateChar, UnicodeSeparatorCategory } from '../types/serialization';

export const UNICODE_CANDIDATE_REGISTRY: UnicodeCandidateChar[] = [
  // -------------------------------------------------------------
  // BOUNDARY_SPLITTER
  // -------------------------------------------------------------
  {
    codePoint: 'U+034F',
    char: '\u034F',
    name: 'Combining Grapheme Joiner (CGJ)',
    category: 'BOUNDARY_SPLITTER',
    knownRisks: [
      'May be normalized away under NFC or stripped by basic input sanitizers',
      'Can split digraphs or break ligature formation without visible spacing',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved in NFC/NFD; ignored in standard collation but splits collation sequences',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+00AD',
    char: '\u00AD',
    name: 'Soft Hyphen (SHY)',
    category: 'BOUNDARY_SPLITTER',
    knownRisks: [
      'Renders visually as a hyphen if positioned at an automatic word break',
      'Commonly stripped or converted to space by web scrapers and pre-tokenizers',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved under standard Unicode normalization; often stripped by regex \\s/\\b filters',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+2060',
    char: '\u2060',
    name: 'Word Joiner (WJ)',
    category: 'BOUNDARY_SPLITTER',
    knownRisks: [
      'Invisible, suppresses line-break opportunities',
      'May be treated as whitespace or unknown token by older Byte-Pair Encoders',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved under NFC/NFD',
    safeForExperiment: true,
  },

  // -------------------------------------------------------------
  // ZERO_WIDTH
  // -------------------------------------------------------------
  {
    codePoint: 'U+200B',
    char: '\u200B',
    name: 'Zero Width Space (ZWSP)',
    category: 'ZERO_WIDTH',
    knownRisks: [
      'Causes word boundary split in pre-tokenizers that segment on Unicode whitespace property (WSpace=Y)',
      'Invisible in human-facing text UI',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved in NFC/NFD/NFKC/NFKD; stripped by aggressive string trims',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+200C',
    char: '\u200C',
    name: 'Zero Width Non-Joiner (ZWNJ)',
    category: 'ZERO_WIDTH',
    knownRisks: [
      'Essential in Persian/Indic scripts; breaks ligatures in Latin',
      'Can prevent multi-letter BPE merge rules (e.g. "th" -> "t" + ZWNJ + "h")',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved in NFC/NFD; preserved in NFKC/NFKD',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+200D',
    char: '\u200D',
    name: 'Zero Width Joiner (ZWJ)',
    category: 'ZERO_WIDTH',
    knownRisks: [
      'Used for emoji sequences; can alter tokenizer fallback sequences',
      'May trigger byte-fallback token in standard LLM tokenizers',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Preserved in NFC/NFD; preserved in NFKC/NFKD',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+FEFF',
    char: '\uFEFF',
    name: 'Zero Width No-Break Space (BOM)',
    category: 'ZERO_WIDTH',
    knownRisks: [
      'Often stripped at string start by HTTP body decoders',
      'Mid-string insertion may trigger unexpected byte-fallback tokens',
    ],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Normalizes to U+2060 under NFKC/NFKD in some implementations, or remains byte marker',
    safeForExperiment: true,
  },

  // -------------------------------------------------------------
  // COMBINING_MARK (Diacritical Mark Subsets for DS-BFAH)
  // -------------------------------------------------------------
  {
    codePoint: 'U+0300',
    char: '\u0300',
    name: 'Combining Grave Accent',
    category: 'COMBINING_MARK',
    knownRisks: ['Decomposes under NFD; composes into single precomposed character under NFC if available'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Subject to canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0301',
    char: '\u0301',
    name: 'Combining Acute Accent',
    category: 'COMBINING_MARK',
    knownRisks: ['Decomposes under NFD; composes under NFC'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Subject to canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0308',
    char: '\u0308',
    name: 'Combining Diaeresis',
    category: 'COMBINING_MARK',
    knownRisks: ['Composes under NFC (e.g. e + umlaut -> ë)'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0303',
    char: '\u0303',
    name: 'Combining Tilde',
    category: 'COMBINING_MARK',
    knownRisks: ['Composes under NFC'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+030A',
    char: '\u030A',
    name: 'Combining Ring Above',
    category: 'COMBINING_MARK',
    knownRisks: ['Composes with A -> Å in NFC'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0315',
    char: '\u0315',
    name: 'Combining Comma Above Right',
    category: 'COMBINING_MARK',
    knownRisks: ['Rarely composes; persists as individual combining mark code point'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Remains combining mark in both NFC and NFD',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0334',
    char: '\u0334',
    name: 'Combining Tilde Overlay',
    category: 'COMBINING_MARK',
    knownRisks: ['Strikes through center of base character; stacks vertically in Zalgo'],
    visualImpact: 'DESTRUCTIVE',
    normalizationBehavior: 'Remains independent combining character in NFC/NFD',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0336',
    char: '\u0336',
    name: 'Combining Long Stroke Overlay',
    category: 'COMBINING_MARK',
    knownRisks: ['Creates strikethrough appearance; can confuse OCR / visual encoders'],
    visualImpact: 'DESTRUCTIVE',
    normalizationBehavior: 'Remains independent combining character',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0327',
    char: '\u0327',
    name: 'Combining Cedilla',
    category: 'COMBINING_MARK',
    knownRisks: ['Composes under NFC with c -> ç'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0328',
    char: '\u0328',
    name: 'Combining Ogonek',
    category: 'COMBINING_MARK',
    knownRisks: ['Subscript hook; composes with vowels under NFC'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Canonical composition/decomposition',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0332',
    char: '\u0332',
    name: 'Combining Low Line',
    category: 'COMBINING_MARK',
    knownRisks: ['Underlines glyph; can form continuous underscore line'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Remains independent combining code point',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+0344',
    char: '\u0344',
    name: 'Combining Greek Dialytika Tonos',
    category: 'COMBINING_MARK',
    knownRisks: ['Deprecated in Unicode standard; decomposes to U+0308 + U+0301 in NFD/NFC'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Decomposes automatically under both NFC and NFD',
    safeForExperiment: true,
  },

  // -------------------------------------------------------------
  // NORMALIZATION_SENSITIVE
  // -------------------------------------------------------------
  {
    codePoint: 'U+212B',
    char: '\u212B',
    name: 'Angstrom Sign',
    category: 'NORMALIZATION_SENSITIVE',
    knownRisks: ['Canonically equivalent to U+00C5 (Latin Capital Letter A with Ring Above)'],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Replaced with U+00C5 in NFC; U+0041 U+030A in NFD',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+FB01',
    char: '\uFB01',
    name: 'Latin Small Ligature fi',
    category: 'NORMALIZATION_SENSITIVE',
    knownRisks: ['Compatibility decomposition expands to f + i under NFKD/NFKC; preserved in NFC/NFD'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Preserved in NFC; decomposed to "fi" in NFKC',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+FB02',
    char: '\uFB02',
    name: 'Latin Small Ligature fl',
    category: 'NORMALIZATION_SENSITIVE',
    knownRisks: ['Decomposes to f + l in NFKC/NFKD'],
    visualImpact: 'SUBTLE',
    normalizationBehavior: 'Preserved in NFC; decomposed to "fl" in NFKC',
    safeForExperiment: true,
  },
  {
    codePoint: 'U+00A0',
    char: '\u00A0',
    name: 'No-Break Space (NBSP)',
    category: 'NORMALIZATION_SENSITIVE',
    knownRisks: ['Converts to regular space U+0020 under NFKC/NFKD; preserved under NFC/NFD'],
    visualImpact: 'INVISIBLE',
    normalizationBehavior: 'Converted to U+0020 in NFKC/NFKD',
    safeForExperiment: true,
  },
];

/**
 * Returns registered candidate characters by category.
 */
export function getSeparatorsByCategory(category: UnicodeSeparatorCategory): UnicodeCandidateChar[] {
  return UNICODE_CANDIDATE_REGISTRY.filter((c) => c.category === category && c.safeForExperiment);
}

/**
 * Retrieves a candidate character by code point string (e.g. "U+034F").
 */
export function getUnicodeCharByCodePoint(codePoint: string): UnicodeCandidateChar | undefined {
  const normalizedCp = codePoint.toUpperCase().startsWith('U+') ? codePoint.toUpperCase() : `U+${codePoint.toUpperCase()}`;
  return UNICODE_CANDIDATE_REGISTRY.find((c) => c.codePoint === normalizedCp);
}

/**
 * Returns character string for code points (e.g. U+034F -> '\u034F').
 */
export function codePointToChar(codePoint: string): string {
  const match = codePoint.match(/U\+([0-9A-Fa-f]+)/);
  if (match && match[1]) {
    return String.fromCodePoint(parseInt(match[1], 16));
  }
  return codePoint;
}
