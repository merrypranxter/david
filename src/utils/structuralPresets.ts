/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4: Structural Syntax & Relational Traps Presets
 * 
 * Implements the 6 core experimental presets:
 * 1. ORPHAN_ATTRIBUTE: Remote Binding Cleavage + Attribute Orphaning
 * 2. OUROBOROS: Cyclic Dependency + Part/Whole Paradox
 * 3. THE_CAMERA_IS_INSIDE_IT: Observer Re-entry + Boundary Inversion
 * 4. FUTURE_SCAR: Temporal Causal Loop + Future Leak
 * 5. WRONG_OWNER: Attribute Orphaning + Relation Direction Inversion
 * 6. RELATIONAL_HELL: Controlled high-intensity combination
 */

import {
  StructuralPreset,
  StructuralPresetId,
  StructuralPlan,
  RenderedStructuralResult,
} from '../types/structuralRelational';
import { executeStructuralMutationPipeline } from './relationalGraphEngine';
import { TechnicalModality } from '../types/technicalCore';

export const STRUCTURAL_PRESETS: Record<StructuralPresetId, StructuralPreset> = {
  ORPHAN_ATTRIBUTE: {
    id: 'ORPHAN_ATTRIBUTE',
    name: 'Orphan Attribute',
    shortDescription: 'Remote Binding Cleavage + Attribute Orphaning',
    operators: ['remote_binding_cleavage', 'attribute_orphaning'],
    intensity: 'MEDIUM',
    targetModality: 'IMAGE',
    conceptSummary:
      'Pushes attributes across intervening distance while stripping explicit ownership, encouraging properties to settle onto ambient space or secondary hosts.',
  },

  OUROBOROS: {
    id: 'OUROBOROS',
    name: 'Ouroboros',
    shortDescription: 'Cyclic Dependency + Part/Whole Paradox',
    operators: ['cyclic_dependency', 'mereological_trap'],
    intensity: 'HIGH',
    targetModality: 'IMAGE',
    conceptSummary:
      'Creates a self-referential closed dependency ring where macroscopic geometry is enclosed within its own constituent parts.',
  },

  THE_CAMERA_IS_INSIDE_IT: {
    id: 'THE_CAMERA_IS_INSIDE_IT',
    name: 'The Camera Is Inside It',
    shortDescription: 'Observer Re-entry + Boundary Inversion',
    operators: ['observer_reentry', 'relation_direction_inversion'],
    intensity: 'MEDIUM',
    targetModality: 'VIDEO',
    conceptSummary:
      'Fuses camera viewpoint coordinates into the subject’s physical topology, so camera motion actively deforms anatomy.',
  },

  FUTURE_SCAR: {
    id: 'FUTURE_SCAR',
    name: 'Future Scar',
    shortDescription: 'Temporal Causal Loop + Future Leak',
    operators: ['temporal_causal_loop'],
    intensity: 'LOW',
    targetModality: 'IMAGE',
    conceptSummary:
      'Retrocausal determination: future injuries, subsequent structural collapses, and motion mechanisms exist in advance on the un-damaged subject.',
  },

  WRONG_OWNER: {
    id: 'WRONG_OWNER',
    name: 'Wrong Owner',
    shortDescription: 'Attribute Orphaning + Relation Direction Inversion',
    operators: ['attribute_orphaning', 'relation_direction_inversion'],
    intensity: 'MEDIUM',
    targetModality: 'IMAGE',
    conceptSummary:
      'Inverts containment and boundary vectors while unmooring attributes, causing environmental properties to bind to subject and vice versa.',
  },

  RELATIONAL_HELL: {
    id: 'RELATIONAL_HELL',
    name: 'Relational Hell',
    shortDescription: 'High-Intensity Multi-Operator Relational Stress',
    operators: ['cyclic_dependency', 'mereological_trap', 'observer_reentry', 'temporal_causal_loop'],
    intensity: 'FERAL',
    targetModality: 'IMAGE',
    conceptSummary:
      'A dense, controlled crucible stacking cyclic recursion, scale paradox, observer embedding, and retrocausality while preserving the primary subject anchor.',
  },
};

/**
 * Builds a concrete executable StructuralPlan from a Preset ID.
 */
