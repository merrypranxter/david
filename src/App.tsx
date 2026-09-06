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
} from './types';
import { Header } from './components/Header';
import { PromptInputArea } from './components/PromptInputArea';
import { DualOutputView } from './components/DualOutputView';
import { OuroborosChain } from './components/OuroborosChain';
import { ManifestoModal } from './components/ManifestoModal';
import { ZalgoToolbox } from './components/ZalgoToolbox';
import { SimulatorModal } from './components/SimulatorModal';
import { SlopVaultModal } from './components/SlopVaultModal';
import { INITIAL_SYNTHESIS_RESULT } from './data/initialResult';
import { generateDavidProtocolDocument, downloadMarkdownFile } from './utils/exporter';
import { AlertCircle, RotateCcw, Clock } from 'lucide-react';

/**
 * Resilient API post helper that:
 * - Always passes `credentials: 'include'` for Cloud Run iframe cookie sessions
 * - Handles Cloud Run `/__cookie_check.html` redirects transparently with automated retry
 * - Prevents non-JSON HTML error dumps from breaking the user interface
 */
async function apiPost<T = any>(url: string, payload: any, maxRetries = 2): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

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
          await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
          continue;
        }
        throw new Error('Connection re-synchronizing with Cloud Run preview. Please tap Synthesize again.');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }
        throw new Error(`The API returned an unexpected response (HTTP ${res.status}). Please try again.`);
      }

      if (!res.ok || !parsed.success) {
        const error = new Error(parsed?.error || `Request failed with status ${res.status}`);
        (error as any).retryAfterSeconds = parsed?.retryAfterSeconds;
        (error as any).isRateLimit = parsed?.isRateLimit;
        throw error;
      }

      return parsed;
    } catch (err: any) {
      if (
        attempt < maxRetries &&
        (err.message?.includes('fetch') ||
          err.message?.includes('re-synchronizing') ||
          err.message?.includes('NetworkError') ||
          err.message?.includes('Failed to fetch'))
      ) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unable to complete request. Please try again.');
}

export default function App() {
  const [concept, setConcept] = useState<string>(
    'A high-bpm speedcore track performed in a massive Gothic cathedral with long reverb decay, but muffled by underwater acoustic filters and whispered ASMR vocals.'
  );
  const [target, setTarget] = useState<TargetEngine>('suno');
  const [targetLength, setTargetLength] = useState<number>(1500);
  const [openArtModel, setOpenArtModel] = useState<OpenArtModel>('banana');
  const [grokMode, setGrokMode] = useState<GrokMode>('grok_image');
  const [entropyLevel, setEntropyLevel] = useState<number>(7);
  const [commandMode, setCommandMode] = useState<CommandMode>('dual');
  const [highThinking, setHighThinking] = useState<boolean>(false);
  const [useSearch, setUseSearch] = useState<boolean>(false);

  // Pre-load with initial authentic synthesis result to avoid unnecessary API requests on mount
  const [currentResult, setCurrentResult] = useState<SynthesisPayload | null>(INITIAL_SYNTHESIS_RESULT);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.1-flash-lite');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  const [history, setHistory] = useState<SynthesisHistoryItem[]>([
    {
      id: 'init-seed',
      timestamp: Date.now() - 60000,
      concept:
        'A high-bpm speedcore track performed in a massive Gothic cathedral with long reverb decay, but muffled by underwater acoustic filters and whispered ASMR vocals.',
      target: 'suno',
      entropyLevel: 7,
      highThinking: false,
      useSearch: false,
      commandMode: 'dual',
      modelUsed: 'gemini-3.8-flash',
      result: INITIAL_SYNTHESIS_RESULT,
      generationIndex: 0,
    },
  ]);
  const [ouroborosSeed, setOuroborosSeed] = useState<string | null>(null);
  const [ouroborosGenCount, setOuroborosGenCount] = useState<number>(0);

  // Modals state
  const [manifestoOpen, setManifestoOpen] = useState<boolean>(false);
  const [zalgoOpen, setZalgoOpen] = useState<boolean>(false);
  const [slopVaultOpen, setSlopVaultOpen] = useState<boolean>(false);

  // Slop Seeding & Paradox Configuration
  const [slopConfig, setSlopConfig] = useState<SlopSeedingConfig>({
    enableParadoxEngine: true,
    addMaths: true,
    addSciences: true,
    addSlop: true,
    contradictionMode: 'paradox',
    selectedSeeds: [
      'Calabi–Yau manifold',
      'Rayleigh–Taylor instability',
      'anxious toaster',
      'Banach–Tarski paradox',
    ],
  });

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

  const handleSynthesize = async (overrideConcept?: string, overrideSeed?: string) => {
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
      });

      setCurrentResult(data.data);
      setModelUsed(data.modelUsed);
      setRetryCountdown(null);

      // Add to history
      const newHistoryItem: SynthesisHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
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
        generationIndex: ouroborosGenCount,
        slopConfig: { ...slopConfig },
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during synthesis.');
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

  const handleOuroborosLoop = (slopPrompt: string) => {
    const nextGen = ouroborosGenCount + 1;
    setOuroborosGenCount(nextGen);
    setOuroborosSeed(slopPrompt);
    const mutatedConcept = `Mutate & Amplify Gen #${nextGen}: ${slopPrompt.slice(0, 180)}...`;
    setConcept(mutatedConcept);
    handleSynthesize(mutatedConcept, slopPrompt);
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
        hasResult={!!currentResult}
        ouroborosCount={ouroborosGenCount}
        highThinking={highThinking}
        onToggleThinking={() => setHighThinking(!highThinking)}
      />

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
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={isSynthesizing || (retryCountdown !== null && retryCountdown > 0)}
                onClick={() => handleSynthesize()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                  retryCountdown !== null && retryCountdown > 0
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{retryCountdown ? `Wait ${retryCountdown}s` : 'Retry'}</span>
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
        ) : null}
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

      {/* Slop Vault / Lexicon Modal */}
      <SlopVaultModal
        isOpen={slopVaultOpen}
        onClose={() => setSlopVaultOpen(false)}
        selectedSeeds={slopConfig.selectedSeeds}
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
    </div>
  );
}
