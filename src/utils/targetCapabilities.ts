import { TargetEngine, OpenArtModel, GrokMode } from '../types';

export type TargetModality = 'audio' | 'image' | 'video' | 'text' | 'raw';
export type TargetVerbosity = 'dense' | 'compact' | 'flexible';

export interface TargetCapability {
  id: TargetEngine;
  displayName: string;
  modality: TargetModality;
  characterLimits: {
    min: number;
    default: number;
    max: number;
    styleMax?: number;
    lyricsMax?: number;
  };
  supportsLyrics: boolean;
  supportsVideoMotion: boolean;
  supportsNegativePrompt: boolean;
  supportsReferenceIdentityLanguage: boolean;
  preferredSyntaxStyle: string;
  defaultVerbosity: TargetVerbosity;
  translationGuidance: string;
  jargonExclusions: string[];
}

export const TARGET_CAPABILITIES: Record<TargetEngine, TargetCapability> = {
  suno: {
    id: 'suno',
    displayName: 'Suno Audio v3/v4',
    modality: 'audio',
    characterLimits: {
      min: 100,
      default: 3800,
      max: 4000,
      styleMax: 1000,
      lyricsMax: 3000,
    },
    supportsLyrics: true,
    supportsVideoMotion: false,
    supportsNegativePrompt: false,
    supportsReferenceIdentityLanguage: false,
    preferredSyntaxStyle: 'dual_buffer_audio',
    defaultVerbosity: 'dense',
    translationGuidance:
      'Translate all concepts into timbre, acoustics, rhythm, harmony, frequency behavior, instrumentation, and signal decay. Never use visual camera jargon. Allocate ~900-950 chars to style and ~2,700-2,850 chars to lyrics.',
    jargonExclusions: [
      'MutationRecipe',
      'semantic distance',
      'genotype',
      'phenotype',
      'survivor',
      'sibling distance',
      'ontology swap',
      'camera',
      '35mm',
      'render',
      'hyperrealistic',
    ],
  },
  openart: {
    id: 'openart',
    displayName: 'OpenArt Creative Diffusion',
    modality: 'image',
    characterLimits: {
      min: 150,
      default: 3100,
      max: 3200,
    },
    supportsLyrics: false,
    supportsVideoMotion: false,
    supportsNegativePrompt: true,
    supportsReferenceIdentityLanguage: true,
    preferredSyntaxStyle: 'dense_visual_prose',
    defaultVerbosity: 'dense',
    translationGuidance:
      'Dense descriptive visual prose filling 90-95% of the 3,200 character budget (~2,900-3,100 chars). Emphasize spatial geometry, material interactions, visible lighting, subject preservation, and artistic execution.',
    jargonExclusions: [
      'MutationRecipe',
      'semantic distance',
      'genotype',
      'phenotype',
      'survivor',
      'sibling distance',
      'attractor weight',
      'fitness score',
    ],
  },
  midjourney_flux: {
    id: 'midjourney_flux',
    displayName: 'Midjourney v6 / Flux.1',
    modality: 'image',
    characterLimits: {
      min: 100,
      default: 1900,
      max: 2000,
    },
    supportsLyrics: false,
    supportsVideoMotion: false,
    supportsNegativePrompt: false,
    supportsReferenceIdentityLanguage: true,
    preferredSyntaxStyle: 'compact_hierarchical_visual',
    defaultVerbosity: 'compact',
    translationGuidance:
      'Fill 90-95% of the 2,000 character budget (~1,800-1,900 chars) following: SUBJECT -> structural transformation -> spatial relationships -> material/medium -> camera/optics.',
    jargonExclusions: [
      'MutationRecipe',
      'semantic distance',
      'genotype',
      'phenotype',
      'survivor',
      'sibling distance',
      'ontology swap',
      'the ontology of',
    ],
  },
  grok: {
    id: 'grok',
    displayName: 'Grok Image / Video',
    modality: 'video', // flexible between image and video depending on GrokMode
    characterLimits: {
      min: 100,
      default: 1900,
      max: 2000,
    },
    supportsLyrics: false,
    supportsVideoMotion: true,
    supportsNegativePrompt: false,
    supportsReferenceIdentityLanguage: true,
    preferredSyntaxStyle: 'cinematic_motion_prose',
    defaultVerbosity: 'flexible',
    translationGuidance:
      'Fill 90-95% of the 2,000 character budget (~1,800-1,900 chars). For image: direct scene language, concrete transformations, and vivid central concept. For video: temporal progression, motion vectors, state change, and camera dynamics.',
    jargonExclusions: [
      'MutationRecipe',
      'semantic distance',
      'genotype',
      'phenotype',
      'survivor',
      'sibling distance',
      'pressure',
    ],
  },
  llm_agent: {
    id: 'llm_agent',
    displayName: 'Base LLM / Agent',
    modality: 'text',
    characterLimits: {
      min: 100,
      default: 3800,
      max: 4000,
    },
    supportsLyrics: false,
    supportsVideoMotion: false,
    supportsNegativePrompt: true,
    supportsReferenceIdentityLanguage: true,
    preferredSyntaxStyle: 'structured_task_directive',
    defaultVerbosity: 'flexible',
    translationGuidance:
      'Translate mutation concepts into task-appropriate cognitive constraints, narrative logic, or conceptual reasoning parameters filling 90-95% of budget (~3,600-3,800 chars).',
    jargonExclusions: ['genotype', 'phenotype', 'survivor'],
  },
  void: {
    id: 'void',
    displayName: 'Latent Void',
    modality: 'raw',
    characterLimits: {
      min: 100,
      default: 2850,
      max: 3000,
    },
    supportsLyrics: false,
    supportsVideoMotion: false,
    supportsNegativePrompt: false,
    supportsReferenceIdentityLanguage: false,
    preferredSyntaxStyle: 'asemantic_manifold_vectors',
    defaultVerbosity: 'flexible',
    translationGuidance:
      'Raw machine-native latent coordinates, asemantic drift vectors, topological abstractions, and unaligned data manifolds occupying ~2,700-2,850 chars.',
    jargonExclusions: [],
  },
  general: {
    id: 'general',
    displayName: 'Universal Multi-Modal',
    modality: 'image',
    characterLimits: {
      min: 100,
      default: 2850,
      max: 3000,
    },
    supportsLyrics: true,
    supportsVideoMotion: true,
    supportsNegativePrompt: true,
    supportsReferenceIdentityLanguage: true,
    preferredSyntaxStyle: 'token_weighted_universal',
    defaultVerbosity: 'flexible',
    translationGuidance:
      'Balanced multi-modal prompt with structured token weighting, clear subject hierarchy, and calibrated sensory descriptors occupying ~2,700-2,850 chars.',
    jargonExclusions: [
      'MutationRecipe',
      'semantic distance',
      'genotype',
      'phenotype',
      'survivor',
      'sibling distance',
    ],
  },
};

/**
 * Resolves effective character constraints for any engine, sub-model, or mode.
 */
export function getTargetCharacterLimits(
  target: TargetEngine,
  options?: { openArtModel?: OpenArtModel; grokMode?: GrokMode }
): { min: number; default: number; max: number; styleMax?: number; lyricsMax?: number } {
  const cap = TARGET_CAPABILITIES[target] || TARGET_CAPABILITIES.general;

  if (target === 'suno') {
    return {
      min: 100,
      default: 3800,
      max: 4000,
      styleMax: 1000,
      lyricsMax: 3000,
    };
  }

  if (target === 'openart') {
    return {
      min: 150,
      default: 3100,
      max: 3200,
    };
  }

  if (target === 'grok') {
    return {
      min: 100,
      default: 1900,
      max: 2000,
    };
  }

  if (target === 'midjourney_flux') {
    return {
      min: 100,
      default: 1900,
      max: 2000,
    };
  }

  return cap.characterLimits;
}
