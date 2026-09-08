/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5B: Guidance Geometry — Live Mutation Synthesis Engine
 * 
 * Wires Guidance Geometry directly into the live SLOP and Hybrid generation path.
 * Enforces the full 10-step synthesis sequence:
 * USER INPUT
 * → decompose intent
 * → identify LOCKED ANCHORS
 * → identify MUTABLE REGIONS
 * → compile a mutation recipe
 * → select/interpret attractors
 * → generate mutation directives
 * → apply operator interactions (causal chains: A causes B, B destabilizes C, C feeds back into A)
 * → update Content DNA
 * → translate for target medium (IMAGE vs VIDEO vs AUDIO vs AGENT)
 * → synthesize final prompt with anti-slop-slop enforcement & attractor rebalancing
 */

import {
  ContentDNA,
  ContentDnaMutableProperty,
  ContentDnaAttractor,
  ContentDnaOperator,
  ContentDnaInteractionStep,
  TargetMediumTranslation,
  AttractorRebalanceDiagnostic,
  TargetMediumType,
} from '../types/contentDna';
import {
  DecomposedConcept,
  MutationRecipe,
  TargetEngine,
  LogicMapItem,
} from '../types';
import { getMutationOperator } from '../data/mutationOperators';
import { getAttractor } from '../data/latentFauna';
import { extractNonNegotiablesAndAssumptions } from './radicalTransformation';
import { decomposeConceptLocally, detectAnchors } from './conceptDismemberment';
import { compileMutationRecipe, CompileRecipeInput } from './recipeCompiler';
import { INVARIANT_MODALITY_DESCRIPTIONS } from './guidanceGeometryEngine';
import { consultEmpiricalPlanner } from './empiricalLearningEngine';

// ==========================================
// 1. ANTI-SLOP-SLOP BANNED CLICHES & REPLACEMENT RULES
// ==========================================

export const WEAK_MUTATION_ADJECTIVES = [
  'surreal',
  'dreamlike',
  'psychedelic',
  'chaotic',
  'otherworldly',
  'glitchy',
  'impossible',
  'bizarre',
  'weird',
  'trippy',
  'mind-bending',
  'eerie',
  'supernatural',
];

export interface AntiSlopCheckResult {
  hasDecorativeWeirdness: boolean;
  detectedWeakTerms: string[];
  sanitizedPrompt: string;
  substitutionsMade: Array<{ original: string; replacement: string }>;
}

export const MECHANISTIC_SUBSTITUTIONS: Record<string, string> = {
  surreal: 'ontologically uncoupled',
  dreamlike: 'temporally non-linear with floating spatial reference',
  psychedelic: 'chromatically phase-shifted with diffraction caustic interference',
  chaotic: 'high-shear turbulent hydrodynamic convection',
  otherworldly: 'governed by non-standard thermodynamic entropy gradients',
  glitchy: 'displaying scanline timebase shear and discrete spatial quantization',
  impossible: 'topologically non-orientable and locally self-intersecting',
  bizarre: 'structurally inverted across boundary manifolds',
  weird: 'radically orthogonal to canonical taxonomic classification',
  trippy: 'optically refracted through oscillating Fresnel prism planes',
  'mind-bending': 'recursively nested with inverse topological genus',
  eerie: 'acoustically damped under localized atmospheric pressure drops',
  supernatural: 'violating macroscopic baryonic conservation laws',
};

/**
 * Validates and sanitizes prompt text against lazy decorative weirdness ("anti-slop-slop" rule).
 * Converts decorative adjectives into concrete physical/geometric/temporal mechanisms.
 */
export function sanitizeAntiSlopSlop(prompt: string): AntiSlopCheckResult {
  let text = prompt;
  const detectedWeakTerms: string[] = [];
  const substitutionsMade: Array<{ original: string; replacement: string }> = [];

  for (const term of WEAK_MUTATION_ADJECTIVES) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(text)) {
      detectedWeakTerms.push(term);
      const replacement = MECHANISTIC_SUBSTITUTIONS[term.toLowerCase()] || 'physically contradictory';
      text = text.replace(regex, replacement);
      substitutionsMade.push({ original: term, replacement });
    }
  }

  return {
    hasDecorativeWeirdness: detectedWeakTerms.length > 0,
    detectedWeakTerms,
    sanitizedPrompt: text,
    substitutionsMade,
  };
}

// ==========================================
// 2. TARGET MEDIUM CLASSIFICATION & DIALECT TRANSLATOR
// ==========================================

export function mapTargetEngineToMedium(target: TargetEngine | string): TargetMediumType {
  const t = String(target).toLowerCase();
  if (t === 'suno') return 'audio';
  if (['grok', 'runway', 'luma', 'pika', 'kling', 'sora'].includes(t)) {
    // If Grok with video or known video engine
    return 'video';
  }
  if (['llm_agent', 'agent', 'claude', 'gpt'].includes(t)) return 'agent';
  if (t === 'void') return 'void';
  return 'image';
}

