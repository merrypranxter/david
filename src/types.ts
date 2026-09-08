import type { FailureOperator } from './data/failureOperators';
import type { ContentDNA } from './types/contentDna';
export * from './types/contentDna';

export type TargetEngine =
  | 'general'
  | 'suno'
  | 'midjourney_flux'
  | 'openart'
  | 'grok'
  | 'llm_agent'
  | 'void';

export type StraitjacketLevel = 'normal' | 'loosen' | 'misinterpret' | 'destabilize' | 'remove_subject';

export type ElementAnchorType = 'HARD_ANCHOR' | 'SOFT_ANCHOR' | 'MUTABLE' | 'DISPOSABLE';

export interface StraitjacketConfig {
  level: StraitjacketLevel;
  sourcePreservation: 'very_high' | 'high' | 'medium' | 'low_medium' | 'intent_only';
  wordingPreservation: 'high' | 'medium_high' | 'low' | 'very_low' | 'near_zero';
  nounPreservation: 'very_high' | 'high' | 'medium_high' | 'medium_low' | 'very_low';
  operatorCount: [number, number];
  graphComplexity: 'minimal' | 'low' | 'medium' | 'high';
  causalRewrite: 'minimal' | 'low' | 'medium' | 'high' | 'very_high';
  subjectRemoval: 'none' | 'very_low' | 'low_medium' | 'medium_high' | 'maximum';
  productiveMisunderstanding: 'none' | 'low' | 'high' | 'maximum';
  novelOperatorProbability: 'near_zero' | 'low' | 'medium' | 'medium_high' | 'high';
}

export type OpenArtModel = 'banana' | 'nano_bananas' | 'pro' | 'light' | 'seadream';

export type GrokMode = 'grok_image' | 'grok_video';

export type CommandMode = 'dual' | 'literal' | 'slop' | 'bypass' | 'reframe' | 'clinical_reframe';

export type SlopDomain = 'maths' | 'sciences' | 'slop';

export type ContradictionMode = 'paradox' | 'dissonance' | 'symbiosis' | 'free_drift';

// ==========================================
// MUTATION KERNEL TYPES (Job 1 Foundation)
// ==========================================

export type MutationCategory =
  | 'structural'
  | 'semantic'
  | 'ontological'
  | 'recursive'
  | 'contradiction'
  | 'blending'
  | 'lineage'
  | 'selection';

export interface MutationOperator {
  id: string;
  name: string;
  category: MutationCategory;
  description: string;
  directive: string;
  minEntropy: number;
  experimental: boolean;
  compatibleOperatorIds?: string[];
  incompatibleOperatorIds?: string[];
  tags?: string[];
}

export interface WeightedSelection<T = string> {
  id: T;
  weight: number;
  intensity?: number;
}

export type TraitStatus = 'active' | 'dormant' | 'extinct';

export interface EvolutionTrait {
  id: string;
  label: string;
  directive: string;
  originGen: number;
  strength: number; // 0.0 to 1.0
  persistence: number; // 0.0 to 1.0
  status: TraitStatus;
  category?: string;
}

export interface LineageScar {
  id: string;
  label: string;
  description: string;
  originGen: number;
  strength: number; // 0.0 to 1.0
  persistence: number; // 0.0 to 1.0
  status: 'active' | 'dormant';
}

export type MutationEventType =
  | 'drift'
  | 'misremember'
  | 'reversion'
  | 'crossbreed'
  | 'scar_formed'
  | 'dormancy'
  | 'extinction'
  | 'operator_shift'
  | 'attractor_shift';

export interface LineageMutationEvent {
  type: MutationEventType;
  description: string;
  targetId?: string;
  originGen?: number;
}

export interface PromptGeneration {
  generationId: string;
  generationNumber: number;
  timestamp: number;
  parentGenerationIds: string[];
  sourceConcept: string;
  renderedPrompt: string; // Phenotype excerpt/snapshot
  mutationRecipeSnapshot?: MutationRecipe; // Genotype snapshot
  inheritedTraits: EvolutionTrait[];
  acquiredTraits: EvolutionTrait[];
  lostTraits: string[];
  dormantTraits: EvolutionTrait[];
  scars: LineageScar[];
  preservedAnchors: string[];
  mutationEvents: LineageMutationEvent[];
  lineageSummary: string;
}

