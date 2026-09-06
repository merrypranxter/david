import { MutationCategory, MutationOperator, MutationRecipe } from '../types';

/**
 * Foundational Mutation Operator Registry (Job 1)
 * 18 initial data-driven operators across structural, semantic, ontological,
 * recursive, contradiction, blending, lineage, and selection categories.
 */
export const MUTATION_OPERATORS: readonly MutationOperator[] = [
  {
    id: 'structural_dismemberment',
    name: 'Structural Dismemberment',
    category: 'structural',
    description:
      'Break a source concept into semantic organs (subject, action, transformation, material, environment, relationships, constraints, governing visual rule) to allow discrete organ mutation.',
    directive:
      'Decompose the concept into its constitutive semantic organs: [SUBJECT], [ACTION], [TRANSFORMATION], [MATERIAL], [ENVIRONMENT], [RELATIONSHIPS], [CONSTRAINTS], [GOVERNING_RULE]. Isolate each organ so that downstream stages can mutate selected organs while anchoring others.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['scale_schism', 'split', 'staged_paradox'],
    tags: ['decomposition', 'structural', 'organs'],
  },
  {
    id: 'semantic_neighbor_walk',
    name: 'Semantic Neighbor Walk',
    category: 'semantic',
    description:
      'Traverse associative meaning trajectories across continuous conceptual hops rather than mere lexical synonym replacement.',
    directive:
      'Trace an associative conceptual trajectory across related semantic neighborhoods (e.g. skin -> membrane -> boundary -> interface -> phase boundary -> condition separating incompatible states). Shift the core subject by N conceptual hops.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'concept_bleed'],
    tags: ['associative', 'semantic-drift', 'hop-chain'],
  },
  {
    id: 'ontology_swap',
    name: 'Ontology Swap',
    category: 'ontological',
    description:
      'Transmute what KIND OF THING a concept fundamentally is at the metaphysical or categorical level, altering foundational organization rather than superficial aesthetics.',
    directive:
      'Alter the fundamental ontological category of the subject (e.g. reinterpreting human anatomy not as a body, but as "a temporary boundary condition that happens to resolve into human anatomy"). Reconstruct its essence from the ground up.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['abstraction_escape', 'recursive_reversal'],
    tags: ['ontology', 'metaphysical', 'category-shift'],
  },
  {
    id: 'recursive_reversal',
    name: 'Recursive Reversal',
    category: 'recursive',
    description:
      'Isolate the tacit axiom or assumption that makes an interpretation predictable, and invert, negate, or substitute that foundational premise.',
    directive:
      'Identify the core premise or unstated convention that makes the concept predictable or stable, then invert or replace that axiom with its systemic antithesis.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['contradiction_pinger', 'staged_paradox'],
    tags: ['axiom-inversion', 'recursive', 'antithesis'],
  },
  {
    id: 'contradiction_pinger',
    name: 'Contradiction Pinger',
    category: 'contradiction',
    description:
      'Detect emergent paradoxes or inconsistencies in the semantic interpretation and elevate them into governing operational laws rather than resolving them.',
    directive:
      'Scan the emergent conceptual structure for nascent tensions or logical incompatibilities; elevate the discovered contradiction into a primary visual and systemic rule rather than repairing it.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['staged_paradox', 'scale_schism'],
    tags: ['paradox', 'tension', 'governing-law'],
  },
  {
    id: 'abstraction_escape',
    name: 'Abstraction Escape',
    category: 'ontological',
    description:
      'Ascend one metalevel upward when iterations stagnate into adjective inflation; mutate relationships, causality, topology, or interpretation rules instead of the object itself.',
    directive:
      'Cease decorating or modifying the concrete object; shift mutation up one abstraction tier to manipulate the governing topology, relational causality, or the generative interpretive rule itself.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'scale_schism'],
    tags: ['meta-level', 'topology', 'anti-inflation'],
  },
  {
    id: 'scale_schism',
    name: 'Scale Schism',
    category: 'structural',
    description:
      'Impose autonomous, productively conflicting conceptual laws across micro, meso, macro, and meta structural strata.',
    directive:
      'Establish independent and potentially antagonistic rules across distinct strata: MICRO (pixel/material/tissue/local detail), MESO (body/object coherence), MACRO (environment/composition), and META (the governing law by which representation occurs).',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['structural_dismemberment', 'contradiction_pinger', 'split'],
    tags: ['multi-strata', 'scale', 'conflict'],
  },
  {
    id: 'concept_bleed',
    name: 'Concept Bleed',
    category: 'blending',
    description:
      'Allow a secondary concept to contaminate the primary structure through underlying geometry, transitions, and relational physics without literal visual mimicry.',
    directive:
      'Infect the primary subject with the structural, topological, and negative-space attributes of a secondary concept (e.g. gyroid cavity geometry) without literally duplicating its surface appearance or recognizable iconography.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['semantic_neighbor_walk', 'interpolate'],
    tags: ['structural-bleed', 'topology', 'cross-contamination'],
  },
  {
    id: 'forbidden_attractor',
    name: 'Forbidden Attractor',
    category: 'semantic',
    description:
      'Evoke a powerful conceptual attractor while strictly prohibiting its obvious literal iconography, preserving only indirect spatial, relational, and structural residue.',
    directive:
      'Target an intense conceptual attractor (e.g. Cathedral) while explicitly banning its direct visual signs; retain exclusively its relational architecture, vertical rhythms, spatial hierarchies, and structural resonance.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'abstraction_escape'],
    tags: ['negative-prompting', 'attractor', 'relational-residue'],
  },
  {
    id: 'misremember',
    name: 'Misremember',
    category: 'recursive',
    description:
      'Reconstruct an earlier concept through a simulated memory fault, introducing a controlled semantic glitch and canonizing the mutated artifact as the new baseline.',
    directive:
      'Reconstruct the ancestral prompt with an intentional, subtle semantic transcription error or distorted memory artifact; treat this warped interpretation as canonical truth for successive generations.',
    minEntropy: 4,
    experimental: true,
    compatibleOperatorIds: ['recursive_reversal', 'reversion'],
    tags: ['memory-distortion', 'drift', 'glitch-lineage'],
  },
  {
    id: 'staged_paradox',
    name: 'Staged Paradox',
    category: 'contradiction',
    description:
      'Resolve impossible structures in distinct sequential stages: coarse architecture, incompatible constraint injection, anchor protection, detail synthesis, and coexisting contradiction.',
    directive:
      'Orchestrate an impossible concept sequentially: 1) Anchor coarse recognizable architecture, 2) Inject an irreconcilable structural axiom, 3) Preserve designated baseline anchors, 4) Resolve micro-textures, 5) Preserve visible evidence that contradictory interpretations coexist.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['contradiction_pinger', 'structural_dismemberment'],
    tags: ['staged-resolution', 'impossible-geometry', 'paradox'],
  },
  {
    id: 'interpolate',
    name: 'Interpolate',
    category: 'blending',
    description:
      'Smoothly and continuously fuse disparate conceptual systems according to parameterized weights, exerting concurrent structural influence.',
    directive:
      'Continuously blend two distinct conceptual frameworks along an interpolative continuum, allowing both paradigms to simultaneously sculpt and co-determine shared structural elements.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['concept_bleed', 'alternate'],
    tags: ['interpolation', 'continuous-blend', 'co-influence'],
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'blending',
    description:
      'Bifurcate conceptual governance by delegating early/global composition to one conceptual system and late/local articulation to another.',
    directive:
      'Partition generative authority: allocate early global layout, macro geometry, and composition to System A, while granting late local articulation, textural finish, and micro-behavior to System B.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['split', 'scale_schism'],
    tags: ['temporal-switch', 'macro-micro', 'partition'],
  },
  {
    id: 'alternate',
    name: 'Alternate',
    category: 'blending',
    description:
      'Interleave opposing conceptual systems rhythmically across structural domains instead of synthesizing a homogenous compromise.',
    directive:
      'Alternate between two contradictory conceptual systems in rhythmic, interlocking structural intervals, preserving the crisp tension of both without collapsing into an averaged blend.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['interpolate', 'switch'],
    tags: ['interleaving', 'rhythm', 'dual-presence'],
  },
  {
    id: 'split',
    name: 'Split',
    category: 'structural',
    description:
      'Strictly divide functional domain responsibilities (e.g. global composition vs. local material transformation) between isolated conceptual engines.',
    directive:
      'Enforce orthogonal domain division: assign System A exclusive dominion over topological form, massing, and skeletal framework, while assigning System B exclusive authority over surface dynamics, materiality, and light.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['structural_dismemberment', 'switch'],
    tags: ['domain-split', 'orthogonal', 'structural-division'],
  },
  {
    id: 'reversion',
    name: 'Reversion',
    category: 'lineage',
    description:
      'Reactivate a dormant ancestral trait or previously discarded operator from earlier lineage generations.',
    directive:
      'Query ancestral lineage records to identify an operator or stylistic constraint that was abandoned or filtered out in earlier generational steps, reinstating it into the active parameter matrix.',
    minEntropy: 5,
    experimental: true,
    compatibleOperatorIds: ['crossbreed', 'misremember'],
    tags: ['atavism', 'lineage', 'ancestry-recall'],
  },
  {
    id: 'crossbreed',
    name: 'Crossbreed',
    category: 'lineage',
    description:
      'Synthesize divergent evolutionary prompt branches by inheriting transformation logic from multiple ancestral trees.',
    directive:
      'Recombine dominant traits and operational directives from two or more divergent lineage histories, fusing their distinct transformation vectors into a unified mutant progeny.',
    minEntropy: 6,
    experimental: true,
    compatibleOperatorIds: ['reversion', 'diversity_select'],
    tags: ['hybridization', 'phylogeny', 'multi-parent'],
  },
  {
    id: 'diversity_select',
    name: 'Diversity Select',
    category: 'selection',
    description:
      'Evaluate candidate permutations against semantic distance metrics to prioritize genuinely distinct conceptual niches over superficial variants.',
    directive:
      'Analyze candidate prompt variants across a high-dimensional conceptual distance field; penalize clusters of minor stylistic rephrasings and selectively promote variants occupying isolated, uncrowded semantic coordinates.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['crossbreed', 'abstraction_escape'],
    tags: ['niche-selection', 'semantic-distance', 'anti-clustering'],
  },
] as const;

