/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 7: Experiment Memory & Empirical Learning Layer
 * 
 * CORE PRINCIPLE:
 * DAVID must become an experimental notebook, not a superstition generator.
 * A strange result is valuable.
 * A repeatable strange result is more valuable.
 * A repeatable strange result with a plausible mechanism, controls,
 * and known model dependence becomes an actual DAVID technique.
 * 
 * Separate Creative Utility from Mechanism Confidence.
 * Never self-delude: Separate HYPOTHESIS from OBSERVED FACT.
 */

import { ContentDNA } from './contentDna';
import { TargetEngine } from '../types';

// ==========================================
// 1. QUALITATIVE SCALES (NO FAKE PRECISION)
// ==========================================

export type QualitativeRating = 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH';

export type EvidenceTier =
  | 'ASSUMED'        // 0 empirical runs; static prior/assumption
  | 'ANECDOTAL'      // 1-2 runs observed
  | 'OBSERVED'       // 3-5 runs observed with consistent trend
  | 'REPEATED'       // 6-9 runs with verified reproducibility
  | 'HIGH CONFIDENCE'; // 10+ runs with robust evidence & controls

// ==========================================
// 2. USER FEEDBACK JUDGMENTS (FIRST-CLASS DATA)
// ==========================================

export type UserFeedbackJudgment =
  | 'LOVE IT'
  | 'INTERESTING'
  | 'MEH'
  | 'BORING'
  | 'TOO NORMAL'
  | 'TOO DESTROYED'
  | 'LOST THE SUBJECT'
  | 'GOOD ACCIDENT'
  | 'KEEP THIS ERROR'
  | 'DO THIS HARDER'
  | 'DO THIS LESS'
  | 'NEVER AGAIN';

export const USER_FEEDBACK_OPTIONS: readonly UserFeedbackJudgment[] = [
  'LOVE IT',
  'INTERESTING',
  'GOOD ACCIDENT',
  'KEEP THIS ERROR',
  'DO THIS HARDER',
  'DO THIS LESS',
  'MEH',
  'BORING',
  'TOO NORMAL',
  'TOO DESTROYED',
  'LOST THE SUBJECT',
  'NEVER AGAIN',
] as const;

// ==========================================
// 3. STRUCTURED OUTCOMES (OBSERVABLE BEHAVIOR)
// ==========================================

export type ObservedOutcomeType =
  | 'success'
  | 'partial_success'
  | 'failure'
  | 'catastrophic_collapse'
  | 'interesting_accident'
  | 'cliche_collapse'
  | 'seed_erased'
  | 'identity_drift'
  | 'topology_drift'
  | 'attribute_leakage'
  | 'background_leakage'
  | 'material_substitution'
  | 'object_substitution'
  | 'temporal_smear'
  | 'continuity_failure'
  | 'occlusion_failure'
  | 'phantom_structures'
  | 'orphan_attributes'
  | 'recursive_artifact'
  | 'genre_collapse'
  | 'rhythmic_compensation'
  | 'timbral_collapse'
  | 'phonetic_artifact'
  | 'spectral_artifact'
  | 'unexpected_emergent_structure';

export const ALL_OBSERVED_OUTCOMES: readonly ObservedOutcomeType[] = [
  'success',
  'partial_success',
  'failure',
  'catastrophic_collapse',
  'interesting_accident',
  'cliche_collapse',
  'seed_erased',
  'identity_drift',
  'topology_drift',
  'attribute_leakage',
  'background_leakage',
  'material_substitution',
  'object_substitution',
  'temporal_smear',
  'continuity_failure',
  'occlusion_failure',
  'phantom_structures',
  'orphan_attributes',
  'recursive_artifact',
  'genre_collapse',
  'rhythmic_compensation',
  'timbral_collapse',
  'phonetic_artifact',
  'spectral_artifact',
  'unexpected_emergent_structure',
] as const;

// ==========================================
// 4. PRESERVED ARTIFACTS & ARTIFACT FAMILIES
// ==========================================

export type ArtifactAction = 'PRESERVE' | 'AMPLIFY' | 'IGNORE' | 'AVOID';

export interface PreservedArtifactEntry {
  id: string;
  name: string;
  action: ArtifactAction;
  description?: string;
  familyId?: string;
  observedInModel: string;
  targetMedium: 'image' | 'video' | 'audio' | string;
  associatedOperators: string[];
  firstObservedRunId: string;
  timestamp: string;
  userNotes?: string;
}

