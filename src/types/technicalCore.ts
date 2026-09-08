/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Foundational Architecture & Type Definitions
 * 
 * CORE PRINCIPLE: CREATIVE UTILITY ≠ MECHANISM CONFIDENCE.
 * An operator may produce stunning aesthetic or topological weirdness (creativeUtility: 9/10)
 * while our causal hypothesis about why it happened remains completely unverified (mechanismConfidence: 2/10).
 * DAVID preserves useful weirdness without converting folklore into fake science.
 */

// ==========================================
// 1. TECHNICAL LAYERS & EXECUTION TIERS
// ==========================================

export type TechnicalLayer =
  | 'SERIALIZATION'
  | 'TOKENIZATION'
  | 'EMBEDDING'
  | 'CONTEXT'
  | 'BINDING'
  | 'GUIDANCE'
  | 'REFERENCE'
  | 'ATTENTION'
  | 'POSITIONAL_GEOMETRY'
  | 'DENOISING'
  | 'LATENT'
  | 'CODEC'
  | 'TEMPORAL'
  | 'AUDIO_REPRESENTATION'
  | 'ITERATIVE_DYNAMICS';

/**
 * TIER A (OBSERVABLE): Black-box commercial models where we manipulate input strings,
 * unicode, context position, exposed provider parameters, seeds, image references, and empirical output loops.
 * 
 * TIER B (INSTRUMENTED): White-box local/open models where we have direct access to
 * token IDs, tokenizer dictionaries, embeddings, diffusers pipeline hooks, attention maps,
 * KV projections, RoPE frequencies, VAE latents, and PyTorch tensors.
 * 
 * HYBRID: Operators with an observable input mutation that also specify an instrumented
 * verification or deep control pathway when Tier B capability is available.
 */
export type ExecutionTier = 'OBSERVABLE' | 'INSTRUMENTED' | 'HYBRID';

export type TechnicalModality = 'IMAGE' | 'VIDEO' | 'AUDIO';

export type StageRole = 'CONTAINER' | 'CRUCIBLE' | 'ITINERARY';

// ==========================================
// 2. TECHNICAL CAPABILITIES MATRIX
// ==========================================

export type TechnicalCapability =
  | 'TEXT_INPUT'
  | 'NEGATIVE_PROMPT'
  | 'REFERENCE_IMAGE'
  | 'REFERENCE_VIDEO'
  | 'REFERENCE_AUDIO'
  | 'IMAGE_TO_IMAGE'
  | 'VIDEO_CONTINUATION'
  | 'OUTPUT_REUSE'
  | 'SEED_CONTROL'
  | 'GUIDANCE_CONTROL'
  | 'TOKENIZER_ACCESS'
  | 'TOKEN_ID_ACCESS'
  | 'SEPARATE_CONDITIONING_BRANCHES'
  | 'TIMESTEP_CONTROL'
  | 'LATENT_ACCESS'
  | 'ATTENTION_ACCESS'
  | 'KV_PROJECTION_ACCESS'
  | 'VAE_ACCESS'
  | 'PYTORCH_HOOKS'
  | 'LOCAL_PIPELINE'
  | 'ROPE_CONFIGURATION';

export interface TechnicalBackendCapabilities {
  modelId: string;
  platformId: string;
  displayName: string;
  isLocalPipeline: boolean;
  supportedModalities: TechnicalModality[];
  capabilities: Record<TechnicalCapability, boolean>;
  notes?: string[];
}

export type TierResolutionStatus = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'UNSUPPORTED';

export interface TierResolutionResult {
  status: TierResolutionStatus;
  resolvedTier: ExecutionTier;
  operatorId: string;
  modelId: string;
  requestedTier: ExecutionTier;
  missingCapabilities: TechnicalCapability[];
  availableCapabilities: TechnicalCapability[];
  reasons: string[];
  degradationPath?: string;
  canDegradeToObservable: boolean;
}

// ==========================================
// 3. EVIDENCE & CONFIDENCE MODEL
// ==========================================

