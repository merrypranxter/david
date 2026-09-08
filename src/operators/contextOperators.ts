/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 3: Context Budget & Binding Failure Operators
 * 
 * Implements:
 * 1. RBC-AS: REMOTE BINDING CLEAVAGE VIA ATTENTION STARVATION
 * 2. AC-RP: ATTENTION CANNIBALIZATION VIA REDUNDANCY PRESSURE
 * 
 * CORE DOCTRINE:
 * CREATIVE UTILITY ≠ MECHANISM CONFIDENCE.
 * We seek useful corridors where the entity survives and the modifier survives,
 * but their binding relationship breaks or destabilizes reproducibly.
 */

import { TechnicalOperator } from '../types/technicalCore';
import {
  ContextLayoutPlan,
  RenderedContextResult,
  DistractorBlockConfig,
  RepetitionGeometryConfig,
  PrimacyRecencyStrategy,
} from '../types/contextBinding';
import {
  decomposePromptToSemanticUnits,
  renderContextLayout,
} from '../utils/contextEngine';
import { TechnicalBackendCapabilities } from '../types/technicalCore';

// ==========================================
// 1. OPERATOR 1: REMOTE BINDING CLEAVAGE (RBC-AS)
// ==========================================

export const OPERATOR_RBC_AS: TechnicalOperator = {
  id: 'rbc_as_remote_binding_cleavage',
  name: 'Remote Binding Cleavage via Attention Starvation',
  shortName: 'RBC-AS',
  version: '1.0.0',
  description:
    'Deliberately increases contextual distance between an entity and its bound modifier while saturating intervening space with competing material to test cross-attention binding stability.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Increasing spatial and lexical distance between an entity and its modifier while filling the intervening context with secondary concepts exhausts cross-attention binding capacity. Rather than being suppressed, the orphaned attribute rebinds to secondary hosts or ambient background geometry.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis:
        'Increasing spatial and lexical distance between an entity and its modifier while filling intervening context exhausts cross-attention capacity.',
      rationale: 'Initial Job 3 formulation for context budget & binding failure.',
    },
  ],

  expectedFailureSurfaces: [
    'ATTRIBUTE_LEAKAGE',
    'UNBOUND_ATTRIBUTE',
    'PHANTOM_HOST',
    'SPLIT_IDENTITY',
    'FEATURE_REASSIGNMENT',
    'TIMBRAL_DISSOCIATION',
    'TEMPORAL_FEATURE_MIGRATION',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    separationStrength: {
      name: 'separationStrength',
      type: 'number',
      defaultValue: 0.6,
      min: 0.0,
      max: 1.0,
      step: 0.1,
      description: 'Drives physical word distance and distractor volume between entity and modifier.',
    },
    interveningContextDensity: {
      name: 'interveningContextDensity',
      type: 'number',
      defaultValue: 0.5,
      min: 0.1,
      max: 1.0,
      step: 0.1,
      description: 'Lexical density of the intervening distractor block.',
    },
    distractorFamily: {
      name: 'distractorFamily',
      type: 'select',
      defaultValue: 'WEAK_CONCEPTS',
      options: [
        'WEAK_CONCEPTS',
        'POLYSEMANTIC_TERMS',
        'UNRELATED_MATERIALS',
        'SECONDARY_RELATIONS',
        'LOW_PRIORITY_STRUCTURAL',
      ],
      description: 'Vocabulary cluster used to generate non-dominant intervening competition.',
    },
    primacyRecencyStrategy: {
      name: 'primacyRecencyStrategy',
      type: 'select',
      defaultValue: 'PRIMACY_RECENCY_SPLIT',
      options: [
        'ENTITY_PRIMACY',
        'MODIFIER_PRIMACY',
        'PRIMACY_RECENCY_SPLIT',
        'HANDOFF_SPLIT',
      ],
      description: 'Spatial configuration of entity vs modifier across the prompt context.',
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
    parameter: 'separationStrength',
    sweepType: 'discrete',
    values: [0.0, 0.25, 0.5, 0.75, 1.0],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Contextual word/character separation between entity and bound modifier',
    heldConstant: 'Semantic inventory of base prompt, model, random seed',
    hypothesisTested: 'Increasing contextual distance causes cross-attention binding cleavage.',
    weakeningCondition: 'Modifier remains strictly bound to entity regardless of intervening distance.',
    falsificationCondition:
      'If identical attribute leakage occurs when entity and modifier are directly adjacent with zero intervening mass, the spatial-distance hypothesis is falsified.',
    negativeControlDescription:
      'Hold semantic inventory constant. Bring entity and modifier adjacent while placing distractors at the tail. If leakage persists, the effect is semantic competition rather than positional cleavage.',
  },
  tags: ['context', 'binding', 'attention', 'primacy', 'recency'],
};

// ==========================================
// 2. OPERATOR 2: ATTENTION CANNIBALIZATION (AC-RP)
// ==========================================

