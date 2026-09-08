import { SlopRecipe, SlopSeedingConfig, TargetEngine, CommandMode, OpenArtModel, GrokMode } from '../types';
import { normalizeSlopConfig, normalizeSlopRecipe } from './slopConfigNormalizer';

const STORAGE_KEY = 'david_slop_recipes_v1';
const DRAFT_STORAGE_KEY = 'david_active_draft_v1';

export const CURATED_SLOP_RECIPES: SlopRecipe[] = [
  {
    id: 'curated_suno_glitchcore',
    name: 'Suno Audio • Deep Glitchcore & Drone',
    description: '1k style + 3k lyrics loaded with audio token splicing, temporal paradox, and binary breakdowns.',
    createdAt: 1714000000000,
    updatedAt: 1714000000000,
    isFavorite: true,
    isCurated: true,
    tags: ['suno', 'audio', 'glitchcore', 'high-entropy'],
    concept: 'A mechanical bronze cathedral oscillating in boiling liquid mercury',
    target: 'suno',
    targetLength: 2000,
    openArtModel: 'banana',
    grokMode: 'grok_image',
    entropyLevel: 8,
    commandMode: 'dual',
    highThinking: false,
    useSearch: false,
    slopConfig: {
      enableParadoxEngine: true,
      addMaths: true,
      mathCategory: 'topology',
      addSciences: true,
      scienceCategory: 'thermodynamics',
      addSlop: true,
      slopCategory: 'brainrot',
      contradictionMode: 'paradox',
      selectedSeeds: ['submerged gear train', 'vacuum decay whistle', 'non-euclidean acoustic cavity'],
      activePipeline: ['temporal_contradictions', 'token_splicing', 'mojibake'],
      mutationMode: 'curated',
      selectedOperators: [
        { id: 'temporal_contradiction', weight: 1.5, intensity: 0.9 },
        { id: 'chimeric_graft', weight: 1.2, intensity: 0.8 },
      ],
      selectedAttractors: [{ id: 'entropy_cascade', weight: 1.4, intensity: 0.85 }],
      selectedPressures: ['maximize_structural_novelty', 'avoid_decorative_weirdness'],
      protectedAnchors: ['cathedral', 'bronze', 'mercury'],
      mutantSelectionMode: 'auto',
    },
  },
  {
    id: 'curated_flux_flesh_cathedral',
    name: 'Midjourney/Flux • Biomechanical Fleshwork',
    description: 'Engineered for dense image generation with chimeric anatomical grafting and dimensional folds.',
    createdAt: 1714000100000,
    updatedAt: 1714000100000,
    isFavorite: true,
    isCurated: true,
    tags: ['midjourney', 'flux', 'biomechanical', 'scifi'],
    concept: 'Gigeresque cryogenic sleep pod blooming with crystalline synthetic orchids',
    target: 'midjourney_flux',
    targetLength: 1200,
    openArtModel: 'banana',
    grokMode: 'grok_image',
    entropyLevel: 7,
    commandMode: 'dual',
    highThinking: false,
    useSearch: false,
    slopConfig: {
      enableParadoxEngine: true,
      addMaths: true,
      mathCategory: 'differential_geometry',
      addSciences: true,
      scienceCategory: 'synthetic_biology',
      addSlop: true,
      slopCategory: 'uncanny_valley',
      contradictionMode: 'symbiosis',
      selectedSeeds: ['vitrified neural axon', 'cryo-brine condensation', 'translucent ribcage scaffold'],
      activePipeline: ['semantic_drift', 'token_splicing', 'hyperstition_injection'],
      mutationMode: 'curated',
      selectedOperators: [
        { id: 'chimeric_graft', weight: 1.6, intensity: 0.9 },
        { id: 'dimensional_fold', weight: 1.3, intensity: 0.75 },
      ],
      selectedAttractors: [{ id: 'biological_decay', weight: 1.3, intensity: 0.8 }],
      selectedPressures: ['maximize_structural_novelty', 'preserve_identity'],
      protectedAnchors: ['cryogenic pod', 'orchids'],
      mutantSelectionMode: 'auto',
    },
  },
  {
    id: 'curated_grok_video_decay',
    name: 'Grok Video • Temporal Reality Glitch',
    description: 'High-motion prompt crafted for video engines with physics dissolution and ontological slippage.',
    createdAt: 1714000200000,
    updatedAt: 1714000200000,
    isFavorite: false,
    isCurated: true,
    tags: ['grok', 'video', 'cinematic', 'temporal'],
    concept: 'A 1970s television monitor playing footage of the room it is sitting inside while glass melts upward',
    target: 'grok',
    targetLength: 1800,
    openArtModel: 'banana',
    grokMode: 'grok_video',
    entropyLevel: 8,
    commandMode: 'slop',
    highThinking: false,
    useSearch: false,
    slopConfig: {
      enableParadoxEngine: true,
      addMaths: true,
      mathCategory: 'topology',
      addSciences: true,
      scienceCategory: 'relativity',
      addSlop: true,
      slopCategory: 'liminal_spaces',
      contradictionMode: 'dissonance',
      selectedSeeds: ['inverted CRT scanline', 'gravity inversion meniscus', 'infinite recursive loop'],
      activePipeline: ['temporal_contradictions', 'recursive_entropy_amplifier'],
      mutationMode: 'curated',
      selectedOperators: [
        { id: 'temporal_contradiction', weight: 1.8, intensity: 0.95 },
        { id: 'ontological_slippage', weight: 1.4, intensity: 0.85 },
      ],
      selectedAttractors: [{ id: 'infinite_recursion', weight: 1.5, intensity: 0.9 }],
      selectedPressures: ['maximize_structural_novelty', 'maximize_sibling_distance'],
      protectedAnchors: ['television monitor', 'melting glass'],
      mutantSelectionMode: 'auto',
    },
  },
  {
    id: 'curated_openart_banana_surrealism',
    name: 'OpenArt • Nano Banana Hyper-Dadaism',
    description: 'Tuned specifically for OpenArt banana architecture with absurd semantic cross-breeding.',
    createdAt: 1714000300000,
    updatedAt: 1714000300000,
    isFavorite: false,
    isCurated: true,
    tags: ['openart', 'banana', 'surrealism', 'dada'],
    concept: 'A Victorian parliament where every politician is a hyper-dense cluster of bismuth crystals arguing in semaphore',
    target: 'openart',
    targetLength: 3200,
    openArtModel: 'banana',
    grokMode: 'grok_image',
    entropyLevel: 9,
    commandMode: 'dual',
    highThinking: false,
    useSearch: false,
    slopConfig: {
      enableParadoxEngine: true,
      addMaths: true,
      mathCategory: 'discrete_math',
      addSciences: true,
      scienceCategory: 'crystallography',
      addSlop: true,
      slopCategory: 'dada_memetics',
      contradictionMode: 'free_drift',
      selectedSeeds: ['rainbow iridescent cleavage planes', 'parliamentary dispatch box of liquid argon'],
      activePipeline: ['mojibake', 'semantic_drift', 'token_splicing'],
      mutationMode: 'curated',
      selectedOperators: [
        { id: 'chimeric_graft', weight: 1.5, intensity: 0.9 },
        { id: 'scale_inversion', weight: 1.3, intensity: 0.8 },
      ],
      selectedAttractors: [{ id: 'entropy_cascade', weight: 1.4, intensity: 0.85 }],
      selectedPressures: ['maximize_structural_novelty', 'preserve_target_legibility'],
      protectedAnchors: ['victorian parliament', 'bismuth crystals'],
      mutantSelectionMode: 'auto',
    },
  },
];

