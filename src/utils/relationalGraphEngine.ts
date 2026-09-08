/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4: Relational Graph & Structural Mutation Engine
 * 
 * CORE CONTRACT:
 * - Parses prompt into a directed RelationalGraph (Entities, Attributes, Materials, Parts, Observers).
 * - Applies non-destructive relational transformations according to operator configurations.
 * - Always preserves the original subject anchor in metadata.
 * - Generates natural language translations tuned for Image, Video, and Audio.
 * - Implements Structural Syntax Wrappers for mathematical, graph-edge, and typed-relation notations.
 * - Guaranteed termination: cycle detection prevents recursive generation loops.
 */

import {
  RelationalGraph,
  RelationalNode,
  RelationalEdge,
  RelationalNodeType,
  RelationType,
  StructuralPlan,
  RenderedStructuralResult,
  SyntaxSerializationStyle,
  RemoteBindingCleavageConfig,
  AttributeOrphaningConfig,
  RelationDirectionInversionConfig,
  CyclicDependencyConfig,
  MereologicalTrapConfig,
  ObserverReentryConfig,
  TemporalCausalLoopConfig,
  StructuralSyntaxWrapperConfig,
} from '../types/structuralRelational';
import { TechnicalModality } from '../types/technicalCore';

// ==========================================
// 1. GRAPH PARSING & INITIALIZATION
// ==========================================

export function parsePromptToRelationalGraph(canonicalPrompt: string): RelationalGraph {
  const trimmed = canonicalPrompt.trim();
  const nodes: RelationalNode[] = [];
  const edges: RelationalEdge[] = [];

  // Identify primary entity / subject anchor
  const clauses = trimmed.split(/[,;\n]+/).map((c) => c.trim()).filter(Boolean);
  const primaryClause = clauses[0] || 'synthetic entity';

  // Words breakdown for the primary clause
  const primaryWords = primaryClause.split(/\s+/);
  let entityLabel = primaryClause;
  let attributeLabels: string[] = [];

  if (primaryWords.length > 2) {
    // e.g. "obsidian carapace beetle with crystalline mandibles"
    entityLabel = primaryWords.slice(-2).join(' ');
    attributeLabels.push(primaryWords.slice(0, -2).join(' '));
  }

  const rootId = 'node_entity_root';
  nodes.push({
    id: rootId,
    label: entityLabel,
    type: 'ENTITY',
    isOriginalAnchor: true,
  });

  // Secondary clauses become attributes, materials, parts, or environments
  clauses.slice(1).forEach((clause, idx) => {
    const lower = clause.toLowerCase();
    let type: RelationalNodeType = 'ATTRIBUTE';
    let rel: RelationType = 'OWNS';

    if (lower.includes('surface') || lower.includes('skin') || lower.includes('made of') || lower.includes('porcelain') || lower.includes('metal')) {
      type = 'MATERIAL';
      rel = 'COMPOSED_OF';
    } else if (lower.includes('part') || lower.includes('limb') || lower.includes('feather') || lower.includes('mandible') || lower.includes('wing') || lower.includes('organ') || lower.includes('brick')) {
      type = 'PART_ELEMENT';
      rel = 'PART_OF';
    } else if (lower.includes('room') || lower.includes('horizon') || lower.includes('environment') || lower.includes('background') || lower.includes('field')) {
      type = 'SPATIAL_REGION';
      rel = 'BOUNDS';
    } else if (lower.includes('camera') || lower.includes('viewer') || lower.includes('viewpoint') || lower.includes('gaze')) {
      type = 'OBSERVER_VIEWPOINT';
      rel = 'OBSERVES';
    } else if (lower.includes('motion') || lower.includes('flight') || lower.includes('growth') || lower.includes('falling')) {
      type = 'ACTION';
      rel = 'CAUSES';
    }

    const nodeId = `node_${type.toLowerCase()}_${idx + 1}`;
    nodes.push({
      id: nodeId,
      label: clause,
      type,
    });

    if (rel === 'PART_OF') {
      edges.push({
        id: `edge_${rootId}_${nodeId}`,
        sourceId: nodeId,
        targetId: rootId,
        relation: 'PART_OF',
        weight: 1.0,
      });
    } else if (rel === 'OBSERVES') {
      edges.push({
        id: `edge_${nodeId}_${rootId}`,
        sourceId: nodeId,
        targetId: rootId,
        relation: 'OBSERVES',
        weight: 1.0,
      });
    } else {
      edges.push({
        id: `edge_${rootId}_${nodeId}`,
        sourceId: rootId,
        targetId: nodeId,
        relation: rel,
        weight: 1.0,
      });
    }
  });

  // If only root entity exists, scaffold baseline attribute & environment nodes
  if (nodes.length === 1) {
    const attrId = 'node_attribute_primary';
    nodes.push({
      id: attrId,
      label: 'topological continuity',
      type: 'ATTRIBUTE',
    });
    edges.push({
      id: `edge_${rootId}_${attrId}`,
      sourceId: rootId,
      targetId: attrId,
      relation: 'OWNS',
      weight: 1.0,
    });

    const envId = 'node_environment_primary';
    nodes.push({
      id: envId,
      label: 'surrounding negative space',
      type: 'SPATIAL_REGION',
    });
    edges.push({
      id: `edge_${envId}_${rootId}`,
      sourceId: envId,
      targetId: rootId,
      relation: 'BOUNDS',
      weight: 1.0,
    });
  }

  return {
    nodes,
    edges,
    rootEntityId: rootId,
    originalSubject: entityLabel,
    userConstraints: clauses,
  };
}

