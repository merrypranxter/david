/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Tokenizer & Serialization Sabotage Operators
 * 
 * Implements:
 * 1. ASND: Asymmetric Subword Sharding via Normalization Desynchronization
 * 2. HMC-SPS: Homoglyphic Manifold Collision via Subword Phase Shift
 * 3. DS-BFAH: Diacritic Saturation via Byte-Fallback Attention Hijack
 */

import { TechnicalOperator } from '../types/technicalCore';
import {
  MutationPlan,
  SerializedMutationResult,
  ClampingLimits,
  DEFAULT_CLAMPING_LIMITS,
  TargetSpanSelector,
  NormalizationMode,
  HomoglyphScript,
  FailureSurfaceObservationTag,
} from '../types/serialization';
import { executeSpanMutation } from '../utils/serializationEngine';
import { applyHomoglyphSubstitution } from '../utils/homoglyphLibrary';
import { getSeparatorsByCategory } from '../utils/unicodeSeparators';

// =======================================================================
// OBSERVATION TAXONOMY TAGS
// =======================================================================
export const FAILURE_SURFACE_OBSERVATION_TAGS: FailureSurfaceObservationTag[] = [
  'SEMANTIC_RETENTION',
  'SEMANTIC_DRIFT',
  'ATTRIBUTE_LEAKAGE',
  'UNBOUND_ATTRIBUTE',
  'IDENTITY_LOSS',
  'MATERIAL_SUBSTITUTION',
  'STRUCTURAL_STRIATION',
  'EDGE_FRINGING',
  'SPATIAL_TEARING',
  'TEMPORAL_STUTTER',
  'FEATURE_REASSIGNMENT',
  'AUDIO_SPUTTER',
  'PHONETIC_BLEED',
  'TIMBRAL_DRIFT',
  'GENERIC_NOISE',
  'UNDERCONDITIONED_OUTPUT',
  'CONTEXT_TRUNCATION',
  'NO_OBSERVABLE_EFFECT',
];

// =======================================================================
// 1. ASND — ASYMMETRIC SUBWORD SHARDING VIA NORMALIZATION DESYNCHRONIZATION
// =======================================================================

