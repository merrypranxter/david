/**
 * DAVID — EXPERIMENTAL DISCOVERY ENGINE (Job 8)
 * Core Implementation
 * 
 * Bounded empirical experimentation for discovering, testing, comparing,
 * and preserving novel generative-instability procedures.
 */

import { TargetEngine } from '../types';
import {
  ExperimentRecord,
  ExperimentHypothesis,
  DiscoveryVariant,
  DiscoveryConfig,
  DiscoveryRecipe,
  PromotedOperator,
  DiscoveryUserRating,
  ObservableArtifactTag,
  CreativeValueTier,
  MechanismConfidenceTier,
  OBSERVABLE_ARTIFACT_TAGS,
} from '../types/discoveryEngine';
import { FAILURE_OPERATORS, FailureOperator } from '../data/failureOperators';

// Local storage keys and universal fallback
const DISCOVERY_RECIPES_STORAGE_KEY = 'david_discovery_recipes_v1';
const PROMOTED_OPERATORS_STORAGE_KEY = 'david_promoted_operators_v1';
const EXPERIMENT_RECORDS_STORAGE_KEY = 'david_discovery_experiments_v1';

const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {}
  memoryStore[key] = value;
}

// ==========================================
// 1. DEFAULT HYPOTHESIS BUILDER (SECTION 4)
// ==========================================

export function constructExperimentHypothesis(params: {
  operatorA: string;
  operatorB?: string;
  targetMedium: 'image' | 'video' | 'audio';
  targetEngine: string;
  lockedAnchors: string[];
  experimentType: string;
}): ExperimentHypothesis {
  const { operatorA, operatorB, targetMedium, lockedAnchors, experimentType } = params;
  const opAName = operatorA.replace(/_/g, ' ');
  const opBName = operatorB ? operatorB.replace(/_/g, ' ') : 'orthogonal constraint';
  const anchorStr = lockedAnchors.length > 0 ? lockedAnchors.join(', ') : 'subject identity';

  if (experimentType === 'dose_sweep') {
    return {
      hypothesis: `Increasing titration of ${opAName} while maintaining fixed anchor (${anchorStr}) isolates the phase-shift threshold where structural deformation overtakes identity without total semantic erasure.`,
      tension: `Core identity persistence of [${anchorStr}] directly competes with the progressive destabilization pressure of ${opAName}.`,
      control: `Baseline prompt with identical seed intent and anchor locks, but with ${opAName} completely neutralized (zero dosage).`,
      ablation: `Execute maximal ${opAName} dosage with identity anchor locks entirely removed to determine whether structure survives without anchor scaffolding.`,
      expectedFailure: targetMedium === 'audio'
        ? 'Phoneme/instrument confusion, spectral artifacts, or sudden timbre collapse at higher titration levels.'
        : targetMedium === 'video'
        ? 'Temporal smearing, object permanence failure, or feature drift across sequential frames.'
        : 'Boundary leakage, duplicated connective anatomy, or topology instability along anchor seams.',
    };
  }

  if (experimentType === 'operator_interaction') {
    return {
      hypothesis: `The interaction between ${opAName} and ${opBName} produces emergent structural artifacts that are non-linearly distinct from either operator running in isolation.`,
      tension: `Structural reconfiguration from ${opAName} clashes with boundary dynamics enforced by ${opBName}.`,
      control: `Standard representation of [${anchorStr}] without either ${opAName} or ${opBName} active.`,
      ablation: `Test ${opAName} alone and ${opBName} alone to isolate baseline effects from true interaction phenomena.`,
      expectedFailure: targetMedium === 'audio'
        ? 'Rhythmic compensation, phase ambiguity, or unexpected harmonic hybrids not present in solo runs.'
        : targetMedium === 'video'
        ? 'Motion reassignment, continuation drift, or occlusion mutation.'
        : 'Hallucinated connective tissue, shape substitution, or material substitution along mutual fault lines.',
    };
  }

  if (experimentType === 'anchor_ablation') {
    return {
      hypothesis: `The presence of hard anchor locks on [${anchorStr}] restricts ${opAName} to localized boundary leakage, whereas removing the anchor causes global topological collapse.`,
      tension: `Invariant semantic preservation vs unconstrained latent attractor drift.`,
      control: `Standard anchored prompt without ${opAName}.`,
      ablation: `Total ablation of anchor locks [${anchorStr}], allowing ${opAName} to mutate all semantic coordinates freely.`,
      expectedFailure: 'Identity splitting, orphan attributes, or semantic drift once the anchor constraint is decoupled.',
    };
  }

  // Default / Order path-dependency hypothesis
  return {
    hypothesis: `Sequential execution order (${opAName} → ${opBName} vs ${opBName} → ${opAName}) exhibits path dependency due to directional latent state conditioning.`,
    tension: `Directional conditioning order creates asymmetric semantic and topological constraints.`,
    control: `Simultaneous flat application of both operators without sequential priority.`,
    ablation: `Individual component isolation runs to baseline baseline contributions.`,
    expectedFailure: 'Asymmetric feature reassignment, texture takeover, or directional scale leakage depending on primary operator.',
  };
}

// ==========================================
// 2. EXPERIMENT FAMILY BUILDER (SECTIONS 1, 2, 5, 6)
// ==========================================

