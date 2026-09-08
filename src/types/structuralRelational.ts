/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 4: Structural Syntax & Relational Traps Type Definitions
 * 
 * CORE CONTRACT:
 * - Operates on an internal Relational Graph (Entities, Attributes, Materials, Spatial/Temporal/Causal relations).
 * - Manipulates HOW concepts are structurally connected rather than merely what words are used.
 * - Supports:
 *   1. REMOTE_BINDING_CLEAVAGE (Relative distance & interference)
 *   2. ATTRIBUTE_ORPHANING (Ownership weakening & host multiplicity)
 *   3. RELATION_DIRECTION_INVERSION (Reversing directional edges)
 *   4. CYCLIC_DEPENDENCY (Closed non-well-founded relational loops with termination safety)
 *   5. MEREOLOGICAL_TRAP (Part / whole paradoxes)
 *   6. OBSERVER_REENTRY (Breaking observer-system exteriority)
 *   7. TEMPORAL_CAUSAL_LOOP (Future-to-past causality & topology debt)
 *   8. STRUCTURAL_SYNTAX_WRAPPER (Formalized graph-edge & equation serializations)
 */

import { TechnicalModality, ExecutionTier } from './technicalCore';

// ==========================================
// 1. RELATIONAL GRAPH NODES & EDGES
// ==========================================

export type RelationalNodeType =
  | 'ENTITY'
  | 'ATTRIBUTE'
  | 'ACTION'
  | 'MATERIAL'
  | 'SPATIAL_REGION'
  | 'TEMPORAL_STATE'
  | 'OBSERVER_VIEWPOINT'
  | 'PART_ELEMENT'
  | 'WHOLE_SYSTEM'
  | 'PHANTOM_HOST';

export interface RelationalNode {
  id: string;
  label: string;
  type: RelationalNodeType;
  isOriginalAnchor?: boolean;
  metadata?: Record<string, any>;
}

export type RelationType =
  | 'OWNS'                // Entity -> Attribute
  | 'BINDS_TO'            // Attribute -> Entity
  | 'CONTAINS'            // Whole -> Part / Container -> Content
  | 'PART_OF'             // Part -> Whole
  | 'CAUSES'              // Cause -> Effect
  | 'PRECEDES'            // Earlier -> Later
  | 'OBSERVES'            // Observer -> Subject
  | 'BOUNDS'              // Environment -> Subject or vice versa
  | 'PRODUCES'            // A -> B
  | 'DEPENDS_ON'          // A -> B
  | 'COMPOSED_OF'         // Subject -> Material
  | 'EXISTS_IN';          // Entity -> Spatial Region

export interface RelationalEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: RelationType;
  weight?: number; // 0.0 to 1.0 (strength of the relation)
  isInverted?: boolean;
  isOrphaned?: boolean;
  isCyclic?: boolean;
  metadata?: Record<string, any>;
}

export interface RelationalGraph {
  nodes: RelationalNode[];
  edges: RelationalEdge[];
  rootEntityId: string;
  originalSubject: string;
  coreAction?: string;
  userConstraints?: string[];
}

// ==========================================
// 2. OPERATOR CONFIGURATIONS
// ==========================================

export interface RemoteBindingCleavageConfig {
  bindingDistance: number; // 0.0 (adjacent) to 1.0 (maximum conceptual separation)
  interferenceDensity: number; // 0.0 to 1.0
  orphanPressure: number; // 0.0 to 1.0 (how strongly displaced modifier is preserved)
}

export interface AttributeOrphaningConfig {
  ownershipWeakening: number; // 0.0 to 1.0
  hostMultiplicity: 'none' | 'single_alternative' | 'multiple_diffuse' | 'ambient_background';
  preserveAttribute: number; // 0.5 to 1.0 (ensures modifier is never deleted)
}

export interface RelationDirectionInversionConfig {
  inversionRate: number; // 0.0 to 1.0 (proportion of relations reversed)
  depth: 'single_relation' | 'recursive_propagation';
  consistency: 'low_independent' | 'high_unified_rule';
}

export interface CyclicDependencyConfig {
  cycleLength: number; // 2 to 6 nodes
  recursionStrength: number; // 0.0 to 1.0
  domainMix: Array<'geometry' | 'biology' | 'physics' | 'material' | 'causality' | 'time' | 'observer' | 'sound'>;
  maxRenderedIterations?: number; // Termination guard (default: 1 closed cycle)
}