export interface MutationLineage {
  generation: number;
  generationId: string;
  parentGenerationIds?: string[];
  inheritedOperators?: string[];
  revertedOperators?: string[];
  mutationSummary?: string;
  promptGeneration?: PromptGeneration;
}

export interface MutationRecipe {
  enabled: boolean;
  operators: WeightedSelection<string>[];
  attractors?: WeightedSelection<string>[];
  pressureIds?: string[];
  semanticDistance?: number;
  semanticNeighborHops?: number;
  preservedAnchors?: string[];
  lineage?: MutationLineage;
  diagnosticSummary?: string;
  entropyLevel?: number;
  contentDna?: string[];
}

export type CreativePressureId =
  | 'preserve_identity'
  | 'maximize_structural_novelty'
  | 'avoid_decorative_weirdness'
  | 'preserve_target_legibility'
  | 'maximize_sibling_distance';

export interface CreativePressure {
  id: CreativePressureId;
  name: string;
  description: string;
  directive: string;
  defaultWeight: number;
}

export interface EntropyProfile {
  entropy: number;
  label: string;
  minOperators: number;
  maxOperators: number;
  targetOperatorCount: number;
  minAttractors: number;
  maxAttractors: number;
  semanticDistance: number;
  neighborHops: number;
  anchorPreservationWeight: number;
  ontologySwapEligibility: boolean;
  stagedParadoxEligibility: boolean;
  recursiveReversalEligibility: boolean;
  scaleSchismEligibility: boolean;
  conceptBleedIntensity: number;
  organMutationWillingness: number;
}

// ==========================================
// LATENT FAUNA / ATTRACTOR TYPES (Job 2)
// ==========================================

export type AttractorCategory =
  | 'distributed'
  | 'material'
  | 'spectral'
  | 'ontological'
  | 'collective'
  | 'transformational'
  | 'archetypal'
  | 'epistemic'
  | 'topological';

export interface AttractorExampleTransformation {
  input: string;
  output: string;
}

export interface LatentAttractor {
  id: string;
  name: string;
  category: AttractorCategory;
  description: string;
  directive: string;
  tendencies: string[];
  destabilizes: string[];
  literalizationWarning: string;
  minEntropy: number;
  compatibleOperatorIds?: string[];
  incompatibleOperatorIds?: string[];
  tags?: string[];
  researchNote?: string;
  exampleTransformation?: AttractorExampleTransformation;
}

// ==========================================
// STRUCTURED CONCEPT / DISMEMBERMENT TYPES (Job 3)
// ==========================================

export type OrganType =
  | 'subject'
  | 'identity'
  | 'action'
  | 'transformation'
  | 'material'
  | 'environment'
  | 'spatial_relation'
  | 'temporal_relation'
  | 'composition'
  | 'constraint'
  | 'governing_rule'
  | 'style'
  | 'media'
  | 'unknown';

export interface ConceptOrgan {
  id: string;
  type: OrganType;
  originalValue: string;
  currentValue: string;
  mutationAllowed: boolean;
  preserveStrength: number; // 0.0 (free to mutate) to 1.0 (strongly anchored)
  tags?: string[];
  sourceSpan?: string;
  mutationHistory?: string[];
}

export interface DecomposedConcept {
  originalInput: string;
  organs: ConceptOrgan[];
  detectedAnchors: string[];
  unclassifiedText?: string[];
  summary?: string;
  reconstructedText?: string;
}

export interface DismembermentOptions {
  useLLM?: boolean;
  anchorThreshold?: number;
  preserveNamedEntities?: boolean;
  autoAnchorCoreSubject?: boolean;
  modelPreference?: string;
}

