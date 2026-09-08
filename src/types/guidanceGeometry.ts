/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry — Core Competing Forces Types
 * 
 * Ceases treating "guidance" as a single generic scalar intensity slider.
 * Formulates guidance as a vector space of competing conceptual forces:
 * - PRIMARY ATTRACTOR A
 * - PRIMARY ATTRACTOR B
 * - STRUCTURAL / RELATIONAL FORCE
 * - IDENTITY ANCHOR
 * - MATERIAL FORCE
 * 
 * Supports both Direct Control (for controllable pipelines) and
 * Serialized Approximation (for black-box commercial models).
 */

import { TechnicalModality } from './technicalCore';

// ==========================================
// 1. EXECUTION MODES
// ==========================================

export type GuidanceExecutionMode = 'DIRECT_MODEL_CONTROL' | 'SERIALIZED_APPROXIMATION';

// ==========================================
// 2. CONCEPTUAL FORCE CHANNELS
// ==========================================

export interface ConceptualForceChannels {
  primaryAttractorA: {
    label: string;
    concept: string;
    weight: number; // 0.0 - 1.0
    structuralManifestations: string[];
  };
  primaryAttractorB: {
    label: string;
    concept: string;
    weight: number; // 0.0 - 1.0
    structuralManifestations: string[];
  };
  structuralForce: {
    weight: number; // 0.0 - 1.0
    invariants: string[];
    compulsionRule: string;
  };
  identityAnchor: {
    subject: string;
    weight: number; // 0.0 - 1.0
    isAnchored: boolean;
  };
  materialForce: {
    pressure: string;
    weight: number; // 0.0 - 1.0
    mediumResistance: string;
  };
}

// ==========================================
// 3. OPERATOR CONFIGURATIONS
// ==========================================

export type AttractorBalanceMode =
  | 'A_DOMINANT'
  | 'B_DOMINANT'
  | 'NEAR_EQUILIBRIUM'
  | 'RANDOMIZED_EQUILIBRIUM';

export interface AttractorBalanceConfig {
  attractorA: string;
  attractorAWeight: number; // 0.0 - 1.0
  attractorB: string;
  attractorBWeight: number; // 0.0 - 1.0
  balanceMode: AttractorBalanceMode;
  competitionStrength: number; // 0.0 - 1.0
  persistBoth: boolean; // default true
  preserveNonCategoricalStructure: boolean;
}

export type TaxonomicAmbiguityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CategoricalCancellationConfig {
  categorySuppression: number; // 0.0 - 1.0 (weakens category identity)
  structuralCompulsion: number; // 0.0 - 1.0 (strengthens physics / relations)
  categoryPairCount: 1 | 2 | 3;
  taxonomicAmbiguity: TaxonomicAmbiguityLevel;
  suppressedCategories: string[];
  compulsoryStructures: string[];
}

export type StructuralInvariantType =
  | 'CONTINUOUS_BOUNDARY'
  | 'CONSERVED_TOPOLOGY'
  | 'PRESERVED_SILHOUETTE'
  | 'PRESSURE_BALANCE'
  | 'HINGE_COUNT'
  | 'SYMMETRY_COUNT'
  | 'RHYTHMIC_GRID'
  | 'MOTION_TRAJECTORY'
  | 'FIXED_FRAME_OCCUPANCY'
  | 'CONNECTED_REGIONS';

export type InvariantStrictness = 'LOOSE' | 'MODERATE' | 'STRICT' | 'AXIOMATIC';

export interface OrthogonalStabilizerConfig {
  stabilizerStrength: number; // 0.0 - 1.0
  structuralInvariantType: StructuralInvariantType;
  invariantCount: number; // 1 - 5
  strictness: InvariantStrictness;
  targetModality: TechnicalModality;
  customInvariantSpec?: string;
}

export type GuidanceAsymmetryPreset =
  | 'ANCHOR_DOMINANT'
  | 'MATERIAL_POSSESSION'
  | 'STRUCTURE_OVER_CATEGORY'
  | 'CATEGORY_CIVIL_WAR'
  | 'CUSTOM';

export interface GuidanceAsymmetryConfig {
  primaryWeight: number; // 0.0 - 1.0
  secondaryWeight: number; // 0.0 - 1.0
  structuralWeight: number; // 0.0 - 1.0
  identityWeight: number; // 0.0 - 1.0
  materialWeight: number; // 0.0 - 1.0
  presetType?: GuidanceAsymmetryPreset;
}

