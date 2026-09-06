import { EvolutionTrait, TraitStatus } from '../types';

/**
 * Standard Library of Evolutionary Traits.
 * A trait represents persistent transformation logic / structural rules, NOT random adjectives.
 */
export const ARHETYPAL_TRAITS: Record<string, Omit<EvolutionTrait, 'originGen' | 'strength' | 'persistence' | 'status'>> = {
  distrust_inside_outside: {
    id: 'distrust_inside_outside',
    label: 'Distrust Inside/Outside',
    directive: 'Interior and exterior are continuous phase transitions; distrust conventional enclosed boundaries and spatial interiors.',
    category: 'spatial',
  },
  identity_as_temporal_residue: {
    id: 'identity_as_temporal_residue',
    label: 'Identity as Temporal Residue',
    directive: 'The subject does not exist at a single instant, but as an accumulated temporal interference pattern and phase wake.',
    category: 'ontological',
  },
  distributed_body_control: {
    id: 'distributed_body_control',
    label: 'Distributed Body Control',
    directive: 'Anatomy and form are governed by localized reaction-diffusion constraints rather than centralized motor control or monolithic anatomy.',
    category: 'anatomical',
  },
  color_behaves_as_pressure: {
    id: 'color_behaves_as_pressure',
    label: 'Color Behaves as Pressure',
    directive: 'Chrominance and hue exert mechanical pressure; bright saturated zones compress and deform adjacent physical geometry.',
    category: 'physical',
  },
  symmetry_aversion: {
    id: 'symmetry_aversion',
    label: 'Symmetry Aversion',
    directive: 'Structural symmetry collapses into asymmetric branching, shear vortices, and chiral disequilibrium.',
    category: 'geometric',
  },
  anatomy_as_phase_boundary: {
    id: 'anatomy_as_phase_boundary',
    label: 'Anatomy as Phase Boundary',
    directive: 'Physical boundaries of the subject behave like freezing, boiling, or sublimation liquid interfaces rather than static skin.',
    category: 'material',
  },
  repetition_causes_structural_decay: {
    id: 'repetition_causes_structural_decay',
    label: 'Repetition Causes Structural Decay',
    directive: 'Each recursive repetition, echo, or pattern iteration experiences visible structural degradation and entropy loss.',
    category: 'recursive',
  },
  signal_loss_affects_spatial_continuity: {
    id: 'signal_loss_affects_spatial_continuity',
    label: 'Signal Loss Affects Spatial Continuity',
    directive: 'Transmission dropouts and raster glitches induce literal topological gaps, torn coordinates, and volumetric voids in the scene.',
    category: 'informational',
  },
  crystalline_rigidity: {
    id: 'crystalline_rigidity',
    label: 'Crystalline Rigidity',
    directive: 'Fluid and organic tissues periodically crystallize along Bravais lattice planes and facet cleavage vectors.',
    category: 'material',
  },
  void_accretion: {
    id: 'void_accretion',
    label: 'Void Accretion',
    directive: 'Negative space and shadows exert gravitational suction, drawing adjacent matter into dark boundary singularities.',
    category: 'spatial',
  },
  scale_invariance_failure: {
    id: 'scale_invariance_failure',
    label: 'Scale Invariance Failure',
    directive: 'Microscopic and macroscopic structures coexist at the same optical focal plane, contradicting depth of field.',
    category: 'optical',
  },
  acoustic_matter_coupling: {
    id: 'acoustic_matter_coupling',
    label: 'Acoustic Matter Coupling',
    directive: 'Inaudible pressure waves directly sculpt solids; standing acoustic waves freeze matter into Chladni plate nodes.',
    category: 'acoustic',
  },
};

/**
 * Creates an instance of an EvolutionTrait with explicit generation provenance and initial weights.
 */
export function createEvolutionTrait(
  traitId: string,
  originGen: number,
  options?: {
    strength?: number;
    persistence?: number;
    status?: TraitStatus;
    customLabel?: string;
    customDirective?: string;
  }
): EvolutionTrait {
  const template = ARHETYPAL_TRAITS[traitId];
  return {
    id: traitId,
    label: options?.customLabel ?? template?.label ?? traitId.replace(/_/g, ' '),
    directive:
      options?.customDirective ??
      template?.directive ??
      `Enforce structural constraint: ${traitId.replace(/_/g, ' ')}.`,
    originGen,
    strength: options?.strength ?? 0.85,
    persistence: options?.persistence ?? 0.8,
    status: options?.status ?? 'active',
    category: template?.category ?? 'structural',
  };
}

/**
 * Derives dynamic evolutionary traits based on active latent attractors and operators.
 */
export function deriveTraitsFromGenotype(
  operators: string[],
  attractors: string[],
  originGen: number
): EvolutionTrait[] {
  const derived: EvolutionTrait[] = [];

  for (const at of attractors) {
    switch (at) {
      case 'simulacrum':
      case 'echo':
        if (!derived.some((t) => t.id === 'identity_as_temporal_residue')) {
          derived.push(createEvolutionTrait('identity_as_temporal_residue', originGen, { strength: 0.9, persistence: 0.85 }));
        }
        break;
      case 'aberration':
      case 'parasite':
        if (!derived.some((t) => t.id === 'distributed_body_control')) {
          derived.push(createEvolutionTrait('distributed_body_control', originGen, { strength: 0.85, persistence: 0.8 }));
        }
        break;
      case 'crystalline':
        if (!derived.some((t) => t.id === 'crystalline_rigidity')) {
          derived.push(createEvolutionTrait('crystalline_rigidity', originGen, { strength: 0.9, persistence: 0.9 }));
        }
        break;
      case 'void':
        if (!derived.some((t) => t.id === 'void_accretion')) {
          derived.push(createEvolutionTrait('void_accretion', originGen, { strength: 0.9, persistence: 0.85 }));
        }
        break;
      case 'spectral':
      case 'ghost':
        if (!derived.some((t) => t.id === 'signal_loss_affects_spatial_continuity')) {
          derived.push(createEvolutionTrait('signal_loss_affects_spatial_continuity', originGen, { strength: 0.85, persistence: 0.8 }));
        }
        break;
      case 'fluid':
      case 'shapeshifter':
        if (!derived.some((t) => t.id === 'anatomy_as_phase_boundary')) {
          derived.push(createEvolutionTrait('anatomy_as_phase_boundary', originGen, { strength: 0.85, persistence: 0.8 }));
        }
        break;
    }
  }

  for (const op of operators) {
    switch (op) {
      case 'ontology_swap':
        if (!derived.some((t) => t.id === 'distrust_inside_outside')) {
          derived.push(createEvolutionTrait('distrust_inside_outside', originGen, { strength: 0.9, persistence: 0.8 }));
        }
        break;
      case 'scale_schism':
        if (!derived.some((t) => t.id === 'scale_invariance_failure')) {
          derived.push(createEvolutionTrait('scale_invariance_failure', originGen, { strength: 0.8, persistence: 0.75 }));
        }
        break;
      case 'staged_paradox':
      case 'recursive_reversal':
        if (!derived.some((t) => t.id === 'repetition_causes_structural_decay')) {
          derived.push(createEvolutionTrait('repetition_causes_structural_decay', originGen, { strength: 0.85, persistence: 0.8 }));
        }
        break;
      case 'chiral_flip':
        if (!derived.some((t) => t.id === 'symmetry_aversion')) {
          derived.push(createEvolutionTrait('symmetry_aversion', originGen, { strength: 0.85, persistence: 0.8 }));
        }
        break;
    }
  }

  return derived;
}