export const OPERATOR_AC_RP: TechnicalOperator = {
  id: 'ac_rp_attention_cannibalization',
  name: 'Attention Cannibalization via Redundancy Pressure',
  shortName: 'AC-RP',
  version: '1.0.0',
  description:
    'Tests whether asymmetric repetition under defined spatial geometry consumes conditioning influence and destabilizes competing entity bindings beyond simple semantic emphasis.',
  technicalLayer: 'CONTEXT',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Repeated occurrences of a semantic token cluster increase its presence across multi-head cross-attention keys/queries, disproportionately drawing conditioning capacity away from non-repeated companion concepts without requiring high semantic weight syntax.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis:
        'Repeated occurrences of a semantic token cluster increase its presence across cross-attention keys/queries, drawing capacity from companion concepts.',
      rationale: 'Initial Job 3 formulation for redundancy pressure.',
    },
  ],

  expectedFailureSurfaces: [
    'ATTRIBUTE_ORPHANED',
    'ENTITY_SPLIT',
    'PHANTOM_HOST_CREATED',
    'UNREQUESTED_SYMMETRY',
    'BACKGROUND_INHERITANCE',
  ],

  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    repetitionCount: {
      name: 'repetitionCount',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 12,
      step: 1,
      description: 'Number of times the target concept is echoed across the prompt.',
    },
    repetitionPattern: {
      name: 'repetitionPattern',
      type: 'select',
      defaultValue: 'EVENLY_SPACED',
      options: [
        'CONTIGUOUS',
        'EVENLY_SPACED',
        'FRONT_LOADED',
        'BACK_LOADED',
        'EXPANDING_INTERVALS',
      ],
      description: 'Spatial distribution of repetitions across the context sequence.',
    },
    targetUnitRole: {
      name: 'targetUnitRole',
      type: 'select',
      defaultValue: 'ENTITY',
      options: ['ENTITY', 'ATTRIBUTE', 'RECENCY_MODIFIER'],
      description: 'Which semantic component receives the redundancy amplification.',
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
    parameter: 'repetitionCount',
    sweepType: 'discrete',
    values: [1, 2, 4, 6, 8],
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Repetition count and spatial distribution pattern of target concept',
    heldConstant: 'Semantic inventory of companion concepts, model, random seed',
    hypothesisTested: 'Asymmetric repetition cannibalizes cross-attention capacity from companion concepts.',
    weakeningCondition: 'Repetition produces linear semantic intensity without altering scene balance.',
    falsificationCondition:
      'If repetition produces purely linear semantic intensification without altering spatial arrangement, binding stability, or competing attributes.',
    negativeControlDescription:
      'Length-matched control: replace repeated tokens with neutral filler of identical length. Paraphrase control: replace repetition with a single intensified adjective.',
  },
  tags: ['context', 'attention', 'repetition', 'geometry'],
};

// ==========================================
// 3. OPERATOR EXECUTION HELPERS
// ==========================================

export interface RbcAsExecutionOptions {
  separationStrength?: number; // 0.0 to 1.0
  interveningContextDensity?: number; // 0.1 to 1.0
  distractorFamily?: DistractorBlockConfig['family'];
  primacyRecencyStrategy?: PrimacyRecencyStrategy;
  seed?: number;
}

export function executeRbcAsMutation(
  canonicalPrompt: string,
  options: RbcAsExecutionOptions = {},
  backend?: TechnicalBackendCapabilities
): RenderedContextResult {
  const units = decomposePromptToSemanticUnits(canonicalPrompt);
  const separationStrength = options.separationStrength ?? 0.6;
  const density = options.interveningContextDensity ?? 0.5;
  const family = options.distractorFamily ?? 'WEAK_CONCEPTS';
  const strategy = options.primacyRecencyStrategy ?? 'PRIMACY_RECENCY_SPLIT';
  const seed = options.seed ?? 1337;

  // Calculate length budget based on separation strength
  // 0.0 = 0 words distractor (adjacent)
  // 1.0 = ~40 words distractor
  const lengthBudgetWords = Math.round(separationStrength * 40);

  const plan: ContextLayoutPlan = {
    planId: `plan_rbc_${Date.now()}`,
    operatorId: OPERATOR_RBC_AS.id,
    canonicalPrompt,
    units,
    primacyRecencyStrategy: separationStrength === 0.0 ? 'ENTITY_PRIMACY' : strategy,
    distractorConfig:
      separationStrength > 0.0
        ? {
            family,
            density,
            semanticDiversity: 'moderate',
            repetition: false,
            lengthBudgetWords,
            distributionPattern: 'clustered_mid',
            seed,
          }
        : undefined,
    seed,
  };

  return renderContextLayout(plan, backend);
}

export interface AcRpExecutionOptions {
  repetitionCount?: number;
  repetitionPattern?: RepetitionGeometryConfig['pattern'];
  seed?: number;
}

export function executeAcRpMutation(
  canonicalPrompt: string,
  options: AcRpExecutionOptions = {},
  backend?: TechnicalBackendCapabilities
): RenderedContextResult {
  const units = decomposePromptToSemanticUnits(canonicalPrompt);
  const count = options.repetitionCount ?? 4;
  const pattern = options.repetitionPattern ?? 'EVENLY_SPACED';
  const seed = options.seed ?? 42;

  const plan: ContextLayoutPlan = {
    planId: `plan_acrp_${Date.now()}`,
    operatorId: OPERATOR_AC_RP.id,
    canonicalPrompt,
    units,
    repetitionConfig: {
      pattern,
      repetitionCount: count,
    },
    seed,
  };

  return renderContextLayout(plan, backend);
}
