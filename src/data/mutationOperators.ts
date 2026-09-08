import { MutationCategory, MutationOperator, MutationRecipe } from '../types';

/**
 * Foundational Mutation Operator Registry (Job 1)
 * 18 initial data-driven operators across structural, semantic, ontological,
 * recursive, contradiction, blending, lineage, and selection categories.
 */
export const MUTATION_OPERATORS: readonly MutationOperator[] = [
  {
    id: 'structural_dismemberment',
    name: 'Structural Dismemberment',
    category: 'structural',
    description:
      'Break a source concept into semantic organs (subject, action, transformation, material, environment, relationships, constraints, governing visual rule) to allow discrete organ mutation.',
    directive:
      'Decompose the concept into its constitutive semantic organs: [SUBJECT], [ACTION], [TRANSFORMATION], [MATERIAL], [ENVIRONMENT], [RELATIONSHIPS], [CONSTRAINTS], [GOVERNING_RULE]. Isolate each organ so that downstream stages can mutate selected organs while anchoring others.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['scale_schism', 'split', 'staged_paradox'],
    tags: ['decomposition', 'structural', 'organs'],
  },
  {
    id: 'semantic_neighbor_walk',
    name: 'Semantic Neighbor Walk',
    category: 'semantic',
    description:
      'Traverse associative meaning trajectories across continuous conceptual hops rather than mere lexical synonym replacement.',
    directive:
      'Trace an associative conceptual trajectory across related semantic neighborhoods (e.g. skin -> membrane -> boundary -> interface -> phase boundary -> condition separating incompatible states). Shift the core subject by N conceptual hops.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'concept_bleed'],
    tags: ['associative', 'semantic-drift', 'hop-chain'],
  },
  {
    id: 'ontology_swap',
    name: 'Ontology Swap',
    category: 'ontological',
    description:
      'Transmute what KIND OF THING a concept fundamentally is at the metaphysical or categorical level, altering foundational organization rather than superficial aesthetics.',
    directive:
      'Alter the fundamental ontological category of the subject (e.g. reinterpreting human anatomy not as a body, but as "a temporary boundary condition that happens to resolve into human anatomy"). Reconstruct its essence from the ground up.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['abstraction_escape', 'recursive_reversal'],
    tags: ['ontology', 'metaphysical', 'category-shift'],
  },
  {
    id: 'recursive_reversal',
    name: 'Recursive Reversal',
    category: 'recursive',
    description:
      'Isolate the tacit axiom or assumption that makes an interpretation predictable, and invert, negate, or substitute that foundational premise.',
    directive:
      'Identify the core premise or unstated convention that makes the concept predictable or stable, then invert or replace that axiom with its systemic antithesis.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['contradiction_pinger', 'staged_paradox'],
    tags: ['axiom-inversion', 'recursive', 'antithesis'],
  },
  {
    id: 'contradiction_pinger',
    name: 'Contradiction Pinger',
    category: 'contradiction',
    description:
      'Detect emergent paradoxes or inconsistencies in the semantic interpretation and elevate them into governing operational laws rather than resolving them.',
    directive:
      'Scan the emergent conceptual structure for nascent tensions or logical incompatibilities; elevate the discovered contradiction into a primary visual and systemic rule rather than repairing it.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['staged_paradox', 'scale_schism'],
    tags: ['paradox', 'tension', 'governing-law'],
  },
  {
    id: 'abstraction_escape',
    name: 'Abstraction Escape',
    category: 'ontological',
    description:
      'Ascend one metalevel upward when iterations stagnate into adjective inflation; mutate relationships, causality, topology, or interpretation rules instead of the object itself.',
    directive:
      'Cease decorating or modifying the concrete object; shift mutation up one abstraction tier to manipulate the governing topology, relational causality, or the generative interpretive rule itself.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'scale_schism'],
    tags: ['meta-level', 'topology', 'anti-inflation'],
  },
  {
    id: 'scale_schism',
    name: 'Scale Schism',
    category: 'structural',
    description:
      'Impose autonomous, productively conflicting conceptual laws across micro, meso, macro, and meta structural strata.',
    directive:
      'Establish independent and potentially antagonistic rules across distinct strata: MICRO (pixel/material/tissue/local detail), MESO (body/object coherence), MACRO (environment/composition), and META (the governing law by which representation occurs).',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['structural_dismemberment', 'contradiction_pinger', 'split'],
    tags: ['multi-strata', 'scale', 'conflict'],
  },
  {
    id: 'concept_bleed',
    name: 'Concept Bleed',
    category: 'blending',
    description:
      'Allow a secondary concept to contaminate the primary structure through underlying geometry, transitions, and relational physics without literal visual mimicry.',
    directive:
      'Infect the primary subject with the structural, topological, and negative-space attributes of a secondary concept (e.g. gyroid cavity geometry) without literally duplicating its surface appearance or recognizable iconography.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['semantic_neighbor_walk', 'interpolate'],
    tags: ['structural-bleed', 'topology', 'cross-contamination'],
  },
  {
    id: 'forbidden_attractor',
    name: 'Forbidden Attractor',
    category: 'semantic',
    description:
      'Evoke a powerful conceptual attractor while strictly prohibiting its obvious literal iconography, preserving only indirect spatial, relational, and structural residue.',
    directive:
      'Target an intense conceptual attractor (e.g. Cathedral) while explicitly banning its direct visual signs; retain exclusively its relational architecture, vertical rhythms, spatial hierarchies, and structural resonance.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['ontology_swap', 'abstraction_escape'],
    tags: ['negative-prompting', 'attractor', 'relational-residue'],
  },
  {
    id: 'misremember',
    name: 'Misremember',
    category: 'recursive',
    description:
      'Reconstruct an earlier concept through a simulated memory fault, introducing a controlled semantic glitch and canonizing the mutated artifact as the new baseline.',
    directive:
      'Reconstruct the ancestral prompt with an intentional, subtle semantic transcription error or distorted memory artifact; treat this warped interpretation as canonical truth for successive generations.',
    minEntropy: 4,
    experimental: true,
    compatibleOperatorIds: ['recursive_reversal', 'reversion'],
    tags: ['memory-distortion', 'drift', 'glitch-lineage'],
  },
  {
    id: 'staged_paradox',
    name: 'Staged Paradox',
    category: 'contradiction',
    description:
      'Resolve impossible structures in distinct sequential stages: coarse architecture, incompatible constraint injection, anchor protection, detail synthesis, and coexisting contradiction.',
    directive:
      'Orchestrate an impossible concept sequentially: 1) Anchor coarse recognizable architecture, 2) Inject an irreconcilable structural axiom, 3) Preserve designated baseline anchors, 4) Resolve micro-textures, 5) Preserve visible evidence that contradictory interpretations coexist.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['contradiction_pinger', 'structural_dismemberment'],
    tags: ['staged-resolution', 'impossible-geometry', 'paradox'],
  },
  {
    id: 'interpolate',
    name: 'Interpolate',
    category: 'blending',
    description:
      'Smoothly and continuously fuse disparate conceptual systems according to parameterized weights, exerting concurrent structural influence.',
    directive:
      'Continuously blend two distinct conceptual frameworks along an interpolative continuum, allowing both paradigms to simultaneously sculpt and co-determine shared structural elements.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['concept_bleed', 'alternate'],
    tags: ['interpolation', 'continuous-blend', 'co-influence'],
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'blending',
    description:
      'Bifurcate conceptual governance by delegating early/global composition to one conceptual system and late/local articulation to another.',
    directive:
      'Partition generative authority: allocate early global layout, macro geometry, and composition to System A, while granting late local articulation, textural finish, and micro-behavior to System B.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['split', 'scale_schism'],
    tags: ['temporal-switch', 'macro-micro', 'partition'],
  },
  {
    id: 'alternate',
    name: 'Alternate',
    category: 'blending',
    description:
      'Interleave opposing conceptual systems rhythmically across structural domains instead of synthesizing a homogenous compromise.',
    directive:
      'Alternate between two contradictory conceptual systems in rhythmic, interlocking structural intervals, preserving the crisp tension of both without collapsing into an averaged blend.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['interpolate', 'switch'],
    tags: ['interleaving', 'rhythm', 'dual-presence'],
  },
  {
    id: 'split',
    name: 'Split',
    category: 'structural',
    description:
      'Strictly divide functional domain responsibilities (e.g. global composition vs. local material transformation) between isolated conceptual engines.',
    directive:
      'Enforce orthogonal domain division: assign System A exclusive dominion over topological form, massing, and skeletal framework, while assigning System B exclusive authority over surface dynamics, materiality, and light.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['structural_dismemberment', 'switch'],
    tags: ['domain-split', 'orthogonal', 'structural-division'],
  },
  {
    id: 'reversion',
    name: 'Reversion',
    category: 'lineage',
    description:
      'Reactivate a dormant ancestral trait or previously discarded operator from earlier lineage generations.',
    directive:
      'Query ancestral lineage records to identify an operator or stylistic constraint that was abandoned or filtered out in earlier generational steps, reinstating it into the active parameter matrix.',
    minEntropy: 5,
    experimental: true,
    compatibleOperatorIds: ['crossbreed', 'misremember'],
    tags: ['atavism', 'lineage', 'ancestry-recall'],
  },
  {
    id: 'crossbreed',
    name: 'Crossbreed',
    category: 'lineage',
    description:
      'Synthesize divergent evolutionary prompt branches by inheriting transformation logic from multiple ancestral trees.',
    directive:
      'Recombine dominant traits and operational directives from two or more divergent lineage histories, fusing their distinct transformation vectors into a unified mutant progeny.',
    minEntropy: 6,
    experimental: true,
    compatibleOperatorIds: ['reversion', 'diversity_select'],
    tags: ['hybridization', 'phylogeny', 'multi-parent'],
  },
  {
    id: 'diversity_select',
    name: 'Diversity Select',
    category: 'selection',
    description:
      'Evaluate candidate permutations against semantic distance metrics to prioritize genuinely distinct conceptual niches over superficial variants.',
    directive:
      'Analyze candidate prompt variants across a high-dimensional conceptual distance field; penalize clusters of minor stylistic rephrasings and selectively promote variants occupying isolated, uncrowded semantic coordinates.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['crossbreed', 'abstraction_escape'],
    tags: ['niche-selection', 'semantic-distance', 'anti-clustering'],
  },
  // ==============================================================
  // SLOP METHODS OPERATOR LIBRARY (25 New Mathematical / Structural Rules)
  // ==============================================================
  {
    id: 'destructive_vocab_ban',
    name: 'Destructive Vocabulary Ban',
    category: 'structural',
    description:
      'Ban destructive verbs (dissolve, melt, morph, shatter) that trigger high-frequency static; substitute deterministic topological verbs.',
    directive:
      'Ban the destructive verb set (dissolve, melt, morph, transform, break apart, shatter). Substitute deterministic structural verbs from topology, CAD, and procedural VFX (evert, homotopic deformation, retopologize, facet, planar unwrap, extrude, subdivide, tessellate).',
    minEntropy: 2,
    experimental: false,
    compatibleOperatorIds: ['progressive_wavefront', 'kinetic_anchor', 'bridge_agent'],
    tags: ['lexical', 'structural', 'cad', 'vfx', 'anti-dissolve'],
  },
  {
    id: 'technical_register',
    name: 'Technical Register Over Sensory Register',
    category: 'semantic',
    description:
      'Rewrite sensory descriptions in the vocabulary of the scientific field that actually studies the phenomenon to narrow the sampled cluster.',
    directive:
      'Rewrite all vague sensory descriptions in the formal vocabulary of the specific scientific or mathematical field that studies the phenomenon (e.g., fluid dynamics, rheology, crystallography, acoustics). Specificity narrows the sampled cluster away from distribution-average noise.',
    minEntropy: 2,
    experimental: false,
    compatibleOperatorIds: ['damage_specificity', 'ontology_swap'],
    tags: ['lexical', 'technical', 'specificity', 'field-register'],
  },
  {
    id: 'damage_specificity',
    name: 'Damage Specificity Escalation',
    category: 'semantic',
    description:
      'Replace generic damage words (VHS, glitch) with named analog failure modes (head-switching noise, timebase corrector failure, CRT phosphor bloom).',
    directive:
      'Replace generic wear/damage terms with named analog failure modes: head-switching noise, timebase corrector failure causing horizontal shearing, chroma subsampling error, CRT phosphor bloom, macro-blocking, halation, telecine jitter, or extreme Y/C separation error.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['format_contamination', 'technical_register'],
    tags: ['lexical', 'analog', 'vhs', 'crt', 'telecine', 'failure-modes'],
  },
  {
    id: 'contradiction_constraint',
    name: 'Contradiction as Generative Constraint',
    category: 'contradiction',
    description:
      'State two physically incompatible conditions as simultaneously true without hedging, forcing the model to construct rather than retrieve.',
    directive:
      'Enforce an impossible constraint with zero hedging: locally normal but globally incompatible, volume expanding while surface area collapses, continuous folding into unsmoothable manifolds, infinite surface area with finite volume, or two bodies with different anatomy casting the same spectral shadow.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['staged_paradox', 'ontology_swap'],
    tags: ['structural', 'paradox', 'impossible-constraint', 'high-priority'],
  },
  {
    id: 'progressive_wavefront',
    name: 'Progressive Wavefront / Directional Sweep',
    category: 'structural',
    description:
      'Confine transformations to a continuous geometric wavefront traveling along one axis, maintaining a stable reference anchor.',
    directive:
      'A continuous geometric wavefront sweeps along a designated spatial axis; unreached areas remain in their base state; the trailing edge continuously reorganizes into the target geometry, providing temporal attention with a trackable edge.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['kinetic_anchor', 'bridge_agent'],
    tags: ['video', 'temporal', 'wavefront', 'boundary', 'optical-flow'],
  },
  {
    id: 'kinetic_anchor',
    name: 'Kinetic Anchoring / Orbital Lock',
    category: 'structural',
    description:
      'Lock difficult transformations to a continuous 360-degree orbit or unbroken tracking shot to force compute onto parallax instead of 2D noise.',
    directive:
      'Lock the visual frame to a relentless continuous 360-degree orbit or unbroken high-speed tracking shot. The kinetic momentum forces temporal attention compute onto 3D parallax and consistent specular lighting, disincentivizing collapse to flat 2D noise.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['progressive_wavefront', 'houdini_hijack'],
    tags: ['video', 'temporal', 'camera-lock', 'orbital', 'parallax'],
  },
  {
    id: 'bridge_agent',
    name: 'Bridge Agent / Intermediate Physical Carrier',
    category: 'structural',
    description:
      'Insert an intermediate state of matter that is both organic and mathematical (nematic liquid crystal, Miura fold origami, Voronoi scaffold, ferrofluid).',
    directive:
      'Insert a legitimate intermediate state of matter that is simultaneously organic and mathematical: nematic liquid crystal phase changes, continuous Miura fold tessellation propagating across silhouettes, or Voronoi trabecular scaffolds opening along logarithmic spirals.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['substrate_shift', 'progressive_wavefront'],
    tags: ['material', 'intermediate', 'liquid-crystal', 'voronoi', 'ferrofluid'],
  },
  {
    id: 'substrate_shift',
    name: 'Substrate Shift',
    category: 'structural',
    description:
      'Replace default material with a named, physically specific, uncomfortable substance (dense expanding polyurethane, shivering silicone, oxidized bismuth).',
    directive:
      'Replace the default substance with an uncomfortable, physically specific material: dense expanding polyurethane foam, shivering hyper-glossy molded silicone, oxidized bismuth and dripping neon thermal paste, interwoven fiber-optic cables that leak light, or magnetized ferrofluid.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['bridge_agent', 'ontology_swap'],
    tags: ['material', 'viscous', 'silicone', 'ferrofluid', 'bismuth'],
  },
  {
    id: 'format_contamination',
    name: 'Format Contamination',
    category: 'structural',
    description:
      'Wrap impossible concepts in a specific mundane broadcast format (lost educational TV demonstration, 1980s aerobics tape, late-night infomercial, U-matic dub).',
    directive:
      'Wrap the subject in a mundane period broadcast format: lost educational television demonstration, 1980s aerobics instruction tape, late-night public-access broadcast, 1970s science demonstration film, corporate training tape, or telecined 16mm print.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['damage_specificity', 'temporal_anchor'],
    tags: ['media', 'broadcast', 'public-access', 'vhs', 'u-matic'],
  },
  {
    id: 'semantic_distance_walk',
    name: 'Semantic Distance Walk',
    category: 'semantic',
    description:
      'Walk 3 to 4 associative hops from the core concept before selecting a modifier, avoiding cached first-order clichés.',
    directive:
      'Traverse 3 to 4 associative conceptual hops away from the primary subject before selecting modifiers or attributes. Strictly forbid first-order hop-1 neighbors; select properties that connect logically only across multiple intermediate associative leaps.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['semantic_neighbor_walk', 'ontology_swap'],
    tags: ['associative', '3-4-hops', 'anti-cache'],
  },
  {
    id: 'syntax_injection',
    name: 'Foreign Syntax Injection',
    category: 'structural',
    description:
      'Interleave non-prose structured formats (JSON, hex dump, FASTA, SVG path, kernel panic, CSS, MIDI, SQL, L-system) to force structural rhythm and pacing.',
    directive:
      'Interleave rigid non-linguistic syntax carrying concept values (JSON hierarchies, regular expression brackets, PGP armored blocks, hexadecimal memory dumps, FASTA nucleotide sequences, kernel panics, CSS rulesets, MIDI hex, or SQL queries). Syntax supplies pacing; content supplies meaning.',
    minEntropy: 8,
    experimental: false,
    compatibleOperatorIds: ['register_collision', 'format_contamination'],
    tags: ['syntax', 'audio', 'hex', 'json', 'regex', 'fasta', 'sql'],
  },
  {
    id: 'lens_shift',
    name: 'Lens Shift',
    category: 'ontological',
    description:
      'Rewrite the concept through an alien analytical framework maximally orthogonal to default register (geological tempo, panpsychic noise, antimatter, null routing).',
    directive:
      'Select an analytical lens maximally orthogonal to the default register: antimatter inversion, geological timescale where human history is a one-second blur, subatomic charge/spin ethics, panpsychic noise where every atom screams, dimensional upgrade, or null-routing garbage collection.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['auto_genesis', 'ontology_swap'],
    tags: ['perspective', 'alien-framework', 'anti-cliche', 'orthogonal'],
  },
  {
    id: 'auto_genesis',
    name: 'Auto-Genesis / Invent the Lens',
    category: 'ontological',
    description:
      'Name an entirely new interpretive lens and define its operating logic in one sentence when existing lenses are insufficiently orthogonal.',
    directive:
      'Synthesize an entirely novel analytical lens when no standard framework is sufficiently orthogonal: invent its formal designation, state its axiomatic operating logic in one concise sentence, and execute the perspective shift through that newly forged lens.',
    minEntropy: 6,
    experimental: true,
    compatibleOperatorIds: ['lens_shift', 'abstraction_escape'],
    tags: ['perspective', 'frame-invention', 'novel-ontology'],
  },
  {
    id: 'sensory_rewiring',
    name: 'Sensory Re-Wiring',
    category: 'semantic',
    description:
      'Describe the concept strictly through a sensory channel it does not possess, forcing cross-modal retrieval from unrelated latent clusters.',
    directive:
      'Force description through the wrong sensory channel: describe an algorithm by its tactile odor and viscous flavor; describe an emotion strictly through optical refraction indices and shear modulus.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['semantic_neighbor_walk', 'technical_register'],
    tags: ['perspective', 'cross-modal', 'synesthesia'],
  },
  {
    id: 'temporal_anchor',
    name: 'Temporal Anchor',
    category: 'structural',
    description:
      'Lock to a specific historical or cosmological epoch, satisfying its material and technical constraints as a rigid generative boundary.',
    directive:
      'Lock the representation to a specific historic year, technical epoch, or cosmological era (e.g. 1974 lab telecine, Silurian geological strata, or Planck epoch heat death), satisfying that timeframe’s authentic constraints as a spring-board for mutation.',
    minEntropy: 3,
    experimental: false,
    compatibleOperatorIds: ['format_contamination', 'damage_specificity'],
    tags: ['perspective', 'epoch-lock', 'era-constraints'],
  },
  {
    id: 'oblique_answer',
    name: 'The Oblique Answer',
    category: 'semantic',
    description:
      'Answer the shadow or negative-space contour of the request rather than its literal content to bypass cached clichés.',
    directive:
      'When the prompt requests a conventional subject, answer its negative shadow: depict what was displaced by its arrival, the residue left in its wake, or the structural perimeter of the hole it leaves behind.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['forbidden_attractor', 'abstraction_escape'],
    tags: ['perspective', 'shadow-answer', 'anti-cliche', 'negative-space'],
  },
  {
    id: 'houdini_hijack',
    name: 'VFX Pipeline Latent Hijack',
    category: 'structural',
    description:
      'Append clean VFX/CAD pipeline syntax (Houdini procedural surface deformation, Signed Distance Field raymarching, Octane Render) to bypass messy hallucinations.',
    directive:
      'Append procedural 3D VFX terminology to hijack the clean motion-graphics latent cluster: Houdini procedural surface deformation, Signed Distance Field (SDF) raymarching transition, continuous vertex displacement mapping, isosurface polygonization, marching cubes, and clean specular highlights.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['destructive_vocab_ban', 'kinetic_anchor'],
    tags: ['dialect', 'vfx', 'sdf', 'houdini', 'octane', 'subsurface'],
  },
  {
    id: 'latent_bridge',
    name: 'Three-Node Latent Bridge',
    category: 'structural',
    description:
      'Structure video transitions into three nodes (Anchor A -> 50% Hybrid Node -> Anchor B) to keep interpolation inside threshold and eliminate boiling noise.',
    directive:
      'Never bridge disparate states in a single leap: generate Anchor A (initial state), a 50% Hybrid Node matching lighting and palette with tessellated geometry, and Anchor B (full target); interpolate through geometric unfolding.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['progressive_wavefront', 'houdini_hijack'],
    tags: ['pipeline', 'video', 'three-node', 'interpolation'],
  },
  {
    id: 'frequency_conflict',
    name: 'Frequency Conflict',
    category: 'contradiction',
    description:
      'Force incompatible acoustic genres and acoustic spaces into one bracket (e.g. [Gregorian chant + speedcore + underwater]).',
    directive:
      'Force mutually incompatible acoustic genres, instrumentation, and acoustic spaces into single bracketed cues: [Gregorian chant + 240BPM speedcore + underwater cavern reverb], [Baroque harpsichord + drill 808 distortion + anechoic chamber].',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['structural_paradox_tag', 'instrument_displacement'],
    tags: ['dialect', 'audio', 'acoustic-conflict', 'genre-collision'],
  },
  {
    id: 'instrument_displacement',
    name: 'Instrument Displacement',
    category: 'structural',
    description:
      'Assign percussive or melodic roles to non-instruments (e.g. percussion is human coughing, lead synth is Geiger counter clicks).',
    directive:
      'Assign standard musical rhythm and melodic roles to non-musical phenomena: percussion is rhythmic human throat-clearing and pleural fluid clicks; bassline is seismic fault tremor; lead melody is an erratically failing refrigerator compressor.',
    minEntropy: 4,
    experimental: false,
    compatibleOperatorIds: ['frequency_conflict', 'register_collision'],
    tags: ['dialect', 'audio', 'percussion', 'displacement'],
  },
  {
    id: 'structural_paradox_tag',
    name: 'Structural Paradox in Section Tags',
    category: 'contradiction',
    description:
      'Insert physically impossible acoustic events inside musical section header brackets (e.g. [Breakdown: the singer ages 100 years in 10 seconds]).',
    directive:
      'Inject impossible physical transformations inside section cue brackets: [Breakdown: singer vocal cords calcify into solid brass over 8 measures], [Solo: piano keys strike themselves backwards in time with negative decibels].',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['frequency_conflict', 'sonification_of_absence'],
    tags: ['dialect', 'audio', 'section-paradox', 'impossible-cues'],
  },
  {
    id: 'sonification_of_absence',
    name: 'Sonification of Absence',
    category: 'ontological',
    description:
      'Demand sonification of a void or missing element to hyper-amplify the model noise floor into ghostly acoustic artifacts and phase cancellation.',
    directive:
      'Demand sonification of pure negative space: [the absence of a 1980s synthesizer], [localized drop in atmospheric pressure], anechoic chamber vacuum, absolute zero thermal noise, phase cancellation, or the exact frequency of offline physical spaces.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['psychoacoustic_phantom', 'structural_paradox_tag'],
    tags: ['dialect', 'audio', 'vacuum', 'negative-space', 'phase-cancellation'],
  },
  {
    id: 'psychoacoustic_phantom',
    name: 'Psychoacoustic Phantom',
    category: 'ontological',
    description:
      'Invoke perceptual-only auditory phenomena (Tartini third tone extraction, Shepard scale infinite descent, backward temporal masking).',
    directive:
      'Instruct audio synthesis to produce perceptual-only auditory phenomena: Tartini third difference tone extraction, nonlinear phantom fundamental, Shepard scale infinite pitch descent, and simultaneous backward spectral masking.',
    minEntropy: 6,
    experimental: false,
    compatibleOperatorIds: ['sonification_of_absence', 'frequency_conflict'],
    tags: ['dialect', 'audio', 'tartini', 'shepard-scale', 'psychoacoustics'],
  },
  {
    id: 'register_collision',
    name: 'Register Collision',
    category: 'structural',
    description:
      'Pair highly structured style tags with meterless, formless prose lyrics to force vocal synthesis to stretch and generate emergent harmonies.',
    directive:
      'Pair a hyper-rigid pop song or choral arrangement structure with lyric texts that possess zero rhyme, zero metric feet, and no line breaks, compelling the neural vocoder to stretch syllables into microtonal glissandi and novel polyphony.',
    minEntropy: 5,
    experimental: false,
    compatibleOperatorIds: ['syntax_injection', 'zalgo_phoneme_forcing'],
    tags: ['dialect', 'audio', 'meterless', 'emergent-harmony'],
  },
  {
    id: 'zalgo_phoneme_forcing',
    name: 'Zalgo Phoneme Forcing',
    category: 'recursive',
    description:
      'Apply combining diacritical marks strictly to lyrics to force phoneme models into guessing novel alien vocalizations.',
    directive:
      'Apply controlled Unicode combining diacritics strictly to phonetic lyrics (never to style tags) to corrupt standard tokenizer pronunciation and force the acoustic engine into producing glottal clicks, unvoiced whispers, and alien diphthongs.',
    minEntropy: 7,
    experimental: true,
    compatibleOperatorIds: ['register_collision', 'syntax_injection'],
    tags: ['dialect', 'audio', 'zalgo', 'phoneme', 'diacritics'],
  },
] as const;

