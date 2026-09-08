import {
  ModelOrganismProfile,
  ModelObservation,
  TargetEngine,
  OpenArtModel,
  GrokMode,
  MediaType,
  ObservedArtifactTag,
} from '../types';
import { MODEL_ORGANISM_PROFILES } from '../data/modelProfiles';
import { TARGET_CAPABILITIES, getTargetCharacterLimits } from './targetCapabilities';

const OBSERVATIONS_STORAGE_KEY = 'david_model_observations_v1';

// In-memory fallback for environments without localStorage or server-side execution
let memoryObservations: ModelObservation[] = [];

/**
 * Resolves a unique model ID from platform target engine and sub-model options.
 */
export function resolveModelId(
  target: TargetEngine,
  options?: { openArtModel?: OpenArtModel; grokMode?: GrokMode; modelVersion?: string }
): string {
  if (target === 'openart') {
    return `openart_${options?.openArtModel || 'banana'}`;
  }
  if (target === 'grok') {
    return options?.grokMode === 'grok_video' ? 'grok_video' : 'grok_image';
  }
  if (target === 'midjourney_flux') {
    return options?.modelVersion === 'flux' ? 'flux_1_dev' : 'midjourney_v6';
  }
  if (target === 'suno') {
    return options?.modelVersion === 'v3' ? 'suno_v3' : 'suno_v4';
  }
  if (target === 'llm_agent') {
    return 'gemini_flash';
  }
  if (target === 'void') {
    return 'latent_void';
  }
  if (target === 'general') {
    return 'universal_multimodal';
  }
  return 'universal_multimodal';
}

/**
 * Retrieves a ModelOrganismProfile from the registry.
 * If the model is unprofiled, safely synthesizes an UNPROFILED / EXPERIMENTAL fallback
 * that inherits target engine limits and defaults without throwing.
 */
export function getModelProfile(
  modelId: string,
  fallbackTarget: TargetEngine = 'general',
  fallbackMedium: MediaType = 'image'
): ModelOrganismProfile {
  const existing = MODEL_ORGANISM_PROFILES[modelId];
  if (existing) {
    // Return a structured clone so consumers cannot mutate the central catalog directly
    return JSON.parse(JSON.stringify(existing));
  }

  // Safe fallback for unprofiled organisms
  const limits = getTargetCharacterLimits(fallbackTarget);
  return {
    technicalFacts: {
      id: modelId,
      platformId: fallbackTarget,
      modelName: `Unprofiled Organism (${modelId})`,
      version: 'unknown',
      mediaType: fallbackMedium,
      promptCharacterLimit: limits.max,
      preferredTargetLength: limits.default,
      capabilities: ['experimental-inference'],
      supportedReferences: [],
    },
    epistemicStatus: 'EXPERIMENTAL',
    confidence: 'unknown',
    fingerprint: {
      referenceGrip: 'unknown',
      semanticGrip: 'unknown',
      topologyGrip: 'unknown',
      materialGrip: 'unknown',
      temporalGrip: 'unknown',
      promptLiteralness: 'unknown',
      contradictionTolerance: 'unknown',
      ambiguityTolerance: 'unknown',
      longPromptBehavior: 'unknown',
      technicalLanguageTolerance: 'unknown',
      negativeInstructionReliability: 'unknown',
    },
    operatorWeights: {},
    familyWeights: {},
    operatorWarnings: {},
    recommendedMinOperators: 3,
    recommendedMaxOperators: 5,
    recommendedDebtCount: 1,
    contradictionStyle: 'compact_coupled',
    promptOrdering: ['anchors_first', 'mechanisms_first', 'rendering_first', 'blockers_last'],
    promptDensityPreference: 'balanced',
    anchorRepetition: false,
    easyOuts: [],
    observedFailureSurfaces: [],
    weakFailureSurfaces: [],
    knownStrengths: [],
    experimentalNotes: [
      'Unprofiled organism. Operating under baseline media defaults and standard mutation operator library.',
    ],
    source: 'Automated fallback for uncataloged model',
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

/**
 * Retrieves all stored observations from local storage or memory.
 */
export function getAllObservations(): ModelObservation[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const data = localStorage.getItem(OBSERVATIONS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[ModelOrganismRegistry] Failed to read observations from localStorage:', e);
    }
  }
  return [...memoryObservations];
}

/**
 * Retrieves observations specifically associated with a model ID.
 */
export function getObservationsForModel(modelId: string): ModelObservation[] {
  return getAllObservations().filter((o) => o.modelId === modelId);
}

/**
 * Saves a new observation, persisting it for Job 7 slop amplifier integration.
 */
export function saveModelObservation(observation: ModelObservation): void {
  const all = getAllObservations();
  const index = all.findIndex((o) => o.observationId === observation.observationId);
  if (index >= 0) {
    all[index] = observation;
  } else {
    all.push(observation);
  }

  memoryObservations = [...all];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('[ModelOrganismRegistry] Failed to persist observation to localStorage:', e);
    }
  }
}

/**
 * Clears all observations (useful for test resets).
 */
export function clearModelObservations(): void {
  memoryObservations = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(OBSERVATIONS_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Calculates effective operator weights by blending:
 * 1. Base model profile weights
 * 2. Profile confidence damping
 * 3. Gradual observation-derived shifts (preventing overfitting from a single observation)
 */
export function getEffectiveOperatorWeights(profile: ModelOrganismProfile): Record<string, number> {
  const result: Record<string, number> = { ...profile.operatorWeights };

  // Confidence scaling factor
  const confidenceScale =
    profile.confidence === 'high'
      ? 1.0
      : profile.confidence === 'medium'
      ? 0.75
      : profile.confidence === 'low'
      ? 0.5
      : 0.25;

  // Apply confidence scaling to initial weights
  for (const [k, v] of Object.entries(result)) {
    // scale deviation from 1.0 by confidence
    const delta = (v - 1.0) * confidenceScale;
    result[k] = Math.max(0.5, Math.min(2.0, 1.0 + delta));
  }

  // Blend in observations carefully (strictly avoiding single-generation overfitting)
  const observations = getObservationsForModel(profile.technicalFacts.id);
  if (observations.length > 0) {
    const operatorCounts: Record<string, number> = {};
    const operatorPositiveRatings: Record<string, number> = {};

    observations.forEach((obs) => {
      obs.operatorsUsed.forEach((opId) => {
        operatorCounts[opId] = (operatorCounts[opId] || 0) + 1;
        if ((obs.userRating && obs.userRating >= 4) || obs.observedArtifactTags.includes('TOPOLOGY_LEAK')) {
          operatorPositiveRatings[opId] = (operatorPositiveRatings[opId] || 0) + 1;
        }
      });
    });

    for (const [opId, count] of Object.entries(operatorCounts)) {
      const current = result[opId] || 1.0;
      const positiveCount = operatorPositiveRatings[opId] || 0;

      // 1 observation: tiny clue (max 0.05 shift)
      // 3+ consistent observations: up to 0.15 shift
      let shift = 0;
      if (count === 1) {
        shift = positiveCount === 1 ? 0.05 : -0.05;
      } else if (count >= 3) {
        const positiveRatio = positiveCount / count;
        shift = (positiveRatio - 0.5) * 0.3; // between -0.15 and +0.15
      }

      result[opId] = Math.max(0.5, Math.min(2.0, current + shift));
    }
  }

  return result;
}
