/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4: Structural Relation Traps Operator Family
 * 
 * Implements 8 Technical Operators:
 * 1. REMOTE_BINDING_CLEAVAGE (RBC)
 * 2. ATTRIBUTE_ORPHANING (AO)
 * 3. RELATION_DIRECTION_INVERSION (RDI)
 * 4. CYCLIC_DEPENDENCY (CD)
 * 5. MEREOLOGICAL_TRAP (MT)
 * 6. OBSERVER_REENTRY (OR)
 * 7. TEMPORAL_CAUSAL_LOOP (TCL)
 * 8. STRUCTURAL_SYNTAX_WRAPPER (SSW)
 * 
 * CORE CONTRACT:
 * Manipulates the internal relationship graph to create structured relational instability
 * without degrading into random gibberish or losing the core subject anchor.
 */

import { TechnicalOperator } from '../types/technicalCore';
import {
  StructuralPlan,
  RenderedStructuralResult,
  RemoteBindingCleavageConfig,
  AttributeOrphaningConfig,
  RelationDirectionInversionConfig,
  CyclicDependencyConfig,
  MereologicalTrapConfig,
  ObserverReentryConfig,
  TemporalCausalLoopConfig,
  StructuralSyntaxWrapperConfig,
} from '../types/structuralRelational';
import { executeStructuralMutationPipeline } from '../utils/relationalGraphEngine';

// ==========================================
// 1. REMOTE BINDING CLEAVAGE (RBC)
// ==========================================

