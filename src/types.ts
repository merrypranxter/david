export type TargetEngine = 'general' | 'suno' | 'midjourney_flux' | 'llm_agent' | 'void';

export type CommandMode = 'dual' | 'literal' | 'slop' | 'bypass';

export interface LiteralResult {
  prompt: string;
  tokenWeights: string[];
  targetParameters: string;
}

export interface SlopResult {
  prompt: string;
  entropyScore: number;
  hallucinationTriggers: string[];
  glitchAnchors?: string;
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
}

export interface SynthesisHistoryItem {
  id: string;
  timestamp: number;
  concept: string;
  target: TargetEngine;
  entropyLevel: number;
  highThinking: boolean;
  useSearch: boolean;
  commandMode: CommandMode;
  modelUsed: string;
  result: SynthesisPayload;
  generationIndex?: number;
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
