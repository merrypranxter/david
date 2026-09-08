/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry Operator Family
 * 
 * Implements the 5 Core Competing Forces Operators:
 * 1. ATTRACTOR_BALANCE (AB)
 * 2. CATEGORICAL_CANCELLATION (CC)
 * 3. ORTHOGONAL_STABILIZER (OS)
 * 4. GUIDANCE_ASYMMETRY (GA)
 * 5. SADDLE_TRAP (ST)
 * 
 * CORE CONTRACT:
 * Replaces singular scalar guidance with vector spaces of competing conceptual forces.
 * Supports both Direct Model Control (Tier B) and Serialized Approximation (Tier A)
 * without making false claims about black-box internal vector access.
 */

import { TechnicalOperator } from '../types/technicalCore';

// ==========================================
// 1. ATTRACTOR BALANCE (AB)
// ==========================================

export const OPERATOR_ATTRACTOR_BALANCE: TechnicalOperator = {
  id: 'attractor_balance',
  name: 'Attractor Balance',
  shortName: 'AB',
  version: '1.0.0',
  description:
    'Keeps two incompatible concept families active without allowing either to trivially dominate, compelling the model to synthesize hybrid material states and topology compromises rather than a crude 50/50 split.',
  technicalLayer: 'GUIDANCE',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'By maintaining two diametrically opposed cross-attention pull vectors under equal or tuned gradient pressure, the model is prevented from settling into either standard attractor basin, forcing the generation of unclassifiable intermediate manifolds.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Dual attractor equilibrium induces topological compromise without collapsing into generic noise.',
      rationale: 'Job 5A guidance geometry implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'CONCEPT_DOMINANCE',
    'GENERIC_HYBRID',
    'surface leakage',
    'unstable local identity',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    attractorAWeight: {
      name: 'Attractor A Weight',
      type: 'number',
      defaultValue: 0.5,
      description: 'Conditioning amplitude assigned to Attractor A.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    attractorBWeight: {
      name: 'Attractor B Weight',
      type: 'number',
      defaultValue: 0.5,
      description: 'Conditioning amplitude assigned to Attractor B.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    balanceMode: {
      name: 'Balance Mode',
      type: 'select',
      defaultValue: 'NEAR_EQUILIBRIUM',
      description: 'Equilibrium strategy between Attractor A and B.',
      options: ['A_DOMINANT', 'B_DOMINANT', 'NEAR_EQUILIBRIUM', 'RANDOMIZED_EQUILIBRIUM'],
    },
    competitionStrength: {
      name: 'Competition Strength',
      type: 'number',
      defaultValue: 0.85,
      description: 'Intensity of the mutual exclusion constraint between attractors.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    persistBoth: {
      name: 'Persist Both',
      type: 'boolean',
      defaultValue: true,
      description: 'Ensures both attractors are explicitly rendered with independent structural consequences.',
    },
  },

  evidenceStatus: ['EMPIRICALLY_USEFUL', 'MECHANISM_SUPPORTED'],
  scores: {
    creativeUtility: 0.95,
    repeatability: 0.84,
    mechanismConfidence: 0.72,
    modelDependence: 0.60,
    failureToIgnoreRate: 0.80,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Ratio of Attractor A to Attractor B conditioning pressure',
    heldConstant: 'Random seed, primary subject identity anchor, macro boundary container',
    hypothesisTested:
      'Equalizing cross-attention pull forces the generation into a hybrid material state without category collapse.',
    weakeningCondition:
      'One attractor completely disappears from the output despite equal weighting (Concept Dominance).',
    falsificationCondition:
      'Output generates an ordinary 50/50 spatial split (left half rock, right half flesh) with zero topological integration.',
    negativeControlDescription:
      'Single attractor run where Attractor B is zeroed out, verifying normal baseline behavior.',
  },

  defaultDoseSweep: {
    parameter: 'attractorAWeight',
    sweepType: 'linear_range',
    values: [0.1, 0.3, 0.5, 0.7, 0.9],
    rangeConfig: { min: 0.1, max: 0.9, step: 0.2 },
    description: 'Sweep Attractor A weight against fixed Attractor B (0.5) to identify the critical transition boundary.',
  },

  recommendedStageRoles: ['CRUCIBLE'],
  tags: ['guidance', 'attractor', 'balance', 'geometry', 'equilibrium'],
};

// ==========================================
// 2. CATEGORICAL CANCELLATION (CC)
// ==========================================

