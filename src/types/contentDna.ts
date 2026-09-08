/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 5B: Content DNA and Live Mutation Synthesis Types
 * 
 * Maintains a persistent, compact internal Content DNA representation
 * across the entire mutation pipeline.
 * Ensures the user's core intent survives radical transformation
 * without semantic drift or cliché collapse.
 */

export type TargetMediumType = 'image' | 'video' | 'audio' | 'agent' | 'void';

export interface ContentDnaMutableProperty {
  name: string;
  originalValue: string;
  mutatedValue?: string;
  assignedOperatorId?: string;
  subsystem?: 'surface' | 'core' | 'mechanics' | 'topology' | 'optics' | 'time' | 'harmonics';
  transformationMechanism?: string;
}

export interface ContentDnaAttractor {
  id: string;
  name: string;
  weight: number; // 0.0 - 1.0
  gravityRole: 'primary' | 'secondary' | 'forbidden' | 'counterbalance';
  basinInfluence: string;
  isDominant?: boolean;
}

export interface ContentDnaOperator {
  id: string;
  name: string;
  weight: number; // 0.0 - 1.0
  behavioralRule: string;
  mechanismCategory: 'structural' | 'ontological' | 'scale' | 'paradox' | 'temporal' | 'material';
  actionDirective: string;
}

export interface ContentDnaInteractionStep {
  step: number;
  operatorId: string;
  operatorName: string;
  inputState: string;
  action: string;
  consequence: string;
  targetAffected: string;
  feedbackTo?: string; // e.g. "C feeds back into A (A causes B, B destabilizes C, C feeds back into A)"
}

export interface TargetMediumTranslation {
  medium: TargetMediumType;
  mediumSpecificDirectives: string[];
  governingDimensions: string[];
  invariantsSurviving: string[];
  formatConstraints: string[];
}

export interface AttractorRebalanceDiagnostic {
  isDominantAttractorDetected: boolean;
  isSeedAtRiskOfErasure: boolean;
  isClichéCollapseDetected: boolean;
  isSimpleMashup: boolean;
  wereLockedAnchorsPreserved: boolean;
  rebalanceActionTaken?: string;
  warnings: string[];
}

export interface ContentDNA {
  seedIdentity: string;
  lockedAnchors: string[];
  mutableProperties: ContentDnaMutableProperty[];
  activeAttractors: ContentDnaAttractor[];
  activeOperators: ContentDnaOperator[];
  interactionChain: ContentDnaInteractionStep[];
  mutationIntensity: number; // 0.0 - 1.0
  targetMedium: TargetMediumType;
  forbiddenOutcomes: string[];
  emergentArtifacts: string[];
  translationDetails?: TargetMediumTranslation;
  rebalanceStatus?: AttractorRebalanceDiagnostic;
  generationTimestamp?: number;
  rawSeedPrompt?: string;
}
