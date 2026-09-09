import React, { useState, useEffect } from "react";
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
  LiteralResult,
  SlopResult,
  StraitjacketLevel,
} from "./types";
import { Header } from "./components/Header";
import { PromptInputArea } from "./components/PromptInputArea";
import { DualOutputView } from "./components/DualOutputView";
import { OuroborosChain } from "./components/OuroborosChain";
import { ManifestoModal } from "./components/ManifestoModal";
import { ZalgoToolbox } from "./components/ZalgoToolbox";
import { SimulatorModal } from "./components/SimulatorModal";
import { SlopVaultModal } from "./components/SlopVaultModal";
import { SlopRecipeModal } from "./components/SlopRecipeModal";
import { DavidAppWorkbench } from "./components/DavidAppWorkbench";
import { SerializationDiagnosticsPanel } from "./components/SerializationDiagnosticsPanel";
import { ContextDiagnosticsPanel } from "./components/ContextDiagnosticsPanel";
import { StructuralRelationalPanel } from "./components/StructuralRelationalPanel";
import { GuidanceGeometryPanel } from "./components/GuidanceGeometryPanel";
import { DiscoveryLabPanel } from "./components/DiscoveryLabPanel";
import { ExperimentMemoryModal } from "./components/ExperimentMemoryModal";
import { logEmpiricalRun, loadAllRuns } from "./utils/empiricalLearningEngine";
import { loadDiscoveryRecipes } from "./utils/discoveryEngine";
import { normalizeSlopConfig } from "./utils/slopConfigNormalizer";
import { SlopRecipe } from "./types";
import {
  generateDavidProtocolDocument,
  downloadMarkdownFile,
} from "./utils/exporter";
import { apiFetch } from "./cloudRunFetchGuard";
import { dispatchDavidIntent } from "./utils/davidWorkbenchBus";
import {
  AlertCircle,
  MessageSquare,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/**
 * Resilient API post helper that:
 * - Always passes `credentials: 'include'` for Cloud Run iframe cookie sessions
 * - Handles Cloud Run `/__cookie_check.html` redirects transparently with automated retry
 * - Prevents non-JSON HTML error dumps from breaking the user interface
 */
async function apiPost<T = any>(
  url: string,
  payload: any,
  maxRetries = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await apiFetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // Detect Cloud Run proxy cookie verification handshake or HTML fallback
      const isCookieCheck =
        res.url.includes("__cookie_check") ||
        text.includes("<title>Cookie check</title>") ||
        (contentType.includes("text/html") &&
          !contentType.includes("application/json"));

      if (isCookieCheck) {
        if (attempt < maxRetries) {
          // Allow Cloud Run proxy cookie to register, then retry
          await new Promise((resolve) =>
            setTimeout(resolve, 800 * (attempt + 1)),
          );
          continue;
        }
        throw new Error(
          "Connection re-synchronizing with Cloud Run preview. Please tap Synthesize again.",
        );
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 800 * (attempt + 1)),
          );
          continue;
        }
        throw new Error(
          `The API returned an unexpected response (HTTP ${res.status}). Please try again.`,
        );
      }

      if (!res.ok || !parsed.success) {
        const isTransient =
          res.status === 503 ||
          parsed?.isTransient ||
          parsed?.error?.toLowerCase()?.includes("high demand") ||
          parsed?.error?.toLowerCase()?.includes("temporarily");

        const retrySec = parsed?.retryAfterSeconds;

        // Auto-retry transient load spikes only if retry delay is short (<= 5s)
        if (
          isTransient &&
          !parsed?.isRateLimit &&
          attempt < maxRetries &&
          (!retrySec || retrySec <= 5)
        ) {
          const waitMs = (retrySec ? retrySec * 1000 : 1500) + attempt * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        const error = new Error(
          parsed?.error || `Request failed with status ${res.status}`,
        );
        (error as any).retryAfterSeconds = parsed?.retryAfterSeconds;
        (error as any).isRateLimit = parsed?.isRateLimit;
        (error as any).isTransient = isTransient;
        throw error;
      }

      return parsed;
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isNetworkError =
        err.name === "TypeError" ||
        err.name === "AbortError" ||
        err.message?.includes("Load failed") ||
        err.message?.includes("fetch") ||
        err.message?.includes("NetworkError") ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("aborted") ||
        err.message?.includes("re-synchronizing");

      if (attempt < maxRetries && isNetworkError) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(1.5, attempt)),
        );
        continue;
      }

      if (err.name === "AbortError" || err.message?.includes("aborted")) {
        throw new Error(
          "Synthesis took longer than expected under heavy cloud load. Please tap Synthesize to try again.",
        );
      }

      if (
        err.message === "Load failed" ||
        err.message?.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to the neural synthesis engine timed out or was interrupted. Please click Synthesize to retry.",
        );
      }
      throw err;
    }
  }
  throw new Error("Unable to complete request. Please try again.");
}