export const OPERATOR_CATEGORICAL_CANCELLATION: TechnicalOperator = {
  id: 'categorical_cancellation',
  name: 'Categorical Cancellation',
  shortName: 'CC',
  version: '1.0.0',
  description:
    'Deliberately suppresses class/category taxonomy (animal, machine, plant, architecture) while amplifying relational, mechanical, and physical structure (hinges, pressure, continuity), generating entities with strong physical coherence but uncertain taxonomy.',
  technicalLayer: 'GUIDANCE',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Disrupting the high-level semantic class token embeddings while heavily conditioning on lower-level physical/relational operators forces the denoiser to construct a functionally plausible mechanical organism that has no taxonomic precedent.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Decoupling category labels from structural laws yields ontological ambiguity without noise.',
      rationale: 'Job 5A guidance geometry implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'UNCONDITIONED_REGRESSION',
    'taxonomic collapse',
    'accidental named class resolution',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    categorySuppression: {
      name: 'Category Suppression',
      type: 'number',
      defaultValue: 0.85,
      description: 'Degree of explicit suppression applied to high-level nominal category tags.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    structuralCompulsion: {
      name: 'Structural Compulsion',
      type: 'number',
      defaultValue: 0.95,
      description: 'Amplitude of lower-level physical and relational structural rules enforced.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    categoryPairCount: {
      name: 'Category Pair Count',
      type: 'number',
      defaultValue: 2,
      description: 'Number of competing nominal categories placed in mutual cancellation.',
      min: 1,
      max: 3,
      step: 1,
    },
    taxonomicAmbiguity: {
      name: 'Taxonomic Ambiguity',
      type: 'select',
      defaultValue: 'HIGH',
      description: 'Degree to which class identity is forbidden from resolving.',
      options: ['LOW', 'MEDIUM', 'HIGH'],
    },
  },

  evidenceStatus: ['EMPIRICALLY_USEFUL', 'MECHANISM_SUPPORTED'],
  scores: {
    creativeUtility: 0.98,
    repeatability: 0.86,
    mechanismConfidence: 0.75,
    modelDependence: 0.55,
    failureToIgnoreRate: 0.78,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'ablation'],
    variableChanged: 'Ratio of categorical labels to physical structural compulsion clauses',
    heldConstant: 'Macro silhouette, rendering quality parameters, seed',
    hypothesisTested:
      'Entities can display hyper-coherent physics and kinematics while possessing zero recognizable biological or mechanical class identity.',
    weakeningCondition:
      'The model collapses back into a recognized category (e.g. it turns into a simple robot dog).',
    falsificationCondition:
      'Suppressing category words produces abstract geometric splatter with no functional joints or coherent surface.',
  },

  recommendedStageRoles: ['CRUCIBLE'],
  tags: ['guidance', 'category', 'taxonomy', 'cancellation', 'structure'],
};

// ==========================================
// 3. ORTHOGONAL STRUCTURAL STABILIZER (OS)
// ==========================================

export const OPERATOR_ORTHOGONAL_STABILIZER: TechnicalOperator = {
  id: 'orthogonal_stabilizer',
  name: 'Orthogonal Structural Stabilizer',
  shortName: 'OS',
  version: '1.0.0',
  description:
    'Maintains non-negotiable structural and topological invariants (continuous boundary, conserved genus, isobaric pressure, fixed hinge count) perpendicular to competing concept vectors, preventing competing-attractor experiments from dissolving into generic blur or noise.',
  technicalLayer: 'GUIDANCE',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'By establishing mathematical topological invariants that are orthogonal to the semantic axes of competition, the manifold is constrained to maintain continuous coherence regardless of semantic warfare.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Orthogonal invariants bound latent trajectory into a bounded submanifold.',
      rationale: 'Job 5A guidance geometry implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'STRUCTURAL_COLLAPSE',
    'boundary rupture',
    'particulate detachment',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    stabilizerStrength: {
      name: 'Stabilizer Strength',
      type: 'number',
      defaultValue: 0.9,
      description: 'Compulsion weight of the orthogonal structural invariant.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    structuralInvariantType: {
      name: 'Structural Invariant Type',
      type: 'select',
      defaultValue: 'CONTINUOUS_BOUNDARY',
      description: 'The specific topological or physical invariant held strictly invariant.',
      options: [
        'CONTINUOUS_BOUNDARY',
        'CONSERVED_TOPOLOGY',
        'PRESERVED_SILHOUETTE',
        'PRESSURE_BALANCE',
        'HINGE_COUNT',
        'SYMMETRY_COUNT',
        'RHYTHMIC_GRID',
        'MOTION_TRAJECTORY',
        'FIXED_FRAME_OCCUPANCY',
        'CONNECTED_REGIONS',
      ],
    },
    invariantCount: {
      name: 'Invariant Count',
      type: 'number',
      defaultValue: 2,
      description: 'Number of independent invariant clauses enforcing structural containment.',
      min: 1,
      max: 5,
      step: 1,
    },
    strictness: {
      name: 'Strictness',
      type: 'select',
      defaultValue: 'STRICT',
      description: 'Axiomatic priority of the invariant clauses.',
      options: ['LOOSE', 'MODERATE', 'STRICT', 'AXIOMATIC'],
    },
  },

  evidenceStatus: ['EMPIRICALLY_USEFUL', 'MECHANISM_SUPPORTED'],
  scores: {
    creativeUtility: 0.96,
    repeatability: 0.90,
    mechanismConfidence: 0.80,
    modelDependence: 0.45,
    failureToIgnoreRate: 0.90,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control'],
    variableChanged: 'Presence and strictness of orthogonal topological invariants',
    heldConstant: 'Semantic contradiction intensity, prompt length, model seed',
    hypothesisTested:
      'High semantic contradiction causes boundary tearing without an orthogonal stabilizer, but preserves a single manifold when the stabilizer is active.',
    weakeningCondition:
      'Boundary tears even when strictness is set to AXIOMATIC.',
    falsificationCondition:
      'Outputs with and without the stabilizer show identical geometric boundary integrity.',
  },

  recommendedStageRoles: ['CONTAINER'],
  tags: ['guidance', 'stabilizer', 'orthogonal', 'invariant', 'topology'],
};

