import {
  ContradictionMode,
  DecomposedConcept,
  MutationLineage,
  MutationOperator,
  MutationRecipe,
  SlopSeedingConfig,
  TargetEngine,
  WeightedSelection,
} from '../types';
import { MUTATION_OPERATORS, getMutationOperator } from '../data/mutationOperators';
import { LATENT_ATTRACTORS, getAttractor } from '../data/latentFauna';
import { getEntropyProfile } from './entropyProfile';
import {
  createPrng,
  isAttractorCompatible,
  isOperatorCompatible,
  normalizeWeightedSelections,
} from './compilerHelpers';
import { decomposeConceptLocally } from './conceptDismemberment';

export interface CompileRecipeInput {
  concept: string | DecomposedConcept;
  entropyLevel: number;
  config?: SlopSeedingConfig;
  selectedOperators?: Array<string | WeightedSelection<string>>;
  selectedAttractors?: Array<string | WeightedSelection<string>>;
  selectedContentSeeds?: string[];
  contradictionMode?: ContradictionMode | string;
  targetEngine?: TargetEngine | string;
  preservedAnchors?: string[];
  lineage?: MutationLineage;
  pressures?: string[];
  deterministicSeed?: number | string;
}

/**
 * Concise operational metadata serializer for a MutationRecipe.
 * Formats a clean, high-density summary suitable for diagnostics and future UI maps.
 */
export function describeMutationRecipe(recipe: MutationRecipe): string {
  const entropy = recipe.entropyLevel ?? 5;
  const opCount = recipe.operators.length;

  const opList =
    recipe.operators.length > 0
      ? recipe.operators
          .map((op) => {
            const operator = getMutationOperator(op.id);
            const name = operator ? operator.name.toUpperCase() : op.id.toUpperCase();
            return `${name} (${Math.round((op.weight || 0) * 100)}%)`;
          })
          .join(', ')
      : 'NONE';

  const attractorList =
    recipe.attractors && recipe.attractors.length > 0
      ? recipe.attractors
          .map((at) => {
            const attractor = getAttractor(at.id);
            const name = attractor ? attractor.name.toUpperCase() : at.id.toUpperCase();
            return `${name} ${Math.round((at.weight || 0) * 100)}%`;
          })
          .join(', ')
      : 'NONE';

  const anchors =
    recipe.preservedAnchors && recipe.preservedAnchors.length > 0
      ? recipe.preservedAnchors.join(', ')
      : 'none';

  const primaryPressure =
    recipe.pressureIds && recipe.pressureIds.length > 0
      ? recipe.pressureIds[0].replace(/_/g, ' ')
      : 'standard';

  let desc = `Entropy ${entropy}: ${opCount} operator${opCount === 1 ? '' : 's'} active — ${opList}.`;
  desc += ` Attractor mix: ${attractorList}.`;
  desc += ` Semantic distance: ${recipe.semanticDistance ?? 0.5}.`;
  desc += ` Neighbor walk: ${recipe.semanticNeighborHops ?? 1} hops.`;
  desc += ` Strong anchor: ${anchors}.`;
  desc += ` Primary pressure: ${primaryPressure}.`;

  if (recipe.contentDna && recipe.contentDna.length > 0) {
    desc += ` Content DNA: ${recipe.contentDna.slice(0, 4).join(', ')}${recipe.contentDna.length > 4 ? '...' : ''}.`;
  }

  return desc;
}

/**
 * Core Mutation Recipe Compiler (Job 4)
 * Deterministically synthesizes an executable mutation plan from entropy,
 * explicit preferences, concept structure, and semantic compatibility.
 */
