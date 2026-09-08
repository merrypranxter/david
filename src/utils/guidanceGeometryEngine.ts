/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry Engine
 * 
 * Implements the mathematical modeling and prompt synthesis for
 * competing conceptual forces, attractor balancing, categorical cancellation,
 * orthogonal stabilizers, guidance asymmetry, and saddle traps.
 * 
 * Crucial principle:
 * Never assume black-box models expose real CFG vectors.
 * Mode A provides direct control representations for controllable backends.
 * Mode B provides honest serialized approximations via structural consequence.
 */

import { TechnicalModality } from '../types/technicalCore';
import {
  GuidanceExecutionMode,
  ConceptualForceChannels,
  AttractorBalanceConfig,
  CategoricalCancellationConfig,
  OrthogonalStabilizerConfig,
  GuidanceAsymmetryConfig,
  SaddleTrapConfig,
  StructuralInvariantType,
  GuidanceFailureEvaluation,
  GuidanceGeometryInspectionReport,
} from '../types/guidanceGeometry';

// ==========================================
// 1. INVARIANT DESCRIPTIONS BY MODALITY
// ==========================================

export const INVARIANT_MODALITY_DESCRIPTIONS: Record<
  StructuralInvariantType,
  Record<TechnicalModality, { name: string; clauses: string[] }>
