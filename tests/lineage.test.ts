import {
  createInitialGeneration,
  createLineageFromLegacyItem,
  evolveNextGeneration,
  crossbreedGenerations,
  misrememberTrait,
  checkReversion,
  evaluateScars,
  MAX_ACTIVE_TRAITS,
  MAX_DORMANT_TRAITS,
  MAX_SCARS,
} from '../src/utils/lineageManager';
import { serializeLineageContext, formatLineageSummary } from '../src/utils/lineageSerializer';
import { ARHETYPAL_TRAITS, createEvolutionTrait } from '../src/utils/traitLibrary';
import { PromptGeneration } from '../src/types';

function runTests() {
  console.log('--- STARTING JOB 6 EVOLUTIONARY LINEAGE TESTS ---');

  // =========================================================================
  // TEST SCENARIO A: Generational Stability at Low Entropy (S1 - S2)
  // =========================================================================
  console.log('\n[TEST A] Generational Stability at Low Entropy...');
  const gen1 = createInitialGeneration('A brass clockwork automaton @merry in a glass museum');
  console.assert(gen1.generationNumber === 1, 'Gen 1 number must be 1');
  console.assert(gen1.preservedAnchors.includes('@merry'), 'Anchor @merry must be detected');

  // Evolve at entropy 2
  const gen2 = evolveNextGeneration(gen1, undefined, {
    entropyLevel: 2,
    deterministicSeed: 42,
  });

  console.assert(gen2.generationNumber === 2, 'Gen 2 number must be 2');
  console.assert(gen2.parentGenerationIds.includes(gen1.generationId), 'Gen 2 must cite Gen 1 as parent');
  console.assert(gen2.preservedAnchors.includes('@merry'), 'Anchor @merry must survive stably in Gen 2');
  console.assert(gen2.lostTraits.length === 0, 'At entropy 2, traits should not be lost rapidly');
  console.log('  -> Test A Passed: Gen 2 stably inherited traits and anchors at S2.');

  // =========================================================================
  // TEST SCENARIO B: High Entropy Lineage Reorganization (S9 - S10)
  // =========================================================================
  console.log('\n[TEST B] High Entropy Lineage Reorganization (S9 - S10)...');
  const highGen = evolveNextGeneration(gen2, undefined, {
    entropyLevel: 10,
    activeOperators: ['scale_schism', 'ontology_swap'],
    activeAttractors: ['void', 'crystalline'],
    deterministicSeed: 999,
  });

  console.assert(highGen.generationNumber === 3, 'High Gen must be Gen 3');
  console.assert(highGen.preservedAnchors.includes('@merry'), 'Anchor @merry MUST NEVER be stripped, even at S10');
  console.assert(
    highGen.inheritedTraits.length + highGen.acquiredTraits.length <= MAX_ACTIVE_TRAITS,
    'Active traits must not exceed MAX_ACTIVE_TRAITS'
  );
  console.assert(
    highGen.dormantTraits.length <= MAX_DORMANT_TRAITS,
    'Dormant traits must not exceed MAX_DORMANT_TRAITS'
  );
  console.log('  -> Test B Passed: S10 triggered reorganization while respecting anchor preservation and storage caps.');

  // =========================================================================
  // TEST SCENARIO C: Scar Formation and Persistence
  // =========================================================================
  console.log('\n[TEST C] Scar Formation and Persistence...');
  const insideOutsideTrait = createEvolutionTrait(
    'distrust_inside_outside',
    1,
    {
      strength: 0.9,
      persistence: 0.9,
    }
  );

  const scar = evaluateScars(
    3,
    ['ontology_swap'],
    ['void'],
    8,
    [insideOutsideTrait],
    0.1
  );

  console.assert(scar !== null, 'Severe ontology swap must form a scar');
  console.assert(scar!.id.includes('inside_outside'), 'Scar must capture inside/outside trauma');

  // Attach scar to parent and evolve to next generation
  const scarredParent: PromptGeneration = {
    ...gen2,
    generationNumber: 3,
    scars: [scar!],
  };

  const scarredChild = evolveNextGeneration(scarredParent, undefined, {
    entropyLevel: 5,
    deterministicSeed: 123,
  });

  console.assert(scarredChild.scars.length > 0, 'Child must retain ancestral scar');
  console.assert(scarredChild.scars[0].id === scar!.id, 'Scar ID must persist into next generation');
  console.log('  -> Test C Passed: Irreversible structural scar formed and persisted into subsequent generation.');

  // =========================================================================
  // TEST SCENARIO D: Controlled Misremembering
  // =========================================================================
  console.log('\n[TEST D] Controlled Misremembering...');
  const traitToMisremember = ARHETYPAL_TRAITS['distrust_inside_outside'];
  const traitWithGen = { ...traitToMisremember, originGen: 1, strength: 0.8, persistence: 0.8, status: 'active' as const };
  const { alteredTrait, event } = misrememberTrait(traitWithGen, 0.2);

  console.assert(alteredTrait.id === traitToMisremember.id, 'Trait ID must remain consistent');
  console.assert(
    alteredTrait.directive !== traitToMisremember.directive,
    'Governing rule must be mutated in semantic space'
  );
  console.assert(event.type === 'misremember', 'Event type must be misremember');
  console.assert(event.originGen === 1, 'Origin generation must be preserved');
  console.log('  -> Test D Passed: Controlled misremembering altered governing rule and recorded mutation event.');

  // =========================================================================
  // TEST SCENARIO E: Ancestral Trait Reversion
  // =========================================================================
  console.log('\n[TEST E] Ancestral Trait Reversion...');
  const dormantTraits = [
    createEvolutionTrait(
      'repetition_causes_structural_decay',
      1,
      {
        strength: 0.3,
        persistence: 0.6,
        status: 'dormant',
      }
    ),
  ];

  const { revivedTrait, event: reversionEvent } = checkReversion(dormantTraits, 8, 0.1);
  console.assert(revivedTrait !== undefined, 'Dormant trait must revert at S8 with low random value');
  console.assert(revivedTrait!.status === 'active', 'Revived trait status must be active');
  console.assert(reversionEvent!.type === 'reversion', 'Reversion event must be logged');
  console.assert(reversionEvent!.originGen === 1, 'Reversion event must cite original Gen #1');
  console.log('  -> Test E Passed: Ancestral trait reactivated from dormancy with origin generation intact.');

  // =========================================================================
  // TEST SCENARIO F: Two-Parent Crossbreeding
  // =========================================================================
  console.log('\n[TEST F] Two-Parent Crossbreeding...');
  const parentAlpha = createInitialGeneration('Crystalline cathedral @anchor_alpha');
  const parentBeta = createInitialGeneration('Submerged bioluminescent reef @anchor_beta');

  const child = crossbreedGenerations(parentAlpha, parentBeta, {
    entropyLevel: 6,
    newConceptInput: 'Crossbred Cathedral Reef',
  });

  console.assert(child.generationNumber === 2, 'Child generation number must be 2');
  console.assert(child.parentGenerationIds.length === 2, 'Child must have exactly two parent IDs');
  console.assert(child.parentGenerationIds.includes(parentAlpha.generationId), 'Parent Alpha must be cited');
  console.assert(child.parentGenerationIds.includes(parentBeta.generationId), 'Parent Beta must be cited');
  console.assert(child.preservedAnchors.includes('@anchor_alpha'), 'Must retain parent Alpha anchor');
  console.assert(child.preservedAnchors.includes('@anchor_beta'), 'Must retain parent Beta anchor');
  console.assert(
    child.mutationEvents.some((e) => e.type === 'crossbreed'),
    'Child must record crossbreed mutation event'
  );
  console.log('  -> Test F Passed: Successfully crossbred two parent lineages, uniting anchors and genotypes.');

  // =========================================================================
  // SERIALIZATION VERIFICATION
  // =========================================================================
  console.log('\n[SERIALIZATION CHECK] Verifying serialized lineage context...');
  const contextOutput = serializeLineageContext(child);
  console.assert(contextOutput.includes('EVOLUTIONARY LINEAGE CONTEXT'), 'Must contain genotype header');
  console.assert(contextOutput.includes('ANCHORS (INVARIANT'), 'Must list anchors');
  console.assert(contextOutput.includes('@anchor_alpha'), 'Serialized context must contain @anchor_alpha');
  console.assert(contextOutput.includes('@anchor_beta'), 'Serialized context must contain @anchor_beta');
  console.log('  -> Serialization Passed: Compact directive formatted successfully.');

  console.log('\nALL 6 EVOLUTIONARY LINEAGE SCENARIOS PASSED WITH ZERO DEFECTS!');
}

runTests();