export const OPERATOR_ASND: TechnicalOperator = {
  id: 'asnd_normalization_desync',
  name: 'Asymmetric Subword Sharding via Normalization Desynchronization',
  shortName: 'ASND',
  description:
    'Alters Unicode and normalization structure inside a target term using non-rendering separators (CGJ, ZWSP, SHY) to disrupt sub-word tokenization while maintaining human readability.',
  version: '1.0.0',
  technicalLayer: 'TOKENIZATION',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Altering Unicode boundary marks inside a target term prevents default BPE merges and forces atypical sub-word vocabulary segmentation, which may disperse or destabilize cross-attention binding.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis:
        'Altering Unicode boundary marks inside a target term prevents default BPE merges and forces atypical sub-word vocabulary segmentation.',
      rationale: 'Initial Job 2 implementation grounding.',
    },
  ],

  expectedFailureSurfaces: [
    'ATTRIBUTE_LEAKAGE',
    'SEMANTIC_DRIFT',
    'UNBOUND_ATTRIBUTE',
    'STRUCTURAL_STRIATION',
  ],
  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    mutationDensity: {
      name: 'mutationDensity',
      type: 'number',
      defaultValue: 0.35,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      description: 'Proportion of character boundaries subjected to non-rendering boundary insertion (0 = baseline).',
    },
    boundaryStrategy: {
      name: 'boundaryStrategy',
      type: 'select',
      defaultValue: 'combining_grapheme_joiner',
      options: ['combining_grapheme_joiner', 'zero_width_space', 'soft_hyphen', 'alternating_separators'],
      description: 'Specific non-rendering boundary character to inject.',
    },
    normalizationMode: {
      name: 'normalizationMode',
      type: 'select',
      defaultValue: 'RAW',
      options: ['RAW', 'NFC', 'NFD', 'NFKC', 'NFKD'],
      description: 'Unicode normalization mode applied to mutated string.',
    },
    preserveVisibleSurface: {
      name: 'preserveVisibleSurface',
      type: 'boolean',
      defaultValue: true,
      description: 'Guarantees inserted code points remain visually invisible to standard human inspection.',
    },
    seed: {
      name: 'seed',
      type: 'number',
      defaultValue: 42,
      min: 1,
      max: 999999,
      description: 'Deterministic seed for random insertion decisions.',
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

  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep', 'cross_model'],
    variableChanged: 'boundary_character_insertion_density',
    heldConstant: 'seed, prompt_semantics, generation_parameters, guidance',
    hypothesisTested:
      'Injecting invisible boundary marks disrupts sub-word BPE tokenization, causing attribute leakage or semantic drift.',
    weakeningCondition:
      'Applying visible spaces or visible hyphens causes identical attribute leakage, indicating boundary effects are purely semantic rather than Unicode-specific.',
    falsificationCondition:
      'Instrumented token ID inspection reveals the tokenizer produces identical token sequences for both baseline and mutated strings, or the backend strips the characters completely.',
    negativeControlDescription:
      'Raw baseline string without boundary characters, or mutated string normalized via NFKC to strip format marks.',
  },

  defaultDoseSweep: {
    parameter: 'mutationDensity',
    sweepType: 'discrete',
    values: [0.0, 0.15, 0.30, 0.50, 0.75, 1.0],
    unit: 'ratio',
    description: 'Titrates boundary insertion density from 0 (baseline) to 1.0 (every character boundary perturbed).',
  },

  recommendedStageRoles: ['CRUCIBLE'],
  degradationPath:
    'On observable commercial APIs, executes as observable string perturbation while recording TOKENIZATION_UNVERIFIED.',
  tags: ['serialization', 'tokenization', 'unicode', 'sharding', 'hybrid'],
};

/**
 * Executes ASND mutation transformation on a target string.
 */