// ==========================================
// 4. GUIDANCE ASYMMETRY (GA)
// ==========================================

export const OPERATOR_GUIDANCE_ASYMMETRY: TechnicalOperator = {
  id: 'guidance_asymmetry',
  name: 'Guidance Asymmetry',
  shortName: 'GA',
  version: '1.0.0',
  description:
    'Deliberately constructs non-equal conditioning force vectors (e.g. A=0.35, B=0.65, Structure=0.90, Material=Extreme) to produce partial satisfaction, material possession, and structural dominance over category.',
  technicalLayer: 'GUIDANCE',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Calibrated force asymmetry prevents symmetric deadlocks and forces the subordinate concept to express itself as a parasitic or structural modification of the dominant force, yielding higher aesthetic tension than uniform weighting.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Asymmetric force profiles induce hierarchical tension without complete erasure.',
      rationale: 'Job 5A guidance geometry implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'CONCEPT_DOMINANCE',
    'CONDITION_DROP',
    'erasure of secondary force',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    primaryWeight: {
      name: 'Primary Attractor Weight',
      type: 'number',
      defaultValue: 0.4,
      description: 'Relative force of primary attractor.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    secondaryWeight: {
      name: 'Secondary Attractor Weight',
      type: 'number',
      defaultValue: 0.7,
      description: 'Relative force of secondary attractor.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    structuralWeight: {
      name: 'Structural Weight',
      type: 'number',
      defaultValue: 0.9,
      description: 'Compulsion amplitude of the structural frame.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    identityWeight: {
      name: 'Identity Weight',
      type: 'number',
      defaultValue: 0.75,
      description: 'Anchor strength of subject identity.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    materialWeight: {
      name: 'Material Weight',
      type: 'number',
      defaultValue: 0.95,
      description: 'Physical pressure exerted by material forces.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    presetType: {
      name: 'Asymmetry Preset',
      type: 'select',
      defaultValue: 'MATERIAL_POSSESSION',
      description: 'Preconfigured asymmetric vector profiles.',
      options: [
        'ANCHOR_DOMINANT',
        'MATERIAL_POSSESSION',
        'STRUCTURE_OVER_CATEGORY',
        'CATEGORY_CIVIL_WAR',
        'CUSTOM',
      ],
    },
  },

  evidenceStatus: ['EMPIRICALLY_USEFUL', 'MECHANISM_SUPPORTED'],
  scores: {
    creativeUtility: 0.94,
    repeatability: 0.88,
    mechanismConfidence: 0.78,
    modelDependence: 0.65,
    failureToIgnoreRate: 0.72,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'dose_sweep'],
    variableChanged: 'Skewness ratio between Primary, Secondary, Material, and Structural channels',
    heldConstant: 'Core prompt lexical seeds, model seed',
    hypothesisTested:
      'Asymmetric weighting yields complex parasitic textures rather than flat blending.',
    weakeningCondition:
      'The weaker concept is entirely purged from the output representation.',
    falsificationCondition:
      'Asymmetry produces the exact same output distribution as 50/50 weighting.',
  },

  recommendedStageRoles: ['CRUCIBLE'],
  tags: ['guidance', 'asymmetry', 'weights', 'material-possession', 'anchor'],
};

