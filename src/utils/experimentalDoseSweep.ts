/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 1: Dose-Response Sweep System
 * 
 * Generic sweep expansion engine for parameter titration experiments.
 * Generates structured families of run configurations across discrete,
 * linear, logarithmic, or custom value progressions.
 */

import { DoseSweepSpec, SweepRunConfig } from '../types/technicalCore';

export interface ExpandedSweepRun {
  runIndex: number;
  parameter: string;
  value: number | string | boolean;
  role: 'dose_sweep';
  isBaselineDose: boolean;
  label: string;
  parameters: Record<string, any>;
}

/**
 * Computes an array of numeric values for linear range sweeps.
 */
function generateLinearRange(min: number, max: number, step?: number, stepsCount?: number): number[] {
  const values: number[] = [];
  if (stepsCount && stepsCount > 1) {
    const delta = (max - min) / (stepsCount - 1);
    for (let i = 0; i < stepsCount; i++) {
      const val = min + delta * i;
      values.push(Number(val.toFixed(4)));
    }
  } else {
    const s = step && step > 0 ? step : 1;
    for (let val = min; val <= max + 1e-9; val += s) {
      values.push(Number(val.toFixed(4)));
    }
  }
  return values;
}

/**
 * Computes an array of numeric values for logarithmic range sweeps.
 * Useful for learning rates, guidance ratios, and noise scales.
 */
function generateLogarithmicRange(min: number, max: number, stepsCount: number = 5): number[] {
  if (min <= 0 || max <= 0) {
    throw new Error('Logarithmic sweep requires positive non-zero min and max values.');
  }
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const delta = (logMax - logMin) / (stepsCount - 1);
  const values: number[] = [];
  for (let i = 0; i < stepsCount; i++) {
    const val = Math.pow(10, logMin + delta * i);
    values.push(Number(val.toFixed(5)));
  }
  return values;
}

/**
 * Resolves a dose sweep specification into a concrete array of values.
 */
export function resolveSweepValues(spec: DoseSweepSpec): (number | string | boolean)[] {
  if (spec.sweepType === 'discrete' || spec.sweepType === 'custom') {
    return [...spec.values];
  }

  if (spec.sweepType === 'linear_range' && spec.rangeConfig) {
    const { min, max, step, stepsCount } = spec.rangeConfig;
    return generateLinearRange(min, max, step, stepsCount);
  }

  if (spec.sweepType === 'logarithmic' && spec.rangeConfig) {
    const { min, max, stepsCount } = spec.rangeConfig;
    return generateLogarithmicRange(min, max, stepsCount || 5);
  }

  return spec.values.length > 0 ? [...spec.values] : [0];
}

/**
 * Expands a DoseSweepSpec and base parameter set into an ordered array of
 * fully populated run configurations.
 */
export function expandDoseSweep(
  spec: DoseSweepSpec,
  baseParameters: Record<string, any> = {}
): ExpandedSweepRun[] {
  const resolvedValues = resolveSweepValues(spec);

  return resolvedValues.map((val, idx) => {
    // A dose is considered baseline if it is numeric 0, false, or the first value
    const isBaselineDose =
      val === 0 || val === '0' || val === false || (idx === 0 && resolvedValues.length > 1);

    const unitStr = spec.unit ? ` ${spec.unit}` : '';
    const label = `${spec.parameter} = ${val}${unitStr}${isBaselineDose ? ' (Baseline Dose)' : ''}`;

    return {
      runIndex: idx,
      parameter: spec.parameter,
      value: val,
      role: 'dose_sweep',
      isBaselineDose,
      label,
      parameters: {
        ...baseParameters,
        [spec.parameter]: val,
      },
    };
  });
}
