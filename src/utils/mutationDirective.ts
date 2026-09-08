import {
  DecomposedConcept,
  LatentAttractor,
  MutationOperator,
  MutationRecipe,
  TargetEngine,
} from '../types';
import { getMutationOperator } from '../data/mutationOperators';
import { getAttractor } from '../data/latentFauna';
import { getCreativePressure } from '../data/creativePressures';

/**
 * Returns specific operational execution instructions for a mutation operator
 * as specified in the DAVID Job 5 mutation architecture.
 */
export function getOperatorExecutionGuidance(operatorId: string): string {
  switch (operatorId) {
    case 'structural_dismemberment':
      return 'Dismember the concept into distinct semantic organs (subject, action, environment, governing rules). Mutate the non-anchored organs while keeping the anchored identity core intact.';

    case 'semantic_neighbor_walk':
      return 'Traverse a short semantic trajectory across related conceptual neighborhoods (e.g. skin -> membrane -> interface -> phase boundary) before reconstructing. Let this trajectory influence the resulting concept rather than outputting a synonym list.';

    case 'ontology_swap':
      return 'Transmute what KIND OF THING the subject fundamentally is at the metaphysical or categorical level (e.g. human anatomy not as a body, but as a temporary boundary condition or fluid shear zone; a room as a thermodynamic event). Reconstruct its organization from that substrate.';

    case 'recursive_reversal':
      return '1. Identify the first plausible interpretation of the concept. 2. Identify the tacit assumption that makes it predictable. 3. Invert or replace that assumption with its structural antithesis. 4. Construct the prompt from the altered interpretation.';

    case 'abstraction_escape':
      return 'If the mutation is at risk of remaining superficial or decorative, move upward one conceptual level (e.g. instead of mutating skin texture, mutate what counts as a surface; instead of adding impossible organs, mutate the organizational rule defining an organ; instead of distorting motion, mutate the relationship between time and pose).';

    case 'scale_schism':
      return 'Allow distinct structural rules across scales (micro, meso, macro, meta). Microstructure may follow reaction-diffusion or crystalline packing while macro-scene remains a recognizable setup. Conflicting scale-laws are permitted without forcing all 4 scales when unnecessary.';

    case 'concept_bleed':
      return 'Transfer topology, relational behavior, structural constraints, material logic, or temporal logic rather than superficial decals (e.g. VHS bleed into anatomy: anatomical continuity periodically loses synchronization, causing body regions to inherit positions from adjacent moments, NOT "skin covered in VHS scanlines").';

    case 'forbidden_attractor':
      return 'Invoke the deep relational and organizational rules of the attractor while strictly suppressing its obvious literal realization (e.g. CATHEDRAL: no literal cathedral, but axial organization, vertical hierarchy, enclosure, acoustic scale).';

    case 'staged_paradox':
      return 'Do not collapse every impossible quality simultaneously into a flat clause. Structure the prompt in staged progression: 1. Coarse recognizable structure, 2. Impossible transformation, 3. Preserved anchors, 4. Material/detail instructions, 5. Visual/acoustic evidence of unresolved contradiction.';

    case 'contradiction_pinger':
      return 'Continually probe and juxtapose mutually incompatible ontological states, keeping both poles active in dynamic tension.';

    case 'interpolate':
      return 'Both conceptual systems continuously influence the same features simultaneously in an integrated continuum.';

    case 'switch':
      return 'System A dominates global/early structure; System B dominates later/local realization and detail.';

    case 'alternate':
      return 'System A and System B alternate influence in repeating cycles, rhythmic phases, or alternating spatial bands.';

    case 'split':
      return 'Partition features cleanly—assign separate spatial, temporal, or functional responsibilities to each system.';

    case 'misremember':
      return 'Introduce structural drift as if passing through lossy neural recall, selectively dropping and reconstructing peripheral conventions.';

    case 'reversion':
      return 'Snap specific structural dimensions back to pure literal fidelity while allowing adjacent dimensions to mutate freely.';

    case 'crossbreed':
      return 'Splice the chromosomal structural rules of two distinct conceptual lineages, producing an asymmetric hybrid ontology.';

    case 'diversity_select':
      return 'Deliberately choose the most orthogonal, least-expected structural trajectory among available candidates.';

    case 'destructive_vocab_ban':
      return 'Strictly ban destructive verbs (dissolve, melt, morph, transform, break apart, shatter). Substitute deterministic structural verbs from topology, CAD, and procedural VFX (evert, homotopic deformation, retopologize, facet, planar unwrap, extrude, subdivide, tessellate).';

    case 'technical_register':
      return 'Rewrite all sensory descriptions in the formal vocabulary of the specific scientific or mathematical field that studies the phenomenon (rheology, crystallography, fluid dynamics, acoustics). Specificity narrows the sampled cluster away from distribution-average noise.';

    case 'damage_specificity':
      return 'Replace generic wear/damage terms with named analog failure modes: head-switching noise, timebase corrector failure causing horizontal shearing, chroma subsampling error, CRT phosphor bloom, macro-blocking, halation, telecine jitter, or extreme Y/C separation error.';

    case 'contradiction_constraint':
      return 'Enforce an impossible constraint with zero hedging: locally normal but globally incompatible, volume expanding while surface area collapses, continuous folding into unsmoothable manifolds, infinite surface area with finite volume, or two bodies with different anatomy casting the same spectral shadow.';

    case 'progressive_wavefront':
      return 'A continuous geometric wavefront sweeps along a designated spatial axis; unreached areas remain in their base state; the trailing edge continuously reorganizes into the target geometry, providing temporal attention with a trackable edge.';

    case 'kinetic_anchor':
      return 'Lock the visual frame to a relentless continuous 360-degree orbit or unbroken high-speed tracking shot. The kinetic momentum forces temporal attention compute onto 3D parallax and consistent specular lighting, disincentivizing collapse to flat 2D noise.';

    case 'bridge_agent':
      return 'Insert a legitimate intermediate state of matter that is simultaneously organic and mathematical: nematic liquid crystal phase changes, continuous Miura fold tessellation propagating across silhouettes, or Voronoi trabecular scaffolds opening along logarithmic spirals.';

    case 'substrate_shift':
      return 'Replace the default substance with an uncomfortable, physically specific material: dense expanding polyurethane foam, shivering hyper-glossy molded silicone, oxidized bismuth and dripping neon thermal paste, interwoven fiber-optic cables that leak light, or magnetized ferrofluid.';

    case 'format_contamination':
      return 'Wrap the subject in a mundane period broadcast format: lost educational television demonstration, 1980s aerobics instruction tape, late-night public-access broadcast, 1970s science demonstration film, corporate training tape, or telecined 16mm print.';

    case 'semantic_distance_walk':
      return 'Traverse 3 to 4 associative conceptual hops away from the primary subject before selecting modifiers or attributes. Strictly forbid first-order hop-1 neighbors; select properties that connect logically only across multiple intermediate associative leaps.';

    case 'syntax_injection':
      return 'Interleave rigid non-linguistic syntax carrying concept values (JSON hierarchies, regular expression brackets, PGP armored blocks, hexadecimal memory dumps, FASTA nucleotide sequences, kernel panics, CSS rulesets, MIDI hex, or SQL queries). Syntax supplies pacing; content supplies meaning.';

    case 'lens_shift':
      return 'Select an analytical lens maximally orthogonal to the default register: antimatter inversion, geological timescale where human history is a one-second blur, subatomic charge/spin ethics, panpsychic noise where every atom screams, dimensional upgrade, or null-routing garbage collection.';

    case 'auto_genesis':
      return 'Synthesize an entirely novel analytical lens when no standard framework is sufficiently orthogonal: invent its formal designation, state its axiomatic operating logic in one concise sentence, and execute the perspective shift through that newly forged lens.';

    case 'sensory_rewiring':
      return 'Force description through the wrong sensory channel: describe an algorithm by its tactile odor and viscous flavor; describe an emotion strictly through optical refraction indices and shear modulus.';

    case 'temporal_anchor':
      return 'Lock the representation to a specific historic year, technical epoch, or cosmological era (e.g. 1974 lab telecine, Silurian geological strata, or Planck epoch heat death), satisfying that timeframe’s authentic constraints as a spring-board for mutation.';

    case 'oblique_answer':
      return 'When the prompt requests a conventional subject, answer its negative shadow: depict what was displaced by its arrival, the residue left in its wake, or the structural perimeter of the hole it leaves behind.';

    case 'houdini_hijack':
      return 'Append procedural 3D VFX terminology to hijack the clean motion-graphics latent cluster: Houdini procedural surface deformation, Signed Distance Field (SDF) raymarching transition, continuous vertex displacement mapping, isosurface polygonization, marching cubes, and clean specular highlights.';

    case 'latent_bridge':
      return 'Never bridge disparate states in a single leap: generate Anchor A (initial state), a 50% Hybrid Node matching lighting and palette with tessellated geometry, and Anchor B (full target); interpolate through geometric unfolding.';

    case 'frequency_conflict':
      return 'Force mutually incompatible acoustic genres, instrumentation, and acoustic spaces into single bracketed cues: [Gregorian chant + 240BPM speedcore + underwater cavern reverb], [Baroque harpsichord + drill 808 distortion + anechoic chamber].';

    case 'instrument_displacement':
      return 'Assign standard musical rhythm and melodic roles to non-musical phenomena: percussion is rhythmic human throat-clearing and pleural fluid clicks; bassline is seismic fault tremor; lead melody is an erratically failing refrigerator compressor.';

    case 'structural_paradox_tag':
      return 'Inject impossible physical transformations inside section cue brackets: [Breakdown: singer vocal cords calcify into solid brass over 8 measures], [Solo: piano keys strike themselves backwards in time with negative decibels].';

    case 'sonification_of_absence':
      return 'Demand sonification of pure negative space: [the absence of a 1980s synthesizer], [localized drop in atmospheric pressure], anechoic chamber vacuum, absolute zero thermal noise, phase cancellation, or the exact frequency of offline physical spaces.';

    case 'psychoacoustic_phantom':
      return 'Instruct audio synthesis to produce perceptual-only auditory phenomena: Tartini third difference tone extraction, nonlinear phantom fundamental, Shepard scale infinite pitch descent, and simultaneous backward spectral masking.';

    case 'register_collision':
      return 'Pair a hyper-rigid pop song or choral arrangement structure with lyric texts that possess zero rhyme, zero metric feet, and no line breaks, compelling the neural vocoder to stretch syllables into microtonal glissandi and novel polyphony.';

    case 'zalgo_phoneme_forcing':
      return 'Apply controlled Unicode combining diacritics strictly to phonetic lyrics (never to style tags) to corrupt standard tokenizer pronunciation and force the acoustic engine into producing glottal clicks, unvoiced whispers, and alien diphthongs.';

    default:
      return 'Apply systemic ontological mutation to relational rules and structure rather than cosmetic decoration.';
  }
}

