/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Tokenizer & Serialization Sabotage Lab
 * Type Definitions
 */

import {
  TechnicalModality,
  ExecutionTier,
  TechnicalEvidenceStatus,
  TechnicalScores,
  ExperimentalControlRole,
} from './technicalCore';

// ==========================================
// 1. SPAN SELECTORS & TARGETING
// ==========================================

export type TargetSpanType =
  | 'entire_prompt'
  | 'selected_phrase'
  | 'modifier'
  | 'delimiter'
  | 'word'
  | 'morpheme'
  | 'character_position'
  | 'repeated_locations';

export interface TargetSpanSelector {
  type: TargetSpanType;
  /** Exact substring to target (for selected_phrase or modifier) */
  matchText?: string;
  /** Regex pattern if targeting by pattern */
  regex?: string;
  /** Specific 0-indexed word indices (e.g. [0, 2]) */
  wordIndices?: number[];
  /** Specific 0-indexed character positions */
  characterIndices?: number[];
  /** Specific occurrence index (e.g. 0 for first match) or 'all' */
  occurrenceIndex?: number | 'all';
}

// ==========================================
// 2. UNICODE NORMALIZATION & CANDIDATE SEPARATORS
// ==========================================

export type NormalizationMode = 'RAW' | 'NFC' | 'NFD' | 'NFKC' | 'NFKD';

export type UnicodeSeparatorCategory =
  | 'BOUNDARY_SPLITTER'
  | 'COMBINING_MARK'
  | 'ZERO_WIDTH'
  | 'NORMALIZATION_SENSITIVE'
  | 'SCRIPT_SHIFT';

export interface UnicodeCandidateChar {
  codePoint: string; // e.g. '\u034F'
  char: string;
  name: string;
  category: UnicodeSeparatorCategory;
  knownRisks: string[];
  visualImpact: 'INVISIBLE' | 'SUBTLE' | 'DESTRUCTIVE';
  normalizationBehavior: string;
  safeForExperiment: boolean;
}

// ==========================================
// 3. HOMOGLYPH FAMILIES & MAPPINGS
// ==========================================

export type HomoglyphScript = 'latin' | 'greek' | 'cyrillic';

export interface HomoglyphEntry {
  sourceChar: string;
  sourceScript: HomoglyphScript;
  targetChar: string;
  targetScript: HomoglyphScript;
  codePoint: string;
  visualSimilarity: number; // 0.0 to 1.0
  notes?: string;
}

// ==========================================
// 4. CLAMPING & EXPANSION LIMITS
// ==========================================

export interface ClampingLimits {
  /** Maximum total characters in mutated string */
  maxMutationCharacters: number;
  /** Maximum generated Unicode code points */
  maxGeneratedCodePoints: number;
  /** Maximum UTF-8 byte length */
  maxUTF8Bytes: number;
  /** Maximum ratio of mutated length / original length */
  maxExpansionRatio: number;
}

export const DEFAULT_CLAMPING_LIMITS: ClampingLimits = {
  maxMutationCharacters: 4000,
  maxGeneratedCodePoints: 2500,
  maxUTF8Bytes: 8192,
  maxExpansionRatio: 12.0,
};

// ==========================================
// 5. SERIALIZATION DIAGNOSTICS
// ==========================================

export type ContextRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CONTEXT_LIMIT_EXCEEDED';

export interface SerializationDiagnostics {
  originalLength: number;
  originalCodePoints: number;
  originalByteLength: number;

  mutatedLength: number;
  mutatedCodePoints: number;
  mutatedByteLength: number;

  expansionRatio: number;
  escapedRepresentation: string;
  codePointSequence: string[];

  clamped: boolean;
  clampReason?: string;
  warnings: string[];

  contextRisk: ContextRiskLevel;
  sanitizationProbeStatus?: 'TOKENIZATION_UNVERIFIED' | 'SANITIZATION_SUSPECTED' | 'SANITIZATION_CONFIRMED';
}

// ==========================================
// 6. MUTATION PLAN & SERIALIZED RESULT
// ==========================================

export interface MutationPlan {
  planId: string;
  operatorId: string;
  targetSpan: TargetSpanSelector;
  normalizationMode: NormalizationMode;
  parameters: Record<string, any>;
  limits?: ClampingLimits;
  seed?: number;
}

