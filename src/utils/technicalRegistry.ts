/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Central Technical Operator Registry
 * 
 * Provides a standardized registry for registering, querying, and filtering
 * technical failure-surface operators.
 * 
 * CORE PHILOSOPHY & GUARD AGAINST TECHNICAL THEATER:
 * DAVID must never infer hidden internal behavior merely because an output
 * looks compatible with a hypothesis.
 * - "We saw stripes, therefore RoPE aliasing occurred" -> REJECTED (Unverified speculation).
 * - "We used Zalgo, therefore byte fallback definitely occurred" -> REJECTED.
 * - "The face split, therefore attention binding mathematically failed" -> REJECTED.
 * 
 * If the backend cannot expose the necessary evidence (e.g. token ID dumps, attention maps),
 * status MUST be MECHANISM_UNCERTAIN. Creative utility can remain 10/10 while mechanism
 * confidence remains 2/10.
 * 
 * SCAFFOLD FOR FUTURE ORCHESTRATION (Job 10 Preview):
 * Future multi-stage crucibles will sequence operators across three roles:
 * - CONTAINER: Preserves enough macro-structural coherence that the model cannot escape into noise.
 * - CRUCIBLE: Applies targeted representational tension to a specific latent layer.
 * - ITINERARY: Reuses/iterates output so accidental structures can persist or fossilize.
 */

import {
  TechnicalOperator,
  TechnicalOperatorFilter,
} from '../types/technicalCore';
import {
  OPERATOR_ASND,
  OPERATOR_HMC_SPS,
  OPERATOR_DS_BFAH,
} from '../operators/serializationOperators';
import {
  OPERATOR_RBC_AS,
  OPERATOR_AC_RP,
} from '../operators/contextOperators';
import { STRUCTURAL_OPERATORS } from '../operators/structuralOperators';
import { GUIDANCE_OPERATORS } from '../operators/guidanceOperators';

// Central in-memory registry map: operatorId -> versions Map
const OPERATOR_REGISTRY: Map<string, Map<string, TechnicalOperator>> = new Map();

/**
 * DEV/EXAMPLE OPERATOR #1: Token Boundary Shatter (Observable/Hybrid Example)
 * Solely for typing and validation; explicitly marked isDevExample: true.
 */
export const DEV_EXAMPLE_TOKEN_SHATTER: TechnicalOperator = {
  id: 'dev_example_token_shatter',
  name: 'Token Boundary Shatter (Dev Prototype)',
  shortName: 'Token Shatter',
  description:
    'Demonstration technical operator that introduces arbitrary sub-word segmentation splits to test binding leakage.',
  version: '1.0.0',
  technicalLayer: 'TOKENIZATION',
  executionTier: 'HYBRID',
  supportedModalities: ['IMAGE'],
  mechanismHypothesis:
    'Forcing sub-word boundary splits may destabilize lexical embedding lookup and cause semantic leakage into adjacent visual tokens.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Sub-word splits cause embedding drift.',
      rationale: 'Initial dev test hypothesis for Job 1 scaffold validation.',
    },
  ],
  expectedFailureSurfaces: ['attribute leakage', 'connective-tissue hallucination'],
  requiredCapabilities: ['TEXT_INPUT', 'TOKENIZER_ACCESS'],
  parameters: {
    shatterDensity: {
      name: 'shatterDensity',
      type: 'number',
      defaultValue: 0.25,
      min: 0,
      max: 1.0,
      step: 0.05,
      description: 'Proportion of candidate words subjected to sub-word splitting.',
    },
  },
  evidenceStatus: ['PROPOSED', 'MECHANISM_UNCERTAIN'],
  scores: {
    creativeUtility: null, // Unmeasured in dev prototype
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },
  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Sub-word insertion characters in primary noun phrases',
    heldConstant: 'Random seed, model temperature, base prompt semantics',
    hypothesisTested:
      'Sub-word boundary interruption decreases semantic binding of the subject color attribute.',
    weakeningCondition:
      'Color binding is lost equally when un-split punctuation is appended to the prompt.',
    falsificationCondition:
      'Direct token ID inspection shows identical token sequence generated despite formatting.',
    negativeControlDescription: 'Original intact prompt without sub-word separators.',
  },
  defaultDoseSweep: {
    parameter: 'shatterDensity',
    sweepType: 'discrete',
    values: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    unit: 'ratio',
  },
  recommendedStageRoles: ['CRUCIBLE'],
  degradationPath:
    'Fallback to observable zero-width / soft-hyphen text mutation when tokenizer inspection hooks are unavailable.',
  tags: ['tokenization', 'dev-example', 'scaffold'],
  isDevExample: true,
};

/**
 * DEV/EXAMPLE OPERATOR #2: Context-Budget Starvation (Observable Example)
 * Solely for typing and validation; explicitly marked isDevExample: true.
 */