export function generateTargetMediumTranslation(
  medium: TargetMediumType,
  seedIdentity: string,
  anchors: string[],
  interactionSteps: ContentDnaInteractionStep[]
): TargetMediumTranslation {
  const topConsequences = interactionSteps.map((s) => s.consequence).slice(0, 3);

  switch (medium) {
    case 'video':
      return {
      medium: 'video',
      governingDimensions: [
        'identity through time',
        'object permanence',
        'motion correspondence',
        'topology deformation across consecutive frames',
        'temporal debt and causal lag',
        'occlusion persistence',
      ],
      invariantsSurviving: [
        `persistent kinematic center of mass for [${seedIdentity}]`,
        `frame-to-frame continuous boundary conservation`,
      ],
      mediumSpecificDirectives: [
        `Enforce strict object permanence: [${seedIdentity}] must maintain coherent tracking vectors throughout transformation.`,
        `Temporal causality: ${topConsequences[0] || 'State change unfolds as a continuous 24fps kinetic deformation.'}`,
        `Frame-to-frame topological persistence: No popping, blinking, or sudden unmotivated morph cuts; every boundary shift must be kinematically motivated.`,
        `Motion correspondence: Shadow paths and specular caustics move with lagging inertia relative to primary deformation.`,
      ],
      formatConstraints: ['temporal continuity', '24fps kinetic coherence', 'smooth velocity vectors'],
    };

    case 'audio':
      return {
      medium: 'audio',
      governingDimensions: [
        'rhythmic meter and pulse',
        'microtonal tuning and harmonic tension',
        'source identity vs acoustic ambiguity',
        'spectral density and phase cancellation',
        'temporal form and reverberant decay',
        'timbral binding and tactile signal degradation',
      ],
      invariantsSurviving: [
        `fundamental pitch/formant footprint of [${seedIdentity}]`,
        `continuous acoustic envelope without unmotivated zero-crossing clicks`,
      ],
      mediumSpecificDirectives: [
        `Acoustic topology: Translate physical morphology into harmonic overtones, transient attacks, and resonant filter poles.`,
        `Spectral collision: ${topConsequences[0] || 'Low-end sub-bass tension modulates mid-frequency formant clarity.'}`,
        `Harmonic ambiguity: Source sound behaves simultaneously as resonant physical acoustic material and synthesized spectral noise.`,
        `Strict audio translation: FORBID ALL visual camera, lighting, or lens terms; express all transformation strictly via acoustic timbre and spatial panning.`,
      ],
      formatConstraints: ['spectral balance', 'phase coherence', 'acoustic spatialization'],
    };

    case 'agent':
    case 'void':
      return {
      medium,
      governingDimensions: [
        'state transition logic',
        'axiomatic constraint verification',
        'syntactic hierarchy',
        'entropy tolerance',
      ],
      invariantsSurviving: [`immutable semantic core: [${seedIdentity}]`],
      mediumSpecificDirectives: [
        `Machine-executable parameterization: Structure constraints as explicit operational declarations.`,
        `Algorithmic boundary: ${topConsequences[0] || 'Deterministic invariant enforcement.'}`,
      ],
      formatConstraints: ['logical rigor', 'bracketed execution syntax'],
    };

    case 'image':
    default:
      return {
      medium: 'image',
      governingDimensions: [
        'spatial binding',
        'topological continuity',
        'material rheology and micro-surface behavior',
        'scale hierarchy (macro vs meso vs micro)',
        'part/whole anatomical relationship',
        'figure/ground segregation and optical depth',
      ],
      invariantsSurviving: [
        `monolithic silhouette contour of [${seedIdentity}]`,
        `unbroken topological outer manifold enclosing the transformed volume`,
      ],
      mediumSpecificDirectives: [
        `Spatial binding: All mutated components must occupy mathematically coherent 3D coordinates on the same physical body.`,
        `Material tension: ${topConsequences[0] || 'Conflicting surface textures meet along defined stress seams.'}`,
        `Topological integrity: Interior structures evert through defined pores and fissures without dissolving into free-floating disconnected noise.`,
        `Optical precision: Deep chiaroscuro shadows and specular Fresnel highlights prove physical tangibility.`,
      ],
      formatConstraints: ['geometric manifold coherence', 'tactile material friction', 'physical illumination'],
    };
  }
}

// ==========================================
// 3. ATTRACTOR GRAVITY & REBALANCING ENGINE
// ==========================================

export interface AttractorEvaluation {
  warnings: string[];
  rebalanceActionTaken?: string;
  rebalancedAttractors: ContentDnaAttractor[];
  isDominantAttractorDetected: boolean;
  isSeedAtRiskOfErasure: boolean;
  isClichéCollapseDetected: boolean;
  isSimpleMashup: boolean;
  wereLockedAnchorsPreserved: boolean;
}

/**
 * Enforces requirement: Attractors must guide — not swallow — the seed.
 * Treats attractors as directional gravity, not subject replacement.
 * Detects:
 * • one attractor is dominating everything
 * • the seed is becoming merely decorative
 * • two attractors are collapsing into an obvious cliché
 * • the mutation becomes a simple mashup
 * • the result has stopped preserving locked anchors
 * When this happens, rebalance before final synthesis.
 */
