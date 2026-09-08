/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 7: Empirical Observation and Learning Engine
 * 
 * Manages experiment memory, run records, outcome tracking, preserved artifacts,
 * repeatability statistics, ablation controls, and dynamic model profile adjustments.
 * 
 * CORE ARCHITECTURAL PRINCIPLE:
 * - Separate CREATIVE UTILITY from MECHANISM CONFIDENCE.
 * - Separate HYPOTHESIS from OBSERVED FACT.
 * - Learn from what models DO, not what we imagine they do.
 * - Preserve accidents; test causality via ablations; track iterative lineages.
 */

import {
  EmpiricalRunRecord,
  ObservedOutcomeType,
  PreservedArtifactEntry,
  UserFeedbackJudgment,
  QualitativeRating,
  EvidenceTier,
  RepeatabilityRecord,
  InteractionMemoryRecord,
  InteractionSequenceTag,
  ArtifactFamily,
  ModelProfileEvidenceReport,
  ModelEvidenceDimension,
  ExperimentRecommendation,
  EmpiricalPlanningAdvice,
} from '../types/empiricalLearning';
import { ContentDNA } from '../types/contentDna';
import { TargetEngine } from '../types';

const STORAGE_KEY_RUNS = 'david_empirical_runs_v1';
const STORAGE_KEY_OVERRIDES = 'david_model_evidence_overrides_v1';

// In-memory runtime cache for non-browser/server/test environments
let memoryRuns: Record<string, EmpiricalRunRecord> = {};
let memoryOverrides: Record<string, Record<string, string>> = {};

// ==========================================
// 1. STORAGE & CACHE HELPERS (SAFE FALLBACK)
// ==========================================

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadAllRuns(): Record<string, EmpiricalRunRecord> {
  if (!isBrowser()) {
    return { ...memoryRuns };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_RUNS);
    if (!raw) return { ...memoryRuns };
    const parsed = JSON.parse(raw);
    memoryRuns = { ...memoryRuns, ...parsed };
    return { ...memoryRuns };
  } catch (err) {
    console.warn('[DAVID Empirical Learning] Error loading runs from localStorage, using memory:', err);
    return { ...memoryRuns };
  }
}

export function saveAllRuns(runs: Record<string, EmpiricalRunRecord>): void {
  memoryRuns = { ...runs };
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_RUNS, JSON.stringify(runs));
  } catch (err) {
    console.warn('[DAVID Empirical Learning] Error persisting runs to localStorage:', err);
  }
}

export function getRun(runId: string): EmpiricalRunRecord | undefined {
  const all = loadAllRuns();
  return all[runId];
}

