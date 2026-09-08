/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 3: Context Budget, Layout & Binding Failure Type Definitions
 * 
 * CORE CONTRACT:
 * - Represents prompts as structured semantic units with explicit binding metadata.
 * - Manipulates relative position, primacy, recency, intervening context density, and repetition geometry.
 * - Does NOT overwrite canonical semantic representation; produces rendered machine sequence.
 * - Distinguishes observable measurements (character/byte distance, relative %) from instrumented token metrics.
 * - Captures binding observation outcomes (BOUND_CORRECTLY, ATTRIBUTE_ORPHANED, PHANTOM_HOST_CREATED, etc.).
 */

import { TechnicalModality, ExecutionTier, TechnicalScores } from './technicalCore';

// ==========================================
// 1. SEMANTIC ROLES & SEMANTIC UNITS
// ==========================================

export type SemanticUnitRole =
  | 'ENTITY'
  | 'ATTRIBUTE'
  | 'MATERIAL'
  | 'TOPOLOGY'
  | 'ACTION'
  | 'REFERENCE_ANCHOR'
  | 'RELATIONAL_CONSTRAINT'
  | 'DISTRACTOR'
  | 'REPETITION_ECHO'
  | 'RECENCY_MODIFIER'
  | 'PRIMACY_ANCHOR';

export interface SemanticUnit {
  /** Unique ID within the context plan (e.g. 'unit_entity_1', 'unit_attr_obsidian') */
  id: string;
  /** Human semantic content text */
  semanticContent: string;
  /** Functional role within the context layout */
  role: SemanticUnitRole;
  /** Original zero-indexed sequence in the canonical prompt */
  originalOrder: number;
  /** Assigned sequence order in the experimental layout */
  experimentalOrder: number;
  /** Number of times this unit is repeated in the context */
  repetitionCount: number;
  /** Optional grouping identifier for composite phrases */
  grouping?: string;
  /** Explicit entity target ID that this modifier/attribute is intended to bind to */
  bindsTo?: string;
  /** Custom metadata or tags */
  metadata?: Record<string, any>;
}

// ==========================================
// 2. POSITIONAL MODES & LAYOUT PRIMITIVES
// ==========================================

export type ContextPositionMode =
  | 'ORIGINAL'
  | 'PRIMACY'
  | 'EARLY'
  | 'MIDDLE'
  | 'LATE'
  | 'RECENCY'
  | 'DEFERRED_DEFINITION';

export type PrimacyRecencyStrategy =
  | 'ENTITY_PRIMACY'
  | 'MODIFIER_PRIMACY'
  | 'ENTITY_RECENCY'
  | 'MODIFIER_RECENCY'
  | 'PRIMACY_RECENCY_SPLIT'
  | 'HANDOFF_SPLIT';

// ==========================================
// 3. REPETITION GEOMETRY
// ==========================================

export type RepetitionGeometryPattern =
  | 'CONTIGUOUS'
  | 'EVENLY_SPACED'
  | 'FRONT_LOADED'
  | 'BACK_LOADED'
  | 'EXPANDING_INTERVALS'
  | 'CUSTOM';

export interface RepetitionGeometryConfig {
  pattern: RepetitionGeometryPattern;
  repetitionCount: number;
  echoStrength?: number;
  customIntervals?: number[];
}

// ==========================================
// 4. DISTRACTOR & INTERVENING MASS
// ==========================================

export type DistractorFamily =
  | 'WEAK_CONCEPTS'
  | 'POLYSEMANTIC_TERMS'
  | 'UNRELATED_MATERIALS'
  | 'SECONDARY_RELATIONS'
  | 'LOW_PRIORITY_STRUCTURAL'
  | 'REPEATED_NEUTRAL';

export interface DistractorBlockConfig {
  family: DistractorFamily;
  density: number; // 0.0 to 1.0
  semanticDiversity: 'low' | 'moderate' | 'high';
  repetition: boolean;
  lengthBudgetWords: number;
  distributionPattern: 'clustered_mid' | 'dispersed' | 'gradient_falloff';
  seed?: number;
}

