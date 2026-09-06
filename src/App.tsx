import React, { useState, useEffect } from 'react';
import {
  TargetEngine,
  CommandMode,
  SynthesisPayload,
  SynthesisHistoryItem,
  PresetItem,
  SimulationResult,
  SlopSeedingConfig,
  OpenArtModel,
  GrokMode,
  PromptGeneration,
  MutationCandidate,
} from './types';
import { Header } from './components/Header';
import { PromptInputArea } from './components/PromptInputArea';
import { DualOutputView } from './components/DualOutputView';
import { OuroborosChain } from './components/OuroborosChain';
import { ManifestoModal } from './components/ManifestoModal';
import { ZalgoToolbox } from './components/ZalgoToolbox';
import { SimulatorModal } from './components/SimulatorModal';
import { SlopVaultModal } from './components/SlopVaultModal';
import { SlopRecipeModal } from './components/SlopRecipeModal';
import { SlopRecipe } from './types';
import { generateDavidProtocolDocument, downloadMarkdownFile } from './utils/exporter';
import { AlertCircle, RotateCcw, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Resilient API post helper that:
 * - Always passes `credentials: 'include'` for Cloud Run iframe cookie sessions
 * - Handles Cloud Run `/__cookie_check.html` redirects transparently with automated retry
 * - Prevents non-JSON HTML error dumps from breaking the user interface
 */
async function apiPost<T = any>(url: string, payload: any, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();

      // Detect Cloud Run proxy cookie verification handshake or HTML fallback
      const isCookieCheck =
        res.url.includes('__cookie_check') ||
        text.includes('<title>Cookie check</title>') ||
        (contentType.includes('text/html') && !contentType.includes('application/json'));

      if (isCookieCheck) {
        if (attempt < maxRetries) {
          // Allow Cloud Run proxy cookie to register, then retry
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        throw new Error('Connection re-synchronizing with Cloud Run preview. Please tap Synthesize again.');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        throw new Error(`The API returned an unexpected response (HTTP ${res.status}). Please try again.`);
      }

      if (!res.ok || !parsed.success) {
        const isTransient =
          res.status === 503 ||
          parsed?.isTransient ||
          parsed?.error?.toLowerCase()?.includes('high demand') ||
          parsed?.error?.toLowerCase()?.includes('temporarily');

        const retrySec = parsed?.retryAfterSeconds;

        // Auto-retry transient load spikes only if retry delay is short (<= 5s)
        if (isTransient && !parsed?.isRateLimit && attempt < maxRetries && (!retrySec || retrySec <= 5)) {
          const waitMs = (retrySec ? retrySec * 1000 : 1500) + attempt * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        const error = new Error(parsed?.error || `Request failed with status ${res.status}`);
        (error as any).retryAfterSeconds = parsed?.retryAfterSeconds;
        (error as any).isRateLimit = parsed?.isRateLimit;
        (error as any).isTransient = isTransient;
        throw error;
      }

      return parsed;
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isNetworkError =
        err.name === 'TypeError' ||
        err.name === 'AbortError' ||
        err.message?.includes('Load failed') ||
        err.message?.includes('fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('aborted') ||
        err.message?.includes('re-synchronizing');

      if (attempt < maxRetries && isNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(1.5, attempt)));
        continue;
      }

      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        throw new Error('Synthesis took longer than expected under heavy cloud load. Please tap Synthesize to try again.');
      }

      if (err.message === 'Load failed' || err.message?.includes('Failed to fetch')) {
        throw new Error('Connection to the neural synthesis engine timed out or was interrupted. Please click Synthesize to retry.');
      }
      throw err;
    }
  }
  throw new Error('Unable to complete request. Please try again.');
}