> = {
  CONTINUOUS_BOUNDARY: {
    IMAGE: {
      name: 'Single Unbroken Outer Manifold',
      clauses: [
        'enclosed within exactly one continuous, unbroken outer perimeter silhouette',
        'no fragmentation or detached floating particulate outside the primary boundary contour',
        'topological continuity of the outermost hermetic shell is strictly preserved',
      ],
    },
    VIDEO: {
      name: 'Temporally Continuous Silhouette Manifold',
      clauses: [
        'the enclosing hull maintains continuous unbroken spatial boundary across all frames',
        'zero topological tearing or particulate detachment during kinetic morphing',
        'the outer convex hull bounds both competing forces in seamless kinematic confinement',
      ],
    },
    AUDIO: {
      name: 'Continuous Dynamic Wave Envelope',
      clauses: [
        'continuous dynamic wave envelope with zero zero-crossing dropouts',
        'unbroken sustain profile binding both sonic textures into a singular acoustic enclosure',
      ],
    },
  },
  CONSERVED_TOPOLOGY: {
    IMAGE: {
      name: 'Fixed Genus & Boundary Loop Invariant',
      clauses: [
        'conserved topological genus: exact fixed count of through-holes and internal apertures',
        'internal voids and through-channels maintain invariant Euler characteristic',
        'structural topology remains invariant under competing material tension',
      ],
    },
    VIDEO: {
      name: 'Kinematic Genus Conservation',
      clauses: [
        'aperture genus invariant maintained through spatial transformation',
        'no spontaneous cavity emergence or hole closure across consecutive frames',
      ],
    },
    AUDIO: {
      name: 'Harmonic Formant Ratio Invariant',
      clauses: [
        'strictly conserved fundamental formant ratios despite timbral battle',
        'spectral aperture count remains invariant through dynamic phase transitions',
      ],
    },
  },
  PRESERVED_SILHOUETTE: {
    IMAGE: {
      name: 'Strict Monolithic Silhouette Mask',
      clauses: [
        'rigidly preserved geometric silhouette contour regardless of internal battle',
        'external shadow projection maintains exact recognizable subject outline',
        'internal warfare cannot breach the outer framing boundary',
      ],
    },
    VIDEO: {
      name: 'Persistent Projection Contour',
      clauses: [
        'silhouette contour projection invariant throughout spatial rotation',
        'occlusion mask boundaries remain rigidly defined',
      ],
    },
    AUDIO: {
      name: 'Fixed Dynamic Range Contour',
      clauses: [
        'fixed macroscopic amplitude profile and envelope gating contour',
        'macro-level silhouette of the soundstage remains unbreached',
      ],
    },
  },
  PRESSURE_BALANCE: {
    IMAGE: {
      name: 'Hydrostatic & Structural Equilibrium',
      clauses: [
        'isobaric pressure balance between internal chambers and exterior hull',
        'tensile stress distributed equitably across structural struts and junctions',
        'neither chamber exhibits hydraulic collapse or structural burst',
      ],
    },
    VIDEO: {
      name: 'Dynamic Baric Equilibrium',
      clauses: [
        'dynamic pressure equilibrium maintained through oscillating frame cycles',
        'fluid compression counter-balances rigid mechanical expansion in real time',
      ],
    },
    AUDIO: {
      name: 'Sub-bass to High-Mid Pressure Equality',
      clauses: [
        'equalized spectral pressure balance across lower resonant and high transience bands',
        'neither frequency domain exerts uncompensated acoustic clipping',
      ],
    },
  },
  HINGE_COUNT: {
    IMAGE: {
      name: 'Exact Articulating Joint Count',
      clauses: [
        'strictly configured with exactly 3 primary articulating pivot hinges',
        'load-bearing fulcrum points clearly demarcated without extra pseudo-limbs',
      ],
    },
    VIDEO: {
      name: 'Conserved Kinematic Joint Topology',
      clauses: [
        'fixed set of 3 rotational hinges governing all relative segment motions',
        'zero spontaneous joint synthesis or parasitic pivot generation',
      ],
    },
    AUDIO: {
      name: 'Discrete Cadential Pivot Points',
      clauses: [
        'exactly 3 structural modulation pivots anchoring the progression',
        'fixed cadential hinge events dividing the sonic continuum',
      ],
    },
  },
  SYMMETRY_COUNT: {
    IMAGE: {
      name: 'Strict Bilateral Symmetry Axis',
      clauses: [
        'perfect mathematical bilateral reflection symmetry along central sagittal axis',
        'competing forces mirrored with geometric exactitude across median plane',
      ],
    },
    VIDEO: {
      name: 'Conserved Dynamic Axial Symmetry',
      clauses: [
        'rotational symmetry plane preserved through kinetic rotation',
        'equidistant balance maintained relative to central axis vector',
      ],
    },
    AUDIO: {
      name: 'Stereo Field Reflection Symmetry',
      clauses: [
        'mirrored stereo phase symmetry across left and right binaural axes',
        'counter-point inversion with identical pan displacement',
      ],
    },
  },
  RHYTHMIC_GRID: {
    IMAGE: {
      name: 'Spatial Metric Tessellation',
      clauses: [
        'underlying spatial metric grid dividing surface into periodic structural modules',
        'harmonic spacing intervals dictating element distribution',
      ],
    },
    VIDEO: {
      name: 'Strict Temporal Frame Pulse',
      clauses: [
        'isochronous temporal pulse governing transformation speed',
        'phase transitions locked to exact periodic frame intervals',
      ],
    },
    AUDIO: {
      name: 'Rigid Isochronous Meter',
      clauses: [
        'rigid 120 BPM tempo grid anchoring competing chaotic timbral textures',
        'relentless unyielding metric pulse under which micro-tonal textures struggle',
      ],
    },
  },
  MOTION_TRAJECTORY: {
    IMAGE: {
      name: 'Implied Kinetic Vector Curve',
      clauses: [
        'strong directional kinetic vector line guiding visual eye path',
        'unbroken parabolic flow line uniting disparate physical textures',
      ],
    },
    VIDEO: {
      name: 'Continuous Centroid Flight Path',
      clauses: [
        'subject centroid follows single continuous uninterrupted smooth trajectory curve',
        'kinematic momentum conserved without jitter or sudden teleportation',
      ],
    },
    AUDIO: {
      name: 'Continuous Pitch/Filter Glide Trajectory',
      clauses: [
        'unbroken continuous glissando trajectory across acoustic field',
        'centroid frequency follows smooth uninterrupted logarithmic sweep',
      ],
    },
  },
  FIXED_FRAME_OCCUPANCY: {
    IMAGE: {
      name: 'Golden Ratio Frame Density',
      clauses: [
        'occupies exactly 68% of visual frame volume with centered compositional weight',
        'negative space borders precisely regulated at perimeter boundaries',
      ],
    },
    VIDEO: {
      name: 'Conserved Screen Volume Percentage',
      clauses: [
        'subject mass maintains constant 68% frame occupancy through camera push',
        'depth scaling exactly offsets focal length transitions',
      ],
    },
    AUDIO: {
      name: 'Calibrated Dynamic Headroom',
      clauses: [
        'calibrated -6 dB RMS occupancy ceiling with zero master bus bleed',
        'spatial stereo width locked at 85% stereo spread',
      ],
    },
  },
  CONNECTED_REGIONS: {
    IMAGE: {
      name: 'Exact Dual-Chamber Connectivity',
      clauses: [
        'comprising exactly two connected structural chambers conjoined at a singular neck',
        'zero extraneous satellite components or disconnected structural islands',
      ],
    },
    VIDEO: {
      name: 'Conserved Component Topology',
      clauses: [
        'exactly two connected mass zones maintain unbroken physical junction throughout sequence',
        'connection conduit never severs or duplicates',
      ],
    },
    AUDIO: {
      name: 'Dual Interlocking Sonic Bands',
      clauses: [
        'exactly two interlocking acoustic frequency bands bound by shared ring modulation',
        'inter-band connection maintained continuously',
      ],
    },
  },
};

