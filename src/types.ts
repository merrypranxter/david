export type TargetEngine =
  | 'general'
  | 'suno'
  | 'midjourney_flux'
  | 'openart'
  | 'grok'
  | 'llm_agent'
  | 'void';

export type OpenArtModel = 'banana' | 'nano_bananas' | 'pro' | 'light' | 'seadream';

export type GrokMode = 'grok_image' | 'grok_video';

export type CommandMode = 'dual' | 'literal' | 'slop' | 'bypass';

export type SlopDomain = 'maths' | 'sciences' | 'slop';

export type ContradictionMode = 'paradox' | 'dissonance' | 'symbiosis' | 'free_drift';

export interface SlopSeedingConfig {
  enableParadoxEngine: boolean;
  paradoxEngine?: boolean;
  addMaths: boolean;
  mathCategory?: string;
  addSciences: boolean;
  scienceCategory?: string;
  addSlop: boolean;
  slopCategory?: string;
  contradictionMode: ContradictionMode;
  selectedSeeds: string[];
}

export interface LiteralResult {
  prompt: string;
  // Suno specific dual outputs
  stylePrompt?: string;
  lyricsPrompt?: string;
  tokenWeights: string[];
  targetParameters: string;
  charCount?: number;
  styleCharCount?: number;
  lyricsCharCount?: number;
}

export interface SlopResult {
  prompt: string;
  // Suno specific dual outputs
  stylePrompt?: string;
  lyricsPrompt?: string;
  entropyScore: number;
  hallucinationTriggers: string[];
  glitchAnchors?: string;
  seededContradictions?: string[];
  injectedDomains?: string[];
  charCount?: number;
  styleCharCount?: number;
  lyricsCharCount?: number;
}

export interface LogicMapItem {
  phase: string;
  description: string;
}

export interface SynthesisPayload {
  literal: LiteralResult;
  slop: SlopResult;
  logicMap: LogicMapItem[];
  targetSummary?: string;
  previewImpact: string;
  targetEngine?: TargetEngine;
}

export interface SynthesisHistoryItem {
  id: string;
  timestamp: number;
  concept: string;
  target: TargetEngine;
  targetLength?: number;
  openArtModel?: OpenArtModel;
  grokMode?: GrokMode;
  entropyLevel: number;
  highThinking: boolean;
  useSearch: boolean;
  commandMode: CommandMode;
  modelUsed: string;
  result: SynthesisPayload;
  generationIndex?: number;
  slopConfig?: SlopSeedingConfig;
}

export interface PresetItem {
  id: string;
  title: string;
  category: 'Suno Audio' | 'Visual / Midjourney' | 'LLM / Agent' | 'The Void';
  tag: string;
  concept: string;
  target: TargetEngine;
  entropyLevel: number;
  note: string;
}

export interface SimulationResult {
  behaviorSummary: string;
  artifactReport: string[];
  compliancePercentage: number;
  latentVoidPercentage: number;
  simulatedOutputExcerpt: string;
}
