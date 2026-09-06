import { CreativePressure, CreativePressureId } from '../types';

/**
 * Creative Pressure Registry (Job 4)
 * Optimization vectors that govern how the mutation compiler balances
 * structural novelty, identity anchoring, and target execution fidelity.
 */
export const CREATIVE_PRESSURES: readonly CreativePressure[] = [
  {
    id: 'preserve_identity',
    name: 'Preserve Identity',
    description: 'Anchor core subjects, identities, and named entities against destructive mutations.',
    directive: 'Ensure core identity anchors remain structurally invariant even under high semantic drift.',
    defaultWeight: 0.9,
  },
  {
    id: 'maximize_structural_novelty',
    name: 'Maximize Structural Novelty',
    description: 'Promote radical structural reorganization over superficial adjective variation.',
    directive: 'Prioritize deep architectural rearrangement of semantic organs over decorative cosmetic changes.',
    defaultWeight: 0.85,
  },
  {
    id: 'avoid_decorative_weirdness',
    name: 'Avoid Decorative Weirdness',
    description: 'Ban cheap adjective spam and meaningless noise; enforce systemic ontological mutations.',
    directive: 'Reject superficial weirdness; require that all strange elements originate from coherent physical, conceptual, or geometric paradoxes.',
    defaultWeight: 0.8,
  },
  {
    id: 'preserve_target_legibility',
    name: 'Preserve Target Legibility',
    description: 'Ensure prompt structure and parameter formatting remain optimal for the target engine.',
    directive: 'Maintain strict structural compliance with the target engine syntax and capacity limits.',
    defaultWeight: 0.8,
  },
  {
    id: 'maximize_sibling_distance',
    name: 'Maximize Sibling Distance',
    description: 'Maximize orthogonal separation between successive generations or parallel variations.',
    directive: 'Drive semantic trajectories into orthogonal vector subspaces away from prior generations.',
    defaultWeight: 0.75,
  },
];

/**
 * Lookup creative pressure by ID
 */
export function getCreativePressure(id: string): CreativePressure | undefined {
  return CREATIVE_PRESSURES.find((p) => p.id === id);
}

/**
 * Check if an ID is a valid creative pressure
 */
export function isValidCreativePressureId(id: string): id is CreativePressureId {
  return CREATIVE_PRESSURES.some((p) => p.id === id);
}