// ==========================================
// 2. DEFAULT FORCES FACTORY
// ==========================================

export function createDefaultForceChannels(
  conceptPrompt: string,
  modality: TechnicalModality = 'IMAGE'
): ConceptualForceChannels {
  // Infer core subject anchor or extract from prompt
  const cleanPrompt = conceptPrompt.trim();
  const words = cleanPrompt.split(/\s+/).filter((w) => w.length > 2);
  const subjectGuess = words.slice(0, 3).join(' ') || 'monolithic construct';

  return {
    primaryAttractorA: {
      label: 'Attractor A (Mineral / Crystalline)',
      concept: 'rigid geometric mineral lattice with faceted basalt planar cleavage',
      weight: 0.5,
      structuralManifestations: [
        'microscopic hexagonal crystal grain growth',
        'planar cleavage facets intersecting at strict 60-degree dihedral angles',
        'brittle compressive strength with zero elastic tensile give',
      ],
    },
    primaryAttractorB: {
      label: 'Attractor B (Vascular / Biological)',
      concept: 'pulsing arterial vascular tissue with wet subcutaneous hydrostatic tension',
      weight: 0.5,
      structuralManifestations: [
        'dendritic capillary branching distributing internal fluid pressure',
        'elastic tensile membrane flexing under rhythmic volumetric pulse',
        'viscous weeping surface exudate and organic thermal gradient',
      ],
    },
    structuralForce: {
      weight: 0.85,
      invariants: [
        'single continuous unbroken perimeter hull',
        'isobaric pressure equilibrium across all internal junctions',
      ],
      compulsionRule:
        'Both incompatible physical systems must exert simultaneous mechanical pressure upon the same unbroken structural manifold.',
    },
    identityAnchor: {
      subject: subjectGuess,
      weight: 0.7,
      isAnchored: true,
    },
    materialForce: {
      pressure: 'calcified mineral encrustation interpenetrating vascular flesh',
      weight: 0.65,
      mediumResistance: 'unyielding solid vs hydraulic viscous resistance',
    },
  };
}

// ==========================================
// 3. FAILURE MODE DETECTION ENGINE
// ==========================================