export type SaddleEscapeResponse =
  | 'ALLOW_COLLAPSE'
  | 'REBALANCE'
  | 'FLIP_DOMINANCE'
  | 'REINFORCE_STRUCTURE';

export interface SaddleTrapConfig {
  abBalance: number; // 0.0 - 1.0 (0.50 = center saddle)
  structuralForce: number; // 0.0 - 1.0
  saddleWidth: number; // 0.05 - 0.50 (narrowness of equilibrium band)
  driftTolerance: number; // 0.0 - 1.0
  escapeResponse: SaddleEscapeResponse;
  escapeHistory?: Array<{
    timestamp: number;
    driftDirection: 'TOWARDS_A' | 'TOWARDS_B' | 'STABLE_SADDLE';
    driftMagnitude: number;
    actionTaken: string;
  }>;
}

// ==========================================
// 4. CORE PRESETS
// ==========================================

export type GuidanceGeometryPresetId =
  | 'PRESET_CATEGORY_CIVIL_WAR'
  | 'PRESET_TAXONOMY_OFFLINE'
  | 'PRESET_SADDLE_MONSTER'
  | 'PRESET_MATERIAL_POSSESSION';

export interface GuidanceGeometryPreset {
  id: GuidanceGeometryPresetId;
  name: string;
  tagline: string;
  description: string;
  forces: ConceptualForceChannels;
  balanceConfig: AttractorBalanceConfig;
  cancellationConfig: CategoricalCancellationConfig;
  stabilizerConfig: OrthogonalStabilizerConfig;
  asymmetryConfig: GuidanceAsymmetryConfig;
  saddleConfig: SaddleTrapConfig;
}

// ==========================================
// 5. FAILURE MODES & DETECTOR
// ==========================================

export type GuidanceFailureMode =
  | 'CONCEPT_DOMINANCE'
  | 'GENERIC_HYBRID'
  | 'STRUCTURAL_COLLAPSE'
  | 'UNCONDITIONED_REGRESSION'
  | 'CONDITION_DROP';

export interface GuidanceFailureEvaluation {
  failureMode: GuidanceFailureMode | null;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0.0 - 1.0 (higher = worse failure)
  title: string;
  diagnosis: string;
  evidence: string[];
  recommendations: Array<{
    action: string;
    targetParameter: string;
    suggestedAdjustment: string;
  }>;
}

// ==========================================
// 6. INSPECTION & SYNTHESIS OUTPUT
// ==========================================

export interface GuidanceGeometryInspectionReport {
  executionMode: GuidanceExecutionMode;
  targetModality: TechnicalModality;
  
  // Forces Readout
  forces: ConceptualForceChannels;
  dominantForce: 'ATTRACTOR_A' | 'ATTRACTOR_B' | 'STRUCTURE' | 'IDENTITY' | 'MATERIAL' | 'EQUILIBRIUM';
  balanceState:
    | 'EQUILIBRIUM'
    | 'A_DOMINANT'
    | 'B_DOMINANT'
    | 'STRUCTURE_DOMINANT'
    | 'MATERIAL_DOMINANT'
    | 'COLLAPSED_UNRESOLVED';

  // Specific Checks
  didOneAttractorGetDropped: boolean;
  didOutputCollapseIntoGenericMixture: boolean;
  didStructuralInvariantSurvive: boolean;
  didNewIntermediateFormAppear: boolean;

  // Equilibrium Metrics
  attractorSeparation: number; // 0.0 - 1.0
  saddleRetentionScore: number; // 0.0 - 1.0
  structuralStabilityMargin: number; // 0.0 - 1.0

  // Diagnostics & Failures
  activeFailures: GuidanceFailureEvaluation[];

  // Rendered Output
  renderedPrompt: string;
  directControlSpec?: {
    channelWeights: Record<string, number>;
    cfgVectorSplit?: Record<string, number>;
    negativeChannels?: string[];
  };
  serializedApproximationSpec: {
    independentStructuralConsequences: string[];
    synthesizedConstraintBlocks: string[];
    invariantEnforcementClauses: string[];
    intermediateFormDescription: string;
  };
}

// Re-export Job 5B Content DNA & Live Mutation Synthesis Types
export * from './contentDna';
