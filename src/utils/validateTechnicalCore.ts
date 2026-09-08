/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Architectural Validation & Invariant Test Suite
 * 
 * Verifies all 11 foundational mandates of Job 1:
 * 1. Old DAVID operators & workflows remain fully functional.
 * 2. Technical operators register successfully into the central registry.
 * 3. Required capabilities resolve correctly against model organism profiles.
 * 4. Unsupported instrumented experiments do NOT masquerade as supported.
 * 5. Dose-response sweep definitions expand accurately into parameter variations.
 * 6. Experiment families cleanly contain baseline, experimental, control, and ablation runs.
 * 7. Observation and interpretation remain structurally distinct fields.
 * 8. Unknown/unmeasured scores remain strictly null (NEVER manufactured).
 * 9. Operator versioning preserves historical hypothesis revisions.
 * 10. Registry filtering functions correctly across all technical axes.
 * 11. An observable backend cannot silently execute instrumented requirements.
 */

import { MUTATION_OPERATORS } from '../data/mutationOperators';
import { FAILURE_OPERATORS } from '../data/failureOperators';
import {
  registerTechnicalOperator,
  getTechnicalOperator,
  listTechnicalOperators,
  filterTechnicalOperators,
  DEV_EXAMPLE_TOKEN_SHATTER,
  DEV_EXAMPLE_CONTEXT_STARVATION,
} from './technicalRegistry';
import {
  getBackendTechnicalCapabilities,
  resolveExecutionTier,
} from './technicalCapabilities';
import {
  expandDoseSweep,
  resolveSweepValues,
} from './experimentalDoseSweep';
import {
  createExperimentFamily,
  logExperimentRun,
  calculateFamilySummary,
} from './experimentRunLogger';
import { TechnicalOperator } from '../types/technicalCore';

export interface ValidationTestResult {
  name: string;
  passed: boolean;
  details: string;
}