export function evaluateGuidanceFailures(
  forces: ConceptualForceChannels,
  saddleConfig: SaddleTrapConfig,
  cancellationConfig: CategoricalCancellationConfig,
  stabilizerConfig: OrthogonalStabilizerConfig,
  promptText: string
): GuidanceFailureEvaluation[] {
  const failures: GuidanceFailureEvaluation[] = [];

  const weightA = forces.primaryAttractorA.weight;
  const weightB = forces.primaryAttractorB.weight;
  const structWeight = forces.structuralForce.weight;
  const identityWeight = forces.identityAnchor.weight;
  const materialWeight = forces.materialForce.weight;
  const diffAB = Math.abs(weightA - weightB);

  // 1. CONCEPT DOMINANCE
  // If one attractor dominates (> 0.40 diff without deliberate asymmetric setting)
  if (diffAB > 0.45 && saddleConfig.abBalance !== 0.5) {
    const dominantName = weightA > weightB ? 'Attractor A' : 'Attractor B';
    const suppressedName = weightA > weightB ? 'Attractor B' : 'Attractor A';
    failures.push({
      failureMode: 'CONCEPT_DOMINANCE',
      severity: diffAB > 0.7 ? 'CRITICAL' : 'HIGH',
      score: diffAB,
      title: `Concept Dominance: ${dominantName} Monopolizes Latent Basin`,
      diagnosis: `${dominantName} (weight ${(Math.max(weightA, weightB)).toFixed(2)}) completely overwhelms ${suppressedName} (weight ${(Math.min(weightA, weightB)).toFixed(2)}), collapsing the saddle equilibrium into a one-sided canonical rendering.`,
      evidence: [
        `Weight differential: ${(diffAB).toFixed(2)} exceeds critical threshold (0.45)`,
        `Prompt structural consequence allocation strongly skewed toward ${dominantName}`,
      ],
      recommendations: [
        {
          action: 'Rebalance Attractor Weights',
          targetParameter: 'attractorAWeight / attractorBWeight',
          suggestedAdjustment: `Bring weights closer to equilibrium (e.g. A=${(0.5).toFixed(2)}, B=${(0.5).toFixed(2)})`,
        },
        {
          action: 'Reinforce Saddle Trap',
          targetParameter: 'saddleWidth',
          suggestedAdjustment: 'Narrow saddle width to penalize one-sided basin drift',
        },
      ],
    });
  }

  // 2. GENERIC HYBRID
  // If A and B are equal, but structural compulsion is low (< 0.40) or strictness is loose
  if (diffAB < 0.15 && structWeight < 0.45 && stabilizerConfig.strictness === 'LOOSE') {
    failures.push({
      failureMode: 'GENERIC_HYBRID',
      severity: 'HIGH',
      score: 1.0 - structWeight,
      title: 'Generic Hybrid: Superficial 50/50 Mashup Collapse',
      diagnosis:
        'Attractors A and B are equally weighted, but insufficient structural invariants exist to enforce ontological tension. The model will default to a naive cosmetic split (e.g. half-rock, half-meat) rather than a deep structural compromise.',
      evidence: [
        `Structural force weight (${structWeight.toFixed(2)}) is below safety threshold (0.45)`,
        'Invariant strictness is currently LOOSE',
        'Zero geometric contradiction constraints enforcing unified manifold',
      ],
      recommendations: [
        {
          action: 'Increase Structural Compulsion',
          targetParameter: 'structuralForce.weight',
          suggestedAdjustment: 'Increase structural force to >= 0.80 to compel topological integration',
        },
        {
          action: 'Upgrade Invariant Strictness',
          targetParameter: 'strictness',
          suggestedAdjustment: 'Elevate stabilizer strictness to STRICT or AXIOMATIC',
        },
        {
          action: 'Activate Continuous Boundary Invariant',
          targetParameter: 'structuralInvariantType',
          suggestedAdjustment: 'Set invariant to CONTINUOUS_BOUNDARY to force single unified skin',
        },
      ],
    });
  }

  // 3. STRUCTURAL COLLAPSE
  // If structural force is extremely weak (< 0.25)
  if (structWeight < 0.25) {
    failures.push({
      failureMode: 'STRUCTURAL_COLLAPSE',
      severity: 'CRITICAL',
      score: 1.0 - structWeight,
      title: 'Structural Collapse: Boundary Dissolution into Feature Soup',
      diagnosis:
        'Structural constraints are virtually deactivated. Under competing attractor tension without a structural stabilizer, the generation will dissolve into amorphous visual noise, blur, or dissociated particulate.',
      evidence: [
        `Structural force (${structWeight.toFixed(2)}) is critically low (< 0.25)`,
        'No invariant envelope bounding the conflicting material pressures',
      ],
      recommendations: [
        {
          action: 'Increase Structural Compulsion Immediately',
          targetParameter: 'structuralForce.weight',
          suggestedAdjustment: 'Raise structural force to >= 0.75',
        },
        {
          action: 'Anchor Identity Silhouette',
          targetParameter: 'identityAnchor.weight',
          suggestedAdjustment: 'Boost identity anchor to prevent complete geometric dissolution',
        },
      ],
    });
  }

  // 4. UNCONDITIONED REGRESSION
  // If all forces are diluted (< 0.30 across the board)
  if (weightA < 0.35 && weightB < 0.35 && structWeight < 0.35 && materialWeight < 0.35) {
    failures.push({
      failureMode: 'UNCONDITIONED_REGRESSION',
      severity: 'HIGH',
      score: 0.85,
      title: 'Unconditioned Regression: Regression to Prior Mean',
      diagnosis:
        'All competing force channels are set to sub-threshold amplitudes. The target model will fall back to its unconditioned training prior, producing a generic, safe, commercial stock aesthetic.',
      evidence: [
        'Attractor A, B, Structure, and Material weights all below 0.35',
        'Insufficient conditioning energy to drive diffusion trajectory out of standard mean',
      ],
      recommendations: [
        {
          action: 'Amplify Primary Forces',
          targetParameter: 'primaryAttractorA / B',
          suggestedAdjustment: 'Raise Attractor A and B to at least 0.60 to drive latent departure',
        },
        {
          action: 'Apply Core Preset',
          targetParameter: 'preset',
          suggestedAdjustment: 'Engage PRESET_CATEGORY_CIVIL_WAR or PRESET_SADDLE_MONSTER',
        },
      ],
    });
  }

  // 5. CONDITION DROP
  // If an attractor is explicitly defined in config but completely missing in prompt consequence
  const lowerPrompt = promptText.toLowerCase();
  const aWords = forces.primaryAttractorA.concept.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  const bWords = forces.primaryAttractorB.concept.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  const hasA = aWords.some((w) => lowerPrompt.includes(w));
  const hasB = bWords.some((w) => lowerPrompt.includes(w));

  if ((!hasA && weightA > 0.4) || (!hasB && weightB > 0.4)) {
    const droppedName = !hasA ? 'Attractor A' : 'Attractor B';
    failures.push({
      failureMode: 'CONDITION_DROP',
      severity: 'MEDIUM',
      score: 0.6,
      title: `Condition Drop: ${droppedName} Consequence Silently Omitted`,
      diagnosis: `${droppedName} is assigned significant conditioning weight (${(!hasA ? weightA : weightB).toFixed(2)}) in config, but its structural and physical manifestations are absent from the serialized prompt.`,
      evidence: [
        `Keywords from ${droppedName} not detected in active prompt representation`,
        'Model cannot condition on an unrepresented force channel',
      ],
      recommendations: [
        {
          action: 'Re-serialize Prompt with Force Channels',
          targetParameter: 'prompt',
          suggestedAdjustment: 'Re-synthesize prompt using Guidance Geometry Serialized Approximation',
        },
      ],
    });
  }

  return failures;
}