// Deep clone utility for immutable graph transformations
function cloneGraph(graph: RelationalGraph): RelationalGraph {
  return {
    nodes: graph.nodes.map((n) => ({ ...n, metadata: { ...n.metadata } })),
    edges: graph.edges.map((e) => ({ ...e, metadata: { ...e.metadata } })),
    rootEntityId: graph.rootEntityId,
    originalSubject: graph.originalSubject,
    coreAction: graph.coreAction,
    userConstraints: graph.userConstraints ? [...graph.userConstraints] : undefined,
  };
}

// ==========================================
// 2. OPERATOR 1: REMOTE BINDING CLEAVAGE (RBC)
// ==========================================

export function applyRemoteBindingCleavage(
  inputGraph: RelationalGraph,
  config: RemoteBindingCleavageConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const targetEdge = graph.edges.find((e) => e.relation === 'OWNS' || e.relation === 'COMPOSED_OF');

  if (!targetEdge) return graph;

  // Insert intervening displacement buffer nodes based on bindingDistance
  const separationSteps = Math.max(1, Math.round(config.bindingDistance * 3));
  let lastSourceId = targetEdge.sourceId;

  for (let i = 0; i < separationSteps; i++) {
    const bufferId = `node_interference_buffer_${i + 1}`;
    graph.nodes.push({
      id: bufferId,
      label: i === 0 ? 'intervening atmospheric stratum' : 'orthogonal coordinate offset',
      type: 'SPATIAL_REGION',
      metadata: { generatedBy: 'REMOTE_BINDING_CLEAVAGE' },
    });

    graph.edges.push({
      id: `edge_buffer_${i}`,
      sourceId: lastSourceId,
      targetId: bufferId,
      relation: 'EXISTS_IN',
      weight: config.interferenceDensity,
    });

    lastSourceId = bufferId;
  }

  // Rewire attribute to the distant end of the interference chain while keeping target active
  targetEdge.sourceId = lastSourceId;
  targetEdge.relation = 'BINDS_TO';
  targetEdge.metadata = {
    remoteSeparation: config.bindingDistance,
    orphanPressure: config.orphanPressure,
  };

  return graph;
}

// ==========================================
// 3. OPERATOR 2: ATTRIBUTE ORPHANING (AO)
// ==========================================

