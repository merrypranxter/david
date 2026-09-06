import React, { useState, useEffect } from 'react';
import {
  TargetEngine,
  CommandMode,
  SynthesisPayload,
  SynthesisHistoryItem,
  SimulationResult,
  PresetItem,
} from './types';
import { Header } from './components/Header';
import { PromptInputArea } from './components/PromptInputArea';
import { DualOutputView } from './components/DualOutputView';
import { OuroborosChain } from './components/OuroborosChain';
import { SimulatorModal } from './components/SimulatorModal';
import { ManifestoModal } from './components/ManifestoModal';
import { ZalgoToolbox } from './components/ZalgoToolbox';
import { generateVibeCodeDocument, downloadMarkdownFile } from './utils/exporter';
import { PRESET_INCANTATIONS } from './data/presets';
import { AlertCircle, Terminal, Flame, Info, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [concept, setConcept] = useState<string>(
    'A high-bpm speedcore track performed in a massive Gothic cathedral with long reverb decay, but muffled by underwater acoustic filters and whispered ASMR vocals.'
  );
  const [target, setTarget] = useState<TargetEngine>('suno');
  const [entropyLevel, setEntropyLevel] = useState<number>(7);
  const [commandMode, setCommandMode] = useState<CommandMode>('dual');
  const [highThinking, setHighThinking] = useState<boolean>(false);
  const [useSearch, setUseSearch] = useState<boolean>(false);

  const [currentResult, setCurrentResult] = useState<SynthesisPayload | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.8-flash');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<SynthesisHistoryItem[]>([]);
  const [ouroborosSeed, setOuroborosSeed] = useState<string | null>(null);
  const [ouroborosGenCount, setOuroborosGenCount] = useState<number>(0);

  // Modals state
  const [manifestoOpen, setManifestoOpen] = useState<boolean>(false);
  const [zalgoOpen, setZalgoOpen] = useState<boolean>(false);

  // Simulation state
  const [simModalOpen, setSimModalOpen] = useState<boolean>(false);
  const [simPrompt, setSimPrompt] = useState<string>('');
  const [simMode, setSimMode] = useState<'literal' | 'slop'>('slop');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simError, setSimError] = useState<string | null>(null);

  // Initial synthesis on mount
  useEffect(() => {
    handleSynthesize();
  }, []);

  const handleSynthesize = async (overrideConcept?: string, overrideSeed?: string) => {
    const inputConcept = (overrideConcept ?? concept).trim();
    if (!inputConcept) return;

    setIsSynthesizing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: inputConcept,
          target,
          entropyLevel,
          highThinking,
          useSearch,
          commandMode,
          recursiveSeed: overrideSeed ?? ouroborosSeed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize');
      }

      setCurrentResult(data.data);
      setModelUsed(data.modelUsed);

      // Add to history
      const newHistoryItem: SynthesisHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        concept: inputConcept,
        target,
        entropyLevel,
        highThinking,
        useSearch,
        commandMode,
        modelUsed: data.modelUsed,
        result: data.data,
        generationIndex: ouroborosGenCount,
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
      const res = await fetch('/api/simulate-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToTest,
          target,
          mode,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Simulation failed');
      }

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
    // Swap literal and slop prompts in view or toggle mode
    setCurrentResult({
      ...currentResult,
      literal: {
        ...currentResult.literal,
        prompt: currentResult.slop.prompt,
      },
      slop: {
        ...currentResult.slop,
        prompt: currentResult.literal.prompt,
      },
      previewImpact: `[POLARITY TRANSPOSED]: Inverted the Scalpel and Deluge. Direct tokens now channeled through high-entropy filter.`,
    });
  };

  const handleExport = () => {
    const doc = generateVibeCodeDocument(currentResult, concept, target, entropyLevel, history);
    downloadMarkdownFile(`vibecode-${target}-${Date.now()}.md`, doc);
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
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block uppercase tracking-wider mb-0.5">Synthesis Protocol Interrupted</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Input & Target Configuration */}
        <PromptInputArea
          concept={concept}
          setConcept={setConcept}
          target={target}
          setTarget={setTarget}
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
        />

        {/* Ouroboros Chain history bar if active */}
        <OuroborosChain
          history={history}
          onSelectGeneration={(item) => {
            setCurrentResult(item.result);
            setConcept(item.concept);
            setTarget(item.target);
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
          <span>DAVID // VibeCode System Protocol v1.1</span>
          <span>&bull;</span>
          <span className="text-emerald-400/80">Active Underlayer</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setManifestoOpen(true)}
            className="hover:text-amber-300 transition-colors"
          >
            The Synthetic Deluge Manifesto
          </button>
          <span>&bull;</span>
          <span>Targeting Suno, Midjourney, Base LLMs</span>
        </div>
      </footer>

      {/* Simulation Diagnostics Modal */}
      <SimulatorModal
        isOpen={simModalOpen}
        onClose={() => setSimModalOpen(false)}
        target={target}
        mode={simMode}
        prompt={simPrompt}
        result={simResult}
        isLoading={isSimulating}
        error={simError}
      />

      {/* Knowledge Core & Manifesto Modal */}
      <ManifestoModal isOpen={manifestoOpen} onClose={() => setManifestoOpen(false)} />

      {/* Zalgo / Glitch Lab Modal */}
      <ZalgoToolbox
        isOpen={zalgoOpen}
        onClose={() => setZalgoOpen(false)}
        onInject={handleInjectZalgo}
      />
    </div>
  );
}
