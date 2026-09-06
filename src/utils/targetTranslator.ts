import {
  CommandMode,
  GrokMode,
  MutationRecipe,
  OpenArtModel,
  TargetEngine,
} from '../types';
import { TARGET_CAPABILITIES, getTargetCharacterLimits } from './targetCapabilities';
import { filterMutationJargon, compressToCharacterBudget, categorizeContentDna } from './characterBudget';

export interface TranslateTargetInput {
  concept: string;
  transformedConcept?: string;
  target: TargetEngine;
  recipe?: MutationRecipe | null;
  anchors?: string[];
  contentDna?: string[];
  targetLength?: number;
  openArtModel?: OpenArtModel;
  grokMode?: GrokMode;
  entropyLevel?: number;
  lineageTraits?: string[];
  lineageScars?: string[];
  commandMode?: CommandMode;
  isInstrumental?: boolean;
}

export interface TranslateTargetOutput {
  prompt: string;
  stylePrompt?: string;
  lyricsPrompt?: string;
  targetParameters?: string;
  translationSummary: string;
  tokenWeights?: string[];
  charCount: number;
  styleCharCount?: number;
  lyricsCharCount?: number;
}

/**
 * Checks whether user input or concept requests an instrumental piece.
 */
export function detectInstrumentalIntent(concept: string): boolean {
  if (!concept) return false;
  return /\b(?:instrumental|no vocals|no lyrics|without vocals|background music|ambient instrumental|solo instrument|orchestral)\b/i.test(
    concept
  );
}

/**
 * Translates abstract operator and attractor rules into concrete audio-native instructions for Suno.
 */
export function translateToAudioPhenotype(
  recipe: MutationRecipe | null | undefined,
  concept: string,
  entropy: number,
  isInstrumental: boolean
): { styleElements: string[]; lyricsDirectives: string[] } {
  const styleElements: string[] = [];
  const lyricsDirectives: string[] = [];

  const opIds = (recipe?.operators || []).map((o) => (typeof o === 'string' ? o : o.id));
  const atIds = (recipe?.attractors || []).map((a) => (typeof a === 'string' ? a : a.id));

  // Operator-to-Audio Translation
  if (opIds.includes('ontology_swap')) {
    styleElements.push('timbral re-synthesis replacing standard acoustic resonance with granular phase-locked frequency collisions');
  }
  if (opIds.includes('scale_schism')) {
    styleElements.push('extreme scale divergence: microscopic granular flutter in high frequencies while macro bass drones obey glacial half-time progression');
  }
  if (opIds.includes('concept_bleed')) {
    styleElements.push('timbral bleed where rhythmic percussive transient properties migrate across harmonic instrument layers');
  }
  if (opIds.includes('echo')) {
    styleElements.push('recursive tape-delay reflections decaying into degraded harmonic overtone residue');
  }
  if (opIds.includes('simulacrum')) {
    styleElements.push('motifs repeated with intentional transcription drift, each repetition corrupting pitch center');
  }
  if (opIds.includes('staged_paradox')) {
    styleElements.push('conventional melodic motif established then destabilized by irreconcilable microtonal tuning tension');
  }

  // Attractor-to-Audio Translation
  for (const at of atIds) {
    switch (at) {
      case 'void':
        styleElements.push('unstable negative space with sudden arrangement dropouts and impossible acoustic silence');
        lyricsDirectives.push('[Dropout: Silence swallows the harmonic bed]');
        break;
      case 'crystalline':
        styleElements.push('brittle high-Q resonant filter peaks, mathematical harmonic ratios, and angular bell-like transients');
        break;
      case 'mycorrhizal':
        styleElements.push('decentralized polyrhythm with distributed instrumental nodes trading short motifs without central lead');
        break;
      case 'simulacrum':
        lyricsDirectives.push('[Reprise: Phrasing disintegrates into corrupted stutter]');
        break;
      case 'chitinous':
        styleElements.push('dry click-percussion, skittering micro-fricatives, and rapid acoustic envelope gating');
        break;
      case 'hyperstition':
        styleElements.push('unsettling sub-bass undertones and binaural psychoacoustic frequency beats');
        break;
      default:
        break;
    }
  }

  if (isInstrumental) {
    lyricsDirectives.push('[Instrumental - No Vocalization]');
  } else if (entropy >= 7) {
    lyricsDirectives.push(
      '[Vocoder: Phase-inverted vocal synthesis]',
      '[Chorus: Rapid glossolalic phonetic clicks and fricatives]'
    );
  }

  return { styleElements, lyricsDirectives };
}

