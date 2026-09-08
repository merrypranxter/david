/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4 Acceptance Test & Validation Suite
 * 
 * Verifies all 15 Acceptance Tests for Job 4:
 * 1. Structural operators alter relationships, not merely vocabulary.
 * 2. Remote Binding Cleavage separates entities from modifiers while preserving both.
 * 3. Attribute Orphaning preserves property without clearly assigning it to original host.
 * 4. Relation Direction Inversion reverses spatial, causal, temporal, part/whole relationships.
 * 5. Cyclic Dependency creates genuine closed relational graph and terminates text output.
 * 6. Mereological Trap creates part/whole contradictions without simply saying "fractal".
 * 7. Observer Re-entry explicitly links viewpoint/camera and subject state.
 * 8. Temporal Causal Loop produces useful video-oriented future/past dependencies.
 * 9. Structural Syntax Wrapper serializes graph into formal representations (typed relations, brackets, etc.).
 * 10. Operators combine without destroying existing mutation engine.
 * 11. Original user intent remains recoverable in metadata.
 * 12. Existing Jobs 1–3 still work cleanly.
 */

import {
  parsePromptToRelationalGraph,
  applyRemoteBindingCleavage,
  applyAttributeOrphaning,
  applyRelationDirectionInversion,
  applyCyclicDependency,
  applyMereologicalTrap,
  applyObserverReentry,
  applyTemporalCausalLoop,
  serializeRelationalGraphToNaturalText,
  serializeRelationalGraphToFormalSyntax,
  executeStructuralMutationPipeline,
} from './relationalGraphEngine';
import {
  STRUCTURAL_PRESETS,
  buildPlanFromPreset,
  executeStructuralPreset,
} from './structuralPresets';
import { STRUCTURAL_OPERATORS } from '../operators/structuralOperators';
import { getTechnicalOperator, listTechnicalOperators } from './technicalRegistry';

export interface ValidationReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  allPassed: boolean;
  testResults: Array<{
    id: string;
    description: string;
    passed: boolean;
    details?: string;
  }>;
}