export interface ArtifactFamily {
  id: string;
  name: string; // e.g. 'connective tissue bloom', 'screen-space pinning', 'topology scar', 'temporal ghost'
  description: string;
  modelsObserved: string[];
  media: string[];
  associatedOperators: string[];
  confidence: EvidenceTier;
  amplificationMethods: string[];
  destructiveConditions: string[];
  representativeNotes: string[];
}

export const DEFAULT_ARTIFACT_FAMILIES: ArtifactFamily[] = [
  {
    id: 'connective_tissue_bloom',
    name: 'Connective Tissue Bloom',
    description:
      'Organic or mechanical filigree blooming between disconnected spatial components, fusing distinct entity boundaries without melting semantic identity.',
    modelsObserved: ['Flux.1 Dev', 'Midjourney v6', 'OpenArt SDXL'],
    media: ['image', 'video'],
    associatedOperators: ['scale_schism', 'recursive_reversal', 'orthogonal_stabilizer'],
    confidence: 'OBSERVED',
    amplificationMethods: [
      'Increase structural stabilizer weight',
      'Bind with fibrous or crystalline material anchor',
    ],
    destructiveConditions: ['Excessive entropy > 9', 'Unconstrained semantic hop without locks'],
    representativeNotes: ['Creates high-tension structural webbing rather than blurry noise.'],
  },
  {
    id: 'topology_scar',
    name: 'Topology Scar',
    description:
      'Sharp visible seams or geometric shearing along non-Euclidean fold boundaries where two incompatible spatial manifolds meet.',
    modelsObserved: ['Flux.1 Dev', 'OpenArt SDXL'],
    media: ['image'],
    associatedOperators: ['non_euclidean_shear', 'boundary_dislocation'],
    confidence: 'OBSERVED',
    amplificationMethods: [
      'Introduce orthogonal perspective conflict',
      'Enforce razor-thin boundary constraints',
    ],
    destructiveConditions: ['High smoothing prompts', 'Generic photographic style descriptors'],
    representativeNotes: ['Preserves the exact fault-line of the prompt paradox.'],
  },
  {
    id: 'temporal_ghost',
    name: 'Temporal Ghosting / Smear',
    description:
      'An entity exists simultaneously at multiple progressive transformation states across a single visual frame or audio phrase.',
    modelsObserved: ['Runway Gen-3', 'Luma Dream Machine', 'Suno v3.5'],
    media: ['video', 'audio'],
    associatedOperators: ['temporal_contradiction', 'chronos_shear'],
    confidence: 'REPEATED',
    amplificationMethods: [
      'Direct conflicting sequence cues into consecutive sentences',
      'Strobe rhythm anchoring',
    ],
    destructiveConditions: ['Strict camera lock prompts', 'Homogeneous frame pacing'],
    representativeNotes: ['Highly prized in cinematic horror and experimental sound design.'],
  },
  {
    id: 'sub_bass_flanging',
    name: 'Spectral Over-Resonance',
    description:
      'Sub-harmonic acoustic phase interaction occurring when contradictory timbral descriptions are locked to the same tempo channel.',
    modelsObserved: ['Suno v3.5', 'Suno v4'],
    media: ['audio'],
    associatedOperators: ['timbral_polarization', 'frequency_collision'],
    confidence: 'HIGH CONFIDENCE',
    amplificationMethods: [
      'Contrast ultra-dry acoustic instruments with infinite-reverb cavernous synthesis',
    ],
    destructiveConditions: ['Overly generic genre headers like [Pop] or [EDM]'],
    representativeNotes: ['Generates physical low-end weight without synthetic distortion.'],
  },
];

// ==========================================
// 5. EXPERIMENT RUN RECORD SCHEMA (JOB 7)
// ==========================================

export interface OperatorInteractionStepRecord {
  step: number;
  operatorName: string;
  action: string;
  consequence: string;
  targetAffected?: string;
}

export interface EmpiricalRunRecord {
  // Identification & Lineage
  runId: string;
  timestamp: string;
  parentRunId?: string | null;
  iterationDepth: number;

  // Environment & Model Target
  targetMedium: 'image' | 'video' | 'audio' | string;
  targetEngine?: TargetEngine | string;
  provider: string;
  model: string;
  modelVersion?: string;

  // Inputs & Intent
  sourcePrompt: string; // Seed intent
  contentDnaSnapshot?: ContentDNA;
  lockedAnchors: string[];
  activeAttractors: string[];
  activeOperators: string[];
  operatorInteractionChain?: OperatorInteractionStepRecord[];
  mutationIntensity: number;

  // Translations & Fingerprints
  targetSpecificTranslation?: Record<string, any> | string;
  modelFingerprintUsed?: Record<string, any>;
  easyOutBlockersUsed?: string[];
  referenceAssets?: string[];
  generationSettings?: Record<string, any>;

