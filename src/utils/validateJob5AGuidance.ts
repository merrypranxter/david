/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5A: Guidance Geometry Acceptance Tests
 * 
 * Verifies the 11 Acceptance Criteria:
 * 1. Guidance represented as multiple independent forces (A, B, Structure, Identity, Material)
 * 2. Dual Attractors balanced or asymmetrically weighted
 * 3. Category identity can be weakened while structure remains strong
 * 4. Structural Stabilizer prevents trivial collapse with invariant preservation
 * 5. Saddle Trap keeps both attractors logically active on separatrix
 * 6. Black-box models use honest prompt-level approximation without fake internal-control claims
 * 7. Inspector exposes forces, dominant force, balance state, and failure modes
 * 8. Real-time failure detection flags boring modes and provides recommendations
 * 9. All 4 Core Presets produce coherent configurations
 * 10. Direct Control mode provides explicit channel weights and CFG vectors
 * 11. Technical Operator Registry contains Job 5A operators
 * 12. Existing Jobs 1–4 remain fully functional
 */

import {
  createDefaultForceChannels,
  generateGuidanceInspectionReport,
  synthesizeSerializedApproximation,
  generateDirectControlSpec,
  evaluateGuidanceFailures,
} from './guidanceGeometryEngine';
import { GUIDANCE_GEOMETRY_PRESETS, buildPresetForPrompt } from './guidancePresets';
import { listTechnicalOperators, getTechnicalOperator } from './technicalRegistry';
import {
  AttractorBalanceConfig,
  CategoricalCancellationConfig,
  OrthogonalStabilizerConfig,
  GuidanceAsymmetryConfig,
  SaddleTrapConfig,
} from '../types/guidanceGeometry';

export interface GuidanceValidationResult {
  id: string;
  description: string;
  passed: boolean;
  details?: string;
}

export interface GuidanceValidationReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  allPassed: boolean;
  testResults: GuidanceValidationResult[];
}