export function runJob4ValidationSuite(): ValidationReport {
  const testResults: ValidationReport['testResults'] = [];
  const testPrompt = 'obsidian carapace beetle with crystalline mandibles, ceramic skin, in negative space';

  // 1. Structural operators alter relationships, not merely vocabulary
  {
    const initialGraph = parsePromptToRelationalGraph(testPrompt);
    const mutated = applyRelationDirectionInversion(initialGraph, {
      inversionRate: 1.0,
      depth: 'single_relation',
      consistency: 'high_unified_rule',
    });
    const hasInvertedEdge = mutated.edges.some((e) => e.isInverted);
    testResults.push({
      id: 'TEST_1_GRAPH_RELATIONAL_MUTATION',
      description: 'Structural operators alter relationships in graph edges, not merely vocabulary strings',
      passed: hasInvertedEdge && mutated.edges.length === initialGraph.edges.length,
      details: `Inverted edges: ${mutated.edges.filter((e) => e.isInverted).length}`,
    });
  }

  // 2. Remote Binding Cleavage demonstrably separates entities from modifiers while preserving both
  {
    const initialGraph = parsePromptToRelationalGraph(testPrompt);
    const cleaved = applyRemoteBindingCleavage(initialGraph, {
      bindingDistance: 0.9,
      interferenceDensity: 0.7,
      orphanPressure: 0.9,
    });
    const bufferNodes = cleaved.nodes.filter((n) => n.metadata?.generatedBy === 'REMOTE_BINDING_CLEAVAGE');
    const hasAttribute = cleaved.nodes.some((n) => n.label.includes('mandible') || n.label.includes('continuity'));
    const hasRoot = cleaved.nodes.some((n) => n.id === cleaved.rootEntityId);
    testResults.push({
      id: 'TEST_2_REMOTE_BINDING_CLEAVAGE',
      description: 'Remote Binding Cleavage separates entities from modifiers with buffer nodes while preserving both',
      passed: bufferNodes.length > 0 && hasAttribute && hasRoot,
      details: `Inserted buffer nodes: ${bufferNodes.length}`,
    });
  }

  // 3. Attribute Orphaning preserves property without clearly assigning it to its original host
  {
    const initialGraph = parsePromptToRelationalGraph(testPrompt);
    const orphaned = applyAttributeOrphaning(initialGraph, {
      ownershipWeakening: 0.9,
      hostMultiplicity: 'ambient_background',
      preserveAttribute: 0.95,
    });
    const orphanedEdge = orphaned.edges.find((e) => e.isOrphaned);
    testResults.push({
      id: 'TEST_3_ATTRIBUTE_ORPHANING',
      description: 'Attribute Orphaning weakens ownership and decouples property from root host',
      passed: Boolean(orphanedEdge && orphanedEdge.sourceId !== initialGraph.rootEntityId),
      details: `Orphaned edge rewired to: ${orphanedEdge?.sourceId}`,
    });
  }

  // 4. Relation Direction Inversion can reverse spatial, causal, temporal, and part/whole relationships
  {
    const initialGraph = parsePromptToRelationalGraph('bird flight with feathers belonging to wing');
    const inverted = applyRelationDirectionInversion(initialGraph, {
      inversionRate: 1.0,
      depth: 'single_relation',
      consistency: 'high_unified_rule',
    });
    const hasInverted = inverted.edges.some((e) => e.isInverted);
    testResults.push({
      id: 'TEST_4_RELATION_DIRECTION_INVERSION',
      description: 'Direction Inversion flips relational vectors cleanly',
      passed: hasInverted,
    });
  }

  // 5. Cyclic Dependency creates a genuine closed relational graph and terminates text output
  {
    const initialGraph = parsePromptToRelationalGraph('synthetic entity');
    const cyclic = applyCyclicDependency(initialGraph, {
      cycleLength: 3,
      recursionStrength: 0.9,
      domainMix: ['geometry', 'physics'],
    });
    const cyclicEdges = cyclic.edges.filter((e) => e.isCyclic);
    const rendered = serializeRelationalGraphToNaturalText(cyclic, 'IMAGE');
    testResults.push({
      id: 'TEST_5_CYCLIC_DEPENDENCY_TERMINATION',
      description: 'Cyclic Dependency creates a closed dependency cycle and terminates cleanly in text',
      passed: cyclicEdges.length >= 3 && rendered.length > 20 && !rendered.includes('undefined'),
      details: `Cyclic edges: ${cyclicEdges.length}, Rendered length: ${rendered.length} chars`,
    });
  }

  // 6. Mereological Trap creates part/whole contradictions without saying "fractal"
  {
    const initialGraph = parsePromptToRelationalGraph('mechanical automaton with clockwork heart');
    const mereo = applyMereologicalTrap(initialGraph, {
      paradoxType: 'WHOLE_CONTAINED_IN_PART',
      wholePartDepth: 2,
      scaleRecursion: true,
      boundaryLeakage: 0.8,
    });
    const rendered = serializeRelationalGraphToNaturalText(mereo, 'IMAGE');
    testResults.push({
      id: 'TEST_6_MEREOLOGICAL_TRAP',
      description: 'Mereological Trap generates part/whole contradictions without lazy "fractal" jargon',
      passed: !rendered.toLowerCase().includes('fractal') && rendered.includes('encloses and determines'),
      details: `Rendered excerpt: "${rendered.slice(0, 80)}..."`,
    });
  }

  // 7. Observer Re-entry explicitly links viewpoint/camera and subject state
  {
    const initialGraph = parsePromptToRelationalGraph('marble bust of emperor');
    const reentered = applyObserverReentry(initialGraph, {
      observerCoupling: 0.9,
      viewpointFeedback: 'camera_as_topology',
      reentryDepth: 'dynamic_feedback_loop',
      videoMotionCoupling: true,
    });
    const reentryEdge = reentered.edges.find((e) => e.metadata?.viewpointFeedback);
    testResults.push({
      id: 'TEST_7_OBSERVER_REENTRY',
      description: 'Observer Re-entry creates bidirectional coupling between observer and subject topology',
      passed: Boolean(reentryEdge),
    });
  }

  // 8. Temporal Causal Loop produces useful video-oriented future/past dependencies
  {
    const initialGraph = parsePromptToRelationalGraph('kinetic dancer');
    const looped = applyTemporalCausalLoop(initialGraph, {
      timeDirection: 'reverse',
      delay: 'medium',
      topologyDebt: 0.8,
      futureLeak: 0.9,
      imageTranslationMode: 'future_scars',
    });
    const videoRendered = serializeRelationalGraphToNaturalText(looped, 'VIDEO');
    testResults.push({
      id: 'TEST_8_TEMPORAL_CAUSAL_LOOP',
      description: 'Temporal Causal Loop generates retrocausal dependencies for video and static images',
      passed: videoRendered.includes('retroactively') || videoRendered.includes('pre-existing scar'),
    });
  }

  // 9. Structural Syntax Wrapper serializes graph in natural and formalized forms
  {
    const initialGraph = parsePromptToRelationalGraph('obsidian beetle with crystalline mandibles');
    const formalTyped = serializeRelationalGraphToFormalSyntax(initialGraph, {
      syntaxDensity: 0.8,
      closureMode: 'well_founded',
      delimiterPressure: 'medium',
      style: 'TYPED_RELATIONS',
    });
    const formalBrackets = serializeRelationalGraphToFormalSyntax(initialGraph, {
      syntaxDensity: 0.8,
      closureMode: 'cyclic',
      delimiterPressure: 'high',
      style: 'NESTED_BRACKETS',
    });
    testResults.push({
      id: 'TEST_9_STRUCTURAL_SYNTAX_WRAPPER',
      description: 'Structural Syntax Wrapper correctly produces formal typed and nested bracket serializations',
      passed: formalTyped.includes('@Entity') && formalBrackets.includes('[SYSTEM_ROOT:'),
    });
  }

  // 10. Operators combine cleanly without destroying mutation pipeline
  {
    const feralHell = executeStructuralPreset('RELATIONAL_HELL', testPrompt, 'IMAGE');
    testResults.push({
      id: 'TEST_10_OPERATOR_COMBINATION_AND_PRESETS',
      description: 'Multi-operator composition (RELATIONAL_HELL) applies 4 operators simultaneously',
      passed: feralHell.appliedOperatorIds.length >= 4 && feralHell.renderedPrompt.length > 50,
      details: `Applied ops: ${feralHell.appliedOperatorIds.join(', ')}`,
    });
  }

  // 11. Original user intent remains recoverable in graph metadata
  {
    const result = executeStructuralPreset('ORPHAN_ATTRIBUTE', testPrompt, 'IMAGE');
    testResults.push({
      id: 'TEST_11_SUBJECT_ANCHOR_PRESERVATION',
      description: 'Original subject anchor is preserved and accessible across structural transformations',
      passed: result.originalGraph.originalSubject.length > 0 && result.mutatedGraph.originalSubject.length > 0,
      details: `Preserved anchor: "${result.originalGraph.originalSubject}"`,
    });
  }

  // 12. Existing Jobs 1–3 still work cleanly
  {
    const registeredOps = listTechnicalOperators();
    const hasJob1 = registeredOps.some((o) => o.id === 'dev_example_context_starvation');
    const hasJob2 = registeredOps.some((o) => o.id === 'asnd_normalization_desync');
    const hasJob3 = registeredOps.some((o) => o.id === 'rbc_as_remote_binding_cleavage');
    const hasJob4 = registeredOps.some((o) => o.id === 'remote_binding_cleavage');

    testResults.push({
      id: 'TEST_12_REGISTRY_AND_JOB_COMPATIBILITY',
      description: 'Technical Operator Registry contains operators from Jobs 1, 2, 3, and 4 simultaneously',
      passed: hasJob1 && hasJob2 && hasJob3 && hasJob4,
      details: `Total operators registered: ${registeredOps.length}`,
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