/**
 * Target engine translation instructions for the mutation pipeline
 */
export function getTargetEngineGuidance(target: TargetEngine | string): string {
  switch (target) {
    case 'suno':
      return `CRITICAL AUDIO-ONLY DIRECTIVE FOR SUNO:
- TRANSLATE ALL CONCEPTUAL AND ONTOLOGICAL MUTATIONS INTO TIMBRE, INSTRUMENTATION, RHYTHM, ACOUSTIC TOPOLOGY, SIGNAL DECAY, AND ARRANGEMENT.
- ABSOLUTELY NO visual camera jargon (no 35mm, wide lens, lighting, visual materials, cinematic shots).
- Translate scale schisms into acoustic micro-timbre collisions vs macro-reverb room decay.
- Translate ontology swaps into audio synthesis techniques, frequency collisions, impossible phase interactions, and vocoder processing.`;

    case 'grok':
      return `CRITICAL DIRECTIVE FOR GROK (IMAGE/VIDEO):
- EMPHASIZE MOTION, STATE TRANSITIONS, TEMPORAL CONTRADICTIONS, FRAME-TO-FRAME CONTAMINATION, PHYSICAL SIMULATION, AND CINEMATIC CAMERA VECTORS.
- Detail how the mutated structures shift, rotate, or deform across time.`;

    case 'openart':
    case 'midjourney_flux':
      return `CRITICAL DIRECTIVE FOR VISUAL RENDERING:
- EMPHASIZE VISIBLE SPATIAL CONSEQUENCES, MATERIAL BEHAVIOR, COMPOSITION, SUBJECT PRESERVATION, AND RENDERABLE VISUAL RELATIONSHIPS.
- Translate structural mutations into precise physical surfaces, lighting interactions, and topological boundaries.`;

    case 'llm_agent':
    case 'general':
    case 'void':
    default:
      return `CRITICAL DIRECTIVE FOR MACHINE REASONING:
- PRESERVE CONCEPTUAL ARCHITECTURE IN PRECISE LANGUAGE SUITABLE FOR DIRECT MACHINE EXECUTION.
- Balance execution fidelity with the requested ontological drift.`;
  }
}