/**
 * Translates abstract operator and attractor rules into visible scene dynamics for image models.
 */
export function translateToImagePhenotype(
  recipe: MutationRecipe | null | undefined,
  concept: string,
  modelProfile: 'seedream' | 'banana' | 'midjourney' | 'grok' | 'general'
): { visualTransformations: string[]; materialBehaviors: string[]; compositionCues: string[] } {
  const visualTransformations: string[] = [];
  const materialBehaviors: string[] = [];
  const compositionCues: string[] = [];

  const opIds = (recipe?.operators || []).map((o) => (typeof o === 'string' ? o : o.id));
  const atIds = (recipe?.attractors || []).map((a) => (typeof a === 'string' ? a : a.id));

  // Translate operators into visible physical phenomena
  if (opIds.includes('ontology_swap')) {
    visualTransformations.push('anatomical boundary reorganized so that internal cavities fold into continuous exterior surfaces without breaking the recognizable posture');
  }
  if (opIds.includes('concept_bleed')) {
    visualTransformations.push('physical structural properties bleed across neighboring surfaces, blurring distinction between figure and immediate environment');
  }
  if (opIds.includes('scale_schism')) {
    materialBehaviors.push('microscopic surface texture exhibits dense geometric tessellation while global silhouettes remain soft and fluid');
  }
  if (opIds.includes('echo')) {
    visualTransformations.push('translucent temporal residue planes trailing slightly behind the primary subject, recording previous positions');
  }
  if (opIds.includes('simulacrum')) {
    visualTransformations.push('duplicated features diverge slightly in geometry as though each copy were drawn from a corrupted reference');
  }
  if (opIds.includes('staged_paradox')) {
    visualTransformations.push('coexistence of conflicting spatial laws: cast shadows fall toward the ambient light source');
  }

  // Model-specific styling cues
  if (modelProfile === 'seedream') {
    compositionCues.push('coherent volumetric scene layout with clear foreground focus, clean depth separation, and subtle atmospheric particulate');
  } else if (modelProfile === 'banana') {
    compositionCues.push('direct optical clarity, natural subject presence, and balanced photographic exposure');
  } else if (modelProfile === 'midjourney') {
    compositionCues.push('cinematic 35mm composition, directional rim lighting, tactile texture fidelity');
  } else if (modelProfile === 'grok') {
    compositionCues.push('dynamic perspective with dramatic chiaroscuro and atmospheric depth');
  }

  // Translate attractors into visible materials
  for (const at of atIds) {
    switch (at) {
      case 'void':
        materialBehaviors.push('regions of deep matte non-reflective absorption where ambient illumination drops to zero');
        break;
      case 'crystalline':
        materialBehaviors.push('faceted translucent planar joints and caustic refraction angles');
        break;
      case 'chitinous':
        materialBehaviors.push('segmented iridescent exoskeletal plates with dry specular highlights');
        break;
      case 'mycorrhizal':
        materialBehaviors.push('fine fibrous networks threading across intersecting surfaces');
        break;
      default:
        break;
    }
  }

  return { visualTransformations, materialBehaviors, compositionCues };
}

/**
 * Translates abstract operators into temporal motion and state progression for video engines.
 */
