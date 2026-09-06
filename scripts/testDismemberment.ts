import {
  decomposeConceptLocally,
  detectAnchors,
  reconstructConcept,
  executeStructuralDismemberment,
  replaceOrganValue,
  freezeOrgan,
  unfreezeOrgan,
  setOrganPreserveStrength,
  getOrgansByType,
  cloneDecomposedConcept,
  compareOrganValues,
} from '../src/utils/conceptDismemberment';

console.log('=== RUNNING JOB 3 STRUCTURAL DISMEMBERMENT TEST SUITE ===\n');

// -------------------------------------------------------------
// TEST A: Visual & Morphological + Media
// "A woman performs aerobics while her body becomes a Möbius strip, filmed like a damaged 1980s VHS tape."
// -------------------------------------------------------------
console.log('--- TEST A: Visual & Morphological + Media ---');
const inputA = 'A woman performs aerobics while her body becomes a Möbius strip, filmed like a damaged 1980s VHS tape.';
const resA = decomposeConceptLocally(inputA);

console.log('Input:', inputA);
console.log('Organs identified:', resA.organs.map(o => `[${o.type}]: "${o.currentValue}"`).join(' | '));
console.log('Reconstructed:', resA.reconstructedText);

const hasSubjectA = resA.organs.some(o => (o.type === 'subject' || o.type === 'identity') && o.currentValue.toLowerCase().includes('woman'));
const hasActionA = resA.organs.some(o => o.type === 'action' && o.currentValue.toLowerCase().includes('aerobics'));
const hasTransformA = resA.organs.some(o => o.type === 'transformation' && o.currentValue.toLowerCase().includes('möbius'));
const hasMediaA = resA.organs.some(o => o.type === 'media' && o.currentValue.toLowerCase().includes('vhs'));

console.log('Assert Subject (woman):', hasSubjectA ? 'PASS' : 'FAIL');
console.log('Assert Action (performs aerobics):', hasActionA ? 'PASS' : 'FAIL');
console.log('Assert Transformation (Möbius strip):', hasTransformA ? 'PASS' : 'FAIL');
console.log('Assert Media (VHS tape):', hasMediaA ? 'PASS' : 'FAIL');
if (!hasSubjectA || !hasActionA || !hasTransformA || !hasMediaA) {
  throw new Error('Test A assertions failed');
}

// -------------------------------------------------------------
// TEST B: Named Identity Anchor + Relational Motion
// "@merry stands still while her reflection moves independently behind her."
// -------------------------------------------------------------
console.log('\n--- TEST B: Named Identity Anchor + Relational Motion ---');
const inputB = '@merry stands still while her reflection moves independently behind her.';
const resB = decomposeConceptLocally(inputB);

console.log('Input:', inputB);
console.log('Organs identified:', resB.organs.map(o => `[${o.type}]: "${o.currentValue}" (anchor: ${o.preserveStrength})`).join(' | '));
console.log('Detected Anchors:', resB.detectedAnchors);
console.log('Reconstructed:', resB.reconstructedText);

const hasIdentityB = resB.organs.some(o => o.currentValue.includes('@merry') && o.preserveStrength >= 0.9 && !o.mutationAllowed);
const hasActionB = resB.organs.some(o => o.type === 'action' && o.currentValue.toLowerCase().includes('stands still'));
const hasSpatialB = resB.organs.some(o => (o.type === 'spatial_relation' || o.type === 'transformation') && o.currentValue.toLowerCase().includes('reflection'));

console.log('Assert Anchor @merry strongly preserved (strength >= 0.9, locked):', hasIdentityB ? 'PASS' : 'FAIL');
console.log('Assert Action (stands still):', hasActionB ? 'PASS' : 'FAIL');
console.log('Assert Reflection Spatial/Relational:', hasSpatialB ? 'PASS' : 'FAIL');
if (!hasIdentityB || !hasActionB || !hasSpatialB) {
  throw new Error('Test B assertions failed');
}

// -------------------------------------------------------------
// TEST C: Paradoxical Physical/Conceptual Object
// "An impossible translucent solid object that is simultaneously inside and outside itself."
// -------------------------------------------------------------
console.log('\n--- TEST C: Paradoxical Physical/Conceptual Object ---');
const inputC = 'An impossible translucent solid object that is simultaneously inside and outside itself.';
const resC = decomposeConceptLocally(inputC);

console.log('Input:', inputC);
console.log('Organs identified:', resC.organs.map(o => `[${o.type}]: "${o.currentValue}"`).join(' | '));
console.log('Reconstructed:', resC.reconstructedText);

