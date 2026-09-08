import { TargetEngine } from '../types';

export interface CompressionOptions {
  preservedAnchors?: string[];
  targetEngine?: TargetEngine;
  hardCap?: number;
  preserveSentences?: boolean;
}

/**
 * Filter internal DAVID mutation control jargon from text intended for target AI models.
 * Replaces internal scaffolding vocabulary with natural descriptive expressions.
 */
export function filterMutationJargon(text: string, target?: TargetEngine): string {
  if (!text || typeof text !== 'string') return '';

  let filtered = text
    // Strip code-like structural descriptors
    .replace(/\bMutationRecipe\b/gi, 'structural design')
    .replace(/\bsemantic\s+distance(?:\s*[:=]\s*[\d\.]+)?/gi, '')
    .replace(/\bsemantic\s+neighbor\s+hops?(?:\s*[:=]\s*\d+)?/gi, '')
    .replace(/\bgenotype\b/gi, 'core structure')
    .replace(/\bphenotype\b/gi, 'visible manifestation')
    .replace(/\bfitness(?:\s+score)?(?:\s*[:=]\s*[\d\.]+)?/gi, '')
    .replace(/\bsurvivor(?:\s+candidate)?\b/gi, 'variant')
    .replace(/\bsibling\s+distance(?:\s*[:=]\s*[\d\.]+)?/gi, '')
    .replace(/\battractor\s+weight(?:\s*[:=]\s*[\d\.]+)?/gi, '')
    .replace(/\bcreative\s+pressure\b/gi, 'aesthetic focus')
    .replace(/\bDiversity\s+Select\b/gi, 'contrast')
    .replace(/\bPareto(?:\s+optimal)?\b/gi, 'balanced')
    .replace(/\bQD\s+candidate\b/gi, 'composition')
    .replace(/\bQuality-Diversity\b/gi, 'divergent structure')
    .replace(/\bNiche(?:\s+basin)?\b/gi, 'domain')
    .replace(/\b(the\s+)?ontology\s+swap\b/gi, 'categorical transformation')
    .replace(/\bthe\s+ontology\s+of\s+([a-zA-Z\s]+)\s+is\s+unstable\b/gi, '$1 exhibits an unstable, permeable boundary')
    .replace(/\bLatent\s+Fauna\b/gi, 'underlying archetype')
    .replace(/\boperator\s+directive\b/gi, 'structural rule');

  if (target === 'suno') {
    // Strip accidental visual terms that leak into audio prompts
    filtered = filtered
      .replace(/\b(?:35mm|anamorphic|macro lens|bokeh|photorealistic|hyperrealistic|cinematic lighting|octane render|unreal engine|8k resolution)\b/gi, '')
      .replace(/\b(?:visual|camera|lens|composition|spatial frame|foreground|background)\b/gi, '');
  }

  // Remove redundant whitespace
  filtered = filtered.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  return filtered;
}

/**
 * Categorize Content DNA seeds to allow target translators to apply them organically
 * rather than simply dumping tokens into prompts.
 */
export function categorizeContentDna(seeds: string[]): {
  structural: string[];
  material: string[];
  stylistic: string[];
  temporal: string[];
  signal: string[];
  conceptual: string[];
} {
  const categories = {
    structural: [] as string[],
    material: [] as string[],
    stylistic: [] as string[],
    temporal: [] as string[],
    signal: [] as string[],
    conceptual: [] as string[],
  };

  for (const rawSeed of seeds) {
    const seed = rawSeed.trim();
    if (!seed) continue;
    const lower = seed.toLowerCase();

    if (
      lower.includes('klein') ||
      lower.includes('torus') ||
      lower.includes('peano') ||
      lower.includes('manifold') ||
      lower.includes('lattice') ||
      lower.includes('topology') ||
      lower.includes('banach') ||
      lower.includes('r4') ||
      lower.includes('gyroid') ||
      lower.includes('boundary')
    ) {
      categories.structural.push(seed);
    } else if (
      lower.includes('rayleigh') ||
      lower.includes('marangoni') ||
      lower.includes('turing') ||
      lower.includes('viscous') ||
      lower.includes('chitin') ||
      lower.includes('lye') ||
      lower.includes('bismuth') ||
      lower.includes('phosphor') ||
      lower.includes('crystal')
    ) {
      categories.material.push(seed);
    } else if (
      lower.includes('vhs') ||
      lower.includes('echo') ||
      lower.includes('decay') ||
      lower.includes('delay') ||
      lower.includes('peristaltic') ||
      lower.includes('temporal') ||
      lower.includes('recur')
    ) {
      categories.temporal.push(seed);
    } else if (
      lower.includes('0hz') ||
      lower.includes('infrasound') ||
      lower.includes('phase') ||
      lower.includes('chladni') ||
      lower.includes('noise') ||
      lower.includes('vocoder') ||
      lower.includes('feedback')
    ) {
      categories.signal.push(seed);
    } else if (
      lower.includes('geocities') ||
      lower.includes('ytp') ||
      lower.includes('crt') ||
      lower.includes('liminal') ||
      lower.includes('mallsoft') ||
      lower.includes('weirdcore')
    ) {
      categories.stylistic.push(seed);
    } else {
      categories.conceptual.push(seed);
    }
  }

  return categories;
}