export function applyAttributeOrphaning(
  inputGraph: RelationalGraph,
  config: AttributeOrphaningConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const candidateEdges = graph.edges.filter((e) => e.relation === 'OWNS' || e.relation === 'COMPOSED_OF');

  candidateEdges.forEach((edge, idx) => {
    edge.isOrphaned = true;
    edge.weight = Math.max(0.1, 1.0 - config.ownershipWeakening);

    const attrNode = graph.nodes.find((n) => n.id === edge.targetId);
    if (!attrNode) return;

    if (config.hostMultiplicity === 'ambient_background') {
      // Attribute drifts to ambient background
      let envNode = graph.nodes.find((n) => n.type === 'SPATIAL_REGION');
      if (!envNode) {
        envNode = {
          id: 'node_ambient_void',
          label: 'ambient background atmosphere',
          type: 'SPATIAL_REGION',
        };
        graph.nodes.push(envNode);
      }
      edge.sourceId = envNode.id;
      edge.relation = 'EXISTS_IN';
    } else if (config.hostMultiplicity === 'single_alternative' || config.hostMultiplicity === 'multiple_diffuse') {
      // Spawn phantom host
      const phantomHostId = `node_phantom_host_${idx + 1}`;
      graph.nodes.push({
        id: phantomHostId,
        label: `secondary substrate structure #${idx + 1}`,
        type: 'PHANTOM_HOST',
      });
      edge.sourceId = phantomHostId;
    }
  });

  return graph;
}

// ==========================================
// 4. OPERATOR 3: RELATION DIRECTION INVERSION (RDI)
// ==========================================

export function applyRelationDirectionInversion(
  inputGraph: RelationalGraph,
  config: RelationDirectionInversionConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const invertibleEdges = graph.edges.filter(
    (e) => e.relation === 'CONTAINS' || e.relation === 'PART_OF' || e.relation === 'CAUSES' || e.relation === 'BOUNDS' || e.relation === 'OWNS' || e.relation === 'OBSERVES'
  );

  const countToInvert = Math.max(1, Math.round(invertibleEdges.length * config.inversionRate));

  for (let i = 0; i < countToInvert && i < invertibleEdges.length; i++) {
    const edge = invertibleEdges[i];
    const oldSource = edge.sourceId;
    edge.sourceId = edge.targetId;
    edge.targetId = oldSource;
    edge.isInverted = true;

    // Invert semantic relation type
    if (edge.relation === 'PART_OF') edge.relation = 'CONTAINS';
    else if (edge.relation === 'CONTAINS') edge.relation = 'PART_OF';
    else if (edge.relation === 'BOUNDS') edge.relation = 'PRODUCES';
    else if (edge.relation === 'OBSERVES') edge.relation = 'PRODUCES';
  }

  return graph;
}

// ==========================================
// 5. OPERATOR 4: CYCLIC DEPENDENCY (CD)
// ==========================================

export function applyCyclicDependency(
  inputGraph: RelationalGraph,
  config: CyclicDependencyConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const cycleLength = Math.min(6, Math.max(2, config.cycleLength));

  // Build a deterministic closed loop of concepts
  const domainConcepts: Record<string, string[]> = {
    geometry: ['surface boundary', 'internal topology', 'spatial coordinate'],
    biology: ['cellular membrane', 'organ matrix', 'vascular lattice'],
    physics: ['gravitational gradient', 'thermal field', 'inertia boundary'],
    material: ['mineral grain', 'crystalline substrate', 'viscous layer'],
    causality: ['initiating impulse', 'feedback response', 'equilibrium state'],
    time: ['prior moment', 'concurrent phase', 'receding interval'],
    observer: ['viewpoint focal point', 'retinal projection', 'gaze horizon'],
    sound: ['fundamental tone', 'resonant overtone', 'decay envelope'],
  };

  const cycleNodes: RelationalNode[] = [];
  const domains = config.domainMix.length > 0 ? config.domainMix : ['geometry', 'material', 'physics'];

  for (let i = 0; i < cycleLength; i++) {
    const domain = domains[i % domains.length];
    const pool = domainConcepts[domain] || domainConcepts.geometry;
    const label = pool[i % pool.length];
    const nodeId = `node_cycle_${i + 1}`;

    const node: RelationalNode = {
      id: nodeId,
      label: `${label} (Phase ${i + 1})`,
      type: i === 0 ? 'ENTITY' : 'ATTRIBUTE',
      metadata: { cycleIndex: i },
    };

    cycleNodes.push(node);
    graph.nodes.push(node);
  }

  // Connect in closed ring: 0 -> 1 -> 2 -> ... -> 0
  for (let i = 0; i < cycleLength; i++) {
    const src = cycleNodes[i];
    const dst = cycleNodes[(i + 1) % cycleLength];

    graph.edges.push({
      id: `edge_cycle_${src.id}_${dst.id}`,
      sourceId: src.id,
      targetId: dst.id,
      relation: 'DEPENDS_ON',
      weight: config.recursionStrength,
      isCyclic: true,
    });
  }

  // Bind the cycle root to the original subject
  graph.edges.push({
    id: `edge_bind_cycle_to_root`,
    sourceId: graph.rootEntityId,
    targetId: cycleNodes[0].id,
    relation: 'DEPENDS_ON',
    isCyclic: true,
  });

  return graph;
}

