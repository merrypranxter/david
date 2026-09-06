import {
  CandidateEvaluation,
  CreativePressureId,
  MutationCandidate,
  MutationNiche,
  MutationRecipe,
  TargetEngine,
} from '../types';
import { evaluateClicheDensity } from '../data/clicheRegistry';
import { inferMutationNiches } from './mutantNiches';
import { getTargetCharacterLimits } from './targetCapabilities';

export interface EvaluatorWeights {
  structuralNovelty: number;
  conceptualCoherence: number;
  anchorSurvival: number;
  targetLegibility: number;
  siblingDistance: number;
  clichePenalty: number;
  decorativeOnlyPenalty: number;
  semanticCollapsePenalty: number;
}

/**
 * Transparent Default Fitness Weights (Job 8, Part 14)
 */
export const DEFAULT_FITNESS_WEIGHTS: EvaluatorWeights = {
  structuralNovelty: 0.3,
  conceptualCoherence: 0.22,
  anchorSurvival: 0.28,
  targetLegibility: 0.2,
  siblingDistance: 0.18,
  clichePenalty: 0.16,
  decorativeOnlyPenalty: 0.18,
  semanticCollapsePenalty: 0.22,
};

/**
 * Adjust fitness weights according to Entropy Level and Creative Pressures (Job 8, Parts 11 & 12)
 */
export function computeAdjustedWeights(
  entropyLevel: number,
  activePressures: CreativePressureId[] = []
): EvaluatorWeights {
  const w = { ...DEFAULT_FITNESS_WEIGHTS };

  // Entropy influences
  if (entropyLevel <= 4) {
    // Low entropy: emphasize anchor survival, coherence, target usability
    w.anchorSurvival += 0.15;
    w.conceptualCoherence += 0.1;
    w.targetLegibility += 0.08;
    w.structuralNovelty *= 0.7;
    w.siblingDistance *= 0.6;
  } else if (entropyLevel >= 7) {
    // High entropy: reward structural novelty, ontology shifts, sibling distance
    w.structuralNovelty += 0.15;
    w.siblingDistance += 0.12;
    w.decorativeOnlyPenalty += 0.08;
    // Anchor survival remains important but shouldn't completely stifle mutations
    w.anchorSurvival = Math.max(0.2, w.anchorSurvival);
  }

  // Creative Pressure influences (Job 8, Part 11)
  if (activePressures.includes('preserve_identity')) {
    w.anchorSurvival += 0.2;
  }
  if (activePressures.includes('maximize_structural_novelty')) {
    w.structuralNovelty += 0.2;
  }
  if (activePressures.includes('avoid_decorative_weirdness')) {
    w.decorativeOnlyPenalty += 0.15;
    w.clichePenalty += 0.12;
  }
  if (activePressures.includes('preserve_target_legibility')) {
    w.targetLegibility += 0.18;
  }
  if (activePressures.includes('maximize_sibling_distance')) {
    w.siblingDistance += 0.18;
  }

  return w;
}

/**
 * Tokenize a text string for similarity comparison
 */
function tokenize(text: string): Set<string> {
  return new Set(
    (text || '')
      .toLowerCase()
      .replace(/[^\w\s@]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2)
  );
}

/**
 * Compute Jaccard distance between two sets of tokens (0 = identical, 1 = completely disjoint)
 */
function tokenJaccardDistance(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  if (union === 0) return 0;
  return 1 - intersection / union;
}

/**
 * Compute structural distance between two mutation recipes
 */
export function calculateRecipeDistance(r1: MutationRecipe, r2: MutationRecipe): number {
  const ops1 = new Set(r1.operators.map((o) => o.id));
  const ops2 = new Set(r2.operators.map((o) => o.id));
  const opDistance = tokenJaccardDistance(ops1, ops2);

  const at1 = new Set((r1.attractors || []).map((a) => a.id));
  const at2 = new Set((r2.attractors || []).map((a) => a.id));
  const atDistance = tokenJaccardDistance(at1, at2);

  const niches1 = new Set(inferMutationNiches(r1));
  const niches2 = new Set(inferMutationNiches(r2));
  const nicheDistance = tokenJaccardDistance(niches1, niches2);

  // Composite structural distance
  return 0.45 * opDistance + 0.35 * atDistance + 0.2 * nicheDistance;
}

/**
 * Fast, deterministic local first-pass evaluator (Job 8, Part 3)
 */
