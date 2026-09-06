import { PromptGeneration } from '../types';

/**
 * Compact lineage context serializer for the synthesis model prompt.
 * Keeps the evolutionary genotype concise and actionable for David 8,
 * without exposing internal hidden reasoning or bloating token context.
 */
export function serializeLineageContext(generation: PromptGeneration): string {
  const parts: string[] = [];

  parts.push(`=== EVOLUTIONARY LINEAGE CONTEXT ===`);
  parts.push(`GENERATION: #${generation.generationNumber}`);
  parts.push(
    `PARENTS: ${
      generation.parentGenerationIds && generation.parentGenerationIds.length > 0
        ? generation.parentGenerationIds.join(', ')
        : 'GEN 0 (Origin)'
    }`
  );

  // Invariant Anchors
  if (generation.preservedAnchors && generation.preservedAnchors.length > 0) {
    parts.push(`ANCHORS (INVARIANT - MUST BE PRESERVED WITHOUT EXCEPTION):`);
    for (const anchor of generation.preservedAnchors) {
      parts.push(`  * "${anchor}"`);
    }
  }

  // Inherited Structural Traits
  if (generation.inheritedTraits && generation.inheritedTraits.length > 0) {
    parts.push(`ACTIVE INHERITED TRAITS (STRUCTURAL GOVERNING RULES):`);
    for (const trait of generation.inheritedTraits) {
      parts.push(`  * ${trait.label} [str:${Math.round(trait.strength * 100)}%]: ${trait.directive}`);
    }
  }

  // Newly Acquired Traits
  if (generation.acquiredTraits && generation.acquiredTraits.length > 0) {
    parts.push(`NEWLY ACQUIRED TRAITS (GEN #${generation.generationNumber}):`);
    for (const trait of generation.acquiredTraits) {
      parts.push(`  * ${trait.label}: ${trait.directive}`);
    }
  }

  // Persistent Scars
  if (generation.scars && generation.scars.length > 0) {
    parts.push(`LINEAGE SCARS (PERSISTENT STRUCTURAL ERRORS/MEMORY FROM ANCESTRY):`);
    for (const scar of generation.scars) {
      parts.push(`  * ${scar.label} [Origin Gen #${scar.originGen}]: ${scar.description}`);
    }
  }

  // Dormant Traits
  if (generation.dormantTraits && generation.dormantTraits.length > 0) {
    parts.push(`DORMANT ANCESTRAL TRAITS (LATENT):`);
    for (const dormant of generation.dormantTraits.slice(0, 3)) {
      parts.push(`  * ${dormant.label} [Origin Gen #${dormant.originGen}]`);
    }
  }

  // Mutation Events
  if (generation.mutationEvents && generation.mutationEvents.length > 0) {
    parts.push(`GENERATION MUTATION EVENTS:`);
    for (const event of generation.mutationEvents) {
      parts.push(`  * [${event.type.toUpperCase()}]: ${event.description}`);
    }
  }

  parts.push(
    `RULE OF SUCCESSION: Synthesize the [SLOP] phenotype by executing these active traits and persistent scars upon the input anchors. Do NOT simply concatenate previous generation text.`
  );

  return parts.join('\n');
}

/**
 * Concise, readable lineage summary for UI diagnostics and history records.
 */
export function formatLineageSummary(generation: PromptGeneration): string {
  const parts: string[] = [];

  const genNum = generation.generationNumber;
  const parentText =
    generation.parentGenerationIds.length > 0
      ? generation.parentGenerationIds.join(' + ')
      : 'Genesis';

  const inheritedCount = generation.inheritedTraits.length;
  const acquiredCount = generation.acquiredTraits.length;
  const dormantCount = generation.dormantTraits.length;
  const scarCount = generation.scars.length;

  let summary = `GEN #${genNum} (Parent: ${parentText}): ${inheritedCount} active trait${inheritedCount === 1 ? '' : 's'}`;

  if (acquiredCount > 0) {
    summary += `, +${acquiredCount} acquired`;
  }

  if (dormantCount > 0) {
    summary += `, ${dormantCount} dormant`;
  }

  if (scarCount > 0) {
    summary += `, ${scarCount} persistent scar${scarCount === 1 ? '' : 's'}`;
  }

  // Highlights of mutation events (e.g. misremember, reversion, crossbreed)
  const notableEvents = generation.mutationEvents.filter(
    (e) => e.type === 'misremember' || e.type === 'reversion' || e.type === 'crossbreed' || e.type === 'scar_formed'
  );

  if (notableEvents.length > 0) {
    const eventSummaries = notableEvents.map((e) => e.description).join('; ');
    summary += ` [Events: ${eventSummaries}]`;
  }

  if (generation.preservedAnchors.length > 0) {
    summary += ` &bull; Preserved anchors: ${generation.preservedAnchors.join(', ')}`;
  }

  return summary;
}
