/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Experiment Run Logger & Family Manager
 * 
 * Manages experiment families, control runs, and execution records.
 * 
 * CORE ARCHITECTURAL INVARIANT:
 * OBSERVATION IS STRICTLY SEPARATE FROM INTERPRETATION.
 * - observation: Empirical, descriptive facts of what happened in the generation.
 * - interpretation: Speculative hypothesis of the underlying mechanism.
 * - scores: Allow null values when unmeasured. NEVER manufacture synthetic scores.
 */

import {
  ExperimentFamily,
  ExperimentFamilySummary,
  ExperimentRunRecord,
  ExperimentalControlRole,
  ExecutionTier,
  TechnicalEvidenceStatus,
  TechnicalModality,
  TechnicalScores,
  TechnicalOperator,
} from '../types/technicalCore';

const EXPERIMENT_FAMILIES_STORAGE_KEY = 'david_technical_experiment_families_v1';

// In-memory registry of experiment families
let memoryFamilies: Record<string, ExperimentFamily> = {};

/**
 * Creates a unique identifier with optional prefix.
 */
export function generateExperimentId(prefix: string = 'EXP'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${rand}`;
}

/**
 * Helper to ensure scores object has all required fields, defaulting
 * unknown or unmeasured metrics to null (NEVER manufacturing synthetic numbers).
 */
export function sanitizeScores(scores?: Partial<TechnicalScores>): TechnicalScores {
  return {
    creativeUtility: scores?.creativeUtility ?? null,
    repeatability: scores?.repeatability ?? null,
    mechanismConfidence: scores?.mechanismConfidence ?? null,
    modelDependence: scores?.modelDependence ?? null,
    failureToIgnoreRate: scores?.failureToIgnoreRate ?? null,
  };
}

/**
 * Initializes a new Experiment Family grouping related runs (baseline, experimental,
 * controls, ablations, sweeps) under a single testable scientific hypothesis.
 */
export function createExperimentFamily(params: {
  operator: TechnicalOperator;
  modelId: string;
  title?: string;
  variableChanged?: string;
  heldConstant?: string;
  customHypothesis?: string;
  customFalsificationCondition?: string;
  notes?: string;
}): ExperimentFamily {
  const familyId = generateExperimentId(`EXP-${params.operator.shortName.toUpperCase().replace(/\s+/g, '_')}`);
  const now = new Date().toISOString();

  const family: ExperimentFamily = {
    familyId,
    title: params.title || `${params.operator.name} Evaluation (${params.modelId})`,
    operatorId: params.operator.id,
    operatorVersion: params.operator.version,
    modelId: params.modelId,
    createdAt: now,
    updatedAt: now,
    hypothesis: params.customHypothesis || params.operator.mechanismHypothesis,
    falsificationCondition:
      params.customFalsificationCondition || params.operator.controls.falsificationCondition,
    variableChanged: params.variableChanged || params.operator.controls.variableChanged,
    heldConstant: params.heldConstant || params.operator.controls.heldConstant,
    runs: [],
    notes: params.notes,
  };

  saveFamily(family);
  return family;
}

/**
 * Creates and logs a single experiment run within an experiment family.
 * Strictly separates empirical observation from mechanistic interpretation.
 */
export function logExperimentRun(params: {
  familyId?: string;
  operatorId: string;
  operatorVersion: string;
  modelId: string;
  modality: TechnicalModality;
  executionTier: ExecutionTier;
  role: ExperimentalControlRole;
  seed?: number | string | null;
  parentRunId?: string | null;
  parametersUsed?: Record<string, any>;
  inputReferenceIdentifiers?: Record<string, any>;
  outputs?: {
    promptText?: string;
    negativePrompt?: string;
    mediaUri?: string;
    artifactReferences?: string[];
    technicalDumps?: Record<string, any>;
  };
  observation: string;
  interpretation: string;
  scores?: Partial<TechnicalScores>;
  evidenceStatus?: TechnicalEvidenceStatus[];
  notes?: string;
}): ExperimentRunRecord {
  const runId = generateExperimentId('RUN');
  const now = new Date().toISOString();

  // Validate structural separation of observation vs interpretation
  const trimmedObservation = params.observation.trim();
  const trimmedInterpretation = params.interpretation.trim();

  const runRecord: ExperimentRunRecord = {
    runId,
    familyId: params.familyId,
    timestamp: now,
    operatorId: params.operatorId,
    operatorVersion: params.operatorVersion,
    modelId: params.modelId,
    modality: params.modality,
    executionTier: params.executionTier,
    seed: params.seed ?? null,
    role: params.role,
    parentRunId: params.parentRunId ?? null,
    parametersUsed: params.parametersUsed ? { ...params.parametersUsed } : {},
    inputReferenceIdentifiers: params.inputReferenceIdentifiers
      ? { ...params.inputReferenceIdentifiers }
      : {},
    outputs: params.outputs || {},
    observation: trimmedObservation,
    interpretation: trimmedInterpretation,
    scores: sanitizeScores(params.scores),
    evidenceStatus: params.evidenceStatus || ['OBSERVED'],
    notes: params.notes,
  };

  // If associated with an experiment family, attach and update family summary
  if (params.familyId) {
    const family = getFamily(params.familyId);
    if (family) {
      family.runs.push(runRecord);
      family.updatedAt = now;
      family.summary = calculateFamilySummary(family);
      saveFamily(family);
    }
  }

  return runRecord;
}

/**
 * Computes aggregate metrics and verdict synthesis across an experiment family.
 */
export function calculateFamilySummary(family: ExperimentFamily): ExperimentFamilySummary {
  const runs = family.runs;
  if (runs.length === 0) {
    return {
      runCount: 0,
      meanCreativeUtility: null,
      meanMechanismConfidence: null,
      repeatabilityDemonstrated: null,
      falsificationTriggered: false,
      currentVerdict: 'PROPOSED',
      synthesis: 'No runs recorded in this experimental family yet.',
    };
  }

  // Calculate averages without polluting null values
  const creativeScores = runs
    .map((r) => r.scores.creativeUtility)
    .filter((s): s is number => s !== null && typeof s === 'number');
  const mechanismScores = runs
    .map((r) => r.scores.mechanismConfidence)
    .filter((s): s is number => s !== null && typeof s === 'number');
  const repeatabilityScores = runs
    .map((r) => r.scores.repeatability)
    .filter((s): s is number => s !== null && typeof s === 'number');

  const meanCreativeUtility =
    creativeScores.length > 0
      ? Number((creativeScores.reduce((a, b) => a + b, 0) / creativeScores.length).toFixed(2))
      : null;

  const meanMechanismConfidence =
    mechanismScores.length > 0
      ? Number((mechanismScores.reduce((a, b) => a + b, 0) / mechanismScores.length).toFixed(2))
      : null;

  const repeatabilityDemonstrated =
    repeatabilityScores.length > 0
      ? repeatabilityScores.reduce((a, b) => a + b, 0) / repeatabilityScores.length >= 0.6
      : null;

  // Check if falsification was explicitly flagged in any run
  const falsificationTriggered = runs.some((r) => r.evidenceStatus.includes('FALSIFIED'));

  // Synthesize current verdict
  let currentVerdict: TechnicalEvidenceStatus = 'OBSERVED';
  if (falsificationTriggered) {
    currentVerdict = 'FALSIFIED';
  } else if (meanMechanismConfidence !== null && meanMechanismConfidence >= 0.75) {
    currentVerdict = 'MECHANISM_SUPPORTED';
  } else if (meanCreativeUtility !== null && meanCreativeUtility >= 0.7) {
    currentVerdict = 'EMPIRICALLY_USEFUL';
  } else if (runs.length > 0) {
    currentVerdict = 'MECHANISM_UNCERTAIN';
  }

  const synthesis = `Family completed ${runs.length} runs. Creative utility mean: ${meanCreativeUtility ?? 'unmeasured'}, Mechanism confidence mean: ${meanMechanismConfidence ?? 'unmeasured'}. Status: ${currentVerdict}.`;

  return {
    runCount: runs.length,
    meanCreativeUtility,
    meanMechanismConfidence,
    repeatabilityDemonstrated,
    falsificationTriggered,
    currentVerdict,
    synthesis,
  };
}

/**
 * Storage helpers with in-memory fallback.
 */
export function saveFamily(family: ExperimentFamily): void {
  memoryFamilies[family.familyId] = family;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(EXPERIMENT_FAMILIES_STORAGE_KEY);
      const all: Record<string, ExperimentFamily> = stored ? JSON.parse(stored) : {};
      all[family.familyId] = family;
      window.localStorage.setItem(EXPERIMENT_FAMILIES_STORAGE_KEY, JSON.stringify(all));
    }
  } catch (e) {
    // Graceful fallback for non-browser or quota-limited storage
  }
}

export function getFamily(familyId: string): ExperimentFamily | undefined {
  if (memoryFamilies[familyId]) {
    return memoryFamilies[familyId];
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(EXPERIMENT_FAMILIES_STORAGE_KEY);
      if (stored) {
        const all: Record<string, ExperimentFamily> = JSON.parse(stored);
        if (all[familyId]) {
          memoryFamilies[familyId] = all[familyId];
          return all[familyId];
        }
      }
    }
  } catch (e) {
    // Ignore fallback errors
  }
  return undefined;
}

export function listFamilies(): ExperimentFamily[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(EXPERIMENT_FAMILIES_STORAGE_KEY);
      if (stored) {
        const all: Record<string, ExperimentFamily> = JSON.parse(stored);
        return Object.values(all);
      }
    }
  } catch (e) {
    // Fall back to memory
  }
  return Object.values(memoryFamilies);
}