export function evaluateCandidateLocally(
  candidate: MutationCandidate,
  allCandidates: MutationCandidate[],
  protectedAnchors: string[],
  target: TargetEngine,
  entropyLevel: number,
  pressures: CreativePressureId[] = []
): CandidateEvaluation {
  const prompt = candidate.renderedPrompt || '';
  const promptLower = prompt.toLowerCase();
  const notes: string[] = [];

  // 1. ANCHOR SURVIVAL
  let anchorSurvival = 1.0;
  if (protectedAnchors.length > 0) {
    let survivedCount = 0;
    for (const anchor of protectedAnchors) {
      const cleanAnchor = anchor.replace(/^@/, '').toLowerCase();
      if (promptLower.includes(anchor.toLowerCase()) || promptLower.includes(cleanAnchor)) {
        survivedCount++;
      }
    }
    anchorSurvival = survivedCount / protectedAnchors.length;
    if (anchorSurvival === 1.0) {
      notes.push('All protected anchors intact');
    } else if (anchorSurvival < 0.5) {
      notes.push(`Critical anchor loss (${Math.round(anchorSurvival * 100)}% preserved)`);
    }
  }

  // 2. TARGET LEGIBILITY (Modal awareness and character budget enforcement)
  let targetLegibility = 0.88;
  const length = prompt.length;
  const targetLimits = getTargetCharacterLimits(target);

  // Length boundaries check against centralized limits
  if (length === 0) {
    targetLegibility = 0;
    notes.push('Empty output');
  } else if (length < targetLimits.min) {
    targetLegibility *= 0.5;
    notes.push(`Output below target minimum (${length} < ${targetLimits.min})`);
  } else if (length > targetLimits.max * 1.08) {
    targetLegibility *= 0.65;
    notes.push(`Exceeds maximum character limit (${length} > ${targetLimits.max})`);
  }

  // Target-specific modality checks
  if (target === 'suno') {
    const hasAudioTerms = /\b(?:bpm|reverb|acoustic|synth|tempo|vocal|guitar|flute|rhythm|bass|percussion|drone|sound|melody|timbre|frequency|harmonics)\b/i.test(
      prompt
    );
    const hasStyleOrLyrics = Boolean(
      candidate.renderedStylePrompt || candidate.renderedLyricsPrompt || /\[style\]|\[lyrics\]|\[suno/i.test(prompt)
    );
    // Severe penalty if visual camera jargon leaked into Suno prompt
    const hasLeakedVisualJargon = /\b(?:35mm|anamorphic|macro lens|bokeh|photorealistic|hyperrealistic|cinematic lighting|octane render)\b/i.test(
      prompt
    );

    if (hasLeakedVisualJargon) {
      targetLegibility *= 0.5;
      notes.push('Severe defect: Visual camera jargon leaked into audio prompt');
    }

    if (!hasAudioTerms && !hasStyleOrLyrics) {
      targetLegibility *= 0.4;
      notes.push('Warning: Lacks Suno acoustic/musical formatting');
    } else if (!hasLeakedVisualJargon) {
      targetLegibility = Math.min(1.0, targetLegibility + 0.1);
      notes.push('Suno audio formatting verified');
    }
  } else if (target === 'openart') {
    if (length > 3300) {
      targetLegibility *= 0.7;
      notes.push('Exceeds OpenArt character ceiling');
    }
  } else if (target === 'grok') {
    const hasMotion = /\b(?:motion|camera|pan|zoom|speed|frame|tracking|velocity|lighting|temporal|shifts|progresses)\b/i.test(prompt);
    if (hasMotion) {
      targetLegibility = Math.min(1.0, targetLegibility + 0.08);
      notes.push('Grok motion/temporal progression verified');
    }
  } else if (target === 'midjourney_flux') {
    // Reward compact visual syntax and penalize ungrounded philosophical waffle
    const hasAbstractWaffle = /\b(?:the ontology of|metaphysical essence|unlobotomized)\b/i.test(prompt);
    if (hasAbstractWaffle) {
      targetLegibility *= 0.75;
      notes.push('Warning: Abstract non-visual philosophical language in Midjourney prompt');
    }
  }

  // 3. STRUCTURAL NOVELTY HEURISTICS
  let structuralNovelty = 0.5;
  const opCount = candidate.activeOperators.length;
  const hasOntologyOp = candidate.activeOperators.some((o) =>
    ['ontology_swap', 'recursive_reversal', 'staged_paradox', 'scale_schism', 'concept_bleed'].includes(o)
  );
  const hasAttractor = candidate.attractorMix.length > 0;

  if (hasOntologyOp) {
    structuralNovelty += 0.25;
    notes.push('Active ontological reorganization');
  }
  if (hasAttractor) {
    structuralNovelty += 0.15;
  }
  structuralNovelty += Math.min(0.15, opCount * 0.04);
  structuralNovelty = Math.min(1.0, Math.max(0.2, structuralNovelty));

  // 4. CLICHÉ DENSITY
  const clicheEval = evaluateClicheDensity(
    prompt,
    candidate.activeOperators,
    candidate.attractorMix
  );
  const clichePenalty = clicheEval.penalty;
  if (clicheEval.detectedCliches.length > 0) {
    notes.push(`Cliché elements mitigated: ${clicheEval.detectedCliches.slice(0, 2).join(', ')}`);
  }

  // 5. DECORATIVE-ONLY PENALTY
  // Penalize if prompt merely tacked on superficial adjectives without structural syntax
  let decorativeOnlyPenalty = 0.05;
  const hasStructuralGrammar = /\b(?:boundary|topology|organization|reconstructed|inversion|synchronization|scale|continuity|recursive)\b/i.test(
    prompt
  );
  if (!hasStructuralGrammar && !hasOntologyOp) {
    decorativeOnlyPenalty += 0.2;
    notes.push('Superficial decorative mutation suspected');
  }

  // 6. SEMANTIC COLLAPSE PENALTY
  let semanticCollapsePenalty = 0.05;
  // Detect excessive repetition (e.g. word repeated 5+ times)
  const words = promptLower.split(/\s+/);
  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    if (w.length > 4) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
      if (wordFreq[w] >= 6) {
        semanticCollapsePenalty = Math.min(1.0, semanticCollapsePenalty + 0.25);
        notes.push(`Degenerate word repetition: "${w}"`);
      }
    }
  }

  // 7. SIBLING DISTANCE (Job 8, Part 5)
  let siblingDistance = 0.8;
  const siblings = allCandidates.filter((c) => c.id !== candidate.id);
  if (siblings.length > 0) {
    let totalDist = 0;
    const myTokens = tokenize(prompt);
    for (const sib of siblings) {
      const sibTokens = tokenize(sib.renderedPrompt || '');
      const textDist = tokenJaccardDistance(myTokens, sibTokens);
      const recipeDist = calculateRecipeDistance(candidate.mutationRecipe, sib.mutationRecipe);
      totalDist += 0.5 * textDist + 0.5 * recipeDist;
    }
    siblingDistance = totalDist / siblings.length;
    if (siblingDistance < 0.25) {
      notes.push('Near-duplicate sibling detected');
    }
  }

  // 8. CONCEPTUAL COHERENCE
  let conceptualCoherence = 0.75;
  if (targetLegibility > 0.6 && semanticCollapsePenalty < 0.2) {
    conceptualCoherence += 0.1;
  }
  if (length < 80) conceptualCoherence -= 0.2;
  conceptualCoherence = Math.min(1.0, Math.max(0.1, conceptualCoherence));

  // 9. CALCULATE TOTAL FITNESS (Job 8, Part 14)
  const weights = computeAdjustedWeights(entropyLevel, pressures);

  const positive =
    structuralNovelty * weights.structuralNovelty +
    conceptualCoherence * weights.conceptualCoherence +
    anchorSurvival * weights.anchorSurvival +
    targetLegibility * weights.targetLegibility +
    siblingDistance * weights.siblingDistance;

  const negative =
    clichePenalty * weights.clichePenalty +
    decorativeOnlyPenalty * weights.decorativeOnlyPenalty +
    semanticCollapsePenalty * weights.semanticCollapsePenalty;

  const totalFitness = Math.min(1.0, Math.max(0.05, positive - negative));

  return {
    structuralNovelty: Number(structuralNovelty.toFixed(2)),
    anchorSurvival: Number(anchorSurvival.toFixed(2)),
    targetLegibility: Number(targetLegibility.toFixed(2)),
    conceptualCoherence: Number(conceptualCoherence.toFixed(2)),
    siblingDistance: Number(siblingDistance.toFixed(2)),
    clichePenalty: Number(clichePenalty.toFixed(2)),
    decorativeOnlyPenalty: Number(decorativeOnlyPenalty.toFixed(2)),
    semanticCollapsePenalty: Number(semanticCollapsePenalty.toFixed(2)),
    totalFitness: Number(totalFitness.toFixed(2)),
    notes: notes.slice(0, 4),
  };
}

