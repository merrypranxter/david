/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 3: Distractor & Intervening Context Library
 * 
 * CORE PRINCIPLE:
 * Generates controlled intervening context that consumes representational budget
 * without introducing a single dominant concept or degenerating into random keyword soup.
 * 
 * Works across artistic subjects by providing carefully balanced lexical clusters:
 * - WEAK_CONCEPTS: Low-salience atmospheric or peripheral background cues
 * - POLYSEMANTIC_TERMS: Words with ambiguous multi-domain latent embeddings
 * - UNRELATED_MATERIALS: Chemically or physically inert textures
 * - SECONDARY_RELATIONS: Spatial or temporal conjunctions that consume binding bandwidth
 * - LOW_PRIORITY_STRUCTURAL: Architectural or compositional scaffoldings
 * - REPEATED_NEUTRAL: Controlled filler blocks for length-matched normalization
 */

import { DistractorBlockConfig, DistractorFamily } from '../types/contextBinding';

export const DISTRACTOR_VOCABULARY: Record<DistractorFamily, string[]> = {
  WEAK_CONCEPTS: [
    'ambient peripheral drift',
    'diffuse secondary illumination',
    'subsidiary dust particles',
    'subdued tonal wash',
    'receding horizon gradient',
    'muted environmental haze',
    'indirect bounce light',
    'gentle luminance fluctuation',
    'soft focus gradation',
    'marginal background texture',
  ],

  POLYSEMANTIC_TERMS: [
    'interlocking cellular lattice',
    'harmonic frequency resonance',
    'suspended tension boundary',
    'current gradient transition',
    'chambered interior acoustic',
    'axial coordinate grid',
    'neutral focal plane',
    'phase shift interval',
    'balanced dynamic register',
    'striated stratum layer',
  ],

  UNRELATED_MATERIALS: [
    'brushed basalt substrate',
    'honed slate mineral',
    'dense talc sediment',
    'matte porcelain fragment',
    'calcified limestone grain',
    'oxidized zinc patina',
    'compacted silt aggregate',
    'raw unglazed stoneware',
    'pressed mica sheet',
    'coarse pumice deposit',
  ],

  SECONDARY_RELATIONS: [
    'positioned alongside adjacent perimeter',
    'transversely oriented across midplane',
    'extending toward lateral quadrant',
    'bordered by secondary margin',
    'situated beyond tertiary threshold',
    'flanked by symmetrical intervals',
    'aligned with diagonal datum',
    'offset from perimeter boundary',
  ],

  LOW_PRIORITY_STRUCTURAL: [
    'framework scaffolding support',
    'orthogonal framing geometry',
    'recessed negative alcove',
    'linear partition division',
    'modular partition array',
    'retaining column baseline',
    'structural interstitial gap',
    'transverse lintel beam',
  ],

  REPEATED_NEUTRAL: [
    'neutral planar surface',
    'uniform grey field',
    'unmarked spatial quadrant',
    'constant tonal backdrop',
    'flat baseline horizon',
    'homogeneous spatial expanse',
  ],
};

/**
 * Deterministic pseudo-random sequence generator from seed.
 */
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Builds a distractor block text according to configuration parameters.
 */
export function generateDistractorBlock(config: DistractorBlockConfig): {
  text: string;
  wordCount: number;
  tokensEstimated: number;
  itemsUsed: string[];
} {
  const seed = config.seed ?? 1337;
  const rng = seededRandom(seed);
  const pool = DISTRACTOR_VOCABULARY[config.family] || DISTRACTOR_VOCABULARY.WEAK_CONCEPTS;

  const targetWordCount = Math.max(2, Math.floor(config.lengthBudgetWords * Math.max(0.1, config.density)));
  const collectedItems: string[] = [];
  let currentWords = 0;

  // Selection loop based on diversity
  const poolCopy = [...pool];
  // Shuffle poolCopy if moderate or high diversity
  if (config.semanticDiversity !== 'low') {
    for (let i = poolCopy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
    }
  }

  let index = 0;
  while (currentWords < targetWordCount) {
    let item: string;
    if (config.repetition && config.semanticDiversity === 'low') {
      // Pick the first item repeatedly
      item = poolCopy[0];
    } else {
      item = poolCopy[index % poolCopy.length];
      index++;
    }

    const itemWords = item.split(/\s+/).length;
    collectedItems.push(item);
    currentWords += itemWords;

    if (currentWords >= targetWordCount && collectedItems.length >= 1) {
      break;
    }
  }

  // Join items based on distribution pattern
  let formattedText: string;
  if (config.distributionPattern === 'clustered_mid') {
    formattedText = `interposed with ${collectedItems.join(', ')}`;
  } else if (config.distributionPattern === 'gradient_falloff') {
    formattedText = `gradually fading into ${collectedItems.join(' then ')}`;
  } else {
    // dispersed
    formattedText = collectedItems.join('; ');
  }

  const finalWordCount = formattedText.split(/\s+/).filter(Boolean).length;

  return {
    text: formattedText,
    wordCount: finalWordCount,
    tokensEstimated: Math.ceil(finalWordCount * 1.3),
    itemsUsed: collectedItems,
  };
}

/**
 * Creates a neutral filler string with matching target word count for length-controlled confounding tests.
 */
export function generateLengthMatchedNeutralFiller(targetWordCount: number, seed: number = 42): string {
  const rng = seededRandom(seed);
  const neutrals = DISTRACTOR_VOCABULARY.REPEATED_NEUTRAL;
  const parts: string[] = [];
  let words = 0;

  while (words < targetWordCount) {
    const item = neutrals[Math.floor(rng() * neutrals.length)];
    parts.push(item);
    words += item.split(/\s+/).length;
  }

  return parts.join(', ');
}
