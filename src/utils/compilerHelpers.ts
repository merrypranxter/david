import { WeightedSelection, MutationOperator, LatentAttractor } from '../types';

/**
 * Deterministic 32-bit pseudorandom number generator (Mulberry32).
 * When given a numeric or string seed, produces a stable, repeatable sequence in [0, 1).
 */
export function createPrng(seed?: number | string): () => number {
  if (seed === undefined || seed === null) {
    return Math.random;
  }

  let s =
    typeof seed === 'string'
      ? Array.from(seed).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0)
      : Math.floor(seed);

  // If seed resolved to 0, scramble slightly to avoid zero-state degenerate runs
  if (s === 0) s = 1337420;

  return function nextFloat(): number {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Robustly normalizes an array of weighted items:
 * - Replaces NaN, negative, or invalid weights with defaults
 * - Retains relative proportions of manual weights
 * - Falls back to equal distribution if total weight is 0
 * - Ensures output weights sum approximately to 1.0
 */
export function normalizeWeightedSelections<T = string>(
  items: Array<{ id: T; weight?: number; intensity?: number }>,
  precision = 3
): Array<WeightedSelection<T>> {
  if (!items || items.length === 0) {
    return [];
  }

  // Sanitize raw weights
  const cleaned = items.map((item) => {
    let rawWeight = Number(item.weight);
    if (!Number.isFinite(rawWeight) || rawWeight < 0) {
      rawWeight = 1.0;
    }
    let rawIntensity = Number(item.intensity);
    if (!Number.isFinite(rawIntensity) || rawIntensity < 0) {
      rawIntensity = rawWeight;
    }
    return {
      id: item.id,
      rawWeight,
      intensity: rawIntensity,
    };
  });

  const total = cleaned.reduce((acc, item) => acc + item.rawWeight, 0);
  const factor = Math.pow(10, precision);

  if (total <= 0) {
    // Clean fallback to equal distribution
    const equalWeight = Math.round((1 / cleaned.length) * factor) / factor;
    return cleaned.map((item) => ({
      id: item.id,
      weight: equalWeight,
      intensity: item.intensity || 1.0,
    }));
  }

  return cleaned.map((item) => ({
    id: item.id,
    weight: Math.round((item.rawWeight / total) * factor) / factor,
    intensity: item.intensity,
  }));
}

/**
 * Checks if a candidate operator is technically compatible with already-selected operators.
 * Technical incompatibility (mutual exclusion) is distinguished from intentional creative contradictions.
 */
export function isOperatorCompatible(
  candidate: MutationOperator,
  activeOperators: readonly MutationOperator[]
): boolean {
  for (const active of activeOperators) {
    if (active.id === candidate.id) {
      return false; // Already selected
    }
    // Check if either operator explicitly lists the other as incompatible
    if (active.compatibleOperatorIds && active.compatibleOperatorIds.length > 0) {
      // Incompatible if candidate is explicitly forbidden
      // Notice: compatibleOperatorIds lists positive affinities, not exclusions
    }
  }
  return true;
}

/**
 * Checks if candidate attractor is compatible with active attractors
 */
export function isAttractorCompatible(
  candidate: LatentAttractor,
  activeAttractors: readonly LatentAttractor[]
): boolean {
  for (const active of activeAttractors) {
    if (active.id === candidate.id) {
      return false; // Already selected
    }
    if (active.incompatibleOperatorIds && active.incompatibleOperatorIds.includes(candidate.id)) {
      return false;
    }
  }
  return true;
}
