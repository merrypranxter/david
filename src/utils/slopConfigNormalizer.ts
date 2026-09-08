import {
  SlopSeedingConfig,
  SlopRecipe,
  TargetEngine,
  CommandMode,
  OpenArtModel,
  GrokMode,
  StraitjacketLevel,
} from '../types';

/**
 * Normalizes any slop configuration object, safeguarding against legacy schemas,
 * missing attributes, string-based operator arrays, and corrupted JSON.
 */
export function normalizeSlopConfig(raw: any): SlopSeedingConfig {
  if (!raw || typeof raw !== 'object') {
    return {
      enableParadoxEngine: true,
      addMaths: false,
      addSciences: false,
      addSlop: true,
      contradictionMode: 'paradox',
      selectedSeeds: [],
      activePipeline: ['temporal_contradictions', 'token_splicing', 'mojibake'],
      mutationMode: 'auto',
      selectedOperators: [],
      selectedAttractors: [],
      selectedPressures: [],
      protectedAnchors: [],
      mutantSelectionMode: 'auto',
    };
  }

  // Defensively normalize selectedOperators whether they are string[] or object[]
  const rawOps = Array.isArray(raw.selectedOperators) ? raw.selectedOperators : [];
  const normalizedOps = rawOps
    .map((op: any) => {
      if (typeof op === 'string') {
        return { id: op, weight: 1.0, intensity: 0.8 };
      }
      if (op && typeof op === 'object' && op.id) {
        return {
          id: String(op.id),
          weight: typeof op.weight === 'number' ? op.weight : 1.0,
          intensity: typeof op.intensity === 'number' ? op.intensity : 0.8,
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; weight?: number; intensity?: number }>;

  // Defensively normalize selectedAttractors whether they are string[] or object[]
  const rawAttractors = Array.isArray(raw.selectedAttractors) ? raw.selectedAttractors : [];
  const normalizedAttractors = rawAttractors
    .map((at: any) => {
      if (typeof at === 'string') {
        return { id: at, weight: 1.0, intensity: 0.8 };
      }
      if (at && typeof at === 'object' && at.id) {
        return {
          id: String(at.id),
          weight: typeof at.weight === 'number' ? at.weight : 1.0,
          intensity: typeof at.intensity === 'number' ? at.intensity : 0.8,
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; weight?: number; intensity?: number }>;

  return {
    ...raw,
    enableParadoxEngine: raw.enableParadoxEngine ?? raw.paradoxEngine ?? true,
    addMaths: Boolean(raw.addMaths),
    mathCategory: raw.mathCategory,
    addSciences: Boolean(raw.addSciences),
    scienceCategory: raw.scienceCategory,
    addSlop: raw.addSlop ?? true,
    slopCategory: raw.slopCategory,
    contradictionMode: raw.contradictionMode || 'paradox',
    selectedSeeds: Array.isArray(raw.selectedSeeds) ? raw.selectedSeeds : [],
    activePipeline:
      Array.isArray(raw.activePipeline) && raw.activePipeline.length > 0
        ? raw.activePipeline
        : ['temporal_contradictions', 'token_splicing', 'mojibake'],
    mutationMode: raw.mutationMode || 'auto',
    selectedOperators: normalizedOps,
    selectedAttractors: normalizedAttractors,
    selectedPressures: Array.isArray(raw.selectedPressures) ? raw.selectedPressures : [],
    protectedAnchors: Array.isArray(raw.protectedAnchors) ? raw.protectedAnchors : [],
    mutantSelectionMode: raw.mutantSelectionMode || 'auto',
  };
}

/**
 * Normalizes a SlopRecipe loaded from storage or external JSON import.
 */
export function normalizeSlopRecipe(raw: any, fallbackIndex = 1): SlopRecipe {
  const now = Date.now();
  return {
    id: raw?.id || `recipe_${now}_${Math.random().toString(36).slice(2, 7)}`,
    name: raw?.name?.trim() || `Slop Recipe #${fallbackIndex}`,
    description: raw?.description?.trim() || '',
    createdAt: typeof raw?.createdAt === 'number' ? raw.createdAt : now,
    updatedAt: typeof raw?.updatedAt === 'number' ? raw.updatedAt : now,
    isFavorite: Boolean(raw?.isFavorite),
    isCurated: Boolean(raw?.isCurated),
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    concept: raw?.concept || '',
    target: (raw?.target as TargetEngine) || 'suno',
    targetLength: typeof raw?.targetLength === 'number' ? raw.targetLength : 2000,
    openArtModel: (raw?.openArtModel as OpenArtModel) || 'banana',
    grokMode: (raw?.grokMode as GrokMode) || 'grok_image',
    entropyLevel: typeof raw?.entropyLevel === 'number' ? raw.entropyLevel : 7,
    straitjacket: (raw?.straitjacket as StraitjacketLevel) || 'destabilize',
    commandMode: (raw?.commandMode as CommandMode) || 'dual',
    highThinking: Boolean(raw?.highThinking),
    useSearch: Boolean(raw?.useSearch),
    slopConfig: normalizeSlopConfig(raw?.slopConfig),
  };
}