export function executeAsndMutation(
  canonicalInput: string,
  targetSpan: TargetSpanSelector = { type: 'entire_prompt' },
  options: {
    mutationDensity?: number;
    boundaryStrategy?: string;
    normalizationMode?: NormalizationMode;
    preserveVisibleSurface?: boolean;
    seed?: number;
    limits?: ClampingLimits;
  } = {}
): SerializedMutationResult {
  const density = options.mutationDensity ?? 0.35;
  const strategy = options.boundaryStrategy ?? 'combining_grapheme_joiner';
  const normMode = options.normalizationMode ?? 'RAW';
  const seed = options.seed ?? 42;

  // Select separator code points based on strategy
  let separatorChars: string[] = ['\u034F']; // CGJ default
  if (strategy === 'zero_width_space') {
    separatorChars = ['\u200B'];
  } else if (strategy === 'soft_hyphen') {
    separatorChars = ['\u00AD'];
  } else if (strategy === 'alternating_separators') {
    separatorChars = ['\u034F', '\u200B', '\u200C', '\u2060'];
  }

  const plan: MutationPlan = {
    planId: `ASND-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    operatorId: OPERATOR_ASND.id,
    targetSpan,
    normalizationMode: normMode,
    parameters: {
      mutationDensity: density,
      boundaryStrategy: strategy,
      seed,
    },
    limits: options.limits ?? DEFAULT_CLAMPING_LIMITS,
    seed,
  };

  // If density is 0, return baseline untouched
  if (density <= 0) {
    return executeSpanMutation(canonicalInput, plan, (slice) => slice);
  }

  // Simple deterministic PRNG
  let currentSeed = seed;
  const nextRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  return executeSpanMutation(canonicalInput, plan, (spanText) => {
    const chars = Array.from(spanText);
    let result = '';
    for (let i = 0; i < chars.length; i++) {
      result += chars[i];
      // Do not append separator after space or at the very end
      if (chars[i] !== ' ' && chars[i] !== '\n' && i < chars.length - 1) {
        if (nextRandom() <= density) {
          const sep = separatorChars[Math.floor(nextRandom() * separatorChars.length)];
          result += sep;
        }
      }
    }
    return result;
  });
}

// =======================================================================
// 2. HMC-SPS — HOMOGLYPHIC MANIFOLD COLLISION VIA SUBWORD PHASE SHIFT
// =======================================================================

export const OPERATOR_HMC_SPS: TechnicalOperator = {
  id: 'hmc_sps_homoglyph_collision',
  name: 'Homoglyphic Manifold Collision via Subword Phase Shift',
  shortName: 'HMC-SPS',
  description:
    'Selectively substitutes characters in a target word with visually near-identical glyphs from Greek or Cyrillic to force multi-lingual sub-word vocabulary divergence.',
  version: '1.0.0',
  technicalLayer: 'TOKENIZATION',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Cross-script homoglyphic substitution forces tokenizer vocabulary lookup into alternate multi-lingual or sub-word cluster tokens, potentially inducing semantic neighborhood shifts or token boundary realignment.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis:
        'Cross-script homoglyphic substitution forces tokenizer vocabulary lookup into alternate multi-lingual or sub-word cluster tokens, potentially inducing semantic neighborhood shifts or token boundary realignment.',
      rationale: 'Initial Job 2 formulation. Avoids cultural stereotyping logic; frames purely as sub-word vocabulary divergence.',
    },
  ],

  expectedFailureSurfaces: [
    'SEMANTIC_DRIFT',
    'MATERIAL_SUBSTITUTION',
    'FEATURE_REASSIGNMENT',
    'IDENTITY_LOSS',
  ],
  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    substitutionRatio: {
      name: 'substitutionRatio',
      type: 'number',
      defaultValue: 0.30,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      description: 'Proportion of eligible characters replaced with homoglyphs (0 = baseline).',
    },
    targetScripts: {
      name: 'targetScripts',
      type: 'select',
      defaultValue: 'cyrillic_greek',
      options: ['cyrillic', 'greek', 'cyrillic_greek'],
      description: 'Target script families for homoglyph substitution.',
    },
    preserveVisualSimilarity: {
      name: 'preserveVisualSimilarity',
      type: 'boolean',
      defaultValue: true,
      description: 'Restricts substitution to high-similarity whitelisted glyph pairs (>= 0.90 similarity).',
    },
    seed: {
      name: 'seed',
      type: 'number',
      defaultValue: 42,
      min: 1,
      max: 999999,
      description: 'Deterministic seed for character substitution index selection.',
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

  controls: {
    applicableControls: ['baseline', 'experimental', 'dose_sweep', 'ablation', 'cross_model'],
    variableChanged: 'homoglyph_substitution_ratio',
    heldConstant: 'seed, semantic_intent, base_prompt, inference_parameters',
    hypothesisTested:
      'Substituting visually identical characters across scripts breaks standard subword tokenization and induces semantic drift.',
    weakeningCondition:
      'Substituting visually dissimilar characters or random punctuation induces the exact same drift, indicating drift is generic syntax corruption.',
    falsificationCondition:
      'Tokenizer treats Cyrillic/Greek homoglyphs as identical canonical tokens (due to NFKC normalization) or maps them to [UNK] tokens identically.',
    negativeControlDescription: 'Original baseline prompt with 0% substitution ratio.',
  },

  defaultDoseSweep: {
    parameter: 'substitutionRatio',
    sweepType: 'discrete',
    values: [0.0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.75, 1.0],
    unit: 'ratio',
    description: 'Sweeps substitution from 0% (baseline) to 100% of eligible glyphs.',
  },

  recommendedStageRoles: ['CONTAINER', 'CRUCIBLE'],
  degradationPath:
    'On observable commercial APIs, passes mutated homoglyph string while logging TOKENIZATION_UNVERIFIED.',
  tags: ['serialization', 'tokenization', 'homoglyph', 'subword', 'cross-script'],
};

/**
 * Executes HMC-SPS mutation transformation on a target string.
 */
export function executeHmcSpsMutation(
  canonicalInput: string,
  targetSpan: TargetSpanSelector = { type: 'entire_prompt' },
  options: {
    substitutionRatio?: number;
    targetScripts?: 'cyrillic' | 'greek' | 'cyrillic_greek';
    preserveVisualSimilarity?: boolean;
    seed?: number;
    normalizationMode?: NormalizationMode;
    limits?: ClampingLimits;
  } = {}
): SerializedMutationResult {
  const ratio = options.substitutionRatio ?? 0.30;
  const scriptOption = options.targetScripts ?? 'cyrillic_greek';
  const seed = options.seed ?? 42;
  const normMode = options.normalizationMode ?? 'RAW';

  let scripts: HomoglyphScript[] = ['cyrillic', 'greek'];
  if (scriptOption === 'cyrillic') scripts = ['cyrillic'];
  if (scriptOption === 'greek') scripts = ['greek'];

  const plan: MutationPlan = {
    planId: `HMC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    operatorId: OPERATOR_HMC_SPS.id,
    targetSpan,
    normalizationMode: normMode,
    parameters: {
      substitutionRatio: ratio,
      targetScripts: scriptOption,
      seed,
    },
    limits: options.limits ?? DEFAULT_CLAMPING_LIMITS,
    seed,
  };

  if (ratio <= 0) {
    return executeSpanMutation(canonicalInput, plan, (slice) => slice);
  }

  return executeSpanMutation(canonicalInput, plan, (spanText) => {
    const res = applyHomoglyphSubstitution(spanText, ratio, scripts, seed);
    return res.mutatedText;
  });
}