/**
 * Non-mutually exclusive states of scientific/empirical status.
 * An operator can simultaneously be EMPIRICALLY_USEFUL, MODEL_SPECIFIC, and MECHANISM_UNCERTAIN.
 */
export type TechnicalEvidenceStatus =
  | 'PROPOSED'
  | 'OBSERVED'
  | 'EMPIRICALLY_USEFUL'
  | 'MECHANISM_UNCERTAIN'
  | 'MODEL_SPECIFIC'
  | 'MECHANISM_SUPPORTED'
  | 'FALSIFIED';

/**
 * Normalized scores (0.0 to 1.0) or null.
 * CRITICAL: Must allow null/undefined when unmeasured. NEVER manufacture fake scores.
 */
export interface TechnicalScores {
  /** Did this produce aesthetically or structurally interesting weirdness? */
  creativeUtility: number | null;
  /** Does the effect recur across runs rather than in one lucky seed? */
  repeatability: number | null;
  /** How strongly does verified empirical evidence support our proposed causal explanation? */
  mechanismConfidence: number | null;
  /** How strongly is the result tied to one specific model or architecture family? */
  modelDependence: number | null;
  /** How often did competing conditions remain active long enough to produce a compromise instead of being ignored? */
  failureToIgnoreRate: number | null;
}

// ==========================================
// 4. EXPERIMENTAL CONTROLS & FALSIFICATION
// ==========================================

export type ExperimentalControlRole =
  | 'baseline'
  | 'experimental'
  | 'negative_control'
  | 'positive_control'
  | 'ablation'
  | 'reversal'
  | 'dose_sweep'
  | 'cross_model'
  | 'direct_vs_iterative'
  | 'seed_repeat';

export interface ExperimentalControlSpec {
  /** Which controls are defined and applicable for this operator */
  applicableControls: ExperimentalControlRole[];
  /** What specific variable is manipulated */
  variableChanged: string;
  /** What factors are strictly held constant (seed, base prompt, temperature, guidance) */
  heldConstant: string;
  /** The core testable hypothesis */
  hypothesisTested: string;
  /** What empirical outcome would weaken our causal hypothesis */
  weakeningCondition: string;
  /** What empirical outcome would outright FALSIFY our proposed mechanism */
  falsificationCondition: string;
  /** Description of negative control configuration */
  negativeControlDescription?: string;
  /** Sub-components, tokens, or weights to strip in ablation runs */
  ablationTargets?: string[];
  /** Reversal configuration (inverting sequence, polarity, or values) */
  reversalDescription?: string;
}

// ==========================================
// 5. DOSE-RESPONSE SWEEP SPECIFICATION
// ==========================================

export type SweepType = 'discrete' | 'linear_range' | 'logarithmic' | 'custom';

export interface DoseSweepSpec {
  parameter: string;
  sweepType: SweepType;
  values: (number | string | boolean)[];
  rangeConfig?: {
    min: number;
    max: number;
    step?: number;
    stepsCount?: number;
  };
  unit?: string;
  description?: string;
}

export interface SweepRunConfig {
  sweepIndex: number;
  parameter: string;
  value: number | string | boolean;
  role: 'dose_sweep';
  isBaselineDose: boolean;
  label: string;
}

// ==========================================
// 6. PARAMETERS & VERSIONING
// ==========================================

export type ParameterType = 'number' | 'string' | 'boolean' | 'select';

export interface TechnicalParameterDefinition {
  name: string;
  type: ParameterType;
  defaultValue: number | string | boolean;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
}

export interface HypothesisRevision {
  version: string;
  date: string;
  hypothesis: string;
  rationale: string;
  authorOrRef?: string;
}

// ==========================================
// 7. TECHNICAL OPERATOR SCHEMA
// ==========================================

export interface TechnicalOperator {
  id: string;
  name: string;
  shortName: string;
  description: string;
  version: string;

  technicalLayer: TechnicalLayer;
  executionTier: ExecutionTier;
  supportedModalities: TechnicalModality[];