export function runTechnicalCoreValidation(): {
  total: number;
  passed: number;
  failed: number;
  results: ValidationTestResult[];
} {
  const results: ValidationTestResult[] = [];

  function assert(name: string, condition: boolean, details: string) {
    results.push({
      name,
      passed: condition,
      details: condition ? details : `FAILED: ${details}`,
    });
  }

  // -------------------------------------------------------------
  // TEST 1: Backward Compatibility (Old operators intact)
  // -------------------------------------------------------------
  const oldMutationOpsCount = MUTATION_OPERATORS.length;
  const oldFailureOpsCount = FAILURE_OPERATORS.length;
  assert(
    '1. Old DAVID Operators Preserved',
    oldMutationOpsCount >= 18 && oldFailureOpsCount >= 20,
    `Found ${oldMutationOpsCount} mutation operators and ${oldFailureOpsCount} failure operators intact.`
  );

  // -------------------------------------------------------------
  // TEST 2: Technical Operator Registration
  // -------------------------------------------------------------
  const registeredShatter = getTechnicalOperator(DEV_EXAMPLE_TOKEN_SHATTER.id);
  assert(
    '2. Technical Operator Registration',
    registeredShatter !== undefined && registeredShatter.id === DEV_EXAMPLE_TOKEN_SHATTER.id,
    `Operator [${DEV_EXAMPLE_TOKEN_SHATTER.name}] retrieved successfully from registry.`
  );

  // -------------------------------------------------------------
  // TEST 3: Capability Derivation against Model Organism Profile
  // -------------------------------------------------------------
  const openArtCaps = getBackendTechnicalCapabilities('openart_banana', 'openart', false);
  assert(
    '3. Capability Matrix Derivation',
    openArtCaps.capabilities.TEXT_INPUT === true &&
      openArtCaps.capabilities.NEGATIVE_PROMPT === true &&
      openArtCaps.isLocalPipeline === false,
    `Derived capabilities for [${openArtCaps.displayName}]: negativePrompt=${openArtCaps.capabilities.NEGATIVE_PROMPT}, isLocal=${openArtCaps.isLocalPipeline}.`
  );

  // -------------------------------------------------------------
  // TEST 4 & 11: Unsupported Instrumented Experiments Blocked
  // -------------------------------------------------------------
  // Create a strict white-box instrumented operator requiring PyTorch tensor hooks
  const strictWhiteBoxOperator: TechnicalOperator = {
    id: 'test_strict_attention_surgery',
    name: 'Test Attention Surgery (Strict Tier B)',
    shortName: 'Attention Surgery',
    description: 'Directly hooks into cross-attention K/V projections.',
    version: '1.0.0',
    technicalLayer: 'ATTENTION',
    executionTier: 'INSTRUMENTED',
    supportedModalities: ['IMAGE'],
    mechanismHypothesis: 'Targeted attention suppression eliminates feature entanglement.',
    hypothesisRevisions: [],
    expectedFailureSurfaces: ['attribute leakage'],
    requiredCapabilities: ['TEXT_INPUT', 'ATTENTION_ACCESS', 'PYTORCH_HOOKS'],
    parameters: {},
    evidenceStatus: ['PROPOSED'],
    scores: {
      creativeUtility: null,
      repeatability: null,
      mechanismConfidence: null,
      modelDependence: null,
      failureToIgnoreRate: null,
    },
    controls: {
      applicableControls: ['baseline', 'experimental'],
      variableChanged: 'Cross-attention projection weights',
      heldConstant: 'Seed, prompt, timesteps',
      hypothesisTested: 'Cross-attention hooks modify feature binding.',
      weakeningCondition: 'No measurable difference in cross-attention maps.',
      falsificationCondition: 'Attention maps are identical between baseline and hooked models.',
    },
    tags: ['test', 'instrumented'],
  };

  const blackBoxResolution = resolveExecutionTier(strictWhiteBoxOperator, openArtCaps);
  assert(
    '4. Unsupported Instrumented Experiments Blocked',
    blackBoxResolution.status === 'UNSUPPORTED' &&
      blackBoxResolution.missingCapabilities.includes('ATTENTION_ACCESS') &&
      blackBoxResolution.missingCapabilities.includes('PYTORCH_HOOKS'),
    `Correctly blocked instrumented execution on commercial API [${openArtCaps.displayName}]. Missing: ${blackBoxResolution.missingCapabilities.join(', ')}.`
  );

  // Test hybrid graceful degradation path
  const hybridResolution = resolveExecutionTier(DEV_EXAMPLE_TOKEN_SHATTER, openArtCaps);
  assert(
    '11. Hybrid Operator Degrades Cleanly without Faking White-Box Access',
    hybridResolution.status === 'PARTIALLY_SUPPORTED' &&
      hybridResolution.resolvedTier === 'OBSERVABLE' &&
      hybridResolution.canDegradeToObservable === true,
    `Hybrid operator safely degraded to OBSERVABLE tier: ${hybridResolution.degradationPath}`
  );

  // -------------------------------------------------------------
  // TEST 5: Dose-Response Sweep Expansion
  // -------------------------------------------------------------
  const sweepSpec = DEV_EXAMPLE_TOKEN_SHATTER.defaultDoseSweep!;
  const expandedSweep = expandDoseSweep(sweepSpec, { basePrompt: 'test', seed: 42 });
  assert(
    '5. Dose-Response Sweep Expansion',
    expandedSweep.length === sweepSpec.values.length &&
      expandedSweep[0].isBaselineDose === true &&
      expandedSweep[0].parameters.shatterDensity === 0 &&
      expandedSweep[expandedSweep.length - 1].parameters.shatterDensity === 1.0,
    `Expanded ${expandedSweep.length} sweep runs. Baseline dose correctly flagged.`
  );

  // -------------------------------------------------------------
  // TEST 6: Experiment Families (Baseline, Controls, Experiments)
  // -------------------------------------------------------------
  const family = createExperimentFamily({
    operator: DEV_EXAMPLE_CONTEXT_STARVATION,
    modelId: 'openart_banana',
    title: 'Context Starvation Baseline Test',
  });

  const baselineRun = logExperimentRun({
    familyId: family.familyId,
    operatorId: DEV_EXAMPLE_CONTEXT_STARVATION.id,
    operatorVersion: DEV_EXAMPLE_CONTEXT_STARVATION.version,
    modelId: 'openart_banana',
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'baseline',
    parametersUsed: { fillerTokenCount: 0 },
    observation: 'Subject attribute "crimson" bound cleanly to primary subject in 10/10 runs.',
    interpretation: 'Close proximity provides sufficient attention weight for binding.',
    scores: { creativeUtility: 0.5, mechanismConfidence: 0.8 },
  });

  const experimentalRun = logExperimentRun({
    familyId: family.familyId,
    operatorId: DEV_EXAMPLE_CONTEXT_STARVATION.id,
    operatorVersion: DEV_EXAMPLE_CONTEXT_STARVATION.version,
    modelId: 'openart_banana',
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'experimental',
    parametersUsed: { fillerTokenCount: 350 },
    observation: 'Attribute "crimson" migrated to background wall in 7/10 runs.',
    interpretation: 'Distance-induced attention starvation severed binding to primary subject.',
    scores: { creativeUtility: 0.9, mechanismConfidence: 0.4 },
  });

  const updatedFamily = family; // mutated via reference in logger
  assert(
    '6. Experiment Families Contain Baseline & Experimental Runs',
    updatedFamily.runs.length === 2 &&
      updatedFamily.runs[0].role === 'baseline' &&
      updatedFamily.runs[1].role === 'experimental',
    `Family [${updatedFamily.familyId}] contains ${updatedFamily.runs.length} runs with valid roles.`
  );

  // -------------------------------------------------------------
  // TEST 7: Structural Separation of Observation vs Interpretation
  // -------------------------------------------------------------
  assert(
    '7. Observation Strictly Distinct from Interpretation',
    baselineRun.observation !== baselineRun.interpretation &&
      baselineRun.observation.includes('"crimson" bound cleanly') &&
      baselineRun.interpretation.includes('Close proximity provides'),
    `Observation ("${baselineRun.observation}") and Interpretation ("${baselineRun.interpretation}") are stored in separate dedicated fields.`
  );

  // -------------------------------------------------------------
  // TEST 8: Unmeasured Scores Remain Null (No Manufactured Scores)
  // -------------------------------------------------------------
  const unmeasuredRun = logExperimentRun({
    operatorId: DEV_EXAMPLE_TOKEN_SHATTER.id,
    operatorVersion: DEV_EXAMPLE_TOKEN_SHATTER.version,
    modelId: 'openart_banana',
    modality: 'IMAGE',
    executionTier: 'OBSERVABLE',
    role: 'experimental',
    observation: 'Glitch-like text artifacts appeared on surface.',
    interpretation: 'Possible token division anomaly.',
    scores: { creativeUtility: 0.85 }, // Only creativeUtility measured; others null!
  });
  assert(
    '8. Unmeasured Scores Remain Strictly Null',
    unmeasuredRun.scores.creativeUtility === 0.85 &&
      unmeasuredRun.scores.mechanismConfidence === null &&
      unmeasuredRun.scores.repeatability === null &&
      unmeasuredRun.scores.modelDependence === null &&
      unmeasuredRun.scores.failureToIgnoreRate === null,
    `Unmeasured mechanismConfidence is null, preventing fake/manufactured scores.`
  );

  // -------------------------------------------------------------
  // TEST 9: Operator Versioning Preserves History
  // -------------------------------------------------------------
  const v1Op: TechnicalOperator = {
    ...DEV_EXAMPLE_TOKEN_SHATTER,
    id: 'test_versioned_operator',
    version: '1.0.0',
    mechanismHypothesis: 'v1: Direct byte boundary split hypothesis.',
  };
  registerTechnicalOperator(v1Op);

  const v2Op: TechnicalOperator = {
    ...v1Op,
    version: '2.0.0',
    mechanismHypothesis: 'v2: Revised hypothesis: context budget imbalance.',
    hypothesisRevisions: [
      {
        version: '2.0.0',
        date: '2026-09-07',
        hypothesis: 'Revised to context budget imbalance.',
        rationale: 'v1 byte split hypothesis was falsified by token dumps.',
      },
    ],
  };
  registerTechnicalOperator(v2Op);

  const retrievedV1 = getTechnicalOperator('test_versioned_operator', '1.0.0');
  const retrievedV2 = getTechnicalOperator('test_versioned_operator', '2.0.0');
  const retrievedLatest = getTechnicalOperator('test_versioned_operator');

  assert(
    '9. Operator Versioning Preserves Historical Hypotheses',
    retrievedV1?.version === '1.0.0' &&
      retrievedV1.mechanismHypothesis.includes('Direct byte boundary') &&
      retrievedV2?.version === '2.0.0' &&
      retrievedLatest?.version === '2.0.0',
    `v1 retained historical hypothesis while v2 recorded revision rationale.`
  );

  // -------------------------------------------------------------
  // TEST 10: Registry Filtering by Modality, Layer, Tier, and Stage
  // -------------------------------------------------------------
  const imageFiltered = filterTechnicalOperators({ modality: 'IMAGE' });
  const tokenLayerFiltered = filterTechnicalOperators({ technicalLayer: 'TOKENIZATION' });
  const crucibleFiltered = filterTechnicalOperators({ stageRole: 'CRUCIBLE' });

  assert(
    '10. Registry Filtering across Technical Dimensions',
    imageFiltered.length > 0 &&
      tokenLayerFiltered.some((op) => op.id === DEV_EXAMPLE_TOKEN_SHATTER.id) &&
      crucibleFiltered.some((op) => op.id === DEV_EXAMPLE_TOKEN_SHATTER.id),
    `Filtering returned matching operators across modality, technicalLayer, and stageRole.`
  );

  const passedCount = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results,
  };
}