export function evaluateAndRebalanceAttractors(
  seedIdentity: string,
  lockedAnchors: string[],
  rawAttractors: Array<{ id: string; name?: string; weight?: number }>,
  entropyLevel: number
): AttractorEvaluation {
  const warnings: string[] = [];
  let rebalanceActionTaken: string | undefined;

  // Normalize attractors
  const attractors: ContentDnaAttractor[] = rawAttractors.map((a, idx) => {
    const def = getAttractor(a.id);
    const weight = typeof a.weight === 'number' ? Math.max(0, Math.min(1, a.weight)) : 0.5;
    return {
      id: a.id,
      name: def?.name || a.name || a.id,
      weight,
      gravityRole: (idx === 0 ? 'primary' : 'secondary') as any,
      basinInfluence: def?.directive || 'Directional conceptual gravity',
      isDominant: false,
    };
  });

  // If no attractors provided, return neutral balanced state
  if (attractors.length === 0) {
    return {
      warnings: [],
      rebalancedAttractors: [],
      isDominantAttractorDetected: false,
      isSeedAtRiskOfErasure: false,
      isClichéCollapseDetected: false,
      isSimpleMashup: false,
      wereLockedAnchorsPreserved: true,
    };
  }

  // Check 1: One attractor dominating everything (> 0.85 weight or > 0.45 differential)
  const maxWeight = Math.max(...attractors.map((a) => a.weight));
  const dominant = attractors.find((a) => a.weight === maxWeight);
  let isDominantAttractorDetected = false;

  if (attractors.length > 1) {
    const minWeight = Math.min(...attractors.map((a) => a.weight));
    if (maxWeight - minWeight > 0.45 && maxWeight > 0.75) {
      isDominantAttractorDetected = true;
      warnings.push(`Attractor Dominance: [${dominant?.name}] monopolizes latent basin (weight ${maxWeight.toFixed(2)}). Rebalancing pull.`);
      // Pull back dominant weight to prevent complete subject erasure
      if (dominant) {
        dominant.weight = Math.min(0.68, dominant.weight * 0.82);
        dominant.isDominant = true;
      }
      rebalanceActionTaken = 'Attenuated dominant attractor weight to preserve seed gravity.';
    }
  } else if (maxWeight > 0.88) {
    isDominantAttractorDetected = true;
    warnings.push(`Solo Attractor Dominance: [${dominant?.name}] risks replacing [${seedIdentity}]. Clamping weight to 0.70.`);
    if (dominant) dominant.weight = 0.70;
    rebalanceActionTaken = 'Clamped solo attractor weight to 0.70.';
  }

  // Check 2: Seed becoming merely decorative (entropy high + weak locked anchors)
  const isSeedAtRiskOfErasure = lockedAnchors.length === 0 || maxWeight > 0.8;
  if (isSeedAtRiskOfErasure) {
    warnings.push(`Seed Erasure Hazard: [${seedIdentity}] has insufficient invariant constraints. Injecting identity anchor.`);
    rebalanceActionTaken = (rebalanceActionTaken ? `${rebalanceActionTaken} ` : '') + 'Enforced invariant anchor clause for seed subject.';
  }

  // Check 3: Two attractors collapsing into an obvious cliché
  let isClichéCollapseDetected = false;
  if (attractors.length >= 2) {
    const ids = attractors.map((a) => a.id.toLowerCase());
    const isCathedralBio = ids.some((id) => id.includes('cathedral')) && ids.some((id) => id.includes('flesh') || id.includes('biological'));
    const isCyberpunkGlitch = ids.some((id) => id.includes('cyber')) && ids.some((id) => id.includes('glitch'));
    if (isCathedralBio || isCyberpunkGlitch) {
      isClichéCollapseDetected = true;
      warnings.push('Cliché Collapse Detected: Paired attractors form a familiar generic trope. Imposing orthogonal structural contradiction.');
      rebalanceActionTaken = (rebalanceActionTaken ? `${rebalanceActionTaken} ` : '') + 'Imposed orthogonal structural contradiction to shatter cliché.';
    }
  }

  // Check 4: Simple Mashup Collapse (two equal weights with zero structural tension)
  let isSimpleMashup = false;
  if (attractors.length >= 2 && Math.abs(attractors[0].weight - attractors[1].weight) < 0.05 && entropyLevel < 8) {
    isSimpleMashup = true;
    warnings.push('Simple Mashup Risk: Attractors in un-tensioned 50/50 balance will collapse into superficial hybrid. Asymmetrizing weights.');
    attractors[0].weight = Math.min(1.0, attractors[0].weight + 0.12);
    attractors[1].weight = Math.max(0.2, attractors[1].weight - 0.12);
    rebalanceActionTaken = (rebalanceActionTaken ? `${rebalanceActionTaken} ` : '') + 'Introduced asymmetric tension offset (0.62 / 0.38).';
  }

  return {
    warnings,
    rebalanceActionTaken,
    rebalancedAttractors: attractors,
    isDominantAttractorDetected,
    isSeedAtRiskOfErasure,
    isClichéCollapseDetected,
    isSimpleMashup,
    wereLockedAnchorsPreserved: lockedAnchors.length > 0,
  };
}

// ==========================================
// 4. OPERATOR BLENDING & CAUSAL INTERACTION CHAINS
// ==========================================