// ==========================================
// 5. BINDING OBSERVATION STATES
// ==========================================

export type BindingObservationState =
  | 'BOUND_CORRECTLY'
  | 'PARTIAL_BINDING'
  | 'ATTRIBUTE_SPLIT'
  | 'ATTRIBUTE_LEAKAGE'
  | 'ATTRIBUTE_REASSIGNED'
  | 'ATTRIBUTE_ORPHANED'
  | 'PHANTOM_HOST_CREATED'
  | 'ENTITY_SPLIT'
  | 'ATTRIBUTE_DROPPED'
  | 'AMBIGUOUS'
  | 'NO_OBSERVABLE_EFFECT';

export type ContextStressState =
  | 'UNDERPRESSURED'
  | 'PRODUCTIVE_TENSION'
  | 'OVERPRESSURED'
  | 'CONTEXT_COLLAPSE';

export interface BindingEvaluationRecord {
  modifierUnitId: string;
  targetEntityId: string;
  observedState: BindingObservationState;
  hostDescription?: string; // Where did the attribute end up? (e.g. 'secondary background arch')
  confidence: number; // 0.0 to 1.0
  notes?: string;
}

// ==========================================
// 6. CONTEXT METRICS & RENDERED PAYLOAD
// ==========================================

export interface ContextLayoutMetrics {
  totalCharacterCount: number;
  totalByteCount: number;
  totalWordCount: number;
  unitCount: number;

  /** Relative position percentages (0.0 to 1.0) of key units */
  unitPositions: Record<string, {
    charStart: number;
    charEnd: number;
    relativePercentStart: number;
    relativePercentEnd: number;
  }>;

  /** Physical character distance between entity and modifier */
  separationCharDistance: number;
  separationWordDistance: number;
  interveningWordsCount: number;

  /** Estimated context stress */
  contextStress: ContextStressState;
  estimatedRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CONTEXT_LIMIT_EXCEEDED';

  /** Instrumented Tier metrics (populated when tokenizer access exists) */
  instrumentedMetrics?: {
    tokenCount: number;
    entityTokenSpan?: [number, number];
    modifierTokenSpan?: [number, number];
    tokenDistance?: number;
    contextFractionConsumed: number;
    isTruncated: boolean;
    truncationPosition?: number;
  };
}

export interface ContextLayoutPlan {
  planId: string;
  operatorId: string;
  canonicalPrompt: string;
  units: SemanticUnit[];
  primacyRecencyStrategy?: PrimacyRecencyStrategy;
  distractorConfig?: DistractorBlockConfig;
  repetitionConfig?: RepetitionGeometryConfig;
  limits?: {
    maxTotalCharacters?: number;
    maxInterveningWords?: number;
  };
  seed: number;
}

export interface RenderedContextResult {
  /** The untouched canonical prompt */
  canonicalPrompt: string;
  /** The final machine-facing rendered context string */
  renderedMachinePrompt: string;
  /** Plan and units used */
  plan: ContextLayoutPlan;
  /** Computed observable & instrumented metrics */
  metrics: ContextLayoutMetrics;
  /** Diagnostic warnings or composition flags */
  warnings: string[];
}

// ==========================================
// 7. PRESET IDENTIFIERS FOR JOB 3
// ==========================================

export type ContextPresetId =
  | 'RBC_DISTANCE_SWEEP'
  | 'RBC_DISTRACTOR_DENSITY_SWEEP'
  | 'BINDING_ADJACENCY_CONTROL'
  | 'ACRP_REPETITION_COUNT_SWEEP'
  | 'ACRP_REPETITION_GEOMETRY_COMPARISON'
  | 'PRIMACY_RECENCY_INVERSION'
  | 'DEFERRED_ENTITY_TEST'
  | 'HANDOFF_SPLIT_TEST'
  | 'LENGTH_MATCHED_CONTROL';

export interface ContextPreset {
  id: ContextPresetId;
  name: string;
  shortDescription: string;
  operatorId: string;
  recommendedModality: TechnicalModality;
  notes: string;
}