// ==========================================
// 4. BLACK-BOX SERIALIZED APPROXIMATION BUILDER
// ==========================================

export function synthesizeSerializedApproximation(
  forces: ConceptualForceChannels,
  balanceConfig: AttractorBalanceConfig,
  cancellationConfig: CategoricalCancellationConfig,
  stabilizerConfig: OrthogonalStabilizerConfig,
  asymmetryConfig: GuidanceAsymmetryConfig,
  saddleConfig: SaddleTrapConfig,
  modality: TechnicalModality = 'IMAGE'
): {
  prompt: string;
  structuralConsequences: string[];
  constraintBlocks: string[];
  invariants: string[];
  intermediateFormDescription: string;
} {
  const structuralConsequences: string[] = [];
  const constraintBlocks: string[] = [];
  const invariants: string[] = [];

  // A. Identity Anchor
  const subjectAnchor = forces.identityAnchor.subject.trim() || 'central entity';
  const identityClause = `Primary topological subject: [${subjectAnchor}].`;

  // B. Structural Invariant Clauses (Orthogonal Stabilizer)
  const invariantData = INVARIANT_MODALITY_DESCRIPTIONS[stabilizerConfig.structuralInvariantType]?.[modality] ||
    INVARIANT_MODALITY_DESCRIPTIONS.CONTINUOUS_BOUNDARY.IMAGE;
  
  const selectedClauses = invariantData.clauses.slice(0, Math.min(stabilizerConfig.invariantCount, invariantData.clauses.length));
  selectedClauses.forEach((c) => {
    invariants.push(`[INVARIANT: ${invariantData.name}] ${c}`);
  });

  // Strictness preface
  const strictnessDirective =
    stabilizerConfig.strictness === 'AXIOMATIC'
      ? 'Axiomatic structural law (MUST NOT FAIL UNDER ANY MATERIAL TENSION):'
      : stabilizerConfig.strictness === 'STRICT'
      ? 'Rigid invariant constraint:'
      : 'Guiding geometric equilibrium:';

  const stabilizerBlock = `${strictnessDirective} ${selectedClauses.join('; ')}.`;
  constraintBlocks.push(stabilizerBlock);

  // C. Categorical Cancellation (Taxonomy Weakening + Structural Compulsion)
  let cancellationClause = '';
  if (cancellationConfig.categorySuppression > 0.4) {
    const ambiguityWord =
      cancellationConfig.taxonomicAmbiguity === 'HIGH'
        ? 'indecipherable taxonomic origin'
        : cancellationConfig.taxonomicAmbiguity === 'MEDIUM'
        ? 'ambiguous hybrid classification'
        : 'unresolved nominal class';

    cancellationClause =
      `Classification suppression: The entity explicitly refuses classification as any standard named category; its physical morphology displays ${ambiguityWord}, yet every mechanical junction, stress vector, and material interface functions with absolute physical coherence.`;
    constraintBlocks.push(cancellationClause);
  }

  // D. Attractor Balance & Mutual Consequence
  const weightA = forces.primaryAttractorA.weight;
  const weightB = forces.primaryAttractorB.weight;
  const conceptA = forces.primaryAttractorA.concept;
  const conceptB = forces.primaryAttractorB.concept;

  // Derive independent structural consequences based on weights
  // High weight: reinforce through multiple independent physical consequences
  // Low weight: mention once, indirectly
  const consequencesA: string[] = [];
  const consequencesB: string[] = [];

  if (weightA > 0.7) {
    consequencesA.push(
      `dominating compressive load exerted by ${conceptA}`,
      `surface cleavage and structural tessellation dictated by ${conceptA}`,
      `micro-grain shear resistance enforced by ${conceptA}`
    );
  } else if (weightA >= 0.4) {
    consequencesA.push(
      `structural pressure and material influence of ${conceptA}`,
      `co-equal physical manifestation of ${conceptA}`
    );
  } else {
    consequencesA.push(`subtle underlayer tracing of ${conceptA}`);
  }

  if (weightB > 0.7) {
    consequencesB.push(
      `overwhelming tensile stress and hydraulic expansion of ${conceptB}`,
      `continuous dynamic fluid weeping and elastic deformation from ${conceptB}`,
      `subcutaneous metabolic heat gradient enforced by ${conceptB}`
    );
  } else if (weightB >= 0.4) {
    consequencesB.push(
      `viscous tensile response and hydrostatic volume from ${conceptB}`,
      `co-equal physical manifestation of ${conceptB}`
    );
  } else {
    consequencesB.push(`subtle underlayer tracing of ${conceptB}`);
  }

  structuralConsequences.push(...consequencesA, ...consequencesB);

  // E. Saddle Trap Equilibrium Clause
  const isSaddleCentric = Math.abs(saddleConfig.abBalance - 0.5) < (saddleConfig.saddleWidth || 0.2);
  let saddleClause = '';

  if (isSaddleCentric) {
    saddleClause =
      `Saddle Equilibrium Trap: Neither ${conceptA} nor ${conceptB} is permitted to resolve or dominate the morphology; the two incompatible forces are locked in mutual, unyielding physical contest upon the singular structural frame, generating an unstable intermediate state where rigid planar crystalline cleavage continuously calcifies through pulsing vascular walls without ever dissolving into a generic 50/50 blend.`;
  } else if (saddleConfig.abBalance < 0.5) {
    saddleClause =
      `Asymmetric Saddle Tension: ${conceptA} exerts primary structural dominance (weight ${(1.0 - saddleConfig.abBalance).toFixed(2)}), yet ${conceptB} refuses suppression, maintaining active physical resistance along internal seams and junctions.`;
  } else {
    saddleClause =
      `Asymmetric Saddle Tension: ${conceptB} exerts primary structural dominance (weight ${saddleConfig.abBalance.toFixed(2)}), yet ${conceptA} refuses suppression, maintaining active physical resistance along internal seams and junctions.`;
  }
  constraintBlocks.push(saddleClause);

  // F. Material Pressure Force
  const materialClause =
    forces.materialForce.weight > 0.3
      ? `Material Force Pressure: ${forces.materialForce.pressure}; resisting medium: ${forces.materialForce.mediumResistance}.`
      : '';
  if (materialClause) constraintBlocks.push(materialClause);

  // G. Synthesize Unified Serialized Prompt
  const intermediateFormDescription =
    `An ontological compromise wherein [${conceptA}] and [${conceptB}] occupy the exact same coordinate volume without blending into soup, held in mutual suspension by [${invariantData.name}].`;

  const promptSections = [
    identityClause,
    stabilizerBlock,
    cancellationClause,
    saddleClause,
    `Force Manifestations: ${structuralConsequences.join('; ')}.`,
    materialClause,
    `Execution Note (Serialized Approximation): Expressing guidance geometry balance via interlocked structural consequences without synthetic blend smoothing.`,
  ].filter(Boolean);

  const fullPrompt = promptSections.join('\n\n');

  return {
    prompt: fullPrompt,
    structuralConsequences,
    constraintBlocks,
    invariants,
    intermediateFormDescription,
  };
}

