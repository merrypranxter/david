/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Validation Suite for Tokenizer & Serialization Sabotage Lab
 * 
 * Verifies all Job 2 engineering mandates:
 * 1. ASND mutation and density titrations
 * 2. HMC-SPS homoglyph substitution and script mapping
 * 3. DS-BFAH diacritic saturation and mechanism uncertainty status
 * 4. Clamping safety: semantic text protected, mutation clamped cleanly
 * 5. Escaped representation generation (e.g. m\u034Fand\u034Fible)
 * 6. Central registry integration for ASND, HMC-SPS, DS-BFAH
 * 7. Tokenizer inspection and parity verification across instrumented vs observable tiers
 * 8. Sanitization probe family generation
 * 9. Operator composition conflict audit
 */

import {
  OPERATOR_ASND,
  OPERATOR_HMC_SPS,
  OPERATOR_DS_BFAH,
  executeAsndMutation,
  executeHmcSpsMutation,
  executeDsBfahMutation,
  checkOperatorCompositionCompatibility,
} from '../operators/serializationOperators';
import { getTechnicalOperator, listTechnicalOperators } from './technicalRegistry';
import {
  executeSpanMutation,
  enforceClampingLimits,
  generateMachineEscapedView,
  countCodePoints,
  countUTF8Bytes,
} from './serializationEngine';
import {
  inspectMultiEncoderTokenization,
  evaluateTokenizationParity,
  buildTruncationConfoundControl,
} from './tokenizerInspection';
import { buildSanitizationProbeFamily } from './sanitizationProbes';
import { SERIALIZATION_PRESETS, generatePresetExperimentFamily } from './serializationPresets';
import { getBackendTechnicalCapabilities } from './technicalCapabilities';

export interface ValidationTestResult {
  suiteName: string;
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
  summary: string;
}

