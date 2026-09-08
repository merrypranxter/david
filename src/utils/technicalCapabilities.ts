/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Technical Capabilities Matrix & Execution-Tier Resolver
 * 
 * Central capability resolution layer connecting model organism profiles
 * and target capabilities to technical execution tiers (Tier A vs Tier B).
 * 
 * CORE RULE: NEVER fake unavailable instrumentation.
 * If an operator requires white-box access (e.g. TOKEN_ID_ACCESS, ATTENTION_ACCESS)
 * and the backend is a black-box commercial API, resolve as UNSUPPORTED or
 * PARTIALLY_SUPPORTED with an observable degradation path.
 */

import {
  TechnicalCapability,
  TechnicalBackendCapabilities,
  TechnicalOperator,
  TierResolutionResult,
  ExecutionTier,
  TechnicalModality,
} from '../types/technicalCore';
import { TargetEngine } from '../types';
import { TARGET_CAPABILITIES } from './targetCapabilities';
import { MODEL_ORGANISM_PROFILES } from '../data/modelProfiles';
import { getModelProfile } from './modelOrganismRegistry';

/**
 * List of all Tier B (white-box) capabilities that strictly require local
 * open pipelines or exposed instrumentation hooks.
 */
export const INSTRUMENTED_CAPABILITIES: readonly TechnicalCapability[] = [
  'TOKENIZER_ACCESS',
  'TOKEN_ID_ACCESS',
  'SEPARATE_CONDITIONING_BRANCHES',
  'TIMESTEP_CONTROL',
  'LATENT_ACCESS',
  'ATTENTION_ACCESS',
  'KV_PROJECTION_ACCESS',
  'VAE_ACCESS',
  'PYTORCH_HOOKS',
  'ROPE_CONFIGURATION',
] as const;

/**
 * Derives comprehensive technical capabilities for any model organism or target engine.
 * Aggregates knowledge from:
 * 1. Target capabilities (character limits, negative prompts, reference flags)
 * 2. Model organism profile (technical facts, technical parameters, model fingerprint)
 * 3. Local pipeline flags
 */
export function getBackendTechnicalCapabilities(
  modelId: string,
  targetEngine?: TargetEngine,
  isLocalPipelineOverride?: boolean
): TechnicalBackendCapabilities {
  // Retrieve or synthesize model organism profile
  const profile = getModelProfile(modelId, targetEngine || 'general');
  const facts = profile.technicalFacts;
  const platform = facts.platformId as TargetEngine;
  const targetCap = TARGET_CAPABILITIES[platform] || TARGET_CAPABILITIES.general;

  // Determine whether this backend is an instrumented local pipeline
  const isLocal =
    isLocalPipelineOverride !== undefined
      ? isLocalPipelineOverride
      : facts.capabilities.includes('local-diffusers') ||
        facts.capabilities.includes('pytorch-direct') ||
        Boolean(facts.technicalParameters?.isLocalPipeline);

  // Map modality
  const modality: TechnicalModality =
    facts.mediaType === 'audio' ? 'AUDIO' : facts.mediaType === 'video' ? 'VIDEO' : 'IMAGE';

  // Build capability flags
  const capabilities: Record<TechnicalCapability, boolean> = {
    // Observable (Tier A) capabilities
    TEXT_INPUT: true,
    NEGATIVE_PROMPT: Boolean(targetCap.supportsNegativePrompt),
    REFERENCE_IMAGE:
      facts.supportedReferences.includes('character_face') ||
      facts.supportedReferences.includes('style_reference') ||
      facts.supportedReferences.includes('image_reference') ||
      facts.supportedReferences.includes('spatial_pose') ||
      Boolean(targetCap.supportsReferenceIdentityLanguage),
    REFERENCE_VIDEO:
      facts.supportedReferences.includes('video_motion') ||
      Boolean(targetCap.supportsVideoMotion),
    REFERENCE_AUDIO:
      facts.supportedReferences.includes('audio_stem') ||
      facts.supportedReferences.includes('melody_reference') ||
      facts.supportedReferences.includes('timbre_reference'),
    IMAGE_TO_IMAGE:
      facts.capabilities.includes('image-to-image') ||
      facts.capabilities.includes('img2img') ||
      facts.supportedReferences.length > 0,
    VIDEO_CONTINUATION:
      facts.capabilities.includes('video-continuation') ||
      Boolean(targetCap.supportsVideoMotion),
    OUTPUT_REUSE: true, // Universal client-side observable capability
    SEED_CONTROL:
      facts.technicalParameters?.seed !== undefined ||
      platform === 'openart' ||
      platform === 'midjourney_flux',
    GUIDANCE_CONTROL:
      facts.technicalParameters?.guidance !== undefined ||
      platform === 'openart' ||
      platform === 'midjourney_flux',

    // White-box (Tier B) capabilities — only true on local/instrumented backends
    TOKENIZER_ACCESS: isLocal,
    TOKEN_ID_ACCESS: isLocal,
    SEPARATE_CONDITIONING_BRANCHES: isLocal,
    TIMESTEP_CONTROL: isLocal,
    LATENT_ACCESS: isLocal,
    ATTENTION_ACCESS: isLocal,
    KV_PROJECTION_ACCESS: isLocal,
    VAE_ACCESS: isLocal,
    PYTORCH_HOOKS: isLocal,
    LOCAL_PIPELINE: isLocal,
    ROPE_CONFIGURATION: isLocal,
  };

  const notes: string[] = [];
  if (!isLocal) {
    notes.push('Commercial/black-box API backend: Tier B instrumentation hooks are disabled.');
  } else {
    notes.push('Instrumented white-box pipeline active: Tensor and tokenizer access enabled.');
  }

  return {
    modelId,
    platformId: platform,
    displayName: facts.modelName || targetCap.displayName,
    isLocalPipeline: isLocal,
    supportedModalities: [modality],
    capabilities,
    notes,
  };
}