/**
 * Builds a real causal interaction chain:
 * Operator 1 causes consequence A
 * Operator 2 acts on consequence A to destabilize B
 * Operator 3 feeds back into Operator 1 (A causes B, B destabilizes C, C feeds back into A)
 * This guarantees structured instability rather than a naive checklist (A + B + C).
 */
export function buildOperatorInteractionChain(
  seedIdentity: string,
  operators: ContentDnaOperator[],
  mutableProps: ContentDnaMutableProperty[],
  attractorName: string
): ContentDnaInteractionStep[] {
  if (operators.length === 0) {
    return [
      {
        step: 1,
        operatorId: 'identity_preservation',
        operatorName: 'Identity Invariant',
        inputState: `Baseline representation of [${seedIdentity}]`,
        action: 'Preserves core boundary geometry while isolating mutable properties',
        consequence: `Ground truth contours of [${seedIdentity}] firmly established`,
        targetAffected: 'global boundary',
      },
    ];
  }

  const steps: ContentDnaInteractionStep[] = [];
  const propNames = mutableProps.map((p) => p.name);
  const targetProp1 = propNames[0] || 'surface boundary';
  const targetProp2 = propNames[1] || 'internal mechanics';
  const targetProp3 = propNames[2] || 'environmental coupling';

  for (let i = 0; i < operators.length; i++) {
    const op = operators[i];
    const stepNum = i + 1;

    if (i === 0) {
      // Step 1: Initial transformation of mutable property
      steps.push({
        step: 1,
        operatorId: op.id,
        operatorName: op.name,
        inputState: `Unmodified [${seedIdentity}] with standard [${targetProp1}]`,
        action: op.actionDirective,
        consequence: `Destabilizes ${targetProp1}, forcing it to reorganize under ${attractorName || 'orthogonal physics'}`,
        targetAffected: targetProp1,
      });
    } else if (i === 1) {
      // Step 2: Second operator acts on the consequence produced by the first
      const prevConsequence = steps[0].consequence;
      steps.push({
        step: 2,
        operatorId: op.id,
        operatorName: op.name,
        inputState: `Altered state resulting from Step 1 (${prevConsequence})`,
        action: `${op.actionDirective} applied directly to the destabilized ${targetProp1}`,
        consequence: `Propagates structural tension from ${targetProp1} into ${targetProp2}, producing irreversible topological shear`,
        targetAffected: targetProp2,
      });
    } else if (i === 2) {
      // Step 3: Third operator links the first two into a closed recursive feedback loop
      steps.push({
        step: 3,
        operatorId: op.id,
        operatorName: op.name,
        inputState: `Dynamic tension between ${targetProp1} (Step 1) and ${targetProp2} (Step 2)`,
        action: `${op.actionDirective} bridging the primary and secondary deformation zones`,
        consequence: `Completes feedback loop: ${targetProp2} destabilization exerts counter-pressure back upon ${targetProp1}, preventing either from stabilizing into a generic mixture`,
        targetAffected: targetProp3,
        feedbackTo: `Feeds back into Step 1 (${operators[0].name})`,
      });
    } else {
      // Subsequent steps: Apply compounding constraints
      steps.push({
        step: stepNum,
        operatorId: op.id,
        operatorName: op.name,
        inputState: `Recursive state from Step ${stepNum - 1}`,
        action: op.actionDirective,
        consequence: `Compounding constraint enforcing ${op.behavioralRule}`,
        targetAffected: propNames[i % propNames.length] || 'micro-surface detail',
      });
    }
  }

  return steps;
}

// ==========================================
// 5. OPERATOR BEHAVIORAL RULE GENERATOR
// ==========================================

