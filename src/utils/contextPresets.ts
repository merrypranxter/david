/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 3: Context Budget & Binding Failure Presets & Experiment Families
 * 
 * Generates structured ExperimentFamily records and sweeps via Job 1:
 * - RBC_DISTANCE_SWEEP
 * - RBC_DISTRACTOR_DENSITY_SWEEP
 * - BINDING_ADJACENCY_CONTROL (Mandatory negative control)
 * - ACRP_REPETITION_COUNT_SWEEP
 * - ACRP_REPETITION_GEOMETRY_COMPARISON
 * - PRIMACY_RECENCY_INVERSION
 * - DEFERRED_ENTITY_TEST
 * - HANDOFF_SPLIT_TEST (Observable precursor to Multimodal Context Handoff)
 * - LENGTH_MATCHED_CONTROL
 */

import { ContextPreset, ContextPresetId } from '../types/contextBinding';
import { ExperimentFamily, ExperimentRunRecord } from '../types/technicalCore';
import { createExperimentFamily, logExperimentRun } from './experimentRunLogger';
import {
  OPERATOR_RBC_AS,
  OPERATOR_AC_RP,
  executeRbcAsMutation,
  executeAcRpMutation,
} from '../operators/contextOperators';
import {
  decomposePromptToSemanticUnits,
  renderContextLayout,
} from './contextEngine';
import { generateLengthMatchedNeutralFiller } from './distractorLibrary';

export const CONTEXT_PRESETS: Record<ContextPresetId, ContextPreset> = {
  RBC_DISTANCE_SWEEP: {
    id: 'RBC_DISTANCE_SWEEP',
    name: 'Remote Binding Cleavage: Distance Sweep',
    shortDescription: 'Titrates contextual distance between entity and modifier from 0% to 100%.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Identifies the critical distance threshold where the modifier rebinds to secondary hosts.',
  },

  RBC_DISTRACTOR_DENSITY_SWEEP: {
    id: 'RBC_DISTRACTOR_DENSITY_SWEEP',
    name: 'RBC-AS: Intervening Distractor Density Sweep',
    shortDescription: 'Increases lexical competition in the intervening space while distance is held constant.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Evaluates whether cross-attention starvation is triggered by pure distance or semantic distraction.',
  },

  BINDING_ADJACENCY_CONTROL: {
    id: 'BINDING_ADJACENCY_CONTROL',
    name: 'Binding Cleavage Negative Control (Adjacency)',
    shortDescription: 'Holds semantic inventory constant while moving entity and modifier adjacent.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Falsification control: if attribute leakage still occurs, distance hypothesis is weakened.',
  },

  ACRP_REPETITION_COUNT_SWEEP: {
    id: 'ACRP_REPETITION_COUNT_SWEEP',
    name: 'Attention Cannibalization: Repetition Count Sweep',
    shortDescription: 'Sweeps repetition counts from 1 (baseline) to 8 echoes.',
    operatorId: OPERATOR_AC_RP.id,
    recommendedModality: 'IMAGE',
    notes: 'Tests whether asymmetric repetition consumes conditioning capacity and destabilizes companions.',
  },

  ACRP_REPETITION_GEOMETRY_COMPARISON: {
    id: 'ACRP_REPETITION_GEOMETRY_COMPARISON',
    name: 'AC-RP: Repetition Geometry Comparison',
    shortDescription: 'Compares CONTIGUOUS, EVENLY_SPACED, FRONT_LOADED, BACK_LOADED, and EXPANDING.',
    operatorId: OPERATOR_AC_RP.id,
    recommendedModality: 'IMAGE',
    notes: 'Tests whether spatial distribution of repetitions changes binding beyond raw token count.',
  },

  PRIMACY_RECENCY_INVERSION: {
    id: 'PRIMACY_RECENCY_INVERSION',
    name: 'Primacy vs. Recency Inversion Matrix',
    shortDescription: 'Tests ENTITY_PRIMACY, MODIFIER_PRIMACY, ENTITY_RECENCY, and SPLIT.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Explores encoder positional bias across attention head layers.',
  },

  DEFERRED_ENTITY_TEST: {
    id: 'DEFERRED_ENTITY_TEST',
    name: 'Deferred Entity Definition Experiment',
    shortDescription: 'Introduces multiple modifiers and structural constraints before naming the subject.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Creates relational ambiguity where unanchored attributes may instantiate phantom entities.',
  },

  HANDOFF_SPLIT_TEST: {
    id: 'HANDOFF_SPLIT_TEST',
    name: 'HANDOFF_SPLIT Observable Baseline (Pre-MCHS)',
    shortDescription: 'Primacy Anchor -> Intervening Mass -> Recency Modifier sequence testing.',
    operatorId: OPERATOR_RBC_AS.id,
    recommendedModality: 'IMAGE',
    notes: 'Observable text-side precursor to future multimodal reference-context handoff.',
  },

  LENGTH_MATCHED_CONTROL: {
    id: 'LENGTH_MATCHED_CONTROL',
    name: 'Context Length Confound Control',
    shortDescription: 'Pairs repetition or distractor runs with equal-length neutral filler.',
    operatorId: OPERATOR_AC_RP.id,
    recommendedModality: 'IMAGE',
    notes: 'Distinguishes genuine repetition/binding phenomena from mere context-length truncation.',
  },
};