export interface SerializedMutationResult {
  /** The untouched, canonical user input */
  canonicalInput: string;
  /** The mutated string to submit to the model */
  serializedExperimentalInput: string;
  /** Human-readable escaped display for UI inspection */
  escapedView: string;
  /** Detailed diagnostics (code points, byte count, clamping) */
  diagnostics: SerializationDiagnostics;
  /** The plan used to create this result */
  mutationPlan: MutationPlan;

  /** Glitch-candidate discovery hook for future Job (UEP-GD) */
  candidateTokenIds?: number[];
  candidateRarePieces?: string[];
  fallbackTokenIds?: number[];
}

// ==========================================
// 7. TOKENIZER INSPECTION & MULTI-ENCODER RESULTS
// ==========================================

export interface EncoderTokenizerResult {
  encoderId: string; // e.g. 'CLIP-L/14', 'T5-XXL', 'Llama-3'
  tokenCount: number;
  tokenIds: number[];
  pieces: string[];
  offsets?: Array<[number, number]>;
  truncated: boolean;
  truncationPosition?: number;
  tokensLostAfterTruncation?: number;
  unknownOrFallbackTokens?: number[];
  specialTokensCount?: number;
}

export interface MultiEncoderInspectionResult {
  modelId: string;
  isInstrumented: boolean;
  encoders: Record<string, EncoderTokenizerResult>;
  overallTruncated: boolean;
  unverifiedReason?: string;
}

export interface TokenizationParityResult {
  tokenizationDiverged: boolean;
  baselineTokenCount: number;
  mutatedTokenCount: number;
  diffSummary: string;
  mechanismEvidence: 'TOKENIZATION_DIVERGED' | 'NO_TOKENIZATION_CHANGE' | 'TOKENIZATION_UNVERIFIED';
  encoderParity: Record<string, boolean>;
}

// ==========================================
// 8. SANITIZATION PROBES & TRUNCATION CONTROLS
// ==========================================

export interface SanitizationProbeVariants {
  baseline: string;
  mutated: string;
  normalizedMutated: string;
  strippedMutated: string;
}

export interface TruncationConfoundControl {
  mutatedExpandedLength: number;
  mutatedTokenCount: number;
  /** Neutral prompt crafted to consume the exact same token count and cause identical tail truncation */
  truncationEquivalentPrompt: string;
  tailTokensLost: string[];
}

// ==========================================
// 9. FAILURE SURFACE OBSERVATION TAGS
// ==========================================

export type FailureSurfaceObservationTag =
  | 'SEMANTIC_RETENTION'
  | 'SEMANTIC_DRIFT'
  | 'ATTRIBUTE_LEAKAGE'
  | 'UNBOUND_ATTRIBUTE'
  | 'IDENTITY_LOSS'
  | 'MATERIAL_SUBSTITUTION'
  | 'STRUCTURAL_STRIATION'
  | 'EDGE_FRINGING'
  | 'SPATIAL_TEARING'
  | 'TEMPORAL_STUTTER'
  | 'FEATURE_REASSIGNMENT'
  | 'AUDIO_SPUTTER'
  | 'PHONETIC_BLEED'
  | 'TIMBRAL_DRIFT'
  | 'GENERIC_NOISE'
  | 'UNDERCONDITIONED_OUTPUT'
  | 'CONTEXT_TRUNCATION'
  | 'NO_OBSERVABLE_EFFECT';

// ==========================================
// 10. SERIALIZATION PRESETS
// ==========================================

export type SerializationPresetId =
  | 'ASND_DENSITY_SWEEP'
  | 'HOMOGLYPH_RATIO_SWEEP'
  | 'DIACRITIC_DEPTH_SWEEP'
  | 'NORMALIZATION_COMPARISON'
  | 'TOKENIZATION_PARITY_TEST'
  | 'TRUNCATION_CONFOUND_TEST'
  | 'SANITIZATION_PROBE';

export interface SerializationPreset {
  id: SerializationPresetId;
  name: string;
  shortDescription: string;
  operatorId: string;
  recommendedModality: TechnicalModality;
  defaultParameters: Record<string, any>;
  notes: string;
}