// ==========================================
// 6. OPERATOR 5: MEREOLOGICAL TRAP (MT)
// ==========================================

export function applyMereologicalTrap(
  inputGraph: RelationalGraph,
  config: MereologicalTrapConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const rootNode = graph.nodes.find((n) => n.id === graph.rootEntityId);
  if (!rootNode) return graph;

  let partNode = graph.nodes.find((n) => n.type === 'PART_ELEMENT');
  if (!partNode) {
    partNode = {
      id: 'node_constituent_part',
      label: 'microscopic surface facet',
      type: 'PART_ELEMENT',
    };
    graph.nodes.push(partNode);
  }

  switch (config.paradoxType) {
    case 'PART_REPRODUCES_WHOLE': {
      // Part independently executes whole system's macro behavior
      graph.edges.push({
        id: `edge_mereo_reproduce`,
        sourceId: partNode.id,
        targetId: rootNode.id,
        relation: 'PRODUCES',
        metadata: { paradox: 'PART_REPRODUCES_WHOLE', scaleRecursion: config.scaleRecursion },
      });
      break;
    }

    case 'WHOLE_CONTAINED_IN_PART': {
      // Whole is structurally enclosed inside its constituent part
      graph.edges.push({
        id: `edge_mereo_containment_inversion`,
        sourceId: partNode.id,
        targetId: rootNode.id,
        relation: 'CONTAINS',
        isInverted: true,
        metadata: { paradox: 'WHOLE_CONTAINED_IN_PART' },
      });
      break;
    }

    case 'PART_EXISTS_EXTERIOR': {
      // Part exists spatially dislocated outside while structurally required
      const exteriorVoid: RelationalNode = {
        id: 'node_exterior_dislocation',
        label: 'exterior boundary vacuum',
        type: 'SPATIAL_REGION',
      };
      graph.nodes.push(exteriorVoid);
      graph.edges.push({
        id: `edge_mereo_exterior`,
        sourceId: partNode.id,
        targetId: exteriorVoid.id,
        relation: 'EXISTS_IN',
        metadata: { paradox: 'PART_EXISTS_EXTERIOR', boundaryLeakage: config.boundaryLeakage },
      });
      break;
    }

    case 'BOUNDARY_BELONGS_TO_BACKGROUND': {
      let envNode = graph.nodes.find((n) => n.type === 'SPATIAL_REGION');
      if (!envNode) {
        envNode = {
          id: 'node_background_env',
          label: 'ambient surrounding terrain',
          type: 'SPATIAL_REGION',
        };
        graph.nodes.push(envNode);
      }
      graph.edges.push({
        id: `edge_mereo_boundary_theft`,
        sourceId: envNode.id,
        targetId: rootNode.id,
        relation: 'BOUNDS',
        metadata: { paradox: 'BOUNDARY_BELONGS_TO_BACKGROUND' },
      });
      break;
    }

    default:
      break;
  }

  return graph;
}

// ==========================================
// 7. OPERATOR 6: OBSERVER RE-ENTRY (OR)
// ==========================================

export function applyObserverReentry(
  inputGraph: RelationalGraph,
  config: ObserverReentryConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  let observerNode = graph.nodes.find((n) => n.type === 'OBSERVER_VIEWPOINT');

  if (!observerNode) {
    observerNode = {
      id: 'node_observer_viewpoint',
      label: 'recording camera aperture',
      type: 'OBSERVER_VIEWPOINT',
    };
    graph.nodes.push(observerNode);
  }

  const rootNode = graph.nodes.find((n) => n.id === graph.rootEntityId);
  if (!rootNode) return graph;

  // Re-entry edge: Subject actively consumes or defines the observer
  graph.edges.push({
    id: `edge_observer_reentry_feedback`,
    sourceId: rootNode.id,
    targetId: observerNode.id,
    relation: 'CONTAINS',
    weight: config.observerCoupling,
    metadata: {
      viewpointFeedback: config.viewpointFeedback,
      reentryDepth: config.reentryDepth,
      videoMotionCoupling: config.videoMotionCoupling,
    },
  });

  return graph;
}