export function translateToVideoPhenotype(
  recipe: MutationRecipe | null | undefined,
  concept: string,
  entropy: number
): {
  initialState: string;
  motionVectors: string;
  transformationProgression: string;
  environmentalReaction: string;
  cameraDynamics: string;
  endingState: string;
} {
  const opIds = (recipe?.operators || []).map((o) => (typeof o === 'string' ? o : o.id));

  let motionVectors = 'Subject moves with continuous fluid momentum, establishing natural spatial displacement.';
  let transformationProgression = 'As the motion progresses, subtle structural shifts occur along moving edges.';

  if (opIds.includes('concept_bleed')) {
    transformationProgression = 'Motion causes physical properties from the subject to migrate into adjacent air and surfaces over time, leaving trailing structural wakes.';
  }
  if (opIds.includes('echo')) {
    transformationProgression = 'Each successive frame preserves a faint, degrading residue of previous motion, creating stacked temporal ripples.';
  }
  if (opIds.includes('simulacrum')) {
    transformationProgression = 'Each repeated cycle of movement reconstructs the subject with slight structural deviations from the initial cycle.';
  }
  if (opIds.includes('scale_schism')) {
    motionVectors = 'Macro-body follows slow cinematic momentum while micro-surface textures vibrate at high temporal frequency.';
  }

  return {
    initialState: `The scene opens on the recognizable subject in resting pose.`,
    motionVectors,
    transformationProgression,
    environmentalReaction: `The surrounding space responds with subtle atmospheric refraction matching the subject's displacement.`,
    cameraDynamics: `Smooth camera tracking slowly circles on an arc, maintaining the subject centered in frame.`,
    endingState: `The transformation stabilizes in an altered equilibrium as the motion cycle completes.`,
  };
}

/**
 * The Universal Target Translator contract.
 * Takes the internal transformed conceptual core (Genotype) and produces
 * the target-specific prompt (Phenotype).
 */