export function buildDiscoveryExperimentFamily(params: {
  concept: string;
  targetEngine?: TargetEngine | string;
  targetMedium?: 'image' | 'video' | 'audio';
  modelProfile?: string;
  activeOperators?: string[];
  lockedAnchors?: string[];
  entropyLevel?: number;
  config?: Partial<DiscoveryConfig>;
}): ExperimentRecord {
  const concept = params.concept.trim() || 'A mechanical porcelain cicada idling in desert sand';
  const targetEngine = params.targetEngine || 'openart';
  const targetMedium =
    params.targetMedium ||
    (targetEngine === 'suno' ? 'audio' : ['runway', 'luma', 'pika'].includes(targetEngine as string) ? 'video' : 'image');
  const modelProfile = params.modelProfile || (targetEngine === 'openart' ? 'openart_flux' : 'standard_generative_model');
  const lockedAnchors = params.lockedAnchors && params.lockedAnchors.length > 0
    ? params.lockedAnchors
    : ['cicada anatomy', 'desert sand'];
  const entropyLevel = params.entropyLevel ?? 7;

  // Resolve operators
  const activeOps = params.activeOperators && params.activeOperators.length > 0
    ? params.activeOperators
    : ['scale_schism', 'recursive_reversal'];

  const opA = activeOps[0] || 'scale_schism';
  const opB = activeOps[1] || 'recursive_reversal';

  const expType = params.config?.experimentType || 'operator_interaction';
  const variantCount = Math.min(Math.max(params.config?.variantCount || 4, 2), 5); // Bounded between 2 and 5

  const experimentId = `EXP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // 1. Build concise hypothesis (Section 4)
  const hypothesis = constructExperimentHypothesis({
    operatorA: opA,
    operatorB: opB,
    targetMedium,
    targetEngine: targetEngine as string,
    lockedAnchors,
    experimentType: expType,
  });

  // 2. Build the legitimate CONTROL VARIANT (Section 2)
  // Always preserves underlying user intent while neutralizing the experimental mutation
  const controlVariant: DiscoveryVariant = {
    id: `${experimentId}-CTRL`,
    label: 'Control Baseline (Mutation Neutralized)',
    role: 'control',
    isControl: true,
    operators: [],
    operatorOrder: [],
    operatorStrengths: { [opA]: 0, [opB]: 0 },
    mutationIntensity: 0,
    anchorPreservation: 'hard',
    targetMedium,
    targetEngine,
    modelProfile,
    description: `Baseline representation maintaining core intent [${concept}] with all destabilization operators neutralized.`,
    promptText: `[INTENT: ${concept}] [PRESERVED: ${lockedAnchors.join(', ')}] standard coherent aesthetic representation, high fidelity, balanced natural morphology.`,
    taggedArtifacts: [],
  };

  // 3. Build bounded family of EXPERIMENTAL VARIANTS (Section 1, 5, 6)
  const experimentalVariants: DiscoveryVariant[] = [];

  if (expType === 'dose_sweep') {
    // Dose sweep: LOW, MEDIUM, HIGH, MAXIMAL (Section 5)
    const doses: Array<{ level: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMAL'; value: number; label: string }> = [
      { level: 'LOW', value: 0.25, label: `Low Titration (${opA} @ 25%)` },
      { level: 'MEDIUM', value: 0.55, label: `Moderate Titration (${opA} @ 55%)` },
      { level: 'HIGH', value: 0.85, label: `High Titration (${opA} @ 85%)` },
      { level: 'MAXIMAL', value: 1.0, label: `Maximal Destabilization (${opA} @ 100%)` },
    ];

    doses.slice(0, variantCount).forEach((dose, idx) => {
      experimentalVariants.push({
        id: `${experimentId}-VAR-${idx + 1}`,
        label: dose.label,
        role: 'dose_sweep',
        isControl: false,
        doseLevel: dose.level,
        operators: [opA],
        operatorOrder: [opA],
        operatorStrengths: { [opA]: dose.value },
        mutationIntensity: Math.round(dose.value * 10),
        anchorPreservation: 'hard',
        targetMedium,
        targetEngine,
        modelProfile,
        description: `Titrates ${opA} at ${dose.level} dosage (${dose.value * 100}%) against locked anchors.`,
        promptText: `[ANCHOR: ${lockedAnchors.join(', ')}] [OPERATOR: ${opA} (dose=${dose.value})] ${concept}. Destabilization pressure applied proportionally to boundary topology.`,
        taggedArtifacts: [],
      });
    });
  } else if (expType === 'operator_interaction') {
    // Operator interaction: A alone, B alone, A -> B, B -> A, A + B (Section 6)
    const interactionConfigs = [
      {
        idSuffix: '1',
        label: `Operator A Alone (${opA})`,
        role: 'experimental' as const,
        ops: [opA],
        order: [opA],
        desc: `Evaluates ${opA} isolated from secondary operator interference.`,
        prompt: `[ISOLATION: ${opA}] [ANCHORS: ${lockedAnchors.join(', ')}] ${concept}. Execute pure ${opA} transformation without compound secondary vectors.`,
      },
      {
        idSuffix: '2',
        label: `Operator B Alone (${opB})`,
        role: 'experimental' as const,
        ops: [opB],
        order: [opB],
        desc: `Evaluates ${opB} isolated from secondary operator interference.`,
        prompt: `[ISOLATION: ${opB}] [ANCHORS: ${lockedAnchors.join(', ')}] ${concept}. Execute pure ${opB} transformation without compound secondary vectors.`,
      },
      {
        idSuffix: '3',
        label: `Directional Sequence: ${opA} → ${opB}`,
        role: 'order_test' as const,
        ops: [opA, opB],
        order: [opA, opB],
        desc: `Executes ${opA} first, then routes transformed topology into ${opB} (checks forward path-dependency).`,
        prompt: `[SEQUENCE: ${opA} THEN ${opB}] [ANCHORS: ${lockedAnchors.join(', ')}] ${concept}. First apply ${opA} to structural coordinates, subsequently apply ${opB} to resulting boundary surfaces.`,
      },
      {
        idSuffix: '4',
        label: `Reversed Sequence: ${opB} → ${opA}`,
        role: 'order_test' as const,
        ops: [opB, opA],
        order: [opB, opA],
        desc: `Executes ${opB} first, then routes transformed topology into ${opA} (checks reverse path-dependency).`,
        prompt: `[SEQUENCE: ${opB} THEN ${opA}] [ANCHORS: ${lockedAnchors.join(', ')}] ${concept}. First apply ${opB} to structural coordinates, subsequently apply ${opA} to resulting boundary surfaces.`,
      },
      {
        idSuffix: '5',
        label: `Compound Superposition: ${opA} + ${opB}`,
        role: 'interaction' as const,
        ops: [opA, opB],
        order: ['simultaneous'],
        desc: `Simultaneous superposition of both operators to detect synergistic interaction effects.`,
        prompt: `[SUPERPOSITION: ${opA} + ${opB}] [ANCHORS: ${lockedAnchors.join(', ')}] ${concept}. Simultaneous dual vector pressure across both internal and external boundaries.`,
      },
    ];

    interactionConfigs.slice(0, variantCount).forEach((cfg, idx) => {
      experimentalVariants.push({
        id: `${experimentId}-VAR-${idx + 1}`,
        label: cfg.label,
        role: cfg.role,
        isControl: false,
        operators: cfg.ops,
        operatorOrder: cfg.order,
        operatorStrengths: { [opA]: 0.8, [opB]: 0.8 },
        mutationIntensity: entropyLevel,
        anchorPreservation: 'hard',
        targetMedium,
        targetEngine,
        modelProfile,
        description: cfg.desc,
        promptText: cfg.prompt,
        taggedArtifacts: [],
      });
    });
  } else if (expType === 'anchor_ablation') {
    // Anchor & constraint ablation variants
    const ablationConfigs = [
      {
        label: `Hard Anchored Mutation (${lockedAnchors[0] || 'Subject'} Locked)`,
        preservation: 'hard' as const,
        prompt: `[HARD_LOCK: ${lockedAnchors.join(', ')}] [MUTATION: ${opA} + ${opB}] ${concept}. Anchor geometries must remain strictly recognizable while surroundings mutate.`,
      },
      {
        label: `Soft Anchored Mutation (Permeable Boundaries)`,
        preservation: 'soft' as const,
        prompt: `[SOFT_LOCK: ${lockedAnchors.join(', ')}] [MUTATION: ${opA} + ${opB}] ${concept}. Anchor identity preserved in essence only; boundaries permitted to bleed into environment.`,
      },
      {
        label: `Total Anchor Ablation (Zero Identity Preservation)`,
        preservation: 'none' as const,
        prompt: `[ABLATION: NO ANCHORS] [MUTATION: ${opA} + ${opB}] ${concept}. No identity coordinates preserved; complete topological emancipation.`,
      },
      {
        label: `Orthogonal Inversion (Anchor Mutated, Context Locked)`,
        preservation: 'hard' as const,
        prompt: `[INVERTED_LOCK: background strictly static] [HYPER_MUTATION on ${lockedAnchors.join(', ')}] ${concept}. Environment remains photographic reality while subject undergoes recursive disintegration.`,
      },
    ];

    ablationConfigs.slice(0, variantCount).forEach((cfg, idx) => {
      experimentalVariants.push({
        id: `${experimentId}-VAR-${idx + 1}`,
        label: cfg.label,
        role: cfg.preservation === 'none' ? 'ablation' : 'experimental',
        isControl: false,
        operators: [opA, opB],
        operatorOrder: [opA, opB],
        operatorStrengths: { [opA]: 0.75, [opB]: 0.75 },
        mutationIntensity: entropyLevel,
        anchorPreservation: cfg.preservation,
        targetMedium,
        targetEngine,
        modelProfile,
        description: `Tests boundary stability under ${cfg.preservation} anchor constraint.`,
        promptText: cfg.prompt,
        taggedArtifacts: [],
      });
    });
  } else {
    // Generic bounded experimental family
    for (let i = 0; i < variantCount; i++) {
      const stepIntensity = Math.min(10, Math.max(3, entropyLevel - 2 + i * 2));
      experimentalVariants.push({
        id: `${experimentId}-VAR-${i + 1}`,
        label: `Variant ${i + 1} (Intensity ${stepIntensity})`,
        role: 'experimental',
        isControl: false,
        operators: activeOps,
        operatorOrder: activeOps,
        operatorStrengths: { [opA]: stepIntensity / 10 },
        mutationIntensity: stepIntensity,
        anchorPreservation: 'hard',
        targetMedium,
        targetEngine,
        modelProfile,
        description: `Experimental iteration #${i + 1} with calibrated parameter delta.`,
        promptText: `[EXPERIMENTAL_TITRATION: intensity=${stepIntensity}] [OPERATORS: ${activeOps.join(' → ')}] [ANCHOR: ${lockedAnchors.join(', ')}] ${concept}.`,
        taggedArtifacts: [],
      });
    }
  }

  const record: ExperimentRecord = {
    id: experimentId,
    timestamp,
    title: `${expType.toUpperCase().replace(/_/g, ' ')}: ${opA} ${opB ? `+ ${opB}` : ''} (${targetMedium})`,
    sourceIntent: concept,
    targetMedium,
    targetEngine,
    targetModelProfile: modelProfile,
    experimentType: expType,
    hypothesis,
    variablesChanged: expType === 'dose_sweep'
      ? [`Strength titration of ${opA}`]
      : expType === 'operator_interaction'
      ? ['Operator isolation vs sequence ordering vs superposition']
      : ['Anchor constraint permeability'],
    variablesHeldConstant: ['Source concept intent', 'Target engine and model profile', 'Anchor identity coordinates'],
    operators: activeOps,
    operatorOrder: activeOps,
    strengths: { [opA]: 0.8, [opB]: 0.8 },
    iterationSettings: {
      depth: 1,
      feedbackReconditioning: false,
    },
    controlVariant,
    experimentalVariants,
    interestingArtifacts: [],
    creativeValue: 'interesting',
    mechanismConfidence: 'speculative',
  };

  saveExperimentRecord(record);
  return record;
}

