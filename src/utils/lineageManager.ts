import {
  EvolutionTrait,
  LineageMutationEvent,
  LineageScar,
  MutationRecipe,
  PromptGeneration,
  SynthesisHistoryItem,
  WeightedSelection,
} from '../types';
import { ARHETYPAL_TRAITS, createEvolutionTrait, deriveTraitsFromGenotype } from './traitLibrary';
import { formatLineageSummary } from './lineageSerializer';
import { detectAnchors } from './conceptDismemberment';

export const MAX_ACTIVE_TRAITS = 6;
export const MAX_DORMANT_TRAITS = 8;
export const MAX_SCARS = 4;
export const MAX_MUTATION_EVENTS = 6;

export interface EvolveOptions {
  entropyLevel: number;
  activeOperators?: string[];
  activeAttractors?: string[];
  preservedAnchors?: string[];
  newConceptInput?: string;
  deterministicSeed?: number | string;
}

/**
 * Creates an initial Generation 1 PromptGeneration object from scratch.
 */
export function createInitialGeneration(
  concept: string,
  recipe?: MutationRecipe,
  renderedPrompt?: string
): PromptGeneration {
  const detectedAnchors = recipe?.preservedAnchors && recipe.preservedAnchors.length > 0
    ? recipe.preservedAnchors
    : detectAnchors(concept).anchors;

  const activeOpIds = recipe?.operators?.map((o) => o.id) || [];
  const activeAtIds = recipe?.attractors?.map((a) => a.id) || [];

  const initialTraits = deriveTraitsFromGenotype(activeOpIds, activeAtIds, 1);

  const gen: PromptGeneration = {
    generationId: `gen-1-${Math.random().toString(36).substring(2, 8)}`,
    generationNumber: 1,
    timestamp: Date.now(),
    parentGenerationIds: [],
    sourceConcept: concept,
    renderedPrompt: (renderedPrompt || concept).slice(0, 1000),
    mutationRecipeSnapshot: recipe,
    inheritedTraits: [],
    acquiredTraits: initialTraits.slice(0, MAX_ACTIVE_TRAITS),
    lostTraits: [],
    dormantTraits: [],
    scars: [],
    preservedAnchors: detectedAnchors,
    mutationEvents: [
      {
        type: 'drift',
        description: `Genesis generation initialized with ${initialTraits.length} foundational traits`,
        originGen: 1,
      },
    ],
    lineageSummary: '',
  };

  gen.lineageSummary = formatLineageSummary(gen);
  return gen;
}

/**
 * Converts a legacy synthesis history item into a valid PromptGeneration.
 * Ensures backward compatibility with past history records.
 */
export function createLineageFromLegacyItem(item: SynthesisHistoryItem): PromptGeneration {
  const genNum = (item.generationIndex ?? 0) + 1;
  const recipe = item.result?.mutationRecipe;
  const concept = item.concept || 'Legacy Concept';
  const slopPrompt = item.result?.slop?.prompt || concept;

  const anchors =
    recipe?.preservedAnchors && recipe.preservedAnchors.length > 0
      ? recipe.preservedAnchors
      : detectAnchors(concept).anchors;

  const activeOpIds = recipe?.operators?.map((o) => o.id) || [];
  const activeAtIds = recipe?.attractors?.map((a) => a.id) || [];

  const derivedTraits = deriveTraitsFromGenotype(activeOpIds, activeAtIds, genNum);

  const gen: PromptGeneration = {
    generationId: item.id || `legacy-${Math.random().toString(36).substring(2, 8)}`,
    generationNumber: genNum,
    timestamp: item.timestamp || Date.now(),
    parentGenerationIds: genNum > 1 ? [`gen-${genNum - 1}`] : [],
    sourceConcept: concept,
    renderedPrompt: slopPrompt.slice(0, 1000),
    mutationRecipeSnapshot: recipe,
    inheritedTraits: derivedTraits.slice(0, 3),
    acquiredTraits: derivedTraits.slice(3, MAX_ACTIVE_TRAITS),
    lostTraits: [],
    dormantTraits: [],
    scars: [],
    preservedAnchors: anchors,
    mutationEvents: [
      {
        type: 'drift',
        description: `Constructed from legacy session state (Gen #${genNum})`,
        originGen: genNum,
      },
    ],
    lineageSummary: '',
  };

  gen.lineageSummary = formatLineageSummary(gen);
  return gen;
}

/**
 * Executes controlled misremembering on a single non-anchor trait.
 * Shifts the governing rule slightly in semantic space without random gibberish.
 */