// ==========================================
// 5. DIRECT CONTROL SPEC GENERATOR
// ==========================================

export function generateDirectControlSpec(
  forces: ConceptualForceChannels,
  balanceConfig: AttractorBalanceConfig,
  asymmetryConfig: GuidanceAsymmetryConfig,
  saddleConfig: SaddleTrapConfig
): {
  channelWeights: Record<string, number>;
  cfgVectorSplit: Record<string, number>;
  negativeChannels: string[];
} {
  return {
    channelWeights: {
      'channel_attractor_a': Number(forces.primaryAttractorA.weight.toFixed(3)),
      'channel_attractor_b': Number(forces.primaryAttractorB.weight.toFixed(3)),
      'channel_structural_stabilizer': Number(forces.structuralForce.weight.toFixed(3)),
      'channel_identity_anchor': Number(forces.identityAnchor.weight.toFixed(3)),
      'channel_material_pressure': Number(forces.materialForce.weight.toFixed(3)),
    },
    cfgVectorSplit: {
      'cfg_attractor_a_delta': Number(((forces.primaryAttractorA.weight - 0.5) * 4.0).toFixed(2)),
      'cfg_attractor_b_delta': Number(((forces.primaryAttractorB.weight - 0.5) * 4.0).toFixed(2)),
      'cfg_structure_invariant_boost': Number((forces.structuralForce.weight * 3.5).toFixed(2)),
      'cfg_saddle_penalty_gradient': Number((saddleConfig.saddleWidth * 2.0).toFixed(2)),
    },
    negativeChannels: [
      'generic blended mush',
      'trivial 50/50 portmanteau split',
      'unconditioned regression',
      'dissolved boundary contour',
      'single-category collapse',
    ],
  };
}

