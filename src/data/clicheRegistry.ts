/**
 * Editable Cliché Pattern Registry (Job 8)
 * Detects superficial AI-art and weirdness tropes when used decoratively
 * without genuine underlying structural/topological/ontological change.
 */

export interface ClichePattern {
  id: string;
  label: string;
  pattern: RegExp;
  basePenalty: number; // 0.05 to 0.25
  structuralExemptionOperators?: string[];
  structuralExemptionAttractors?: string[];
  description: string;
}

export const CLICHE_PATTERNS: readonly ClichePattern[] = [
  {
    id: 'generic_cosmic',
    label: 'Generic Cosmic / Nebula Background',
    pattern: /\b(?:cosmic nebula|galaxy backdrop|deep space background|starry void|celestial cosmos)\b/i,
    basePenalty: 0.12,
    structuralExemptionAttractors: ['void', 'spectral'],
    description: 'Generic cosmic or space backdrop used as easy surreal wallpaper.',
  },
  {
    id: 'generic_ethereal',
    label: 'Repeated "Ethereal" Adjective',
    pattern: /\b(?:ethereal glow|ethereal aura|ethereally floating|ethereal tendrils)\b/i,
    basePenalty: 0.1,
    structuralExemptionAttractors: ['ghost', 'spectral'],
    description: 'Lazy ethereal descriptors that decorate without changing causality or ontology.',
  },
  {
    id: 'surreal_dreamscape',
    label: 'Vague "Surreal Dreamscape"',
    pattern: /\b(?:surreal dreamscape|surreal landscape|dreamlike hallucination|trippy dream)\b/i,
    basePenalty: 0.15,
    structuralExemptionOperators: ['ontology_swap', 'staged_paradox'],
    description: 'Vague dreamscape phrases that substitute for explicit topological rules.',
  },
  {
    id: 'random_tentacles',
    label: 'Random Decorative Tentacles',
    pattern: /\b(?:writhing tentacles|tentacles sprouting|glowing tentacles|tentacle mass)\b/i,
    basePenalty: 0.14,
    structuralExemptionAttractors: ['leviathan', 'mycorrhizal', 'swarm'],
    structuralExemptionOperators: ['concept_bleed', 'scale_schism'],
    description: 'Tentacles appended to normal subjects without morphogenetic logic.',
  },
  {
    id: 'arbitrary_eyes',
    label: 'Arbitrary Eye Proliferation',
    pattern: /\b(?:eyes everywhere|hundreds of blinking eyes|eyeballs covering|floating eyes)\b/i,
    basePenalty: 0.12,
    structuralExemptionAttractors: ['egregore', 'oracle', 'aberration'],
    description: 'Gratuitous eyes sprinkled over surfaces as cheap horror signifier.',
  },
  {
    id: 'fractal_overlay',
    label: 'Generic Fractal Overlay',
    pattern: /\b(?:covered in fractals|fractal patterns|mandelbrot skin|fractal geometry)\b/i,
    basePenalty: 0.12,
    structuralExemptionOperators: ['recursive_reversal', 'staged_paradox'],
    structuralExemptionAttractors: ['crystalline'],
    description: 'Fractals slapped on as a skin rather than a recursive boundary rule.',
  },
  {
    id: 'neon_cyberpunk',
    label: 'Random Neon Cyberpunk',
    pattern: /\b(?:neon glowing lines|cyberpunk city|synthwave neon|glowing neon cyan and pink)\b/i,
    basePenalty: 0.14,
    structuralExemptionAttractors: ['simulacrum'],
    description: 'Default neon/cyberpunk aesthetics used as knee-jerk weirdness.',
  },
  {
    id: 'generic_eldritch',
    label: 'Generic Eldritch Posturing',
    pattern: /\b(?:eldritch horror|lovecraftian monstrosity|unnamable horror|eldritch god)\b/i,
    basePenalty: 0.14,
    structuralExemptionAttractors: ['aberration', 'leviathan'],
    description: 'Vague eldritch labels that state horror instead of describing impossible conditions.',
  },
  {
    id: 'quantum_buzzword',
    label: 'Asemantic "Quantum" Stuffing',
    pattern: /\b(?:quantum realm|quantum vibrations|quantum energy|quantum particles)\b/i,
    basePenalty: 0.1,
    structuralExemptionOperators: ['split', 'scale_schism'],
    description: 'Using "quantum" purely as a mystical buzzword without superposition or entanglement logic.',
  },
  {
    id: 'hyper_modifier_stacking',
    label: 'Hyper/Ultra/Psycho Stacking',
    pattern: /\b(?:hyper-detailed|ultra-realistic|insanely detailed|hyper-dimensional|psycho-delic)\b/i,
    basePenalty: 0.12,
    description: 'Inflated prompt-craft modifiers that crowd out structural instructions.',
  },
  {
    id: 'crystal_covered',
    label: 'Generic Crystal Encrustation',
    pattern: /\b(?:covered in crystals|sprouting crystals|crystal growths all over)\b/i,
    basePenalty: 0.1,
    structuralExemptionAttractors: ['crystalline'],
    description: 'Crystals pasted on an otherwise ordinary object.',
  },
];

/**
 * Calculates cliché penalty for a candidate prompt, contextualized by active operators and attractors.
 * If a trope is structurally justified by an active operator or attractor, its penalty is forgiven or mitigated.
 */
export function evaluateClicheDensity(
  prompt: string,
  activeOperatorIds: string[] = [],
  activeAttractorIds: string[] = []
): { penalty: number; detectedCliches: string[] } {
  if (!prompt || typeof prompt !== 'string') {
    return { penalty: 0, detectedCliches: [] };
  }

  let totalPenalty = 0;
  const detected: string[] = [];

  for (const pattern of CLICHE_PATTERNS) {
    if (pattern.pattern.test(prompt)) {
      // Check if structurally exempt
      const isOperatorExempt = pattern.structuralExemptionOperators?.some((op) =>
        activeOperatorIds.includes(op)
      );
      const isAttractorExempt = pattern.structuralExemptionAttractors?.some((at) =>
        activeAttractorIds.includes(at)
      );

      if (isOperatorExempt || isAttractorExempt) {
        // Justified by structural mutation: only a negligible trace penalty
        totalPenalty += pattern.basePenalty * 0.2;
      } else {
        totalPenalty += pattern.basePenalty;
        detected.push(pattern.label);
      }
    }
  }

  return {
    penalty: Math.min(0.95, Math.max(0, totalPenalty)),
    detectedCliches: detected,
  };
}