// ==========================================
// 3. STORAGE & RECORD PERSISTENCE
// ==========================================

export function saveExperimentRecord(record: ExperimentRecord): void {
  try {
    const existing = loadExperimentRecords();
    existing[record.id] = record;
    // Cap in-memory history to last 50 experiments (Cost & runaway protection)
    const keys = Object.keys(existing);
    if (keys.length > 50) {
      const oldestKey = keys.sort((a, b) => (existing[a].timestamp > existing[b].timestamp ? 1 : -1))[0];
      delete existing[oldestKey];
    }
    safeSetItem(EXPERIMENT_RECORDS_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('[DiscoveryEngine] Failed to save experiment record:', err);
  }
}

export function loadExperimentRecords(): Record<string, ExperimentRecord> {
  try {
    const raw = safeGetItem(EXPERIMENT_RECORDS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('[DiscoveryEngine] Failed to load experiment records:', err);
  }
  return {};
}

export function getExperimentRecord(id: string): ExperimentRecord | null {
  const records = loadExperimentRecords();
  return records[id] || null;
}

// ==========================================
// 4. USER FEEDBACK & SCIENTIFIC OBSERVATION (SECTION 8, 11)
// ==========================================

export function evaluateVariantResult(params: {
  experimentId: string;
  variantId: string;
  userRating: DiscoveryUserRating;
  taggedArtifacts: ObservableArtifactTag[];
  customObservations?: string;
  creativeValue?: CreativeValueTier;
  mechanismConfidence?: MechanismConfidenceTier;
}): ExperimentRecord | null {
  const record = getExperimentRecord(params.experimentId);
  if (!record) return null;

  // Find target variant (check experimental or control)
  let targetVariant: DiscoveryVariant | undefined;
  if (record.controlVariant.id === params.variantId) {
    targetVariant = record.controlVariant;
  } else {
    targetVariant = record.experimentalVariants.find((v) => v.id === params.variantId);
  }

  if (targetVariant) {
    targetVariant.userRating = params.userRating;
    targetVariant.taggedArtifacts = params.taggedArtifacts;
    targetVariant.customObservations = params.customObservations;
    targetVariant.evaluatedAt = new Date().toISOString();
  }

  // Aggregate artifacts to parent record
  params.taggedArtifacts.forEach((tag) => {
    if (!record.interestingArtifacts.includes(tag)) {
      record.interestingArtifacts.push(tag);
    }
  });

  // Check for path-dependency and interaction findings (Section 6)
  if (record.experimentType === 'operator_interaction') {
    const var1 = record.experimentalVariants.find((v) => v.label.includes('A Alone'));
    const var2 = record.experimentalVariants.find((v) => v.label.includes('B Alone'));
    const varForward = record.experimentalVariants.find((v) => v.label.includes('A → B'));
    const varReversed = record.experimentalVariants.find((v) => v.label.includes('B → A'));
    const varCompound = record.experimentalVariants.find((v) => v.label.includes('A + B'));

    // Check path dependency: if forward and reverse have different user ratings or artifact tags
    if (varForward?.userRating && varReversed?.userRating) {
      if (varForward.userRating !== varReversed.userRating ||
          JSON.stringify(varForward.taggedArtifacts) !== JSON.stringify(varReversed.taggedArtifacts)) {
        record.pathDependencyDetected = true;
      }
    }

    // Check interaction effect: if compound produces an artifact absent in solo runs
    if (varCompound && varCompound.taggedArtifacts.length > 0) {
      const soloTags = new Set([...(var1?.taggedArtifacts || []), ...(var2?.taggedArtifacts || [])]);
      const hasNovelArtifact = varCompound.taggedArtifacts.some((t) => !soloTags.has(t));
      if (hasNovelArtifact) {
        record.interactionEffectDetected = true;
      }
    }
  }

  // Decoupled evaluation update (Section 11)
  if (params.creativeValue) {
    record.creativeValue = params.creativeValue;
  } else if (params.userRating === 'JACKPOT') {
    record.creativeValue = 'jackpot';
  } else if (params.userRating === 'INTERESTING') {
    record.creativeValue = 'interesting';
  } else if (params.userRating === 'BORING') {
    record.creativeValue = 'boring';
  }

  if (params.mechanismConfidence) {
    record.mechanismConfidence = params.mechanismConfidence;
  }

  record.userRating = params.userRating;
  saveExperimentRecord(record);
  return record;
}

// ==========================================
// 5. DISCOVERY RECIPES & ARCHIVE (SECTIONS 8, 9, 14)
// ==========================================

export function saveDiscoveryRecipe(params: {
  experimentId: string;
  variantId?: string;
  name?: string;
  creativeValue?: CreativeValueTier;
  mechanismConfidence?: MechanismConfidenceTier;
}): DiscoveryRecipe | null {
  const exp = getExperimentRecord(params.experimentId);
  if (!exp) return null;

  const variant = params.variantId
    ? exp.experimentalVariants.find((v) => v.id === params.variantId) || exp.controlVariant
    : exp.experimentalVariants[0] || exp.controlVariant;

  const recipeId = `DISC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const now = new Date().toISOString();

  // Create descriptive procedural name
  const opsName = variant.operators.map((o) => o.replace(/_/g, ' ')).join(' + ') || 'Experimental Baseline';
  const autoName = params.name || `${opsName} • ${variant.targetMedium.toUpperCase()} Discovery`;

  // Procedural definition: NOT just prompt text (Section 9)
  const recipe: DiscoveryRecipe = {
    id: recipeId,
    name: autoName,
    sourceExperimentId: exp.id,
    targetMedium: variant.targetMedium,
    compatibleModelProfiles: [variant.modelProfile, 'cross-model'],
    mechanismHypothesis: exp.hypothesis.hypothesis,
    operatorChain: variant.operators,
    relativeStrengths: variant.operatorStrengths,
    ordering: variant.operatorOrder,
    iterationPattern: exp.iterationSettings.feedbackReconditioning
      ? 'iterative feedback reconditioning'
      : 'single-pass calibrated injection',
    importantInvariants: ['Anchor semantic integrity', 'Subject boundary preservation'],
    usefulFailureSurface: variant.taggedArtifacts.length > 0
      ? variant.taggedArtifacts
      : ['boundary leakage', 'hallucinated connective tissue'],
    amplificationMethod: [
      'Increase mutation intensity by +1.5',
      'Lock fine-grained material anchors before applying secondary operator',
    ],
    knownFailureCondition: [
      'Total subject loss if mutation intensity exceeds 9.0',
      'Homogenized smoothing if generic quality descriptors are present',
    ],
    confidence: params.mechanismConfidence || exp.mechanismConfidence || 'speculative',
    creativeValue: params.creativeValue || exp.creativeValue || 'interesting',
    timesObserved: 1,
    isSeedSensitive: false,
    promotedToOperator: false,
    tags: [variant.targetMedium, ...variant.operators, ...variant.taggedArtifacts],
    createdAt: now,
    updatedAt: now,
  };

  // Persist recipe to archive
  const existing = loadDiscoveryRecipes();
  existing[recipe.id] = recipe;
  safeSetItem(DISCOVERY_RECIPES_STORAGE_KEY, JSON.stringify(existing));

  // Link to experiment record
  exp.discoveredRecipeId = recipe.id;
  saveExperimentRecord(exp);

  return recipe;
}

export function loadDiscoveryRecipes(): Record<string, DiscoveryRecipe> {
  try {
    const raw = safeGetItem(DISCOVERY_RECIPES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('[DiscoveryEngine] Failed to load discovery recipes:', err);
  }

  // Pre-seed with curated starter discoveries if none exist
  const seeded = getCuratedDiscoveryRecipes();
  try {
    safeSetItem(DISCOVERY_RECIPES_STORAGE_KEY, JSON.stringify(seeded));
  } catch {}
  return seeded;
}

export function getDiscoveryRecipe(id: string): DiscoveryRecipe | null {
  const all = loadDiscoveryRecipes();
  return all[id] || null;
}

export function deleteDiscoveryRecipe(id: string): void {
  const all = loadDiscoveryRecipes();
  delete all[id];
  safeSetItem(DISCOVERY_RECIPES_STORAGE_KEY, JSON.stringify(all));
}

// ==========================================
// 6. REPRODUCTION TESTING (SECTION 12)
// ==========================================

export function buildReproductionTestFamily(recipeId: string): ExperimentRecord | null {
  const recipe = getDiscoveryRecipe(recipeId);
  if (!recipe) return null;

  const testExperimentId = `EXP-REPRO-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const controlVariant: DiscoveryVariant = {
    id: `${testExperimentId}-CTRL`,
    label: 'Control (Base Intent, Recipe Inactive)',
    role: 'control',
    isControl: true,
    operators: [],
    operatorOrder: [],
    operatorStrengths: {},
    mutationIntensity: 0,
    anchorPreservation: 'hard',
    targetMedium: recipe.targetMedium,
    targetEngine: 'openart',
    modelProfile: recipe.compatibleModelProfiles[0] || 'standard',
    description: `Baseline comparison preserving underlying concept without the experimental recipe.`,
    promptText: `[CONTROL: Base Reference Concept] Natural coherent generation with high identity stability.`,
    taggedArtifacts: [],
  };

  // 3 stochastic / seed-variation test runs using the EXACT procedural recipe
  const experimentalVariants: DiscoveryVariant[] = [1, 2, 3].map((seedIdx) => {
    return {
      id: `${testExperimentId}-REPRO-${seedIdx}`,
      label: `Reproduction Test #${seedIdx} (Stochastic Seed Perturbation)`,
      role: 'reproduction',
      isControl: false,
      operators: recipe.operatorChain,
      operatorOrder: recipe.ordering,
      operatorStrengths: recipe.relativeStrengths,
      mutationIntensity: 7,
      anchorPreservation: 'hard',
      targetMedium: recipe.targetMedium,
      targetEngine: 'openart',
      modelProfile: recipe.compatibleModelProfiles[0] || 'standard',
      description: `Tests whether artifact family (${recipe.usefulFailureSurface.join(', ')}) recurs under independent seed ${seedIdx}.`,
      promptText: `[PROCEDURAL_RECIPE: ${recipe.name}] [OPERATOR_CHAIN: ${recipe.ordering.join(' → ')}] Seed perturbation ${seedIdx}. Focus on generating ${recipe.usefulFailureSurface.join(', ')}.`,
      taggedArtifacts: [],
    };
  });

  const record: ExperimentRecord = {
    id: testExperimentId,
    timestamp: now,
    title: `REPRODUCTION TEST: ${recipe.name}`,
    sourceIntent: `Testing reproducibility of ${recipe.name}`,
    targetMedium: recipe.targetMedium,
    targetEngine: 'openart',
    targetModelProfile: recipe.compatibleModelProfiles[0] || 'standard',
    experimentType: 'custom_bounded',
    hypothesis: {
      hypothesis: `The artifact family [${recipe.usefulFailureSurface.join(', ')}] produced by ${recipe.operatorChain.join(' + ')} is procedurally reproducible rather than a singular seed accident.`,
      tension: `Inherent latent stochasticity vs deterministic procedural operators.`,
      control: `Non-mutated baseline reference run.`,
      ablation: `Random seed variations across identical parameter configurations.`,
      expectedFailure: `If fragile: failure to replicate across seeds (seed-sensitive). If robust: recurrence of ${recipe.usefulFailureSurface[0] || 'anomaly'}.`,
    },
    variablesChanged: ['Pseudo-random seed initialization'],
    variablesHeldConstant: ['Operator chain', 'Ordering', 'Relative strengths', 'Anchor constraints'],
    operators: recipe.operatorChain,
    operatorOrder: recipe.ordering,
    strengths: recipe.relativeStrengths,
    iterationSettings: { depth: 1, seedVariation: true },
    controlVariant,
    experimentalVariants,
    interestingArtifacts: [],
    creativeValue: recipe.creativeValue,
    mechanismConfidence: recipe.confidence,
    discoveredRecipeId: recipe.id,
  };

  saveExperimentRecord(record);
  return record;
}

export function confirmReproductionResult(params: {
  recipeId: string;
  reproduced: boolean;
  notes?: string;
}): DiscoveryRecipe | null {
  const recipe = getDiscoveryRecipe(params.recipeId);
  if (!recipe) return null;

  if (params.reproduced) {
    recipe.timesObserved += 1;
    // Step up mechanism confidence
    if (recipe.confidence === 'speculative') {
      recipe.confidence = 'plausible';
    } else if (recipe.confidence === 'plausible') {
      recipe.confidence = 'repeated';
    } else if (recipe.confidence === 'repeated') {
      recipe.confidence = 'strong';
    }
    recipe.isSeedSensitive = false;
  } else {
    recipe.isSeedSensitive = true;
    if (recipe.confidence === 'strong') {
      recipe.confidence = 'repeated';
    } else if (recipe.confidence === 'repeated') {
      recipe.confidence = 'plausible';
    }
  }

  recipe.updatedAt = new Date().toISOString();
  const all = loadDiscoveryRecipes();
  all[recipe.id] = recipe;
  safeSetItem(DISCOVERY_RECIPES_STORAGE_KEY, JSON.stringify(all));
  return recipe;
}

// ==========================================
// 7. MUTATE A DISCOVERY (SECTION 13)
// ==========================================

export type DiscoveryMutationDimension =
  | 'reverse_order'
  | 'titrate_strength'
  | 'substitute_operator'
  | 'transfer_modality'
  | 'increase_entropy';

export function mutateDiscoveryRecipe(params: {
  recipeId: string;
  dimension: DiscoveryMutationDimension;
  sourceConcept?: string;
}): ExperimentRecord | null {
  const recipe = getDiscoveryRecipe(params.recipeId);
  if (!recipe) return null;

  const expId = `EXP-MUT-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();
  const concept = params.sourceConcept || 'Obsidian monolithic structure in shifting tides';

  let mutatedOps = [...recipe.operatorChain];
  let mutatedOrder = [...recipe.ordering];
  let mutatedStrengths = { ...recipe.relativeStrengths };
  let mutatedMedium = recipe.targetMedium;
  let changedDesc = '';

  if (params.dimension === 'reverse_order') {
    mutatedOrder = [...mutatedOrder].reverse();
    changedDesc = `Reversed sequence order: ${mutatedOrder.join(' → ')}`;
  } else if (params.dimension === 'titrate_strength') {
    const firstOp = mutatedOps[0] || 'primary';
    mutatedStrengths[firstOp] = Number(((Number(mutatedStrengths[firstOp] || 0.7) * 1.35)).toFixed(2));
    changedDesc = `Elevated primary operator strength to ${mutatedStrengths[firstOp]}`;
  } else if (params.dimension === 'substitute_operator') {
    // Substitute secondary operator with sibling
    const alternatives = ['boundary_dislocation', 'non_euclidean_shear', 'chimeric_graft', 'essential_variable_decoupling'];
    const currentOp = mutatedOps[1] || mutatedOps[0];
    const newOp = alternatives.find((a) => a !== currentOp) || 'orthogonal_stabilizer';
    if (mutatedOps.length > 1) {
      mutatedOps[1] = newOp;
    } else {
      mutatedOps.push(newOp);
    }
    mutatedOrder = [...mutatedOps];
    changedDesc = `Substituted secondary operator with ${newOp}`;
  } else if (params.dimension === 'transfer_modality') {
    if (mutatedMedium === 'image') mutatedMedium = 'video';
    else if (mutatedMedium === 'video') mutatedMedium = 'audio';
    else mutatedMedium = 'image';
    changedDesc = `Cross-modality transfer: ${recipe.targetMedium} → ${mutatedMedium}`;
  } else {
    changedDesc = 'Increased entropy titration boundary';
  }

  const controlVariant: DiscoveryVariant = {
    id: `${expId}-CTRL`,
    label: `Parent Recipe Baseline (${recipe.name})`,
    role: 'control',
    isControl: true,
    operators: recipe.operatorChain,
    operatorOrder: recipe.ordering,
    operatorStrengths: recipe.relativeStrengths,
    mutationIntensity: 7,
    anchorPreservation: 'hard',
    targetMedium: recipe.targetMedium,
    targetEngine: 'openart',
    modelProfile: recipe.compatibleModelProfiles[0] || 'standard',
    description: `Baseline executing the un-mutated parent recipe.`,
    promptText: `[PARENT_RECIPE: ${recipe.name}] [OPERATORS: ${recipe.ordering.join(' → ')}] ${concept}.`,
    taggedArtifacts: [],
  };

  const experimentalVariants: DiscoveryVariant[] = [
    {
      id: `${expId}-MUT-1`,
      label: `Mutated Variant (${changedDesc})`,
      role: 'experimental',
      isControl: false,
      operators: mutatedOps,
      operatorOrder: mutatedOrder,
      operatorStrengths: mutatedStrengths,
      mutationIntensity: 8,
      anchorPreservation: 'hard',
      targetMedium: mutatedMedium,
      targetEngine: 'openart',
      modelProfile: recipe.compatibleModelProfiles[0] || 'standard',
      description: `Evolutionary branch of ${recipe.name} modifying exactly one experimental dimension: ${changedDesc}.`,
      promptText: `[MUTATED_BRANCH: ${changedDesc}] [OPERATORS: ${mutatedOrder.join(' → ')}] ${concept}. Controlled evolutionary divergence from parent recipe ${recipe.id}.`,
      taggedArtifacts: [],
    },
    {
      id: `${expId}-MUT-2`,
      label: `Ablation Contrast (Zero-Anchor Mutation)`,
      role: 'ablation',
      isControl: false,
      operators: mutatedOps,
      operatorOrder: mutatedOrder,
      operatorStrengths: mutatedStrengths,
      mutationIntensity: 9,
      anchorPreservation: 'none',
      targetMedium: mutatedMedium,
      targetEngine: 'openart',
      modelProfile: recipe.compatibleModelProfiles[0] || 'standard',
      description: `Ablates anchor locks to verify whether the mutated branch collapses completely without anchor constraints.`,
      promptText: `[ABLATED_MUTATION: ${changedDesc}] [NO_ANCHORS] ${concept}. Unrestricted topological deformation.`,
      taggedArtifacts: [],
    },
  ];

  const record: ExperimentRecord = {
    id: expId,
    timestamp: now,
    title: `MUTATION BRANCH: ${recipe.name} (${params.dimension})`,
    sourceIntent: concept,
    targetMedium: mutatedMedium,
    targetEngine: 'openart',
    targetModelProfile: recipe.compatibleModelProfiles[0] || 'standard',
    experimentType: 'custom_bounded',
    hypothesis: {
      hypothesis: `Modifying ${params.dimension} will preserve the core ${recipe.usefulFailureSurface[0] || 'anomaly'} artifact while shifting its spatial/temporal boundary characteristics.`,
      tension: `Procedural inheritance from parent recipe vs evolutionary divergence.`,
      control: `Parent recipe running with identical prompt intent.`,
      ablation: `Anchor ablation variant to determine structural dependence.`,
      expectedFailure: `Branch may either refine the artifact into a sharper hybrid or trigger collapse into noise.`,
    },
    variablesChanged: [changedDesc],
    variablesHeldConstant: ['Core procedural logic', 'Source intent', 'Preservation goals'],
    operators: mutatedOps,
    operatorOrder: mutatedOrder,
    strengths: mutatedStrengths,
    iterationSettings: { depth: 2 },
    controlVariant,
    experimentalVariants,
    interestingArtifacts: [],
    creativeValue: recipe.creativeValue,
    mechanismConfidence: 'speculative',
    discoveredRecipeId: recipe.id,
  };

  saveExperimentRecord(record);
  return record;
}

// ==========================================
// 8. PROMOTE TO OPERATOR (SECTION 10)
// ==========================================

export function promoteDiscoveryToOperator(recipeId: string): PromotedOperator | null {
  const recipe = getDiscoveryRecipe(recipeId);
  if (!recipe) return null;

  const opId = `user_op_${recipe.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const now = new Date().toISOString();

  const promoted: PromotedOperator = {
    id: opId,
    name: recipe.name,
    origin: 'EXPERIMENTAL / USER-DISCOVERED',
    recipeId: recipe.id,
    family: 'USER-DISCOVERED EXPERIMENTAL',
    shortDescription: `Empirically discovered operator procedure chaining ${recipe.operatorChain.join(' → ')}. Useful for inducing ${recipe.usefulFailureSurface.join(', ')}.`,
    mechanismHypothesis: recipe.mechanismHypothesis,
    targetMedium: recipe.targetMedium,
    expectedFailureSurface: recipe.usefulFailureSurface,
    amplificationMethod: recipe.amplificationMethod,
    knownFailureCondition: recipe.knownFailureCondition,
    confidence: recipe.confidence,
    operators: recipe.operatorChain,
    suggestedPromptTemplate: `[USER_OPERATOR: ${recipe.name}] Apply sequence [${recipe.ordering.join(' → ')}] targeting boundary failure surface.`,
    createdAt: now,
  };

  // Persist promoted operator
  const allPromoted = loadPromotedOperators();
  allPromoted[promoted.id] = promoted;
  safeSetItem(PROMOTED_OPERATORS_STORAGE_KEY, JSON.stringify(allPromoted));

  // Mark recipe as promoted
  recipe.promotedToOperator = true;
  recipe.promotedOperatorId = promoted.id;
  recipe.updatedAt = now;
  const allRecipes = loadDiscoveryRecipes();
  allRecipes[recipe.id] = recipe;
  safeSetItem(DISCOVERY_RECIPES_STORAGE_KEY, JSON.stringify(allRecipes));

  return promoted;
}

export function loadPromotedOperators(): Record<string, PromotedOperator> {
  try {
    const raw = safeGetItem(PROMOTED_OPERATORS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('[DiscoveryEngine] Failed to load promoted operators:', err);
  }
  return {};
}

export function deletePromotedOperator(id: string): void {
  const all = loadPromotedOperators();
  delete all[id];
  safeSetItem(PROMOTED_OPERATORS_STORAGE_KEY, JSON.stringify(all));
}

// Convert promoted operator to FailureOperator format so it can be dynamically injected into DAVID's library
export function convertPromotedToFailureOperator(promoted: PromotedOperator): FailureOperator {
  return {
    id: promoted.id,
    name: promoted.name,
    family: 'EXPERIMENTAL / USER-DISCOVERED',
    shortDescription: promoted.shortDescription,
    assumptionsAttacked: [`Established conventions of ${promoted.targetMedium} generation.`],
    mechanism: promoted.mechanismHypothesis,
    structuralConsequences: `Induces reproducible ${promoted.expectedFailureSurface.join(', ')} while maintaining controlled anchor integrity.`,
    mediaTranslations: {
      image: `Executes chained sequence ${promoted.operators.join(' → ')} to induce structural leakage.`,
      video: `Temporal translation of ${promoted.name}: applies sequential phase lag across keyframes.`,
      audio: `Timbral translation: drives harmonic superposition across acoustic boundaries.`,
    },
    likelyArtifacts: promoted.expectedFailureSurface,
    easySolutionsToBlock: ['generic smoothing filters', 'lazy collage blending'],
    intensityRange: [4, 9],
    tags: ['experimental', 'user-discovered', promoted.targetMedium],
    domains: ['empirical_discovery', promoted.targetMedium],
  };
}

// Helper to get all failure operators including user-promoted discoveries
export function getAllAvailableOperators(): FailureOperator[] {
  const promotedMap = loadPromotedOperators();
  const promotedList = Object.values(promotedMap).map(convertPromotedToFailureOperator);
  return [...FAILURE_OPERATORS, ...promotedList];
}

// ==========================================
// 9. CURATED STARTER DISCOVERIES
// ==========================================

function getCuratedDiscoveryRecipes(): Record<string, DiscoveryRecipe> {
  return {
    'disc_chitin_lattice': {
      id: 'disc_chitin_lattice',
      name: 'Chitinous Lattice Seam',
      sourceExperimentId: 'EXP-SEED-01',
      targetMedium: 'image',
      compatibleModelProfiles: ['Flux.1 Dev', 'OpenArt SDXL', 'Midjourney v6'],
      mechanismHypothesis:
        'Competing topological tension between rigid mineral shells and fluid organic cores forces the latent generator to synthesize fine webbed connective tissue along boundary seams.',
      operatorChain: ['scale_schism', 'recursive_reversal'],
      relativeStrengths: { scale_schism: 0.85, recursive_reversal: 0.65 },
      ordering: ['scale_schism', 'recursive_reversal'],
      iterationPattern: 'single-pass calibrated injection',
      importantInvariants: ['Anchor exoskeleton rigidity', 'Core identity recognized'],
      usefulFailureSurface: ['hallucinated connective tissue', 'boundary leakage', 'unexpected stable hybrid'],
      amplificationMethod: [
        'Bind with vitreous or crystalline material anchor',
        'Direct light refractions specifically through boundary cracks',
      ],
      knownFailureCondition: [
        'Collapses into chaotic static if entropy exceeds 9.0 without hard anchor lock',
      ],
      confidence: 'repeated',
      creativeValue: 'jackpot',
      timesObserved: 3,
      isSeedSensitive: false,
      promotedToOperator: false,
      tags: ['image', 'topology', 'connective-tissue', 'flux'],
      createdAt: '2026-09-01T12:00:00.000Z',
      updatedAt: '2026-09-01T12:00:00.000Z',
    },
    'disc_temporal_strobe': {
      id: 'disc_temporal_strobe',
      name: 'Temporal Strobe Drift',
      sourceExperimentId: 'EXP-SEED-02',
      targetMedium: 'video',
      compatibleModelProfiles: ['Runway Gen-3', 'Luma Dream Machine'],
      mechanismHypothesis:
        'Contradictory velocity cues across successive motion descriptions cause the video diffusion frame attention to blend multiple temporal states into single frames.',
      operatorChain: ['temporal_contradiction', 'essential_variable_decoupling'],
      relativeStrengths: { temporal_contradiction: 0.9, essential_variable_decoupling: 0.6 },
      ordering: ['temporal_contradiction', 'essential_variable_decoupling'],
      iterationPattern: 'frame sequence modulation',
      importantInvariants: ['Subject facial coordinates', 'Camera vector'],
      usefulFailureSurface: ['temporal smearing', 'motion reassignment', 'object permanence failure'],
      amplificationMethod: [
        'Contradict direction of movement between subject and background particles',
      ],
      knownFailureCondition: [
        'Completely disappears if static camera locks are applied',
      ],
      confidence: 'plausible',
      creativeValue: 'interesting',
      timesObserved: 2,
      isSeedSensitive: false,
      promotedToOperator: false,
      tags: ['video', 'temporal', 'motion'],
      createdAt: '2026-09-02T15:30:00.000Z',
      updatedAt: '2026-09-02T15:30:00.000Z',
    },
  };
}
