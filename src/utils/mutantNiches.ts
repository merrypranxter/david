import { MutationNiche, MutationRecipe } from '../types';

/**
 * Mapping of mutation operators to their primary and secondary mutation niches.
 */
const OPERATOR_NICHE_MAP: Record<string, MutationNiche[]> = {
  structural_dismemberment: ['compositional', 'ontological'],
  semantic_neighbor_walk: ['ontological', 'identity'],
  ontology_swap: ['ontological', 'identity'],
  recursive_reversal: ['recursive', 'causal'],
  scale_schism: ['scale', 'topological'],
  concept_bleed: ['distributed', 'material'],
  visual_chiasmus: ['compositional', 'topological'],
  staged_paradox: ['contradiction', 'causal'],
  chiral_flip: ['topological', 'compositional'],
  echo: ['temporal', 'recursive'],
  perspective_scramble: ['topological', 'compositional'],
  material_inversion: ['material', 'ontological'],
  negative_space_solidification: ['topological', 'material'],
  abstraction_escape: ['ontological', 'identity'],
  split: ['contradiction', 'compositional'],
  simulacrum: ['signal-decay', 'temporal'],
  decay: ['signal-decay', 'temporal'],
  forbidden_attractor: ['ontological', 'contradiction'],
};

/**
 * Mapping of latent attractors to mutation niches.
 */
const ATTRACTOR_NICHE_MAP: Record<string, MutationNiche[]> = {
  void: ['ontological', 'topological'],
  crystalline: ['material', 'rhythmic'],
  egregore: ['identity', 'distributed'],
  mycorrhizal: ['distributed', 'material'],
  simulacrum: ['signal-decay', 'temporal'],
  aberration: ['contradiction', 'ontological'],
  swarm: ['distributed', 'scale'],
  hive: ['distributed', 'compositional'],
  leviathan: ['scale', 'ontological'],
  oracle: ['temporal', 'causal'],
  ghost: ['spectral', 'temporal'],
  echo: ['temporal', 'spectral'],
  shapeshifter: ['identity', 'ontological'],
  chimera: ['compositional', 'material'],
  golem: ['material', 'causal'],
  zeitgeist: ['temporal', 'distributed'],
};

/**
 * Infer the mutation niches occupied by a recipe or candidate.
 */
export function inferMutationNiches(recipe: MutationRecipe): MutationNiche[] {
  const niches = new Set<MutationNiche>();

  // Check operators
  for (const op of recipe.operators || []) {
    const mapped = OPERATOR_NICHE_MAP[op.id];
    if (mapped) {
      mapped.forEach((n) => niches.add(n));
    }
  }

  // Check attractors
  for (const at of recipe.attractors || []) {
    const mapped = ATTRACTOR_NICHE_MAP[at.id];
    if (mapped) {
      mapped.forEach((n) => niches.add(n));
    }
  }

  // Check Content DNA cues
  if (recipe.contentDna && recipe.contentDna.length > 0) {
    const dnaText = recipe.contentDna.join(' ').toLowerCase();
    if (/\b(?:time|temporal|delay|latency|clock|echo|retrocausal)\b/.test(dnaText)) {
      niches.add('temporal');
    }
    if (/\b(?:surface|topology|fold|möbius|klein|manifold|boundary)\b/.test(dnaText)) {
      niches.add('topological');
    }
    if (/\b(?:decay|noise|vhs|crt|glitch|corrupt|loss)\b/.test(dnaText)) {
      niches.add('signal-decay');
    }
    if (/\b(?:frequency|hertz|infrasound|acoustic|rhythm|harmonic)\b/.test(dnaText)) {
      niches.add('spectral');
      niches.add('rhythmic');
    }
    if (/\b(?:paradox|impossible|contradiction|anti-)\b/.test(dnaText)) {
      niches.add('contradiction');
    }
  }

  // Default fallback if empty
  if (niches.size === 0) {
    niches.add('ontological');
  }

  return Array.from(niches);
}

/**
 * Format clean, human-readable niche badges for UI presentation.
 */
export function formatNicheLabel(niche: MutationNiche): string {
  switch (niche) {
    case 'ontological':
      return 'Ontological';
    case 'topological':
      return 'Topological';
    case 'temporal':
      return 'Temporal';
    case 'distributed':
      return 'Distributed';
    case 'signal-decay':
      return 'Signal Decay';
    case 'identity':
      return 'Identity';
    case 'material':
      return 'Material';
    case 'causal':
      return 'Causal';
    case 'scale':
      return 'Scale Schism';
    case 'contradiction':
      return 'Contradiction';
    case 'recursive':
      return 'Recursive';
    case 'spectral':
      return 'Spectral';
    case 'rhythmic':
      return 'Rhythmic';
    case 'compositional':
      return 'Compositional';
    default:
      return String(niche);
  }
}