// ==========================================
// 8. OPERATOR 7: TEMPORAL CAUSAL LOOP (TCL)
// ==========================================

export function applyTemporalCausalLoop(
  inputGraph: RelationalGraph,
  config: TemporalCausalLoopConfig
): RelationalGraph {
  const graph = cloneGraph(inputGraph);
  const rootNode = graph.nodes.find((n) => n.id === graph.rootEntityId);
  if (!rootNode) return graph;

  const futureStateNode: RelationalNode = {
    id: 'node_temporal_future_state',
    label: config.imageTranslationMode === 'future_scars'
      ? 'anticipated future scar tissue'
      : config.imageTranslationMode === 'anticipated_anatomy'
      ? 'unformed subsequent anatomical evolution'
      : 'retroactive structural reinforcement debt',
    type: 'TEMPORAL_STATE',
  };
  graph.nodes.push(futureStateNode);

  // Future determines earlier mechanism: Future -> Root (PRECEDES / CAUSES inverted)
  graph.edges.push({
    id: `edge_temporal_causal_inversion`,
    sourceId: futureStateNode.id,
    targetId: rootNode.id,
    relation: 'CAUSES',
    isInverted: true,
    weight: config.futureLeak,
    metadata: {
      timeDirection: config.timeDirection,
      delay: config.delay,
      topologyDebt: config.topologyDebt,
      mode: config.imageTranslationMode,
    },
  });

  return graph;
}

// ==========================================
// 9. SERIALIZATION: NATURAL LANGUAGE ENGINE
// ==========================================

export function serializeRelationalGraphToNaturalText(
  graph: RelationalGraph,
  modality: TechnicalModality = 'IMAGE'
): string {
  const clauses: string[] = [];
  const rootNode = graph.nodes.find((n) => n.id === graph.rootEntityId);
  const subjectName = rootNode?.label || graph.originalSubject;

  // 1. Primary subject anchoring statement
  clauses.push(`Primary subject: ${subjectName}`);

  // 2. Transcribe relational edges
  graph.edges.forEach((edge) => {
    const src = graph.nodes.find((n) => n.id === edge.sourceId);
    const dst = graph.nodes.find((n) => n.id === edge.targetId);
    if (!src || !dst) return;

    if (edge.isOrphaned) {
      clauses.push(`the property of "${dst.label}" persists without a single definitive owner, detaching from ${subjectName} to settle onto ${src.label}`);
    } else if (edge.isInverted) {
      if (edge.relation === 'CONTAINS') {
        clauses.push(`paradoxically, the component "${src.label}" completely encloses and determines the macroscopic geometry of "${dst.label}"`);
      } else if (edge.relation === 'CAUSES') {
        if (modality === 'VIDEO') {
          clauses.push(`subsequent motion in later frames retroactively establishes the mechanical origin of earlier movement in ${dst.label}`);
        } else {
          clauses.push(`its future structural collapse is already physically embedded as pre-existing scar geometry across "${dst.label}"`);
        }
      } else {
        clauses.push(`directional dependency reversed: ${src.label} fundamentally governs ${dst.label}`);
      }
    } else if (edge.isCyclic) {
      clauses.push(`closed recursive loop: ${src.label} depends on ${dst.label}, which in turn establishes the boundary of ${src.label}`);
    } else if (edge.metadata?.viewpointFeedback) {
      if (modality === 'VIDEO') {
        clauses.push(`the camera's focal coordinates are physically fused into ${dst.label}'s kinetic surface; camera displacement directly distorts anatomy`);
      } else {
        clauses.push(`the observer's viewpoint is not external, but manifested as an interior material property across the surface of ${src.label}`);
      }
    } else if (edge.metadata?.remoteSeparation) {
      clauses.push(`while ${subjectName} exists, its defining attribute "${dst.label}" is displaced across intervening strata (${src.label})`);
    } else {
      // Standard binding
      if (edge.relation === 'COMPOSED_OF') {
        clauses.push(`constructed from ${dst.label}`);
      } else if (edge.relation === 'PART_OF') {
        clauses.push(`containing constituent ${src.label}`);
      }
    }
  });

  // Modality-specific closing constraint
  if (modality === 'AUDIO') {
    clauses.push(`sonic timbre and rhythmic motif must maintain a self-referential hierarchical cycle between voice and instrumental host`);
  } else if (modality === 'VIDEO') {
    clauses.push(`temporal continuity must preserve relational loop closure across frames without resolving into static symmetry`);
  } else {
    clauses.push(`spatial integrity must exhibit visible tension between conflicting relational owners`);
  }

  return clauses.join('; ');
}