// ==========================================
// 6. MASTER REPORT GENERATOR
// ==========================================

export function generateGuidanceInspectionReport(
  forces: ConceptualForceChannels,
  balanceConfig: AttractorBalanceConfig,
  cancellationConfig: CategoricalCancellationConfig,
  stabilizerConfig: OrthogonalStabilizerConfig,
  asymmetryConfig: GuidanceAsymmetryConfig,
  saddleConfig: SaddleTrapConfig,
  executionMode: GuidanceExecutionMode,
  modality: TechnicalModality = 'IMAGE'
): GuidanceGeometryInspectionReport {
  // Synthesize prompt and structural consequences
  const approx = synthesizeSerializedApproximation(
    forces,
    balanceConfig,
    cancellationConfig,
    stabilizerConfig,
    asymmetryConfig,
    saddleConfig,
    modality
  );

  // Failure evaluations
  const activeFailures = evaluateGuidanceFailures(
    forces,
    saddleConfig,
    cancellationConfig,
    stabilizerConfig,
    approx.prompt
  );

  // Compute dominant force
  const weights = [
    { key: 'ATTRACTOR_A' as const, val: forces.primaryAttractorA.weight },
    { key: 'ATTRACTOR_B' as const, val: forces.primaryAttractorB.weight },
    { key: 'STRUCTURE' as const, val: forces.structuralForce.weight },
    { key: 'IDENTITY' as const, val: forces.identityAnchor.weight },
    { key: 'MATERIAL' as const, val: forces.materialForce.weight },
  ];
  weights.sort((a, b) => b.val - a.val);

  let dominantForce: GuidanceGeometryInspectionReport['dominantForce'] = 'EQUILIBRIUM';
  if (Math.abs(forces.primaryAttractorA.weight - forces.primaryAttractorB.weight) < 0.1 && weights[0].val <= forces.structuralForce.weight) {
    dominantForce = forces.structuralForce.weight > 0.75 ? 'STRUCTURE' : 'EQUILIBRIUM';
  } else {
    dominantForce = weights[0].key;
  }

  // Balance State
  let balanceState: GuidanceGeometryInspectionReport['balanceState'] = 'EQUILIBRIUM';
  const diffAB = Math.abs(forces.primaryAttractorA.weight - forces.primaryAttractorB.weight);
  if (forces.structuralForce.weight < 0.25) {
    balanceState = 'COLLAPSED_UNRESOLVED';
  } else if (forces.structuralForce.weight > 0.85 && diffAB < 0.15) {
    balanceState = 'STRUCTURE_DOMINANT';
  } else if (diffAB < 0.15) {
    balanceState = 'EQUILIBRIUM';
  } else if (forces.primaryAttractorA.weight > forces.primaryAttractorB.weight) {
    balanceState = 'A_DOMINANT';
  } else {
    balanceState = 'B_DOMINANT';
  }

  // Specific Checks
  const didOneAttractorGetDropped = activeFailures.some((f) => f.failureMode === 'CONDITION_DROP');
  const didOutputCollapseIntoGenericMixture = activeFailures.some((f) => f.failureMode === 'GENERIC_HYBRID');
  const didStructuralInvariantSurvive = forces.structuralForce.weight >= 0.40 && stabilizerConfig.strictness !== 'LOOSE';
  const didNewIntermediateFormAppear =
    diffAB <= 0.35 &&
    forces.structuralForce.weight >= 0.60 &&
    !didOutputCollapseIntoGenericMixture &&
    !didOneAttractorGetDropped;

  // Direct Control Spec if applicable
  const directSpec = executionMode === 'DIRECT_MODEL_CONTROL'
    ? generateDirectControlSpec(forces, balanceConfig, asymmetryConfig, saddleConfig)
    : undefined;

  return {
    executionMode,
    targetModality: modality,
    forces,
    dominantForce,
    balanceState,
    didOneAttractorGetDropped,
    didOutputCollapseIntoGenericMixture,
    didStructuralInvariantSurvive,
    didNewIntermediateFormAppear,
    attractorSeparation: Number((1.0 - diffAB).toFixed(3)),
    saddleRetentionScore: Number((saddleConfig.structuralForce * (1.0 - diffAB)).toFixed(3)),
    structuralStabilityMargin: Number(forces.structuralForce.weight.toFixed(3)),
    activeFailures,
    renderedPrompt: approx.prompt,
    directControlSpec: directSpec,
    serializedApproximationSpec: {
      independentStructuralConsequences: approx.structuralConsequences,
      synthesizedConstraintBlocks: approx.constraintBlocks,
      invariantEnforcementClauses: approx.invariants,
      intermediateFormDescription: approx.intermediateFormDescription,
    },
  };
}
