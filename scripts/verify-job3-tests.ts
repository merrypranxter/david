import { 
  selectFailureOperators,
  composeMutationGraph
} from '../src/utils/radicalTransformation';
import { generateDavidAlgorithmicSynthesis } from '../lib/david';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING JOB 3 VERIFICATION TEST SUITE (TESTS A - L)');
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

  // TEST A: Causal Chain
  const opsA = selectFailureOperators("test", "image", 7);
  const graphA = composeMutationGraph("test", opsA, "image", []);
  const textA = graphA.join(' ');
  assert(textA.includes('CAUSAL TRIGGER') && textA.includes('CASCADE & DEBT') && textA.includes('INVARIANT COMPENSATION'), "TEST A: Graph translates into Causal triggers, debts, and compensations");

  // TEST B: Invariant
  const graphB = composeMutationGraph("test invariant", opsA, "image", ["@merry"]);
  const textB = graphB.join(' ');
  assert(textB.includes('MUST preserve the following invariants:') && textB.includes('@merry'), "TEST B: Preserves custom anchors as invariants");

  // TEST C: Hysteresis
  const opsC = selectFailureOperators("test", "video", 5, ["hysteresis_state_memory"]);
  const graphC = composeMutationGraph("test", opsC, "video", []);
  assert(graphC.join(' ').includes('strict hysteresis'), "TEST C: Injects state memory constraints");

  // TEST D: Video Lag
  const opsD = selectFailureOperators("test", "video", 5, ["temporal_topology_debt"]);
  const graphD = composeMutationGraph("test", opsD, "video", []);
  assert(graphD.join(' ').includes('TEMPORAL LAG'), "TEST D: Injects temporal lag constraints");

  // TEST E: Future-State
  const opsE = selectFailureOperators("test", "video", 5, ["future_frame_anatomy"]);
  const graphE = composeMutationGraph("test", opsE, "video", []);
  assert(graphE.join(' ').includes('ANTICIPATORY DEPENDENCY'), "TEST E: Injects future-state anticipatory geometry constraints");

  // TEST F: Noncommutative
  const opsF = selectFailureOperators("test", "image", 5, ["noncommutative_history"]);
  const graphF = composeMutationGraph("test", opsF, "image", []);
  assert(graphF.join(' ').includes('PATH DEPENDENCY'), "TEST F: Injects noncommutative order constraints");

  // TEST G: Homeostasis
  const opsG = selectFailureOperators("test", "image", 5, ["homeostatic_morphology"]);
  const graphG = composeMutationGraph("test", opsG, "image", []);
  assert(graphG.join(' ').includes('HOMEOSTATIC FEEDBACK'), "TEST G: Injects homeostatic feedback loops");

  // TEST H: Audio Graph
  const opsH = selectFailureOperators("test audio", "audio", 7);
  const graphH = composeMutationGraph("test audio", opsH, "audio", []);
  const textH = graphH.join(' ');
  assert(textH.includes('spectral/rhythmic debt') || textH.includes('audio space'), "TEST H: Audio graph uses spectral/rhythmic concepts");

  // TEST I: Easy Escape
  assert(textA.includes('CRITICAL AVOIDANCE'), "TEST I: Easy-Solution blockers are aggregated at the end of the graph");

  // TEST J: Simplicity
  const opsLow = selectFailureOperators("test", "image", 2);
  const graphLow = composeMutationGraph("test", opsLow, "image", []);
  assert(graphLow.length < graphA.length, "TEST J: Low entropy generates a simpler graph than high entropy");

  // TEST K: Reference Identity E2E
  try {
    const resK = await generateDavidAlgorithmicSynthesis({
      concept: "@merry floating in a cybernetic cathedral",
      target: "midjourney_flux",
      targetLength: 2000,
      entropyLevel: 8,
    });
    const promptK = resK.slop.prompt;
    assert(promptK.includes('@merry') && promptK.includes('DEBT'), "TEST K: End-to-end prompt preserves reference while utilizing graph architecture");
  } catch (e: any) {
    assert(false, "TEST K: End-to-end failed: " + e.stack);
  }

  // TEST L: Job 1 Integration Length
  try {
    const resL = await generateDavidAlgorithmicSynthesis({
      concept: "Minimal prompt",
      target: "openart",
      targetLength: 3000,
      entropyLevel: 8,
    });
    const util = resL.slop.prompt.length / 3000 * 100;
    assert(util >= 88 && util <= 100, `TEST L: Character Budget properly saturated with graph text (Saturated to ${util.toFixed(1)}%)`);
  } catch(e: any) {
    assert(false, "TEST L: Failed with error " + e.stack);
  }

  console.log('====================================================');
  console.log(`OVERALL JOB 3 TEST SUITE RESULT: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
  if (passed !== total) process.exit(1);
}

runTests();