export function compileMutationRecipe(input: CompileRecipeInput): MutationRecipe {
  const {
    concept,
    entropyLevel,
    config,
    selectedOperators = [],
    selectedAttractors = [],
    selectedContentSeeds = [],
    contradictionMode = 'direct',
    targetEngine = 'nano',
    preservedAnchors = [],
    lineage,
    pressures,
    deterministicSeed,
  } = input;

  const prng = createPrng(deterministicSeed);
  const profile = getEntropyProfile(entropyLevel);

  // 1. Resolve Decomposed Concept & Anchors
  let decomposed: DecomposedConcept;
  if (typeof concept === 'string') {
    decomposed = decomposeConceptLocally(concept);
  } else {
    decomposed = concept;
  }

  // Extract anchors from concept, input arguments, and evolutionary lineage
  const lineageAnchors = lineage?.promptGeneration?.preservedAnchors || [];
  const allDetectedAnchors = Array.from(
    new Set([...(decomposed?.detectedAnchors || []), ...preservedAnchors, ...lineageAnchors])
  );

  // 2. Classify Content DNA (Separating domain vocabulary from mutation operators)
  const rawContentSeeds = [
    ...selectedContentSeeds,
    ...(config?.selectedSeeds || []),
  ];
  const contentDna = Array.from(
    new Set(rawContentSeeds.filter((s) => typeof s === 'string' && s.trim().length > 0))
  );

  // 3. Inspect Concept Characteristics & Domain Cues
  const conceptText = (
    typeof concept === 'string' ? concept : decomposed?.originalInput || ''
  ).toLowerCase();
  const targetDesc = String(targetEngine).toLowerCase();

  const isAudioDomain =
    targetDesc === 'suno' ||
    /\b(?:audio|sound|song|music|noise|reed|flute|melody|chords|vocals|rhythm|drone|acoustic|synth)\b/.test(
      conceptText
    );

  const isVideoMotionDomain =
    targetDesc === 'grok' ||
    /\b(?:film|video|motion|animation|temporal|camera|pan|zoom|tracking shot|fps)\b/.test(
      conceptText
    );

  const hasStrongIdentityAnchors =
    allDetectedAnchors.length > 0 ||
    Boolean(decomposed?.organs?.some((o) => o.type === 'identity' || o.preserveStrength >= 0.8));

  const hasParadoxOrImpossibleGeometry =
    /\b(?:impossible|paradox|simultaneously|inside and outside|möbius|klein bottle|non-euclidean)\b/.test(
      conceptText
    ) || Boolean(decomposed?.organs?.some((o) => o.type === 'governing_rule'));

  // 4. Process Explicit & Auto-Selected Mutation Operators
  const finalOperators: Array<{ id: string; weight: number; intensity: number }> = [];
  const activeOperatorObjects: MutationOperator[] = [];

  // A. Honor Explicit Operators
  for (const item of selectedOperators) {
    const id = typeof item === 'string' ? item : item.id;
    const operator = getMutationOperator(id);
    if (operator && !finalOperators.some((o) => o.id === id)) {
      const weight = typeof item === 'object' && item.weight ? item.weight : 1.0;
      const intensity = typeof item === 'object' && item.intensity ? item.intensity : 1.0;
      finalOperators.push({ id, weight, intensity });
      activeOperatorObjects.push(operator);
    }
  }

  // B. Auto-Select Remaining Operators up to target count
  const targetOpCount = Math.max(
    profile.minOperators,
    Math.min(profile.maxOperators, profile.targetOperatorCount)
  );

  if (finalOperators.length < targetOpCount) {
    // Filter candidates by entropy eligibility and compatibility
    const eligibleCandidates = MUTATION_OPERATORS.filter((candidate) => {
      // Must not already be selected
      if (finalOperators.some((o) => o.id === candidate.id)) return false;

      // Must be eligible at current entropy level
      if (candidate.minEntropy > profile.entropy) return false;

      // Specific gate checks from entropy profile
      if (candidate.id === 'ontology_swap' && !profile.ontologySwapEligibility) return false;
      if (candidate.id === 'staged_paradox' && !profile.stagedParadoxEligibility) return false;
      if (candidate.id === 'recursive_reversal' && !profile.recursiveReversalEligibility) return false;
      if (candidate.id === 'scale_schism' && !profile.scaleSchismEligibility) return false;

      // Audio domain: avoid purely visual operators
      if (isAudioDomain && (candidate.id === 'visual_chiasmus' || candidate.id === 'perspective_scramble')) {
        return false;
      }

      // Check mutual technical incompatibility with already active operators
      if (!isOperatorCompatible(candidate, activeOperatorObjects)) return false;

      return true;
    });

    // Score candidates based on concept cues
    const scoredCandidates = eligibleCandidates.map((candidate) => {
      let score = 1.0;

      // Concept-aware heuristic boosts
      if (hasStrongIdentityAnchors) {
        if (candidate.id === 'concept_bleed') score += 2.5;
        if (candidate.id === 'structural_dismemberment') score += 1.5;
      }

      if (hasParadoxOrImpossibleGeometry) {
        if (candidate.id === 'staged_paradox') score += 3.0;
        if (candidate.id === 'scale_schism') score += 2.5;
        if (candidate.id === 'ontology_swap') score += 2.0;
      }

      if (isAudioDomain) {
        if (candidate.id === 'concept_bleed') score += 2.0;
        if (candidate.id === 'semantic_neighbor_walk') score += 1.5;
        if (candidate.id === 'recursive_reversal') score += 1.5;
      }

      if (isVideoMotionDomain) {
        if (candidate.id === 'scale_schism') score += 2.0;
        if (candidate.id === 'recursive_reversal') score += 1.8;
      }

      // Contradiction mode alignment
      if (
        contradictionMode === 'paradox' ||
        contradictionMode === 'dissonance' ||
        contradictionMode === 'slop' ||
        contradictionMode === 'unfiltered'
      ) {
        if (candidate.category === 'contradiction' || candidate.category === 'blending') {
          score += 2.0;
        }
      }

      // Lineage Genotype Influences (Job 6)
      if (lineage?.promptGeneration) {
        const pGen = lineage.promptGeneration;
        const activeTraitIds = pGen.inheritedTraits.concat(pGen.acquiredTraits).map((t) => t.id);
        const scarText = pGen.scars.map((s) => s.label + ' ' + s.description).join(' ').toLowerCase();

        if (activeTraitIds.includes('distrust_inside_outside') || scarText.includes('inside') || scarText.includes('enclosure')) {
          if (candidate.id === 'ontology_swap' || candidate.id === 'concept_bleed') score += 2.2;
        }
        if (activeTraitIds.includes('symmetry_aversion')) {
          if (candidate.id === 'chiral_flip') score += 2.0;
        }
        if (activeTraitIds.includes('repetition_causes_structural_decay')) {
          if (candidate.id === 'recursive_reversal' || candidate.id === 'staged_paradox') score += 2.0;
        }
        if (activeTraitIds.includes('scale_invariance_failure') || scarText.includes('scale')) {
          if (candidate.id === 'scale_schism') score += 2.2;
        }
      }

      // Add a slight pseudorandom jitter
      score += prng() * 0.8;

      return { candidate, score };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Pick top candidates until target count is met
    for (const item of scoredCandidates) {
      if (finalOperators.length >= targetOpCount) break;
      finalOperators.push({
        id: item.candidate.id,
        weight: 1.0,
        intensity: profile.organMutationWillingness,
      });
      activeOperatorObjects.push(item.candidate);
    }
  }

  // Ensure at least 1 operator is present
  if (finalOperators.length === 0) {
    finalOperators.push({
      id: 'semantic_neighbor_walk',
      weight: 1.0,
      intensity: profile.organMutationWillingness,
    });
  }

  const normalizedOperators = normalizeWeightedSelections(finalOperators);

  // 5. Process Explicit & Auto-Selected Latent Attractors
  const finalAttractors: Array<{ id: string; weight: number; intensity: number }> = [];

  // A. Honor Explicit Attractors
  for (const item of selectedAttractors) {
    const id = typeof item === 'string' ? item : item.id;
    const attractor = getAttractor(id);
    if (attractor && !finalAttractors.some((a) => a.id === id)) {
      const weight = typeof item === 'object' && item.weight ? item.weight : 1.0;
      const intensity = typeof item === 'object' && item.intensity ? item.intensity : 1.0;
      finalAttractors.push({ id, weight, intensity });
    }
  }

  // B. Determine target attractor count based on entropy
  const targetAttractorCount = Math.max(
    profile.minAttractors,
    Math.min(profile.maxAttractors, profile.entropy <= 2 ? (profile.entropy === 1 ? 0 : 1) : profile.entropy <= 4 ? 1 : profile.entropy <= 6 ? 2 : 3)
  );

  if (finalAttractors.length < targetAttractorCount && targetAttractorCount > 0) {
    const activeAttractorObjects = finalAttractors
      .map((a) => getAttractor(a.id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));

    const eligibleAttractors = LATENT_ATTRACTORS.filter((candidate) => {
      if (finalAttractors.some((a) => a.id === candidate.id)) return false;
      if (candidate.minEntropy > profile.entropy) return false;
      return isAttractorCompatible(candidate, activeAttractorObjects);
    });

    // Score attractors based on concept alignment
    const scoredAttractors = eligibleAttractors.map((candidate) => {
      let score = 1.0;

      if (hasStrongIdentityAnchors) {
        if (candidate.id === 'simulacrum' || candidate.id === 'shapeshifter' || candidate.id === 'echo') {
          score += 3.0;
        }
      }

      if (hasParadoxOrImpossibleGeometry) {
        if (candidate.id === 'void' || candidate.id === 'aberration' || candidate.id === 'crystalline') {
          score += 3.0;
        }
      }

      if (isAudioDomain) {
        if (candidate.id === 'echo' || candidate.id === 'spectral' || candidate.id === 'simulacrum' || candidate.id === 'ghost') {
          score += 3.0;
        }
      }

      score += prng() * 0.75;
      return { candidate, score };
    });

    scoredAttractors.sort((a, b) => b.score - a.score);

    for (const item of scoredAttractors) {
      if (finalAttractors.length >= targetAttractorCount) break;

      // Assign hierarchical weights: primary gets higher weight
      let assignedWeight = 1.0;
      if (finalAttractors.length === 0) {
        assignedWeight = targetAttractorCount === 1 ? 1.0 : 0.6;
      } else if (finalAttractors.length === 1) {
        assignedWeight = 0.35;
      } else {
        assignedWeight = 0.2;
      }

      finalAttractors.push({
        id: item.candidate.id,
        weight: assignedWeight,
        intensity: profile.conceptBleedIntensity,
      });
    }
  }

  const normalizedAttractors =
    finalAttractors.length > 0 ? normalizeWeightedSelections(finalAttractors) : undefined;

  // 6. Resolve Creative Pressures (Part 9)
  let resolvedPressures: string[];
  if (pressures && pressures.length > 0) {
    resolvedPressures = [...pressures];
  } else {
    resolvedPressures = [];
    if (hasStrongIdentityAnchors) {
      resolvedPressures.push('preserve_identity');
    }
    if (profile.entropy >= 5) {
      resolvedPressures.push('maximize_structural_novelty');
    }
    if (profile.entropy >= 8) {
      resolvedPressures.push('avoid_decorative_weirdness');
    }
    resolvedPressures.push('preserve_target_legibility');
  }

  // 7. Compile Final MutationRecipe
  const sanitizedLineage = lineage
    ? {
        generation: lineage.generation,
        generationId: lineage.generationId,
        parentGenerationIds: lineage.parentGenerationIds,
      }
    : undefined;

  const recipe: MutationRecipe = {
    enabled: true,
    entropyLevel: profile.entropy,
    operators: normalizedOperators,
    attractors: normalizedAttractors,
    pressureIds: resolvedPressures,
    semanticDistance: profile.semanticDistance,
    semanticNeighborHops: profile.neighborHops,
    preservedAnchors: allDetectedAnchors,
    contentDna: contentDna.length > 0 ? contentDna : undefined,
    lineage: sanitizedLineage,
  };

  recipe.diagnosticSummary = describeMutationRecipe(recipe);

  return recipe;
}
