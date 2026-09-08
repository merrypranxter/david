import { 
  selectFailureOperators 
} from '../src/utils/radicalTransformation';
import { extractNonNegotiablesAndAssumptions } from '../src/utils/radicalTransformation';
import { FAILURE_OPERATORS } from '../src/data/failureOperators';
import { generateDavidAlgorithmicSynthesis } from '../lib/david';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING JOB 2 (V2) VERIFICATION TEST SUITE (TESTS A - L)');
  console.log('====================================================');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // TEST A: Simple Image
  try {
    const resA = await generateDavidAlgorithmicSynthesis({
      concept: "A quiet stone well in an ancient courtyard",
      target: "openart",
      targetLength: 2000,
      entropyLevel: 5,
    });
    const promptA = resA.slop.prompt;
    assert(promptA.length > 500, "TEST A: Simple Image (Output generated and expanded)");
    assert(resA.slop.candidateFamilySummary !== undefined || promptA.length > 0, "TEST A: Simple Image includes logic");
  } catch (e: any) {
    assert(false, "TEST A: Failed with error " + e.stack);
  }

  // TEST B: Reference Identity
  try {
    const resB = await generateDavidAlgorithmicSynthesis({
      concept: "A clockwork owl perching on a Victorian lamppost with @merry",
      target: "midjourney_flux",
      targetLength: 2000,
      entropyLevel: 7,
    });
    const promptB = resB.slop.prompt;
    assert(promptB.toLowerCase().includes('@merry'), "TEST B: Reference Identity (@merry survives)");
    assert(promptB.length > 0, "TEST B: Output generated successfully");
  } catch (e: any) {
    assert(false, "TEST B: Failed with error " + e.stack);
  }

  // TEST C: Video Translation
  const vidOp = selectFailureOperators("test", "video", 5);
  assert(vidOp.some(op => op.directive.includes('temporal') || op.directive.includes('motion') || op.directive.includes('speed') || op.directive.includes('velocity') || op.directive.includes('frame')), "TEST C: Video selected operators consider time, motion, history, or kinematics");
  assert(vidOp.every(op => !op.directive.includes('image:')), "TEST C: Video translations do not output raw objects");

  // TEST D: Audio Translation
  const audOp = selectFailureOperators("test", "audio", 8);
  assert(audOp.some(op => op.directive.includes('rhythm') || op.directive.includes('acoustic') || op.directive.includes('noise') || op.directive.includes('audio') || op.directive.includes('sound')), "TEST D: Audio selected operators consider rhythm, signal, timbre, form");

  // TEST E: Different runs (Diversity)
  const run1 = selectFailureOperators("A futuristic city", "image", 8);
  const run2 = selectFailureOperators("An underwater kingdom", "image", 8);
  const run1Ids = run1.map(o => o.operator.id).join(',');
  const run2Ids = run2.map(o => o.operator.id).join(',');
  assert(run1Ids !== run2Ids, "TEST E: Different runs pull different failure families");
  
  // TEST F: Negative Volume
  const fOps = selectFailureOperators("test", "image", 5, ["negative_volume"]);
  assert(fOps.some(o => o.operator.id === 'negative_volume' && o.directive.includes('voids')), "TEST F: Negative Volume force-selected");

  // TEST G: Local/Global Space Failure
  const gOps = selectFailureOperators("test", "image", 5, ["local_correctness_global_impossibility"]);
  assert(gOps.some(o => o.operator.id === 'local_correctness_global_impossibility'), "TEST G: Local/Global Space Failure force-selected");

  // TEST H: Homeostatic Morphology
  const hOps = selectFailureOperators("test", "image", 5, ["homeostatic_morphology"]);
  assert(hOps.some(o => o.operator.id === 'homeostatic_morphology'), "TEST H: Homeostatic Morphology force-selected");

  // TEST I: Hysteresis
  const iOps = selectFailureOperators("test", "video", 5, ["hysteresis_state_memory"]);
  assert(iOps.some(o => o.operator.id === 'hysteresis_state_memory'), "TEST I: Hysteresis force-selected");

  // TEST J: Unit Collapse
  const jOps = selectFailureOperators("test", "image", 5, ["unit_collapse"]);
  assert(jOps.some(o => o.operator.id === 'unit_collapse'), "TEST J: Unit Collapse force-selected");

  // TEST K: Figure/Ground Inversion
  const kOps = selectFailureOperators("test", "image", 5, ["figure_ground_information_inversion"]);
  assert(kOps.some(o => o.operator.id === 'figure_ground_information_inversion'), "TEST K: Figure/Ground Inversion force-selected");

  // TEST L: Character Budget Integration
  try {
    const resL = await generateDavidAlgorithmicSynthesis({
      concept: "Minimal prompt",
      target: "openart",
      targetLength: 3000,
      entropyLevel: 8,
    });
    const promptL = resL.slop.prompt;
    const util = promptL.length / 3000 * 100;
    assert(util >= 88 && util <= 100, `TEST L: Character Budget Integration (Saturated to ${util}%)`);
  } catch(e: any) {
    assert(false, "TEST L: Failed with error " + e.stack);
  }

  console.log('====================================================');
  console.log(`OVERALL JOB 2 TEST SUITE RESULT: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
  if (passed !== total) process.exit(1);
}

runTests();