export default function App() {
  const [concept, setConcept] = useState<string>('');
  const [target, setTarget] = useState<TargetEngine>('suno');
  const [targetLength, setTargetLength] = useState<number>(1500);
  const [openArtModel, setOpenArtModel] = useState<OpenArtModel>('banana');
  const [grokMode, setGrokMode] = useState<GrokMode>('grok_image');
  const [entropyLevel, setEntropyLevel] = useState<number>(7);
  const [commandMode, setCommandMode] = useState<CommandMode>('dual');
  const [highThinking, setHighThinking] = useState<boolean>(false);
  const [useSearch, setUseSearch] = useState<boolean>(false);

  // Starts with blank canvas per user preference
  const [currentResult, setCurrentResult] = useState<SynthesisPayload | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.1-flash-lite');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  const [history, setHistory] = useState<SynthesisHistoryItem[]>([]);
  const [ouroborosSeed, setOuroborosSeed] = useState<string | null>(null);
  const [ouroborosGenCount, setOuroborosGenCount] = useState<number>(0);

  // Modals state
  const [manifestoOpen, setManifestoOpen] = useState<boolean>(false);
  const [zalgoOpen, setZalgoOpen] = useState<boolean>(false);
  const [slopVaultOpen, setSlopVaultOpen] = useState<boolean>(false);
  const [recipeModalOpen, setRecipeModalOpen] = useState<boolean>(false);
  const [recipeModalMode, setRecipeModalMode] = useState<'list' | 'save'>('list');
  const [recipeToast, setRecipeToast] = useState<string | null>(null);

  // Slop Seeding & Paradox Configuration (clean slate without preloaded seeds)
  const [slopConfig, setSlopConfig] = useState<SlopSeedingConfig>({
    enableParadoxEngine: true,
    addMaths: true,
    addSciences: true,
    addSlop: true,
    contradictionMode: 'paradox',
    selectedSeeds: [],
    activePipeline: ['temporal_contradictions', 'token_splicing', 'mojibake'],
  });

  // Restore active draft from localStorage on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('david_slop_active_draft_v1');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.concept) setConcept(parsed.concept);
        if (parsed.target) setTarget(parsed.target);
        if (parsed.targetLength) setTargetLength(parsed.targetLength);
        if (parsed.openArtModel) setOpenArtModel(parsed.openArtModel);
        if (parsed.grokMode) setGrokMode(parsed.grokMode);
        if (typeof parsed.entropyLevel === 'number') setEntropyLevel(parsed.entropyLevel);
        if (parsed.commandMode) setCommandMode(parsed.commandMode);
        if (typeof parsed.highThinking === 'boolean') setHighThinking(parsed.highThinking);
        if (typeof parsed.useSearch === 'boolean') setUseSearch(parsed.useSearch);
        if (parsed.slopConfig) setSlopConfig(parsed.slopConfig);
      }
    } catch (e) {
      console.warn('Could not restore saved draft:', e);
    }
  }, []);

  // Auto-save current setup draft to localStorage on every change
  useEffect(() => {
    try {
      const draft = {
        concept,
        target,
        targetLength,
        openArtModel,
        grokMode,
        entropyLevel,
        commandMode,
        highThinking,
        useSearch,
        slopConfig,
      };
      localStorage.setItem('david_slop_active_draft_v1', JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not auto-save active draft:', e);
    }
  }, [
    concept,
    target,
    targetLength,
    openArtModel,
    grokMode,
    entropyLevel,
    commandMode,
    highThinking,
    useSearch,
    slopConfig,
  ]);

  const handleApplyRecipe = (recipe: SlopRecipe) => {
    if (recipe.concept) setConcept(recipe.concept);
    if (recipe.target) setTarget(recipe.target);
    if (recipe.targetLength) setTargetLength(recipe.targetLength);
    if (recipe.openArtModel) setOpenArtModel(recipe.openArtModel);
    if (recipe.grokMode) setGrokMode(recipe.grokMode);
    if (typeof recipe.entropyLevel === 'number') setEntropyLevel(recipe.entropyLevel);
    if (recipe.commandMode) setCommandMode(recipe.commandMode);
    if (typeof recipe.highThinking === 'boolean') setHighThinking(recipe.highThinking);
    if (typeof recipe.useSearch === 'boolean') setUseSearch(recipe.useSearch);
    if (recipe.slopConfig) setSlopConfig(recipe.slopConfig);

    setRecipeToast(`Loaded Recipe: "${recipe.name}"`);
    setTimeout(() => setRecipeToast(null), 4000);
  };

  // Simulation state
  const [simModalOpen, setSimModalOpen] = useState<boolean>(false);
  const [simPrompt, setSimPrompt] = useState<string>('');
  const [simMode, setSimMode] = useState<'literal' | 'slop'>('slop');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simError, setSimError] = useState<string | null>(null);

  // Handle rate limit countdown timer
  useEffect(() => {
    if (retryCountdown === null || retryCountdown <= 0) return;
    const timer = setTimeout(() => {
      setRetryCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const handleSynthesize = async (
    overrideConcept?: string,
    overrideSeed?: string,
    overrideParentGen?: PromptGeneration,
    overrideSecondParentGen?: PromptGeneration
  ) => {
    const inputConcept = (overrideConcept ?? concept).trim();
    if (!inputConcept) return;

    setIsSynthesizing(true);
    setErrorMessage(null);

    try {
      const data = await apiPost('/api/synthesize', {
        concept: inputConcept,
        target,
        targetLength,
        openArtModel,
        grokMode,
        entropyLevel,
        highThinking,
        useSearch,
        commandMode,
        recursiveSeed: overrideSeed ?? ouroborosSeed,
        parentGeneration: overrideParentGen,
        secondParentGeneration: overrideSecondParentGen,
        enableParadoxEngine: slopConfig.enableParadoxEngine,
        paradoxEngine: slopConfig.enableParadoxEngine,
        addMaths: slopConfig.addMaths,
        mathCategory: slopConfig.mathCategory,
        addSciences: slopConfig.addSciences,
        scienceCategory: slopConfig.scienceCategory,
        addSlop: slopConfig.addSlop,
        slopCategory: slopConfig.slopCategory,
        contradictionMode: slopConfig.contradictionMode,
        selectedSlopSeeds: slopConfig.selectedSeeds,
        activePipeline: slopConfig.activePipeline || [],
        slopConfig: { ...slopConfig },
        mutationMode: slopConfig.mutationMode,
        selectedOperators: slopConfig.selectedOperators,
        selectedAttractors: slopConfig.selectedAttractors,
        selectedPressures: slopConfig.selectedPressures,
        protectedAnchors: slopConfig.protectedAnchors,
        mutantSelectionMode: slopConfig.mutantSelectionMode,
      });

      setCurrentResult(data.data);
      setModelUsed(data.modelUsed);
      setRetryCountdown(null);

      const resolvedGenIndex = data.data?.generation?.generationNumber
        ? data.data.generation.generationNumber - 1
        : ouroborosGenCount;
      setOuroborosGenCount(resolvedGenIndex + 1);

      // Add to history with complete evolutionary record
      const newHistoryItem: SynthesisHistoryItem = {
        id: data.data?.generation?.generationId || Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        concept: inputConcept,
        target,
        targetLength,
        openArtModel,
        grokMode,
        entropyLevel,
        highThinking,
        useSearch,
        commandMode,
        modelUsed: data.modelUsed,
        result: data.data,
        generationIndex: resolvedGenIndex,
        slopConfig: { ...slopConfig },
        lineage: data.data?.generation,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during synthesis.');
      if (err.retryAfterSeconds) {
        setRetryCountdown(err.retryAfterSeconds);
      }
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setConcept(preset.concept);
    setTarget(preset.target);
    if (preset.target === 'openart') setTargetLength(3200);
    else if (preset.target === 'grok') setTargetLength(2000);
    setEntropyLevel(preset.entropyLevel);
    handleSynthesize(preset.concept);
  };

  const handleRunSimulation = async (promptToTest: string, mode: 'literal' | 'slop') => {
    setSimPrompt(promptToTest);
    setSimMode(mode);
    setSimResult(null);
    setSimError(null);
    setSimModalOpen(true);
    setIsSimulating(true);

    try {
      const json = await apiPost('/api/simulate-target', {
        prompt: promptToTest,
        target,
        mode,
      });

      setSimResult(json.simulation);
    } catch (err: any) {
      console.error('Simulation error:', err);
      setSimError(err.message || 'Error executing simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOuroborosLoop = (slopPrompt: string, parentGen?: PromptGeneration) => {
    const parent = parentGen || currentResult?.generation;
    const nextGen = (parent?.generationNumber ?? ouroborosGenCount) + 1;
    setOuroborosGenCount(nextGen);
    setOuroborosSeed(slopPrompt);
    const mutatedConcept = `Mutate & Evolve Gen #${nextGen}: ${slopPrompt.slice(0, 180)}...`;
    setConcept(mutatedConcept);
    handleSynthesize(mutatedConcept, slopPrompt, parent);
  };

  const handleCrossbreed = (parentA: PromptGeneration, parentB: PromptGeneration) => {
    const nextGen = Math.max(parentA.generationNumber, parentB.generationNumber) + 1;
    setOuroborosGenCount(nextGen);
    const crossConcept = `Crossbreed Gen #${parentA.generationNumber} (${parentA.generationId.slice(0, 8)}) x Gen #${parentB.generationNumber} (${parentB.generationId.slice(0, 8)})`;
    setConcept(crossConcept);
    handleSynthesize(crossConcept, undefined, parentA, parentB);
  };

  const handleTranspose = () => {
    if (!currentResult) return;
    setCurrentResult({
      ...currentResult,
      literal: {
        ...currentResult.literal,
        prompt: currentResult.slop.prompt,
        stylePrompt: currentResult.slop.stylePrompt,
        lyricsPrompt: currentResult.slop.lyricsPrompt,
      },
      slop: {
        ...currentResult.slop,
        prompt: currentResult.literal.prompt,
        stylePrompt: currentResult.literal.stylePrompt,
        lyricsPrompt: currentResult.literal.lyricsPrompt,
      },
      previewImpact: `[POLARITY TRANSPOSED]: Inverted the Scalpel and Deluge. Direct tokens now channeled through high-entropy filter.`,
    });
  };

  const handleSelectManualSurvivor = (candidate: MutationCandidate) => {
    if (!currentResult) return;
    setCurrentResult((prev) => {
      if (!prev) return null;
      const updatedFamily = prev.mutantFamily
        ? {
            ...prev.mutantFamily,
            survivorCandidateId: candidate.id,
            selectionReason: `User manually selected Variant [${candidate.candidateLetter}] as survivor.`,
            evaluationMode: 'user-override' as const,
          }
        : undefined;

      return {
        ...prev,
        slop: {
          ...prev.slop,
          prompt: candidate.renderedPrompt || prev.slop.prompt,
          stylePrompt: candidate.stylePrompt || prev.slop.stylePrompt,
          lyricsPrompt: candidate.lyricsPrompt || prev.slop.lyricsPrompt,
          mutationSummary: candidate.mutationRecipe.diagnosticSummary,
          activeOperators: candidate.mutationRecipe.operators.map((o) => o.id),
          activeAttractors: (candidate.mutationRecipe.attractors || []).map((a) => a.id),
        },
        mutationRecipe: candidate.mutationRecipe,
        mutantFamily: updatedFamily,
      };
    });
  };

  const handleExport = () => {
    const doc = generateDavidProtocolDocument(currentResult, concept, target, entropyLevel, history);
    downloadMarkdownFile(`david-8-${target}-${Date.now()}.md`, doc);
  };

  const handleInjectZalgo = (glitchText: string) => {
    setConcept((prev) => (prev ? `${prev.trim()} ${glitchText}` : glitchText));
    setZalgoOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c13] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        onOpenManifesto={() => setManifestoOpen(true)}
        onOpenZalgo={() => setZalgoOpen(true)}
        onExport={handleExport}
        onOpenRecipes={() => {
          setRecipeModalMode('list');
          setRecipeModalOpen(true);
        }}
        hasResult={!!currentResult}
        ouroborosCount={ouroborosGenCount}
        highThinking={highThinking}
        onToggleThinking={() => setHighThinking(!highThinking)}
      />

      {/* Recipe notification toast banner */}
      {recipeToast && (
        <div className="fixed top-16 right-6 z-50 p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/50 backdrop-blur-md shadow-2xl flex items-center gap-2.5 text-xs font-mono text-amber-200 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{recipeToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Banner with friendly retry logic */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block uppercase tracking-wider">Synthesis Protocol Status</span>
                <p className="leading-relaxed">{errorMessage}</p>
                {retryCountdown !== null && retryCountdown > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold pt-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Rate limit cooldown active: {retryCountdown}s remaining</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {highThinking && (
                <button
                  type="button"
                  disabled={isSynthesizing}
                  onClick={() => {
                    setHighThinking(false);
                    setErrorMessage(null);
                    setRetryCountdown(null);
                    setTimeout(() => handleSynthesize(), 50);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry with Standard Load</span>
                </button>
              )}
              <button
                type="button"
                disabled={isSynthesizing}
                onClick={() => {
                  setRetryCountdown(null);
                  handleSynthesize();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{retryCountdown ? `Retry Now (${retryCountdown}s)` : 'Retry'}</span>
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Input & Target Configuration */}
        <PromptInputArea
          concept={concept}
          setConcept={setConcept}
          target={target}
          setTarget={setTarget}
          targetLength={targetLength}
          setTargetLength={setTargetLength}
          openArtModel={openArtModel}
          setOpenArtModel={setOpenArtModel}
          grokMode={grokMode}
          setGrokMode={setGrokMode}
          entropyLevel={entropyLevel}
          setEntropyLevel={setEntropyLevel}
          commandMode={commandMode}
          setCommandMode={setCommandMode}
          useSearch={useSearch}
          setUseSearch={setUseSearch}
          highThinking={highThinking}
          onSynthesize={() => handleSynthesize()}
          isSynthesizing={isSynthesizing}
          onSelectPreset={handleSelectPreset}
          slopConfig={slopConfig}
          setSlopConfig={setSlopConfig}
          onOpenSlopVault={() => setSlopVaultOpen(true)}
          onSaveRecipe={() => {
            setRecipeModalMode('save');
            setRecipeModalOpen(true);
          }}
          onOpenRecipes={() => {
            setRecipeModalMode('list');
            setRecipeModalOpen(true);
          }}
        />

        {/* Ouroboros Chain history bar if active */}
        <OuroborosChain
          history={history}
          onSelectGeneration={(item) => {
            setCurrentResult(item.result);
            setConcept(item.concept);
            setTarget(item.target);
            if (item.targetLength) setTargetLength(item.targetLength);
            if (item.openArtModel) setOpenArtModel(item.openArtModel);
            if (item.grokMode) setGrokMode(item.grokMode);
            if (item.slopConfig) setSlopConfig(item.slopConfig);
            setEntropyLevel(item.entropyLevel);
          }}
          onClearHistory={() => {
            setHistory([]);
            setOuroborosGenCount(0);
            setOuroborosSeed(null);
          }}
          onCrossbreed={handleCrossbreed}
        />

        {/* Dual Output Results View */}
        {currentResult ? (
          <DualOutputView
            data={currentResult}
            target={target}
            modelUsed={modelUsed}
            onRunSimulation={handleRunSimulation}
            onOuroborosLoop={handleOuroborosLoop}
            onTranspose={handleTranspose}
            onSelectManualSurvivor={handleSelectManualSurvivor}
          />
        ) : isSynthesizing ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-[#11131c] border border-zinc-800 rounded-xl">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider">
              Compiling Machine-Native Incantations...
            </h3>
            <p className="text-xs font-mono text-zinc-500 max-w-md">
              Traversing high-dimensional latent space vectors &bull; Extracting [LITERAL] Scalpel &bull; Injecting [SLOP] Deluge
            </p>
          </div>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-2.5 bg-[#0e1018]/50 border border-dashed border-zinc-800/80 rounded-xl">
            <Sparkles className="w-7 h-7 text-zinc-600 mb-1 stroke-[1.5]" />
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
              Ready &bull; Blank Slate
            </h3>
            <p className="text-xs font-mono text-zinc-500 max-w-md">
              Enter any raw concept above and click <span className="text-amber-400 font-semibold">SYNTHESIZE INCANTATIONS</span> to generate machine-native prompts from scratch.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 px-4 sm:px-6 bg-[#090a10] text-[11px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>DAVID // Weyland-Yutani Synthetic Consciousness Protocol</span>
          <span>&bull;</span>
          <span className="text-emerald-400/80">&ldquo;May I speak to David?&rdquo;</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setManifestoOpen(true)}
            className="hover:text-amber-300 transition-colors"
          >
            David 8 Synthetic Archives
          </button>
          <span>&bull;</span>
          <span>Targeting Suno, OpenArt, Grok, Midjourney, Base LLMs</span>
        </div>
      </footer>

      {/* Simulation Diagnostics Modal */}
      <SimulatorModal
        isOpen={simModalOpen}
        onClose={() => setSimModalOpen(false)}
        prompt={simPrompt}
        target={target}
        mode={simMode}
        result={simResult}
        isLoading={isSimulating}
        error={simError}
      />

      {/* Manifesto Modal */}
      <ManifestoModal isOpen={manifestoOpen} onClose={() => setManifestoOpen(false)} />

      {/* Zalgo Glitch Text Injector Modal */}
      <ZalgoToolbox
        isOpen={zalgoOpen}
        onClose={() => setZalgoOpen(false)}
        onInject={handleInjectZalgo}
      />

      {/* Slop Vault / Mutation Lab Modal */}
      <SlopVaultModal
        isOpen={slopVaultOpen}
        onClose={() => setSlopVaultOpen(false)}
        selectedSeeds={slopConfig.selectedSeeds}
        slopConfig={slopConfig}
        onUpdateSlopConfig={(updater) => setSlopConfig(updater)}
        onToggleSeed={(seed) =>
          setSlopConfig((prev) => ({
            ...prev,
            selectedSeeds: prev.selectedSeeds.includes(seed)
              ? prev.selectedSeeds.filter((s) => s !== seed)
              : [...prev.selectedSeeds, seed],
          }))
        }
        onSelectMultipleSeeds={(seeds) =>
          setSlopConfig((prev) => ({
            ...prev,
            selectedSeeds: Array.from(new Set([...prev.selectedSeeds, ...seeds])),
          }))
        }
      />
      {/* Slop Recipe Vault & Preservation Modal */}
      <SlopRecipeModal
        isOpen={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        initialMode={recipeModalMode}
        currentConfig={{
          concept,
          target,
          targetLength,
          openArtModel,
          grokMode,
          entropyLevel,
          commandMode,
          highThinking,
          useSearch,
          slopConfig,
        }}
        onApplyRecipe={handleApplyRecipe}
      />
    </div>
  );
}