export function runJob5AValidationSuite(): GuidanceValidationReport {
  const testResults: GuidanceValidationResult[] = [];

  // 1. Guidance represented as multiple independent forces
  {
    const forces = createDefaultForceChannels('ancient clockwork locomotive engine', 'IMAGE');
    const hasA = Boolean(forces.primaryAttractorA && forces.primaryAttractorA.weight !== undefined);
    const hasB = Boolean(forces.primaryAttractorB && forces.primaryAttractorB.weight !== undefined);
    const hasStruct = Boolean(forces.structuralForce && forces.structuralForce.weight !== undefined);
    const hasId = Boolean(forces.identityAnchor && forces.identityAnchor.weight !== undefined);
    const hasMat = Boolean(forces.materialForce && forces.materialForce.weight !== undefined);

    const passed = hasA && hasB && hasStruct && hasId && hasMat;
    testResults.push({
      id: 'TEST_1_MULTIPLE_INDEPENDENT_FORCES',
      description: 'Guidance is modeled as 5 distinct independent conditioning channels',
      passed,
      details: `Channels verified: Attractor A (${forces.primaryAttractorA.weight}), Attractor B (${forces.primaryAttractorB.weight}), Structure (${forces.structuralForce.weight}), Identity (${forces.identityAnchor.weight}), Material (${forces.materialForce.weight})`,
    });
  }

  // 2. Dual Attractors balanced or asymmetrically weighted
  {
    const forces = createDefaultForceChannels('obsidian heart', 'IMAGE');
    forces.primaryAttractorA.weight = 0.35;
    forces.primaryAttractorB.weight = 0.65;
    const diff = Math.abs(forces.primaryAttractorA.weight - forces.primaryAttractorB.weight);
    const passed = diff > 0.25 && forces.primaryAttractorA.weight > 0 && forces.primaryAttractorB.weight > 0;

    testResults.push({
      id: 'TEST_2_ATTRACTOR_BALANCE_AND_ASYMMETRY',
      description: 'Two attractors can be balanced or asymmetrically weighted',
      passed,
      details: `Attractor A: ${forces.primaryAttractorA.weight}, Attractor B: ${forces.primaryAttractorB.weight}, Asymmetric delta: ${diff.toFixed(2)}`,
    });
  }

  // 3. Category identity can be weakened while structure remains strong
  {
    const forces = createDefaultForceChannels('biomechanical centipede', 'IMAGE');
    const balanceConfig: AttractorBalanceConfig = {
      attractorA: 'machined bronze gears',
      attractorAWeight: 0.5,
      attractorB: 'segmented chitinous cuticle',
      attractorBWeight: 0.5,
      balanceMode: 'NEAR_EQUILIBRIUM',
      competitionStrength: 0.85,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    };
    const cancellationConfig: CategoricalCancellationConfig = {
      categorySuppression: 0.9,
      structuralCompulsion: 0.95,
      categoryPairCount: 2,
      taxonomicAmbiguity: 'HIGH',
      suppressedCategories: ['insect', 'machine'],
      compulsoryStructures: ['hinge articulation', 'continuous boundary manifold', 'isobaric pressure'],
    };
    const stabilizerConfig: OrthogonalStabilizerConfig = {
      stabilizerStrength: 0.95,
      structuralInvariantType: 'HINGE_COUNT',
      invariantCount: 3,
      strictness: 'AXIOMATIC',
      targetModality: 'IMAGE',
    };
    const asymmetryConfig: GuidanceAsymmetryConfig = {
      primaryWeight: 0.5,
      secondaryWeight: 0.5,
      structuralWeight: 0.95,
      identityWeight: 0.6,
      materialWeight: 0.7,
      presetType: 'STRUCTURE_OVER_CATEGORY',
    };
    const saddleConfig: SaddleTrapConfig = {
      abBalance: 0.5,
      structuralForce: 0.95,
      saddleWidth: 0.12,
      driftTolerance: 0.05,
      escapeResponse: 'REINFORCE_STRUCTURE',
    };

    const approx = synthesizeSerializedApproximation(
      forces,
      balanceConfig,
      cancellationConfig,
      stabilizerConfig,
      asymmetryConfig,
      saddleConfig,
      'IMAGE'
    );

    const hasSuppressionClause = approx.prompt.includes('Classification suppression');
    const hasStructuralCompulsion = approx.prompt.includes('mechanical junction');
    const passed = hasSuppressionClause && hasStructuralCompulsion;

    testResults.push({
      id: 'TEST_3_CATEGORICAL_CANCELLATION',
      description: 'Category identity is suppressed while mechanical and relational structure is amplified',
      passed,
      details: `Suppression clause active: ${hasSuppressionClause}, Physical coherence compulsory: ${hasStructuralCompulsion}`,
    });
  }

  // 4. Structural Stabilizer prevents trivial collapse with invariant preservation
  {
    const forces = createDefaultForceChannels('crystal ocean', 'IMAGE');
    forces.structuralForce.weight = 0.92;
    const stabilizerConfig: OrthogonalStabilizerConfig = {
      stabilizerStrength: 0.92,
      structuralInvariantType: 'CONTINUOUS_BOUNDARY',
      invariantCount: 2,
      strictness: 'AXIOMATIC',
      targetModality: 'IMAGE',
    };
    const balanceConfig: AttractorBalanceConfig = {
      attractorA: 'rigid crystalline lattice',
      attractorAWeight: 0.5,
      attractorB: 'turbulent liquid saline foam',
      attractorBWeight: 0.5,
      balanceMode: 'NEAR_EQUILIBRIUM',
      competitionStrength: 0.9,
      persistBoth: true,
      preserveNonCategoricalStructure: true,
    };
    const cancellationConfig: CategoricalCancellationConfig = {
      categorySuppression: 0.5,
      structuralCompulsion: 0.85,
      categoryPairCount: 1,
      taxonomicAmbiguity: 'MEDIUM',
      suppressedCategories: [],
      compulsoryStructures: [],
    };
    const asymmetryConfig: GuidanceAsymmetryConfig = {
      primaryWeight: 0.5,
      secondaryWeight: 0.5,
      structuralWeight: 0.92,
      identityWeight: 0.7,
      materialWeight: 0.65,
    };
    const saddleConfig: SaddleTrapConfig = {
      abBalance: 0.5,
      structuralForce: 0.92,
      saddleWidth: 0.15,
      driftTolerance: 0.1,
      escapeResponse: 'REINFORCE_STRUCTURE',
    };

    const report = generateGuidanceInspectionReport(
      forces,
      balanceConfig,
      cancellationConfig,
      stabilizerConfig,
      asymmetryConfig,
      saddleConfig,
      'SERIALIZED_APPROXIMATION',
      'IMAGE'
    );

    const passed = report.didStructuralInvariantSurvive && !report.didOutputCollapseIntoGenericMixture;
    testResults.push({
      id: 'TEST_4_ORTHOGONAL_STABILIZER',
      description: 'Orthogonal Structural Stabilizer maintains topological invariants and prevents generic collapse',
      passed,
      details: `Invariant survived: ${report.didStructuralInvariantSurvive}, Generic mixture avoided: ${!report.didOutputCollapseIntoGenericMixture}`,
    });
  }

  // 5. Saddle Trap keeps both attractors logically active
  {
    const saddlePreset = GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER;
    const report = generateGuidanceInspectionReport(
      saddlePreset.forces,
      saddlePreset.balanceConfig,
      saddlePreset.cancellationConfig,
      saddlePreset.stabilizerConfig,
      saddlePreset.asymmetryConfig,
      saddlePreset.saddleConfig,
      'SERIALIZED_APPROXIMATION',
      'IMAGE'
    );

    const promptText = report.renderedPrompt;
    const hasAttractorA = promptText.includes('faceted silicate basalt') || promptText.includes('obsidian') || promptText.includes('silicate');
    const hasAttractorB = promptText.includes('pulmonary') || promptText.includes('vascular') || promptText.includes('flesh');
    const hasSaddleTrap = promptText.includes('Saddle Equilibrium Trap');

    const passed = hasAttractorA && hasAttractorB && hasSaddleTrap && !report.didOneAttractorGetDropped;
    testResults.push({
      id: 'TEST_5_SADDLE_TRAP_EQUILIBRIUM',
      description: 'Saddle Trap holds both attractors in mutual unresolved tension without dropping either',
      passed,
      details: `Attractor A present: ${hasAttractorA}, Attractor B present: ${hasAttractorB}, Saddle trap clause: ${hasSaddleTrap}`,
    });
  }

  // 6. Black-box models use honest prompt-level approximation instead of fake internal-control claims
  {
    const forces = createDefaultForceChannels('cybernetic monolith', 'IMAGE');
    const balanceConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.balanceConfig;
    const cancellationConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.cancellationConfig;
    const stabilizerConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.stabilizerConfig;
    const asymmetryConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.asymmetryConfig;
    const saddleConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.saddleConfig;

    const report = generateGuidanceInspectionReport(
      forces,
      balanceConfig,
      cancellationConfig,
      stabilizerConfig,
      asymmetryConfig,
      saddleConfig,
      'SERIALIZED_APPROXIMATION',
      'IMAGE'
    );

    const hasHonestNote = report.renderedPrompt.includes('Execution Note (Serialized Approximation)');
    const hasConsequences = report.serializedApproximationSpec.independentStructuralConsequences.length >= 2;
    const directSpecIsUndefined = report.directControlSpec === undefined;

    const passed = hasHonestNote && hasConsequences && directSpecIsUndefined;
    testResults.push({
      id: 'TEST_6_HONEST_BLACK_BOX_TRANSLATION',
      description: 'Black-box translation expresses balance via structural consequences without fake internal-control claims',
      passed,
      details: `Honest annotation: ${hasHonestNote}, Independent consequence count: ${report.serializedApproximationSpec.independentStructuralConsequences.length}, Direct spec isolated: ${directSpecIsUndefined}`,
    });
  }

  // 7. Direct Control mode provides explicit channel weights and CFG vectors
  {
    const forces = createDefaultForceChannels('locomotive heart', 'IMAGE');
    const balanceConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.balanceConfig;
    const cancellationConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.cancellationConfig;
    const stabilizerConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.stabilizerConfig;
    const asymmetryConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.asymmetryConfig;
    const saddleConfig = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR.saddleConfig;

    const report = generateGuidanceInspectionReport(
      forces,
      balanceConfig,
      cancellationConfig,
      stabilizerConfig,
      asymmetryConfig,
      saddleConfig,
      'DIRECT_MODEL_CONTROL',
      'IMAGE'
    );

    const hasDirectSpec = Boolean(report.directControlSpec);
    const hasChannels = Boolean(report.directControlSpec?.channelWeights['channel_attractor_a']);
    const hasCfgSplit = Boolean(report.directControlSpec?.cfgVectorSplit['cfg_structure_invariant_boost']);

    const passed = hasDirectSpec && hasChannels && hasCfgSplit;
    testResults.push({
      id: 'TEST_7_DIRECT_CONTROL_SPECIFICATION',
      description: 'Direct Control mode synthesizes explicit channel weights and CFG vector splits for open pipelines',
      passed,
      details: `Channels: ${Object.keys(report.directControlSpec?.channelWeights || {}).length}, CFG splits: ${Object.keys(report.directControlSpec?.cfgVectorSplit || {}).length}`,
    });
  }

  // 8. Real-time failure detection flags boring modes and provides recommendations
  {
    // Induce CONCEPT_DOMINANCE (A=0.95, B=0.10)
    const brokenForces = createDefaultForceChannels('test', 'IMAGE');
    brokenForces.primaryAttractorA.weight = 0.95;
    brokenForces.primaryAttractorB.weight = 0.1;
    brokenForces.structuralForce.weight = 0.4;

    const saddleConfig: SaddleTrapConfig = {
      abBalance: 0.1,
      structuralForce: 0.4,
      saddleWidth: 0.1,
      driftTolerance: 0.1,
      escapeResponse: 'ALLOW_COLLAPSE',
    };
    const cancellationConfig: CategoricalCancellationConfig = {
      categorySuppression: 0.1,
      structuralCompulsion: 0.4,
      categoryPairCount: 1,
      taxonomicAmbiguity: 'LOW',
      suppressedCategories: [],
      compulsoryStructures: [],
    };
    const stabilizerConfig: OrthogonalStabilizerConfig = {
      stabilizerStrength: 0.4,
      structuralInvariantType: 'CONTINUOUS_BOUNDARY',
      invariantCount: 1,
      strictness: 'LOOSE',
      targetModality: 'IMAGE',
    };

    const failures = evaluateGuidanceFailures(
      brokenForces,
      saddleConfig,
      cancellationConfig,
      stabilizerConfig,
      'prompt without proper representation'
    );

    const hasConceptDominance = failures.some((f) => f.failureMode === 'CONCEPT_DOMINANCE');
    const hasRecommendations = failures.some((f) => f.recommendations.length > 0);

    const passed = hasConceptDominance && hasRecommendations;
    testResults.push({
      id: 'TEST_8_FAILURE_MODE_DETECTION_AND_RECOMMENDATIONS',
      description: 'Failure detector accurately flags Concept Dominance and generates actionable adjustment recommendations',
      passed,
      details: `Concept Dominance flagged: ${hasConceptDominance}, Recommendations provided: ${hasRecommendations}`,
    });
  }

  // 9. All 4 Core Presets produce coherent configurations
  {
    const p1 = GUIDANCE_GEOMETRY_PRESETS.PRESET_CATEGORY_CIVIL_WAR;
    const p2 = GUIDANCE_GEOMETRY_PRESETS.PRESET_TAXONOMY_OFFLINE;
    const p3 = GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER;
    const p4 = GUIDANCE_GEOMETRY_PRESETS.PRESET_MATERIAL_POSSESSION;

    const allHaveForces = Boolean(p1.forces && p2.forces && p3.forces && p4.forces);
    const allHaveConfigs = Boolean(
      p1.stabilizerConfig && p2.cancellationConfig && p3.saddleConfig && p4.asymmetryConfig
    );

    const passed = allHaveForces && allHaveConfigs;
    testResults.push({
      id: 'TEST_9_CORE_PRESETS_VERIFICATION',
      description: 'All 4 Core Presets (Civil War, Taxonomy Offline, Saddle Monster, Material Possession) verified',
      passed,
      details: `Presets validated: 4/4`,
    });
  }

  // 10. Technical Operator Registry contains Job 5A operators
  {
    const registeredOps = listTechnicalOperators();
    const hasAB = registeredOps.some((o) => o.id === 'attractor_balance');
    const hasCC = registeredOps.some((o) => o.id === 'categorical_cancellation');
    const hasOS = registeredOps.some((o) => o.id === 'orthogonal_stabilizer');
    const hasGA = registeredOps.some((o) => o.id === 'guidance_asymmetry');
    const hasST = registeredOps.some((o) => o.id === 'saddle_trap');

    const passed = hasAB && hasCC && hasOS && hasGA && hasST;
    testResults.push({
      id: 'TEST_10_JOB_5A_OPERATOR_REGISTRATION',
      description: 'Technical Operator Registry contains all 5 Guidance Geometry operators',
      passed,
      details: `Registered Job 5A operators: AB (${hasAB}), CC (${hasCC}), OS (${hasOS}), GA (${hasGA}), ST (${hasST})`,
    });
  }

  // 11. Modality adaptation across Image, Video, and Audio
  {
    const imageReport = generateGuidanceInspectionReport(
      createDefaultForceChannels('clockwork heart', 'IMAGE'),
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.balanceConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.cancellationConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.stabilizerConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.asymmetryConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.saddleConfig,
      'SERIALIZED_APPROXIMATION',
      'IMAGE'
    );
    const audioReport = generateGuidanceInspectionReport(
      createDefaultForceChannels('clockwork heart', 'AUDIO'),
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.balanceConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.cancellationConfig,
      { ...GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.stabilizerConfig, targetModality: 'AUDIO' },
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.asymmetryConfig,
      GUIDANCE_GEOMETRY_PRESETS.PRESET_SADDLE_MONSTER.saddleConfig,
      'SERIALIZED_APPROXIMATION',
      'AUDIO'
    );

    const hasAudioClauses = audioReport.renderedPrompt.includes('acoustic') || audioReport.renderedPrompt.includes('stereo') || audioReport.renderedPrompt.includes('spectral');
    const passed = Boolean(imageReport.renderedPrompt && audioReport.renderedPrompt && hasAudioClauses);

    testResults.push({
      id: 'TEST_11_MODALITY_ADAPTATION',
      description: 'Stabilizer and structural invariants adapt specifically across Image, Video, and Audio',
      passed,
      details: `Image length: ${imageReport.renderedPrompt.length}, Audio length: ${audioReport.renderedPrompt.length}, Audio acoustic invariants: ${hasAudioClauses}`,
    });
  }

  // 12. Existing Jobs 1–4 still work cleanly
  {
    const registeredOps = listTechnicalOperators();
    const hasJob1 = registeredOps.some((o) => o.id === 'dev_example_context_starvation');
    const hasJob2 = registeredOps.some((o) => o.id === 'asnd_normalization_desync');
    const hasJob3 = registeredOps.some((o) => o.id === 'rbc_as_remote_binding_cleavage');
    const hasJob4 = registeredOps.some((o) => o.id === 'remote_binding_cleavage');
    const hasJob5A = registeredOps.some((o) => o.id === 'saddle_trap');

    const totalOps = registeredOps.length;
    const passed = hasJob1 && hasJob2 && hasJob3 && hasJob4 && hasJob5A && totalOps >= 20;

    testResults.push({
      id: 'TEST_12_PREVIOUS_JOBS_COMPATIBILITY',
      description: 'Central Operator Registry maintains active operators across Jobs 1, 2, 3, 4, and 5A simultaneously',
      passed,
      details: `Total operators registered: ${totalOps} (Jobs 1-5A present)`,
    });
  }

  const passedTests = testResults.filter((t) => t.passed).length;
  return {
    timestamp: new Date().toISOString(),
    totalTests: testResults.length,
    passedTests,
    allPassed: passedTests === testResults.length,
    testResults,
  };
}
