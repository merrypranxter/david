import { compileMutationRecipe, describeMutationRecipe } from '../src/utils/recipeCompiler';
import { getEntropyProfile } from '../src/utils/entropyProfile';
import { normalizeWeightedSelections } from '../src/utils/compilerHelpers';

console.log('=== RUNNING JOB 4 MUTATION RECIPE COMPILER TEST SUITE ===\n');

// -------------------------------------------------------------
// TEST A: Subtle Drift with Identity Anchor
// Concept: "@merry dancing", Entropy: 2
// -------------------------------------------------------------
console.log('--- TEST A: Subtle Drift with Identity Anchor ---');
const recipeA = compileMutationRecipe({
  concept: '@merry dancing',
  entropyLevel: 2,
  deterministicSeed: 42,
});

console.log('Recipe A Summary:', recipeA.diagnosticSummary);
console.log('Operators:', recipeA.operators);
console.log('Attractors:', recipeA.attractors);
console.log('Preserved Anchors:', recipeA.preservedAnchors);
console.log('Semantic Distance:', recipeA.semanticDistance);

const hasAnchorA = recipeA.preservedAnchors?.includes('@merry');
const isSmallDistanceA = (recipeA.semanticDistance ?? 0) <= 0.25;
const lowOpCountA = recipeA.operators.length === 1;
const attractorCountA = (recipeA.attractors?.length ?? 0) <= 1;

console.log('Assert Anchor @merry:', hasAnchorA ? 'PASS' : 'FAIL');
console.log('Assert Low Semantic Distance (<= 0.25):', isSmallDistanceA ? 'PASS' : 'FAIL');
console.log('Assert Exactly 1 Operator:', lowOpCountA ? 'PASS' : 'FAIL');
console.log('Assert 0-1 Attractor:', attractorCountA ? 'PASS' : 'FAIL');

if (!hasAnchorA || !isSmallDistanceA || !lowOpCountA || !attractorCountA) {
  throw new Error('Test A failed assertions');
}

// -------------------------------------------------------------
// TEST B: Structural Distortion & Topology
// Concept: "@merry aerobically dancing while her anatomy becomes a Möbius continuity", Entropy: 6
// -------------------------------------------------------------
console.log('\n--- TEST B: Structural Distortion & Topology ---');
const recipeB = compileMutationRecipe({
  concept: '@merry aerobically dancing while her anatomy becomes a Möbius continuity',
  entropyLevel: 6,
  deterministicSeed: 42,
});

console.log('Recipe B Summary:', recipeB.diagnosticSummary);
console.log('Operators:', recipeB.operators);
console.log('Attractors:', recipeB.attractors);
console.log('Preserved Anchors:', recipeB.preservedAnchors);
console.log('Semantic Distance:', recipeB.semanticDistance);

const hasAnchorB = recipeB.preservedAnchors?.includes('@merry');
const moderateDistanceB = (recipeB.semanticDistance ?? 0) >= 0.5 && (recipeB.semanticDistance ?? 0) <= 0.7;
const multipleOpsB = recipeB.operators.length >= 2 && recipeB.operators.length <= 4;

console.log('Assert Anchor @merry Preserved:', hasAnchorB ? 'PASS' : 'FAIL');
console.log('Assert Moderate Semantic Distance (~0.62):', moderateDistanceB ? 'PASS' : 'FAIL');
console.log('Assert 2-4 Operators Active:', multipleOpsB ? 'PASS' : 'FAIL');

if (!hasAnchorB || !moderateDistanceB || !multipleOpsB) {
  throw new Error('Test B failed assertions');
}

// -------------------------------------------------------------
// TEST C: Epistemic Collapse / Paradox Object
// Concept: "an impossible object simultaneously inside and outside itself", Entropy: 9
// -------------------------------------------------------------
console.log('\n--- TEST C: Epistemic Collapse & Paradox Object ---');
const recipeC = compileMutationRecipe({
  concept: 'an impossible object simultaneously inside and outside itself',
  entropyLevel: 9,
  deterministicSeed: 42,
});

console.log('Recipe C Summary:', recipeC.diagnosticSummary);
console.log('Operators:', recipeC.operators);
console.log('Attractors:', recipeC.attractors);
console.log('Semantic Distance:', recipeC.semanticDistance);

const highDistanceC = (recipeC.semanticDistance ?? 0) >= 0.85;
const highOpCountC = recipeC.operators.length >= 4;
const hasAppropriateAttractorC = recipeC.attractors?.some(a => ['void', 'aberration', 'crystalline'].includes(a.id));

console.log('Assert High Semantic Distance (>= 0.85):', highDistanceC ? 'PASS' : 'FAIL');
console.log('Assert High Operator Count (>= 4):', highOpCountC ? 'PASS' : 'FAIL');
console.log('Assert Void/Aberration/Crystalline Attractor Present:', hasAppropriateAttractorC ? 'PASS' : 'FAIL');

if (!highDistanceC || !highOpCountC || !hasAppropriateAttractorC) {
  throw new Error('Test C failed assertions');
}

// -------------------------------------------------------------
// TEST D: Audio / Suno Specialization
// Concept: "lone reed flute playing a haunting slow melody", Target: Suno, Entropy: 5
// -------------------------------------------------------------
console.log('\n--- TEST D: Audio / Suno Specialization ---');
const recipeD = compileMutationRecipe({
  concept: 'lone reed flute playing a haunting slow melody',
  targetEngine: 'suno',
  entropyLevel: 5,
  deterministicSeed: 42,
});