export interface SlopSeedingConfig {
  enableParadoxEngine: boolean;
  paradoxEngine?: boolean;
  enableMutationEngine?: boolean;
  addMaths: boolean;
  mathCategory?: string;
  addSciences: boolean;
  scienceCategory?: string;
  addSlop: boolean;
  slopCategory?: string;
  contradictionMode: ContradictionMode;
  selectedSeeds: string[];
  activePipeline?: string[];
  mutationRecipe?: MutationRecipe;
  // Job 7: Mutation Lab configuration
  mutationMode?: 'auto' | 'curated';
  selectedOperators?: Array<{ id: string; weight?: number; intensity?: number }>;
  selectedAttractors?: Array<{ id: string; weight?: number; intensity?: number }>;
  selectedPressures?: CreativePressureId[];
  protectedAnchors?: string[];
  // Job 8: Quality-Diversity Mutant Selection configuration
  mutantSelectionMode?: 'auto' | 'off';
  maxSiblingCount?: number;
}

/**
 * Complete Slop Recipe encapsulating all settings, choices, parameters, and mutations.
 */
export interface SlopRecipe {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  isCurated?: boolean;
  tags?: string[];
  // All configuration choices & settings:
  concept: string;
  target: TargetEngine;
  targetLength: number;
  openArtModel: OpenArtModel;
  grokMode: GrokMode;
  entropyLevel: number;
  straitjacket?: StraitjacketLevel;
  commandMode: CommandMode;
  highThinking: boolean;
  useSearch: boolean;
  slopConfig: SlopSeedingConfig;
}

export interface LiteralResult {
  prompt: string;
  // Suno specific dual outputs
  stylePrompt?: string;
  lyricsPrompt?: string;
  tokenWeights: string[];
  targetParameters: string;
  charCount?: number;
  styleCharCount?: number;
  lyricsCharCount?: number;
}

export interface SlopResult {
  prompt: string;
  // Suno specific dual outputs
  stylePrompt?: string;
  lyricsPrompt?: string;
  entropyScore: number;
  hallucinationTriggers: string[];
  glitchAnchors?: string;
  seededContradictions?: string[];
  injectedDomains?: string[];
  charCount?: number;
  styleCharCount?: number;
  lyricsCharCount?: number;
  // Job 5 Mutation Recipe Metadata (Optional)
  activeOperators?: string[];
  activeAttractors?: string[];
  semanticDistance?: number;
  neighborHops?: number;
  preservedAnchors?: string[];
  mutationSummary?: string;
  lineageSummary?: string;
  activeTraits?: string[];
  activeScars?: string[];
  generationNumber?: number;
  parentGenerationIds?: string[];
  candidateFamilySummary?: string;
}

export interface LogicMapItem {
  phase: string;
  description: string;
}

export interface SynthesisPayload {
  literal: LiteralResult;
  slop: SlopResult;
  logicMap: LogicMapItem[];
  targetSummary?: string;
  previewImpact: string;
  targetEngine?: TargetEngine;
  mutationRecipe?: MutationRecipe;
  generation?: PromptGeneration;
  mutantFamily?: MutantFamilyResult;
  modelProfile?: ModelOrganismProfile;
  transformationVerification?: any;
  contentDna?: ContentDNA;
}

export interface SynthesisHistoryItem {
  id: string;
  timestamp: number;
  concept: string;
  target: TargetEngine;
  targetLength?: number;
  openArtModel?: OpenArtModel;
  grokMode?: GrokMode;
  entropyLevel: number;
  straitjacket?: StraitjacketLevel;
  highThinking: boolean;
  useSearch: boolean;
  commandMode: CommandMode;
  modelUsed: string;
  result: SynthesisPayload;
  generationIndex?: number;
  slopConfig?: SlopSeedingConfig;
  lineage?: PromptGeneration;
}

export type MediaType = 'image' | 'video' | 'audio';

export interface AdaptedOperator {
  operator: FailureOperator;
  directive: string;
}

export interface MediaProfile {
  id: MediaType;
  name: string;
  primaryDimensions: string[];
  strongFailureSurfaces: string[];
  weakFailureSurfaces: string[];
  preferredConstraintTypes: string[];
  preferredVariables: string[];
  preferredGraphRelations: string[];
  translationRules: Record<string, string>;
  antiPatterns: string[];
  promptStructureGuidance: string[];
}