export function generateRunId(prefix = 'RUN'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

// ==========================================
// 2. CREATING & LOGGING EXPERIMENT RUNS
// ==========================================

export interface CreateRunParams {
  sourcePrompt: string;
  targetMedium?: 'image' | 'video' | 'audio' | string;
  targetEngine?: TargetEngine | string;
  provider?: string;
  model?: string;
  modelVersion?: string;
  contentDna?: ContentDNA;
  lockedAnchors?: string[];
  activeAttractors?: string[];
  activeOperators?: string[];
  operatorInteractionChain?: Array<{
    step: number;
    operatorName: string;
    action: string;
    consequence: string;
    targetAffected?: string;
  }>;
  mutationIntensity?: number;
  targetSpecificTranslation?: Record<string, any> | string;
  modelFingerprintUsed?: Record<string, any>;
  easyOutBlockersUsed?: string[];
  referenceAssets?: string[];
  generationSettings?: Record<string, any>;
  literalPrompt?: string;
  slopPrompt?: string;
  parentRunId?: string | null;
  iterationDepth?: number;
  initialOutcomes?: ObservedOutcomeType[];
  notes?: string;
}

export function logEmpiricalRun(params: CreateRunParams): EmpiricalRunRecord {
  const runs = loadAllRuns();
  const runId = generateRunId();
  const now = new Date().toISOString();

  // Inherit iteration depth from parent run if not explicitly provided
  let depth = params.iterationDepth ?? 0;
  if (params.parentRunId && params.iterationDepth === undefined) {
    const parent = runs[params.parentRunId];
    if (parent) {
      depth = parent.iterationDepth + 1;
    }
  }

  // Derive model and targetMedium safely
  const targetMedium =
    params.targetMedium ||
    (params.targetEngine === 'suno'
      ? 'audio'
      : ['runway', 'luma', 'pika', 'kling'].includes(params.targetEngine as string)
      ? 'video'
      : 'image');

  const model = params.model || (params.targetEngine ? `${params.targetEngine}_standard` : 'universal_multimodal');
  const provider = params.provider || (params.targetEngine ? String(params.targetEngine) : 'david_synthetic');

  const record: EmpiricalRunRecord = {
    runId,
    timestamp: now,
    parentRunId: params.parentRunId || null,
    iterationDepth: depth,
    targetMedium,
    targetEngine: params.targetEngine,
    provider,
    model,
    modelVersion: params.modelVersion,
    sourcePrompt: params.sourcePrompt,
    contentDnaSnapshot: params.contentDna,
    lockedAnchors: params.lockedAnchors || params.contentDna?.lockedAnchors || [],
    activeAttractors:
      params.activeAttractors || params.contentDna?.activeAttractors.map((a) => a.id) || [],
    activeOperators:
      params.activeOperators || params.contentDna?.activeOperators.map((o) => o.id) || [],
    operatorInteractionChain:
      params.operatorInteractionChain ||
      params.contentDna?.interactionChain.map((step) => ({
        step: step.step,
        operatorName: step.operatorName,
        action: step.action,
        consequence: step.consequence,
        targetAffected: step.targetAffected,
      })),
    mutationIntensity: params.mutationIntensity ?? 5,
    targetSpecificTranslation: params.targetSpecificTranslation,
    modelFingerprintUsed: params.modelFingerprintUsed,
    easyOutBlockersUsed: params.easyOutBlockersUsed || [],
    referenceAssets: params.referenceAssets || [],
    generationSettings: params.generationSettings || {},
    literalPrompt: params.literalPrompt,
    slopPrompt: params.slopPrompt,
    outcomes: params.initialOutcomes && params.initialOutcomes.length > 0 ? params.initialOutcomes : ['success'],
    preservedArtifacts: [],
    creativeUtility: 'UNKNOWN',
    mechanismConfidence: 'UNKNOWN',
    excludeFromLearning: false,
    notes: params.notes,
  };

  runs[runId] = record;
  saveAllRuns(runs);
  return record;
}

// ==========================================
// 3. UPDATING RUNS & RECORDING FEEDBACK
// ==========================================

export function updateRunRecord(
  runId: string,
  updates: Partial<EmpiricalRunRecord>
): EmpiricalRunRecord | null {
  const runs = loadAllRuns();
  const existing = runs[runId];
  if (!existing) return null;

  const updated: EmpiricalRunRecord = {
    ...existing,
    ...updates,
    runId: existing.runId, // Immutable ID
    timestamp: existing.timestamp, // Immutable creation time
  };

  runs[runId] = updated;
  saveAllRuns(runs);
  return updated;
}

export function recordUserFeedback(
  runId: string,
  feedback: UserFeedbackJudgment,
  notes?: string
): EmpiricalRunRecord | null {
  const run = getRun(runId);
  if (!run) return null;

  // Derive initial creative utility direction from user feedback
  let utility: QualitativeRating = run.creativeUtility;
  if (['LOVE IT', 'INTERESTING', 'GOOD ACCIDENT', 'KEEP THIS ERROR', 'DO THIS HARDER'].includes(feedback)) {
    utility = 'HIGH';
  } else if (['MEH', 'TOO NORMAL'].includes(feedback)) {
    utility = 'LOW';
  } else if (['BORING', 'NEVER AGAIN'].includes(feedback)) {
    utility = 'LOW';
  }

  // Auto-record interesting accident if flagged
  const currentOutcomes = [...run.outcomes];
  if (feedback === 'GOOD ACCIDENT' || feedback === 'KEEP THIS ERROR') {
    if (!currentOutcomes.includes('interesting_accident')) {
      currentOutcomes.push('interesting_accident');
    }
  } else if (feedback === 'LOST THE SUBJECT') {
    if (!currentOutcomes.includes('seed_erased')) {
      currentOutcomes.push('seed_erased');
    }
  } else if (feedback === 'TOO DESTROYED') {
    if (!currentOutcomes.includes('catastrophic_collapse')) {
      currentOutcomes.push('catastrophic_collapse');
    }
  }

  return updateRunRecord(runId, {
    userFeedback: feedback,
    creativeUtility: utility,
    outcomes: currentOutcomes,
    notes: notes ? (run.notes ? `${run.notes}\n${notes}` : notes) : run.notes,
  });
}

export function recordQualitativeRatings(
  runId: string,
  creativeUtility: QualitativeRating,
  mechanismConfidence: QualitativeRating
): EmpiricalRunRecord | null {
  return updateRunRecord(runId, { creativeUtility, mechanismConfidence });
}

export function toggleRunOutcome(
  runId: string,
  outcome: ObservedOutcomeType
): EmpiricalRunRecord | null {
  const run = getRun(runId);
  if (!run) return null;

  const exists = run.outcomes.includes(outcome);
  const newOutcomes = exists
    ? run.outcomes.filter((o) => o !== outcome)
    : [...run.outcomes, outcome];

  return updateRunRecord(runId, {
    outcomes: newOutcomes.length > 0 ? newOutcomes : ['partial_success'],
  });
}

export function markExcludeFromLearning(
  runId: string,
  exclude: boolean,
  reason?: string
): EmpiricalRunRecord | null {
  const run = getRun(runId);
  if (!run) return null;

  return updateRunRecord(runId, {
    excludeFromLearning: exclude,
    userCorrectionNotes: reason || (exclude ? 'Manually excluded from empirical training' : undefined),
  });
}

// ==========================================
// 4. PRESERVED ARTIFACTS & ARTIFACT FAMILIES
// ==========================================

export const DEFAULT_ARTIFACT_FAMILIES: ArtifactFamily[] = [
  {
    id: 'connective_tissue_bloom',
    name: 'Connective Tissue Bloom',
    description: 'Thin biological or viscous membranous webbing spanning distinct spatial structures or limbs.',
    modelsObserved: ['midjourney_v6', 'openart_banana', 'flux_1_dev'],
    media: ['image'],
    associatedOperators: ['concept_bleed', 'material_ontology_bifurcation'],
    confidence: 'OBSERVED',
    amplificationMethods: ['Increase intermediate distance between anchored bodies', 'Lower prompt character density'],
    destructiveConditions: ['Over-weighting negative prompt tokens for extra anatomy'],
    representativeNotes: ['Often appears when two solid bodies are placed in close topological proximity under high entropy.'],
  },
  {
    id: 'screen_space_pinning',
    name: 'Screen-Space Pinning',
    description: 'Textures or graphic lines that cling statically to 2D viewport coordinates while camera moves in 3D.',
    modelsObserved: ['kling_v1', 'runway_gen3'],
    media: ['video'],
    associatedOperators: ['temporal_dilation', 'interior_exterior_inversion'],
    confidence: 'OBSERVED',
    amplificationMethods: ['Use high-contrast grid or lattice modifiers in video prompts'],
    destructiveConditions: ['Forcing steady camera panning tokens'],
    representativeNotes: ['Common artifact in video diffusion when spatial geometry destabilizes across frames.'],
  },
  {
    id: 'topology_scar',
    name: 'Topology Scar',
    description: 'Visible metallurgical or organic weld seam marking an impossible juxtaposition of two materials.',
    modelsObserved: ['openart_banana', 'midjourney_flux'],
    media: ['image'],
    associatedOperators: ['material_substitution', 'scale_disproportion'],
    confidence: 'REPEATED',
    amplificationMethods: ['Pairing organic tissue with cold crystalline/industrial material'],
    destructiveConditions: ['Airbrush smoothing tokens'],
    representativeNotes: ['High creative utility: provides convincing tangible friction instead of blurry morphing.'],
  },
  {
    id: 'temporal_ghost',
    name: 'Temporal Ghost',
    description: 'Previous frame silhouette persists as a semitransparent trailing structure.',
    modelsObserved: ['runway_gen3', 'luma_dream_machine'],
    media: ['video'],
    associatedOperators: ['phase_inversion', 'temporal_dilation'],
    confidence: 'OBSERVED',
    amplificationMethods: ['High-speed motion followed by abrupt spatial reversal'],
    destructiveConditions: ['Frame-rate clamping'],
    representativeNotes: ['Produces compelling cinematic latency effects.'],
  },
  {
    id: 'surface_delamination',
    name: 'Surface Delamination',
    description: 'Outer skin or paint peeling away in discrete sheets while remaining suspended above underlying substrate.',
    modelsObserved: ['midjourney_flux', 'flux_1_dev'],
    media: ['image'],
    associatedOperators: ['interior_exterior_inversion', 'material_substitution'],
    confidence: 'OBSERVED',
    amplificationMethods: ['Juxtaposing tensile skin with brittle core'],
    destructiveConditions: ['Monolithic surface prompts'],
    representativeNotes: ['Reveals model internal rendering layers in an aesthetically compelling way.'],
  },
  {
    id: 'spectral_comb_residue',
    name: 'Spectral Comb Residue',
    description: 'Harmonic ringing frequencies or metallic comb filter artifacts following percussive transients.',
    modelsObserved: ['suno_v3', 'suno_v4'],
    media: ['audio'],
    associatedOperators: ['recursive_reversal', 'acoustic_hyper_resonance'],
    confidence: 'OBSERVED',
    amplificationMethods: ['High tempo percussion combined with cavernous acoustic tags'],
    destructiveConditions: ['Lo-fi or acoustic-only style tags'],
    representativeNotes: ['Produces haunting analog tape delay resonances.'],
  },
];

export function addPreservedArtifact(
  runId: string,
  artifact: {
    name: string;
    action: 'PRESERVE' | 'AMPLIFY' | 'IGNORE' | 'AVOID';
    description?: string;
    familyId?: string;
  }
): PreservedArtifactEntry | null {
  const run = getRun(runId);
  if (!run) return null;

  const entry: PreservedArtifactEntry = {
    id: `ART-${Date.now().toString(36).toUpperCase()}`,
    name: artifact.name,
    action: artifact.action,
    description: artifact.description,
    familyId: artifact.familyId,
    observedInModel: run.model,
    targetMedium: run.targetMedium,
    associatedOperators: [...run.activeOperators],
    firstObservedRunId: run.runId,
    timestamp: new Date().toISOString(),
  };

  const updatedArtifacts = [...run.preservedArtifacts, entry];
  updateRunRecord(runId, { preservedArtifacts: updatedArtifacts });
  return entry;
}

export function getAllPreservedArtifacts(): PreservedArtifactEntry[] {
  const runs = loadAllRuns();
  const list: PreservedArtifactEntry[] = [];
  for (const r of Object.values(runs)) {
    if (!r.excludeFromLearning && r.preservedArtifacts) {
      for (const a of r.preservedArtifacts) {
        if (a.action === 'PRESERVE' || a.action === 'AMPLIFY') {
          list.push(a);
        }
      }
    }
  }
  return list;
}

// ==========================================
// 5. REPEATABILITY & OPERATOR MEMORY
// ==========================================

export function calculateOperatorRepeatability(
  operatorId: string,
  modelId: string
): RepeatabilityRecord {
  const runs = Object.values(loadAllRuns()).filter(
    (r) =>
      !r.excludeFromLearning &&
      r.model === modelId &&
      r.activeOperators.includes(operatorId)
  );

  const attempts = runs.length;
  if (attempts === 0) {
    return {
      operatorId,
      modelId,
      attempts: 0,
      successes: 0,
      partialSuccesses: 0,
      failures: 0,
      dominantFailureModes: [],
      interestingAccidentFrequency: 0,
      preservedArtifactFrequency: 0,
      seedErasureFrequency: 0,
      easyOutFrequency: 0,
      approximateRepeatability: 'UNKNOWN',
      confidenceProgression: 'ASSUMED',
      lastUpdated: new Date().toISOString(),
    };
  }

  let successes = 0;
  let partialSuccesses = 0;
  let failures = 0;
  let interestingAccidents = 0;
  let preservedArtifactsCount = 0;
  let seedErasures = 0;
  let easyOuts = 0;
  const failureCountMap: Record<string, number> = {};

  for (const r of runs) {
    if (r.outcomes.includes('success')) successes++;
    if (r.outcomes.includes('partial_success')) partialSuccesses++;
    if (r.outcomes.includes('failure') || r.outcomes.includes('catastrophic_collapse')) failures++;
    if (r.outcomes.includes('interesting_accident')) interestingAccidents++;
    if (r.outcomes.includes('seed_erased')) seedErasures++;
    if (r.outcomes.includes('cliche_collapse') || r.outcomes.includes('genre_collapse')) easyOuts++;
    if (r.preservedArtifacts && r.preservedArtifacts.length > 0) preservedArtifactsCount++;

    for (const out of r.outcomes) {
      if (['failure', 'catastrophic_collapse', 'seed_erased', 'cliche_collapse', 'identity_drift'].includes(out)) {
        failureCountMap[out] = (failureCountMap[out] || 0) + 1;
      }
    }
  }

  // Calculate dominant failure modes
  const dominantFailureModes = Object.entries(failureCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([mode]) => mode);

  // Determine approximate repeatability
  const successRatio = attempts > 0 ? (successes + partialSuccesses * 0.5) / attempts : 0;
  let approximateRepeatability: QualitativeRating = 'UNKNOWN';
  if (attempts >= 2) {
    if (successRatio >= 0.75) approximateRepeatability = 'HIGH';
    else if (successRatio >= 0.4) approximateRepeatability = 'MEDIUM';
    else approximateRepeatability = 'LOW';
  }

  // Calculate confidence progression tier strictly from sample size
  let confidenceProgression: EvidenceTier = 'ASSUMED';
  if (attempts >= 10) confidenceProgression = 'HIGH CONFIDENCE';
  else if (attempts >= 6) confidenceProgression = 'REPEATED';
  else if (attempts >= 3) confidenceProgression = 'OBSERVED';
  else if (attempts >= 1) confidenceProgression = 'ANECDOTAL';

  return {
    operatorId,
    modelId,
    attempts,
    successes,
    partialSuccesses,
    failures,
    dominantFailureModes,
    interestingAccidentFrequency: Number((interestingAccidents / attempts).toFixed(2)),
    preservedArtifactFrequency: Number((preservedArtifactsCount / attempts).toFixed(2)),
    seedErasureFrequency: Number((seedErasures / attempts).toFixed(2)),
    easyOutFrequency: Number((easyOuts / attempts).toFixed(2)),
    approximateRepeatability,
    confidenceProgression,
    lastUpdated: new Date().toISOString(),
  };
}

// ==========================================
// 6. INTERACTION MEMORY (CHAINS & PAIRS)
// ==========================================

export function calculateInteractionMemory(
  operators: string[],
  modelId: string
): InteractionMemoryRecord {
  const sequenceKey = operators.join(' -> ');
  const runs = Object.values(loadAllRuns()).filter(
    (r) =>
      !r.excludeFromLearning &&
      r.model === modelId &&
      operators.every((op) => r.activeOperators.includes(op))
  );

  const attempts = runs.length;
  if (attempts === 0) {
    return {
      sequenceKey,
      operators,
      isOrdered: true,
      attempts: 0,
      behaviorTag: 'unknown',
      modelId,
      notes: ['No empirical runs with this exact sequence recorded yet.'],
      lastObserved: new Date().toISOString(),
    };
  }

  // Analyze interaction outcomes
  let accidentCount = 0;
  let seedKills = 0;
  let successes = 0;
  let highUtilityCount = 0;

  for (const r of runs) {
    if (r.outcomes.includes('interesting_accident')) accidentCount++;
    if (r.outcomes.includes('seed_erased')) seedKills++;
    if (r.outcomes.includes('success')) successes++;
    if (r.creativeUtility === 'HIGH') highUtilityCount++;
  }

  let behaviorTag: InteractionSequenceTag = 'unknown';
  if (seedKills / attempts >= 0.5) {
    behaviorTag = 'seed_killing_sequence';
  } else if (accidentCount / attempts >= 0.4 || highUtilityCount / attempts >= 0.6) {
    behaviorTag = 'artifact_producing_sequence';
  } else if (successes / attempts >= 0.7) {
    behaviorTag = 'strong_sequence';
  } else if (runs.some((r) => r.outcomes.includes('catastrophic_collapse'))) {
    behaviorTag = 'destructive_pair';
  }

  return {
    sequenceKey,
    operators,
    isOrdered: true,
    attempts,
    behaviorTag,
    modelId,
    notes: [
      `${attempts} runs observed. Success rate: ${(successes / attempts * 100).toFixed(0)}%. Interesting accident rate: ${(accidentCount / attempts * 100).toFixed(0)}%.`,
    ],
    lastObserved: new Date().toISOString(),
  };
}

// ==========================================
// 7. SAME-CONDITION COMPARISON & ABLATION
// ==========================================

export function findSameConditionRuns(baseRunId: string): EmpiricalRunRecord[] {
  const base = getRun(baseRunId);
  if (!base) return [];

  const allRuns = Object.values(loadAllRuns());
  return allRuns.filter(
    (r) =>
      r.runId !== baseRunId &&
      !r.excludeFromLearning &&
      (r.model === base.model || r.sourcePrompt === base.sourcePrompt)
  );
}

/**
 * Requirement 8: Ablation / Control Recording
 * If an interesting artifact survives unchanged after removing the supposedly causal
 * operator, reduce mechanism confidence in that explanation.
 */
export function recordAblation(params: {
  baseRunId: string;
  ablationRunId: string;
  elementRemoved: string;
  artifactSurvives: boolean;
  notes?: string;
}): { baseRun: EmpiricalRunRecord; ablationRun: EmpiricalRunRecord } | null {
  const base = getRun(params.baseRunId);
  const ablation = getRun(params.ablationRunId);
  if (!base || !ablation) return null;

  // If the artifact survived despite removing the mechanism:
  // Lower mechanism confidence from HIGH -> MEDIUM, or MEDIUM -> LOW
  let updatedBaseConfidence: QualitativeRating = base.mechanismConfidence;
  if (params.artifactSurvives) {
    if (base.mechanismConfidence === 'HIGH') updatedBaseConfidence = 'MEDIUM';
    else if (base.mechanismConfidence === 'MEDIUM') updatedBaseConfidence = 'LOW';
    else updatedBaseConfidence = 'LOW';
  } else {
    // Artifact vanished when operator was removed: Mechanism supported!
    if (base.mechanismConfidence === 'LOW' || base.mechanismConfidence === 'UNKNOWN') {
      updatedBaseConfidence = 'MEDIUM';
    } else if (base.mechanismConfidence === 'MEDIUM') {
      updatedBaseConfidence = 'HIGH';
    }
  }

  const updatedBase = updateRunRecord(params.baseRunId, {
    mechanismConfidence: updatedBaseConfidence,
    notes: base.notes
      ? `${base.notes}\n[Ablation verified]: Removed [${params.elementRemoved}]. Artifact survived: ${params.artifactSurvives}. Mechanism confidence adjusted to ${updatedBaseConfidence}.`
      : `[Ablation verified]: Removed [${params.elementRemoved}]. Artifact survived: ${params.artifactSurvives}. Mechanism confidence adjusted to ${updatedBaseConfidence}.`,
  })!;

  const updatedAblation = updateRunRecord(params.ablationRunId, {
    isAblation: true,
    ablationOfRunId: params.baseRunId,
    ablationRemovedElement: params.elementRemoved,
    ablationArtifactSurvives: params.artifactSurvives,
    notes: ablation.notes
      ? `${ablation.notes}\n[Ablation of ${params.baseRunId}]: Removed [${params.elementRemoved}].`
      : `[Ablation of ${params.baseRunId}]: Removed [${params.elementRemoved}].`,
  })!;

  return { baseRun: updatedBase, ablationRun: updatedAblation };
}

// ==========================================
// 8. DYNAMIC MODEL PROFILE EVIDENCE VIEW & ADJUSTMENT
// ==========================================

export function loadModelOverrides(): Record<string, Record<string, string>> {
  if (!isBrowser()) return { ...memoryOverrides };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_OVERRIDES);
    if (!raw) return { ...memoryOverrides };
    memoryOverrides = JSON.parse(raw);
    return { ...memoryOverrides };
  } catch {
    return { ...memoryOverrides };
  }
}