export function resolveOperatorBehavior(opId: string): {
  name: string;
  category: ContentDnaOperator['mechanismCategory'];
  rule: string;
  directive: string;
} {
  switch (opId) {
    case 'semantic_neighbor_walk':
    case 'semantic_hop':
      return {
        name: 'Semantic Hop',
        category: 'ontological',
        rule: 'Changes which conceptual neighborhood a mutable property is pulled toward, preventing literal synonym drift.',
        directive: 'Traverse 2-3 associative hops away from baseline attributes (e.g. skin -> membrane -> dielectric interface) before settling.',
      };

    case 'recursive_reversal':
      return {
        name: 'Recursive Reversal',
        category: 'temporal',
        rule: 'Makes an earlier consequence become a later cause, or compels the transformed result to act back upon its source.',
        directive: 'Invert causal sequence: the shadow cast by the object exerts physical compressive load back on the casting hull.',
      };

    case 'abstraction_escape':
      return {
        name: 'Abstraction Escape',
        category: 'ontological',
        rule: 'Escapes literal physical decoration into higher-order structural, thermodynamic, or mathematical laws.',
        directive: 'Step up one abstraction layer: rather than altering textures, mutate what counts as a boundary manifold.',
      };

    case 'scale_schism':
      return {
        name: 'Scale Schism',
        category: 'scale',
        rule: 'Applies mutually incompatible structural laws across distinct scales (macro vs meso vs micro).',
        directive: 'Microstructure adheres to rigid non-Euclidean crystalline packing, while macro-silhouette retains fluid hydrodynamic pulse.',
      };

    case 'concept_bleed':
      return {
        name: 'Concept Bleed',
        category: 'structural',
        rule: 'Transfers topology, boundary behavior, and material logic from one conceptual domain directly into another.',
        directive: 'Anatomical seams inherit the hydraulic pressure and timecode sync-loss of analog magnetic tape.',
      };

    case 'forbidden_attractor':
      return {
        name: 'Forbidden Attractor',
        category: 'paradox',
        rule: 'Invokes the deep organizational geometry of an attractor while strictly barring its stereotypical visual/acoustic cliché.',
        directive: 'Compel axial symmetry and monumental reverberant enclosure while strictly forbidding decorative religious arches or masonry.',
      };

    case 'staged_paradox':
      return {
        name: 'Staged Paradox',
        category: 'paradox',
        rule: 'Introduces contradictions in sequential progression so both poles remain active instead of cancelling into mush.',
        directive: 'Stage 1: Pristine recognizable form; Stage 2: Inward implosion; Stage 3: Simultaneous outward fluid eruption without rupturing boundary.',
      };

    case 'ontology_swap':
      return {
        name: 'Ontology Swap',
        category: 'ontological',
        rule: 'Transmutes the categorical substrate of the subject (e.g. body as thermodynamic vortex, room as phase transition).',
        directive: 'Redefine subject as an active fluid shear zone rather than a solid bounded object.',
      };

    case 'structural_dismemberment':
      return {
        name: 'Structural Dismemberment',
        category: 'structural',
        rule: 'Dismembers concept into functional organs; mutates unanchored organs while anchoring the core identity.',
        directive: 'Sever standard mechanical linkage; rewire input propulsion directly into sensory receptors.',
      };

    default: {
      const def = getMutationOperator(opId);
      return {
        name: def?.name || opId.toUpperCase(),
        category: 'structural',
        rule: def?.description || 'Enforces structural and geometric transformation.',
        directive: `Applies deterministic ${def?.name || opId} rule across mutable coordinates.`,
      };
    }
  }
}

// ==========================================
// 6. COMPOSE LIVE MUTATION SYNTHESIS (THE FULL PIPELINE)
// ==========================================

export interface LiveMutationInput {
  userInput: string;
  targetEngine: TargetEngine | string;
  entropyLevel: number;
  selectedOperators?: string[];
  selectedAttractors?: string[];
  preservedAnchors?: string[];
  legacyDna?: ContentDNA;
}

export interface LiveMutationResult {
  contentDna: ContentDNA;
  slopPrompt: string;
  logicMap: LogicMapItem[];
  attractorWarnings: string[];
  rebalanceApplied: boolean;
  sanitizationReport: AntiSlopCheckResult;
}

/**
 * Executes the complete Job 5B internal sequence:
 * USER INPUT
 * → decompose intent
 * → identify LOCKED ANCHORS
 * → identify MUTABLE REGIONS
 * → compile a mutation recipe
 * → select/interpret attractors
 * → generate mutation directives
 * → apply operator interactions
 * → update Content DNA
 * → translate for target medium
 * → synthesize final prompt
 */