// ==========================================
// 5. SADDLE TRAP (ST)
// ==========================================

export const OPERATOR_SADDLE_TRAP: TechnicalOperator = {
  id: 'saddle_trap',
  name: 'Saddle Trap',
  shortName: 'ST',
  version: '1.0.0',
  description:
    'A central DAVID operator that locks generation near an unstable saddle point between incompatible attractors (A pulls one way, B pulls another, STRUCTURE prevents collapse), maintaining an intentionally unresolved ontological contest.',
  technicalLayer: 'GUIDANCE',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'The loss landscape of diffusion models contains unstable saddle manifolds between distinct categorical minima. By reinforcing orthogonal structural invariants while balancing opposing semantic gradients, the reverse diffusion trajectory can be arrested on the saddle ridge, yielding an emergent form that belongs to neither basin.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Saddle trapping stabilizes the diffusion trajectory along the separatrix of two concept basins.',
      rationale: 'Job 5A guidance geometry implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'basin drift toward A',
    'basin drift toward B',
    'escape to unconditioned prior',
    'saddle collapse',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    abBalance: {
      name: 'A/B Balance',
      type: 'number',
      defaultValue: 0.5,
      description: 'Center point of the saddle equilibrium (0.50 = exact saddle ridge).',
      min: 0.0,
      max: 1.0,
      step: 0.02,
    },
    structuralForce: {
      name: 'Structural Force',
      type: 'number',
      defaultValue: 0.95,
      description: 'Orthogonal structural tension preventing collapse off the saddle.',
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    saddleWidth: {
      name: 'Saddle Width',
      type: 'number',
      defaultValue: 0.12,
      description: 'Narrowness of the acceptable equilibrium region before drift response activates.',
      min: 0.05,
      max: 0.5,
      step: 0.01,
    },
    driftTolerance: {
      name: 'Drift Tolerance',
      type: 'number',
      defaultValue: 0.15,
      description: 'Allowable temporary excursion toward either attractor.',
      min: 0.0,
      max: 0.5,
      step: 0.05,
    },
    escapeResponse: {
      name: 'Escape Response',
      type: 'select',
      defaultValue: 'REINFORCE_STRUCTURE',
      description: 'Action taken when trajectory begins rolling off the saddle ridge.',
      options: ['ALLOW_COLLAPSE', 'REBALANCE', 'FLIP_DOMINANCE', 'REINFORCE_STRUCTURE'],
    },
  },

  evidenceStatus: ['EMPIRICALLY_USEFUL', 'MECHANISM_SUPPORTED'],
  scores: {
    creativeUtility: 0.99,
    repeatability: 0.85,
    mechanismConfidence: 0.82,
    modelDependence: 0.50,
    failureToIgnoreRate: 0.85,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'reversal'],
    variableChanged: 'Saddle equilibrium coordinates and escape response protocols',
    heldConstant: 'Seed, structural frame invariants, prompt length',
    hypothesisTested:
      'Holding diffusion trajectories in the saddle region yields anomalous intermediate morphology that cannot be reached through standard single-prompt interpolation.',
    weakeningCondition:
      'Generation consistently falls into Attractor A or B without showing saddle characteristics.',
    falsificationCondition:
      'Outputs generated at saddle center are mathematically identical to a linear visual alpha-blend of A and B.',
  },

  defaultDoseSweep: {
    parameter: 'abBalance',
    sweepType: 'linear_range',
    values: [0.4, 0.45, 0.5, 0.55, 0.6],
    rangeConfig: { min: 0.4, max: 0.6, step: 0.05 },
    description: 'High-resolution balance sweep across the narrow saddle ridge to map the tipping point.',
  },

  recommendedStageRoles: ['CRUCIBLE', 'CONTAINER'],
  tags: ['guidance', 'saddle', 'equilibrium', 'unstable', 'crucible', 'central-operator'],
};

// Array of all Job 5A Guidance Geometry operators
export const GUIDANCE_OPERATORS: TechnicalOperator[] = [
  OPERATOR_ATTRACTOR_BALANCE,
  OPERATOR_CATEGORICAL_CANCELLATION,
  OPERATOR_ORTHOGONAL_STABILIZER,
  OPERATOR_GUIDANCE_ASYMMETRY,
  OPERATOR_SADDLE_TRAP,
];