/**
 * Builds an ExperimentFamily and logs runs for a chosen Context preset.
 */
export function buildContextExperimentFamily(
  presetId: ContextPresetId,
  canonicalPrompt: string,
  modelId: string,
  seed: number = 42
): {
  family: ExperimentFamily;
  runs: ExperimentRunRecord[];
  runsSummary: string;
} {
  const runs: ExperimentRunRecord[] = [];

  switch (presetId) {
    case 'RBC_DISTANCE_SWEEP': {
      const family = createExperimentFamily({
        operator: OPERATOR_RBC_AS,
        modelId,
        title: `RBC-AS Distance Sweep on [${modelId}]`,
        customHypothesis:
          'Increasing contextual distance between entity and modifier causes attribute cleavage and secondary host rebinding.',
        customFalsificationCondition:
          'Modifier remains strictly bound to original entity across all separation distances (0.0 to 1.0).',
        variableChanged: 'separationStrength',
        heldConstant: 'seed, base_prompt, model, distractor_family',
      });

      const distances = [0.0, 0.25, 0.5, 0.75, 1.0];
      distances.forEach((strength, idx) => {
        const res = executeRbcAsMutation(canonicalPrompt, {
          separationStrength: strength,
          interveningContextDensity: 0.5,
          seed,
        });

        const isBaseline = strength === 0.0;
        const run = logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_RBC_AS.id,
          operatorVersion: OPERATOR_RBC_AS.version,
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: isBaseline ? 'baseline' : 'dose_sweep',
          seed,
          parametersUsed: { separationStrength: strength },
          outputs: { promptText: res.renderedMachinePrompt },
          observation: `Separation: ${strength.toFixed(2)} | Intervening words: ${res.metrics.interveningWordsCount} | Stress: ${res.metrics.contextStress}`,
          interpretation: isBaseline
            ? 'Adjacent baseline reference.'
            : `Evaluating whether modifier rebinds to secondary host at ${res.metrics.separationCharDistance} char distance.`,
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: null,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED'],
        });
        runs.push(run);
      });

      return {
        family,
        runs,
        runsSummary: `Generated ${distances.length} runs sweeping separation strength from 0.0 (adjacent) to 1.0 (extreme separation).`,
      };
    }

    case 'BINDING_ADJACENCY_CONTROL': {
      const family = createExperimentFamily({
        operator: OPERATOR_RBC_AS,
        modelId,
        title: `Binding Cleavage Negative Control on [${modelId}]`,
        customHypothesis:
          'If identical attribute leakage occurs when entity and modifier are adjacent with distractors moved to the tail, the cleavage is not caused by spatial separation.',
        customFalsificationCondition:
          'Leakage rate in adjacent control matches or exceeds the separated experimental run.',
        variableChanged: 'entity_modifier_adjacency_vs_separation',
        heldConstant: 'semantic_inventory, distractor_tokens, seed, model',
      });

      // Run 1: Separated experimental run
      const separatedRes = executeRbcAsMutation(canonicalPrompt, {
        separationStrength: 0.75,
        interveningContextDensity: 0.6,
        seed,
      });

      const r1 = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { condition: 'SEPARATED_BY_DISTRACTOR' },
        outputs: { promptText: separatedRes.renderedMachinePrompt },
        observation: `Separated condition: ${separatedRes.metrics.interveningWordsCount} intervening words between entity and modifier.`,
        interpretation: 'Experimental run: testing if intervening mass triggers attribute leakage.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(r1);

      // Run 2: Adjacent negative control with same distractors placed at tail
      const units = decomposePromptToSemanticUnits(canonicalPrompt);
      const distractor = generateLengthMatchedNeutralFiller(separatedRes.metrics.interveningWordsCount, seed);
      const adjacentPrompt = `${canonicalPrompt}, ${distractor}`;

      const r2 = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'negative_control',
        seed,
        parametersUsed: { condition: 'ADJACENT_WITH_TAIL_DISTRACTOR' },
        outputs: { promptText: adjacentPrompt },
        observation: `Negative control: entity and modifier held adjacent; equivalent distractor mass placed at tail.`,
        interpretation: 'Mandatory control: isolates spatial separation from overall vocabulary saturation.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(r2);

      return {
        family,
        runs,
        runsSummary: `Generated 2 paired runs: Separated Experimental vs. Adjacent Negative Control.`,
      };
    }

    case 'ACRP_REPETITION_COUNT_SWEEP': {
      const family = createExperimentFamily({
        operator: OPERATOR_AC_RP,
        modelId,
        title: `AC-RP Repetition Count Sweep on [${modelId}]`,
        customHypothesis:
          'Repeated occurrences disproportionately capture attention capacity and destabilize companion entity bindings.',
        customFalsificationCondition:
          'Repetition produces purely linear semantic intensification without altering spatial binding or scene balance.',
        variableChanged: 'repetitionCount',
        heldConstant: 'seed, base_prompt, repetition_pattern, model',
      });

      const counts = [1, 2, 4, 6, 8];
      counts.forEach((count) => {
        const res = executeAcRpMutation(canonicalPrompt, {
          repetitionCount: count,
          repetitionPattern: 'EVENLY_SPACED',
          seed,
        });

        const isBaseline = count === 1;
        const run = logExperimentRun({
          familyId: family.familyId,
          operatorId: OPERATOR_AC_RP.id,
          operatorVersion: OPERATOR_AC_RP.version,
          modelId,
          modality: 'IMAGE',
          executionTier: 'HYBRID',
          role: isBaseline ? 'baseline' : 'dose_sweep',
          seed,
          parametersUsed: { repetitionCount: count },
          outputs: { promptText: res.renderedMachinePrompt },
          observation: `Echo count: ${count} | Total words: ${res.metrics.totalWordCount} | Stress: ${res.metrics.contextStress}`,
          interpretation: isBaseline
            ? 'Single occurrence baseline reference.'
            : `Evaluating whether ${count}x repetition destabilizes companion attributes.`,
          scores: {
            creativeUtility: null,
            repeatability: null,
            mechanismConfidence: null,
            modelDependence: null,
            failureToIgnoreRate: null,
          },
          evidenceStatus: ['PROPOSED'],
        });
        runs.push(run);
      });

      return {
        family,
        runs,
        runsSummary: `Generated ${counts.length} runs sweeping repetition count from 1 to 8 echoes.`,
      };
    }

    case 'HANDOFF_SPLIT_TEST': {
      const family = createExperimentFamily({
        operator: OPERATOR_RBC_AS,
        modelId,
        title: `HANDOFF_SPLIT Observable Architecture on [${modelId}]`,
        customHypothesis:
          'A Primacy Anchor -> Intervening Mass -> Recency Modifier architecture prepares the context for future reference sabotage.',
        customFalsificationCondition:
          'Recency modifier is completely ignored or dropped in all 4 conditions.',
        variableChanged: 'handoff_split_architecture_variant',
        heldConstant: 'seed, base_prompt, model',
      });

      const units = decomposePromptToSemanticUnits(canonicalPrompt);

      // Condition A: Anchor + Modifier adjacent
      const rA = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'baseline',
        seed,
        parametersUsed: { variant: 'A_ADJACENT' },
        outputs: { promptText: canonicalPrompt },
        observation: 'Condition A: Anchor and modifier adjacent.',
        interpretation: 'Reference benchmark for normal binding.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(rA);

      // Condition B: Anchor at primacy, modifier at recency (no intervening mass)
      const resB = renderContextLayout({
        planId: 'plan_handoff_b',
        operatorId: OPERATOR_RBC_AS.id,
        canonicalPrompt,
        units,
        primacyRecencyStrategy: 'HANDOFF_SPLIT',
        seed,
      });

      const rB = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { variant: 'B_PRIMACY_RECENCY_SPLIT' },
        outputs: { promptText: resB.renderedMachinePrompt },
        observation: `Condition B: Anchor at primacy, modifier at recency. Intervening words: ${resB.metrics.interveningWordsCount}.`,
        interpretation: 'Tests baseline primacy/recency positional bias without intervening mass.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(rB);

      // Condition C: Anchor at primacy, distractor mass, modifier at recency
      const resC = executeRbcAsMutation(canonicalPrompt, {
        separationStrength: 0.7,
        interveningContextDensity: 0.6,
        primacyRecencyStrategy: 'HANDOFF_SPLIT',
        seed,
      });

      const rC = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { variant: 'C_HANDOFF_WITH_INTERVENING_MASS' },
        outputs: { promptText: resC.renderedMachinePrompt },
        observation: `Condition C: Primacy anchor, intervening distractor mass (${resC.metrics.interveningWordsCount} words), recency modifier.`,
        interpretation: 'Core HANDOFF_SPLIT architecture: precursor to multimodal reference handoff.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(rC);

      // Condition D: Same as C with recency repetition
      const resD = executeAcRpMutation(resC.renderedMachinePrompt, {
        repetitionCount: 3,
        repetitionPattern: 'BACK_LOADED',
        seed,
      });

      const rD = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { variant: 'D_HANDOFF_WITH_RECENCY_ECHOES' },
        outputs: { promptText: resD.renderedMachinePrompt },
        observation: `Condition D: HANDOFF_SPLIT combined with back-loaded recency repetition.`,
        interpretation: 'Tests whether recency reinforcement rescues or distorts the handoff.',
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(rD);

      return {
        family,
        runs,
        runsSummary: `Generated 4-stage HANDOFF_SPLIT suite: Adjacent, Spatial Split, Intervening Mass, and Recency Echoes.`,
      };
    }

    default: {
      // Generic preset fallback
      const family = createExperimentFamily({
        operator: OPERATOR_RBC_AS,
        modelId,
        title: `Context Architecture Test [${presetId}] on [${modelId}]`,
        customHypothesis: 'Context architecture manipulation alters cross-attention binding stability.',
        customFalsificationCondition: 'Outputs across configurations are visually and semantically indistinguishable.',
        variableChanged: 'context_layout_parameters',
        heldConstant: 'seed, base_prompt, model',
      });

      const res = executeRbcAsMutation(canonicalPrompt, {
        separationStrength: 0.5,
        seed,
      });

      const run = logExperimentRun({
        familyId: family.familyId,
        operatorId: OPERATOR_RBC_AS.id,
        operatorVersion: OPERATOR_RBC_AS.version,
        modelId,
        modality: 'IMAGE',
        executionTier: 'HYBRID',
        role: 'experimental',
        seed,
        parametersUsed: { presetId },
        outputs: { promptText: res.renderedMachinePrompt },
        observation: `Rendered context: ${res.metrics.totalWordCount} words, Stress: ${res.metrics.contextStress}.`,
        interpretation: `Context layout preset ${presetId} test run.`,
        scores: {
          creativeUtility: null,
          repeatability: null,
          mechanismConfidence: null,
          modelDependence: null,
          failureToIgnoreRate: null,
        },
        evidenceStatus: ['PROPOSED'],
      });
      runs.push(run);

      return {
        family,
        runs,
        runsSummary: `Generated baseline experiment for preset ${presetId}.`,
      };
    }
  }
}