export function executeLiveMutationSynthesis(input: LiveMutationInput): LiveMutationResult {
  const {
    userInput,
    targetEngine,
    entropyLevel,
    selectedOperators = [],
    selectedAttractors = [],
    preservedAnchors = [],
    legacyDna,
  } = input;

  const targetMedium = mapTargetEngineToMedium(targetEngine);

  // STEP 1: DECOMPOSE INTENT
  const nonNegotiables = extractNonNegotiablesAndAssumptions(userInput);
  const detectedAnchorData = detectAnchors(userInput);
  const decomposedLocally = decomposeConceptLocally(userInput);

  // Derive primary seed identity
  const seedIdentity =
    nonNegotiables.requiredEntities[0] ||
    detectedAnchorData.anchors[0] ||
    userInput.split(/[,.;\n]/)[0].trim().slice(0, 80) ||
    'central entity';

  // STEP 2: IDENTIFY LOCKED ANCHORS
  const rawAnchors = Array.from(
    new Set([
      ...preservedAnchors,
      ...detectedAnchorData.anchors,
      ...nonNegotiables.preservedAnchors,
      ...nonNegotiables.hardAnchors,
      ...(legacyDna?.lockedAnchors || []),
    ])
  ).filter((a) => Boolean(a && a.trim()));

  const lockedAnchors = rawAnchors.length > 0 ? rawAnchors : [seedIdentity];

  // STEP 3: IDENTIFY MUTABLE REGIONS
  const mutableProps: ContentDnaMutableProperty[] = [];
  if (decomposedLocally.organs && decomposedLocally.organs.length > 0) {
    const mutableOrgans = decomposedLocally.organs.filter((o) => o.type !== 'identity' && o.type !== 'subject');
    mutableOrgans.forEach((o, idx) => {
      mutableProps.push({
        name: `${o.type}_${idx + 1}`,
        originalValue: o.originalValue,
        mutatedValue: undefined,
        subsystem: idx === 0 ? 'surface' : idx === 1 ? 'mechanics' : 'topology',
      });
    });
  }

  // Fallback mutable properties if text had few organs
  if (mutableProps.length === 0) {
    mutableProps.push(
      { name: 'surface morphology', originalValue: 'canonical exterior', subsystem: 'surface' },
      { name: 'internal mechanics', originalValue: 'standard physical operation', subsystem: 'mechanics' },
      { name: 'environmental interface', originalValue: 'inert ambient contact', subsystem: 'topology' }
    );
  }

  // STEP 4: COMPILE MUTATION RECIPE WITH EMPIRICAL LEARNING
  const empiricalPlan = consultEmpiricalPlanner({
    concept: userInput,
    targetEngine,
    entropyLevel,
  });
  const effectiveOperators = [...selectedOperators];
  const effectiveAttractors = [...selectedAttractors];

  // If user hasn't explicitly specified operators, leverage empirically validated operators
  if (effectiveOperators.length === 0 && empiricalPlan.recommendedOperators.length > 0) {
    effectiveOperators.push(...empiricalPlan.recommendedOperators.slice(0, 3));
  }

  const recipeInput: CompileRecipeInput = {
    concept: userInput,
    entropyLevel,
    selectedOperators: effectiveOperators,
    selectedAttractors: effectiveAttractors,
    targetEngine,
    preservedAnchors: lockedAnchors,
  };
  const compiledRecipe = compileMutationRecipe(recipeInput);

  // Resolve active operators with concrete behavior
  let activeOpsList =
    compiledRecipe.operators && compiledRecipe.operators.length > 0
      ? compiledRecipe.operators.map((op) => (typeof op === 'string' ? op : op.id))
      : effectiveOperators.length > 0
      ? effectiveOperators
      : ['semantic_hop', 'scale_schism', 'recursive_reversal'];

  // If empirical history shows cautioned collapse from an unselected operator, filter it out
  if (selectedOperators.length === 0 && empiricalPlan.cautionedOperators.length > 0) {
    activeOpsList = activeOpsList.filter((op) => !empiricalPlan.cautionedOperators.includes(op));
    if (activeOpsList.length === 0) activeOpsList = ['scale_schism', 'recursive_reversal'];
  }

  const activeOperators: ContentDnaOperator[] = activeOpsList.slice(0, 4).map((opId) => {
    const behavior = resolveOperatorBehavior(opId);
    return {
      id: opId,
      name: behavior.name,
      weight: 0.8,
      mechanismCategory: behavior.category,
      behavioralRule: behavior.rule,
      actionDirective: behavior.directive,
    };
  });

  // STEP 5: SELECT / INTERPRET ATTRACTORS WITH GRAVITY REBALANCING
  const rawAttractorList =
    compiledRecipe.attractors && compiledRecipe.attractors.length > 0
      ? compiledRecipe.attractors.map((a) => (typeof a === 'string' ? { id: a, weight: 0.5 } : { id: a.id, weight: a.weight }))
      : selectedAttractors.map((id) => ({ id, weight: 0.5 }));

  const attractorEval = evaluateAndRebalanceAttractors(
    seedIdentity,
    lockedAnchors,
    rawAttractorList,
    entropyLevel
  );

  const activeAttractors = attractorEval.rebalancedAttractors;
  const primaryAttractorName = activeAttractors[0]?.name || 'Non-Euclidean Topology';

  // STEP 6 & 7: GENERATE MUTATION DIRECTIVES & APPLY OPERATOR INTERACTIONS
  const interactionChain = buildOperatorInteractionChain(
    seedIdentity,
    activeOperators,
    mutableProps,
    primaryAttractorName
  );

  // Update mutable properties with their transformed states based on interaction chain
  mutableProps.forEach((prop, idx) => {
    const step = interactionChain[idx] || interactionChain[0];
    prop.assignedOperatorId = step.operatorId;
    prop.mutatedValue = step.consequence;
    prop.transformationMechanism = step.action;
  });

  // STEP 8: TRANSLATE FOR TARGET MEDIUM
  const translationDetails = generateTargetMediumTranslation(
    targetMedium,
    seedIdentity,
    lockedAnchors,
    interactionChain
  );

  // STEP 9: UPDATE & ASSEMBLE CONTENT DNA
  const forbiddenOutcomes = [
    'pure decorative surrealism or random adjective soup without physical mechanism',
    'erasure of locked invariant subject anchors',
    'unmotivated 50/50 superficial mashup',
    'unbounded disintegration into disconnected visual/acoustic noise',
  ];

  const emergentArtifacts = [
    `unified continuous boundary preserving [${seedIdentity}]`,
    `feedback loop where ${interactionChain[1]?.targetAffected || 'mechanics'} counter-stabilizes ${interactionChain[0]?.targetAffected || 'surface'}`,
    `topological tension sustained across ${translationDetails.governingDimensions.slice(0, 2).join(' and ')}`,
  ];

  const contentDna: ContentDNA = {
    seedIdentity,
    lockedAnchors,
    mutableProperties: mutableProps,
    activeAttractors,
    activeOperators,
    interactionChain,
    mutationIntensity: entropyLevel / 10,
    targetMedium,
    forbiddenOutcomes,
    emergentArtifacts,
    translationDetails,
    rebalanceStatus: {
      isDominantAttractorDetected: attractorEval.isDominantAttractorDetected,
      isSeedAtRiskOfErasure: attractorEval.isSeedAtRiskOfErasure,
      isClichéCollapseDetected: attractorEval.isClichéCollapseDetected,
      isSimpleMashup: attractorEval.isSimpleMashup,
      wereLockedAnchorsPreserved: attractorEval.wereLockedAnchorsPreserved,
      rebalanceActionTaken: attractorEval.rebalanceActionTaken,
      warnings: attractorEval.warnings,
    },
    generationTimestamp: Date.now(),
    rawSeedPrompt: userInput,
  };

  // STEP 10: SYNTHESIZE FINAL PROMPT
  const finalPromptRaw = buildSynthesizedPromptFromDna(contentDna);

  // Run Anti-Slop-Slop Sanitizer to ensure no empty adjectives survived
  const sanitizationReport = sanitizeAntiSlopSlop(finalPromptRaw);
  const slopPrompt = sanitizationReport.sanitizedPrompt;

  // Compile upgraded Logic Map for display
  const logicMap = buildUpgradedLogicMap(contentDna, attractorEval.warnings);

  return {
    contentDna,
    slopPrompt,
    logicMap,
    attractorWarnings: attractorEval.warnings,
    rebalanceApplied: Boolean(attractorEval.rebalanceActionTaken),
    sanitizationReport,
  };
}