console.log('Recipe D Summary:', recipeD.diagnosticSummary);
console.log('Operators:', recipeD.operators);
console.log('Attractors:', recipeD.attractors);

const hasNoVisualOnlyOpsD = !recipeD.operators.some(o => o.id === 'visual_chiasmus' || o.id === 'perspective_scramble');
const hasAudioAttractorD = recipeD.attractors?.some(a => ['echo', 'simulacrum', 'spectral', 'ghost'].includes(a.id));

console.log('Assert No Purely Visual Operators Forced:', hasNoVisualOnlyOpsD ? 'PASS' : 'FAIL');
console.log('Assert Audio-Appropriate Attractor (Echo/Spectral/Simulacrum):', hasAudioAttractorD ? 'PASS' : 'FAIL');

if (!hasNoVisualOnlyOpsD || !hasAudioAttractorD) {
  throw new Error('Test D failed assertions');
}

// -------------------------------------------------------------
// TEST E: Explicit Selection Preservation & Relative Weights
// -------------------------------------------------------------
console.log('\n--- TEST E: Explicit Selection Preservation ---');
const recipeE = compileMutationRecipe({
  concept: 'a cathedral made of light',
  entropyLevel: 7,
  selectedOperators: [
    { id: 'ontology_swap', weight: 3 },
    { id: 'concept_bleed', weight: 1 },
  ],
  selectedAttractors: [
    { id: 'crystalline', weight: 2 },
    { id: 'void', weight: 1 },
  ],
  selectedContentSeeds: ['quasicrystal', 'lye', 'peano curve'],
  deterministicSeed: 123,
});

console.log('Recipe E Summary:', recipeE.diagnosticSummary);
console.log('Explicit Operators:', recipeE.operators);
console.log('Explicit Attractors:', recipeE.attractors);
console.log('Content DNA:', recipeE.contentDna);

const hasOntologySwap = recipeE.operators.find(o => o.id === 'ontology_swap');
const hasConceptBleed = recipeE.operators.find(o => o.id === 'concept_bleed');
const hasCrystalline = recipeE.attractors?.find(a => a.id === 'crystalline');
const hasVoid = recipeE.attractors?.find(a => a.id === 'void');

console.log('Assert Ontology Swap Preserved:', Boolean(hasOntologySwap) ? 'PASS' : 'FAIL');
console.log('Assert Concept Bleed Preserved:', Boolean(hasConceptBleed) ? 'PASS' : 'FAIL');
console.log('Assert Relative Weight Ratio (~3:1 for operators):',
  (hasOntologySwap && hasConceptBleed && (hasOntologySwap.weight ?? 0) > (hasConceptBleed.weight ?? 0)) ? 'PASS' : 'FAIL'
);
console.log('Assert Content DNA classified separately:', recipeE.contentDna?.includes('quasicrystal') ? 'PASS' : 'FAIL');

if (!hasOntologySwap || !hasConceptBleed || !hasCrystalline || !hasVoid) {
  throw new Error('Test E failed assertions');
}

// -------------------------------------------------------------
// TEST F: Deterministic PRNG Seed Verification
// -------------------------------------------------------------
console.log('\n--- TEST F: Deterministic PRNG Seed Verification ---');
const run1 = compileMutationRecipe({
  concept: 'quantum foam boiling in empty vacuum',
  entropyLevel: 8,
  deterministicSeed: 'seed_xyz_789',
});

const run2 = compileMutationRecipe({
  concept: 'quantum foam boiling in empty vacuum',
  entropyLevel: 8,
  deterministicSeed: 'seed_xyz_789',
});

console.log('Run 1 Summary:', run1.diagnosticSummary);
console.log('Run 2 Summary:', run2.diagnosticSummary);
const isIdentical = run1.diagnosticSummary === run2.diagnosticSummary &&
  JSON.stringify(run1.operators) === JSON.stringify(run2.operators) &&
  JSON.stringify(run1.attractors) === JSON.stringify(run2.attractors);

console.log('Assert Deterministic Match:', isIdentical ? 'PASS' : 'FAIL');
if (!isIdentical) {
  throw new Error('Test F determinism failed');
}

// -------------------------------------------------------------
// TEST G: Weight Normalization Edge Cases
// -------------------------------------------------------------
console.log('\n--- TEST G: Weight Normalization Edge Cases ---');
const edge1 = normalizeWeightedSelections([
  { id: 'op1', weight: 0 },
  { id: 'op2', weight: 0 },
]);
console.log('Zero Total Weight Fallback:', edge1);
const sum1 = edge1.reduce((acc, i) => acc + (i.weight ?? 0), 0);
console.log('Assert Sum approx 1.0 on zero fallback:', Math.abs(sum1 - 1.0) < 0.01 ? 'PASS' : 'FAIL');

const edge2 = normalizeWeightedSelections([
  { id: 'op1', weight: NaN },
  { id: 'op2', weight: -5 },
  { id: 'op3', weight: 2 },
]);
console.log('NaN & Negative Weight Sanitization:', edge2);
const sum2 = edge2.reduce((acc, i) => acc + (i.weight ?? 0), 0);
console.log('Assert Sum approx 1.0 on sanitized values:', Math.abs(sum2 - 1.0) < 0.01 ? 'PASS' : 'FAIL');

if (Math.abs(sum1 - 1.0) >= 0.01 || Math.abs(sum2 - 1.0) >= 0.01) {
  throw new Error('Test G normalization failed');
}

console.log('\n=== ALL JOB 4 TESTS PASSED CLEANLY ===');