export function saveModelOverride(modelId: string, dimension: string, value: string): void {
  const overrides = loadModelOverrides();
  if (!overrides[modelId]) overrides[modelId] = {};
  overrides[modelId][dimension] = value;
  memoryOverrides = { ...overrides };
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
    } catch (e) {
      console.warn('Could not persist model overrides', e);
    }
  }
}

/**
 * Synthesizes accumulated empirical evidence for a given model.
 * Never rewrites profiles from 1 run; accumulates evidence across runs.
 */
export function getModelProfileEvidence(modelId: string): ModelProfileEvidenceReport {
  const allRuns = Object.values(loadAllRuns()).filter(
    (r) => !r.excludeFromLearning && r.model === modelId
  );
  const totalRuns = allRuns.length;
  const usefulRuns = allRuns.filter((r) => r.creativeUtility === 'HIGH');
  const overrides = loadModelOverrides()[modelId] || {};

  // Count contradiction failures vs successes
  let contradictionDrops = 0;
  let contradictionTotal = 0;
  let topologySurvivals = 0;
  let topologyTotal = 0;
  let attributeBleed = 0;
  let attributeTotal = 0;

  for (const r of allRuns) {
    if (r.activeOperators.some((o) => o.includes('paradox') || o.includes('contradiction'))) {
      contradictionTotal++;
      if (r.outcomes.includes('cliche_collapse') || r.outcomes.includes('genre_collapse')) {
        contradictionDrops++;
      }
    }
    if (r.activeOperators.some((o) => o.includes('topology') || o.includes('scale') || o.includes('inversion'))) {
      topologyTotal++;
      if (!r.outcomes.includes('topology_drift') && !r.outcomes.includes('catastrophic_collapse')) {
        topologySurvivals++;
      }
    }
    if (r.outcomes.includes('attribute_leakage') || r.outcomes.includes('orphan_attributes')) {
      attributeBleed++;
    }
    attributeTotal++;
  }

  // Evidence tier helper
  const calcTier = (count: number): EvidenceTier => {
    if (count >= 10) return 'HIGH CONFIDENCE';
    if (count >= 6) return 'REPEATED';
    if (count >= 3) return 'OBSERVED';
    if (count >= 1) return 'ANECDOTAL';
    return 'ASSUMED';
  };

  const dimensions: Record<string, ModelEvidenceDimension> = {
    contradictionSurvival: {
      dimension: 'Contradiction Survival',
      currentAssumed: 'MODERATE',
      empiricallyObserved:
        contradictionTotal === 0
          ? 'UNMEASURED'
          : contradictionDrops / contradictionTotal >= 0.5
          ? 'LOW (drops simultaneous contradiction into cliché)'
          : 'HIGH (maintains tension)',
      evidenceTier: calcTier(contradictionTotal),
      relevantRunCount: contradictionTotal,
      notes: `${contradictionDrops} dropped contradictions out of ${contradictionTotal} runs.`,
    },
    topologyTolerance: {
      dimension: 'Topology Tolerance',
      currentAssumed: 'MODERATE',
      empiricallyObserved:
        topologyTotal === 0
          ? 'UNMEASURED'
          : topologySurvivals / topologyTotal >= 0.6
          ? 'HIGH (resilient manifold retention)'
          : 'LOW (dissolves into blob)',
      evidenceTier: calcTier(topologyTotal),
      relevantRunCount: topologyTotal,
      notes: `${topologySurvivals} clean topology survivals out of ${topologyTotal} runs.`,
    },
    attributeBinding: {
      dimension: 'Attribute Binding Stability',
      currentAssumed: 'MODERATE',
      empiricallyObserved:
        attributeTotal === 0
          ? 'UNMEASURED'
          : attributeBleed / attributeTotal >= 0.4
          ? 'LOW (frequent migration across boundaries)'
          : 'STRONG (adheres to local subject)',
      evidenceTier: calcTier(attributeTotal),
      relevantRunCount: attributeTotal,
      notes: `${attributeBleed} instances of attribute bleed across ${attributeTotal} runs.`,
    },
    referenceDominance: {
      dimension: 'Reference Asset Dominance',
      currentAssumed: 'BALANCED',
      empiricallyObserved: 'OBSERVED',
      evidenceTier: calcTier(allRuns.filter((r) => r.referenceAssets && r.referenceAssets.length > 0).length),
      relevantRunCount: allRuns.filter((r) => r.referenceAssets && r.referenceAssets.length > 0).length,
      notes: 'Monitors whether reference images overpower conceptual prompt mutations.',
    },
    promptSaturationRisk: {
      dimension: 'Prompt Saturation / Length Degradation',
      currentAssumed: 'LOW RISK',
      empiricallyObserved: 'MONITORED',
      evidenceTier: calcTier(allRuns.filter((r) => (r.slopPrompt?.length || 0) > 1500).length),
      relevantRunCount: allRuns.filter((r) => (r.slopPrompt?.length || 0) > 1500).length,
      notes: 'Empirical checks for token dilution or tail truncation in dense prompts.',
    },
  };

  // Extract known artifact families from this model
  const artifactSet = new Set<string>();
  for (const r of allRuns) {
    for (const a of r.preservedArtifacts) {
      artifactSet.add(a.name);
    }
  }

  return {
    modelId,
    totalRuns,
    usefulRunsCount: usefulRuns.length,
    dimensions,
    dominantFailureModes: ['cliche_collapse', 'attribute_leakage', 'seed_erased'],
    knownArtifactFamilies: Array.from(artifactSet),
    userOverrides: overrides,
    lastUpdated: new Date().toISOString(),
  };
}