// =======================================================================
// 3. DS-BFAH — DIACRITIC SATURATION VIA BYTE-FALLBACK ATTENTION HIJACK
// =======================================================================

export const OPERATOR_DS_BFAH: TechnicalOperator = {
  id: 'ds_bfah_diacritic_saturation',
  name: 'Diacritic Saturation via Byte-Fallback Attention Hijack',
  shortName: 'DS-BFAH',
  description:
    'Injects vertical diacritical mark stacks (Zalgo) into targeted spans. Tests whether failure surfaces arise from byte-fallback tokenization, context exhaustion, or generic underconditioning.',
  version: '1.0.0',
  technicalLayer: 'SERIALIZATION',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE', 'VIDEO', 'AUDIO'],

  mechanismHypothesis:
    'Deep combining-mark stacks may alter subword segmentation, trigger byte-fallback token sequences, or disrupt multi-encoder balance; however, observable effects may also arise simply from prompt truncation or context-budget starvation.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis:
        'Deep combining-mark stacks may alter subword segmentation, context allocation, or multi-encoder balance; causal mechanism remains uncertain due to context exhaustion confounds.',
      rationale:
        'Empirical discovery of prompt truncation and context exhaustion confounds. Initial evidence status is strictly MECHANISM_UNCERTAIN.',
    },
  ],

  expectedFailureSurfaces: [
    'UNDERCONDITIONED_OUTPUT',
    'CONTEXT_TRUNCATION',
    'SPATIAL_TEARING',
    'GENERIC_NOISE',
    'STRUCTURAL_STRIATION',
  ],
  requiredCapabilities: ['TEXT_INPUT'],

  parameters: {
    stackDepth: {
      name: 'stackDepth',
      type: 'number',
      defaultValue: 10,
      min: 0,
      max: 80,
      step: 5,
      description: 'Number of combining marks stacked onto each target character (0 = baseline).',
    },
    combiningMarkPool: {
      name: 'combiningMarkPool',
      type: 'select',
      defaultValue: 'balanced',
      options: ['balanced', 'high_marks', 'low_marks', 'strike_overlay'],
      description: 'Vertical direction and typographic category of combining marks.',
    },
    placement: {
      name: 'placement',
      type: 'select',
      defaultValue: 'all_characters',
      options: ['all_characters', 'vowels_only', 'consonants_only', 'word_boundaries'],
      description: 'Which characters receive combining mark stacks.',
    },
    maxExpansion: {
      name: 'maxExpansion',
      type: 'number',
      defaultValue: 10,
      min: 2,
      max: 20,
      step: 1,
      description: 'Strict expansion ratio cap preventing runaway string sizes.',
    },
    seed: {
      name: 'seed',
      type: 'number',
      defaultValue: 42,
      min: 1,
      max: 999999,
      description: 'Deterministic seed for mark selection.',
    },
  },

  // CRITICAL MANDATE: Must strictly begin as MECHANISM_UNCERTAIN
  evidenceStatus: ['PROPOSED', 'OBSERVED', 'MECHANISM_UNCERTAIN'],
  scores: {
    creativeUtility: null, // Left unset until evaluated by operator
    repeatability: null,
    mechanismConfidence: 0.15, // Explicitly low initial confidence due to truncation confound
    modelDependence: null,
    failureToIgnoreRate: null,
  },

  controls: {
    applicableControls: ['baseline', 'experimental', 'dose_sweep', 'ablation', 'negative_control'],
    variableChanged: 'combining_mark_stack_depth',
    heldConstant: 'seed, semantic_prompt_words, inference_steps, guidance',
    hypothesisTested:
      'Diacritic saturation triggers byte-fallback token sequences rather than generic context starvation.',
    weakeningCondition:
      'A neutral token padding prompt that induces identical context truncation produces the exact same failure surface, indicating the effect was purely truncation.',
    falsificationCondition:
      'Target API strips combining marks entirely before inference, or tokenizer drops combining marks without generating byte-level tokens.',
    negativeControlDescription:
      'Truncation Confound Control: Neutral filler prompt matching exact token budget and tail-truncation position.',
  },

  defaultDoseSweep: {
    parameter: 'stackDepth',
    sweepType: 'discrete',
    values: [0, 5, 10, 15, 30, 40, 60, 80],
    unit: 'marks/char',
    description: 'Titrates vertical diacritic depth from 0 (baseline) to 80 combining marks.',
  },

  recommendedStageRoles: ['CRUCIBLE'],
  degradationPath:
    'On observable commercial APIs, passes clamped Zalgo string while logging TOKENIZATION_UNVERIFIED and potential context exhaustion risk.',
  tags: ['serialization', 'combining-marks', 'zalgo', 'context-starvation', 'byte-fallback'],
};