/**
 * Default dormant mutation recipe (disabled by default, empty collections)
 */
export const DEFAULT_MUTATION_RECIPE: MutationRecipe = {
  enabled: false,
  operators: [],
  attractors: [],
  pressureIds: [],
  semanticDistance: 0,
  semanticNeighborHops: 0,
  preservedAnchors: [],
  lineage: undefined,
  diagnosticSummary: undefined,
};

/**
 * Retrieve a mutation operator by its stable ID
 */
export function getMutationOperator(id: string): MutationOperator | undefined {
  return MUTATION_OPERATORS.find((op) => op.id === id);
}

/**
 * Verify if a given string corresponds to a registered mutation operator ID
 */
export function isValidMutationOperatorId(id: string): boolean {
  return MUTATION_OPERATORS.some((op) => op.id === id);
}

/**
 * Retrieve all mutation operators belonging to a specific category
 */
export function getMutationOperatorsByCategory(category: MutationCategory): MutationOperator[] {
  return MUTATION_OPERATORS.filter((op) => op.category === category);
}

/**
 * Group all registered mutation operators by category
 */
export function getMutationOperatorsGroupedByCategory(): Record<MutationCategory, MutationOperator[]> {
  const groups: Record<MutationCategory, MutationOperator[]> = {
    structural: [],
    semantic: [],
    ontological: [],
    recursive: [],
    contradiction: [],
    blending: [],
    lineage: [],
    selection: [],
  };

  for (const op of MUTATION_OPERATORS) {
    groups[op.category].push(op);
  }

  return groups;
}

// Re-export concrete executor for structural_dismemberment (Job 3)
export { executeStructuralDismemberment } from '../utils/conceptDismemberment';
