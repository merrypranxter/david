import React, { useState, useMemo } from 'react';
import {
  SlopRecipe,
  TargetEngine,
  CommandMode,
  OpenArtModel,
  GrokMode,
  SlopSeedingConfig,
} from '../types';
import {
  getAllRecipes,
  saveRecipe,
  deleteRecipe,
  toggleFavoriteRecipe,
  exportRecipesToJson,
  importRecipesFromJson,
} from '../utils/recipeStorage';
import {
  Bookmark,
  BookmarkPlus,
  BookmarkCheck,
  Star,
  Trash2,
  Download,
  Upload,
  Check,
  X,
  Search,
  Sliders,
  Sparkles,
  Flame,
  Music,
  Eye,
  Brain,
  Video,
  Radio,
  FileCode,
  Copy,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

interface SlopRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'list' | 'save';
  // Current settings to save (supports both naming styles)
  currentSettings?: {
    concept: string;
    target: TargetEngine;
    targetLength?: number;
    openArtModel?: OpenArtModel;
    grokMode?: GrokMode;
    entropyLevel: number;
    commandMode: CommandMode;
    highThinking?: boolean;
    useSearch?: boolean;
    slopConfig: SlopSeedingConfig;
  };
  currentConfig?: {
    concept: string;
    target: TargetEngine;
    targetLength?: number;
    openArtModel?: OpenArtModel;
    grokMode?: GrokMode;
    entropyLevel: number;
    commandMode: CommandMode;
    highThinking?: boolean;
    useSearch?: boolean;
    slopConfig: SlopSeedingConfig;
  };
  // Callback when a recipe is chosen
  onApplyRecipe: (recipe: SlopRecipe) => void;
}

