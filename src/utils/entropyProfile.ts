import { EntropyProfile } from '../types';

/**
 * Maps entropy levels 1–10 to structured mutation control parameters.
 * Replaces unstructured "chaos/adjectives" with precise operational levers
 * controlling operator counts, attractor mixing, semantic hops, and organ mutability.
 */
export function getEntropyProfile(entropyLevel: number): EntropyProfile {
  const e = Math.max(1, Math.min(10, Math.round(Number.isFinite(entropyLevel) ? entropyLevel : 1)));

  switch (e) {
    case 1:
      return {
        entropy: 1,
        label: 'Subtle Drift (Low)',
        minOperators: 1,
        maxOperators: 1,
        targetOperatorCount: 1,
        minAttractors: 0,
        maxAttractors: 1,
        semanticDistance: 0.08,
        neighborHops: 0,
        anchorPreservationWeight: 0.98,
        ontologySwapEligibility: false,
        stagedParadoxEligibility: false,
        recursiveReversalEligibility: false,
        scaleSchismEligibility: false,
        conceptBleedIntensity: 0.05,
        organMutationWillingness: 0.1,
      };

    case 2:
      return {
        entropy: 2,
        label: 'Subtle Drift',
        minOperators: 1,
        maxOperators: 1,
        targetOperatorCount: 1,
        minAttractors: 0,
        maxAttractors: 1,
        semanticDistance: 0.15,
        neighborHops: 1,
        anchorPreservationWeight: 0.95,
        ontologySwapEligibility: false,
        stagedParadoxEligibility: false,
        recursiveReversalEligibility: false,
        scaleSchismEligibility: false,
        conceptBleedIntensity: 0.12,
        organMutationWillingness: 0.2,
      };

    case 3:
      return {
        entropy: 3,
        label: 'Noticeable Mutation (Mild)',
        minOperators: 1,
        maxOperators: 2,
        targetOperatorCount: 1,
        minAttractors: 0,
        maxAttractors: 1,
        semanticDistance: 0.28,
        neighborHops: 1,
        anchorPreservationWeight: 0.92,
        ontologySwapEligibility: false,
        stagedParadoxEligibility: false,
        recursiveReversalEligibility: false,
        scaleSchismEligibility: false,
        conceptBleedIntensity: 0.22,
        organMutationWillingness: 0.32,
      };

    case 4:
      return {
        entropy: 4,
        label: 'Noticeable Mutation',
        minOperators: 1,
        maxOperators: 2,
        targetOperatorCount: 2,
        minAttractors: 1,
        maxAttractors: 1,
        semanticDistance: 0.38,
        neighborHops: 2,
        anchorPreservationWeight: 0.88,
        ontologySwapEligibility: false,
        stagedParadoxEligibility: false,
        recursiveReversalEligibility: false,
        scaleSchismEligibility: false,
        conceptBleedIntensity: 0.35,
        organMutationWillingness: 0.45,
      };

    case 5:
      return {
        entropy: 5,
        label: 'Structural Distortion (Moderate)',
        minOperators: 2,
        maxOperators: 4,
        targetOperatorCount: 2,
        minAttractors: 1,
        maxAttractors: 2,
        semanticDistance: 0.52,
        neighborHops: 2,
        anchorPreservationWeight: 0.84,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: false,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.48,
        organMutationWillingness: 0.58,
      };

    case 6:
      return {
        entropy: 6,
        label: 'Structural Distortion',
        minOperators: 2,
        maxOperators: 4,
        targetOperatorCount: 3,
        minAttractors: 1,
        maxAttractors: 2,
        semanticDistance: 0.62,
        neighborHops: 3,
        anchorPreservationWeight: 0.80,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: true,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.60,
        organMutationWillingness: 0.68,
      };

    case 7:
      return {
        entropy: 7,
        label: 'Deep Reinterpretation (High)',
        minOperators: 3,
        maxOperators: 5,
        targetOperatorCount: 3,
        minAttractors: 2,
        maxAttractors: 3,
        semanticDistance: 0.72,
        neighborHops: 3,
        anchorPreservationWeight: 0.74,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: true,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.72,
        organMutationWillingness: 0.78,
      };

    case 8:
      return {
        entropy: 8,
        label: 'Deep Reinterpretation',
        minOperators: 3,
        maxOperators: 5,
        targetOperatorCount: 4,
        minAttractors: 2,
        maxAttractors: 3,
        semanticDistance: 0.80,
        neighborHops: 4,
        anchorPreservationWeight: 0.68,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: true,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.82,
        organMutationWillingness: 0.85,
      };

    case 9:
      return {
        entropy: 9,
        label: 'Epistemic Collapse (Severe)',
        minOperators: 4,
        maxOperators: 7,
        targetOperatorCount: 5,
        minAttractors: 2,
        maxAttractors: 4,
        semanticDistance: 0.88,
        neighborHops: 5,
        anchorPreservationWeight: 0.62,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: true,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.92,
        organMutationWillingness: 0.92,
      };

    case 10:
    default:
      return {
        entropy: 10,
        label: 'Epistemic Collapse (Total)',
        minOperators: 4,
        maxOperators: 7,
        targetOperatorCount: 6,
        minAttractors: 2,
        maxAttractors: 4,
        semanticDistance: 0.96,
        neighborHops: 6,
        anchorPreservationWeight: 0.55,
        ontologySwapEligibility: true,
        stagedParadoxEligibility: true,
        recursiveReversalEligibility: true,
        scaleSchismEligibility: true,
        conceptBleedIntensity: 0.98,
        organMutationWillingness: 0.98,
      };
  }
}