export interface MereologicalTrapConfig {
  paradoxType:
    | 'PART_REPRODUCES_WHOLE'
    | 'WHOLE_CONTAINED_IN_PART'
    | 'PART_EXISTS_EXTERIOR'
    | 'REMOVAL_INCREASES_WHOLE'
    | 'COMPONENT_INHERITS_GLOBAL'
    | 'BOUNDARY_BELONGS_TO_BACKGROUND';
  wholePartDepth: number; // 1 to 4
  scaleRecursion: boolean;
  boundaryLeakage: number; // 0.0 to 1.0
}

export interface ObserverReentryConfig {
  observerCoupling: number; // 0.0 to 1.0
  viewpointFeedback: 'texture_from_gaze' | 'camera_as_topology' | 'viewpoint_as_material' | 'coordinate_contained' | 'boundary_collapse';
  reentryDepth: 'static_observation' | 'dynamic_feedback_loop';
  videoMotionCoupling?: boolean; // camera moves anatomy <-> anatomy moves camera
}

export interface TemporalCausalLoopConfig {
  timeDirection: 'forward' | 'reverse' | 'bidirectional' | 'cyclic';
  delay: 'small' | 'medium' | 'long';
  topologyDebt: number; // 0.0 to 1.0
  futureLeak: number; // 0.0 to 1.0
  imageTranslationMode: 'future_scars' | 'anticipated_anatomy' | 'retroactive_reinforcement';
}

export type SyntaxSerializationStyle =
  | 'NATURAL_LANGUAGE'
  | 'NESTED_BRACKETS'
  | 'DEPENDENCY_TREE'
  | 'MATHEMATICAL_MAPPING'
  | 'TYPED_RELATIONS'
  | 'GRAPH_EDGE_NOTATION'
  | 'SET_MEMBERSHIP';

export interface StructuralSyntaxWrapperConfig {
  syntaxDensity: number; // 0.0 (pure natural text) to 1.0 (heavy formal syntax)
  closureMode: 'well_founded' | 'partially_unresolved' | 'cyclic';
  delimiterPressure: 'low' | 'medium' | 'high';
  style: SyntaxSerializationStyle;
}

// ==========================================
// 3. COMBINATION & INTENSITY ENGINE
// ==========================================

export type StructuralIntensityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'FERAL';

export interface StructuralPlan {
  planId: string;
  intensity: StructuralIntensityLevel;
  targetModality: TechnicalModality;
  activeOperatorIds: string[];

  // Individual configs
  rbcConfig?: RemoteBindingCleavageConfig;
  aoConfig?: AttributeOrphaningConfig;
  rdiConfig?: RelationDirectionInversionConfig;
  cdConfig?: CyclicDependencyConfig;
  mtConfig?: MereologicalTrapConfig;
  orConfig?: ObserverReentryConfig;
  tclConfig?: TemporalCausalLoopConfig;
  sswConfig?: StructuralSyntaxWrapperConfig;

  seed: number;
}

export interface RenderedStructuralResult {
  originalGraph: RelationalGraph;
  mutatedGraph: RelationalGraph;
  renderedPrompt: string;
  formalSyntaxPrompt?: string;
  appliedOperatorIds: string[];
  serializationStyle: SyntaxSerializationStyle;
  metrics: {
    nodeCount: number;
    edgeCount: number;
    invertedEdges: number;
    orphanedAttributes: number;
    cyclicLoopsDetected: number;
    reentryCouplings: number;
  };
  warnings: string[];
  targetModality: TechnicalModality;
}

// ==========================================
// 4. PRESETS
// ==========================================

export type StructuralPresetId =
  | 'ORPHAN_ATTRIBUTE'
  | 'OUROBOROS'
  | 'THE_CAMERA_IS_INSIDE_IT'
  | 'FUTURE_SCAR'
  | 'WRONG_OWNER'
  | 'RELATIONAL_HELL';

export interface StructuralPreset {
  id: StructuralPresetId;
  name: string;
  shortDescription: string;
  operators: string[];
  intensity: StructuralIntensityLevel;
  targetModality: TechnicalModality;
  conceptSummary: string;
}