export function runJob2ValidationSuite(): ValidationTestResult {
  const checks: ValidationTestResult['checks'] = [];
  const testPhrase = 'mandible obsidian';

  // 1. ASND OPERATOR VERIFICATION
  try {
    const baselineRes = executeAsndMutation(testPhrase, { type: 'entire_prompt' }, { mutationDensity: 0.0 });
    const mutRes = executeAsndMutation(testPhrase, { type: 'entire_prompt' }, { mutationDensity: 0.60, seed: 101 });

    const baselineEqual = baselineRes.serializedExperimentalInput === testPhrase;
    const mutHasMarks = mutRes.diagnostics.mutatedCodePoints > baselineRes.diagnostics.originalCodePoints;
    const hasEscapedSlash = mutRes.escapedView.includes('\\u');

    checks.push({
      name: 'ASND: 0.0 density preserves exact baseline',
      passed: baselineEqual,
      details: `Input: "${testPhrase}", Output: "${baselineRes.serializedExperimentalInput}"`,
    });

    checks.push({
      name: 'ASND: mutation injects non-rendering separators',
      passed: mutHasMarks && hasEscapedSlash,
      details: `Escaped view: ${mutRes.escapedView}`,
    });
  } catch (err: any) {
    checks.push({ name: 'ASND execution', passed: false, details: err.message });
  }

  // 2. HMC-SPS OPERATOR VERIFICATION
  try {
    const baselineRes = executeHmcSpsMutation(testPhrase, { type: 'entire_prompt' }, { substitutionRatio: 0.0 });
    const mutRes = executeHmcSpsMutation(testPhrase, { type: 'entire_prompt' }, { substitutionRatio: 0.50, seed: 202 });

    const baselineEqual = baselineRes.serializedExperimentalInput === testPhrase;
    const hasNonAscii = /[^\x00-\x7F]/.test(mutRes.serializedExperimentalInput);
    const lengthSame = countCodePoints(mutRes.serializedExperimentalInput) === countCodePoints(testPhrase);

    checks.push({
      name: 'HMC-SPS: 0.0 ratio preserves baseline string',
      passed: baselineEqual,
      details: `Output: "${baselineRes.serializedExperimentalInput}"`,
    });

    checks.push({
      name: 'HMC-SPS: substitutes Latin with non-ASCII Greek/Cyrillic homoglyphs with 1:1 code point preservation',
      passed: hasNonAscii && lengthSame,
      details: `Original: ${testPhrase} -> Mutated: ${mutRes.serializedExperimentalInput} (Escaped: ${mutRes.escapedView})`,
    });
  } catch (err: any) {
    checks.push({ name: 'HMC-SPS execution', passed: false, details: err.message });
  }

  // 3. DS-BFAH OPERATOR VERIFICATION
  try {
    const baselineRes = executeDsBfahMutation(testPhrase, { type: 'entire_prompt' }, { stackDepth: 0 });
    const mutRes = executeDsBfahMutation(testPhrase, { type: 'entire_prompt' }, { stackDepth: 15, seed: 303 });

    const baselineEqual = baselineRes.serializedExperimentalInput === testPhrase;
    const expandedBytes = mutRes.diagnostics.mutatedByteLength > baselineRes.diagnostics.originalByteLength;
    const operatorObj = getTechnicalOperator('DS-BFAH');
    const isMechanismUncertain = operatorObj?.evidenceStatus.includes('MECHANISM_UNCERTAIN') ?? false;

    checks.push({
      name: 'DS-BFAH: 0 stack depth preserves baseline',
      passed: baselineEqual,
      details: `Bytes: ${baselineRes.diagnostics.originalByteLength}B`,
    });

    checks.push({
      name: 'DS-BFAH: stacks combining marks and tracks byte expansion',
      passed: expandedBytes,
      details: `Original: ${baselineRes.diagnostics.originalByteLength}B -> Saturated: ${mutRes.diagnostics.mutatedByteLength}B`,
    });

    checks.push({
      name: 'DS-BFAH: registered with explicit MECHANISM_UNCERTAIN evidence status',
      passed: isMechanismUncertain,
      details: `Evidence status: ${operatorObj?.evidenceStatus.join(', ')}`,
    });
  } catch (err: any) {
    checks.push({ name: 'DS-BFAH execution', passed: false, details: err.message });
  }

  // 4. CLAMPING AND SAFETY INTEGRITY
  try {
    const massiveZalgo = 'a' + '\u0300'.repeat(15000); // Exceeds byte and ratio limits
    const clamped = enforceClampingLimits('a', massiveZalgo, {
      maxExpansionRatio: 3.0,
      maxUTF8Bytes: 500,
      maxMutationCharacters: 200,
      maxGeneratedCodePoints: 200,
    });

    const clampPassed = clamped.isClamped === true && countUTF8Bytes(clamped.clampedString) <= 500;
    const basePreserved = clamped.clampedString.startsWith('a');

    checks.push({
      name: 'Safety: enforceClampingLimits clamps runaway mutation without corrupting semantic base',
      passed: clampPassed && basePreserved,
      details: `Input: ${countUTF8Bytes(massiveZalgo)}B -> Clamped: ${countUTF8Bytes(clamped.clampedString)}B, Reason: ${clamped.clampReason}`,
    });
  } catch (err: any) {
    checks.push({ name: 'Clamping limits verification', passed: false, details: err.message });
  }

  // 5. REGISTRY LOOKUP INTEGRITY
  try {
    const op1 = getTechnicalOperator('asnd_normalization_desync');
    const op1Short = getTechnicalOperator('ASND');
    const op2Short = getTechnicalOperator('HMC-SPS');
    const op3Short = getTechnicalOperator('DS-BFAH');

    const regPassed =
      Boolean(op1 && op1Short && op1.id === op1Short.id) &&
      Boolean(op2Short && op2Short.id === OPERATOR_HMC_SPS.id) &&
      Boolean(op3Short && op3Short.id === OPERATOR_DS_BFAH.id);

    checks.push({
      name: 'Registry: Operators resolved by exact ID and shortName (ASND, HMC-SPS, DS-BFAH)',
      passed: regPassed,
      details: `Resolved: [${op1?.shortName}], [${op2Short?.shortName}], [${op3Short?.shortName}]`,
    });
  } catch (err: any) {
    checks.push({ name: 'Registry verification', passed: false, details: err.message });
  }

  // 6. TOKENIZATION PARITY & TIER BEHAVIOR
  try {
    const localPipeline = getBackendTechnicalCapabilities('flux-dev', 'midjourney_flux', true);
    const commercialApi = getBackendTechnicalCapabilities('gemini-3.1-flash-lite', 'openart', false);

    // Test on local instrumented pipeline
    const localInspection = inspectMultiEncoderTokenization('cybernetic arachnid', localPipeline);
    const localParity = evaluateTokenizationParity(
      'cybernetic arachnid',
      'c\u034Fybernetic arachnid',
      localPipeline
    );

    // Test on closed commercial API
    const remoteInspection = inspectMultiEncoderTokenization('cybernetic arachnid', commercialApi);
    const remoteParity = evaluateTokenizationParity(
      'cybernetic arachnid',
      'c\u034Fybernetic arachnid',
      commercialApi
    );

    const localPassed =
      localInspection.isInstrumented === true &&
      Boolean(localInspection.encoders['clip_l']) &&
      localParity.tokenizationDiverged === true;

    const remotePassed =
      remoteInspection.isInstrumented === false &&
      remoteParity.mechanismEvidence === 'TOKENIZATION_UNVERIFIED';

    checks.push({
      name: 'Tokenization: Instrumented tier evaluates multi-encoder token divergence',
      passed: localPassed,
      details: `Local encoders: ${Object.keys(localInspection.encoders).join(', ')}, Parity: ${localParity.mechanismEvidence}`,
    });

    checks.push({
      name: 'Tokenization: Observable commercial tier cleanly records TOKENIZATION_UNVERIFIED',
      passed: remotePassed,
      details: `Evidence: ${remoteParity.mechanismEvidence}, Reason: ${remoteInspection.unverifiedReason?.slice(0, 45)}...`,
    });
  } catch (err: any) {
    checks.push({ name: 'Tokenization inspection', passed: false, details: err.message });
  }

  // 7. SANITIZATION PROBE GENERATION
  try {
    const { family, runs } = buildSanitizationProbeFamily(
      OPERATOR_ASND.id,
      'gemini-3.1-flash-lite',
      'obsidian pillar',
      'ob\u034Fsidian pil\u034Flar'
    );

    const roles = runs.map((r) => r.role);
    const expectedRoles = ['baseline', 'experimental', 'negative_control', 'ablation'];
    const probePassed = runs.length === 4 && expectedRoles.every((r) => roles.includes(r as any));

    checks.push({
      name: 'Sanitization Probes: Generates 4-condition experiment family (baseline, mutated, NFKC, stripped)',
      passed: probePassed,
      details: `Generated runs: ${runs.map((r) => `${r.role}: ${r.parametersUsed.variant}`).join(' | ')}`,
    });
  } catch (err: any) {
    checks.push({ name: 'Sanitization probe family', passed: false, details: err.message });
  }

  // 8. TRUNCATION CONFOUND CONTROL
  try {
    const confound = buildTruncationConfoundControl('giant obsidian monolith in the desert under twilight', 'monolith'.repeat(30), 77);
    const confoundValid =
      typeof confound.mutatedTokenCount === 'number' &&
      typeof confound.truncationEquivalentPrompt === 'string' &&
      confound.truncationEquivalentPrompt.length > 0;

    checks.push({
      name: 'Truncation Confound: Builds matched token-budget neutral filler prompt to isolate context collapse',
      passed: confoundValid,
      details: `Equivalent prompt tokens: ${confound.mutatedTokenCount}, Lost words: ${confound.tailTokensLost.join(', ') || 'none'}`,
    });
  } catch (err: any) {
    checks.push({ name: 'Truncation confound test', passed: false, details: err.message });
  }

  // 9. OPERATOR COMPOSITION AUDIT
  try {
    const conflictResult = checkOperatorCompositionCompatibility(['DS-BFAH', 'ASND']);
    const nonConflictResult = checkOperatorCompositionCompatibility(['HMC-SPS']);

    const auditPassed =
      conflictResult.risks.some((r) => r.riskType === 'CONTEXT_SATURATION') &&
      nonConflictResult.risks.length === 0;

    checks.push({
      name: 'Composition: Flags CONTEXT_SATURATION risk when stacking DS-BFAH and ASND',
      passed: auditPassed,
      details: `Conflict warning: ${conflictResult.warnings[0] || 'none'}`,
    });
  } catch (err: any) {
    checks.push({ name: 'Composition audit', passed: false, details: err.message });
  }

  const allPassed = checks.every((c) => c.passed);
  return {
    suiteName: 'DAVID Job 2: Tokenizer & Serialization Sabotage Suite',
    passed: allPassed,
    checks,
    summary: `${checks.filter((c) => c.passed).length}/${checks.length} assertions passed.`,
  };
}