/**
 * Resolves whether a requested technical operator can execute on a specific backend.
 * Provides explicit, unvarnished causal diagnostics and handles degradation pathways.
 */
export function resolveExecutionTier(
  operator: TechnicalOperator,
  backend: TechnicalBackendCapabilities,
  requestedTier?: ExecutionTier
): TierResolutionResult {
  const targetTier = requestedTier || operator.executionTier;
  const missingCapabilities: TechnicalCapability[] = [];
  const availableCapabilities: TechnicalCapability[] = [];
  const reasons: string[] = [];

  // Check modality match
  const hasModalityOverlap = operator.supportedModalities.some((m) =>
    backend.supportedModalities.includes(m)
  );
  if (!hasModalityOverlap) {
    reasons.push(
      `Modality mismatch: Operator supports [${operator.supportedModalities.join(', ')}] but backend only supports [${backend.supportedModalities.join(', ')}].`
    );
  }

  // Audit all required capabilities
  for (const cap of operator.requiredCapabilities) {
    if (backend.capabilities[cap]) {
      availableCapabilities.push(cap);
    } else {
      missingCapabilities.push(cap);
    }
  }

  // Check if any missing capability is white-box/instrumented
  const missingWhiteBox = missingCapabilities.filter((c) =>
    INSTRUMENTED_CAPABILITIES.includes(c)
  );

  let status: TierResolutionResult['status'] = 'SUPPORTED';
  let resolvedTier: ExecutionTier = targetTier;
  let degradationPath = operator.degradationPath;
  let canDegradeToObservable = false;

  if (missingCapabilities.length > 0 || !hasModalityOverlap) {
    if (missingWhiteBox.length > 0) {
      // Operator asks for white-box access, but backend is black-box
      reasons.push(
        `Backend [${backend.displayName}] lacks required white-box access: [${missingWhiteBox.join(', ')}]. Commercial black-box API cannot inspect or intervene in internal tensors.`
      );

      // Check if observable degradation is available
      if (operator.executionTier === 'HYBRID' || operator.degradationPath) {
        status = 'PARTIALLY_SUPPORTED';
        resolvedTier = 'OBSERVABLE';
        canDegradeToObservable = true;
        reasons.push(
          `Degrading to OBSERVABLE tier: ${operator.degradationPath || 'Observable input mutation active without tensor instrumentation.'}`
        );
      } else {
        status = 'UNSUPPORTED';
        resolvedTier = 'OBSERVABLE';
        reasons.push(
          `Strict instrumented operator cannot execute on black-box model without required hooks.`
        );
      }
    } else {
      // Missing observable capabilities (e.g. negative prompt or reference audio)
      status = 'UNSUPPORTED';
      reasons.push(
        `Backend lacks necessary observable capabilities: [${missingCapabilities.join(', ')}].`
      );
    }
  } else {
    reasons.push(
      `All ${operator.requiredCapabilities.length} required capabilities verified on [${backend.displayName}].`
    );
  }

  return {
    status,
    resolvedTier,
    operatorId: operator.id,
    modelId: backend.modelId,
    requestedTier: targetTier,
    missingCapabilities,
    availableCapabilities,
    reasons,
    degradationPath,
    canDegradeToObservable,
  };
}