  /**
   * Proposed explanation for WHY the effect occurs.
   * EXPLICITLY a hypothesis unless confirmed by instrumented proof.
   */
  mechanismHypothesis: string;
  hypothesisRevisions: HypothesisRevision[];

  expectedFailureSurfaces: string[];
  requiredCapabilities: TechnicalCapability[];

  /** Tunable experimental variables */
  parameters: Record<string, TechnicalParameterDefinition>;

  /** Current empirical status across all tests */
  evidenceStatus: TechnicalEvidenceStatus[];
  scores: TechnicalScores;

  /** Experimental controls & falsification criteria */
  controls: ExperimentalControlSpec;

  /** Dose-response sweep definition (if supported) */
  defaultDoseSweep?: DoseSweepSpec;

  /** Role scaffold for Job 10 orchestration */
  recommendedStageRoles?: StageRole[];

  /** Fallback path when requested tier cannot be executed on current backend */
  degradationPath?: string;

  tags: string[];

  /** Flag to distinguish dev/test scaffold prototypes from production implementations */
  isDevExample?: boolean;
}

// ==========================================
// 8. EXPERIMENT RUN RECORDS & FAMILIES
// ==========================================

export interface ExperimentRunRecord {
  runId: string;
  familyId?: string;
  timestamp: string;
  operatorId: string;
  operatorVersion: string;
  modelId: string;
  modality: TechnicalModality;
  executionTier: ExecutionTier;

  /** Seed or PRNG state if exposed */
  seed: number | string | null;

  /** Role of this run within experimental controls */
  role: ExperimentalControlRole;

  /** Parent run ID for iterative lineages or continuations */
  parentRunId?: string | null;

  /** Specific parameters passed to this run */
  parametersUsed: Record<string, any>;

  /** References or baseline inputs used */
  inputReferenceIdentifiers?: Record<string, any>;

  /** Raw text prompt, media URI, or tensor/hook artifact IDs */
  outputs: {
    promptText?: string;
    negativePrompt?: string;
    mediaUri?: string;
    artifactReferences?: string[];
    technicalDumps?: Record<string, any>;
  };

  /**
   * WHAT HAPPENED — Strictly empirical, descriptive facts.
   * NEVER put speculative causal inferences here.
   * Example: "Modifier appeared on background object in 7/10 runs."
   */
  observation: string;

  /**
   * WHAT WE THINK CAUSED IT — Proposed causal/mechanistic interpretation.
   * Example: "Possible remote binding cleavage caused by context-budget starvation."
   */
  interpretation: string;

  /** Run-level empirical scores (null if unmeasured) */
  scores: TechnicalScores;

  /** Status assigned based on this run */
  evidenceStatus: TechnicalEvidenceStatus[];

  notes?: string;
}

export interface ExperimentFamilySummary {
  runCount: number;
  meanCreativeUtility: number | null;
  meanMechanismConfidence: number | null;
  repeatabilityDemonstrated: boolean | null;
  falsificationTriggered: boolean;
  currentVerdict: TechnicalEvidenceStatus;
  synthesis: string;
}

export interface ExperimentFamily {
  familyId: string;
  title: string;
  operatorId: string;
  operatorVersion: string;
  modelId: string;
  createdAt: string;
  updatedAt: string;

  hypothesis: string;
  falsificationCondition: string;
  variableChanged: string;
  heldConstant: string;

  runs: ExperimentRunRecord[];
  summary?: ExperimentFamilySummary;
  notes?: string;
}

// ==========================================
// 9. REGISTRY FILTERING CRITERIA
// ==========================================

export interface TechnicalOperatorFilter {
  modality?: TechnicalModality;
  executionTier?: ExecutionTier;
  technicalLayer?: TechnicalLayer;
  requiredCapability?: TechnicalCapability;
  evidenceStatus?: TechnicalEvidenceStatus;
  stageRole?: StageRole;
  searchQuery?: string;
  includeDevExamples?: boolean;
}