export function buildPlanFromPreset(
  presetId: StructuralPresetId,
  modalityOverride?: TechnicalModality,
  seed: number = 42
): StructuralPlan {
  const preset = STRUCTURAL_PRESETS[presetId];
  const targetModality = modalityOverride || preset.targetModality;

  switch (presetId) {
    case 'ORPHAN_ATTRIBUTE':
      return {
        planId: `plan_orphan_attr_${Date.now()}`,
        intensity: 'MEDIUM',
        targetModality,
        activeOperatorIds: ['remote_binding_cleavage', 'attribute_orphaning'],
        rbcConfig: {
          bindingDistance: 0.8,
          interferenceDensity: 0.6,
          orphanPressure: 0.85,
        },
        aoConfig: {
          ownershipWeakening: 0.85,
          hostMultiplicity: 'ambient_background',
          preserveAttribute: 0.95,
        },
        seed,
      };

    case 'OUROBOROS':
      return {
        planId: `plan_ouroboros_${Date.now()}`,
        intensity: 'HIGH',
        targetModality,
        activeOperatorIds: ['cyclic_dependency', 'mereological_trap'],
        cdConfig: {
          cycleLength: 3,
          recursionStrength: 0.85,
          domainMix: ['geometry', 'material', 'physics'],
        },
        mtConfig: {
          paradoxType: 'WHOLE_CONTAINED_IN_PART',
          wholePartDepth: 2,
          scaleRecursion: true,
          boundaryLeakage: 0.75,
        },
        seed,
      };

    case 'THE_CAMERA_IS_INSIDE_IT':
      return {
        planId: `plan_camera_inside_${Date.now()}`,
        intensity: 'MEDIUM',
        targetModality,
        activeOperatorIds: ['observer_reentry', 'relation_direction_inversion'],
        orConfig: {
          observerCoupling: 0.9,
          viewpointFeedback: 'camera_as_topology',
          reentryDepth: 'dynamic_feedback_loop',
          videoMotionCoupling: true,
        },
        rdiConfig: {
          inversionRate: 0.6,
          depth: 'single_relation',
          consistency: 'high_unified_rule',
        },
        seed,
      };

    case 'FUTURE_SCAR':
      return {
        planId: `plan_future_scar_${Date.now()}`,
        intensity: 'LOW',
        targetModality,
        activeOperatorIds: ['temporal_causal_loop'],
        tclConfig: {
          timeDirection: 'reverse',
          delay: 'medium',
          topologyDebt: 0.8,
          futureLeak: 0.85,
          imageTranslationMode: 'future_scars',
        },
        seed,
      };

    case 'WRONG_OWNER':
      return {
        planId: `plan_wrong_owner_${Date.now()}`,
        intensity: 'MEDIUM',
        targetModality,
        activeOperatorIds: ['attribute_orphaning', 'relation_direction_inversion'],
        aoConfig: {
          ownershipWeakening: 0.75,
          hostMultiplicity: 'single_alternative',
          preserveAttribute: 0.9,
        },
        rdiConfig: {
          inversionRate: 0.7,
          depth: 'single_relation',
          consistency: 'high_unified_rule',
        },
        seed,
      };

    case 'RELATIONAL_HELL':
    default:
      return {
        planId: `plan_relational_hell_${Date.now()}`,
        intensity: 'FERAL',
        targetModality,
        activeOperatorIds: [
          'cyclic_dependency',
          'mereological_trap',
          'observer_reentry',
          'temporal_causal_loop',
        ],
        cdConfig: {
          cycleLength: 4,
          recursionStrength: 0.9,
          domainMix: ['geometry', 'biology', 'physics', 'observer'],
        },
        mtConfig: {
          paradoxType: 'WHOLE_CONTAINED_IN_PART',
          wholePartDepth: 3,
          scaleRecursion: true,
          boundaryLeakage: 0.8,
        },
        orConfig: {
          observerCoupling: 0.85,
          viewpointFeedback: 'boundary_collapse',
          reentryDepth: 'dynamic_feedback_loop',
          videoMotionCoupling: true,
        },
        tclConfig: {
          timeDirection: 'cyclic',
          delay: 'long',
          topologyDebt: 0.85,
          futureLeak: 0.8,
          imageTranslationMode: 'retroactive_reinforcement',
        },
        seed,
      };
  }
}

/**
 * Executes a structural preset on a canonical prompt.
 */
export function executeStructuralPreset(
  presetId: StructuralPresetId,
  canonicalPrompt: string,
  modalityOverride?: TechnicalModality,
  seed: number = 42
): RenderedStructuralResult {
  const plan = buildPlanFromPreset(presetId, modalityOverride, seed);
  return executeStructuralMutationPipeline(canonicalPrompt, plan);
}
