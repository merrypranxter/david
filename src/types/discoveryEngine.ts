/**
 * DAVID — EXPERIMENTAL DISCOVERY ENGINE (Job 8)
 * Type Definitions & Schemas
 * 
 * Defines the core schemas for:
 * - Observable failure taxonomy (30 standard empirical observations)
 * - Structured experiment records with Hypothesis, Tension, Control, Ablation
 * - Dose-response sweeps & operator interaction experiments
 * - Discovery procedural recipes (not just prompt text)
 * - Operator promotion with experimental origin tracking
 * - Strict decoupling of Creative Value vs Mechanism Confidence
 */

import { TargetEngine } from '../types';
import { QualitativeRating, EvidenceTier } from './empiricalLearning';

// ==========================================
// 1. OBSERVABLE FAILURE TAXONOMY (SECTION 7)
// ==========================================

export const OBSERVABLE_ARTIFACT_TAGS = [
  'identity drift',
  'identity splitting',
  'attribute leakage',
  'orphan attribute',
  'topology instability',
  'boundary leakage',
  'material substitution',
  'shape substitution',
  'hallucinated connective tissue',
  'repetition as repair',
  'semantic drift',
  'structural compensation',
  'temporal smearing',
  'object permanence failure',
  'feature reassignment',
  'occlusion mutation',
  'scale leakage',
  'texture takeover',
  'compression semanticization',
  'recursive artifact growth',
  'phoneme/instrument confusion',
  'timbre collapse',
  'rhythmic compensation',
  'spectral artifact',
  'phase ambiguity',
  'genre collapse',
  'form collapse',
  'unexpected stable hybrid',
  'new attractor',
  'other',
] as const;

export type ObservableArtifactTag = (typeof OBSERVABLE_ARTIFACT_TAGS)[number];

// ==========================================
// 2. RATINGS & EVALUATION SEPARATION (SECTION 11)
// ==========================================

export type DiscoveryUserRating = 'BORING' | 'BROKEN BAD' | 'INTERESTING' | 'JACKPOT';

export type CreativeValueTier = 'boring' | 'interesting' | 'jackpot';

export type MechanismConfidenceTier = 'speculative' | 'plausible' | 'repeated' | 'strong';

// ==========================================
// 3. EXPERIMENT HYPOTHESIS SCHEMA (SECTION 4)
// ==========================================

export interface ExperimentHypothesis {
  /** Concise statement of what mechanism is being tested */
  hypothesis: string;
  /** The competing forces or boundary conflicts being placed in opposition */
  tension: string;
  /** What is removed or neutralized to isolate causality from luck */
  control: string;
  /** What happens when the stabilizing anchor is removed */
  ablation: string;
  /** Expected concrete visual/auditory/temporal artifacts if hypothesis holds */
  expectedFailure: string;
}

// ==========================================
// 4. EXPERIMENTAL VARIANT SCHEMA
// ==========================================

export type DiscoveryVariantRole =
  | 'control'
  | 'experimental'
  | 'dose_sweep'
  | 'interaction'
  | 'ablation'
  | 'order_test'
  | 'reproduction';

export interface DiscoveryVariant {
  id: string;
  label: string;
  role: DiscoveryVariantRole;
  isControl: boolean;
  
  // Controlled Variables
  operators: string[];
  operatorOrder: string[];
  operatorStrengths: Record<string, number | string>;
  mutationIntensity: number;
  anchorPreservation: 'hard' | 'soft' | 'none';
  doseLevel?: 'CONTROL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMAL';
  
  // Target & Modality
  targetMedium: 'image' | 'video' | 'audio';
  targetEngine: TargetEngine | string;
  modelProfile: string;
  
  // Description & Formulated Prompt
  description: string;
  promptText: string;
  negativePrompt?: string;
  structuralNotes?: string[];
  
  // Empirical Feedback & Observed Artifacts
  userRating?: DiscoveryUserRating;
  taggedArtifacts: ObservableArtifactTag[];
  customObservations?: string;
  evaluatedAt?: string;
}

