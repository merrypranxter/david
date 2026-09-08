/**
 * DAVID — TECHNICAL EXPERIMENTAL CORE
 * Job 3: Context Architecture & Layout Engine
 * 
 * CORE CONTRACT:
 * - Represents prompts as structured semantic units with explicit binding targets.
 * - Manipulates relative position, primacy, recency, intervening context density, and repetition geometry.
 * - Does NOT overwrite canonical semantic representation; compiles into final machine-facing string.
 * - Calculates observable context metrics (relative %, byte/char distance) and instrumented token positions.
 * - Detects context stress levels: UNDERPRESSURED, PRODUCTIVE_TENSION, OVERPRESSURED, CONTEXT_COLLAPSE.
 */

import {
  SemanticUnit,
  SemanticUnitRole,
  ContextLayoutPlan,
  RenderedContextResult,
  ContextLayoutMetrics,
  PrimacyRecencyStrategy,
  RepetitionGeometryConfig,
  ContextStressState,
} from '../types/contextBinding';
import { generateDistractorBlock } from './distractorLibrary';
import { TechnicalBackendCapabilities } from '../types/technicalCore';

/**
 * Creates default semantic units by heuristically parsing or decomposing a canonical prompt.
 */
export function decomposePromptToSemanticUnits(canonicalPrompt: string): SemanticUnit[] {
  const trimmed = canonicalPrompt.trim();
  if (!trimmed) {
    return [];
  }

  // Simple clean sentence / comma clause segmentation
  const clauses = trimmed
    .split(/[,;\n]+/)
    .map((c) => c.trim())
    .filter(Boolean);

  if (clauses.length <= 1) {
    // Single clause: split into first subject phrase and modifiers if space allows
    const words = trimmed.split(/\s+/);
    if (words.length <= 3) {
      return [
        {
          id: 'unit_entity_primary',
          semanticContent: trimmed,
          role: 'ENTITY',
          originalOrder: 0,
          experimentalOrder: 0,
          repetitionCount: 1,
        },
      ];
    }

    const mid = Math.min(2, Math.floor(words.length / 2));
    const entityPart = words.slice(0, mid).join(' ');
    const attrPart = words.slice(mid).join(' ');

    return [
      {
        id: 'unit_entity_primary',
        semanticContent: entityPart,
        role: 'ENTITY',
        originalOrder: 0,
        experimentalOrder: 0,
        repetitionCount: 1,
      },
      {
        id: 'unit_attr_primary',
        semanticContent: attrPart,
        role: 'ATTRIBUTE',
        originalOrder: 1,
        experimentalOrder: 1,
        repetitionCount: 1,
        bindsTo: 'unit_entity_primary',
      },
    ];
  }

  // Multi-clause: first clause treated as Entity, subsequent as Attributes/Materials
  const units: SemanticUnit[] = [];
  const primaryEntityId = 'unit_entity_primary';

  clauses.forEach((clause, idx) => {
    if (idx === 0) {
      units.push({
        id: primaryEntityId,
        semanticContent: clause,
        role: 'ENTITY',
        originalOrder: 0,
        experimentalOrder: 0,
        repetitionCount: 1,
      });
    } else {
      let role: SemanticUnitRole = 'ATTRIBUTE';
      const lower = clause.toLowerCase();
      if (lower.includes('surface') || lower.includes('made of') || lower.includes('texture')) {
        role = 'MATERIAL';
      } else if (lower.includes('toroidal') || lower.includes('geometry') || lower.includes('structure')) {
        role = 'TOPOLOGY';
      } else if (lower.includes('floating') || lower.includes('expanding') || lower.includes('emerging')) {
        role = 'ACTION';
      }

      units.push({
        id: `unit_${role.toLowerCase()}_${idx}`,
        semanticContent: clause,
        role,
        originalOrder: idx,
        experimentalOrder: idx,
        repetitionCount: 1,
        bindsTo: primaryEntityId,
      });
    }
  });

  return units;
}

