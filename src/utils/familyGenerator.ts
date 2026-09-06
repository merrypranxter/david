import {
  MutationCandidate,
  MutationNiche,
  MutationRecipe,
  SlopSeedingConfig,
  TargetEngine,
} from '../types';
import { compileMutationRecipe, CompileRecipeInput } from './recipeCompiler';
import { calculateRecipeDistance } from './mutantEvaluator';
import { inferMutationNiches } from './mutantNiches';

export interface FamilyGeneratorOptions {
  concept: string;
  target: TargetEngine;
  entropyLevel: number;
  slopConfig: SlopSeedingConfig;
  lineage?: any;
  protectedAnchors?: string[];
  deterministicSeed?: number | string;
}

/**
 * Strategy Basins for Sibling Generation (Job 8, Part 9)
 */
const BASIN_STRATEGIES = [
  {
    name: 'Ontology Dominant',
    primaryOperators: ['ontology_swap', 'structural_dismemberment', 'semantic_neighbor_walk'],
    primaryAttractors: ['void', 'aberration', 'egregore'],
    nicheBias: 'ontological' as MutationNiche,
  },
  {
    name: 'Distributed / Biological',
    primaryOperators: ['concept_bleed', 'scale_schism', 'negative_space_solidification'],
    primaryAttractors: ['mycorrhizal', 'swarm', 'hive', 'crystalline'],
    nicheBias: 'distributed' as MutationNiche,
  },
  {
    name: 'Temporal / Media / Signal-Decay',
    primaryOperators: ['echo', 'simulacrum', 'decay', 'recursive_reversal'],
    primaryAttractors: ['echo', 'simulacrum', 'ghost', 'oracle'],
    nicheBias: 'temporal' as MutationNiche,
  },
];

/**
 * Determine recommended family size based on entropy and configuration (Job 8, Part 7 & 24)
 */
export function getRecommendedFamilySize(entropyLevel: number, selectionMode: 'auto' | 'off' = 'auto'): number {
  if (selectionMode === 'off') return 1;
  if (entropyLevel <= 4) return 1; // Strict low-entropy cost preservation
  if (entropyLevel <= 6) return 2; // Mid-entropy: 2 candidates
  return 3;                        // High-entropy: 3 candidates max
}

/**
 * Compiles a diversified family of MutationRecipes BEFORE calling the generative model (Job 8, Part 8).
 * Ensures that siblings explore distinct mutation basins.
 */