// ==========================================
// MODEL-SPECIFIC ORGANISM PROFILES (Job 6)
// ==========================================

export type EpistemicStatus = 'OBSERVED' | 'LIKELY' | 'UNKNOWN' | 'EXPERIMENTAL';
export type ProfileConfidence = 'high' | 'medium' | 'low' | 'unknown';

export interface ModelTechnicalFacts {
  id: string;
  platformId: TargetEngine;
  modelName: string;
  version: string;
  mediaType: MediaType;
  promptCharacterLimit: number;
  preferredTargetLength: number;
  capabilities: string[];
  supportedReferences: string[];
  technicalParameters?: Record<string, any>;
}

export interface ModelFingerprint {
  referenceGrip: 'high' | 'medium' | 'low' | 'unknown';
  semanticGrip: 'high' | 'medium' | 'low' | 'unknown';
  topologyGrip: 'strong' | 'moderate' | 'weak' | 'unknown';
  materialGrip: 'strong' | 'moderate' | 'weak' | 'unknown';
  temporalGrip: 'strong' | 'moderate' | 'weak' | 'unknown';
  promptLiteralness: 'high' | 'moderate' | 'low' | 'unknown';
  contradictionTolerance: 'high' | 'moderate' | 'low' | 'unknown';
  ambiguityTolerance: 'high' | 'moderate' | 'low' | 'unknown';
  longPromptBehavior: 'strong_retention' | 'beginning_weighted' | 'end_weighted' | 'dilution' | 'unknown';
  technicalLanguageTolerance: 'high' | 'moderate' | 'low' | 'unknown';
  negativeInstructionReliability: 'reliable' | 'moderate' | 'unreliable' | 'unknown';
}

export type PromptOrderingComponent =
  | 'anchors_first'
  | 'mechanisms_first'
  | 'rendering_first'
  | 'blockers_last';

export type PromptDensityPreference = 'sparse_explicit' | 'balanced' | 'dense_compressed';

export interface ModelOrganismProfile {
  // Fixed Technical Facts
  technicalFacts: ModelTechnicalFacts;

  // Empirical Behavioral Profile
  epistemicStatus: EpistemicStatus;
  confidence: ProfileConfidence;
  fingerprint: ModelFingerprint;

  // Operator Weighting & Warnings
  operatorWeights: Record<string, number>;
  familyWeights: Record<string, number>;
  operatorWarnings: Record<string, string>;

  // Graph Complexity Guidance
  recommendedMinOperators: number;
  recommendedMaxOperators: number;
  recommendedDebtCount: number;
  contradictionStyle: 'compact_coupled' | 'distributed_graph' | 'hierarchical';

  // Prompt Structuring & Density
  promptOrdering: PromptOrderingComponent[];
  promptDensityPreference: PromptDensityPreference;
  anchorRepetition: boolean;

  // Model-Specific Easy-Outs to Block
  easyOuts: string[];

  // Qualitative Surfaces
  observedFailureSurfaces: string[];
  weakFailureSurfaces: string[];
  knownStrengths: string[];

  // Experimental Metadata
  experimentalNotes: string[];
  source: string;
  lastUpdated: string;
}

export type ObservedArtifactTag =
  | 'IDENTITY_DRIFT'
  | 'IDENTITY_LOCK'
  | 'TOPOLOGY_LEAK'
  | 'MORPHOLOGICAL_LEAKAGE'
  | 'TEMPORAL_SMEAR'
  | 'GHOST_STRUCTURE'
  | 'BACKGROUND_INHERITANCE'
  | 'MATERIAL_SUBSTITUTION'
  | 'UNREQUESTED_SYMMETRY'
  | 'EXTRA_ANATOMY'
  | 'BOUNDARY_COLLAPSE'
  | 'PHONETIC_COLLAPSE'
  | 'INSTRUMENT_CONFUSION'
  | 'RHYTHMIC_COLLAPSE'
  | 'SPECTRAL_ARTIFACT'
  | 'PROMPT_IGNORED'
  | 'GENERIC_RESOLUTION';

