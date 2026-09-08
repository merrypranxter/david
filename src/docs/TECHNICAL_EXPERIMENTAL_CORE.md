# DAVID — Technical Experimental Core (Job 1)

## Overview

The Technical Experimental Core provides a unified, capability-aware architecture for studying and exploiting technical failure surfaces in generative systems (tokenization, serialization, binding failure, context budget, reference conditioning, guidance geometry, denoising trajectories, latent/codec hysteresis, and white-box instrumentation).

The central design tenet of this system is:

$$\text{Creative Utility} \ne \text{Mechanism Confidence}$$

A technique may produce extraordinary, aesthetically or structurally useful mutations (e.g. `creativeUtility: 0.95`) while the causal explanation for why it happened remains completely unverified or speculative (e.g. `mechanismConfidence: 0.20`). DAVID preserves useful weirdness without turning folklore into fake science.

---

## 1. Execution Tiers (Tier A vs. Tier B)

DAVID explicitly defines two distinct execution tiers:

### TIER A — Observable / Black-Box
- **Scope**: Commercial API models and closed services (Midjourney, Suno, OpenArt, Grok, etc.).
- **Operations**: Prompt/string manipulation, Unicode formatting, lexical ordering, repetition, positive/negative conditioning, references, image-to-image, seed iteration, exposed provider parameters, and output loops.
- **Rule**: DAVID **never** claims or simulates tensor-level, tokenizer, or internal attention access in this tier.

### TIER B — Instrumented / White-Box
- **Scope**: Open-source, local, or sufficiently exposed backend pipelines (Diffusers, PyTorch, local LLMs).
- **Operations**: Token ID inspection, embedding vector arithmetic, separate conditioning branches, timestep intervention, CFG vector manipulation, K/V projection analysis, attention map logging, PyTorch hooks, RoPE frequency tuning, and VAE/codec manipulation.
- **Rule**: White-box operators verify access via capability flags. If white-box access is unavailable on the target backend, the system degrades cleanly or reports `UNSUPPORTED`. It **never** fakes white-box instrumentation through prompt prose.

---

## 2. Experimental Controls & Falsification

Every technical operator defines formal experimental controls in `controls`:
- `variableChanged`: The specific parameter or token sequence being manipulated.
- `heldConstant`: Baseline seed, base prompt, guidance, temperature, etc.
- `hypothesisTested`: The core causal hypothesis being evaluated.
- `weakeningCondition`: An empirical outcome that would reduce confidence in the hypothesis.
- `falsificationCondition`: An empirical outcome that would outright falsify the proposed mechanism.
- `applicableControls`: A list of valid control roles (`baseline`, `experimental`, `negative_control`, `ablation`, `dose_sweep`, etc.).

---

## 3. Structural Separation: Observation vs. Interpretation

In every run record (`ExperimentRunRecord`), empirical reality is stored strictly separate from speculative explanation:

```typescript
{
  // WHAT HAPPENED — Strictly empirical, descriptive facts
  observation: "Modifier 'crimson' bound to background curtains in 8/10 runs instead of the subject car.",

  // WHAT WE THINK CAUSED IT — Proposed mechanistic hypothesis
  interpretation: "Remote attribute binding cleavage caused by quadratic attention distance falloff.",

  // Independent scores
  scores: {
    creativeUtility: 0.88,        // High artistic/structural value
    mechanismConfidence: 0.35,   // Causal mechanism remains unproven
    repeatability: 0.80,
    modelDependence: null,        // Unknown/unmeasured until cross-tested
    failureToIgnoreRate: 0.90
  }
}
```

Never store only `result = "attention starvation"`, because that conflates an observation with an unverified causal hypothesis.

---

## 4. Capability Matrix & Tier Resolution

The resolver `resolveExecutionTier(operator, backendCapabilities)` audits the target model's actual capabilities against the operator's `requiredCapabilities`:
- If all required capabilities exist: `SUPPORTED`.
- If an operator requires white-box access (e.g. `TOKEN_ID_ACCESS`) on a black-box API:
  - If a `degradationPath` or `HYBRID` tier exists: `PARTIALLY_SUPPORTED` with `resolvedTier: 'OBSERVABLE'`.
  - Otherwise: `UNSUPPORTED`.

---

## 5. Experiment Families & Logging

Experiments are organized into families (`ExperimentFamily`) representing a unified test session:
1. `createExperimentFamily({ operator, modelId, ... })` initializes the session with the operator's hypothesis and falsification criteria.
2. `logExperimentRun({ familyId, role, observation, interpretation, ... })` logs individual runs (baseline, experimental, controls, ablations, dose sweeps).
3. `calculateFamilySummary(family)` automatically aggregates scores and computes verdicts (`PROPOSED`, `OBSERVED`, `EMPIRICALLY_USEFUL`, `MECHANISM_UNCERTAIN`, `MECHANISM_SUPPORTED`, `FALSIFIED`) without synthesizing fake numbers.

---

## 6. How Future Jobs (Jobs 2–10) Should Add Operators

When implementing future technical operators:
1. Define the operator conforming to `TechnicalOperator` in `src/types/technicalCore.ts` (or your job's operator data file).
2. Set `technicalLayer` (`TOKENIZATION`, `SERIALIZATION`, `BINDING`, `GUIDANCE`, etc.).
3. Declare `executionTier` (`OBSERVABLE`, `INSTRUMENTED`, or `HYBRID`).
4. Detail the `mechanismHypothesis` and initial `hypothesisRevisions`.
5. Specify `expectedFailureSurfaces` and `requiredCapabilities`.
6. Define explicit `controls` including `weakeningCondition` and `falsificationCondition`.
7. Register via `registerTechnicalOperator(op)`.
8. Do not hardcode model-name checks (e.g. `if (model === 'flux')`); always use `backend.capabilities` or `resolveExecutionTier`.