export function generateMutationFamilyRecipes(options: FamilyGeneratorOptions): MutationRecipe[] {
  const { concept, target, entropyLevel, slopConfig, lineage, protectedAnchors = [] } = options;
  const selectionMode = slopConfig.mutantSelectionMode || 'auto';
  const familySize = getRecommendedFamilySize(entropyLevel, selectionMode);

  const isCurated = slopConfig.mutationMode === 'curated';
  const userOperators = slopConfig.selectedOperators || [];
  const userAttractors = slopConfig.selectedAttractors || [];
  const userPressures = (slopConfig.selectedPressures || []) as string[];
  const userAnchors = Array.from(new Set([...(slopConfig.protectedAnchors || []), ...protectedAnchors]));

  const recipes: MutationRecipe[] = [];

  for (let i = 0; i < familySize; i++) {
    const basin = BASIN_STRATEGIES[i % BASIN_STRATEGIES.length];

    let candidateOperators = [...userOperators];
    let candidateAttractors = [...userAttractors];

    if (!isCurated) {
      // AUTO MODE: Vary primary operators and attractors based on basin
      const basinOp = basin.primaryOperators[i % basin.primaryOperators.length];
      const basinAt = basin.primaryAttractors[i % basin.primaryAttractors.length];

      if (!candidateOperators.some((o) => (typeof o === 'string' ? o : o.id) === basinOp)) {
        candidateOperators.push({ id: basinOp, weight: 1.0, intensity: 0.8 });
      }
      if (!candidateAttractors.some((a) => (typeof a === 'string' ? a : a.id) === basinAt)) {
        candidateAttractors.push({ id: basinAt, weight: 1.0, intensity: 0.8 });
      }
    } else {
      // CURATED MODE (Job 8, Part 10):
      // User-locked operators and fauna MUST remain active in every candidate!
      // Sibling diversity emerges by varying weights, semantic hops, and non-locked secondary elements.
      if (candidateOperators.length > 0) {
        candidateOperators = candidateOperators.map((op, idx) => {
          const id = typeof op === 'string' ? op : op.id;
          // Rotate weights across siblings: 1.0, 0.7, 0.4
          const weight = idx === i % candidateOperators.length ? 1.0 : 0.65;
          return { id, weight, intensity: 0.8 };
        });
      }
    }

    const recipeInput: CompileRecipeInput = {
      concept,
      entropyLevel,
      config: slopConfig,
      selectedOperators: candidateOperators.map((op) => ({
        id: typeof op === 'string' ? op : op.id,
        weight: typeof op === 'string' ? 1.0 : (op.weight ?? 1.0),
        intensity: typeof op === 'string' ? 0.8 : (op.intensity ?? 0.8),
      })),
      selectedAttractors: candidateAttractors.map((at) => ({
        id: typeof at === 'string' ? at : at.id,
        weight: typeof at === 'string' ? 1.0 : (at.weight ?? 1.0),
        intensity: typeof at === 'string' ? 0.8 : (at.intensity ?? 0.8),
      })),
      selectedContentSeeds: slopConfig.selectedSeeds,
      contradictionMode: slopConfig.contradictionMode,
      targetEngine: target,
      preservedAnchors: userAnchors,
      lineage: lineage
        ? {
            generation: lineage.generationNumber,
            generationId: lineage.generationId,
            parentGenerationIds: lineage.parentGenerationIds,
          }
        : undefined,
      pressures: userPressures,
      deterministicSeed: (typeof options.deterministicSeed === 'number' ? options.deterministicSeed : Date.now()) + i * 1000,
    };

    let compiled = compileMutationRecipe(recipeInput);

    // RECIPE DIVERSIFICATION CHECK (Job 8, Part 8)
    // Compare against already compiled sibling recipes. If too close, nudge with alternative attractor
    if (recipes.length > 0) {
      for (const existing of recipes) {
        const dist = calculateRecipeDistance(compiled, existing);
        if (dist < 0.25) {
          // Recipes are too identical; mutate the new candidate's secondary attractor to force divergence
          const alternateAt = basin.primaryAttractors[(i + 1) % basin.primaryAttractors.length];
          const newAttractors = [...(compiled.attractors || [])];
          if (!newAttractors.some((a) => a.id === alternateAt)) {
            newAttractors.push({ id: alternateAt, weight: 1.0, intensity: 0.8 });
            compiled = {
              ...compiled,
              attractors: newAttractors,
            };
          }
        }
      }
    }

    recipes.push(compiled);
  }

  return recipes;
}

/**
 * Initialize lightweight MutationCandidate shells from recipes (Job 8, Part 1)
 */
export function createCandidateShells(
  recipes: MutationRecipe[],
  sourceGenerationId?: string
): MutationCandidate[] {
  const letters = ['A', 'B', 'C', 'D'];

  return recipes.map((recipe, index) => {
    const letter = letters[index] || `V${index + 1}`;
    const activeOperators = recipe.operators.map((o) => o.id);
    const attractorMix = (recipe.attractors || []).map((a) => a.id);
    const preservedAnchors = recipe.preservedAnchors || [];
    const mutationNiches = inferMutationNiches(recipe);

    return {
      id: `cand-${letter.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
      candidateLetter: letter,
      sourceGenerationId,
      mutationRecipe: recipe,
      renderedPrompt: '',
      activeOperators,
      attractorMix,
      preservedAnchors,
      mutationNiches,
      mutationSummary: recipe.diagnosticSummary || `${letter} [${mutationNiches.join(', ')}]`,
      isSurvivor: false,
    };
  });
}