export function misrememberTrait(
  trait: EvolutionTrait,
  randomVal: number
): { alteredTrait: EvolutionTrait; event: LineageMutationEvent } {
  // Alterations targeting structural governing rules rather than mere adjectives
  const shifts: Record<string, string[]> = {
    distrust_inside_outside: [
      'Boundaries between spaces operate as porous pressure gates rather than static barriers.',
      'Exterior atmospheric qualities bleed selectively into inner cavities based on illumination.',
    ],
    identity_as_temporal_residue: [
      'Identity is governed by interference between previous frame coordinates and future positions.',
      'The subject leaves an acoustic and morphological shell behind with every movement.',
    ],
    distributed_body_control: [
      'Bodily symmetry is governed by four repeating regional branches rather than central bilateral axis.',
      'Limbs and extensions act as independent sensory colonies reacting to local temperature gradients.',
    ],
    color_behaves_as_pressure: [
      'Chrominance gradients directly determine fluid flow velocity and material density.',
      'Deep blues freeze adjacent volume; high-intensity vermilion causes expansion and shear.',
    ],
    symmetry_aversion: [
      'Chiral orientation continuously reverses whenever observed from an oblique perspective.',
      'Symmetry is rejected in favor of golden-ratio spiral branching with progressive defect accumulation.',
    ],
    anatomy_as_phase_boundary: [
      'The outer surface alternates between high-viscosity glass and boiling vapor depending on motion.',
      'Tissue behaves as a non-Newtonian fluid that solidifies upon impact or camera focus.',
    ],
    repetition_causes_structural_decay: [
      'Harmonic echoes amplify resonant frequencies until the enclosing geometry shears and breaks.',
      'Each recursion strips high-frequency detail, leaving only raw geometric primitives.',
    ],
    signal_loss_affects_spatial_continuity: [
      'Torn coordinates re-stitch into adjacent topological surfaces with inverted normals.',
      'Transmission dropouts convert 3D volumes into flat 2D projection planes.',
    ],
  };

  const candidateShifts = shifts[trait.id] || [
    `Shifted constraint: ${trait.directive} [altered by ancestral semantic drift]`,
  ];
  const chosenShift = candidateShifts[Math.floor(randomVal * candidateShifts.length)];

  const alteredTrait: EvolutionTrait = {
    ...trait,
    directive: chosenShift,
    strength: Math.min(1.0, trait.strength * 1.1),
    status: 'active',
  };

  const event: LineageMutationEvent = {
    type: 'misremember',
    description: `Misremembered "${trait.label}": governing rule mutated to "${chosenShift.slice(0, 60)}..."`,
    originGen: trait.originGen,
    targetId: trait.id,
  };

  return { alteredTrait, event };
}

/**
 * Checks for potential reversion of a dormant or extinct trait.
 */
export function checkReversion(
  dormantTraits: EvolutionTrait[],
  entropy: number,
  randomVal: number
): { revivedTrait?: EvolutionTrait; event?: LineageMutationEvent } {
  if (dormantTraits.length === 0) return {};

  // Reversion probability scales with entropy
  // Entropy 1-4: ~5% | Entropy 5-6: ~20% | Entropy 7-8: ~45% | Entropy 9-10: ~65%
  const reversionThreshold = entropy < 5 ? 0.05 : entropy < 7 ? 0.2 : entropy < 9 ? 0.45 : 0.65;

  if (randomVal > reversionThreshold) return {};

  // Pick one dormant trait to reactivate
  const targetIndex = Math.floor(randomVal * dormantTraits.length) % dormantTraits.length;
  const dormant = dormantTraits[targetIndex];

  const revivedTrait: EvolutionTrait = {
    ...dormant,
    status: 'active',
    strength: 0.7, // Revived at partial strength
    persistence: 0.75,
  };

  const event: LineageMutationEvent = {
    type: 'reversion',
    description: `Ancestral trait "${dormant.label}" reactivated from dormancy (original Origin Gen #${dormant.originGen})`,
    originGen: dormant.originGen,
    targetId: dormant.id,
  };

  return { revivedTrait, event };
}

/**
 * Evaluates whether a consequential scar should be formed in this generation.
 */
