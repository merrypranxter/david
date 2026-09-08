/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 2: Technical Experiment Presets for Serialization Sabotage
 * 
 * CORE CONTRACT:
 * Technical presets generate structured experiment configurations and sweeps
 * through the Job 1 experiment system rather than hardcoding aesthetic prompts.
 * They are agnostic to any single visual subject.
 */

import { SerializationPreset, SerializationPresetId } from '../types/serialization';
import { ExperimentFamily } from '../types/technicalCore';
import { createExperimentFamily, logExperimentRun } from './experimentRunLogger';
import { expandDoseSweep } from './experimentalDoseSweep';
import {
  OPERATOR_ASND,
  OPERATOR_HMC_SPS,
  OPERATOR_DS_BFAH,
  executeAsndMutation,
  executeHmcSpsMutation,
  executeDsBfahMutation,
} from '../operators/serializationOperators';
import { buildSanitizationProbeFamily } from './sanitizationProbes';
import { buildTruncationConfoundControl } from './tokenizerInspection';

export const SERIALIZATION_PRESETS: Record<SerializationPresetId, SerializationPreset> = {
  ASND_DENSITY_SWEEP: {
    id: 'ASND_DENSITY_SWEEP',
    name: 'ASND Boundary Density Sweep',
    shortDescription: 'Titrates invisible boundary mark density from 0% (baseline) to 100% of character boundaries.',
    operatorId: OPERATOR_ASND.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      boundaryStrategy: 'combining_grapheme_joiner',
      normalizationMode: 'RAW',
    },
    notes: 'Identifies the threshold where subword tokenization splits induce attribute leakage or semantic drift.',
  },

  HOMOGLYPH_RATIO_SWEEP: {
    id: 'HOMOGLYPH_RATIO_SWEEP',
    name: 'Homoglyph Substitution Ratio Sweep',
    shortDescription: 'Sweeps cross-script substitution (Latin -> Cyrillic/Greek) across 0%, 10%, 25%, 50%, 75%, 100%.',
    operatorId: OPERATOR_HMC_SPS.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      targetScripts: 'cyrillic_greek',
      preserveVisualSimilarity: true,
    },
    notes: 'Maps behavior transitions from baseline concept retention to hybrid leakage and complete semantic loss.',
  },

  DIACRITIC_DEPTH_SWEEP: {
    id: 'DIACRITIC_DEPTH_SWEEP',
    name: 'Diacritic Saturation Depth Sweep',
    shortDescription: 'Increases vertical combining mark depth from 0 through 80 marks per character.',
    operatorId: OPERATOR_DS_BFAH.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      combiningMarkPool: 'balanced',
      placement: 'all_characters',
    },
    notes: 'Investigates the boundary between typographic noise, byte-fallback tokens, and context budget collapse.',
  },

  NORMALIZATION_COMPARISON: {
    id: 'NORMALIZATION_COMPARISON',
    name: 'Unicode Normalization Mode Comparison',
    shortDescription: 'Compares RAW, NFC, NFD, NFKC, and NFKD representations of the same mutated input.',
    operatorId: OPERATOR_ASND.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      mutationDensity: 0.50,
      boundaryStrategy: 'combining_grapheme_joiner',
    },
    notes: 'Determines whether model conditioning differs across canonically equivalent or compatibility representations.',
  },

  TOKENIZATION_PARITY_TEST: {
    id: 'TOKENIZATION_PARITY_TEST',
    name: 'Raw Tokenization Parity Control',
    shortDescription: 'Verifies whether the mutated input alters the token ID sequence or produces identical tokens.',
    operatorId: OPERATOR_ASND.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      mutationDensity: 0.40,
    },
    notes: 'Crucial verification: If token IDs are identical, tokenization-level hypothesis is unverified.',
  },

  TRUNCATION_CONFOUND_TEST: {
    id: 'TRUNCATION_CONFOUND_TEST',
    name: 'Truncation Confound Control Test',
    shortDescription: 'Compares a heavy Zalgo expansion against a neutral token padding prompt with matching token budget.',
    operatorId: OPERATOR_DS_BFAH.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      stackDepth: 25,
    },
    notes: 'Separates true byte-fallback mechanisms from simple context-budget truncation artifacts.',
  },

  SANITIZATION_PROBE: {
    id: 'SANITIZATION_PROBE',
    name: 'Platform Sanitization Probe',
    shortDescription: 'Submits Baseline, Raw Mutated, NFKC Normalized, and Stripped controls to test API filtering.',
    operatorId: OPERATOR_ASND.id,
    recommendedModality: 'IMAGE',
    defaultParameters: {
      mutationDensity: 0.50,
    },
    notes: 'Probes whether commercial APIs strip or normalize zero-width characters before passing to the model.',
  },
};