export const SlopRecipeModal: React.FC<SlopRecipeModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'list',
  currentSettings,
  currentConfig,
  onApplyRecipe,
}) => {
  const activeSettings = useMemo(() => {
    const s = currentConfig || currentSettings;
    return {
      concept: s?.concept || '',
      target: (s?.target || 'suno') as TargetEngine,
      targetLength: s?.targetLength || 1500,
      openArtModel: (s?.openArtModel || 'banana') as OpenArtModel,
      grokMode: (s?.grokMode || 'grok_image') as GrokMode,
      entropyLevel: typeof s?.entropyLevel === 'number' ? s.entropyLevel : 7,
      commandMode: (s?.commandMode || 'dual') as CommandMode,
      highThinking: !!s?.highThinking,
      useSearch: !!s?.useSearch,
      slopConfig: s?.slopConfig || {
        enableParadoxEngine: true,
        addMaths: true,
        addSciences: true,
        addSlop: true,
        contradictionMode: 'paradox',
        selectedSeeds: [],
        activePipeline: [],
      },
    };
  }, [currentConfig, currentSettings]);

  const [activeTab, setActiveTab] = useState<'save' | 'library' | 'transfer'>(
    initialMode === 'save' ? 'save' : 'library'
  );
  const [recipes, setRecipes] = useState<SlopRecipe[]>(() => getAllRecipes());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [targetFilter, setTargetFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Sync tab with initialMode when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode === 'save' ? 'save' : 'library');
    }
  }, [isOpen, initialMode]);

  // Save tab form state
  const defaultRecipeName = useMemo(() => {
    const targetLabel =
      activeSettings.target === 'suno'
        ? 'Suno Audio'
        : activeSettings.target === 'midjourney_flux'
        ? 'Midjourney/Flux'
        : activeSettings.target === 'openart'
        ? 'OpenArt'
        : activeSettings.target === 'grok'
        ? 'Grok'
        : activeSettings.target.toUpperCase();
    const conceptSnippet = activeSettings.concept.trim()
      ? activeSettings.concept.trim().slice(0, 30)
      : 'Slop Experiment';
    return `${conceptSnippet} • [${targetLabel} E${activeSettings.entropyLevel}]`;
  }, [activeSettings]);

  const [recipeName, setRecipeName] = useState<string>(defaultRecipeName);
  const [recipeDesc, setRecipeDesc] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Update default name when activeSettings change
  React.useEffect(() => {
    if (isOpen) {
      setRecipeName(defaultRecipeName);
    }
  }, [isOpen, defaultRecipeName]);

  // Transfer tab state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importResult, setImportResult] = useState<{ count?: number; error?: string } | null>(null);
  const [copiedExport, setCopiedExport] = useState<boolean>(false);

  // Refresh recipe list from storage
  const refreshList = () => {
    setRecipes(getAllRecipes());
  };

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeName.trim()) return;

    const saved = saveRecipe({
      name: recipeName.trim(),
      description: recipeDesc.trim(),
      concept: activeSettings.concept,
      target: activeSettings.target,
      targetLength: activeSettings.targetLength,
      openArtModel: activeSettings.openArtModel,
      grokMode: activeSettings.grokMode,
      entropyLevel: activeSettings.entropyLevel,
      commandMode: activeSettings.commandMode,
      highThinking: activeSettings.highThinking,
      useSearch: activeSettings.useSearch,
      slopConfig: activeSettings.slopConfig,
    });

    refreshList();
    setSaveSuccessMsg(`Recipe "${saved.name}" successfully saved!`);
    setTimeout(() => {
      setSaveSuccessMsg(null);
      setActiveTab('library');
    }, 1200);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete recipe "${name}"?`)) {
      deleteRecipe(id);
      refreshList();
    }
  };

  const handleToggleFav = (id: string) => {
    toggleFavoriteRecipe(id);
    refreshList();
  };

  const handleCopyExport = () => {
    const jsonStr = exportRecipesToJson(recipes);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 2000);
    });
  };

  const handleDownloadExport = () => {
    const jsonStr = exportRecipesToJson(recipes);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `david8-slop-recipes-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const res = importRecipesFromJson(importJsonText);
    if (res.importedCount > 0) {
      refreshList();
      setImportResult({ count: res.importedCount });
      setImportJsonText('');
      setTimeout(() => {
        setImportResult(null);
        setActiveTab('library');
      }, 1500);
    } else {
      setImportResult({ error: res.error || 'Failed to import recipes.' });
    }
  };

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    if (onlyFavorites && !r.isFavorite) return false;
    if (targetFilter !== 'all' && r.target !== targetFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = (r.description || '').toLowerCase().includes(q);
      const matchConcept = (r.concept || '').toLowerCase().includes(q);
      const matchTag = (r.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchConcept || matchTag;
    }
    return true;
  });

  const getTargetIcon = (tgt: TargetEngine) => {
    switch (tgt) {
      case 'suno':
        return <Music className="w-3.5 h-3.5 text-amber-400" />;
      case 'midjourney_flux':
        return <Eye className="w-3.5 h-3.5 text-purple-400" />;
      case 'openart':
        return <Brain className="w-3.5 h-3.5 text-cyan-400" />;
      case 'grok':
        return <Video className="w-3.5 h-3.5 text-red-400" />;
      case 'llm_agent':
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0f111a] border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden font-sans text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide uppercase font-mono text-zinc-100 flex items-center gap-2">
                <span>SLOP RECIPES ARCHIVE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-normal">
                  {recipes.length} Preserved
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Preserve and restore entire parameter matrices, mutation operators, seeds, and target choices
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-zinc-800 bg-[#121420] text-xs font-mono">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'library'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Saved Recipes ({recipes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('save')}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'save'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save Current Setup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transfer')}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'transfer'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup & Transfer</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search recipes by name, concept, operators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700/70 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700/70 rounded-lg px-2.5 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Engines</option>
                    <option value="suno">Suno Audio</option>
                    <option value="midjourney_flux">Midjourney/Flux</option>
                    <option value="openart">OpenArt</option>
                    <option value="grok">Grok</option>
                    <option value="llm_agent">LLM Agent</option>
                    <option value="void">The Void</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setOnlyFavorites((prev) => !prev)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono border transition-colors flex items-center gap-1.5 ${
                      onlyFavorites
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-zinc-900 border-zinc-700/70 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>Favorites</span>
                  </button>
                </div>
              </div>

              {/* Recipe Cards Grid */}
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl space-y-3">
                  <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-sm font-mono text-zinc-400">No saved slop recipes matched your filter.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('save')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save your current setup as a recipe</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/90 rounded-xl p-4 flex flex-col justify-between transition-all shadow-md relative"
                    >
                      <div className="space-y-2">
                        {/* Title & Favorite */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                                {getTargetIcon(recipe.target)}
                                <span className="uppercase">{recipe.target}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/40 border border-red-800/40 text-red-300">
                                <Flame className="w-2.5 h-2.5 text-red-400" />
                                <span>E-{recipe.entropyLevel}</span>
                              </span>
                              {recipe.isCurated && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/40 border border-cyan-800/30 text-cyan-300">
                                  CURATED
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                              {recipe.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleFav(recipe.id)}
                            className="text-zinc-500 hover:text-amber-400 p-1"
                            title="Toggle favorite"
                          >
                            <Star
                              className={`w-4 h-4 ${recipe.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
                            />
                          </button>
                        </div>

                        {/* Description / Concept */}
                        {recipe.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2">{recipe.description}</p>
                        )}
                        {recipe.concept && (
                          <div className="text-[11px] font-mono text-zinc-400 bg-black/40 border border-zinc-800/60 rounded p-2 line-clamp-2">
                            <span className="text-zinc-500 font-semibold">Concept:</span> {recipe.concept}
                          </div>
                        )}

                        {/* Active Pills Summary */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-mono text-zinc-500">
                          {recipe.slopConfig?.enableParadoxEngine && (
                            <span className="px-1.5 py-0.5 bg-purple-950/30 border border-purple-900/40 text-purple-300 rounded">
                              Paradox Engine
                            </span>
                          )}
                          {recipe.slopConfig?.addMaths && (
                            <span className="px-1.5 py-0.5 bg-blue-950/30 border border-blue-900/40 text-blue-300 rounded">
                              Maths
                            </span>
                          )}
                          {recipe.slopConfig?.addSciences && (
                            <span className="px-1.5 py-0.5 bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 rounded">
                              Sciences
                            </span>
                          )}
                          {recipe.slopConfig?.addSlop && (
                            <span className="px-1.5 py-0.5 bg-amber-950/30 border border-amber-900/40 text-amber-300 rounded">
                              Slop
                            </span>
                          )}
                          {recipe.slopConfig?.selectedOperators && recipe.slopConfig.selectedOperators.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                              {recipe.slopConfig.selectedOperators.length} Operators
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-zinc-800/80">
                        <span className="text-[10px] font-mono text-zinc-500">
                          Saved: {new Date(recipe.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {!recipe.isCurated && (
                            <button
                              type="button"
                              onClick={() => handleDelete(recipe.id, recipe.name)}
                              className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete recipe"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onApplyRecipe(recipe);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm hover:shadow"
                          >
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>Apply Recipe</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVE CURRENT SETUP */}
          {activeTab === 'save' && (
            <form onSubmit={handleSaveCurrent} className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                  <BookmarkPlus className="w-4 h-4" />
                  <span>PRESERVE COMPLETE SLOP RECIPE</span>
                </h3>
                <p className="text-xs text-zinc-300">
                  This will snapshot all current parameters, including your concept, target engine, entropy score,
                  selected paradox contradictions, lexicon toggles, mutation operators, and attractors.
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    required
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="e.g., Suno Glitchcore Cathedral Max Entropy"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Description & Personal Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={recipeDesc}
                    onChange={(e) => setRecipeDesc(e.target.value)}
                    placeholder="Why this combination works, target musical or visual aesthetic, etc."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Configuration snapshot preview */}
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
                  <div className="text-zinc-400 font-semibold border-b border-zinc-800 pb-2">
                    Current Configuration to be Saved:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">Target Engine:</span>{' '}
                      <span className="text-zinc-200 uppercase">{activeSettings.target}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Entropy Level:</span>{' '}
                      <span className="text-amber-400">{activeSettings.entropyLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Command Mode:</span>{' '}
                      <span className="text-zinc-200">{activeSettings.commandMode}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">High Thinking:</span>{' '}
                      <span className={activeSettings.highThinking ? 'text-purple-400' : 'text-zinc-500'}>
                        {activeSettings.highThinking ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Paradox Engine:</span>{' '}
                      <span className={activeSettings.slopConfig?.enableParadoxEngine ? 'text-emerald-400' : 'text-zinc-500'}>
                        {activeSettings.slopConfig?.enableParadoxEngine ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Active Operators:</span>{' '}
                      <span className="text-zinc-300">
                        {activeSettings.slopConfig?.selectedOperators?.length || 0} selected
                      </span>
                    </div>
                  </div>
                  {activeSettings.concept && (
                    <div className="text-[11px] pt-1">
                      <span className="text-zinc-500">Active Concept:</span>{' '}
                      <span className="text-zinc-300 italic">"{activeSettings.concept}"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold transition-all shadow-md"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Save Recipe Now</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BACKUP & TRANSFER */}
          {activeTab === 'transfer' && (
            <div className="space-y-6 max-w-2xl mx-auto font-mono text-xs">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Recipes to JSON</span>
                </h3>
                <p className="text-zinc-400">
                  Export all your saved slop recipes into a portable JSON file to back up your work or share with other
                  David 8 instances.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadExport}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyExport}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  >
                    {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedExport ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Import Recipes from JSON</span>
                </h3>
                <p className="text-zinc-400">
                  Paste previously exported JSON or recipe collections to merge them into your local vault.
                </p>
                {importResult?.count && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Successfully imported {importResult.count} recipes!</span>
                  </div>
                )}
                {importResult?.error && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded text-xs">
                    Error: {importResult.error}
                  </div>
                )}
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON recipe bundle here..."
                  className="w-full p-2.5 bg-black/60 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  disabled={!importJsonText.trim()}
                  onClick={handleImportSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Merge Imported Recipes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