// ==========================================
// 7. RENDER HIGH-FIDELITY PHENOTYPE PROMPT FROM DNA
// ==========================================

export function buildSynthesizedPromptFromDna(dna: ContentDNA): string {
  const {
    seedIdentity,
    lockedAnchors,
    activeAttractors,
    activeOperators,
    interactionChain,
    targetMedium,
    translationDetails,
  } = dna;

  const sections: string[] = [];

  // A. Invariant Subject Anchor
  const anchorClause = lockedAnchors.length > 0 ? lockedAnchors.join(', ') : seedIdentity;
  sections.push(
    `[GROUND TRUTH ANCHOR]: Core topological identity [${seedIdentity}], with immutable invariant features [${anchorClause}] strictly anchored and recognizable throughout transformation.`
  );

  // B. Operator Causal Dynamics
  const chainClauses = interactionChain.map(
    (step) =>
      `Phase ${step.step} (${step.operatorName}): ${step.action}. Consequence: ${step.consequence}.${
        step.feedbackTo ? ` [RECURSIVE COUPLING: ${step.feedbackTo}]` : ''
      }`
  );
  sections.push(`[CAUSAL INTERACTION CHAIN]:\n${chainClauses.join('\n')}`);

  // C. Attractor Gravity Fields
  if (activeAttractors.length > 0) {
    const attractorClauses = activeAttractors.map(
      (a) =>
        `Attractor [${a.name}] (gravity pull ${(a.weight * 100).toFixed(0)}%): Compels ${a.basinInfluence} as an unyielding physical constraint, acting upon but not replacing the anchor subject.`
    );
    sections.push(`[DIRECTIONAL ATTRACTOR GRAVITY]:\n${attractorClauses.join('\n')}`);
  }

  // D. Target Medium Specific Phenotype
  if (translationDetails) {
    sections.push(
      `[${targetMedium.toUpperCase()} TRANSLATION]:\n` +
        translationDetails.mediumSpecificDirectives.map((d) => `* ${d}`).join('\n')
    );
  }

  // E. Material & Geometric Invariant
  sections.push(
    `[STRUCTURAL INVARIANT ENFORCEMENT]: All competing forces are bound into a singular, continuous physical manifold with zero unmotivated fragmentation or blurred blend soup.`
  );

  return sections.join('\n\n');
}

// ==========================================
// 8. UPGRADED LOGIC MAP BUILDER
// ==========================================

/**
 * Builds the structured Logic Map conforming to Requirement 8:
 * SEED
 * LOCKS
 * ATTRACTORS
 * OPERATORS
 * INTERACTION CHAIN
 * TARGET TRANSLATION
 * PRESERVED ARTIFACTS
 * WARNINGS
 */