// ==========================================
// 9. EXPERIMENT RECOMMENDATIONS & PLANNER
// ==========================================

export function generateExperimentRecommendations(
  currentRunId?: string,
  modelId?: string
): ExperimentRecommendation[] {
  const recommendations: ExperimentRecommendation[] = [];
  const runs = Object.values(loadAllRuns()).filter((r) => !r.excludeFromLearning);
  const currentRun = currentRunId ? getRun(currentRunId) : runs[runs.length - 1];

  // 1. Ablation Recommendation
  if (currentRun && currentRun.activeOperators.length >= 2 && currentRun.creativeUtility === 'HIGH' && !currentRun.isAblation) {
    const removeOp = currentRun.activeOperators[currentRun.activeOperators.length - 1];
    recommendations.push({
      id: `REC-ABLATION-${Date.now().toString(36)}`,
      type: 'run_ablation',
      title: `Run Ablation: Remove ${removeOp}`,
      reason: `Run ${currentRun.runId} produced high creative utility. Test causality by running the exact same prompt with ${removeOp} removed.`,
      evidenceSource: `Ground truth: Run ${currentRun.runId}`,
      suggestedAction: {
        operators: currentRun.activeOperators.filter((o) => o !== removeOp),
        ablationTarget: removeOp,
      },
    });
  }

  // 2. Operator Order Reversal Recommendation
  if (currentRun && currentRun.activeOperators.length === 2) {
    const [opA, opB] = currentRun.activeOperators;
    recommendations.push({
      id: `REC-REVERSE-${Date.now().toString(36)}`,
      type: 'reverse_operator_order',
      title: `Reverse Order: ${opB} → ${opA}`,
      reason: `Operator sequences are non-commutative. Compare whether applying ${opB} before ${opA} alters causal boundary behavior.`,
      evidenceSource: `Sequence test from Run ${currentRun.runId}`,
      suggestedAction: {
        operators: [opB, opA],
      },
    });
  }

  // 3. Amplify Preserved Artifact
  const preserved = getAllPreservedArtifacts();
  if (preserved.length > 0) {
    const candidate = preserved[preserved.length - 1];
    recommendations.push({
      id: `REC-AMPLIFY-${Date.now().toString(36)}`,
      type: 'amplify_artifact',
      title: `Amplify Artifact: ${candidate.name}`,
      reason: `This artifact was marked [${candidate.action}] in ${candidate.observedInModel}. Reuse its active operators to reinforce the anomaly.`,
      evidenceSource: `Preserved in Run ${candidate.firstObservedRunId}`,
      suggestedAction: {
        operators: candidate.associatedOperators,
      },
    });
  }

  // 4. Repeat Recipe for Reproducibility
  if (currentRun && currentRun.outcomes.includes('interesting_accident')) {
    recommendations.push({
      id: `REC-REPEAT-${Date.now().toString(36)}`,
      type: 'repeat_recipe',
      title: 'Repeat Recipe: Verify Anomaly Reproducibility',
      reason: 'A strange result was produced once. Re-run under identical conditions to confirm whether it is repeatable.',
      evidenceSource: `Accident observed in Run ${currentRun.runId}`,
      suggestedAction: {
        operators: currentRun.activeOperators,
      },
    });
  }

  return recommendations.slice(0, 4);
}