export interface ModelObservation {
  observationId: string;
  modelId: string;
  date: string;
  inputSummary: string;
  operatorsUsed: string[];
  graphSummary: string;
  straitjacketLevel: StraitjacketLevel;
  observedArtifactTags: ObservedArtifactTag[];
  userRating?: number;
  notes: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface PresetItem {
  id: string;
  title: string;
  category: 'Suno Audio' | 'Visual / Midjourney' | 'LLM / Agent' | 'The Void';
  tag: string;
  concept: string;
  target: TargetEngine;
  entropyLevel: number;
  straitjacket?: StraitjacketLevel;
  note: string;
}

export interface SimulationResult {
  behaviorSummary: string;
  artifactReport: string[];
  compliancePercentage: number;
  latentVoidPercentage: number;
  simulatedOutputExcerpt: string;
}

// ==========================================
// QUALITY-DIVERSITY MUTANT SELECTION TYPES (Job 8)
// ==========================================

export type MutationNiche =
  | 'ontological'
  | 'topological'
  | 'temporal'
  | 'distributed'
  | 'signal-decay'
  | 'identity'
  | 'material'
  | 'causal'
  | 'scale'
  | 'contradiction'
  | 'recursive'
  | 'spectral'
  | 'rhythmic'
  | 'compositional';

export interface CandidateEvaluation {
  structuralNovelty: number;       // 0 - 1
  anchorSurvival: number;          // 0 - 1
  targetLegibility: number;        // 0 - 1
  conceptualCoherence: number;     // 0 - 1
  siblingDistance: number;         // 0 - 1
  clichePenalty: number;           // 0 - 1
  decorativeOnlyPenalty: number;   // 0 - 1
  semanticCollapsePenalty: number; // 0 - 1
  totalFitness: number;            // 0 - 1
  notes: string[];
  nondominated?: boolean;
  isParetoOptimal?: boolean;
  wildcardBonus?: boolean;
  // Compatibility score aliases
  noveltyScore?: number;
  anchorSurvivalScore?: number;
  targetLegibilityScore?: number;
  conceptualCoherenceScore?: number;
  siblingDistanceScore?: number;
  clicheDensityPenalty?: number;
}

export interface MutationCandidate {
  id: string;                      // e.g. 'cand-a'
  candidateLetter: 'A' | 'B' | 'C' | string;
  sourceGenerationId?: string;
  recipeId?: string;
  mutationRecipe: MutationRecipe;
  transformedConcept?: string;
  renderedPrompt: string;
  renderedStylePrompt?: string;
  renderedLyricsPrompt?: string;
  stylePrompt?: string;
  lyricsPrompt?: string;
  activeOperators: string[];
  attractorMix: string[];
  preservedAnchors: string[];
  mutationNiches: MutationNiche[];
  evaluation?: CandidateEvaluation;
  mutationSummary: string;
  rejectionReason?: string;
  isSurvivor: boolean;
  isUserOverride?: boolean;
  generationSnapshot?: PromptGeneration;
}

export interface MutantFamilyResult {
  candidates: MutationCandidate[];
  survivorCandidateId: string;
  runnerUpCandidateId?: string;
  diversitySummary: string;
  selectionReason: string;
  nichesRepresented: MutationNiche[];
  evaluationMode: 'auto-family' | 'single-candidate' | 'user-override' | 'manual';
  evaluationDetails?: {
    familySize: number;
    survivorLetter: string;
    survivorFitness: number;
    runnerUpLetter?: string;
  };
}

export interface DormantBranch {
  candidateId: string;
  parentGenerationId: string;
  generationNumber: number;
  timestamp: number;
  concept: string;
  renderedPromptExcerpt: string;
  operators: string[];
  attractors: string[];
  niches: MutationNiche[];
  fitnessHighlights: string;
  evaluationScores?: {
    novelty: number;
    anchorSurvival: number;
    legibility: number;
    fitness: number;
  };
  lineageGenotype?: PromptGeneration;
}

export interface MutationPattern {
  id: string;
  timestamp: number;
  label: string;
  operatorIds: string[];
  attractorIds: string[];
  niches: MutationNiche[];
  semanticDistance: number;
  preservedAnchorsCount: number;
  recordedFitness: number;
  note: string;
}

export interface MutantSelectionConfig {
  enabled: boolean;
  minEntropyForFamily: number;
  maxSiblingsLowEntropy: number;
  maxSiblingsMidEntropy: number;
  maxSiblingsHighEntropy: number;
  useLlmEvaluator: boolean;
  useLocalPrefiltering: boolean;
  weights: {
    structuralNovelty: number;
    conceptualCoherence: number;
    anchorSurvival: number;
    targetLegibility: number;
    siblingDistance: number;
    clichePenalty: number;
    decorativeOnlyPenalty: number;
    semanticCollapsePenalty: number;
  };
}

// ==========================================
// SLOP METHODS & OPERATOR LIBRARY TYPES
// ==========================================

export type SlopMethodFamily =
  | 'lexical'
  | 'structural'
  | 'syntax'
  | 'perspective'
  | 'dialect'
  | 'pipeline';

export interface StructuralTestPredicate {
  id: string;
  description: string;
  tests: string[];
  fail_example: string;
  pass_example: string;
}

export interface BridgeAgentItem {
  agent: string;
  phrasing: string;
}

export interface SyntaxVectorItem {
  id: string;
  format: string;
  effect: string;
}

export interface LensShiftItem {
  id: string;
  logic: string;
}

export interface SlopMethodOperator {
  id: string;
  name: string;
  family: SlopMethodFamily;
  targets?: string[];
  structural: boolean | 'partial';
  priority?: string;
  min_w_coeff?: number;
  mechanism?: string;
  operation: string;
  swap?: Record<string, string>;
  bank?: Array<string | BridgeAgentItem>;
  templates?: string[];
  template?: string;
  params?: Record<string, any>;
  vectors?: SyntaxVectorItem[];
  formats?: Record<string, { example: string; pacing_effect?: string; syntax?: string }>;
  selection_rule?: Record<string, string>;
  lenses?: LensShiftItem[];
  steps?: string[];
  example?: string;
  strongest_tokens?: string[];
  caution?: string;
  source?: string;
}

export interface WeirdnessBand {
  range: [number, number];
  label: string;
  permits: string[];
  note?: string;
}

export interface SlopMethodProtocol {
  id: string;
  name: string;
  type: 'gate' | 'filter' | 'loop' | 'diversity_constraint' | 'variant_constraint';
  description: string;
  priority?: string;
  bands?: WeirdnessBand[];
  escalation?: { trigger: string; delta: number };
  operation?: string;
  steps?: string[];
  maps_to?: string;
  bank?: string[];
  anti_goal?: string;
  note?: string;
  source?: string;
}

export interface MechanismAttractor {
  name: string;
  signature: string;
}

export interface MechanismEmergence {
  name: string;
  signature: string;
}

export interface MechanismImpossibleGeometry {
  name: string;
  signature: string;
}

export interface MechanismPhysicalExotica {
  name: string;
  signature: string;
}

export interface MechanismBank {
  note: string;
  attractors: MechanismAttractor[];
  emergence: MechanismEmergence[];
  impossible_geometry: MechanismImpossibleGeometry[];
  physical_exotica: MechanismPhysicalExotica[];
  calibration_specimens: string[];
}

export interface SlopMethodsLibrary {
  schema_version: string;
  name: string;
  description: string;
  predicate: StructuralTestPredicate;
  operators: SlopMethodOperator[];
  protocols: SlopMethodProtocol[];
  mechanism_bank: MechanismBank;
  sources: Record<string, string>;
  not_yet_mined: Array<{ id: string; title: string; note?: string }>;
}

// Re-export Technical Experimental Core Types (Job 1)
export * from './types/technicalCore';

// Re-export Tokenizer & Serialization Sabotage Types (Job 2)
export * from './types/serialization';

// Re-export Context Budget & Binding Failure Types (Job 3)
export * from './types/contextBinding';

// Re-export Structural Syntax & Relational Traps Types (Job 4)
export * from './types/structuralRelational';

// Re-export Guidance Geometry: Core Competing Forces Types (Job 5A)
export * from './types/guidanceGeometry';

