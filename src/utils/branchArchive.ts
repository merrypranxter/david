import {
  DormantBranch,
  MutationCandidate,
  MutationPattern,
  PromptGeneration,
} from '../types';

const BRANCH_ARCHIVE_STORAGE_KEY = 'david_dormant_branches_v1';
const PATTERN_ARCHIVE_STORAGE_KEY = 'david_mutation_patterns_v1';
const MAX_BRANCH_ARCHIVE_SIZE = 16;
const MAX_PATTERN_ARCHIVE_SIZE = 10;

/**
 * In-memory fallback if localStorage is unavailable
 */
let memoryBranches: DormantBranch[] = [];
let memoryPatterns: MutationPattern[] = [];

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Load archived dormant branches (Job 8, Part 19)
 */
export function getDormantBranches(): DormantBranch[] {
  try {
    if (isStorageAvailable()) {
      const raw = window.localStorage.getItem(BRANCH_ARCHIVE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          memoryBranches = parsed;
          return parsed;
        }
      }
    }
  } catch {
    // Fallback to memory
  }
  return memoryBranches;
}

/**
 * Save notable non-winning sibling candidates as extinct evolutionary branches (Job 8, Part 18 & 19)
 */
export function archiveDormantBranches(
  rejectedCandidates: MutationCandidate[],
  generationNumber: number,
  parentGenerationId: string,
  concept: string
): void {
  const current = getDormantBranches();
  const newBranches: DormantBranch[] = [];

  for (const cand of rejectedCandidates) {
    // Only archive siblings that had interesting qualities (e.g. novelty > 0.4 or valid structure)
    const evalScore = cand.evaluation;
    if (evalScore && evalScore.structuralNovelty < 0.3 && evalScore.anchorSurvival < 0.2) {
      continue; // Skip garbage/completely collapsed candidates
    }

    const branch: DormantBranch = {
      candidateId: cand.id,
      parentGenerationId,
      generationNumber,
      timestamp: Date.now(),
      concept: concept.slice(0, 100),
      renderedPromptExcerpt: (cand.renderedPrompt || '').slice(0, 180),
      operators: cand.activeOperators,
      attractors: cand.attractorMix,
      niches: cand.mutationNiches,
      fitnessHighlights: evalScore
        ? `Nov: ${Math.round(evalScore.structuralNovelty * 100)}% | Leg: ${Math.round(
            evalScore.targetLegibility * 100
          )}% | Dist: ${Math.round(evalScore.siblingDistance * 100)}%`
        : 'Alternative mutation branch',
      evaluationScores: evalScore
        ? {
            novelty: evalScore.structuralNovelty,
            anchorSurvival: evalScore.anchorSurvival,
            legibility: evalScore.targetLegibility,
            fitness: evalScore.totalFitness,
          }
        : undefined,
      lineageGenotype: cand.generationSnapshot,
    };

    newBranches.push(branch);
  }

  if (newBranches.length === 0) return;

  // Prepend and cap at bounded size
  const updated = [...newBranches, ...current].slice(0, MAX_BRANCH_ARCHIVE_SIZE);
  memoryBranches = updated;

  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(BRANCH_ARCHIVE_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('[BranchArchive] Unable to save to localStorage, using memory storage:', err);
  }
}

/**
 * Convert a dormant branch into a virtual PromptGeneration eligible for Ouroboros crossbreeding (Job 8, Part 20)
 */
export function dormantBranchToParentGeneration(branch: DormantBranch): PromptGeneration {
  if (branch.lineageGenotype) {
    return branch.lineageGenotype;
  }

  // Synthesize lightweight virtual generation from branch record
  return {
    generationNumber: branch.generationNumber,
    generationId: `branch-${branch.candidateId}`,
    parentGenerationIds: [branch.parentGenerationId],
    timestamp: branch.timestamp,
    sourceConcept: branch.concept,
    renderedPrompt: branch.renderedPromptExcerpt,
    preservedAnchors: [],
    inheritedTraits: branch.operators.map((opId) => ({
      id: `inherited_${opId}`,
      label: opId.replace(/_/g, ' '),
      directive: `Apply legacy structural tendency: ${opId.replace(/_/g, ' ')}`,
      originGen: branch.generationNumber,
      strength: 0.7,
      persistence: 0.7,
      status: 'dormant' as const,
      category: 'structural',
    })),
    acquiredTraits: [],
    lostTraits: [],
    dormantTraits: [],
    scars: [],
    mutationEvents: [
      {
        type: 'dormancy',
        description: `Reactivated extinct mutant branch [${branch.niches.join(', ')}]`,
        originGen: branch.generationNumber,
      },
    ],
    lineageSummary: `Extinct Branch [${branch.niches.join(', ')}] revived for crossbreeding.`,
  };
}

/**
 * Record a successful mutation pattern for transfer learning (Job 8, Part 30)
 */
export function recordSuccessfulPattern(
  candidate: MutationCandidate,
  label: string,
  note: string
): void {
  const evalScore = candidate.evaluation;
  if (!evalScore || evalScore.totalFitness < 0.7) return;

  const pattern: MutationPattern = {
    id: `pat-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: Date.now(),
    label,
    operatorIds: candidate.activeOperators,
    attractorIds: candidate.attractorMix,
    niches: candidate.mutationNiches,
    semanticDistance: candidate.mutationRecipe.semanticDistance ?? 0.6,
    preservedAnchorsCount: candidate.preservedAnchors.length,
    recordedFitness: evalScore.totalFitness,
    note,
  };

  const current = getSuccessfulPatterns();
  const updated = [pattern, ...current].slice(0, MAX_PATTERN_ARCHIVE_SIZE);
  memoryPatterns = updated;

  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(PATTERN_ARCHIVE_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // Memory fallback
  }
}

/**
 * Retrieve successful mutation patterns
 */
export function getSuccessfulPatterns(): MutationPattern[] {
  try {
    if (isStorageAvailable()) {
      const raw = window.localStorage.getItem(PATTERN_ARCHIVE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          memoryPatterns = parsed;
          return parsed;
        }
      }
    }
  } catch {
    // Memory fallback
  }
  return memoryPatterns;
}