export default function App() {
  const [concept, setConcept] = useState<string>("");
  const [target, setTarget] = useState<TargetEngine>("suno");
  const [targetLength, setTargetLength] = useState<number>(1500);
  const [openArtModel, setOpenArtModel] = useState<OpenArtModel>("banana");
  const [grokMode, setGrokMode] = useState<GrokMode>("grok_image");
  const [entropyLevel, setEntropyLevel] = useState<number>(7);
  const [straitjacketLevel, setStraitjacketLevel] =
    useState<StraitjacketLevel>("destabilize");
  const [commandMode, setCommandMode] = useState<CommandMode>("dual");
  const [highThinking, setHighThinking] = useState<boolean>(false);
  const [useSearch, setUseSearch] = useState<boolean>(false);

  // Starts with blank canvas per user preference
  const [currentResult, setCurrentResult] = useState<SynthesisPayload | null>(
    null,
  );
  const [modelUsed, setModelUsed] = useState<string>("gemini-3.1-flash-lite");
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
  const [recipeModalMode, setRecipeModalMode] = useState<"list" | "save">(
    "list",
  );
  const [recipeToast, setRecipeToast] = useState<string | null>(null);

  // Job 7: Empirical Experiment Memory States
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [experimentModalOpen, setExperimentModalOpen] =
    useState<boolean>(false);
  const [experimentModalRunId, setExperimentModalRunId] = useState<
    string | null
  >(null);
  const [empiricalRunCount, setEmpiricalRunCount] = useState<number>(() => {
    try {
      return Object.keys(loadAllRuns()).length;
    } catch {
      return 0;
    }
  });

  // Job 8: Discovery Engine State
  const [discoveryCount, setDiscoveryCount] = useState<number>(() => {
    try {
      return Object.keys(loadDiscoveryRecipes()).length;
    } catch {
      return 0;
    }
  });

  // Slop Seeding & Paradox Configuration (clean slate without preloaded seeds)
  const [slopConfig, setSlopConfig] = useState<SlopSeedingConfig>({
    enableParadoxEngine: true,
    addMaths: true,
    addSciences: true,
    addSlop: true,
    contradictionMode: "paradox",
    selectedSeeds: [],
    activePipeline: ["temporal_contradictions", "token_splicing", "mojibake"],
  });

  // UI Styling Theme
  const [phosphorTheme, setPhosphorTheme] = useState<string>(
    () => localStorage.getItem("david_phosphor_theme") || "theme-mother-green",
  );
  const [crtMode, setCrtMode] = useState<string>(
    () => localStorage.getItem("david_crt_mode") || "crt-clean",
  );

  useEffect(() => {
    localStorage.setItem("david_phosphor_theme", phosphorTheme);
    localStorage.setItem("david_crt_mode", crtMode);

    // Clear old themes
    document.body.classList.remove(
      "theme-mother-green",
      "theme-merry-magenta",
      "theme-synthetic-violet",
      "theme-acid-yellow",
      "theme-cryo-cyan",
      "theme-solar-orange",
      "crt-off",
      "crt-clean",
      "crt-aged",
    );

    document.body.classList.add(phosphorTheme, crtMode);
  }, [phosphorTheme, crtMode]);

  // Restore active draft from localStorage on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("david_slop_active_draft_v1");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.concept) setConcept(parsed.concept);
        if (parsed.target) setTarget(parsed.target);
        if (parsed.targetLength) setTargetLength(parsed.targetLength);
        if (parsed.openArtModel) setOpenArtModel(parsed.openArtModel);
        if (parsed.grokMode) setGrokMode(parsed.grokMode);
        if (typeof parsed.entropyLevel === "number")
          setEntropyLevel(parsed.entropyLevel);
        if (parsed.straitjacket) setStraitjacketLevel(parsed.straitjacket);
        if (parsed.commandMode) setCommandMode(parsed.commandMode);
        if (typeof parsed.highThinking === "boolean")
          setHighThinking(parsed.highThinking);
        if (typeof parsed.useSearch === "boolean")
          setUseSearch(parsed.useSearch);
        if (parsed.slopConfig)
          setSlopConfig(normalizeSlopConfig(parsed.slopConfig));
      }
    } catch (e) {
      console.warn("Could not restore saved draft:", e);
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
        straitjacket: straitjacketLevel,
        commandMode,
        highThinking,
        useSearch,
        slopConfig,
      };
      localStorage.setItem("david_slop_active_draft_v1", JSON.stringify(draft));
    } catch (e) {
      console.warn("Could not auto-save active draft:", e);
    }
  }, [
    concept,
    target,
    targetLength,
    openArtModel,
    grokMode,
    entropyLevel,
    straitjacketLevel,
    commandMode,
    highThinking,
    useSearch,
    slopConfig,
  ]);

  const handleApplyRecipe = (recipe: SlopRecipe) => {
    if (recipe.concept) {
      dispatchDavidIntent({
        source: "saved-recipe",
        label: `Restore Recipe: ${recipe.name}`,
        committed: true,
        changes: {
          storedPrompt: recipe.concept,
          instruction:
            "Restore this saved prompt faithfully as MAIN PROMPT, reconciling only current global locks. Do not creatively rewrite it unless needed to satisfy a current lock.",
        },
      });
    }
    if (recipe.target) setTarget(recipe.target);
    if (recipe.targetLength) setTargetLength(recipe.targetLength);
    if (recipe.openArtModel) setOpenArtModel(recipe.openArtModel);
    if (recipe.grokMode) setGrokMode(recipe.grokMode);
    if (typeof recipe.entropyLevel === "number")
      setEntropyLevel(recipe.entropyLevel);
    if (recipe.straitjacket) setStraitjacketLevel(recipe.straitjacket);
    if (recipe.commandMode) setCommandMode(recipe.commandMode);
    if (typeof recipe.highThinking === "boolean")
      setHighThinking(recipe.highThinking);
    if (typeof recipe.useSearch === "boolean") setUseSearch(recipe.useSearch);
    if (recipe.slopConfig)
      setSlopConfig(normalizeSlopConfig(recipe.slopConfig));

    setRecipeToast(`Loaded Recipe: "${recipe.name}"`);
    setTimeout(() => setRecipeToast(null), 4000);
  };

  // Simulation state
  const [simModalOpen, setSimModalOpen] = useState<boolean>(false);
  const [simPrompt, setSimPrompt] = useState<string>("");
  const [simMode, setSimMode] = useState<"literal" | "slop">("slop");
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
    overrideSecondParentGen?: PromptGeneration,
  ) => {
    const inputConcept = (overrideConcept ?? concept).trim();
    if (!inputConcept) return;

    setIsSynthesizing(true);
    setErrorMessage(null);

    try {
      const data = await apiPost("/api/synthesize", {
        concept: inputConcept,
        target,
        targetLength,
        openArtModel,
        grokMode,
        entropyLevel,
        straitjacket: straitjacketLevel,
        highThinking,
        useSearch,
        commandMode,
        recursiveSeed: overrideSeed ?? ouroborosSeed,
        parentGeneration: overrideParentGen,
        secondParentGeneration: overrideSecondParentGen,
        // WORKBENCH_SOURCE_OF_TRUTH_V2
        // MAIN PROMPT has already been reconciled by DAVID. Synthesis must not secretly
        // re-apply Mutation Lab DNA/operators/pipelines a second time behind the user's back.
        workbenchSourceOfTruth: true,
        enableMutationEngine: false,
        enableParadoxEngine: false,
        paradoxEngine: false,
        addMaths: false,
        addSciences: false,
        addSlop: false,
        contradictionMode: "free_drift",
        selectedSlopSeeds: [],
        activePipeline: [],
        selectedOperators: [],
        selectedAttractors: [],
        selectedContentSeeds: [],
        selectedPressures: [],
        protectedAnchors: [],
        mutantSelectionMode: "off",
        slopConfig: {
          enableParadoxEngine: false,
          paradoxEngine: false,
          addMaths: false,
          addSciences: false,
          addSlop: false,
          contradictionMode: "free_drift",
          selectedSeeds: [],
          activePipeline: [],
          selectedOperators: [],
          selectedAttractors: [],
          selectedPressures: [],
          protectedAnchors: [],
          mutantSelectionMode: "off",
        },
      });

      setCurrentResult(data.data);
      setModelUsed(data.modelUsed);
      setRetryCountdown(null);

      const resolvedGenIndex = data.data?.generation?.generationNumber
        ? data.data.generation.generationNumber - 1
        : ouroborosGenCount;
      setOuroborosGenCount(resolvedGenIndex + 1);

      // Job 7: Log Structured Empirical Experiment Run Record
      try {
        const recordedRun = logEmpiricalRun({
          sourcePrompt: inputConcept,
          targetMedium:
            target === "suno"
              ? "audio"
              : target === "grok" && grokMode === "grok_video"
                ? "video"
                : ["runway", "luma", "pika", "kling"].includes(target as string)
                  ? "video"
                  : "image",
          targetEngine: target,
          model:
            data.data?.modelProfile?.technicalFacts?.id ||
            (target === "openart" ? `openart_${openArtModel}` : target),
          modelVersion: data.data?.modelProfile?.technicalFacts?.version,
          contentDna: data.data?.contentDna,
          lockedAnchors: data.data?.contentDna?.lockedAnchors,
          activeAttractors: data.data?.contentDna?.activeAttractors?.map(
            (a: any) => a.id,
          ),
          activeOperators: data.data?.contentDna?.activeOperators?.map(
            (o: any) => o.id,
          ),
          mutationIntensity: entropyLevel,
          literalPrompt: data.data?.literal?.prompt,
          slopPrompt: data.data?.slop?.prompt,
          parentRunId:
            overrideParentGen?.generationId ||
            currentResult?.generation?.generationId ||
            null,
          iterationDepth: resolvedGenIndex,
        });
        setActiveRunId(recordedRun.runId);
        setEmpiricalRunCount(Object.keys(loadAllRuns()).length);
      } catch (logErr) {
        console.warn("Error recording empirical run:", logErr);
      }

      // Add to history with complete evolutionary record
      const newHistoryItem: SynthesisHistoryItem = {
        id:
          data.data?.generation?.generationId ||
          Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        concept: inputConcept,
        target,
        targetLength,
        openArtModel,
        grokMode,
        entropyLevel,
        straitjacket: straitjacketLevel,
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
      console.error("Synthesis error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred during synthesis.",
      );
      if (err.retryAfterSeconds) {
        setRetryCountdown(err.retryAfterSeconds);
      }
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSelectPreset = (preset: PresetItem) => {
    // POST_SYNTHESIS_WORKBENCH_V2: presets update controls locally, but DAVID owns prompt integration.
    setTarget(preset.target);
    if (preset.target === "openart") setTargetLength(3200);
    else if (preset.target === "grok") setTargetLength(2000);
    setEntropyLevel(preset.entropyLevel);
    if (preset.straitjacket) setStraitjacketLevel(preset.straitjacket);
    dispatchDavidIntent({
      source: "preset",
      label: "Preset Apply",
      committed: true,
      changes: {
        presetPrompt: preset.concept,
        target: preset.target,
        entropyLevel: preset.entropyLevel,
        straitjacket: preset.straitjacket,
        instruction:
          "Treat this preset as a completed section choice. Integrate it into MAIN PROMPT; do not synthesize automatically.",
      },
    });
  };

  const handleRunSimulation = async (
    promptToTest: string,
    mode: "literal" | "slop",
  ) => {
    setSimPrompt(promptToTest);
    setSimMode(mode);
    setSimResult(null);
    setSimError(null);
    setSimModalOpen(true);
    setIsSimulating(true);

    try {
      const json = await apiPost("/api/simulate-target", {
        prompt: promptToTest,
        target,
        mode,
      });

      setSimResult(json.simulation);
    } catch (err: any) {
      console.error("Simulation error:", err);
      setSimError(err.message || "Error executing simulation.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOuroborosLoop = (
    slopPrompt: string,
    parentGen?: PromptGeneration,
  ) => {
    const parent = parentGen || currentResult?.generation;
    const nextGen = (parent?.generationNumber ?? ouroborosGenCount) + 1;
    setOuroborosGenCount(nextGen);
    setOuroborosSeed(slopPrompt);
    dispatchDavidIntent({
      source: "post-synthesis-ouroboros",
      label: `Ouroboros Gen #${nextGen} Apply`,
      committed: true,
      changes: {
        selectedOutput: slopPrompt,
        parentGeneration: parent || null,
        requestedGeneration: nextGen,
        instruction:
          "Evolve this selected output into the next MAIN PROMPT. Preserve useful ancestry and locks. Do not synthesize yet; the user will press SYNTHESIZE when ready.",
      },
    });
  };

  const handleCrossbreed = (
    parentA: PromptGeneration,
    parentB: PromptGeneration,
  ) => {
    const nextGen =
      Math.max(parentA.generationNumber, parentB.generationNumber) + 1;
    setOuroborosGenCount(nextGen);
    dispatchDavidIntent({
      source: "post-synthesis-crossbreed",
      label: `Crossbreed Gen #${nextGen} Apply`,
      committed: true,
      changes: {
        parentA,
        parentB,
        requestedGeneration: nextGen,
        instruction:
          "Crossbreed the useful structural ancestry of both parents into MAIN PROMPT. Do not replace the prompt with generation IDs and do not synthesize automatically.",
      },
    });
  };

  const handleTranspose = () => {
    if (!currentResult) return;
    const lit: LiteralResult = currentResult.literal || {
      prompt: "",
      stylePrompt: "",
      lyricsPrompt: "",
      tokenWeights: [],
      targetParameters: "",
      charCount: 0,
    };
    const slp: SlopResult = currentResult.slop || {
      prompt: "",
      stylePrompt: "",
      lyricsPrompt: "",
      entropyScore: 5,
      hallucinationTriggers: [],
      charCount: 0,
    };
    setCurrentResult({
      ...currentResult,
      literal: {
        ...lit,
        prompt: slp.prompt || "",
        stylePrompt: slp.stylePrompt,
        lyricsPrompt: slp.lyricsPrompt,
      },
      slop: {
        ...slp,
        prompt: lit.prompt || "",
        stylePrompt: lit.stylePrompt,
        lyricsPrompt: lit.lyricsPrompt,
      },
      previewImpact: `[POLARITY TRANSPOSED]: Inverted the Scalpel and Deluge. Direct tokens now channeled through high-entropy filter.`,
    });
    dispatchDavidIntent({
      source: "post-synthesis-transpose",
      label: "Transpose Apply",
      committed: true,
      changes: {
        literalNow: slp.prompt || "",
        slopNow: lit.prompt || "",
        instruction:
          "The user transposed the Scalpel/Deluge polarity. Reconcile that decision into MAIN PROMPT so the sidebar reflects the new creative state.",
      },
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
            evaluationMode: "user-override" as const,
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
          activeAttractors: (candidate.mutationRecipe.attractors || []).map(
            (a) => a.id,
          ),
        },
        mutationRecipe: candidate.mutationRecipe,
        mutantFamily: updatedFamily,
      };
    });
    dispatchDavidIntent({
      source: "post-synthesis-survivor",
      label: `Mutant Survivor [${candidate.candidateLetter}] Apply`,
      committed: true,
      changes: {
        renderedPrompt: candidate.renderedPrompt,
        stylePrompt: candidate.stylePrompt,
        lyricsPrompt: candidate.lyricsPrompt,
        mutationRecipe: candidate.mutationRecipe,
        instruction:
          "The user explicitly chose this mutant as the survivor. Make it the new MAIN PROMPT ancestry while preserving global locks and useful prior intent.",
      },
    });
  };

  const handleExport = () => {
    const doc = generateDavidProtocolDocument(
      currentResult,
      concept,
      target,
      entropyLevel,
      history,
    );
    downloadMarkdownFile(`david-8-${target}-${Date.now()}.md`, doc);
  };

  const handleInjectZalgo = (glitchText: string) => {
    dispatchDavidIntent({
      source: "zalgo-toolbox",
      label: "Zalgo / Serialization Apply",
      committed: true,
      changes: { glitchText },
    });
    setZalgoOpen(false);
  };

  const isConceptEmpty = !concept.trim();

  let davidState: "IDLE" | "READY" | "SYNTHESIZING" | "COMPLETE" | "ERROR" =
    "IDLE";
  if (errorMessage) {
    davidState = "ERROR";
  } else if (isSynthesizing) {
    davidState = "SYNTHESIZING";
  } else if (currentResult) {
    davidState = "COMPLETE";
  } else if (!isConceptEmpty) {
    davidState = "READY";
  }

  const hasReference =
    slopConfig.protectedAnchors?.length > 0 || concept.includes("@merry");
  const isTransforming =
    (slopConfig.contradictionMode && slopConfig.enableParadoxEngine) ||
    ["misinterpret", "destabilize"].includes(straitjacketLevel);
  const hasOperators = slopConfig.selectedOperators?.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-phosphor selection:bg-phosphor/30 selection:text-phosphor">
      <div className="crt-overlay"></div>
      {/* Top Header */}
      <Header
        onOpenManifesto={() => setManifestoOpen(true)}
        onOpenZalgo={() => setZalgoOpen(true)}
        onExport={handleExport}
        onOpenRecipes={() => {
          setRecipeModalMode("list");
          setRecipeModalOpen(true);
        }}
        onOpenExperimentMemory={() => {
          setExperimentModalRunId(activeRunId);
          setExperimentModalOpen(true);
        }}
        onOpenDiscoveryLab={() => {
          const el = document.getElementById("discovery-lab-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
        runCount={empiricalRunCount}
        discoveryCount={discoveryCount}
        hasResult={!!currentResult}
        ouroborosCount={ouroborosGenCount}
        highThinking={highThinking}
        onToggleThinking={() => setHighThinking(!highThinking)}
        phosphorTheme={phosphorTheme}
        setPhosphorTheme={setPhosphorTheme}
        crtMode={crtMode}
        setCrtMode={setCrtMode}
        davidState={davidState}
        hasReference={hasReference}
        isTransforming={isTransforming}
        hasOperators={hasOperators}
      />

      {/* Recipe notification toast banner */}
      {recipeToast && (
        <div className="fixed top-16 right-6 z-50 p-3.5 bg-phosphor/10 border border-phosphor/30 terminal-border backdrop-blur-md shadow-2xl flex items-center gap-2.5 text-xs font-mono text-phosphor animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-phosphor shrink-0" />
          <span className="font-semibold">{recipeToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Banner with friendly retry logic */}
        {errorMessage && (
          <div className="p-4 bg-semantic-red/10 border border-semantic-red/30 terminal-border text-xs font-mono text-semantic-red flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-semantic-red shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block uppercase tracking-wider">
                  ERR // SYNTHESIS INTERRUPTED
                </span>
                <p className="leading-relaxed">{errorMessage}</p>
                {retryCountdown !== null && retryCountdown > 0 && (
                  <div className="flex items-center gap-1.5 text-phosphor font-bold pt-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>
                      Rate limit cooldown active: {retryCountdown}s remaining
                    </span>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-phosphor/30 terminal-border bg-phosphor/10 hover:bg-phosphor/20 text-phosphor text-xs font-mono transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 border border-semantic-red/30 terminal-border bg-semantic-red/10 hover:bg-semantic-red/20 text-semantic-red text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {retryCountdown ? `Retry Now (${retryCountdown}s)` : "Retry"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-phosphor/80 hover:text-phosphor/80 p-1"
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Input & Target Configuration */}
        <PromptInputArea
          davidState={davidState}
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
          straitjacketLevel={straitjacketLevel}
          setStraitjacketLevel={setStraitjacketLevel}
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
            setRecipeModalMode("save");
            setRecipeModalOpen(true);
          }}
          onOpenRecipes={() => {
            setRecipeModalMode("list");
            setRecipeModalOpen(true);
          }}
        />

        {/* Technical Engine Labs: Discovery Lab (Job 8), Guidance Geometry, Structural Relational Traps, Context Architecture & Serialization */}
        <div id="discovery-lab-section" className="mb-6 space-y-4">
          <DiscoveryLabPanel
            currentConcept={concept}
            targetEngine={target}
            targetMedium={
              target === "suno"
                ? "audio"
                : target === "grok" && grokMode === "grok_video"
                  ? "video"
                  : "image"
            }
            modelProfile={openArtModel}
            lockedAnchors={slopConfig.protectedAnchors || []}
            activeOperators={
              slopConfig.selectedOperators?.map((op: any) =>
                typeof op === "string" ? op : op.id,
              ) || []
            }
            entropyLevel={entropyLevel}
            onApplyPromptToInput={(rendered) =>
              dispatchDavidIntent({
                source: "discovery-lab",
                label: "Discovery Lab Apply",
                committed: true,
                changes: { renderedPrompt: rendered },
              })
            }
            onApplyRecipeToState={(recipe) => {
              if (recipe.targetMedium === "audio") {
                setTarget("suno");
              } else if (recipe.targetMedium === "video") {
                setTarget("grok");
                setGrokMode("grok_video");
              } else {
                setTarget("openart");
              }
              setSlopConfig((prev) =>
                normalizeSlopConfig({
                  ...prev,
                  selectedOperators: recipe.operatorChain.map((id) => {
                    const rawStrength = recipe.relativeStrengths?.[id];
                    const intensity =
                      typeof rawStrength === "number"
                        ? rawStrength > 1
                          ? rawStrength / 10
                          : rawStrength
                        : 0.8;
                    return {
                      id,
                      weight: 1.0,
                      intensity,
                    };
                  }),
                }),
              );
              setDiscoveryCount(Object.keys(loadDiscoveryRecipes()).length);
            }}
          />

          <GuidanceGeometryPanel
            currentPrompt={concept}
            targetModality={
              target === "suno"
                ? "AUDIO"
                : target === "grok" && grokMode === "grok_video"
                  ? "VIDEO"
                  : ["runway", "luma", "pika", "kling"].includes(
                        target as string,
                      )
                    ? "VIDEO"
                    : "IMAGE"
            }
            targetEngine={target}
            onApplyRenderedPrompt={(rendered) =>
              dispatchDavidIntent({
                source: "guidance-geometry",
                label: "Guidance Geometry Apply",
                committed: true,
                changes: { renderedPrompt: rendered },
              })
            }
          />

          <StructuralRelationalPanel
            currentPrompt={concept}
            targetModality={
              target === "suno"
                ? "AUDIO"
                : target === "grok" && grokMode === "grok_video"
                  ? "VIDEO"
                  : ["runway", "luma", "pika", "kling"].includes(
                        target as string,
                      )
                    ? "VIDEO"
                    : "IMAGE"
            }
            onApplyRenderedPrompt={(rendered) =>
              dispatchDavidIntent({
                source: "structural-relational",
                label: "Structural / Relational Apply",
                committed: true,
                changes: { renderedPrompt: rendered },
              })
            }
          />

          <ContextDiagnosticsPanel
            currentPrompt={concept}
            targetEngine={target}
            modelId={openArtModel}
            onApplyRenderedPrompt={(rendered) =>
              dispatchDavidIntent({
                source: "context-diagnostics",
                label: "Context Diagnostics Apply",
                committed: true,
                changes: { renderedPrompt: rendered },
              })
            }
          />

          <SerializationDiagnosticsPanel
            currentPrompt={concept}
            activeModelId={openArtModel}
            onApplyMutatedPrompt={(mutated) =>
              dispatchDavidIntent({
                source: "serialization-diagnostics",
                label: "Serialization Apply",
                committed: true,
                changes: { renderedPrompt: mutated },
              })
            }
          />
        </div>

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
            if (item.straitjacket) setStraitjacketLevel(item.straitjacket);
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
            activeRunId={activeRunId}
            onOpenExperimentMemory={(runId) => {
              setExperimentModalRunId(runId || activeRunId);
              setExperimentModalOpen(true);
            }}
            onRunSimulation={handleRunSimulation}
            onOuroborosLoop={handleOuroborosLoop}
            onTranspose={handleTranspose}
            onSelectManualSurvivor={handleSelectManualSurvivor}
          />
        ) : isSynthesizing ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-theme-panel border terminal-border">
            <div className="w-10 h-10 border-2 border-phosphor/20 terminal-border border-t-phosphor animate-spin" />
            <h3 className="text-sm font-bold font-mono text-phosphor uppercase tracking-widest">
              SYNTHESIZING...
            </h3>
            <p className="text-[11px] font-mono text-phosphor/70 max-w-md uppercase tracking-widest">
              EXTRACTING SCALPEL &bull; INJECTING DELUGE
            </p>
          </div>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-theme-bg/50 border border-dashed terminal-border">
            <div className="text-[10px] font-display font-bold uppercase tracking-widest text-phosphor/50 mb-1">
              SYSTEMS NOMINAL
            </div>
            <h3 className="text-sm font-mono text-phosphor uppercase tracking-widest">
              GOOD MORNING, MERRY.
            </h3>
            <p className="text-[11px] font-mono text-phosphor/70 max-w-md uppercase tracking-widest">
              Awaiting semantic baseline. Structural mutation authorized.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t terminal-border py-4 px-4 sm:px-6 bg-theme-panel text-[11px] font-mono text-phosphor/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>DAVID // Weyland-Yutani Synthetic Consciousness Protocol</span>
          <span>&bull;</span>
          <span className="text-phosphor/80">
            &ldquo;May I speak to David?&rdquo;
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setManifestoOpen(true)}
            className="hover:text-phosphor transition-colors"
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
      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
      />

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
        entropyLevel={entropyLevel}
        currentConcept={concept}
        targetEngine={target}
        onApplyConcept={(newConcept) => setConcept(newConcept)}
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
            selectedSeeds: Array.from(
              new Set([...prev.selectedSeeds, ...seeds]),
            ),
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
          straitjacket: straitjacketLevel,
          commandMode,
          highThinking,
          useSearch,
          slopConfig,
        }}
        onApplyRecipe={handleApplyRecipe}
      />

      {/* Job 7: Experiment Memory & Empirical Learning Modal */}
      <ExperimentMemoryModal
        isOpen={experimentModalOpen}
        onClose={() => {
          setExperimentModalOpen(false);
          setEmpiricalRunCount(Object.keys(loadAllRuns()).length);
        }}
        initialRunId={experimentModalRunId}
        onSelectRun={(run) => {
          if (run.sourcePrompt) setConcept(run.sourcePrompt);
          if (run.targetEngine) setTarget(run.targetEngine as any);
        }}
      />

      {/* MASSIVE GLOWING CONSULT BUTTON */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('david:open-workbench'))}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-phosphor text-theme-bg font-display uppercase tracking-widest font-bold text-lg hover:bg-white transition-all terminal-border cursor-pointer shadow-[0_0_20px_rgba(var(--color-phosphor),0.3)]"
        style={{ filter: 'drop-shadow(0 0 10px var(--color-phosphor))' }}
      >
        <MessageSquare className="w-6 h-6" />
        Talk to David
      </button>

      <DavidAppWorkbench
        mainPrompt={concept}
        currentState={{
          concept,
          target,
          targetLength,
          openArtModel,
          grokMode,
          slopConfig,
          entropyLevel,
          straitjacketLevel,
          commandMode,
          useSearch,
        }}
        highThinking={highThinking}
        onMainPromptUpdate={(text) => setConcept(text)}
        onSynthesize={(prompt) => handleSynthesize(prompt)}
        onApplySettings={(settings) => {
          if (typeof settings.entropyLevel === "number")
            setEntropyLevel(Math.max(1, Math.min(10, settings.entropyLevel)));
          if (typeof settings.targetLength === "number")
            setTargetLength(settings.targetLength);
          if (settings.straitjacketLevel)
            setStraitjacketLevel(
              settings.straitjacketLevel as StraitjacketLevel,
            );
          if (settings.commandMode)
            setCommandMode(settings.commandMode as CommandMode);
          if (settings.target) setTarget(settings.target as TargetEngine);
          if (settings.grokMode) setGrokMode(settings.grokMode as GrokMode);
          if (settings.openArtModel)
            setOpenArtModel(settings.openArtModel as OpenArtModel);
        }}
      />
    </div>
  );
}