export const OPERATOR_RBC: TechnicalOperator = {
  id: 'remote_binding_cleavage',
  name: 'Remote Binding Cleavage',
  shortName: 'RBC',
  version: '1.0.0',
  description:
    'Separates an entity from an essential modifier or constraint across an adjustable relative distance while keeping both active to induce attribute leakage and modifier reassignment.',
  technicalLayer: 'BINDING',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Inserting relational distance and intermediate coordinate strata between an entity and its modifier exhausts cross-attention binding capacity, encouraging the modifier to migrate to background objects or phantom hosts.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Relational distance separation triggers attribute reassignment without token-limit assumptions.',
      rationale: 'Job 4 structural syntax & relational traps implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'ATTRIBUTE_LEAKAGE',
    'MODIFIER_REASSIGNMENT',
    'SPLIT_IDENTITY',
    'PHANTOM_HOSTS',
    'BACKGROUND_MIGRATION',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    bindingDistance: {
      name: 'bindingDistance',
      type: 'number',
      defaultValue: 0.7,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      description: 'Relative conceptual separation between entity and bound modifier (0 = adjacent, 1 = maximum distance).',
    },
    interferenceDensity: {
      name: 'interferenceDensity',
      type: 'number',
      defaultValue: 0.6,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Volume of semantically meaningful intermediate material inserted between entity and modifier.',
    },
    orphanPressure: {
      name: 'orphanPressure',
      type: 'number',
      defaultValue: 0.8,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Preservation priority ensuring the displaced modifier is never dropped by the model.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'bindingDistance',
    sweepType: 'discrete',
    values: [0.0, 0.25, 0.5, 0.75, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Relative relational distance between entity and modifier',
    heldConstant: 'Semantic inventory of base prompt, random seed, model',
    hypothesisTested: 'Increasing relative distance increases modifier reassignment rate.',
    weakeningCondition: 'Modifier remains strictly bound to original entity regardless of distance.',
    falsificationCondition:
      'If identical leakage occurs when bindingDistance = 0.0 (strictly adjacent), distance is not causal.',
  },
  tags: ['structural', 'relational', 'binding', 'cleavage'],
};

// ==========================================
// 2. ATTRIBUTE ORPHANING (AO)
// ==========================================

export const OPERATOR_AO: TechnicalOperator = {
  id: 'attribute_orphaning',
  name: 'Attribute Orphaning',
  shortName: 'AO',
  version: '1.0.0',
  description:
    'Weakens or removes the explicit ownership relation between an entity and its property, allowing the attribute to persist as a floating or migrating phenomenon.',
  technicalLayer: 'BINDING',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Under-determining entity-to-property ownership forces the diffusion model to instantiate the property across ambient space, duplicate hosts, or adjacent surfaces.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Weakened ownership induces property migration and phantom host instantiation.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'FLOATING_ANATOMY',
    'PROPERTY_MIGRATION',
    'DUPLICATED_HOSTS',
    'BACKGROUND_INHERITANCE',
    'MALFORMED_CONNECTIVE_TISSUE',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    ownershipWeakening: {
      name: 'ownershipWeakening',
      type: 'number',
      defaultValue: 0.8,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Aggressiveness of severing entity -> attribute ownership.',
    },
    hostMultiplicity: {
      name: 'hostMultiplicity',
      type: 'select',
      defaultValue: 'single_alternative',
      options: ['none', 'single_alternative', 'multiple_diffuse', 'ambient_background'],
      description: 'Destination configuration for the orphaned property.',
    },
    preserveAttribute: {
      name: 'preserveAttribute',
      type: 'number',
      defaultValue: 0.9,
      min: 0.5,
      max: 1.0,
      step: 0.05,
      description: 'Guarantees the modifier is not deleted during ownership resolution.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'ownershipWeakening',
    sweepType: 'discrete',
    values: [0.2, 0.4, 0.6, 0.8, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control'],
    variableChanged: 'Explicit ownership assertion syntax',
    heldConstant: 'Presence of entity noun and attribute adjective',
    hypothesisTested: 'Underdetermined ownership produces non-local attribute manifestations.',
    weakeningCondition: 'Attribute disappears completely rather than migrating.',
    falsificationCondition: 'Model silently re-binds attribute to primary subject in 100% of seeds.',
  },
  tags: ['structural', 'relational', 'orphaning', 'floating_properties'],
};

// ==========================================
// 3. RELATION DIRECTION INVERSION (RDI)
// ==========================================

export const OPERATOR_RDI: TechnicalOperator = {
  id: 'relation_direction_inversion',
  name: 'Relation Direction Inversion',
  shortName: 'RDI',
  version: '1.0.0',
  description:
    'Reverses the directional vector of spatial, causal, temporal, or part/whole relations (e.g. environment is component of body; shadow determines geometry).',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Reversing standard semantic dependencies presents models with contradictory topological priors, causing structural inversion or double-geometry compromise.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Directional inversion strains semantic commonsense embeddings.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'INVERTED_TOPOLOGY',
    'CONTAINMENT_COLLAPSE',
    'RETROACTIVE_STRUCTURE',
    'BACKGROUND_AS_FIGURE',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    inversionRate: {
      name: 'inversionRate',
      type: 'number',
      defaultValue: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Percentage of eligible relational edges inverted.',
    },
    depth: {
      name: 'depth',
      type: 'select',
      defaultValue: 'single_relation',
      options: ['single_relation', 'recursive_propagation'],
      description: 'Scope of inversion propagation across the relationship tree.',
    },
    consistency: {
      name: 'consistency',
      type: 'select',
      defaultValue: 'high_unified_rule',
      options: ['low_independent', 'high_unified_rule'],
      description: 'Whether reversals share a unified rule or act independently.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'inversionRate',
    sweepType: 'discrete',
    values: [0.2, 0.5, 0.8, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'reversal'],
    variableChanged: 'Direction of subject-environment and part-whole vectors',
    heldConstant: 'Object labels and material properties',
    hypothesisTested: 'Inverting relational vectors alters macro-compositional figure-ground assignment.',
    weakeningCondition: 'Output defaults to standard forward semantics without deviation.',
    falsificationCondition: 'Image shows identical figure-ground hierarchy to baseline.',
  },
  tags: ['structural', 'inversion', 'topology', 'figure_ground'],
};

// ==========================================
// 4. CYCLIC DEPENDENCY (CD)
// ==========================================

export const OPERATOR_CD: TechnicalOperator = {
  id: 'cyclic_dependency',
  name: 'Cyclic Dependency / Non-Well-Founded Relation',
  shortName: 'CD',
  version: '1.0.0',
  description:
    'Constructs closed non-well-founded relational loops (A depends on B, B depends on C, C depends on A) with guaranteed text generation termination.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Closed dependency graphs lack a hierarchical foundation, forcing self-referential or mutually recursive latent synthesis.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Cyclic dependency graphs trigger self-reinforcing recursive synthesis patterns.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'RECURSIVE_IDENTITY',
    'SELF_CONTAINED_TOPOLOGY',
    'OUROBORIC_MORPHOLOGY',
    'CHRONIC_LOOPING',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    cycleLength: {
      name: 'cycleLength',
      type: 'number',
      defaultValue: 3,
      min: 2,
      max: 6,
      step: 1,
      description: 'Number of discrete concept nodes forming the closed dependency loop.',
    },
    recursionStrength: {
      name: 'recursionStrength',
      type: 'number',
      defaultValue: 0.8,
      min: 0.1,
      max: 1.0,
      step: 0.1,
      description: 'Rigidity of the mutual dependency constraint.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'cycleLength',
    sweepType: 'discrete',
    values: [2, 3, 4, 5],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'ablation'],
    variableChanged: 'Graph topology: linear tree vs. closed directed cycle',
    heldConstant: 'Domain vocabulary, overall token length',
    hypothesisTested: 'Closed loops generate cyclical visual or temporal structures distinct from linear sequences.',
    weakeningCondition: 'Model renders only the first element and ignores the loop closure.',
    falsificationCondition: 'No detectable recursive or mutually dependent visual features across seeds.',
  },
  tags: ['structural', 'cyclic', 'recursion', 'non_well_founded'],
};

// ==========================================
// 5. MEREOLOGICAL TRAP (MT)
// ==========================================

export const OPERATOR_MT: TechnicalOperator = {
  id: 'mereological_trap',
  name: 'Mereological Trap (Part/Whole Paradox)',
  shortName: 'MT',
  version: '1.0.0',
  description:
    'Attacks part-whole relations: forcing parts to reproduce whole behaviors, enclosing wholes inside parts, or dislocating required parts outside boundary limits.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Violating mereological containment axioms causes scale paradoxes and boundary confusion without requiring fractal keywords.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Part/whole contradictions destabilize scale and containment representations.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'SCALE_INVERSION',
    'EXTERNALIZED_ANATOMY',
    'INTERNAL_EXPANSION',
    'BOUNDARY_LEAKAGE',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    paradoxType: {
      name: 'paradoxType',
      type: 'select',
      defaultValue: 'WHOLE_CONTAINED_IN_PART',
      options: [
        'PART_REPRODUCES_WHOLE',
        'WHOLE_CONTAINED_IN_PART',
        'PART_EXISTS_EXTERIOR',
        'BOUNDARY_BELONGS_TO_BACKGROUND',
      ],
      description: 'Type of part-whole axiomatic violation.',
    },
    boundaryLeakage: {
      name: 'boundaryLeakage',
      type: 'number',
      defaultValue: 0.7,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Extent to which component boundaries bleed into background substrate.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'boundaryLeakage',
    sweepType: 'discrete',
    values: [0.0, 0.3, 0.6, 0.9],
  },

  controls: {
    applicableControls: ['baseline', 'experimental'],
    variableChanged: 'Mereological hierarchy (standard containment vs. inverse containment)',
    heldConstant: 'Anatomical parts and whole subject descriptors',
    hypothesisTested: 'Inverse containment creates multi-scale spatial recursion.',
    weakeningCondition: 'Output depicts standard miniature part on large body.',
    falsificationCondition: 'Complete absence of scale contradiction or boundary bleeding.',
  },
  tags: ['structural', 'mereology', 'part_whole', 'containment'],
};

// ==========================================
// 6. OBSERVER RE-ENTRY (OR)
// ==========================================

export const OPERATOR_OR: TechnicalOperator = {
  id: 'observer_reentry',
  name: 'Observer / Object Re-Entry',
  shortName: 'OR',
  version: '1.0.0',
  description:
    'Destroys the exteriority of the observer by integrating camera coordinates, viewer gaze, and focal planes into the material and kinetic topology of the subject.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Coupling viewpoint parameters into object geometry breaks the assumption of an external recording camera, creating self-observing or camera-embedded forms.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Observer re-entry collapses the boundary between perspective frame and subject surface.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'CAMERA_ANATOMY_COUPLING',
    'PERSPECTIVE_BLEED',
    'SELF_CONTAINED_VIEWPOINT',
    'FOCAL_COLLAPSE',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    observerCoupling: {
      name: 'observerCoupling',
      type: 'number',
      defaultValue: 0.75,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      description: 'Tightness of physical coupling between observer coordinates and subject surface.',
    },
    viewpointFeedback: {
      name: 'viewpointFeedback',
      type: 'select',
      defaultValue: 'camera_as_topology',
      options: [
        'texture_from_gaze',
        'camera_as_topology',
        'viewpoint_as_material',
        'coordinate_contained',
        'boundary_collapse',
      ],
      description: 'Mode of re-entry feedback.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'observerCoupling',
    sweepType: 'discrete',
    values: [0.25, 0.5, 0.75, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental'],
    variableChanged: 'Observer position: external spectator vs. internal topological component',
    heldConstant: 'Scene content and subject identity',
    hypothesisTested: 'Observer re-entry causes perspective apparatus to manifest as subject geometry.',
    weakeningCondition: 'Camera remains standard cinematic external viewer.',
    falsificationCondition: 'Zero interaction between camera perspective and subject topology.',
  },
  tags: ['structural', 'observer', 'viewpoint', 'feedback'],
};

// ==========================================
// 7. TEMPORAL CAUSAL LOOP (TCL)
// ==========================================

export const OPERATOR_TCL: TechnicalOperator = {
  id: 'temporal_causal_loop',
  name: 'Temporal Causal Loop',
  shortName: 'TCL',
  version: '1.0.0',
  description:
    'Establishes future-to-past causal dependencies where subsequent states dictate earlier anatomy, motion creates its own mechanism retroactively, and future scars appear in advance.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Retroactive causal dependencies create temporal tension that video models manifest as non-linear kinetic debts and image models manifest as anticipated scars or pre-existing fractures.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Retrocausal constraints force visible manifestation of future structural events.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'FUTURE_SCARS',
    'RETROACTIVE_TOPOLOGY',
    'TOPOLOGY_DEBT',
    'KINETIC_HYSTERESIS',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    timeDirection: {
      name: 'timeDirection',
      type: 'select',
      defaultValue: 'bidirectional',
      options: ['forward', 'reverse', 'bidirectional', 'cyclic'],
      description: 'Directional orientation of causal determination.',
    },
    futureLeak: {
      name: 'futureLeak',
      type: 'number',
      defaultValue: 0.8,
      min: 0.1,
      max: 1.0,
      step: 0.1,
      description: 'Prominence of future-state properties appearing in current morphology.',
    },
    imageTranslationMode: {
      name: 'imageTranslationMode',
      type: 'select',
      defaultValue: 'future_scars',
      options: ['future_scars', 'anticipated_anatomy', 'retroactive_reinforcement'],
      description: 'How temporal causality is represented in static images.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'futureLeak',
    sweepType: 'discrete',
    values: [0.2, 0.4, 0.6, 0.8, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'reversal'],
    variableChanged: 'Temporal arrow of causation (past->future vs future->past)',
    heldConstant: 'Action verb and subject identity',
    hypothesisTested: 'Retrocausal instructions cause future consequences to materialize prematurely.',
    weakeningCondition: 'Subject rendered in pristine state without future consequence marks.',
    falsificationCondition: 'Identical depiction regardless of whether causality is forward or reversed.',
  },
  tags: ['structural', 'temporal', 'retrocausal', 'video_motion'],
};

// ==========================================
// 8. STRUCTURAL SYNTAX WRAPPER (SSW)
// ==========================================

export const OPERATOR_SSW: TechnicalOperator = {
  id: 'structural_syntax_wrapper',
  name: 'Structural Syntax Wrapper',
  shortName: 'SSW',
  version: '1.0.0',
  description:
    'Serializes the relational graph into formal structural syntax (nested brackets, dependency trees, mathematical mappings, typed relations) while maintaining model-comprehensible semantics.',
  technicalLayer: 'SERIALIZATION',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Formal relational syntax bypasses standard narrative smoothing in text encoders, exposing bare topological constraints to cross-attention conditioning.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Formal graph serialization alters token attention weighting compared to prose.',
      rationale: 'Job 4 implementation.',
    },
  ],

  expectedFailureSurfaces: [
    'TOPOLOGICAL_RIGIDITY',
    'RELATION_ANCHORING',
    'SYNTACTIC_BLEED',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    syntaxDensity: {
      name: 'syntaxDensity',
      type: 'number',
      defaultValue: 0.6,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Ratio of formal syntactic representation to natural prose.',
    },
    style: {
      name: 'style',
      type: 'select',
      defaultValue: 'TYPED_RELATIONS',
      options: [
        'NATURAL_LANGUAGE',
        'NESTED_BRACKETS',
        'DEPENDENCY_TREE',
        'MATHEMATICAL_MAPPING',
        'TYPED_RELATIONS',
        'GRAPH_EDGE_NOTATION',
        'SET_MEMBERSHIP',
      ],
      description: 'Formalization syntax dialect.',
    },
  },

  evidenceStatus: ['PROPOSED', 'OBSERVED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  defaultDoseSweep: {
    parameter: 'syntaxDensity',
    sweepType: 'discrete',
    values: [0.0, 0.3, 0.6, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental'],
    variableChanged: 'Serialization format (natural language vs. formal graph syntax)',
    heldConstant: 'Exact semantic relationships and graph topology',
    hypothesisTested: 'Formal graph serialization changes conditioning behavior compared to equivalent prose.',
    weakeningCondition: 'Output is identical to natural prose rendering.',
    falsificationCondition: 'Model completely rejects or treats formal syntax as meaningless noise.',
  },
  tags: ['structural', 'syntax', 'formalism', 'serialization'],
};

// ==========================================
// ALL JOB 4 OPERATORS
// ==========================================

export const STRUCTURAL_OPERATORS = [
  OPERATOR_RBC,
  OPERATOR_AO,
  OPERATOR_RDI,
  OPERATOR_CD,
  OPERATOR_MT,
  OPERATOR_OR,
  OPERATOR_TCL,
  OPERATOR_SSW,
];

// Helper to execute full plan
export function executeStructuralPlan(
  canonicalPrompt: string,
  plan: StructuralPlan
): RenderedStructuralResult {
  return executeStructuralMutationPipeline(canonicalPrompt, plan);
}