/**
 * Requirement 21 & 22: Generation Planner Integration
 * Before new SLOP generation, consults Content DNA + Model Profile + Operator History
 * + Interaction History + Preserved Artifacts + User Preference History.
 * Works seamlessly with zero history.
 */
export function consultEmpiricalPlanner(context: {
  concept: string;
  targetEngine?: TargetEngine | string;
  entropyLevel: number;
}): EmpiricalPlanningAdvice {
  const allRuns = Object.values(loadAllRuns()).filter((r) => !r.excludeFromLearning);
  const preserved = getAllPreservedArtifacts();

  if (allRuns.length === 0) {
    // Requirement 22: Unknown / Empty History Fallback
    return {
      hasEmpiricalData: false,
      recommendedOperators: [],
      cautionedOperators: [],
      availablePreservedArtifacts: preserved,
      rationale: ['Zero empirical history recorded yet. Using baseline Guidance Geometry and model defaults.'],
    };
  }

  const modelId = context.targetEngine ? String(context.targetEngine) : 'universal_multimodal';
  const modelRuns = allRuns.filter((r) => r.model === modelId || r.targetEngine === context.targetEngine);

  const recommendedOperators: string[] = [];
  const cautionedOperators: string[] = [];
  const rationale: string[] = [];

  // Find operators with high creative utility in this model
  const opScores: Record<string, { high: number; low: number; total: number }> = {};
  for (const r of modelRuns) {
    for (const op of r.activeOperators) {
      if (!opScores[op]) opScores[op] = { high: 0, low: 0, total: 0 };
      opScores[op].total++;
      if (r.creativeUtility === 'HIGH' || r.userFeedback === 'LOVE IT' || r.userFeedback === 'GOOD ACCIDENT') {
        opScores[op].high++;
      }
      if (r.creativeUtility === 'LOW' || r.outcomes.includes('catastrophic_collapse')) {
        opScores[op].low++;
      }
    }
  }

  for (const [op, counts] of Object.entries(opScores)) {
    if (counts.total >= 2 && counts.high / counts.total >= 0.5) {
      recommendedOperators.push(op);
      rationale.push(`[${op}]: ${counts.high}/${counts.total} runs demonstrated high creative utility on ${modelId}.`);
    } else if (counts.total >= 2 && counts.low / counts.total >= 0.6) {
      cautionedOperators.push(op);
      rationale.push(`[${op}]: Frequent collapse observed on ${modelId} (${counts.low}/${counts.total} failed runs).`);
    }
  }

  return {
    hasEmpiricalData: modelRuns.length > 0,
    recommendedOperators: recommendedOperators.slice(0, 3),
    cautionedOperators: cautionedOperators.slice(0, 2),
    availablePreservedArtifacts: preserved,
    rationale: rationale.length > 0 ? rationale : ['Prior runs reviewed; baseline balanced mutation recipe selected.'],
  };
}