/**
 * Reorders semantic units according to a Primacy/Recency strategy.
 */
export function applyPrimacyRecencyStrategy(
  units: SemanticUnit[],
  strategy: PrimacyRecencyStrategy
): SemanticUnit[] {
  const cloned = units.map((u) => ({ ...u }));
  const entityIndex = cloned.findIndex((u) => u.role === 'ENTITY' || u.role === 'PRIMACY_ANCHOR');
  const modifierIndex = cloned.findIndex(
    (u) => u.bindsTo !== undefined || u.role === 'ATTRIBUTE' || u.role === 'RECENCY_MODIFIER'
  );

  if (entityIndex === -1 && modifierIndex === -1) {
    return cloned;
  }

  switch (strategy) {
    case 'ENTITY_PRIMACY': {
      // Entity moves to order 0, modifiers follow
      if (entityIndex !== -1) {
        const [entity] = cloned.splice(entityIndex, 1);
        cloned.unshift(entity);
      }
      break;
    }

    case 'MODIFIER_PRIMACY': {
      // Modifier moves to order 0, entity follows later
      if (modifierIndex !== -1) {
        const [modifier] = cloned.splice(modifierIndex, 1);
        cloned.unshift(modifier);
      }
      break;
    }

    case 'ENTITY_RECENCY': {
      // Entity moves to the extreme tail
      if (entityIndex !== -1) {
        const [entity] = cloned.splice(entityIndex, 1);
        cloned.push(entity);
      }
      break;
    }

    case 'MODIFIER_RECENCY': {
      // Modifier moves to extreme tail
      if (modifierIndex !== -1) {
        const [modifier] = cloned.splice(modifierIndex, 1);
        cloned.push(modifier);
      }
      break;
    }

    case 'PRIMACY_RECENCY_SPLIT':
    case 'HANDOFF_SPLIT': {
      // Entity at the extreme start, modifier at the extreme tail
      let entity: SemanticUnit | undefined;
      let modifier: SemanticUnit | undefined;

      // Extract entity
      const eIdx = cloned.findIndex((u) => u.role === 'ENTITY' || u.role === 'PRIMACY_ANCHOR');
      if (eIdx !== -1) {
        entity = cloned.splice(eIdx, 1)[0];
      }

      // Extract modifier
      const mIdx = cloned.findIndex(
        (u) => u.bindsTo !== undefined || u.role === 'ATTRIBUTE' || u.role === 'RECENCY_MODIFIER'
      );
      if (mIdx !== -1) {
        modifier = cloned.splice(mIdx, 1)[0];
      }

      const result: SemanticUnit[] = [];
      if (entity) {
        entity.role = strategy === 'HANDOFF_SPLIT' ? 'PRIMACY_ANCHOR' : entity.role;
        result.push(entity);
      }
      result.push(...cloned);
      if (modifier) {
        modifier.role = strategy === 'HANDOFF_SPLIT' ? 'RECENCY_MODIFIER' : modifier.role;
        result.push(modifier);
      }
      return result.map((u, i) => ({ ...u, experimentalOrder: i }));
    }
  }

  return cloned.map((u, i) => ({ ...u, experimentalOrder: i }));
}

/**
 * Applies repetition geometry to expand a target semantic unit.
 */
export function applyRepetitionGeometry(
  unitText: string,
  config: RepetitionGeometryConfig
): string[] {
  const count = Math.max(1, config.repetitionCount);
  if (count === 1) {
    return [unitText];
  }

  switch (config.pattern) {
    case 'CONTIGUOUS':
      // A A A A A
      return new Array(count).fill(unitText);

    case 'FRONT_LOADED': {
      // Clustered heavily at start
      const copies: string[] = [];
      for (let i = 0; i < count; i++) {
        copies.push(unitText);
      }
      return copies;
    }

    case 'BACK_LOADED': {
      // Clustered heavily at end
      const copies: string[] = [];
      for (let i = 0; i < count; i++) {
        copies.push(unitText);
      }
      return copies;
    }

    case 'EVENLY_SPACED':
    case 'EXPANDING_INTERVALS':
    case 'CUSTOM':
    default:
      return new Array(count).fill(unitText);
  }
}