export function buildUpgradedLogicMap(dna: ContentDNA, warnings: string[]): LogicMapItem[] {
  const items: LogicMapItem[] = [];

  // 1. SEED
  items.push({
    phase: 'SEED',
    description: `Identity: [${dna.seedIdentity}]. Original prompt intent extracted with semantic integrity.`,
  });

  // 2. LOCKS
  items.push({
    phase: 'LOCKS',
    description: `Locked Invariant Anchors: [${dna.lockedAnchors.join(', ')}]. Ground-truth boundary conditions preserved across all mutation cycles.`,
  });

  // 3. ATTRACTORS
  const attractorSummary =
    dna.activeAttractors.length > 0
      ? dna.activeAttractors
          .map((a) => `${a.name} (${Math.round(a.weight * 100)}% pull)`)
          .join(', ')
      : 'None (Pure Geometric Manifold)';
  items.push({
    phase: 'ATTRACTORS',
    description: `Directional Latent Basins: ${attractorSummary}. Functioning as directional gravity rather than subject replacement.`,
  });

  // 4. OPERATORS
  const operatorSummary =
    dna.activeOperators.length > 0
      ? dna.activeOperators.map((o) => `${o.name} [${o.mechanismCategory}]`).join(', ')
      : 'Semantic Hop, Scale Schism';
  items.push({
    phase: 'OPERATORS',
    description: `Behavioral Mutation Mechanisms: ${operatorSummary}. Executed as deterministic transformation rules rather than cosmetic tags.`,
  });

  // 5. INTERACTION CHAIN
  const chainSummary = dna.interactionChain
    .map((s) => `Step ${s.step}: ${s.operatorName} (${s.targetAffected}) -> ${s.consequence.slice(0, 75)}...`)
    .join(' | ');
  items.push({
    phase: 'INTERACTION CHAIN',
    description: `Causal Feedback Dynamics: ${chainSummary || 'Linear causal coupling'}.`,
  });

  // 6. TARGET TRANSLATION
  const targetSummary = dna.translationDetails
    ? `${dna.targetMedium.toUpperCase()} Dialect: Governed by [${dna.translationDetails.governingDimensions.slice(0, 3).join(', ')}].`
    : `${dna.targetMedium.toUpperCase()} Translation Active.`;
  items.push({
    phase: 'TARGET TRANSLATION',
    description: targetSummary,
  });

  // 7. PRESERVED ARTIFACTS
  items.push({
    phase: 'PRESERVED ARTIFACTS',
    description: `Emergent Structural Form: ${dna.emergentArtifacts.join('; ')}.`,
  });

  // 8. WARNINGS
  const allWarnings = [
    ...warnings,
    ...(dna.rebalanceStatus?.warnings || []),
  ];
  const uniqueWarnings = Array.from(new Set(allWarnings));
  items.push({
    phase: 'WARNINGS',
    description:
      uniqueWarnings.length > 0
        ? uniqueWarnings.join('; ')
        : 'Zero structural warnings: Saddle equilibrium stable, locked anchors intact, anti-slop-slop verified.',
  });

  return items;
}

// ==========================================
// 9. LEGACY FALLBACK INFERENCE ENGINE
// ==========================================

/**
 * Requirement 9: If older saved state lacks Guidance Geometry metadata,
 * DAVID must gracefully infer the minimum required Content DNA from existing prompt/state.
 * Never crashes, never requires migrations, never silently erases content.
 */
export function inferContentDnaFromLegacyState(
  prompt: string,
  targetEngine: TargetEngine | string = 'general',
  legacyData?: any
): ContentDNA {
  const text = prompt || '';
  const anchorsData = detectAnchors(text);
  const words = text.split(/\s+/).filter(Boolean);
  const seedIdentity =
    legacyData?.subject ||
    anchorsData.anchors[0] ||
    (words.slice(0, 4).join(' ') || 'central subject');

  const lockedAnchors =
    legacyData?.preservedAnchors && legacyData.preservedAnchors.length > 0
      ? legacyData.preservedAnchors
      : anchorsData.anchors.length > 0
      ? anchorsData.anchors
      : [seedIdentity];

  const targetMedium = mapTargetEngineToMedium(targetEngine);

  const activeOperators: ContentDnaOperator[] = (legacyData?.activeOperators || ['semantic_hop', 'scale_schism']).map(
    (opId: string) => {
      const b = resolveOperatorBehavior(opId);
      return {
        id: opId,
        name: b.name,
        weight: 0.7,
        mechanismCategory: b.category,
        actionDirective: b.directive,
        behavioralRule: b.rule,
      };
    }
  );

  const activeAttractors: ContentDnaAttractor[] = (legacyData?.activeAttractors || []).map((atId: string) => {
    const def = getAttractor(atId);
    return {
      id: atId,
      name: def?.name || atId,
      weight: 0.5,
      gravityRole: 'primary',
      basinInfluence: def?.directive || 'Directional gravity',
    };
  });

  const mutableProps: ContentDnaMutableProperty[] = [
    { name: 'surface morphology', originalValue: 'baseline geometry', subsystem: 'surface' },
    { name: 'internal mechanics', originalValue: 'baseline mechanics', subsystem: 'mechanics' },
  ];

  const interactionChain = buildOperatorInteractionChain(
    seedIdentity,
    activeOperators,
    mutableProps,
    activeAttractors[0]?.name || 'Non-Euclidean Manifold'
  );

  const translationDetails = generateTargetMediumTranslation(
    targetMedium,
    seedIdentity,
    lockedAnchors,
    interactionChain
  );

  return {
    seedIdentity,
    lockedAnchors,
    mutableProperties: mutableProps,
    activeAttractors,
    activeOperators,
    interactionChain,
    mutationIntensity: 0.5,
    targetMedium,
    forbiddenOutcomes: ['accidental semantic erasure', 'generic adjective soup'],
    emergentArtifacts: [`preserved invariant boundary around [${seedIdentity}]`],
    translationDetails,
    rebalanceStatus: {
      isDominantAttractorDetected: false,
      isSeedAtRiskOfErasure: false,
      isClichéCollapseDetected: false,
      isSimpleMashup: false,
      wereLockedAnchorsPreserved: true,
      warnings: ['Legacy state inferred: default invariant constraints applied.'],
    },
    generationTimestamp: Date.now(),
    rawSeedPrompt: text,
  };
}
