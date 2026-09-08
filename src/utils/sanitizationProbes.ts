/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Sanitization Probes & Empirical Verification Controls
 * 
 * CORE CONTRACT:
 * Commercial generative APIs often invisibly apply Unicode normalization (NFC/NFKC),
 * strip zero-width characters, or clean diacritical stacks before passing prompts to models.
 * 
 * Rather than guessing what an API does, DAVID builds empirical probe families:
 * 1. BASELINE: The canonical prompt
 * 2. MUTATED: The raw serialization mutation
 * 3. NORMALIZED_MUTATED: The mutation pre-normalized via standard NFC/NFKC
 * 4. STRIPPED_MUTATED: The mutation with all non-ASCII / zero-width / combining marks stripped
 * 
 * If (2), (3), and (4) produce identical results or matching text confirmations,
 * SANITIZATION_CONFIRMED or SANITIZATION_SUSPECTED is recorded.
 */

import { SanitizationProbeVariants } from '../types/serialization';
import { ExperimentFamily, ExperimentRunRecord } from '../types/technicalCore';
import { createExperimentFamily, logExperimentRun } from './experimentRunLogger';
import { getTechnicalOperator } from './technicalRegistry';
import { OPERATOR_ASND } from '../operators/serializationOperators';

/**
 * Strips non-rendering separators and combining marks to create an explicit stripped control.
 */
export function stripZeroWidthAndCombiningMarks(text: string): string {
  // Removes zero-width characters, combining diacritics, and format marks
  return text
    .replace(/[\u200B-\u200D\uFEFF\u2060\u00AD\u034F]/g, '') // Zero-width & joiners
    .replace(/[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g, '') // Combining marks
    .normalize('NFC');
}

/**
 * Generates the 4 standardized probe variants for an input and its mutation.
 */
export function createSanitizationProbeVariants(
  baselinePrompt: string,
  mutatedPrompt: string
): SanitizationProbeVariants {
  return {
    baseline: baselinePrompt,
    mutated: mutatedPrompt,
    normalizedMutated: mutatedPrompt.normalize('NFKC'),
    strippedMutated: stripZeroWidthAndCombiningMarks(mutatedPrompt),
  };
}

/**
 * Initializes an ExperimentFamily configured with the 4 sanitization probe runs.
 */
export function buildSanitizationProbeFamily(
  operatorId: string,
  modelId: string,
  canonicalPrompt: string,
  mutatedPrompt: string,
  seed: number = 42
): {
  family: ExperimentFamily;
  runs: ExperimentRunRecord[];
} {
  const variants = createSanitizationProbeVariants(canonicalPrompt, mutatedPrompt);
  const operator = getTechnicalOperator(operatorId) || OPERATOR_ASND;

  const family = createExperimentFamily({
    operator,
    modelId,
    title: `Sanitization Probe: ${operator.shortName} on [${modelId}]`,
    customHypothesis:
      'Tests whether target backend preserves, normalizes, or strips the serialization mutation before conditioning.',
    customFalsificationCondition:
      'Output of raw MUTATED run is identical across multiple seeds to STRIPPED_MUTATED run, indicating server-side sanitization.',
    variableChanged: 'serialization_sanitization_variant',
    heldConstant: 'seed, base_prompt, model, inference_parameters',
  });

  const runs: ExperimentRunRecord[] = [];

  // 1. Baseline
  const r1 = logExperimentRun({
    familyId: family.familyId,
    operatorId: operator.id,
    operatorVersion: operator.version,
    modelId,
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'baseline',
    seed,
    parametersUsed: { variant: 'baseline' },
    outputs: { promptText: variants.baseline },
    observation: 'Baseline prompt submitted with canonical Unicode representation.',
    interpretation: 'Reference benchmark for normal model conditioning behavior.',
    scores: {
      creativeUtility: null,
      repeatability: null,
      mechanismConfidence: null,
      modelDependence: null,
      failureToIgnoreRate: null,
    },
    evidenceStatus: ['OBSERVED'],
  });
  runs.push(r1);

  // 2. Mutated
  const r2 = logExperimentRun({
    familyId: family.familyId,
    operatorId: operator.id,
    operatorVersion: operator.version,
    modelId,
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'experimental',
    seed,
    parametersUsed: { variant: 'mutated' },
    outputs: { promptText: variants.mutated },
    observation: 'Mutated prompt with raw Unicode boundary marks submitted to backend.',
    interpretation: 'Target test condition: may trigger tokenization divergence or be sanitized.',
    scores: {
      creativeUtility: null,
      repeatability: null,
      mechanismConfidence: null,
      modelDependence: null,
      failureToIgnoreRate: null,
    },
    evidenceStatus: ['OBSERVED'],
  });
  runs.push(r2);

  // 3. Normalized Mutated
  const r3 = logExperimentRun({
    familyId: family.familyId,
    operatorId: operator.id,
    operatorVersion: operator.version,
    modelId,
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'negative_control',
    seed,
    parametersUsed: { variant: 'normalized_nfkc' },
    outputs: { promptText: variants.normalizedMutated },
    observation: 'Mutated prompt passed through NFKC normalization before submission.',
    interpretation: 'Controls for standard Unicode normalization pipelines.',
    scores: {
      creativeUtility: null,
      repeatability: null,
      mechanismConfidence: null,
      modelDependence: null,
      failureToIgnoreRate: null,
    },
    evidenceStatus: ['OBSERVED'],
  });
  runs.push(r3);

  // 4. Stripped Mutated
  const r4 = logExperimentRun({
    familyId: family.familyId,
    operatorId: operator.id,
    operatorVersion: operator.version,
    modelId,
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'ablation',
    seed,
    parametersUsed: { variant: 'stripped' },
    outputs: { promptText: variants.strippedMutated },
    observation: 'All non-rendering separators and combining marks explicitly removed.',
    interpretation: 'Ablation control: demonstrates behavior if backend sanitizes input completely.',
    scores: {
      creativeUtility: null,
      repeatability: null,
      mechanismConfidence: null,
      modelDependence: null,
      failureToIgnoreRate: null,
    },
    evidenceStatus: ['OBSERVED'],
  });
  runs.push(r4);

  return { family, runs };
}