/**
 * Safely check if localStorage is accessible in this iframe environment
 */
function isStorageSafe(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieve all recipes (combining user-saved recipes and curated templates)
 */
export function getAllRecipes(): SlopRecipe[] {
  if (!isStorageSafe()) {
    return [...CURATED_SLOP_RECIPES];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with curated recipes
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(CURATED_SLOP_RECIPES));
      return [...CURATED_SLOP_RECIPES];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((r, idx) => normalizeSlopRecipe(r, idx + 1));
    }
    return [...CURATED_SLOP_RECIPES];
  } catch (err) {
    console.warn('Failed to parse saved recipes from localStorage:', err);
    return [...CURATED_SLOP_RECIPES];
  }
}

/**
 * Save or update a recipe
 */
export function saveRecipe(
  recipeData: {
    id?: string;
    name: string;
    description?: string;
    isFavorite?: boolean;
    tags?: string[];
    concept: string;
    target: TargetEngine;
    targetLength: number;
    openArtModel: OpenArtModel;
    grokMode: GrokMode;
    entropyLevel: number;
    commandMode: CommandMode;
    highThinking: boolean;
    useSearch: boolean;
    slopConfig: SlopSeedingConfig;
  }
): SlopRecipe {
  const current = getAllRecipes();
  const now = Date.now();

  const id = recipeData.id || `recipe_${now}_${Math.random().toString(36).slice(2, 7)}`;
  const existingIndex = current.findIndex((r) => r.id === id);

  const fullRecipe: SlopRecipe = {
    id,
    name: recipeData.name.trim() || `Slop Recipe #${current.length + 1}`,
    description: recipeData.description?.trim() || '',
    createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : now,
    updatedAt: now,
    isFavorite: recipeData.isFavorite ?? (existingIndex >= 0 ? current[existingIndex].isFavorite : false),
    isCurated: false,
    tags: recipeData.tags || [recipeData.target, `e${recipeData.entropyLevel}`],
    concept: recipeData.concept || '',
    target: recipeData.target,
    targetLength: recipeData.targetLength,
    openArtModel: recipeData.openArtModel,
    grokMode: recipeData.grokMode,
    entropyLevel: recipeData.entropyLevel,
    commandMode: recipeData.commandMode,
    highThinking: recipeData.highThinking,
    useSearch: recipeData.useSearch,
    slopConfig: JSON.parse(JSON.stringify(recipeData.slopConfig)),
  };

  let updatedList: SlopRecipe[];
  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = fullRecipe;
  } else {
    updatedList = [fullRecipe, ...current];
  }

  if (isStorageSafe()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write recipe to localStorage:', e);
    }
  }

  return fullRecipe;
}