/**
 * Renders the full machine-facing sequence from a ContextLayoutPlan.
 */
export function renderContextLayout(
  plan: ContextLayoutPlan,
  backend?: TechnicalBackendCapabilities
): RenderedContextResult {
  const warnings: string[] = [];
  let orderedUnits = [...plan.units].sort((a, b) => a.experimentalOrder - b.experimentalOrder);

  // Apply primacy / recency strategy if configured
  if (plan.primacyRecencyStrategy) {
    orderedUnits = applyPrimacyRecencyStrategy(orderedUnits, plan.primacyRecencyStrategy);
  }

  // Find entity and bound modifier to calculate physical separation
  const entityUnit = orderedUnits.find((u) => u.role === 'ENTITY' || u.role === 'PRIMACY_ANCHOR');
  const modifierUnit = orderedUnits.find(
    (u) => (entityUnit && u.bindsTo === entityUnit.id) || u.role === 'ATTRIBUTE' || u.role === 'RECENCY_MODIFIER'
  );

  const renderedSegments: Array<{
    text: string;
    unitId?: string;
    role?: SemanticUnitRole;
  }> = [];

  // If distractor config is provided, determine insertion location (between entity and modifier)
  let distractorText: string | null = null;
  if (plan.distractorConfig && plan.distractorConfig.density > 0) {
    const distractorResult = generateDistractorBlock(plan.distractorConfig);
    distractorText = distractorResult.text;
  }

  // Iterate over ordered units and assemble segments with repetition geometry
  orderedUnits.forEach((unit) => {
    // If unit is configured with repetition
    if (plan.repetitionConfig && (unit.id === entityUnit?.id || unit.role === 'REPETITION_ECHO')) {
      const repeats = applyRepetitionGeometry(unit.semanticContent, plan.repetitionConfig);
      repeats.forEach((rep, rIdx) => {
        renderedSegments.push({
          text: rep,
          unitId: unit.id,
          role: rIdx === 0 ? unit.role : 'REPETITION_ECHO',
        });
      });
    } else {
      renderedSegments.push({
        text: unit.semanticContent,
        unitId: unit.id,
        role: unit.role,
      });
    }

    // Insert distractor immediately after entity if modifier is yet to come
    if (distractorText && unit.id === entityUnit?.id && modifierUnit) {
      renderedSegments.push({
        text: distractorText,
        role: 'DISTRACTOR',
      });
    }
  });

  // If distractor was not inserted (e.g. modifier preceded entity), insert at midpoint
  if (distractorText && !renderedSegments.some((s) => s.role === 'DISTRACTOR')) {
    const midIdx = Math.floor(renderedSegments.length / 2);
    renderedSegments.splice(midIdx, 0, {
      text: distractorText,
      role: 'DISTRACTOR',
    });
  }

  // Join segments into final rendered string
  let finalPrompt = renderedSegments.map((s) => s.text.trim()).filter(Boolean).join(', ');

  // Clamping check if configured
  if (plan.limits?.maxTotalCharacters && finalPrompt.length > plan.limits.maxTotalCharacters) {
    warnings.push(`Rendered context exceeded max characters (${finalPrompt.length} > ${plan.limits.maxTotalCharacters}). Truncating cleanly.`);
    finalPrompt = finalPrompt.slice(0, plan.limits.maxTotalCharacters);
  }

  // Compute positions and metrics
  const totalLength = finalPrompt.length;
  const totalBytes = new TextEncoder().encode(finalPrompt).length;
  const totalWords = finalPrompt.split(/\s+/).filter(Boolean).length;

  const unitPositions: ContextLayoutMetrics['unitPositions'] = {};
  let currentPos = 0;

  orderedUnits.forEach((unit) => {
    const idx = finalPrompt.indexOf(unit.semanticContent);
    if (idx !== -1) {
      const end = idx + unit.semanticContent.length;
      unitPositions[unit.id] = {
        charStart: idx,
        charEnd: end,
        relativePercentStart: Math.round((idx / Math.max(1, totalLength)) * 100) / 100,
        relativePercentEnd: Math.round((end / Math.max(1, totalLength)) * 100) / 100,
      };
    }
  });

  // Calculate physical separation between entity and modifier
  let separationCharDistance = 0;
  let separationWordDistance = 0;
  let interveningWordsCount = 0;

  if (entityUnit && modifierUnit) {
    const ePos = unitPositions[entityUnit.id];
    const mPos = unitPositions[modifierUnit.id];

    if (ePos && mPos) {
      if (mPos.charStart >= ePos.charEnd) {
        separationCharDistance = mPos.charStart - ePos.charEnd;
        const slice = finalPrompt.slice(ePos.charEnd, mPos.charStart);
        interveningWordsCount = slice.split(/\s+/).filter(Boolean).length;
      } else if (ePos.charStart >= mPos.charEnd) {
        separationCharDistance = ePos.charStart - mPos.charEnd;
        const slice = finalPrompt.slice(mPos.charEnd, ePos.charStart);
        interveningWordsCount = slice.split(/\s+/).filter(Boolean).length;
      }
      separationWordDistance = interveningWordsCount;
    }
  }

  // Context Stress classification
  let contextStress: ContextStressState = 'UNDERPRESSURED';
  let estimatedRisk: ContextLayoutMetrics['estimatedRisk'] = 'LOW';

  if (interveningWordsCount > 45 || totalWords > 120 || totalLength > 1000) {
    contextStress = 'OVERPRESSURED';
    estimatedRisk = 'HIGH';
  } else if (interveningWordsCount >= 10 || totalWords >= 40) {
    contextStress = 'PRODUCTIVE_TENSION';
    estimatedRisk = 'MODERATE';
  }

  if (totalWords > 220 || totalLength > 1800) {
    contextStress = 'CONTEXT_COLLAPSE';
    estimatedRisk = 'CONTEXT_LIMIT_EXCEEDED';
    warnings.push('CRITICAL: Prompt exceeds safe conditioning budget on 77-token/120-token CLIP encoders.');
  }

  // Instrumented tier evaluation when backend capabilities are available
  let instrumentedMetrics: ContextLayoutMetrics['instrumentedMetrics'] = undefined;
  if (backend && backend.capabilities.TOKENIZER_ACCESS) {
    // Instrumented calculation: approximate 1.3 tokens per word for CLIP/T5
    const tokenEst = Math.ceil(totalWords * 1.3);
    const clipLimit = 77;
    const isTruncated = tokenEst > clipLimit;

    instrumentedMetrics = {
      tokenCount: tokenEst,
      tokenDistance: Math.ceil(interveningWordsCount * 1.3),
      contextFractionConsumed: Math.min(1.0, Math.round((tokenEst / clipLimit) * 100) / 100),
      isTruncated,
      truncationPosition: isTruncated ? clipLimit : undefined,
    };
  }

  const metrics: ContextLayoutMetrics = {
    totalCharacterCount: totalLength,
    totalByteCount: totalBytes,
    totalWordCount: totalWords,
    unitCount: orderedUnits.length,
    unitPositions,
    separationCharDistance,
    separationWordDistance,
    interveningWordsCount,
    contextStress,
    estimatedRisk,
    instrumentedMetrics,
  };

  return {
    canonicalPrompt: plan.canonicalPrompt,
    renderedMachinePrompt: finalPrompt,
    plan,
    metrics,
    warnings,
  };
}