/**
 * Multi-dimensional Pareto non-dominated check (Job 8, Part 15)
 * Identifies candidates that are supreme along at least one key artistic dimension.
 */
export function markNondominatedCandidates(candidates: MutationCandidate[]): void {
  if (candidates.length <= 1) return;

  let maxNovelty = -1;
  let maxLegibility = -1;
  let maxDistance = -1;

  for (const c of candidates) {
    if (!c.evaluation) continue;
    if (c.evaluation.structuralNovelty > maxNovelty) maxNovelty = c.evaluation.structuralNovelty;
    if (c.evaluation.targetLegibility > maxLegibility) maxLegibility = c.evaluation.targetLegibility;
    if (c.evaluation.siblingDistance > maxDistance) maxDistance = c.evaluation.siblingDistance;
  }

  for (const c of candidates) {
    if (!c.evaluation) continue;
    if (
      c.evaluation.structuralNovelty === maxNovelty ||
      c.evaluation.targetLegibility === maxLegibility ||
      c.evaluation.siblingDistance === maxDistance
    ) {
      c.evaluation.nondominated = true;
    }
  }
}

/**
 * Select the ultimate survivor from a family of evaluated candidates (Job 8, Part 16 & 17)
 */
export function selectSurvivor(
  candidates: MutationCandidate[],
  entropyLevel: number,
  protectedAnchors: string[] = []
): {
  survivor: MutationCandidate;
  runnerUp?: MutationCandidate;
  rejected: MutationCandidate[];
  selectionReason: string;
} {
  if (candidates.length === 0) {
    throw new Error('No candidates available for selection');
  }

  if (candidates.length === 1) {
    candidates[0].isSurvivor = true;
    return {
      survivor: candidates[0],
      rejected: [],
      selectionReason: 'Single candidate generation.',
    };
  }

  // 1. HARD CONSTRAINT CHECK (Job 8, Part 13)
  const validCandidates: MutationCandidate[] = [];
  const rejectedCandidates: MutationCandidate[] = [];

  for (const cand of candidates) {
    const evalScore = cand.evaluation;
    if (!evalScore) {
      validCandidates.push(cand);
      continue;
    }

    // Required strong anchor check (if strong identity anchor like @merry is missing)
    if (protectedAnchors.length > 0 && evalScore.anchorSurvival < 0.25) {
      cand.rejectionReason = 'Disqualified: Protected anchor lost in mutation';
      rejectedCandidates.push(cand);
      continue;
    }

    // Minimum target legibility
    if (evalScore.targetLegibility < 0.2) {
      cand.rejectionReason = 'Disqualified: Incompatible with target syntax limits';
      rejectedCandidates.push(cand);
      continue;
    }

    validCandidates.push(cand);
  }

  // Fallback: If all candidates failed hard constraints, revive the highest fitness one
  const pool = validCandidates.length > 0 ? validCandidates : candidates;

  // 2. WILDCARD SURVIVAL CHECK (Job 8, Part 17)
  // At S9-10, if one candidate is substantially more novel and occupies a unique niche, award a wildcard bonus
  if (entropyLevel >= 9) {
    let highestNoveltyCand: MutationCandidate | null = null;
    let highestNov = -1;

    for (const c of pool) {
      if (c.evaluation && c.evaluation.structuralNovelty > highestNov) {
        highestNov = c.evaluation.structuralNovelty;
        highestNoveltyCand = c;
      }
    }

    if (highestNoveltyCand && highestNov >= 0.85 && highestNoveltyCand.evaluation) {
      highestNoveltyCand.evaluation.wildcardBonus = true;
      highestNoveltyCand.evaluation.totalFitness = Math.min(
        1.0,
        highestNoveltyCand.evaluation.totalFitness + 0.12
      );
      highestNoveltyCand.evaluation.notes.push('High-entropy Wildcard bonus granted');
    }
  }

  // 3. RANK CANDIDATES BY TOTAL FITNESS
  pool.sort((a, b) => {
    const fitA = a.evaluation?.totalFitness ?? 0.5;
    const fitB = b.evaluation?.totalFitness ?? 0.5;
    return fitB - fitA;
  });

  const survivor = pool[0];
  survivor.isSurvivor = true;

  const runnerUp = pool.length > 1 ? pool[1] : undefined;
  if (runnerUp) {
    runnerUp.isSurvivor = false;
  }

  // All remaining candidates are considered rejected/extinct branches
  const finalRejected = [
    ...rejectedCandidates,
    ...pool.slice(1).filter((c) => !rejectedCandidates.some((r) => r.id === c.id)),
  ];

  // Selection rationale summary
  const sEval = survivor.evaluation;
  const reason = sEval
    ? `Survivor [${survivor.candidateLetter}] chosen with fitness ${Math.round(
        sEval.totalFitness * 100
      )}% (Novelty: ${Math.round(sEval.structuralNovelty * 100)}%, Anchors: ${Math.round(
        sEval.anchorSurvival * 100
      )}%, Legibility: ${Math.round(sEval.targetLegibility * 100)}%).`
    : `Survivor [${survivor.candidateLetter}] chosen.`;

  return {
    survivor,
    runnerUp,
    rejected: finalRejected,
    selectionReason: reason,
  };
}