const hasSubjectC = resC.organs.some(o => o.type === 'subject' && o.currentValue.toLowerCase().includes('object'));
const hasMaterialC = resC.organs.some(o => o.type === 'material' && o.currentValue.toLowerCase().includes('translucent solid'));
const hasRuleC = resC.organs.some(o => (o.type === 'governing_rule' || o.type === 'spatial_relation') && o.currentValue.toLowerCase().includes('inside and outside itself'));

console.log('Assert Subject (object):', hasSubjectC ? 'PASS' : 'FAIL');
console.log('Assert Material (translucent solid):', hasMaterialC ? 'PASS' : 'FAIL');
console.log('Assert Governing Rule / Paradox (inside and outside itself):', hasRuleC ? 'PASS' : 'FAIL');
if (!hasSubjectC || !hasMaterialC || !hasRuleC) {
  throw new Error('Test C assertions failed');
}

// -------------------------------------------------------------
// TEST D: Multimodal Audio / Negative Constraints
// "pure signal-decay noise, no vocals, melody, chords, drums, or conventional song structure"
// -------------------------------------------------------------
console.log('\n--- TEST D: Multimodal Audio / Negative Constraints ---');
const inputD = 'pure signal-decay noise, no vocals, melody, chords, drums, or conventional song structure';
const resD = decomposeConceptLocally(inputD);

console.log('Input:', inputD);
console.log('Organs identified:', resD.organs.map(o => `[${o.type}]: "${o.currentValue}"`).join(' | '));
console.log('Reconstructed:', resD.reconstructedText);

const hasAudioSubjectD = resD.organs.some(o => (o.type === 'subject' || o.type === 'media') && o.currentValue.toLowerCase().includes('signal-decay noise'));
const hasConstraintD = resD.organs.some(o => o.type === 'constraint' && o.currentValue.toLowerCase().includes('no vocals'));

console.log('Assert Audio Subject (pure signal-decay noise):', hasAudioSubjectD ? 'PASS' : 'FAIL');
console.log('Assert Constraint (no vocals, melody...):', hasConstraintD ? 'PASS' : 'FAIL');
if (!hasAudioSubjectD || !hasConstraintD) {
  throw new Error('Test D assertions failed');
}

// -------------------------------------------------------------
// TEST E: Organ Mutation Utilities & Structural Dismemberment Executor
// -------------------------------------------------------------
console.log('\n--- TEST E: Organ Mutation Utilities & Executor ---');
const dismembered = executeStructuralDismemberment(inputB);
console.log('Dismembered summary:', dismembered.summary);

const actionOrgan = dismembered.organs.find(o => o.type === 'action');
if (!actionOrgan) throw new Error('No action organ found');

console.log('Original action:', actionOrgan.currentValue);
const mutated = replaceOrganValue(dismembered, actionOrgan.id, 'dissolves into radio static', 'Testing mutation note');
const mutatedAction = mutated.organs.find(o => o.id === actionOrgan.id);
console.log('Mutated action:', mutatedAction?.currentValue);
console.log('Mutation history:', mutatedAction?.mutationHistory);
console.log('Reconstructed with mutation:', mutated.reconstructedText);

const diff = compareOrganValues(mutated);
console.log('Diff result:', diff.filter(d => d.changed));

// Verify freeze / unfreeze
const frozen = freezeOrgan(mutated, actionOrgan.id);
console.log('Frozen organ mutationAllowed:', frozen.organs.find(o => o.id === actionOrgan.id)?.mutationAllowed === false ? 'PASS' : 'FAIL');

// -------------------------------------------------------------
// TEST F: Soft LLM Fallback (Never throws, falls back gracefully)
// -------------------------------------------------------------
console.log('\n--- TEST F: LLM Decomposition Graceful Fallback ---');
const { decomposeConcept } = await import('../lib/decompositionBackend');
const fallbackRes = await decomposeConcept('A giant stone head suspended above a desert at twilight', { useLLM: true });
console.log('Fallback Organs:', fallbackRes.organs.map(o => `[${o.type}]: "${o.currentValue}"`).join(' | '));
console.log('Fallback Reconstructed:', fallbackRes.reconstructedText);
if (!fallbackRes || !fallbackRes.organs || fallbackRes.organs.length === 0) {
  throw new Error('Test F fallback failed');
}
console.log('Assert Fallback: PASS');

console.log('\n=== ALL TESTS PASSED CLEANLY ===');