// ==========================================
// 5. STRUCTURED EXPERIMENT RECORD (SECTION 3)
// ==========================================

export type ExperimentType =
  | 'dose_sweep'
  | 'operator_interaction'
  | 'anchor_ablation'
  | 'order_path_dependency'
  | 'media_transduction'
  | 'custom_bounded';

export interface ExperimentRecord {
  id: string;
  timestamp: string;
  title: string;
  sourceIntent: string;
  targetMedium: 'image' | 'video' | 'audio';
  targetEngine: TargetEngine | string;
  targetModelProfile: string;
  experimentType: ExperimentType;

  // Theoretical Framing (Section 4)
  hypothesis: ExperimentHypothesis;
  variablesChanged: string[];
  variablesHeldConstant: string[];

  // Operators & Execution Settings
  operators: string[];
  operatorOrder: string[];
  strengths: Record<string, number | string>;
  iterationSettings: {
    depth: number;
    feedbackReconditioning?: boolean;
    seedVariation?: boolean;
  };

  // Variants (Always 1 Control + Bounded Set)
  controlVariant: DiscoveryVariant;
  experimentalVariants: DiscoveryVariant[];

  // Observed Results & Interaction Findings
  observedResult?: string;
  userRating?: DiscoveryUserRating;
  interestingArtifacts: ObservableArtifactTag[];
  
  // Rigorous Separation (Section 11)
  creativeValue: CreativeValueTier;
  mechanismConfidence: MechanismConfidenceTier;
  
  // Scientific Interaction Findings (Section 6)
  pathDependencyDetected?: boolean;
  interactionEffectDetected?: boolean;
  scientificNotes?: string;

  // Linked Discovered Recipe if saved
  discoveredRecipeId?: string;
}

// ==========================================
// 6. DISCOVERY RECIPE SCHEMA (SECTION 9)
// ==========================================

export interface DiscoveryRecipe {
  id: string;
  name: string;
  sourceExperimentId: string;

  targetMedium: 'image' | 'video' | 'audio';
  compatibleModelProfiles: string[];

  mechanismHypothesis: string;

  // Procedural Definition (Not just prompt text!)
  operatorChain: string[];
  relativeStrengths: Record<string, number | string>;
  ordering: string[];
  iterationPattern: string;

  importantInvariants: string[];
  usefulFailureSurface: string[];

  amplificationMethod: string[];
  knownFailureCondition: string[];

  // Decoupled Confidence & Creative Value
  confidence: MechanismConfidenceTier;
  creativeValue: CreativeValueTier;
  timesObserved: number;
  isSeedSensitive?: boolean;

  // Lineage & Promotion Status
  parentRecipeId?: string;
  promotedToOperator: boolean;
  promotedOperatorId?: string;

  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. PROMOTED OPERATOR SCHEMA (SECTION 10)
// ==========================================

export interface PromotedOperator {
  id: string;
  name: string;
  origin: 'EXPERIMENTAL / USER-DISCOVERED';
  recipeId: string;
  family: string;
  shortDescription: string;
  mechanismHypothesis: string;
  targetMedium: 'image' | 'video' | 'audio';
  expectedFailureSurface: string[];
  amplificationMethod: string[];
  knownFailureCondition: string[];
  confidence: MechanismConfidenceTier;
  operators: string[];
  suggestedPromptTemplate?: string;
  createdAt: string;
}

// ==========================================
// 8. DISCOVERY ENGINE CONFIGURATION
// ==========================================

export interface DiscoveryConfig {
  experimentType: ExperimentType;
  variantCount: number; // 2 to 5 (default: 4 variants + 1 control)
  operatorA?: string;
  operatorB?: string;
  sweepStrengthSteps?: ('LOW' | 'MEDIUM' | 'HIGH')[];
  includeAblation: boolean;
  preserveIdentityAnchor: boolean;
  iterationDepth: number;
}