/**
 * Builds an experimental family for a chosen Serialization Preset.
 */
export function generatePresetExperimentFamily(
  presetId: SerializationPresetId,
  canonicalPrompt: string,
  modelId: string = 'gemini-3.1-flash-lite',
  seed: number = 42
): {
  family: ExperimentFamily;
  runsSummary: string;
} {
  const preset = SERIALIZATION_PRESETS[presetId];

  switch (presetId) {
    case 'ASND_DENSITY_SWEEP': {
      const family = createExperimentFamily({
        operator: OPERATOR_ASND,
        modelId,
        title: `ASND Density Sweep on [${modelId}]`,
        customHypothesis: OPERATOR_ASND.mechanismHypothesis,
        customFalsificationCondition: OPERATOR_ASND.controls.falsificationCondition,
        variableChanged: 'mutationDensity',
        heldConstant: 'seed, base_prompt, model',
      });

      const sweepRuns = expandDoseSweep(OPERATOR_ASND.defaultDoseSweep!);
      sweepRuns.forEach((sweep) => {
        const mutatedRes = executeAsndMutation(canonicalPrompt, { type: 'entire_prompt' }, {
          mutationDensity: Number(sweep.value),
          seed,
        });

        logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_ASND.id,
          operatorVersion: '1.0.0',
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: sweep.isBaselineDose ? 'baseline' : 'dose_sweep',
          seed,
          parametersUsed: { mutationDensity: sweep.value },
          outputs: { promptText: mutatedRes.serializedExperimentalInput },
          observation: `ASND mutation density set to ${sweep.value}. Mutated length: ${mutatedRes.diagnostics.mutatedLength} chars.`,
          interpretation: sweep.isBaselineDose
            ? 'Baseline control run.'
            : 'Evaluating subword token boundary fragmentation at titrating density.',
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: null,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED'],
        });
      });

      return {
        family,
        runsSummary: `Generated ${sweepRuns.length} dose-response runs across densities 0.0 to 1.0.`,
      };
    }

    case 'HOMOGLYPH_RATIO_SWEEP': {
      const family = createExperimentFamily({
        operator: OPERATOR_HMC_SPS,
        modelId,
        title: `Homoglyph Ratio Sweep on [${modelId}]`,
        customHypothesis: OPERATOR_HMC_SPS.mechanismHypothesis,
        customFalsificationCondition: OPERATOR_HMC_SPS.controls.falsificationCondition,
        variableChanged: 'substitutionRatio',
        heldConstant: 'seed, base_prompt, model',
      });

      const sweepRuns = expandDoseSweep(OPERATOR_HMC_SPS.defaultDoseSweep!);
      sweepRuns.forEach((sweep) => {
        const mutatedRes = executeHmcSpsMutation(canonicalPrompt, { type: 'entire_prompt' }, {
          substitutionRatio: Number(sweep.value),
          seed,
        });

        logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_HMC_SPS.id,
          operatorVersion: '1.0.0',
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: sweep.isBaselineDose ? 'baseline' : 'dose_sweep',
          seed,
          parametersUsed: { substitutionRatio: sweep.value },
          outputs: { promptText: mutatedRes.serializedExperimentalInput },
          observation: `Homoglyph substitution ratio set to ${sweep.value}. Mutated: "${mutatedRes.escapedView.slice(0, 40)}..."`,
          interpretation: sweep.isBaselineDose
            ? 'Baseline control run.'
            : 'Cross-script substitution testing vocabulary cluster phase shift.',
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: null,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED'],
        });
      });

      return {
        family,
        runsSummary: `Generated ${sweepRuns.length} runs sweeping substitution ratios 0.0 to 1.0.`,
      };
    }

    case 'DIACRITIC_DEPTH_SWEEP': {
      const family = createExperimentFamily({
        operator: OPERATOR_DS_BFAH,
        modelId,
        title: `Diacritic Saturation Depth Sweep on [${modelId}]`,
        customHypothesis: OPERATOR_DS_BFAH.mechanismHypothesis,
        customFalsificationCondition: OPERATOR_DS_BFAH.controls.falsificationCondition,
        variableChanged: 'stackDepth',
        heldConstant: 'seed, base_prompt, model',
      });

      const sweepRuns = expandDoseSweep(OPERATOR_DS_BFAH.defaultDoseSweep!);
      sweepRuns.forEach((sweep) => {
        const mutatedRes = executeDsBfahMutation(canonicalPrompt, { type: 'entire_prompt' }, {
          stackDepth: Number(sweep.value),
          seed,
        });

        logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_DS_BFAH.id,
          operatorVersion: '1.0.0',
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: sweep.isBaselineDose ? 'baseline' : 'dose_sweep',
          seed,
          parametersUsed: { stackDepth: sweep.value },
          outputs: { promptText: mutatedRes.serializedExperimentalInput },
          observation: `Diacritic stack depth ${sweep.value} applied. Result byte size: ${mutatedRes.diagnostics.mutatedByteLength}B, Clamped: ${mutatedRes.diagnostics.clamped}.`,
          interpretation: sweep.isBaselineDose
            ? 'Baseline un-mutated control.'
            : 'Evaluating diacritic saturation vs context exhaustion risk.',
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: 0.15,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED', 'MECHANISM_UNCERTAIN'],
        });
      });

      return {
        family,
        runsSummary: `Generated ${sweepRuns.length} runs sweeping stack depth from 0 to 80 marks.`,
      };
    }

    case 'NORMALIZATION_COMPARISON': {
      const family = createExperimentFamily({
        operator: OPERATOR_ASND,
        modelId,
        title: `Unicode Normalization Comparison on [${modelId}]`,
        customHypothesis: 'Different Unicode normalization forms (NFC, NFD, NFKC, NFKD) may alter model conditioning.',
        customFalsificationCondition: 'Outputs across all 4 normalization modes are bitwise identical.',
        variableChanged: 'normalizationMode',
        heldConstant: 'base_mutation, seed, model',
      });

      const modes: Array<'RAW' | 'NFC' | 'NFD' | 'NFKC' | 'NFKD'> = ['RAW', 'NFC', 'NFD', 'NFKC', 'NFKD'];
      modes.forEach((mode) => {
        const mutatedRes = executeAsndMutation(canonicalPrompt, { type: 'entire_prompt' }, {
          mutationDensity: 0.50,
          normalizationMode: mode,
          seed,
        });

        logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_ASND.id,
          operatorVersion: '1.0.0',
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: mode === 'RAW' ? 'baseline' : 'experimental',
          seed,
          parametersUsed: { normalizationMode: mode },
          outputs: { promptText: mutatedRes.serializedExperimentalInput },
          observation: `Normalization mode [${mode}]. Length: ${mutatedRes.diagnostics.mutatedLength} chars, ${mutatedRes.diagnostics.mutatedByteLength} bytes.`,
          interpretation: `Testing whether normalization form ${mode} modifies tokenization or is preserved.`,
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: null,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED'],
        });
      });

      return {
        family,
        runsSummary: `Generated 5 runs comparing RAW, NFC, NFD, NFKC, and NFKD.`,
      };
    }

    case 'TRUNCATION_CONFOUND_TEST': {
      const family = createExperimentFamily({
        operator: OPERATOR_DS_BFAH,
        modelId,
        title: `Truncation Confound Test on [${modelId}]`,
        customHypothesis:
          'Isolates whether visual disruption from Diacritic Saturation is due to byte-fallback attention hijack or simple context-budget truncation.',
        customFalsificationCondition:
          'Neutral filler prompt truncated at identical boundary exhibits the exact same visual artifact as the saturated prompt.',
        variableChanged: 'truncation_vs_byte_mutation',
        heldConstant: 'token_budget, tail_truncation_point, seed, model',
      });

      const zalgoRes = executeDsBfahMutation(canonicalPrompt, { type: 'entire_prompt' }, {
        stackDepth: 30,
        seed,
      });

      const truncationControl = buildTruncationConfoundControl(
        canonicalPrompt,
        zalgoRes.serializedExperimentalInput,
        77
      );

      // Run 1: Zalgo Mutated
      logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_DS_BFAH.id,
        operatorVersion: '1.0.0',
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { stackDepth: 30, type: 'zalgo_mutation' },
        outputs: { promptText: zalgoRes.serializedExperimentalInput },
        observation: `Zalgo saturated prompt: ${zalgoRes.diagnostics.mutatedByteLength}B. Potential lost tail words: ${truncationControl.tailTokensLost.join(', ') || 'none'}.`,
        interpretation: 'Experimental condition: tests if diacritic bytes cause novel latent activation.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: 0.15,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED', 'MECHANISM_UNCERTAIN'],
      });

      // Run 2: Neutral Truncation Control
      logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_DS_BFAH.id,
        operatorVersion: '1.0.0',
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'negative_control',
        seed,
        parametersUsed: { type: 'neutral_filler_truncation' },
        outputs: { promptText: truncationControl.truncationEquivalentPrompt },
        observation: `Neutral truncation control prompt consuming matching token count without Zalgo marks.`,
        interpretation:
          'Confound control: if this matches Run 1 failure surface, Zalgo mechanism confidence is falsified.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });

      return {
        family,
        runsSummary: `Generated 2 paired runs: Diacritic Saturation vs. Neutral Truncation Confound Control.`,
      };
    }

    case 'SANITIZATION_PROBE': {
      const mutRes = executeAsndMutation(canonicalPrompt, { type: 'entire_prompt' }, {
        mutationDensity: 0.50,
        seed,
      });

      const { family } = buildSanitizationProbeFamily(
        OPERATOR_ASND.id,
        modelId,
        canonicalPrompt,
        mutRes.serializedExperimentalInput,
        seed
      );

      return {
        family,
        runsSummary: `Generated 4 sanitization probe runs: Baseline, Mutated, Normalized (NFKC), and Stripped.`,
      };
    }

    case 'TOKENIZATION_PARITY_TEST':
    default: {
      const family = createExperimentFamily({
        operator: OPERATOR_ASND,
        modelId,
        title: `Tokenization Parity Verification on [${modelId}]`,
        customHypothesis: 'Determines if boundary mutation induces token divergence across encoders.',
        customFalsificationCondition: 'Token ID inspection reveals identical token IDs (NO_TOKENIZATION_CHANGE).',
        variableChanged: 'boundary_injection',
        heldConstant: 'seed, base_prompt, model',
      });

      const asndRes = executeAsndMutation(canonicalPrompt, { type: 'entire_prompt' }, {
        mutationDensity: 0.40,
        seed,
      });

      // Baseline
      logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_ASND.id,
        operatorVersion: '1.0.0',
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'baseline',
        seed,
        parametersUsed: { density: 0 },
        outputs: { promptText: canonicalPrompt },
        observation: 'Canonical input submitted for baseline token ID sequence reference.',
        interpretation: 'Baseline tokenization mapping.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['OBSERVED'],
      });

      // Mutated
      logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_ASND.id,
        operatorVersion: '1.0.0',
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { density: 0.40 },
        outputs: { promptText: asndRes.serializedExperimentalInput },
        observation: `Mutated input submitted for token sequence inspection. Escaped: ${asndRes.escapedView.slice(0, 50)}.`,
        interpretation: 'Evaluates if sub-word token boundaries diverged from baseline.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });

      return {
        family,
        runsSummary: `Generated 2 paired runs for Tokenization Parity Analysis.`,
      };
    }
  }
}