/**
 * Builds a dense, machine-readable mutation directive for Gemini synthesis
 * adhering strictly to the pipeline order, "no decorative weirdness",
 * attractor ontological interpretation, and operator execution guidelines.
 */
export function formatMutationDirective(
  recipe: MutationRecipe,
  decomposed: DecomposedConcept,
  target: TargetEngine | string
): string {
  const sections: string[] = [];

  // 1. Pipeline Header & Core Principle
  sections.push(
    `[MUTATION ARCHITECTURE: SYSTEMIC RESTRUCTURING (DELUGE / SLOP / GUIDANCE GEOMETRY)]\n` +
      `CORE PRINCIPLE: NO DECORATIVE WEIRDNESS (ANTI-SLOP-SLOP MANDATE)\n` +
      `- Do NOT merely decorate a normal concept with fractals, tentacles, crystals, neon, glitches, psychedelic adjectives, or random impossible materials.\n` +
      `- REJECT WEAK MUTATION ADJECTIVES: Never use "surreal", "dreamlike", "psychedelic", "chaotic", "otherworldly", "glitchy", or "impossible" as substitutes for an actual mechanism.\n` +
      `- Every strange element MUST originate from coherent physical, conceptual, or geometric reorganization: mechanism, interaction, causality, geometry, material rheology, temporal behavior, or scale conflict.\n` +
      `- ATTRACTORS MUST GUIDE — NOT SWALLOW — THE SEED: Attractors are directional gravity fields, NOT replacement subjects. The original seed entity must remain recognizable through the mutation.\n` +
      `- OPERATOR BLENDING: Allow multiple mutation operators to interact in a causal chain (A causes B, B destabilizes C, C feeds back into A), rather than treating them as an independent checklist.\n` +
      `- Preserved anchors MUST remain recognizable.`
  );

  // 1b. Embodied mathematics doctrine: structural math, never math-themed decoration
  sections.push(
    `EMBODIED MATHEMATICS / SUBJECT-AS-MATH DOCTRINE:\n` +
      `This rule is mandatory whenever the user asks for a person, woman, face, body, portrait, reference subject, or @identity to BE mathematics, geometry, topology, a mathematical object, equation, field, attractor, fractal, manifold, tessellation, symmetry system, or scientific process.\n` +
      `- Interpret "X IS math" literally at the ontological/structural level. The math is not printed ON the subject; the subject is a visible consequence of the math.\n` +
      `- NEVER solve this request by placing equations, numerals, symbols, graphs, coordinate grids, glowing formula text, tattoos, diagrams, floating notation, or generic fractal wallpaper on otherwise normal skin. Those are decorative failure modes unless explicitly requested.\n` +
      `- Replace ordinary anatomy with the chosen mathematical rule while preserving identity anchors. Facial planes, eyelids, lips, cheek volume, jaw, nose, hair masses, limbs, folds, cavities, and silhouette must be GENERATED BY the structure: e.g. manifold curvature can become cheek/jaw topology; a Möbius condition can make one continuous facial surface pass through itself and return inverted; reaction-diffusion can determine pore/flesh boundaries; a Voronoi field can partition living tissue volumes; a strange attractor can determine repeated anatomical trajectories; a minimal surface can become the actual membrane connecting recognizable facial landmarks.\n` +
      `- Use mathematics as a GENERATIVE LAW, not an illustration topic. Ask: "If this mathematical system were the developmental physics that grew this person, what would the anatomy physically have to become?" Then describe that visible anatomy.\n` +
      `- For a reference face / @identity, preserve identity relationally rather than cosmetically: retain recognizable eye spacing, gaze, mouth relationship, nose placement, cranial silhouette, characteristic hair placement/color when requested, and other identity anchors, while allowing the tissue and geometry between those anchors to be radically reconstructed. Recognition must survive through transformed spatial relationships, not through untouched normal skin pasted over the mutation.\n` +
      `- The transformation may aggressively distort, split, fold, recurse, perforate, duplicate, invert, self-intersect, or reparameterize the face/body when the user asks for radical transformation. Do not protect conventional beauty or ordinary anatomy unless the prompt explicitly asks for restraint.\n` +
      `- Prefer PHYSICAL CONSEQUENCES over vocabulary: do not merely name "Klein bottle"; explain where the facial surface has no distinct inside/outside. Do not merely name "Mandelbrot"; make branching recursive anatomy repeat at successively smaller scales while still participating in the face. Do not merely name "Penrose tiling"; let local facial planes obey nonperiodic adjacency so no repeating patch can tile the anatomy conventionally.\n` +
      `- When several math/science systems are selected, assign each a JOB instead of dumping terms: one may govern global topology/silhouette, another mesoscopic tissue partition, another microtexture, another motion or temporal behavior, another lighting/optical evidence. Avoid incoherent keyword soup.\n` +
      `- For image/video targets, the final prompt must describe OBSERVABLE GEOMETRY AND MATERIAL CONSEQUENCES. The downstream image model does not need a lecture; it needs explicit instructions for what the transformed face/body physically looks like.\n` +
      `- Litmus test: if all mathematical words were removed from the final prompt, the visible transformation should STILL unmistakably imply an impossible mathematical organism. If the result would revert to "normal person with math decorations," the transformation failed.`
  );

  // 2. Preserved Anchors
  const preservedList: string[] = [];
  if (recipe.preservedAnchors && recipe.preservedAnchors.length > 0) {
    preservedList.push(...recipe.preservedAnchors);
  } else if (decomposed?.detectedAnchors && decomposed.detectedAnchors.length > 0) {
    preservedList.push(...decomposed.detectedAnchors);
  } else if (decomposed?.organs && decomposed.organs.length > 0) {
    const subjectOrgans = decomposed.organs.filter((o) => o.type === 'subject' || o.type === 'identity');
    if (subjectOrgans.length > 0) {
      preservedList.push(...subjectOrgans.map((o) => o.currentValue || o.originalValue));
    }
  }

  if (preservedList.length > 0) {
    const uniqueAnchors = Array.from(new Set(preservedList));
    sections.push(
      `PRESERVE (ANCHORS & INVARIANTS):\n` +
        uniqueAnchors.map((a) => `* ${a}`).join('\n') +
        `\n(Rule: These anchors are ground truth. The target engine viewer/listener must recognize the core entity through the mutation.)`
    );
  }

  // 3. Active Mutation Operators
  if (recipe.operators && recipe.operators.length > 0) {
    const operatorItems = recipe.operators.map((op, idx) => {
      const def = getMutationOperator(op.id);
      const name = def ? def.name.toUpperCase() : op.id.toUpperCase();
      const weightPct = Math.round((op.weight || 1) * 100);
      const guidance = getOperatorExecutionGuidance(op.id);
      return `${idx + 1}. ${name} (${weightPct}% weight) — ${guidance}`;
    });

    sections.push(`ACTIVE MUTATION OPERATORS:\n${operatorItems.join('\n')}`);
  }

  // 4. Latent Fauna / Attractors
  if (recipe.attractors && recipe.attractors.length > 0) {
    const attractorItems = recipe.attractors.map((at) => {
      const def = getAttractor(at.id);
      const name = def ? def.name.toUpperCase() : at.id.toUpperCase();
      const weightPct = Math.round((at.weight || 1) * 100);
      const directive = def ? def.directive : 'Interpret through this conceptual ontology.';
      const warning = def?.literalizationWarning
        ? `\n   [LITERALIZATION WARNING: ${def.literalizationWarning}]`
        : '';
      return `* ${name} (${weightPct}% weight) — Interpret the concept through the ${name} ontology:\n   ${directive}${warning}`;
    });

    sections.push(
      `ATTRACTORS (LATENT ONTOLOGIES — NOT FICTIONAL PERSONAS):\n` +
        attractorItems.join('\n') +
        `\n(Rule: Do NOT roleplay as the attractor. Interpret the source concept through this lens without adding cliché cosmetic decoration.)`
    );
  }

  // 5. Semantic Distance & Drift
  const semanticDist = (recipe.semanticDistance ?? 0.5).toFixed(2);
  const hops = recipe.semanticNeighborHops ?? 1;
  sections.push(
    `SEMANTIC DRIFT SPECIFICATION:\n` +
      `* Semantic Distance: ${semanticDist} (Scale: 0.0 = literal fidelity, 1.0 = maximum orthogonal drift)\n` +
      `* Neighbor Walk Hops: ${hops} conceptual associative transitions`
  );

  // 6. Content DNA (Math / Science / Slop seeds)
  if (recipe.contentDna && recipe.contentDna.length > 0) {
    sections.push(
      `CONTENT DNA (INTEGRATION AFTER STRUCTURE):\n` +
        recipe.contentDna.map((dna) => `* ${dna}`).join('\n') +
        `\n(Rule: Inject these terms AFTER the conceptual mutation is structured. Do NOT simply stuff keywords. Use them structurally or materially where they advance the conceptual mutation.)`
    );
  }

  // 7. Creative Pressures
  if (recipe.pressureIds && recipe.pressureIds.length > 0) {
    const pressureLines = recipe.pressureIds.map((pId) => {
      const p = getCreativePressure(pId);
      return `* ${p ? p.name.toUpperCase() : pId}: ${p ? p.directive : 'Standard optimization.'}`;
    });
    sections.push(`CREATIVE PRESSURES:\n${pressureLines.join('\n')}`);
  }

  // 8. Target Engine Translation Directives
  sections.push(`TARGET ENGINE TRANSLATION DIRECTIVE:\n${getTargetEngineGuidance(target)}`);

  return sections.join('\n\n');
}
