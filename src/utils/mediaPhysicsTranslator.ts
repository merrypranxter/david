import { MediaType, MediaProfile, AdaptedOperator, ModelOrganismProfile } from '../types';
import { MEDIA_PROFILES } from '../data/mediaProfiles';

export class MediaPhysicsTranslator {
  static getProfile(medium: MediaType): MediaProfile {
    return MEDIA_PROFILES[medium] || MEDIA_PROFILES.image;
  }

  static translateGraph(
    operators: AdaptedOperator[],
    medium: MediaType,
    anchors: string[],
    conceptSeed: number,
    modelProfile?: ModelOrganismProfile
  ): string[] {
    if (!operators || operators.length === 0) return [];
    
    const profile = this.getProfile(medium);
    const narrative: string[] = [];
    
    const vars = profile.preferredVariables;
    const primaryVar = vars[conceptSeed % vars.length];
    const secondaryVar = vars[(conceptSeed + 1) % vars.length];
    
    // Model Organism Context Header
    if (modelProfile) {
      narrative.push(
        `[MODEL ORGANISM: ${modelProfile.technicalFacts.modelName.toUpperCase()} (${modelProfile.technicalFacts.version})]`
      );
      narrative.push(
        `Organism Fingerprint: [Ref Grip: ${modelProfile.fingerprint.referenceGrip.toUpperCase()} | Literalness: ${modelProfile.fingerprint.promptLiteralness.toUpperCase()} | Contradiction: ${modelProfile.fingerprint.contradictionTolerance.toUpperCase()} | Tech Lang: ${modelProfile.fingerprint.technicalLanguageTolerance.toUpperCase()}] (Confidence: ${modelProfile.confidence.toUpperCase()})`
      );
    }

    narrative.push(`[MEDIA PHYSICS: ${profile.name.toUpperCase()}]`);
    narrative.push(`Primary structural dimensions: ${profile.primaryDimensions.join(', ')}`);
    narrative.push(`[CRITICAL AVOIDANCE] Do not resolve abstract mechanics using: ${profile.antiPatterns.join(', ')}.`);
    
    // Model-Specific Easy-Out Blockers
    if (modelProfile?.easyOuts && modelProfile.easyOuts.length > 0) {
      const easyOutList = modelProfile.easyOuts.join(', ');
      narrative.push(`[MODEL-SPECIFIC EASY-OUT BLOCKER] The organism frequently falls into lazy failure modes: [${easyOutList}]. You are strictly forbidden from defaulting to these resolutions.`);

      if (modelProfile.easyOuts.includes('simple_melting')) {
        narrative.push(`[ANTI-MELTING MANDATE] Do NOT resolve material conflicts via liquid dripping or melting wax. Maintain sharp geometric cleavage and thermodynamic shear fractures.`);
      }
      if (modelProfile.easyOuts.includes('unrequested_symmetry')) {
        narrative.push(`[ANTI-SYMMETRY MANDATE] Strictly prohibit bilateral or radial symmetry; enforce anisotropic mass asymmetry and unbalanced geometric tension.`);
      }
      if (modelProfile.easyOuts.includes('visible_equations') || modelProfile.easyOuts.includes('schematic_diagrams')) {
        narrative.push(`[ANTI-EQUATION MANDATE] Do NOT draw literal mathematical equations, floating glyphs, chalk numbers, wireframe lines, or schematic labels on screen.`);
      }
    }

    // Reference Grip Adaptation (Reinforce Job 4 independent anchor protection)
    if (modelProfile) {
      if (modelProfile.fingerprint.referenceGrip === 'low') {
        narrative.push(
          `[IDENTITY ANCHOR FORTIFICATION] Weak reference grip detected in this organism. Hard anchors [${anchors.join(', ')}] must be reinforced with absolute entity fidelity. Confine topological destruction and material substitutions strictly to peripheral space, surrounding coordinates, or secondary appendages.`
        );
      } else if (modelProfile.fingerprint.referenceGrip === 'high') {
        narrative.push(
          `[HIGH REFERENCE RESILIENCE] High reference grip verified. Subject retains identity strongly; the system is authorized to apply radical topological and material phase shifts directly to the subject form.`
        );
      }
    }

    // Prompt Literalness Adaptation
    if (modelProfile?.fingerprint.promptLiteralness === 'high') {
      narrative.push(
        `[BEHAVIORAL GEOMETRY TRANSLATION] High prompt literalness detected. Translate all mathematical topology and differential geometry into concrete, observable material actions (e.g. continuous surface hole creation, non-intersecting skin loops, tactile boundary fractures) rather than abstract formulas or scientific diagrams.`
      );
    }

    // Technical Language Tolerance Adaptation
    if (modelProfile?.fingerprint.technicalLanguageTolerance === 'low') {
      narrative.push(
        `[TECHNICAL LANGUAGE EXPANSION] Low technical vocabulary tolerance. Replace scientific nomenclature with direct physical sequences: explain that the sequence of physical actions leaves permanent structural scars, where operation order irreversibly determines the resulting material state.`
      );
    }

    // Temporal Grip Adaptation (for Video)
    if (medium === 'video' && modelProfile) {
      if (modelProfile.fingerprint.temporalGrip === 'weak') {
        narrative.push(
          `[TEMPORAL STABILIZATION] The organism exhibits weak temporal persistence across frame transitions. Explicitly anchor subject kinetic momentum across occlusions, preventing spontaneous frame-to-frame disintegration.`
        );
      } else if (modelProfile.fingerprint.temporalGrip === 'strong') {
        narrative.push(
          `[AGGRESSIVE TEMPORAL DEBT] High temporal persistence detected. Exploit temporal inertia: enforce deep hysteresis, delayed compensation 5 frames later, and topological mismatch upon reappearance from occlusion.`
        );
      }
    }

    // Long Prompt Adherence Adaptation
    if (modelProfile?.fingerprint.longPromptBehavior === 'beginning_weighted' || modelProfile?.fingerprint.longPromptBehavior === 'dilution') {
      narrative.push(
        `[PRIORITY HIERARCHY DIRECTIVE] This organism suffers from instruction dilution toward prompt ends. Invariant anchors and core mechanisms must dominate the initial paragraphs.`
      );
    }

    // Core Graph Narrative
    if (operators.length === 1) {
       const op = operators[0].operator;
       const trans = op.mediaTranslations ? op.mediaTranslations[medium] : op.mechanism;
       narrative.push(`[CAUSAL TRIGGER] Governed by changes in ${primaryVar}, the system enforces ${op.name}. ${trans}`);
    } else {
       const op1 = operators[0].operator;
       const op2 = operators[1].operator;
       const trans1 = op1.mediaTranslations ? op1.mediaTranslations[medium] : op1.mechanism;
       const trans2 = op2.mediaTranslations ? op2.mediaTranslations[medium] : op2.mechanism;
       
       narrative.push(`[CAUSAL TRIGGER] The primary generative variable is ${primaryVar}. When it crosses a critical threshold, it triggers ${op1.name}: ${trans1}`);
       
       let debtType = medium === 'audio' ? 'spectral/rhythmic debt' : medium === 'video' ? 'temporal lag debt' : 'topological/spatial debt';
       narrative.push(`[CASCADE & DEBT] This transformation is not isolated. It immediately forces a cascading failure via ${op2.name}: ${trans2} This creates a severe structural ${debtType}.`);
       
       let compensation = '';
       if (operators.length > 2) {
           const op3 = operators[2].operator;
           compensation = `enforcing ${op3.name} (${op3.mediaTranslations ? op3.mediaTranslations[medium] : op3.mechanism})`;
       } else {
           if (medium === 'image') compensation = 'spatial compensation across body regions, scales, or positive/negative space';
           if (medium === 'video') compensation = 'delayed compensation on re-entry, after occlusion, or 3 frames later';
           if (medium === 'audio') compensation = 'rhythmic compensation or spectral re-balancing later in the formal structure';
       }
       
       if (anchors.length > 0) {
           if (medium === 'video') {
               narrative.push(`[INVARIANT COMPENSATION] Preserve IDENTITY ANCHORS ([${anchors.join(', ')}]) across frames. WHO remains the same, but WHAT (topology/material) destabilizes. The system pays the generated debt by ${compensation}.`);
           } else if (medium === 'audio') {
               narrative.push(`[INVARIANT COMPENSATION] The system MUST preserve source anchors: [${anchors.join(', ')}]. To pay the generated debt, the system compensates by ${compensation}.`);
           } else {
               narrative.push(`[INVARIANT COMPENSATION] The system MUST preserve the following invariants: [${anchors.join(', ')}]. To pay the generated debt without violating these anchors, the system compensates by ${compensation}.`);
           }
       }
       
       for (let i = 3; i < operators.length; i++) {
           const opX = operators[i].operator;
           const transX = opX.mediaTranslations ? opX.mediaTranslations[medium] : opX.mechanism;
           narrative.push(`[COMPOUND CONSTRAINT] Simultaneously, ${opX.name} is active: ${transX}`);
       }
    }
    
    // Medium-specific translation rules and cross-media physics
    operators.forEach(op => {
        const o = op.operator;
        
        if (o.id === 'hysteresis_state_memory') {
            if (medium === 'image') narrative.push(`[STATIC HISTORY] ${profile.translationRules['TEMPORAL_MECHANISM'] || ''}`);
            if (medium === 'video') narrative.push(`[STATE MEMORY] ${profile.translationRules['USE_LAG'] || ''}`);
            if (medium === 'audio') narrative.push(`[PROCESSING MEMORY] ${profile.translationRules['HYSTERESIS'] || ''}`);
        }
        
        if (o.id === 'future_frame_anatomy') {
            if (medium === 'image') narrative.push(`[ANTICIPATORY STRUCTURE] ${profile.translationRules['FUTURE_DEPENDENCY'] || ''}`);
            if (medium === 'video') narrative.push(`[MAKE TIME CAUSAL] ${profile.translationRules['MAKE_TIME_CAUSAL'] || ''}`);
            if (medium === 'audio') narrative.push(`[ANTICIPATORY FORM] ${profile.translationRules['FUTURE_DEPENDENCY'] || ''}`);
        }
        
        if (o.id === 'noncommutative_history') {
             if (modelProfile?.fingerprint.technicalLanguageTolerance === 'low') {
               narrative.push(`[PATH DEPENDENCY: EXPANDED] Physical operations cannot commute: deformation order permanently alters boundary morphology and stress fracture lines.`);
             } else {
               narrative.push(`[PATH DEPENDENCY] ${profile.translationRules['NONCOMMUTATIVE_HISTORY'] || ''}`);
             }
        }
        
        if (o.id === 'homeostatic_morphology') {
            if (medium === 'image') narrative.push(`[EQUILIBRIUM FORM] ${profile.translationRules['FEEDBACK'] || ''}`);
            if (medium === 'audio') narrative.push(`[CROSS-DOMAIN MUSICAL GOVERNANCE] ${profile.translationRules['WRONG_SIMULATOR'] || ''}`);
        }
        
        if (o.id === 'negative_volume') {
             narrative.push(`[NEGATIVE VOLUME] ${profile.translationRules['NEGATIVE_VOLUME'] || ''}`);
        }
        
        if (medium === 'video' && o.id === 'temporal_topology_debt') {
             narrative.push(`[FRAME LOCAL / SEQUENCE GLOBAL] ${profile.translationRules['FRAME_LOCAL_GLOBAL_CONFLICT'] || ''}`);
        }
    });

    if (medium === 'video') {
       narrative.push(`[OCCLUSION RULE] ${profile.translationRules['USE_OCCLUSION'] || 'When subject leaves view, do not assume reappearance preserves topology or scale.'}`);
    } else if (medium === 'audio') {
       narrative.push(`[CROSS-MEDIA TRANSDUCER] Map visual/conceptual complexity to vocal/instrumental timbre while preserving rhythmic cadence explicitly (Input Variable -> Transducer -> Output Variable).`);
    } else if (medium === 'image') {
       narrative.push(`[IMAGE PHYSICS] Translate temporal mechanisms into visible evidence rather than pretending a single image literally contains frame-by-frame motion.`);
    }

    const allBlockers = Array.from(new Set(operators.flatMap(o => o.operator.easySolutionsToBlock)));
    if (allBlockers.length > 0) {
        narrative.push(`[EASY-OUT BLOCKERS] Do not resolve these contradictions via: ${allBlockers.join(', ')}.`);
    }
    
    return narrative.filter(n => n.trim().length > 0);
  }
}
