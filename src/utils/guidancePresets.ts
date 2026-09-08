/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry Presets
 * 
 * Defines the 4 Core Presets:
 * 1. CATEGORY CIVIL WAR
 * 2. TAXONOMY OFFLINE
 * 3. SADDLE MONSTER
 * 4. MATERIAL POSSESSION
 */

import {
  GuidanceGeometryPreset,
  GuidanceGeometryPresetId,
  ConceptualForceChannels,
} from '../types/guidanceGeometry';
import { createDefaultForceChannels } from './guidanceGeometryEngine';

export const GUIDANCE_GEOMETRY_PRESETS: Record<GuidanceGeometryPresetId, GuidanceGeometryPreset> = {
  PRESET_CATEGORY_CIVIL_WAR: {
    id: 'PRESET_CATEGORY_CIVIL_WAR',
    name: 'Category Civil War',
    tagline: 'A/B near equilibrium with strong structural stabilizer',
    description:
      'Pits two diametrically opposed concept families in near-perfect equilibrium while an unyielding structural stabilizer prevents topological rupture.',
    forces: {
      primaryAttractorA: {
        label: 'Attractor A (Cathedral Masonry)',
        concept: 'gothic limestone cathedral vaulted masonry with ribbed groin arches',
        weight: 0.5,
        structuralManifestations: [
          'heavy compressive limestone buttresses',
          'ribbed groin vaulting distributing architectural load',
        ],
      },
      primaryAttractorB: {
        label: 'Attractor B (Deep-Sea Organism)',
        concept: 'bioluminescent cephalopod flesh with translucent gelatinous siphon chambers',
        weight: 0.5,
        structuralManifestations: [
          'hydrostatic siphon jet propulsion chambers',
          'translucent bioluminescent membrane weeping seawater',
        ],
      },
      structuralForce: {
        weight: 0.9,
        invariants: ['continuous outer manifold', 'preserved load-bearing equilibrium'],
        compulsionRule:
          'Both gothic stone architecture and soft deep-sea marine biology must cohabit the exact same monolithic silhouette without spatial separation.',
      },
      identityAnchor: {
        subject: 'monolithic reliquary vessel',
        weight: 0.7,
        isAnchored: true,
      },
      materialForce: {
        pressure: 'calcareous stone encrustation over pressurized cephalopod mantle',
        weight: 0.7,
        mediumResistance: 'dense mineral matrix resisting hydraulic expansion',
      },
    },
    balanceConfig: {
      attractorA: 'gothic limestone masonry',
      attractorAWeight: 0.5,
      attractorB: 'bioluminescent cephalopod flesh',
      attractorBWeight: 0.5,
      balanceMode: 'NEAR_EQUILIBRIUM',
      competitionStrength: 0.85,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    },
    cancellationConfig: {
      categorySuppression: 0.5,
      structuralCompulsion: 0.85,
      categoryPairCount: 2,
      taxonomicAmbiguity: 'MEDIUM',
      suppressedCategories: ['architecture', 'mollusk'],
      compulsoryStructures: ['vaulted ribbed arches', 'hydrostatic pressure mantle'],
    },
    stabilizerConfig: {
      stabilizerStrength: 0.9,
      structuralInvariantType: 'CONTINUOUS_BOUNDARY',
      invariantCount: 3,
      strictness: 'STRICT',
      targetModality: 'IMAGE',
    },
    asymmetryConfig: {
      primaryWeight: 0.5,
      secondaryWeight: 0.5,
      structuralWeight: 0.9,
      identityWeight: 0.7,
      materialWeight: 0.7,
      presetType: 'CATEGORY_CIVIL_WAR',
    },
    saddleConfig: {
      abBalance: 0.5,
      structuralForce: 0.9,
      saddleWidth: 0.15,
      driftTolerance: 0.1,
      escapeResponse: 'REBALANCE',
    },
  },

  PRESET_TAXONOMY_OFFLINE: {
    id: 'PRESET_TAXONOMY_OFFLINE',
    name: 'Taxonomy Offline',
    tagline: 'High categorical cancellation, very high structural compulsion',
    description:
      'Purges high-level class taxonomy (animal, machine, plant) while enforcing rigorous physical and relational laws (hinges, pressure, continuous boundary).',
    forces: {
      primaryAttractorA: {
        label: 'Attractor A (Kinematic Mechanism)',
        concept: 'articulated load-bearing bronze armatures with sealed hydraulic cylinders',
        weight: 0.45,
        structuralManifestations: [
          'machined bronze fulcrums and clevis pins',
          'isobaric fluid transfer lines maintaining hydraulic pressure',
        ],
      },
      primaryAttractorB: {
        label: 'Attractor B (Phytological Growth)',
        concept: 'vascular vascularized xylem conduits and fibrous lignin cell walls',
        weight: 0.45,
        structuralManifestations: [
          'turgor-driven vascular growth following Fibonacci phyllotaxis',
          'lignified cellular boundaries resisting internal hydrostatic tension',
        ],
      },
      structuralForce: {
        weight: 0.98,
        invariants: [
          'fixed count of 3 functional articulating hinges',
          'continuous closed outer boundary shell',
          'isobaric internal fluid pressure',
        ],
        compulsionRule:
          'Completely suppress all named classifications (neither plant, nor animal, nor robot). Enforce absolute mechanical coherence.',
      },
      identityAnchor: {
        subject: 'unnamed mechanical-vascular organism',
        weight: 0.6,
        isAnchored: true,
      },
      materialForce: {
        pressure: 'lignin fiber cellular growth adhering to cast bronze armature',
        weight: 0.8,
        mediumResistance: 'rigid cellulose resistance to hydraulic oil compression',
      },
    },
    balanceConfig: {
      attractorA: 'kinematic mechanical mechanism',
      attractorAWeight: 0.45,
      attractorB: 'phytological cellular growth',
      attractorBWeight: 0.45,
      balanceMode: 'NEAR_EQUILIBRIUM',
      competitionStrength: 0.9,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    },
    cancellationConfig: {
      categorySuppression: 0.95,
      structuralCompulsion: 0.98,
      categoryPairCount: 3,
      taxonomicAmbiguity: 'HIGH',
      suppressedCategories: ['machine', 'plant', 'animal'],
      compulsoryStructures: [
        'hinge relationships',
        'isobaric pressure transfer',
        'boundary continuity',
        'load-bearing symmetry',
      ],
    },
    stabilizerConfig: {
      stabilizerStrength: 0.98,
      structuralInvariantType: 'HINGE_COUNT',
      invariantCount: 3,
      strictness: 'AXIOMATIC',
      targetModality: 'IMAGE',
    },
    asymmetryConfig: {
      primaryWeight: 0.45,
      secondaryWeight: 0.45,
      structuralWeight: 0.98,
      identityWeight: 0.6,
      materialWeight: 0.8,
      presetType: 'STRUCTURE_OVER_CATEGORY',
    },
    saddleConfig: {
      abBalance: 0.5,
      structuralForce: 0.98,
      saddleWidth: 0.1,
      driftTolerance: 0.08,
      escapeResponse: 'REINFORCE_STRUCTURE',
    },
  },

  PRESET_SADDLE_MONSTER: {
    id: 'PRESET_SADDLE_MONSTER',
    name: 'Saddle Monster',
    tagline: 'A/B balanced, structure very high, razor-thin saddle width',
    description:
      'Suspends the reverse diffusion trajectory along a knife-edge saddle ridge. Forces incompatible basins into an unresolved ontological standoff.',
    forces: {
      primaryAttractorA: {
        label: 'Attractor A (Faceted Silicate Basalt)',
        concept: 'sharp obsidian silicate cleavage with 60-degree crystalline dihedral fracture planes',
        weight: 0.5,
        structuralManifestations: [
          'vitreous obsidian razor-sharp planar cleavage',
          'brittle compressive crystalline lattice with zero elastic yield',
        ],
      },
      primaryAttractorB: {
        label: 'Attractor B (Viscous Pulmonary Flesh)',
        concept: 'pulsing vascular lung parenchyma with warm moist pleural membranes',
        weight: 0.5,
        structuralManifestations: [
          'rhythmic inhalation expansion and alveolar volumetric contraction',
          'warm mucous weeping across capillary networks',
        ],
      },
      structuralForce: {
        weight: 0.95,
        invariants: [
          'strict bilateral reflection symmetry along central axis',
          'hermetic unbroken boundary manifold',
        ],
        compulsionRule:
          'Trapped directly on the separatrix. Crystalline basalt must continuously fracture along breathing alveolar walls without ever resolving into either state.',
      },
      identityAnchor: {
        subject: 'bilateral pulmonary monolith',
        weight: 0.75,
        isAnchored: true,
      },
      materialForce: {
        pressure: 'unyielding obsidian crystalline expansion crushing moist vascular parenchyma',
        weight: 0.85,
        mediumResistance: 'compressive silicate shear vs hydraulic pleural elasticity',
      },
    },
    balanceConfig: {
      attractorA: 'faceted silicate basalt',
      attractorAWeight: 0.5,
      attractorB: 'viscous pulmonary flesh',
      attractorBWeight: 0.5,
      balanceMode: 'NEAR_EQUILIBRIUM',
      competitionStrength: 0.95,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    },
    cancellationConfig: {
      categorySuppression: 0.7,
      structuralCompulsion: 0.92,
      categoryPairCount: 2,
      taxonomicAmbiguity: 'HIGH',
      suppressedCategories: ['geology', 'anatomy'],
      compulsoryStructures: ['bilateral axial symmetry', 'hermetic perimeter containment'],
    },
    stabilizerConfig: {
      stabilizerStrength: 0.95,
      structuralInvariantType: 'SYMMETRY_COUNT',
      invariantCount: 3,
      strictness: 'AXIOMATIC',
      targetModality: 'IMAGE',
    },
    asymmetryConfig: {
      primaryWeight: 0.5,
      secondaryWeight: 0.5,
      structuralWeight: 0.95,
      identityWeight: 0.75,
      materialWeight: 0.85,
      presetType: 'CATEGORY_CIVIL_WAR',
    },
    saddleConfig: {
      abBalance: 0.5,
      structuralForce: 0.95,
      saddleWidth: 0.12,
      driftTolerance: 0.05,
      escapeResponse: 'REINFORCE_STRUCTURE',
    },
  },

  PRESET_MATERIAL_POSSESSION: {
    id: 'PRESET_MATERIAL_POSSESSION',
    name: 'Material Possession',
    tagline: 'Identity high, material pressure higher',
    description:
      'Preserves the recognizable macro identity of the subject while allowing an overwhelming material force to colonize, distort, and pressurize every surface.',
    forces: {
      primaryAttractorA: {
        label: 'Attractor A (Underlying Machine / Host)',
        concept: 'precision-milled aviation titanium airframe with flush rivet seams',
        weight: 0.4,
        structuralManifestations: [
          'structural titanium stringers and bulkheads',
          'flush aerodynamic rivet rows defining the underlying chassis',
        ],
      },
      primaryAttractorB: {
        label: 'Attractor B (Colonizing Parasitic Growth)',
        concept: 'virulent calcified barnacle encrustation and fibrous sea kelp holdfasts',
        weight: 0.7,
        structuralManifestations: [
          'calcite cone accretion erupting through titanium skin seams',
          'fibrous kelp holdfast roots gripping hydraulic conduit tracks',
        ],
      },
      structuralForce: {
        weight: 0.88,
        invariants: ['preserved aerodynamic chassis silhouette', 'conserved wing and engine genus'],
        compulsionRule:
          'The airframe identity is strictly retained, but its surface is subjected to violent, suffocating material possession by marine mineral accretion.',
      },
      identityAnchor: {
        subject: 'supersonic reconnaissance jet',
        weight: 0.8,
        isAnchored: true,
      },
      materialForce: {
        pressure: 'extreme volcanic hydrothermal calcite accretion',
        weight: 0.98,
        mediumResistance: 'mineral accretion bond strength exceeding titanium tensile strength',
      },
    },
    balanceConfig: {
      attractorA: 'precision aviation titanium airframe',
      attractorAWeight: 0.4,
      attractorB: 'calcified barnacle and kelp colonization',
      attractorBWeight: 0.7,
      balanceMode: 'B_DOMINANT',
      competitionStrength: 0.85,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    },
    cancellationConfig: {
      categorySuppression: 0.35,
      structuralCompulsion: 0.85,
      categoryPairCount: 2,
      taxonomicAmbiguity: 'LOW',
      suppressedCategories: ['clean aerospace vehicle'],
      compulsoryStructures: ['aerodynamic chassis contour', 'parasitic mineral root penetration'],
    },
    stabilizerConfig: {
      stabilizerStrength: 0.88,
      structuralInvariantType: 'PRESERVED_SILHOUETTE',
      invariantCount: 2,
      strictness: 'STRICT',
      targetModality: 'IMAGE',
    },
    asymmetryConfig: {
      primaryWeight: 0.4,
      secondaryWeight: 0.7,
      structuralWeight: 0.88,
      identityWeight: 0.8,
      materialWeight: 0.98,
      presetType: 'MATERIAL_POSSESSION',
    },
    saddleConfig: {
      abBalance: 0.65,
      structuralForce: 0.88,
      saddleWidth: 0.2,
      driftTolerance: 0.15,
      escapeResponse: 'ALLOW_COLLAPSE',
    },
  },
};

/**
 * Builds a preset dynamically adapted to the user's current prompt
 */
export function buildPresetForPrompt(
  presetId: GuidanceGeometryPresetId,
  userPrompt: string
): GuidanceGeometryPreset {
  const basePreset = GUIDANCE_GEOMETRY_PRESETS[presetId];
  if (!userPrompt.trim()) return basePreset;

  const customizedForces = createDefaultForceChannels(userPrompt);
  // Merge preset weights and specific parameters onto the extracted prompt forces
  customizedForces.primaryAttractorA.weight = basePreset.forces.primaryAttractorA.weight;
  customizedForces.primaryAttractorB.weight = basePreset.forces.primaryAttractorB.weight;
  customizedForces.structuralForce.weight = basePreset.forces.structuralForce.weight;
  customizedForces.identityAnchor.weight = basePreset.forces.identityAnchor.weight;
  customizedForces.materialForce.weight = basePreset.forces.materialForce.weight;

  return {
    ...basePreset,
    forces: {
      ...customizedForces,
      structuralForce: {
        ...customizedForces.structuralForce,
        compulsionRule: basePreset.forces.structuralForce.compulsionRule,
        invariants: basePreset.forces.structuralForce.invariants,
      },
    },
  };
}