/**
 * Default dormant mutation recipe (disabled by default, empty collections)
 */
export const DEFAULT_MUTATION_RECIPE: MutationRecipe = {
  enabled: false,
  operators: [],
  attractors: [],
  pressureIds: [],
  semanticDistance: 0,
  semanticNeighborHops: 0,
  preservedAnchors: [],
  lineage: undefined,
  diagnosticSummary: undefined,
};

/**
 * Retrieve a mutation operator by its stable ID
 */
export function getMutationOperator(id: string): MutationOperator | undefined {
  const standard = MUTATION_OPERATORS.find((op) => op.id === id);
  if (standard) return standard;

  // Check for user-promoted experimental operators in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem('david_promoted_operators_v1');
      if (raw) {
        const map = JSON.parse(raw);
        if (map && map[id]) {
          const p = map[id];
          return {
            id: p.id,
            name: p.name,
            category: 'blending',
            description: p.shortDescription || 'Empirically discovered mutation operator.',
            directive: `Execute experimental operator sequence [${(p.operators || []).join(' → ')}]: ${p.mechanismHypothesis}. Exploit expected failure surface [${(p.expectedFailureSurface || []).join(', ')}].`,
            minEntropy: 3,
            experimental: true,
            compatibleOperatorIds: p.operators || [],
            tags: ['experimental', 'promoted-discovery', p.targetMedium, ...(p.tags || [])],
          };
        }
      }
    } catch {
      // Safe ignore
    }
  }

  return undefined;
}

/**
 * Verify if a given string corresponds to a registered mutation operator ID
 */
export function isValidMutationOperatorId(id: string): boolean {
  return !!getMutationOperator(id);
}

/**
 * Retrieve all mutation operators belonging to a specific category
 */
export function getMutationOperatorsByCategory(category: MutationCategory): MutationOperator[] {
  return MUTATION_OPERATORS.filter((op) => op.category === category);
}

/**
 * Group all registered mutation operators by category
 */
export function getMutationOperatorsGroupedByCategory(): Record<MutationCategory, MutationOperator[]> {
  const groups: Record<MutationCategory, MutationOperator[]> = {
    structural: [],
    semantic: [],
    ontological: [],
    recursive: [],
    contradiction: [],
    blending: [],
    lineage: [],
    selection: [],
  };

  for (const op of MUTATION_OPERATORS) {
    groups[op.category].push(op);
  }

  return groups;
}

// Re-export concrete executor for structural_dismemberment (Job 3)
export { executeStructuralDismemberment } from '../utils/conceptDismemberment';