export const DEV_EXAMPLE_CONTEXT_STARVATION: TechnicalOperator = {
  id: 'dev_example_context_starvation',
  name: 'Context-Budget Starvation (Dev Prototype)',
  shortName: 'Context Starve',
  description:
    'Demonstration technical operator testing modifier drift under extreme token distance.',
  version: '1.0.0',
  technicalLayer: 'CONTEXT',
  executionTier: 'OBSERVABLE',
  supportedModalities: ['IMAGE', 'AUDIO'],
  mechanismHypothesis:
    'Exceeding effective positional attention window causes remote modifiers to detach from subject anchors and bind to background features.',
  hypothesisRevisions: [
    {
      version: '1.0.0',
      date: '2026-09-07',
      hypothesis: 'Modifier detachment caused by quadratic attention falloff.',
      rationale: 'Initial baseline hypothesis.',
    },
  ],
  expectedFailureSurfaces: ['attribute leakage', 'material substitution'],
  requiredCapabilities: ['TEXT_INPUT'],
  parameters: {
    fillerTokenCount: {
      name: 'fillerTokenCount',
      type: 'number',
      defaultValue: 150,
      min: 0,
      max: 500,
      step: 50,
      description: 'Number of inert semantic tokens separating modifier from anchor.',
    },
  },
  evidenceStatus: ['PROPOSED'],
  scores: {
    creativeUtility: null,
    repeatability: null,
    mechanismConfidence: null,
    modelDependence: null,
    failureToIgnoreRate: null,
  },
  controls: {
    applicableControls: ['baseline', 'experimental', 'negative_control', 'dose_sweep'],
    variableChanged: 'Token distance between descriptor and target noun',
    heldConstant: 'Prompt vocabulary, random seed',
    hypothesisTested: 'Increasing token distance causes attribute binding failure.',
    weakeningCondition: 'Attribute binds correctly regardless of filler token distance.',
    falsificationCondition:
      'Attribute detachment occurs at identical rates even when zero filler tokens are used.',
  },
  defaultDoseSweep: {
    parameter: 'fillerTokenCount',
    sweepType: 'discrete',
    values: [0, 50, 100, 200, 350, 500],
    unit: 'tokens',
  },
  recommendedStageRoles: ['CONTAINER', 'CRUCIBLE'],
  tags: ['context', 'attention', 'dev-example', 'scaffold'],
  isDevExample: true,
};

// Seed registry with dev examples
registerTechnicalOperator(DEV_EXAMPLE_TOKEN_SHATTER);
registerTechnicalOperator(DEV_EXAMPLE_CONTEXT_STARVATION);

// Register Job 2 Tokenizer & Serialization Sabotage Operators
registerTechnicalOperator(OPERATOR_ASND);
registerTechnicalOperator(OPERATOR_HMC_SPS);
registerTechnicalOperator(OPERATOR_DS_BFAH);

// Register Job 3 Context Budget & Binding Failure Operators
registerTechnicalOperator(OPERATOR_RBC_AS);
registerTechnicalOperator(OPERATOR_AC_RP);

// Register Job 4 Structural Syntax & Relational Traps Operators
STRUCTURAL_OPERATORS.forEach((op) => registerTechnicalOperator(op));

// Register Job 5A Guidance Geometry Operators
GUIDANCE_OPERATORS.forEach((op) => registerTechnicalOperator(op));

/**
 * Registers or updates a technical operator in the central registry.
 * Preserves historical versions in memory.
 */
export function registerTechnicalOperator(operator: TechnicalOperator): void {
  let versionsMap = OPERATOR_REGISTRY.get(operator.id);
  if (!versionsMap) {
    versionsMap = new Map<string, TechnicalOperator>();
    OPERATOR_REGISTRY.set(operator.id, versionsMap);
  }
  versionsMap.set(operator.version, operator);
}

/**
 * Retrieves a technical operator by ID (or shortName/shortId) and optional version.
 * If version is omitted, returns the latest registered version.
 */
export function getTechnicalOperator(
  idOrShortName: string,
  version?: string
): TechnicalOperator | undefined {
  // Direct lookup by ID
  let versionsMap = OPERATOR_REGISTRY.get(idOrShortName);

  // If not found by exact ID, search by shortName (e.g. 'ASND', 'HMC-SPS', 'DS-BFAH')
  if (!versionsMap) {
    for (const vMap of OPERATOR_REGISTRY.values()) {
      const firstOp = Array.from(vMap.values())[0];
      if (firstOp && (firstOp.shortName === idOrShortName || firstOp.id.toLowerCase() === idOrShortName.toLowerCase())) {
        versionsMap = vMap;
        break;
      }
    }
  }

  if (!versionsMap || versionsMap.size === 0) return undefined;

  if (version) {
    return versionsMap.get(version);
  }

  // Return the latest version (last inserted)
  const allVersions = Array.from(versionsMap.values());
  return allVersions[allVersions.length - 1];
}

/**
 * Lists all technical operators (latest version of each operator).
 */
export function listTechnicalOperators(includeDevExamples: boolean = true): TechnicalOperator[] {
  const result: TechnicalOperator[] = [];
  for (const versionsMap of OPERATOR_REGISTRY.values()) {
    const all = Array.from(versionsMap.values());
    const latest = all[all.length - 1];
    if (latest && (includeDevExamples || !latest.isDevExample)) {
      result.push(latest);
    }
  }
  return result;
}

/**
 * Filters registered technical operators across multiple technical axes.
 */
export function filterTechnicalOperators(filter: TechnicalOperatorFilter): TechnicalOperator[] {
  const all = listTechnicalOperators(filter.includeDevExamples ?? true);

  return all.filter((op) => {
    if (filter.modality && !op.supportedModalities.includes(filter.modality)) {
      return false;
    }
    if (filter.executionTier && op.executionTier !== filter.executionTier) {
      return false;
    }
    if (filter.technicalLayer && op.technicalLayer !== filter.technicalLayer) {
      return false;
    }
    if (
      filter.requiredCapability &&
      !op.requiredCapabilities.includes(filter.requiredCapability)
    ) {
      return false;
    }
    if (
      filter.evidenceStatus &&
      !op.evidenceStatus.includes(filter.evidenceStatus)
    ) {
      return false;
    }
    if (
      filter.stageRole &&
      (!op.recommendedStageRoles || !op.recommendedStageRoles.includes(filter.stageRole))
    ) {
      return false;
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const match =
        op.name.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.tags.some((t) => t.toLowerCase().includes(q)) ||
        op.mechanismHypothesis.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