/**
 * Intelligent character limit compiler that compresses text while strictly preserving
 * protected anchors, subjects, and key structural rules over secondary adjectives.
 */
export function compressToCharacterBudget(text: string, maxChars: number, options?: CompressionOptions): string {
  if (!text || text.length <= maxChars) return text || '';

  const anchors = (options?.preservedAnchors || []).map((a) => a.trim()).filter(Boolean);

  // If text has distinct sentences or clauses, split them
  const sentences = text
    .split(/(?<=[.!?;\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    // Single long clause: truncate at word boundary
    const sliced = text.slice(0, maxChars - 3);
    const lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace > sliced.length * 0.7) {
      return sliced.slice(0, lastSpace).trim() + '...';
    }
    return sliced.trim() + '...';
  }

  // Score sentences by priority
  const scoredSentences = sentences.map((sent, index) => {
    let score = 50; // base score

    // 1. Critical Priority: Preserved Anchors
    for (const anchor of anchors) {
      const clean = anchor.replace(/^@/, '');
      if (sent.toLowerCase().includes(anchor.toLowerCase()) || sent.toLowerCase().includes(clean.toLowerCase())) {
        score += 150;
      }
    }

    // 2. High Priority: First sentence typically defines the subject/setup
    if (index === 0) score += 60;
    if (index === 1) score += 30;

    // 3. Medium Priority: Sentences carrying structural mutation verbs
    if (/\b(?:reconstructed|transforms|organizes|replaces|inverts|folds|migrates|degrades)\b/i.test(sent)) {
      score += 25;
    }

    // 4. Low Priority: Decorative/sensory filler
    if (/\b(?:beautiful|gorgeous|intricate|detailed|high quality|ornate|elaborate)\b/i.test(sent)) {
      score -= 30;
    }

    return { sent, score, index };
  });

  // Keep adding highest-priority sentences until budget is filled
  const sorted = [...scoredSentences].sort((a, b) => b.score - a.score);
  const selectedIndices = new Set<number>();
  let currentLength = 0;

  for (const item of sorted) {
    const additionalLen = item.sent.length + 1; // plus space
    if (currentLength + additionalLen <= maxChars) {
      selectedIndices.add(item.index);
      currentLength += additionalLen;
    }
  }

  // Always ensure at least the primary sentence (index 0) or anchor-bearing sentence is present
  if (selectedIndices.size === 0 && scoredSentences.length > 0) {
    const highest = sorted[0];
    return highest.sent.slice(0, maxChars - 3).trim() + '...';
  }

  // Reassemble in original order to maintain coherent flow
  const assembled = scoredSentences
    .filter((s) => selectedIndices.has(s.index))
    .map((s) => s.sent)
    .join(' ')
    .trim();

  return assembled;
}

import {
  calculateTargetBudget,
  expandConceptMechanisms,
  selectFailureOperators,
  composeMutationGraph,
  extractNonNegotiablesAndAssumptions,
  verifyRadicalTransformation,
  BudgetProfile,
  FailureOperator,
  AdaptedOperator
} from './radicalTransformation';

export {
  calculateTargetBudget,
  extractNonNegotiablesAndAssumptions,
  verifyRadicalTransformation,
  selectFailureOperators,
};
export type { BudgetProfile, FailureOperator, AdaptedOperator };

/**
 * Radical Prompt Transformation Budget Saturator:
 * Ensures prompts do not collapse into brief summaries. If generated text utilizes
 * less than 88% of the target character budget, this saturator enriches it with
 * substantive, non-decorative generative machinery, topological constraints,
 * and material dynamics until it reaches 90-95% of the available character budget.
 */
export function saturateToCharacterBudget(
  text: string,
  targetBudget: number,
  options?: {
    targetEngine?: TargetEngine;
    subject?: string;
    concept?: string;
    preservedAnchors?: string[];
  }
): string {
  if (!text || typeof text !== 'string') return text || '';
  const budget = calculateTargetBudget(targetBudget);
  const currentLen = text.length;

  // If already occupying 88%+ of target budget, no expansion needed
  if (currentLen >= budget.minimumTarget) {
    return compressToCharacterBudget(text, budget.maxCharacters, {
      preservedAnchors: options?.preservedAnchors,
      targetEngine: options?.targetEngine,
    });
  }

  const engine = options?.targetEngine || 'general';

  // Use the radical length-aware conceptual expansion pass
  const expanded = expandConceptMechanisms(text, budget, engine, {
    subject: options?.subject,
    concept: options?.concept,
    preservedAnchors: options?.preservedAnchors,
  });

  return compressToCharacterBudget(expanded.trim(), budget.maxCharacters, {
    preservedAnchors: options?.preservedAnchors,
    targetEngine: options?.targetEngine,
  });
}