// ==========================================
// 10. SERIALIZATION: STRUCTURAL SYNTAX WRAPPER
// ==========================================

export function serializeRelationalGraphToFormalSyntax(
  graph: RelationalGraph,
  config: StructuralSyntaxWrapperConfig
): string {
  const lines: string[] = [];
  const rootNode = graph.nodes.find((n) => n.id === graph.rootEntityId);
  const subjectName = rootNode?.label || graph.originalSubject;

  switch (config.style) {
    case 'NESTED_BRACKETS': {
      lines.push(`[SYSTEM_ROOT: "${subjectName}"]`);
      graph.edges.forEach((e) => {
        const src = graph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
        const dst = graph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
        const status = e.isOrphaned ? 'ORPHANED' : e.isInverted ? 'INVERTED' : e.isCyclic ? 'CYCLIC' : 'BOUND';
        lines.push(`  [RELATION: ${e.relation} (${status})] { [SRC: "${src}"] -> [DST: "${dst}"] }`);
      });
      break;
    }

    case 'MATHEMATICAL_MAPPING': {
      lines.push(`// RELATIONAL FORMALIZATION MAPPING`);
      lines.push(`let S := "${subjectName}"`);
      graph.edges.forEach((e, idx) => {
        const src = graph.nodes.find((n) => n.id === e.sourceId)?.label || `N_${idx}`;
        const dst = graph.nodes.find((n) => n.id === e.targetId)?.label || `M_${idx}`;
        if (e.isCyclic) {
          lines.push(`f("${src}") := g("${dst}") ∧ g("${dst}") := f("${src}") [FIXED_POINT_CYCLE]`);
        } else if (e.isInverted) {
          lines.push(`"${src}" ⊃ "${dst}" (inversion: whole enclosed in constituent part)`);
        } else if (e.isOrphaned) {
          lines.push(`"${dst}" ∉ owns("${src}") [HOST_UNDEFINED]`);
        } else {
          lines.push(`"${src}" ↦ ${e.relation}("${dst}")`);
        }
      });
      break;
    }

    case 'GRAPH_EDGE_NOTATION': {
      lines.push(`GRAPH {`);
      lines.push(`  "${subjectName}" [root=true]`);
      graph.edges.forEach((e) => {
        const src = graph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
        const dst = graph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
        const arrow = e.isInverted ? '<==' : '-->';
        lines.push(`  "${src}" ${arrow} |${e.relation}| "${dst}"`);
      });
      lines.push(`}`);
      break;
    }

    case 'SET_MEMBERSHIP': {
      lines.push(`Ω := { ${graph.nodes.map((n) => `"${n.label}"`).join(', ')} }`);
      graph.edges.forEach((e) => {
        const src = graph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
        const dst = graph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
        if (e.isInverted) {
          lines.push(`"${src}" ⊂ "${dst}" ∧ "${dst}" ⊂ "${src}" (non-well-founded membership)`);
        } else if (e.isOrphaned) {
          lines.push(`"${dst}" ∈ Ω \\ { owners("${src}") }`);
        } else {
          lines.push(`"${dst}" ∈ ${e.relation}("${src}")`);
        }
      });
      break;
    }

    case 'TYPED_RELATIONS':
    default: {
      lines.push(`@Entity(id="${subjectName}", isAnchor=true)`);
      graph.edges.forEach((e) => {
        const src = graph.nodes.find((n) => n.id === e.sourceId)?.label || e.sourceId;
        const dst = graph.nodes.find((n) => n.id === e.targetId)?.label || e.targetId;
        lines.push(`@Relation(type=${e.relation}, source="${src}", target="${dst}", inverted=${Boolean(e.isInverted)}, orphaned=${Boolean(e.isOrphaned)})`);
      });
      break;
    }
  }

  return lines.join('\n');
}