  // Outputs
  literalPrompt?: string;
  slopPrompt?: string;
  outputMediaUri?: string;

  // Outcomes & Observations (Multiple allowed)
  outcomes: ObservedOutcomeType[];
  preservedArtifacts: PreservedArtifactEntry[];

  // User Evaluation & Rigorous Separation
  userFeedback?: UserFeedbackJudgment;
  creativeUtility: QualitativeRating;       // Did it produce something interesting/useful/beautiful/grotesque?
  mechanismConfidence: QualitativeRating;   // How confident are we the operator caused it?
  
  // Epistemic Safeguard (Section 15)
  hypothesis?: string;                      // What we think might be happening (Speculative)
  observedFacts?: string;                   // Observable generated result (Empirical)

  // Ablation Tracking (Section 8)
  isAblation?: boolean;
  ablationOfRunId?: string;
  ablationRemovedElement?: string;
  ablationArtifactSurvives?: boolean;

  // Corrections & Flagging (Section 16)
  excludeFromLearning: boolean;             // For junk tests, accidental settings, or runs user doesn't want in profiles
  userCorrectionNotes?: string;
  notes?: string;
}

// ==========================================
// 6. REPEATABILITY & AGGREGATION RECORDS
// ==========================================

export interface RepeatabilityRecord {
  operatorId: string;
  modelId: string;
  attempts: number;
  successes: number;
  partialSuccesses: number;
  failures: number;
  dominantFailureModes: string[];
  interestingAccidentFrequency: number;
  preservedArtifactFrequency: number;
  seedErasureFrequency: number;
  easyOutFrequency: number;
  approximateRepeatability: QualitativeRating;
  confidenceProgression: EvidenceTier;
  lastUpdated: string;
}

export type InteractionSequenceTag =
  | 'productive_pair'
  | 'destructive_pair'
  | 'strong_sequence'
  | 'seed_killing_sequence'
  | 'artifact_producing_sequence'
  | 'model_specific_sweet_spot'
  | 'unknown';

export interface InteractionMemoryRecord {
  sequenceKey: string; // e.g. "semantic_hop -> scale_schism"
  operators: string[];
  isOrdered: boolean;
  attempts: number;
  behaviorTag: InteractionSequenceTag;
  modelId: string;
  notes: string[];
  lastObserved: string;
}

export interface QualitativeSweetSpot {
  operatorId: string;
  modelId: string;
  qualitativeBand: 'LOW' | 'MEDIUM' | 'HIGH' | 'NARROW_WINDOW' | 'UNSTABLE_ABOVE' | 'COLLAPSES_OUTSIDE_RANGE';
  observedRange?: string; // e.g. "entropy 6-8, guidance 7-9"
  notes: string;
}

// ==========================================
// 7. DYNAMIC MODEL PROFILE EVIDENCE
// ==========================================

export interface ModelEvidenceDimension {
  dimension: string; // e.g. "contradictionSurvival", "topologyTolerance", "referenceDominance", "attributeBinding", "promptSaturationRisk"
  currentAssumed: string;
  empiricallyObserved: string;
  evidenceTier: EvidenceTier;
  relevantRunCount: number;
  notes: string;
}

export interface ModelProfileEvidenceReport {
  modelId: string;
  totalRuns: number;
  usefulRunsCount: number;
  dimensions: Record<string, ModelEvidenceDimension>;
  dominantFailureModes: string[];
  knownArtifactFamilies: string[];
  userOverrides: Record<string, string>;
  lastUpdated: string;
}

// ==========================================
// 8. RECOMMENDATIONS & PLANNING ADVICE
// ==========================================

export type RecommendationType =
  | 'repeat_recipe'
  | 'change_one_variable'
  | 'test_another_model'
  | 'amplify_artifact'
  | 'run_ablation'
  | 'adjust_mutation_strength'
  | 'reverse_operator_order'
  | 'reuse_as_reference';

export interface ExperimentRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  reason: string;
  evidenceSource: string; // Grounded in run IDs or empirical evidence
  suggestedAction: {
    operators?: string[];
    attractors?: string[];
    modelId?: string;
    entropyDelta?: number;
    referencePrompt?: string;
    ablationTarget?: string;
  };
}

export interface EmpiricalPlanningAdvice {
  hasEmpiricalData: boolean;
  recommendedOperators: string[];
  cautionedOperators: string[];
  recommendedOperatorOrder?: string[];
  sweetSpotEntropy?: number;
  availablePreservedArtifacts: PreservedArtifactEntry[];
  rationale: string[];
}