export function evaluateScars(
  generationNumber: number,
  activeOperators: string[],
  activeAttractors: string[],
  entropyLevel: number,
  activeTraits: EvolutionTrait[],
  randomVal: number
): LineageScar | null {
  // Scars are consequential, not created every generation.
  // Eligible if high entropy (>= 6) and specific structural conditions occur.
  if (entropyLevel < 5 && randomVal > 0.15) return null;

  if (activeOperators.includes('ontology_swap') && activeTraits.some((t) => t.id === 'distrust_inside_outside')) {
    return {
      id: `scar_inside_outside_collapse_g${generationNumber}`,
      label: 'Inside/Outside Indistinguishable',
      description: `Interior and exterior collapsed into a continuous phase during Gen #${generationNumber}. Lineage retains permanent distrust of enclosure.`,
      originGen: generationNumber,
      strength: 0.9,
      persistence: 0.85,
      status: 'active',
    };
  }

  if (activeAttractors.includes('crystalline') && entropyLevel >= 6) {
    return {
      id: `scar_brittle_lattice_g${generationNumber}`,
      label: 'Lattice Faceting Memory',
      description: `Surfaces underwent irreversible facet cleavage during Gen #${generationNumber}. Lineage retains sharp boundary fracture tendencies.`,
      originGen: generationNumber,
      strength: 0.85,
      persistence: 0.8,
      status: 'active',
    };
  }

  if (activeOperators.includes('scale_schism') || entropyLevel >= 8) {
    return {
      id: `scar_scale_coexistence_g${generationNumber}`,
      label: 'Scale Invariance Collapse',
      description: `Optical focal planes merged micro and macro structures into a single field during Gen #${generationNumber}.`,
      originGen: generationNumber,
      strength: 0.8,
      persistence: 0.75,
      status: 'active',
    };
  }

  if (randomVal < 0.25 && activeTraits.length > 0) {
    const trait = activeTraits[0];
    return {
      id: `scar_${trait.id}_g${generationNumber}`,
      label: `Deep Memory: ${trait.label}`,
      description: `Lineage retains persistent structural bias toward ${trait.label.toLowerCase()} inherited from Gen #${generationNumber}.`,
      originGen: generationNumber,
      strength: 0.8,
      persistence: 0.7,
      status: 'active',
    };
  }

  return null;
}

/**
 * Crossbreeds two parent generations into a unified child generation.
 * Operates on GENOTYPE metadata (traits, scars, anchors, attractors, operators).
 * Never simply concatenates both prompts!
 */
export function crossbreedGenerations(
  parentA: PromptGeneration,
  parentB: PromptGeneration,
  options: EvolveOptions
): PromptGeneration {
  const genNum = Math.max(parentA.generationNumber, parentB.generationNumber) + 1;
  const events: LineageMutationEvent[] = [];

  events.push({
    type: 'crossbreed',
    description: `Crossbred Gen #${parentA.generationNumber} (${parentA.generationId}) with Gen #${parentB.generationNumber} (${parentB.generationId})`,
    originGen: genNum,
  });

  // 1. Anchors: union of both parents
  const anchorSet = new Set<string>();
  for (const a of parentA.preservedAnchors) anchorSet.add(a);
  for (const b of parentB.preservedAnchors) anchorSet.add(b);
  if (options.preservedAnchors) {
    for (const a of options.preservedAnchors) anchorSet.add(a);
  }
  const preservedAnchors = Array.from(anchorSet);

  // 2. Traits: blend from both parents with dominant/recessive weighting
  const traitMap = new Map<string, EvolutionTrait>();

  // Add Parent A traits (dominant)
  for (const t of parentA.inheritedTraits.concat(parentA.acquiredTraits)) {
    if (t.status === 'active') {
      traitMap.set(t.id, { ...t, strength: t.strength * 0.95 });
    }
  }

  // Add Parent B traits (recessive or complementary)
  for (const t of parentB.inheritedTraits.concat(parentB.acquiredTraits)) {
    if (t.status === 'active') {
      if (traitMap.has(t.id)) {
        // Reinforce existing trait
        const existing = traitMap.get(t.id)!;
        existing.strength = Math.min(1.0, existing.strength + 0.2);
        existing.persistence = Math.min(1.0, existing.persistence + 0.15);
      } else if (traitMap.size < MAX_ACTIVE_TRAITS) {
        // Adopt new trait from parent B
        traitMap.set(t.id, { ...t, strength: t.strength * 0.85 });
      }
    }
  }

  // 3. Scars: combine unique scars up to MAX_SCARS
  const scarMap = new Map<string, LineageScar>();
  for (const s of parentA.scars) {
    if (s.status === 'active') scarMap.set(s.id, { ...s, strength: s.strength * 0.9 });
  }
  for (const s of parentB.scars) {
    if (s.status === 'active' && scarMap.size < MAX_SCARS) {
      if (!scarMap.has(s.id)) {
        scarMap.set(s.id, { ...s, strength: s.strength * 0.85 });
      }
    }
  }

  // 4. Dormant traits: collect from both parents
  const dormantMap = new Map<string, EvolutionTrait>();
  for (const d of parentA.dormantTraits.concat(parentB.dormantTraits)) {
    if (!traitMap.has(d.id) && dormantMap.size < MAX_DORMANT_TRAITS) {
      dormantMap.set(d.id, d);
    }
  }

  const inheritedTraits = Array.from(traitMap.values()).slice(0, MAX_ACTIVE_TRAITS);
  const scars = Array.from(scarMap.values()).slice(0, MAX_SCARS);
  const dormantTraits = Array.from(dormantMap.values()).slice(0, MAX_DORMANT_TRAITS);

  const childGen: PromptGeneration = {
    generationId: `gen-${genNum}-cb-${Math.random().toString(36).substring(2, 8)}`,
    generationNumber: genNum,
    timestamp: Date.now(),
    parentGenerationIds: [parentA.generationId, parentB.generationId],
    sourceConcept: options.newConceptInput || `Crossbreed: Gen #${parentA.generationNumber} x Gen #${parentB.generationNumber}`,
    renderedPrompt: `Crossbred lineage from Gen #${parentA.generationNumber} and Gen #${parentB.generationNumber}`,
    inheritedTraits,
    acquiredTraits: [],
    lostTraits: [],
    dormantTraits,
    scars,
    preservedAnchors,
    mutationEvents: events,
    lineageSummary: '',
  };

  childGen.lineageSummary = formatLineageSummary(childGen);
  return childGen;
}