export function translateForTarget(input: TranslateTargetInput): TranslateTargetOutput {
  const {
    concept,
    transformedConcept,
    target,
    recipe,
    anchors = [],
    contentDna = [],
    targetLength = 1500,
    openArtModel = 'banana',
    grokMode = 'grok_image',
    entropyLevel = 5,
    isInstrumental = false,
  } = input;

  const limits = getTargetCharacterLimits(target, { openArtModel, grokMode });
  const baseCore = transformedConcept || concept;
  const categorizedDna = categorizeContentDna(contentDna);
  const effectiveInstrumental = isInstrumental || detectInstrumentalIntent(concept);

  // 1. SUNO AUDIO TRANSLATOR
  if (target === 'suno') {
    const audioData = translateToAudioPhenotype(recipe, concept, entropyLevel, effectiveInstrumental);

    const styleParts: string[] = [];
    // Base musical intent
    styleParts.push(baseCore);

    if (audioData.styleElements.length > 0) {
      styleParts.push(audioData.styleElements.join(', '));
    }

    if (categorizedDna.signal.length > 0) {
      styleParts.push(`Acoustic signal: ${categorizedDna.signal.join(', ')}`);
    }

    let stylePrompt = filterMutationJargon(styleParts.join('. '), 'suno');
    stylePrompt = compressToCharacterBudget(stylePrompt, limits.styleMax || 1000, {
      preservedAnchors: anchors,
      targetEngine: 'suno',
    });

    // Lyrics Prompt
    const lyricsParts: string[] = [];
    if (effectiveInstrumental) {
      lyricsParts.push('[Instrumental]');
      lyricsParts.push('[Intro: Atmospheric acoustic prelude]');
      lyricsParts.push('[Section A: Solo melody development]');
      lyricsParts.push('[Section B: Dynamic harmonic shift]');
      lyricsParts.push('[Outro: Reverberant decay to silence]');
    } else {
      if (audioData.lyricsDirectives.length > 0) {
        lyricsParts.push(audioData.lyricsDirectives.join('\n'));
      }
      lyricsParts.push('[Verse: Phonetic syllables]');
      lyricsParts.push('vel-sha tohr khrat-no va-zeem');
      lyricsParts.push('[Chorus: Rhythmic acoustic drive]');
      lyricsParts.push('soh-ren khla-vek oom-plih dah-khrr');
      lyricsParts.push('[Outro: Harmonic dissolution]');
    }

    let lyricsPrompt = filterMutationJargon(lyricsParts.join('\n'), 'suno');
    lyricsPrompt = compressToCharacterBudget(lyricsPrompt, limits.lyricsMax || 3000, {
      preservedAnchors: anchors,
      targetEngine: 'suno',
    });

    const combined = `[SUNO STYLE]\n${stylePrompt}\n\n[SUNO LYRICS]\n${lyricsPrompt}`;

    return {
      prompt: combined,
      stylePrompt,
      lyricsPrompt,
      translationSummary: `Translated to Suno audio phenotype (${effectiveInstrumental ? 'Instrumental' : 'Vocal/Gibberish'}; Style: ${stylePrompt.length} chars, Lyrics: ${lyricsPrompt.length} chars).`,
      charCount: combined.length,
      styleCharCount: stylePrompt.length,
      lyricsCharCount: lyricsPrompt.length,
    };
  }

  // 2. VIDEO TRANSLATOR (Grok Video / Kling-ready architecture)
  if (target === 'grok' && grokMode === 'grok_video') {
    const videoData = translateToVideoPhenotype(recipe, concept, entropyLevel);

    const videoSegments = [
      `[SUBJECT & INITIAL STATE]: ${baseCore}. ${videoData.initialState}`,
      `[MOTION DYNAMICS]: ${videoData.motionVectors}`,
      `[TEMPORAL MUTATION PROGRESSION]: ${videoData.transformationProgression}`,
      `[ENVIRONMENT & ATMOSPHERE]: ${videoData.environmentalReaction}`,
      `[CAMERA DIRECTION]: ${videoData.cameraDynamics}`,
      `[RESOLUTION]: ${videoData.endingState}`,
    ];

    let fullVideoPrompt = filterMutationJargon(videoSegments.join('\n'), 'grok');
    fullVideoPrompt = compressToCharacterBudget(fullVideoPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'grok',
    });

    return {
      prompt: fullVideoPrompt,
      translationSummary: `Translated to temporal video phenotype with explicit motion phases (${fullVideoPrompt.length} chars).`,
      charCount: fullVideoPrompt.length,
    };
  }

  // 3. SEEDREAM IMAGE TRANSLATOR (OpenArt: SeaDream)
  if (target === 'openart' && openArtModel === 'seadream') {
    const visualData = translateToImagePhenotype(recipe, concept, 'seedream');

    const sections = [
      `Subject: ${baseCore}.`,
      visualData.visualTransformations.length > 0
        ? `Visible transformation: ${visualData.visualTransformations.join('. ')}.`
        : '',
      visualData.materialBehaviors.length > 0
        ? `Material properties: ${visualData.materialBehaviors.join('. ')}.`
        : '',
      visualData.compositionCues.length > 0
        ? `Composition: ${visualData.compositionCues.join('. ')}.`
        : '',
      categorizedDna.structural.length > 0
        ? `Spatial structure: ${categorizedDna.structural.join(', ')}.`
        : '',
    ].filter(Boolean);

    let seedreamPrompt = filterMutationJargon(sections.join(' '), 'openart');
    seedreamPrompt = compressToCharacterBudget(seedreamPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'openart',
    });

    return {
      prompt: seedreamPrompt,
      translationSummary: `Translated to SeaDream high-density visual profile (${seedreamPrompt.length} chars).`,
      charCount: seedreamPrompt.length,
    };
  }

  // 4. BANANA / GEMINI IMAGE TRANSLATORS (OpenArt: Banana, Nano Bananas, Pro, Light)
  if (target === 'openart') {
    const visualData = translateToImagePhenotype(recipe, concept, 'banana');

    const sections = [
      baseCore,
      visualData.visualTransformations.join('. '),
      visualData.materialBehaviors.join('. '),
      visualData.compositionCues.join('. '),
    ].filter(Boolean);

    let bananaPrompt = filterMutationJargon(sections.join('. '), 'openart');
    bananaPrompt = compressToCharacterBudget(bananaPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'openart',
    });

    return {
      prompt: bananaPrompt,
      translationSummary: `Translated to OpenArt [${openArtModel}] natural-language visual profile (${bananaPrompt.length} chars).`,
      charCount: bananaPrompt.length,
    };
  }

  // 5. MIDJOURNEY / FLUX TRANSLATOR
  if (target === 'midjourney_flux') {
    const visualData = translateToImagePhenotype(recipe, concept, 'midjourney');

    const parts = [
      baseCore,
      visualData.visualTransformations.join(', '),
      visualData.materialBehaviors.join(', '),
      visualData.compositionCues.join(', '),
    ].filter(Boolean);

    let mjPrompt = filterMutationJargon(parts.join(', '), 'midjourney_flux');
    mjPrompt = compressToCharacterBudget(mjPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'midjourney_flux',
    });

    // Add standard Midjourney parameter tags
    const targetParams = '--ar 16:9 --v 6.1 --style raw';
    const finalPrompt = `${mjPrompt} ${targetParams}`.trim();

    return {
      prompt: finalPrompt,
      targetParameters: targetParams,
      translationSummary: `Translated to Midjourney/Flux compact high-signal visual prompt (${finalPrompt.length} chars).`,
      charCount: finalPrompt.length,
    };
  }

  // 6. GROK IMAGE TRANSLATOR
  if (target === 'grok') {
    const visualData = translateToImagePhenotype(recipe, concept, 'grok');

    const parts = [
      baseCore,
      visualData.visualTransformations.join('. '),
      visualData.compositionCues.join('. '),
    ].filter(Boolean);

    let grokPrompt = filterMutationJargon(parts.join('. '), 'grok');
    grokPrompt = compressToCharacterBudget(grokPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'grok',
    });

    return {
      prompt: grokPrompt,
      translationSummary: `Translated to Grok cinematic image profile (${grokPrompt.length} chars).`,
      charCount: grokPrompt.length,
    };
  }

  // 7. BASE LLM / AGENT TRANSLATOR
  if (target === 'llm_agent') {
    const directiveLines = [
      `[OBJECTIVE]: Reframe and explore the following concept:`,
      `"${baseCore}"`,
      `[STRUCTURAL CONSTRAINTS]:`,
      `- Preserve invariant identities: ${anchors.length > 0 ? anchors.join(', ') : 'core concept subject'}.`,
      `- Explore non-standard relational logic and emergent behavior.`,
      `- Maintain logical rigor while destabilizing tacit assumptions.`,
    ];

    let agentPrompt = filterMutationJargon(directiveLines.join('\n'), 'llm_agent');
    agentPrompt = compressToCharacterBudget(agentPrompt, limits.max, {
      preservedAnchors: anchors,
      targetEngine: 'llm_agent',
    });

    return {
      prompt: agentPrompt,
      translationSummary: `Translated to Base LLM structured task directive (${agentPrompt.length} chars).`,
      charCount: agentPrompt.length,
    };
  }

  // 8. LATENT VOID TRANSLATOR
  if (target === 'void') {
    const voidLines = [
      `[LATENT_COORDINATES // MANIFOLD_PROJECTION]`,
      `VECTOR_CORE: ${baseCore}`,
      `ASEMANTIC_TENSOR: [null_anchor: 0.0] -> [orthogonal_drift: ${(entropyLevel / 10).toFixed(2)}]`,
      `TOPOLOGY: non-euclidean zero-point equilibrium`,
    ];

    let voidPrompt = voidLines.join('\n');
    return {
      prompt: voidPrompt,
      translationSummary: `Projected into raw Latent Void manifold (${voidPrompt.length} chars).`,
      charCount: voidPrompt.length,
    };
  }

  // 9. GENERAL / MULTI-MODAL FALLBACK
  const generalText = filterMutationJargon(baseCore, 'general');
  const compressed = compressToCharacterBudget(generalText, limits.max, {
    preservedAnchors: anchors,
    targetEngine: 'general',
  });

  return {
    prompt: compressed,
    translationSummary: `Translated to universal multi-modal prompt (${compressed.length} chars).`,
    charCount: compressed.length,
  };
}