// Combining mark pools for DS-BFAH
const MARKS_HIGH = [
  '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
  '\u0308', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F', '\u0311',
];

const MARKS_LOW = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
  '\u0320', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0332',
];

const MARKS_STRIKE = [
  '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0315', '\u034F',
];

/**
 * Executes DS-BFAH mutation transformation on a target string.
 */
export function executeDsBfahMutation(
  canonicalInput: string,
  targetSpan: TargetSpanSelector = { type: 'entire_prompt' },
  options: {
    stackDepth?: number;
    combiningMarkPool?: 'balanced' | 'high_marks' | 'low_marks' | 'strike_overlay';
    placement?: 'all_characters' | 'vowels_only' | 'consonants_only' | 'word_boundaries';
    seed?: number;
    normalizationMode?: NormalizationMode;
    limits?: ClampingLimits;
  } = {}
): SerializedMutationResult {
  const depth = options.stackDepth ?? 10;
  const poolType = options.combiningMarkPool ?? 'balanced';
  const placement = options.placement ?? 'all_characters';
  const seed = options.seed ?? 42;
  const normMode = options.normalizationMode ?? 'RAW';

  let pool: string[] = [...MARKS_HIGH, ...MARKS_LOW, ...MARKS_STRIKE];
  if (poolType === 'high_marks') pool = MARKS_HIGH;
  if (poolType === 'low_marks') pool = MARKS_LOW;
  if (poolType === 'strike_overlay') pool = MARKS_STRIKE;

  const plan: MutationPlan = {
    planId: `DS-BFAH-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    operatorId: OPERATOR_DS_BFAH.id,
    targetSpan,
    normalizationMode: normMode,
    parameters: {
      stackDepth: depth,
      combiningMarkPool: poolType,
      placement,
      seed,
    },
    limits: options.limits ?? DEFAULT_CLAMPING_LIMITS,
    seed,
  };

  // If stackDepth is 0, return baseline untouched
  if (depth <= 0) {
    return executeSpanMutation(canonicalInput, plan, (slice) => slice);
  }

  // PRNG
  let currentSeed = seed;
  const nextRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  const isVowel = (c: string) => /[aeiouAEIOU]/.test(c);

  return executeSpanMutation(canonicalInput, plan, (spanText) => {
    const chars = Array.from(spanText);
    let result = '';

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      result += char;

      // Skip whitespace
      if (char === ' ' || char === '\n' || char === '\t') continue;

      let eligible = true;
      if (placement === 'vowels_only') eligible = isVowel(char);
      if (placement === 'consonants_only') eligible = !isVowel(char) && /[a-zA-Z]/.test(char);
      if (placement === 'word_boundaries') eligible = i === 0 || i === chars.length - 1;

      if (!eligible) continue;

      for (let d = 0; d < depth; d++) {
        const mark = pool[Math.floor(nextRandom() * pool.length)];
        result += mark;
      }
    }

    return result;
  });
}

// =======================================================================
// 4. OPERATOR COMPOSITION & INCOMPATIBILITY AUDIT
// =======================================================================

export interface CompositionAuditResult {
  isCompatible: boolean;
  warnings: string[];
  risks: Array<{
    riskType: 'CONTEXT_SATURATION' | 'NORMALIZATION_COLLISION' | 'MUTATION_OVERWRITE';
    description: string;
  }>;
}

/**
 * Checks composition rules across serialization operators.
 */
export function checkOperatorCompositionCompatibility(operatorIds: string[]): CompositionAuditResult {
  const warnings: string[] = [];
  const risks: CompositionAuditResult['risks'] = [];

  const hasAsnd = operatorIds.includes('asnd_normalization_desync') || operatorIds.includes('ASND');
  const hasHmc = operatorIds.includes('hmc_sps_homoglyph_collision') || operatorIds.includes('HMC-SPS');
  const hasDsBfah = operatorIds.includes('ds_bfah_diacritic_saturation') || operatorIds.includes('DS-BFAH');

  if (hasDsBfah && hasAsnd) {
    risks.push({
      riskType: 'CONTEXT_SATURATION',
      description:
        'COMPOSITION_RISK: Stacking Diacritic Saturation (DS-BFAH) with Asymmetric Sharding (ASND) creates rapid byte expansion that risks saturating context budget before tokenization boundaries can be tested.',
    });
    warnings.push('Stacking DS-BFAH with ASND risks immediate prompt truncation on fixed-context encoders.');
  }

  if (hasHmc && hasAsnd) {
    risks.push({
      riskType: 'NORMALIZATION_COLLISION',
      description:
        'COMPOSITION_RISK: Combining cross-script homoglyphs with normalization desynchronization may cause downstream normalizers to decompose or drop characters inconsistently across encoders.',
    });
    warnings.push('HMC-SPS and ASND may produce divergent subwords across different multi-encoder branches.');
  }

  return {
    isCompatible: risks.length === 0 || risks.every((r) => r.riskType !== 'CONTEXT_SATURATION'),
    warnings,
    risks,
  };
}