/**
 * Evolves a parent PromptGeneration into the next Ouroboros generation.
 * Handles the complete evolutionary flow:
 * 1. Inherit active parent traits
 * 2. Decay / Dormancy check
 * 3. Optional Reversion check
 * 4. Optional Misremember check
 * 5. Acquire new traits from active genotype
 * 6. Scars evaluation and inheritance
 * 7. Invariant Anchor preservation
 */
export function evolveNextGeneration(
  parentA: PromptGeneration,
  parentB?: PromptGeneration,
  options: EvolveOptions = { entropyLevel: 5 }
): PromptGeneration {
  if (parentB) {
    return crossbreedGenerations(parentA, parentB, options);
  }

  const genNum = parentA.generationNumber + 1;
  const entropy = Math.max(1, Math.min(10, options.entropyLevel));
  const rngSeed = options.deterministicSeed ? String(options.deterministicSeed) : Math.random().toString();
  let pseudoRand = 0.5;
  try {
    let hash = 0;
    for (let i = 0; i < rngSeed.length; i++) {
      hash = (hash << 5) - hash + rngSeed.charCodeAt(i);
      hash |= 0;
    }
    pseudoRand = Math.abs(hash % 1000) / 1000;
  } catch {
    pseudoRand = Math.random();
  }

  const events: LineageMutationEvent[] = [];
  const lostTraits: string[] = [];
  const nextActiveTraits: EvolutionTrait[] = [];
  const nextDormantTraits: EvolutionTrait[] = [...parentA.dormantTraits];

  // 1. Invariant Anchors Preservation
  const anchors = new Set<string>(parentA.preservedAnchors);
  if (options.preservedAnchors) {
    for (const a of options.preservedAnchors) anchors.add(a);
  }
  const preservedAnchors = Array.from(anchors);

  // 2. Inherit Active Traits & Apply Decay / Dormancy
  // Low entropy (1-2): traits stay active with near-zero loss
  // Medium entropy (5-6): minor decay
  // High entropy (8-10): faster decay / displacement
  const decayRate = entropy <= 2 ? 0.02 : entropy <= 4 ? 0.08 : entropy <= 6 ? 0.15 : entropy <= 8 ? 0.25 : 0.35;

  const parentTraits = parentA.inheritedTraits.concat(parentA.acquiredTraits);

  for (const trait of parentTraits) {
    if (trait.status !== 'active') continue;

    const remainingStrength = trait.strength - decayRate * (1.1 - trait.persistence);

    // Dormancy condition: strength drops below threshold
    if (remainingStrength < 0.35) {
      nextDormantTraits.unshift({
        ...trait,
        strength: remainingStrength,
        status: 'dormant',
      });
      lostTraits.push(trait.id);
      events.push({
        type: 'dormancy',
        description: `Trait "${trait.label}" decayed into dormancy at Gen #${genNum}`,
        originGen: trait.originGen,
        targetId: trait.id,
      });
    } else {
      nextActiveTraits.push({
        ...trait,
        strength: remainingStrength,
      });
    }
  }

  // 3. Optional Reversion check
  const { revivedTrait, event: reversionEvent } = checkReversion(nextDormantTraits, entropy, pseudoRand);
  if (revivedTrait && reversionEvent) {
    // Remove from dormant list and add to active list
    const dIdx = nextDormantTraits.findIndex((d) => d.id === revivedTrait.id);
    if (dIdx !== -1) nextDormantTraits.splice(dIdx, 1);

    if (nextActiveTraits.length < MAX_ACTIVE_TRAITS) {
      nextActiveTraits.push(revivedTrait);
      events.push(reversionEvent);
    }
  }

  // 4. Optional Controlled Misremembering
  // Eligibility: entropy >= 4, and we have non-anchor traits
  const misrememberChance = entropy <= 2 ? 0.0 : entropy <= 4 ? 0.1 : entropy <= 6 ? 0.35 : entropy <= 8 ? 0.65 : 0.85;
  if (pseudoRand < misrememberChance && nextActiveTraits.length > 0) {
    // Pick 1 trait to misremember (never alter anchors!)
    const traitIdxToMutate = Math.floor(pseudoRand * nextActiveTraits.length) % nextActiveTraits.length;
    const targetTrait = nextActiveTraits[traitIdxToMutate];

    const { alteredTrait, event: misrememberEvent } = misrememberTrait(targetTrait, pseudoRand);
    nextActiveTraits[traitIdxToMutate] = alteredTrait;
    events.push(misrememberEvent);
  }

  // 5. Acquire New Traits from Genotype (active operators & attractors)
  const newlyAcquiredTraits: EvolutionTrait[] = [];
  const derivedFromGenotype = deriveTraitsFromGenotype(
    options.activeOperators || [],
    options.activeAttractors || [],
    genNum
  );

  for (const candidate of derivedFromGenotype) {
    const alreadyActive = nextActiveTraits.some((t) => t.id === candidate.id);
    const alreadyDormant = nextDormantTraits.some((d) => d.id === candidate.id);

    if (!alreadyActive && !alreadyDormant && nextActiveTraits.length + newlyAcquiredTraits.length < MAX_ACTIVE_TRAITS) {
      newlyAcquiredTraits.push(candidate);
      events.push({
        type: 'drift',
        description: `Acquired new structural trait "${candidate.label}" at Gen #${genNum}`,
        originGen: genNum,
        targetId: candidate.id,
      });
    }
  }

  // 6. Inherit and Evaluate Scars
  const currentScars: LineageScar[] = [];
  for (const scar of parentA.scars) {
    // Gradual scar persistence decay
    const decayedStrength = scar.strength * 0.95;
    if (decayedStrength > 0.3) {
      currentScars.push({ ...scar, strength: decayedStrength });
    }
  }

  const newScar = evaluateScars(
    genNum,
    options.activeOperators || [],
    options.activeAttractors || [],
    entropy,
    nextActiveTraits,
    pseudoRand
  );

  if (newScar && currentScars.length < MAX_SCARS && !currentScars.some((s) => s.id === newScar.id)) {
    currentScars.push(newScar);
    events.push({
      type: 'scar_formed',
      description: `Lineage acquired persistent scar: "${newScar.label}"`,
      originGen: genNum,
      targetId: newScar.id,
    });
  }

  // Enforce caps to prevent storage bloat
  const finalActiveTraits = nextActiveTraits.slice(0, MAX_ACTIVE_TRAITS);
  const finalDormantTraits = nextDormantTraits.slice(0, MAX_DORMANT_TRAITS);
  const finalScars = currentScars.slice(0, MAX_SCARS);
  const finalEvents = events.slice(0, MAX_MUTATION_EVENTS);

  const childGen: PromptGeneration = {
    generationId: `gen-${genNum}-${Math.random().toString(36).substring(2, 8)}`,
    generationNumber: genNum,
    timestamp: Date.now(),
    parentGenerationIds: [parentA.generationId],
    sourceConcept: options.newConceptInput || parentA.sourceConcept,
    renderedPrompt: parentA.renderedPrompt.slice(0, 1000),
    inheritedTraits: finalActiveTraits,
    acquiredTraits: newlyAcquiredTraits,
    lostTraits,
    dormantTraits: finalDormantTraits,
    scars: finalScars,
    preservedAnchors,
    mutationEvents: finalEvents,
    lineageSummary: '',
  };

  childGen.lineageSummary = formatLineageSummary(childGen);
  return childGen;
}