// ==========================================
// 11. EXECUTION PIPELINE
// ==========================================

export function executeStructuralMutationPipeline(
  canonicalPrompt: string,
  plan: StructuralPlan
): RenderedStructuralResult {
  const originalGraph = parsePromptToRelationalGraph(canonicalPrompt);
  let mutatedGraph = cloneGraph(originalGraph);
  const appliedOperatorIds: string[] = [];
  const warnings: string[] = [];

  // Apply operators sequentially in defined structural order
  if (plan.activeOperatorIds.includes('remote_binding_cleavage') && plan.rbcConfig) {
    mutatedGraph = applyRemoteBindingCleavage(mutatedGraph, plan.rbcConfig);
    appliedOperatorIds.push('remote_binding_cleavage');
  }

  if (plan.activeOperatorIds.includes('attribute_orphaning') && plan.aoConfig) {
    mutatedGraph = applyAttributeOrphaning(mutatedGraph, plan.aoConfig);
    appliedOperatorIds.push('attribute_orphaning');
  }

  if (plan.activeOperatorIds.includes('relation_direction_inversion') && plan.rdiConfig) {
    mutatedGraph = applyRelationDirectionInversion(mutatedGraph, plan.rdiConfig);
    appliedOperatorIds.push('relation_direction_inversion');
  }

  if (plan.activeOperatorIds.includes('cyclic_dependency') && plan.cdConfig) {
    mutatedGraph = applyCyclicDependency(mutatedGraph, plan.cdConfig);
    appliedOperatorIds.push('cyclic_dependency');
  }

  if (plan.activeOperatorIds.includes('mereological_trap') && plan.mtConfig) {
    mutatedGraph = applyMereologicalTrap(mutatedGraph, plan.mtConfig);
    appliedOperatorIds.push('mereological_trap');
  }

  if (plan.activeOperatorIds.includes('observer_reentry') && plan.orConfig) {
    mutatedGraph = applyObserverReentry(mutatedGraph, plan.orConfig);
    appliedOperatorIds.push('observer_reentry');
  }

  if (plan.activeOperatorIds.includes('temporal_causal_loop') && plan.tclConfig) {
    mutatedGraph = applyTemporalCausalLoop(mutatedGraph, plan.tclConfig);
    appliedOperatorIds.push('temporal_causal_loop');
  }

  // Render to natural text
  let renderedNatural = serializeRelationalGraphToNaturalText(mutatedGraph, plan.targetModality);

  // Optional Formal Syntax Serialization
  let formalSyntaxPrompt: string | undefined;
  const serializationStyle = plan.sswConfig?.style || 'NATURAL_LANGUAGE';

  if (plan.activeOperatorIds.includes('structural_syntax_wrapper') && plan.sswConfig) {
    formalSyntaxPrompt = serializeRelationalGraphToFormalSyntax(mutatedGraph, plan.sswConfig);
    appliedOperatorIds.push('structural_syntax_wrapper');

    if (plan.sswConfig.syntaxDensity > 0.5) {
      // Interleave formal syntax with natural language for model comprehension
      renderedNatural = `${renderedNatural}\n\n[STRUCTURAL_RELATION_SPEC]\n${formalSyntaxPrompt}`;
    }
  }

  // Metrics
  const invertedEdges = mutatedGraph.edges.filter((e) => e.isInverted).length;
  const orphanedAttributes = mutatedGraph.edges.filter((e) => e.isOrphaned).length;
  const cyclicLoopsDetected = mutatedGraph.edges.filter((e) => e.isCyclic).length;
  const reentryCouplings = mutatedGraph.edges.filter((e) => e.metadata?.viewpointFeedback).length;

  return {
    originalGraph,
    mutatedGraph,
    renderedPrompt: renderedNatural,
    formalSyntaxPrompt,
    appliedOperatorIds,
    serializationStyle,
    metrics: {
      nodeCount: mutatedGraph.nodes.length,
      edgeCount: mutatedGraph.edges.length,
      invertedEdges,
      orphanedAttributes,
      cyclicLoopsDetected,
      reentryCouplings,
    },
    warnings,
    targetModality: plan.targetModality,
  };
}