/**
 * Delete a recipe by ID
 */
export function deleteRecipe(id: string): boolean {
  const current = getAllRecipes();
  const filtered = current.filter((r) => r.id !== id);
  if (isStorageSafe()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete recipe from localStorage:', e);
      return false;
    }
  }
  return false;
}

/**
 * Toggle favorite status
 */
export function toggleFavoriteRecipe(id: string): boolean {
  const current = getAllRecipes();
  const target = current.find((r) => r.id === id);
  if (!target) return false;
  target.isFavorite = !target.isFavorite;
  target.updatedAt = Date.now();
  if (isStorageSafe()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return true;
    } catch (e) {
      console.error('Failed to update favorite status in localStorage:', e);
    }
  }
  return false;
}

/**
 * Export all user recipes as a formatted JSON string
 */
export function exportRecipesToJson(recipes?: SlopRecipe[]): string {
  const list = recipes || getAllRecipes();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: 'David 8 - VibeCode Slop Synthesizer',
      version: '1.0',
      count: list.length,
      recipes: list,
    },
    null,
    2
  );
}

/**
 * Import recipes from JSON string with validation
 */
export function importRecipesFromJson(jsonStr: string): { importedCount: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    const candidates: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.recipes)
      ? parsed.recipes
      : [];

    if (candidates.length === 0) {
      return { importedCount: 0, error: 'No valid recipes found in JSON payload.' };
    }

    const current = getAllRecipes();
    let importedCount = 0;

    for (const item of candidates) {
      if (!item.name || !item.target || typeof item.entropyLevel !== 'number') {
        continue;
      }
      const newId = `imported_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const importedRecipe: SlopRecipe = {
        id: newId,
        name: item.name,
        description: item.description || '',
        createdAt: item.createdAt || Date.now(),
        updatedAt: Date.now(),
        isFavorite: Boolean(item.isFavorite),
        isCurated: false,
        tags: Array.isArray(item.tags) ? item.tags : [item.target],
        concept: item.concept || '',
        target: item.target,
        targetLength: item.targetLength || 1500,
        openArtModel: item.openArtModel || 'banana',
        grokMode: item.grokMode || 'grok_image',
        entropyLevel: Math.max(1, Math.min(10, item.entropyLevel)),
        commandMode: item.commandMode || 'dual',
        highThinking: Boolean(item.highThinking),
        useSearch: Boolean(item.useSearch),
        slopConfig: item.slopConfig || {
          enableParadoxEngine: true,
          addMaths: true,
          addSciences: true,
          addSlop: true,
          contradictionMode: 'paradox',
          selectedSeeds: [],
        },
      };
      current.unshift(importedRecipe);
      importedCount++;
    }

    if (importedCount > 0 && isStorageSafe()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }

    return { importedCount };
  } catch (err: any) {
    return { importedCount: 0, error: err.message || 'Invalid JSON format' };
  }
}

/**
 * Auto-save the user's active draft continuously so that a page refresh or unexpected error NEVER wipes out their settings
 */
export function saveActiveDraft(draft: {
  concept: string;
  target: TargetEngine;
  targetLength: number;
  openArtModel: OpenArtModel;
  grokMode: GrokMode;
  entropyLevel: number;
  commandMode: CommandMode;
  highThinking: boolean;
  useSearch: boolean;
  slopConfig: SlopSeedingConfig;
}): void {
  if (!isStorageSafe()) return;
  try {
    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...draft,
        lastSaved: Date.now(),
      })
    );
  } catch (e) {
    // Silently ignore quota exceeded
  }
}

/**
 * Load the saved draft if one exists
 */
export function loadActiveDraft(): {
  concept?: string;
  target?: TargetEngine;
  targetLength?: number;
  openArtModel?: OpenArtModel;
  grokMode?: GrokMode;
  entropyLevel?: number;
  commandMode?: CommandMode;
  highThinking?: boolean;
  useSearch?: boolean;
  slopConfig?: SlopSeedingConfig;
  lastSaved?: number;
} | null {
  if (!isStorageSafe()) return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.slopConfig) {
      parsed.slopConfig = normalizeSlopConfig(parsed.slopConfig);
    }
    return parsed;
  } catch {
    return null;
  }
}
