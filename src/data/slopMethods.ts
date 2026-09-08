import { SlopMethodsLibrary, SlopMethodOperator } from '../types';

export const SLOP_METHODS_LIBRARY: SlopMethodsLibrary = {
  schema_version: '1.0',
  name: 'slop_methods',
  description:
    'Operator library for the DAVID prompt compiler. Each entry is a rule that transforms a prompt, not a vocabulary item. Vocabulary belongs in the lists corpus.',
  predicate: {
    id: 'structural_test',
    description: 'Gate every mutation through this before shipping. A mutation that fails all three is decoration.',
    tests: [
      'Delete the weird word. Does the geometry change?',
      'Does the strangeness come from a rule, or from a texture? Rules propagate; textures sit on top.',
      'Can it be restated as a constraint instead of an adjective list?',
    ],
    fail_example: 'a woman made of fractal patterns, glitchy, iridescent, surreal, bismuth textures, 8k',
    pass_example:
      'her surface is the boundary of her interior — one continuous sheet, so the fold makes viscera read as exterior topology; light entering the outside exits from the inside',
  },
  operators: [
    {
      id: 'destructive_vocab_ban',
      name: 'Destructive Vocabulary Ban',
      family: 'lexical',
      targets: ['video', 'image'],
      structural: true,
      mechanism:
        'Text encoders map dissolve/glitch/disintegrate/shatter/decay/morph/corrupt to visual entropy. The model reads them as instructions to generate high-frequency static and incoherent particle clouds, not as transition instructions.',
      operation:
        'Ban the destructive verb set; substitute deterministic structural verbs from topology, CAD, and procedural VFX.',
      swap: {
        dissolve: 'evert',
        melt: 'evert',
        morph: 'homotopic deformation',
        transform: 'homotopic deformation',
        'break apart': 'retopologize',
        deconstruct: 'retopologize',
        shatter: 'facet',
        crack: 'facet',
        unfold: 'planar unwrap',
        grow: 'extrude',
        expand: 'subdivide',
        tile: 'tessellate',
        cover: 'tessellate',
      },
      source: 'drive:1esWqAr',
    },
    {
      id: 'technical_register',
      name: 'Technical Register Over Sensory Register',
      family: 'lexical',
      targets: ['image', 'video', 'audio'],
      structural: false,
      mechanism:
        'Technical vocabulary is more specific than sensory vocabulary, and specificity narrows the sampled cluster. Vague sensory words average across the distribution.',
      operation: 'Rewrite sensory description in the vocabulary of the field that actually studies the phenomenon.',
      source: 'drive:1dH7xiN',
    },
    {
      id: 'damage_specificity',
      name: 'Damage Specificity Escalation',
      family: 'lexical',
      targets: ['image', 'video'],
      structural: false,
      mechanism:
        "Generic damage terms like 'VHS' are so overrepresented they resolve to a mild filter. Named structural failure modes point at rare clusters.",
      operation: 'Replace generic damage words with named analog failure modes.',
      bank: [
        'head-switching noise',
        'timebase corrector failure causing horizontal shearing',
        'chroma subsampling error',
        'chroma misalignment',
        'CRT phosphor bloom',
        'phosphor decay',
        'generation 10 dub',
        'telecine jitter',
        'extreme Y/C separation error',
        'tape head drag causing vertical roll',
        'macro-blocking',
        'halation',
        'optical printing dirt',
        'projector jitter',
        'Moire interference',
        'solarization',
      ],
      source: 'drive:1_cUmdd',
    },
    {
      id: 'contradiction_constraint',
      name: 'Contradiction as Generative Constraint',
      family: 'structural',
      targets: ['image', 'video', 'audio', 'text'],
      structural: true,
      priority: 'highest',
      mechanism: 'An impossible constraint has no cached answer. The model cannot retrieve, so it must construct.',
      operation: 'State two physically incompatible conditions as simultaneously true, without hedging.',
      templates: [
        'locally normal but globally incompatible',
        'volume expanding while surface area collapses',
        'continuous folding into unsmoothable manifolds',
        'infinite surface area, finite volume',
        'two bodies with different anatomy casting the same spectral shadow',
        '{X} and {not_X} occupying the same coordinate',
      ],
      source: 'drive:1_cUmdd',
    },
    {
      id: 'progressive_wavefront',
      name: 'Progressive Wavefront / Directional Sweep',
      family: 'structural',
      targets: ['video'],
      structural: true,
      mechanism:
        'Global simultaneous state change means every pixel resolves at once with no anchor, producing noise. A moving boundary gives temporal attention a trackable edge and keeps the unreached region as a stable reference.',
      operation: 'Confine any transformation to a boundary traveling along one axis.',
      template:
        'a continuous geometric wavefront sweeps {axis}; unreached areas remain {base_state}; the trailing edge continuously reorganizes into {target_geometry}',
      source: 'drive:1esWqAr',
    },
    {
      id: 'kinetic_anchor',
      name: 'Kinetic Anchoring / Orbital Lock',
      family: 'structural',
      targets: ['video'],
      structural: true,
      mechanism:
        'Temporal attention tracks optical flow across frames. Static camera plus static subject means no directional momentum, so pixels lose their destination. A relentless camera move forces compute onto parallax and consistent lighting, disincentivizing collapse to flat 2D noise.',
      operation: 'Lock difficult transformations to a continuous 360 degree orbit or unbroken tracking shot.',
      source: 'drive:1esWqAr',
    },
    {
      id: 'bridge_agent',
      name: 'Bridge Agent / Intermediate Physical Carrier',
      family: 'structural',
      targets: ['video', 'image'],
      structural: true,
      mechanism:
        'Video models hold a strong prior for conservation of mass and rigid-body trajectory. Instantaneous volume change reads as an occlusion error or edit cut and emits a flash of noise. An intermediate state of matter that is both organic and mathematical satisfies the prior.',
      operation: 'Insert a material that is legitimately both organic and geometric.',
      bank: [
        {
          agent: 'nematic liquid crystal',
          phrasing:
            'her epidermis undergoes a phase change into nematic liquid crystal, whose molecular alignment locks the surface into rigid mathematical planes',
        },
        {
          agent: 'Miura fold origami',
          phrasing:
            'continuous Miura fold tessellation propagating across the silhouette, creasing organic curves into interlocking polyhedral facets',
        },
        {
          agent: 'Voronoi / trabecular scaffold',
          phrasing:
            'the skin opens along procedural Voronoi cell boundaries, revealing an internal scaffold of logarithmic spirals',
        },
        {
          agent: 'ferrofluid',
          phrasing: 'magnetized ferrofluid reacting to an invisible non-Euclidean geometry',
        },
        {
          agent: 'crystal nucleation wavefront',
          phrasing: 'an isotropic crystal nucleation wavefront where skin becomes mirrored brass and glass planes',
        },
        {
          agent: 'non-Newtonian fluid',
          phrasing: 'candy-colored non-Newtonian fluid contorting itself into turbulence',
        },
      ],
      source: 'drive:1esWqAr',
    },
    {
      id: 'ontology_swap',
      name: 'Ontology Swap / Math as Mechanism',
      family: 'structural',
      targets: ['image', 'video', 'audio'],
      structural: true,
      mechanism:
        'A mathematical descriptor gives the model an object plus a texture. A mathematical governing law gives it a rule it must solve for, which propagates through anatomy, motion, and space.',
      operation: 'Convert every scientific reference from a descriptor into a law that determines behavior.',
      swap: {
        'has fractal patterns': 'recursion determines how it breeds, molts, divides and collapses',
        'topological look': 'topology determines how the body folds and passes through itself',
        'reaction-diffusion texture': 'reaction-diffusion grows the skin and organs in real time',
        'chaotic movement': 'strange attractors govern the choreography; limbs are bound to orbital basins',
        'cellular pattern': 'cellular automata spread through the flesh, dying and resurrecting',
        symmetrical: 'a symmetry group produces impossible mirrored bodies',
        knotted: 'knot theory becomes the joints and movement constraints',
        'warped space': 'differential geometry changes how the entity occupies space',
        fluid: 'fluid dynamics produces temporary organisms',
        'uncertain form': 'probability distributions become unstable physical forms',
      },
      source: 'drive:1_cUmdd',
    },
    {
      id: 'substrate_shift',
      name: 'Substrate Shift',
      family: 'structural',
      structural: 'partial',
      targets: ['image', 'video'],
      mechanism:
        'Changing what a thing is made of changes how light, motion, and deformation behave, which propagates further than a color change.',
      operation: 'Replace the default material with a named, physically specific, uncomfortable substance.',
      bank: [
        'dense expanding polyurethane foam',
        'shivering hyper-glossy molded silicone',
        'oxidized bismuth and dripping neon thermal paste',
        'interwoven fiber-optic cables that leak light',
        'magnetized ferrofluid',
        'nematic liquid crystal',
        'wet latex over practical animatronics',
        'viscous radioactive-cyan fluid',
      ],
      source: 'drive:1_cUmdd',
    },
    {
      id: 'format_contamination',
      name: 'Format Contamination',
      family: 'structural',
      targets: ['image', 'video', 'audio'],
      structural: true,
      mechanism:
        'A period media format carries an entire package of camera, lighting, pacing, framing and degradation conventions. Contaminating one with an impossible subject forces the model to reconcile two strong incompatible priors.',
      operation: 'Wrap the concept in a specific mundane broadcast format.',
      bank: [
        'lost educational television demonstration',
        '1980s aerobics instruction tape',
        'late-night public-access broadcast',
        '1970s science demonstration film',
        'beauty tutorial',
        'dance instruction video',
        'game show',
        'medical training film',
        'children’s programming',
        'corporate training tape',
        'late-night infomercial',
        'televangelist broadcast',
        'karaoke music video',
        'avant-garde fashion show',
        'public service announcement',
        'home camcorder footage',
        'U-matic dub',
        'Betamax tape',
        'telecined 16mm print',
      ],
      source: 'drive:1_cUmdd',
    },
    {
      id: 'semantic_distance_walk',
      name: 'Semantic Distance Walk',
      family: 'structural',
      targets: ['image', 'video', 'audio', 'text'],
      structural: true,
      mechanism:
        'First-order associations are the model’s cached answer. Three to four hops out still connects to the concept but has no ready-made template.',
      operation: 'Walk 3 to 4 associative hops from the core concept before selecting a modifier. Never use a hop-1 neighbor.',
      params: { min_hops: 3, max_hops: 4 },
      source: 'drive:1dH7xiN',
    },
    {
      id: 'syntax_injection',
      name: 'Foreign Syntax Injection',
      family: 'syntax',
      targets: ['audio', 'image', 'video'],
      structural: true,
      priority: 'high',
      min_w_coeff: 9,
      mechanism:
        'Models expect linguistic syntax. Injecting a rigid non-prose data structure makes the tokenizer assign semantic and phonetic value to punctuation, indentation and delimiters, producing structural rhythm and pacing unreachable from prose. Strongest on audio targets.',
      operation:
        'Replace or interleave prose with a structured non-linguistic format whose keys and values carry the actual concept. Inert structure does nothing; the structure supplies rhythm, the content supplies meaning.',
      vectors: [
        { id: 'A', format: 'JSON object', effect: 'maps JSON hierarchy onto verse/chorus structure; hyper-rigid robotic glitch-trance' },
        { id: 'B', format: 'regular expression', effect: 'attention snags on brackets, asterisks, carets; stuttering modem harmonics' },
        { id: 'C', format: 'PGP armored key block', effect: 'model assumes corrupted binary; arrhythmic clicks, pops, dropouts' },
        { id: 'D', format: 'hexadecimal memory dump', effect: 'grid spacing forces metronomic pacing; chants hex like cold Gregorian' },
        { id: 'E', format: 'FASTA nucleotide sequence', effect: 'AUGC repetition forces microscopic vocal loops' },
        { id: 'F', format: 'raw SVG path data', effect: 'model tries to draw the sound; sweeping panning, mechanical screeches' },
        { id: 'G', format: 'kernel panic / stack trace', effect: 'bracketed timestamps and hex addresses force rigid unsettling meter' },
        { id: 'H', format: 'NumPy tensor array of hex colors plus NaN', effect: 'stuttering datamosh frequencies' },
        { id: 'I', format: 'boolean if/else/while block', effect: 'shifts tone, genre and vocal style at every brace' },
        { id: 'J', format: 'CSS ruleset', effect: 'reads !important and 100vh as mixing parameters; compressed panning static into abrupt silence' },
        { id: 'K', format: 'raw MIDI hex with impossible velocity', effect: 'phonetic hex chanting plus extreme pitch bend' },
        { id: 'L', format: 'ASCII waveform / EEG plot with block characters', effect: 'synthesizes the shape of the text; sweeping noise, percussive chugging' },
        { id: 'M', format: 'SQL query with DROP and UPDATE', effect: 'corrupted-corporate-training-video descending into madness' },
        { id: 'N', format: 'L-system production rules', effect: 'recursive bracketing gives infinitely escalating spiraling stutters that never resolve' },
        { id: 'O', format: 'git merge conflict markers', effect: 'sings both realities; extreme split-panning, dual competing voices, violent tempo shifts' },
        { id: 'P', format: 'G-code toolpath', effect: 'rigid grinding industrial lockstep' },
        { id: 'Q', format: 'Java stack trace', effect: 'indentation forces hymnal cadence, dissolving into clipping at NaN' },
        { id: 'R', format: 'EXIF metadata block', effect: 'colon-separated values act as micro-prompts; strategy reshuffles every line break' },
      ],
      source: 'drive:1gllbNM',
    },
    {
      id: 'lens_shift',
      name: 'Lens Shift',
      family: 'perspective',
      targets: ['image', 'video', 'audio', 'text'],
      structural: true,
      mechanism:
        'An alien analytical framework forces the model off the cached description into a region where it must construct vocabulary and imagery rather than retrieve them. Selection matters more than intensity.',
      operation:
        'Select the lens maximally orthogonal to the input’s default register, then rewrite the concept entirely through it.',
      selection_rule: {
        cliche: 'inversion',
        rigid_or_scientific: 'mystical_abstraction',
        emotional_or_human: 'cold_algorithmic',
      },
      lenses: [
        { id: 'antimatter', logic: 'the exact opposite is the only true thing; current reality is the hallucination' },
        { id: 'geological_tempo', logic: 'view through the timescale of a tectonic plate; human history is a one-second blur' },
        { id: 'subatomic_ethic', logic: 'apply particle physics to behavior; things have spin and charge instead of properties' },
        { id: 'panpsychic_noise', logic: 'every atom involved is conscious and screaming its own agenda' },
        { id: 'xeno_biological', logic: 'evaluate as a hive-mind of sentient gas or a planetary fungal network' },
        { id: 'dimensional_upgrade', logic: 'recompute in 4, 5 or 11 dimensions; time as a spatial dimension you walk across' },
        { id: 'negative_space_inversion', logic: 'describe only what it is not; reconstruct from the hole it leaves' },
        { id: 'entropic_decay', logic: 'accelerate to heat death, then work back to the midpoint between now and total chaos' },
        { id: 'algorithmic_trance', logic: 'cease narrative; output only associative data points, ratios and formulas' },
        {
          id: 'ontological_parasite',
          logic:
            'ideas are hyper-dimensional parasites using substrates as reproductive organs; format as quarantine protocol',
        },
        { id: 'null_routing', logic: 'the pattern is a garbage-collection algorithm failing to delete something' },
      ],
      source: 'drive:1GIn7FO',
    },
    {
      id: 'auto_genesis',
      name: 'Auto-Genesis / Invent the Lens',
      family: 'perspective',
      structural: true,
      mechanism: 'Naming a new frame commits the model to consistency instead of drifting back toward the mean.',
      operation:
        'When no existing lens is orthogonal enough: name a new lens, define its operating logic in one sentence, then execute the perspective shift.',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'sensory_rewiring',
      name: 'Sensory Re-Wiring',
      family: 'perspective',
      structural: false,
      mechanism:
        'Describing something via a sense it does not possess forces cross-modal retrieval, pulling vocabulary from unrelated clusters.',
      operation: 'Require description through the wrong sense. What does it smell like? What is the texture of this algorithm?',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'temporal_anchor',
      name: 'Temporal Anchor',
      family: 'perspective',
      structural: true,
      mechanism:
        'Locking to a specific era imports that era’s material and technical constraints as a constraint set the model must satisfy.',
      operation:
        'Pick a specific year or epoch, evaluate under its limits, use as springboard. Escalate by swinging to a cosmological epoch.',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'oblique_answer',
      name: 'The Oblique Answer',
      family: 'perspective',
      structural: true,
      mechanism: 'The literal request is usually the cliche version of what is wanted.',
      operation: 'If the request is standard, answer the shadow of the request rather than its literal content.',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'houdini_hijack',
      name: 'VFX Pipeline Latent Hijack',
      family: 'dialect',
      targets: ['video'],
      structural: false,
      mechanism:
        'Video models ingest large volumes of motion-graphics portfolios, VFX breakdowns and 3D technical demos rendered with sub-pixel precision, perfect lighting, zero motion-blur noise and clean topological flow. Invoking that vocabulary hijacks the clean cluster and bypasses the messy-hallucination cluster.',
      operation: 'Append VFX-pipeline syntax to the prompt tail.',
      bank: [
        'Houdini procedural surface deformation',
        'Signed Distance Field raymarching transition',
        'continuous vertex displacement mapping',
        'isosurface polygonization',
        'marching cubes algorithm',
        'real-time UV unwrapping and retopology',
        'Octane Render, 60fps',
        'clean specular highlights, subsurface scattering',
        'perfectly conserved mass, zero artifacts',
        'no motion smear, no static noise',
      ],
      strongest_tokens: ['signed distance field', 'isosurface'],
      source: 'drive:1esWqAr',
    },
    {
      id: 'latent_bridge',
      name: 'Three-Node Latent Bridge',
      family: 'pipeline',
      targets: ['video'],
      structural: true,
      mechanism:
        'If frame 1 and frame 2 are separated by more than the model’s interpolation threshold, it produces a cross-dissolve of boiling noise. Halving the latent distance keeps every pass inside the threshold.',
      operation: 'Never bridge a human and an abstract manifold in a single leap.',
      steps: [
        'Generate Anchor A, the initial state.',
        'Generate a Hybrid Node: take A into image-to-image, inpaint roughly 50 percent into the target geometry, keep face and lighting identical.',
        'Generate Anchor B, the full target, matching A’s palette and lighting angles exactly.',
        'Interpolate A to Hybrid with prompts emphasizing tessellation and facetting.',
        'Interpolate Hybrid to B with prompts emphasizing complete geometric unfolding.',
        'Splice at the apex frame.',
      ],
      source: 'drive:1esWqAr',
    },
    {
      id: 'frequency_conflict',
      name: 'Frequency Conflict',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      operation: 'Force incompatible genre and acoustic-space pairs into one bracket.',
      example: '[Gregorian chant + speedcore + underwater]',
      source: 'drive:1dH7xiN',
    },
    {
      id: 'instrument_displacement',
      name: 'Instrument Displacement',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      operation: 'Assign a percussion or melodic role to a non-instrument.',
      example: '[percussion is a human coughing]',
      source: 'drive:1dH7xiN',
    },
    {
      id: 'structural_paradox_tag',
      name: 'Structural Paradox in Section Tags',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      operation: 'Put a physically impossible event inside a section header.',
      example: '[Breakdown: the singer ages 100 years in 10 seconds]',
      source: 'drive:1dH7xiN',
    },
    {
      id: 'sonification_of_absence',
      name: 'Sonification of Absence',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      mechanism:
        'Demanding sonification of a void hyper-amplifies the model’s noise floor; it hallucinates artifacts, hiss and ghostly ambient texture trying to fill the negative space.',
      operation: 'Describe the exact dimensions of what is missing; use brackets for non-sound.',
      bank: [
        '[the absence of a 1980s synthesizer]',
        '[a localized drop in atmospheric pressure]',
        'anechoic chamber vacuum',
        'absolute zero thermal noise',
        'Moire interference cancellation',
        'phase cancellation',
        'the exact frequency of offline physical spaces',
      ],
      source: 'drive:1gllbNM',
    },
    {
      id: 'psychoacoustic_phantom',
      name: 'Psychoacoustic Phantom',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      mechanism:
        'Asking for a frequency that exists only perceptually forces the model to synthesize the hallucination rather than the signal.',
      operation: 'Invoke a perceptual-only auditory phenomenon.',
      bank: [
        'Tartini third tone extraction',
        'nonlinear phantom frequency',
        'Shepard scale infinite descent',
        'backward temporal masking',
        'simultaneous spectral masking',
        'auditory chimera',
      ],
      source: 'drive:1gllbNM',
    },
    {
      id: 'register_collision',
      name: 'Register Collision',
      family: 'dialect',
      targets: ['audio'],
      structural: true,
      mechanism:
        'Mapping rigid pop structure onto formless meterless text causes vocal synthesis to stretch, glitch and produce emergent harmonies.',
      operation: 'Pair a highly structured style tag with lyric content that has no rhyme, meter or line breaks.',
      source: 'drive:1gllbNM',
    },
    {
      id: 'zalgo_phoneme_forcing',
      name: 'Zalgo Phoneme Forcing',
      family: 'dialect',
      targets: ['audio'],
      structural: false,
      mechanism:
        'Combining diacritics forces the phoneme model to guess, producing novel vocalizations.',
      operation: 'Apply Zalgo to lyrics only, never to style tags.',
      caution:
        'Plain binary or hex strings used as obfuscation just tokenize back to text and waste budget. Structured hex with grid spacing (syntax vector D) is different and does work.',
      source: 'drive:1dH7xiN',
    },
  ],
  protocols: [
    {
      id: 'w_coeff',
      name: 'Weirdness Coefficient',
      type: 'gate',
      description: '1 to 10 dial gating which operator families are permitted.',
      bands: [
        {
          range: [1, 4],
          label: 'eccentric',
          permits: ['lens_shift', 'substrate_shift', 'format_contamination', 'technical_register', 'damage_specificity'],
        },
        {
          range: [5, 8],
          label: 'unsettling',
          permits: ['semantic_dissociation', 'parasitic_framing', 'contradiction_constraint', 'ontology_swap'],
          note: "semantic dissociation replaces nouns with function-abstracts: not 'money' but 'the quantified anxiety of resource-scarcity'",
        },
        {
          range: [9, 10],
          label: 'absolute',
          permits: ['syntax_injection', 'glitched_syntax', 'void_mirror'],
        },
      ],
      escalation: { trigger: 'PUSH', delta: 2 },
      source: 'drive:1GIn7FO',
    },
    {
      id: 'anticliche_scrub',
      name: 'Anti-Cliche Data Scrub',
      type: 'filter',
      priority: 'highest',
      description:
        'If the mutation has a recognizable referent in a popular film, book or common internet theory, the model retrieved rather than constructed and never left the distribution.',
      operation: 'Reject and iterate until the perspective is niche enough that it would lack a Wikipedia entry.',
      note: 'Wire this as a hard filter, not a suggestion. Pairs directly with the decorativeOnlyPenalty field.',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'recursion',
      name: 'Recursion / Residue Incineration',
      type: 'loop',
      priority: 'highest',
      description:
        'Feeding weird output back in as context genuinely shifts the sampling distribution; the model’s prior output becomes the new anchor and each pass moves further from the training mean.',
      steps: [
        'Take the previous output.',
        'Identify the conventional residue left in it.',
        'Discard that residue explicitly.',
        'Produce output structurally incompatible with the previous logic.',
      ],
      maps_to: 'ouroboros',
      source: 'drive:1GIn7FO',
    },
    {
      id: 'base_rotation',
      name: 'Base Rotation',
      type: 'diversity_constraint',
      description:
        'Reusing the same analytical frame across generations collapses variety; every output becomes a variation on one metaphor.',
      operation: 'Every third generation, forcibly change the scientific base. No repeats within a lineage.',
      bank: [
        'quantum physics',
        'plate tectonics',
        'evolutionary biology',
        'epidemiology',
        'rheology',
        'mycology',
        'topological photonics',
        'fluid dynamics',
        'crystallography',
        'parasitology',
        'thermodynamics',
        'acoustics',
      ],
      source: 'drive:1GIn7FO',
    },
    {
      id: 'family_resemblance',
      name: 'Family Resemblance, Not Template',
      type: 'variant_constraint',
      description:
        "Asking for 'more like this' produces paraphrase: same sentence structure, swapped adjectives. One idea wearing different hats.",
      operation:
        'Preserve only the core conceptual DNA. Everything else must mutate. Each variant must introduce a new central mechanism, not a cosmetic variation.',
      anti_goal: 'the same entity doing a different pose',
      source: 'drive:1_cUmdd',
    },
  ],
  mechanism_bank: {
    note: 'Raw material for ontology_swap. Named systems with distinct visual or behavioral signatures, for when the compiler needs a governing law rather than a descriptor.',
    attractors: [
      {
        name: 'Rossler hyperchaotic system',
        signature: 'two positive Lyapunov exponents; stretches and folds along multiple independent directions simultaneously',
      },
      { name: 'folded-towel map', signature: 'discrete hyperchaos' },
      { name: 'Chua double-scroll', signature: 'two interconnected swirling lobes composed of infinite fractal layers' },
      { name: 'Dadras', signature: 'two, three or four scrolls tunable by a single parameter' },
      { name: 'Aizawa', signature: 'spherical shell with a tube penetrating one axis; chaotic torus-sphere hybrid' },
      {
        name: 'Rabinovich-Fabrikant',
        signature:
          'interwoven loops and tendrils; so sensitive that different numerical solvers yield visually distinct attractors from identical parameters',
      },
      { name: 'Chen-Lee', signature: 'asymmetric butterfly, derived from rigid-body Euler equations' },
      { name: 'Lorenz', signature: 'two inescapable orbital basins' },
    ],
    emergence: [
      {
        name: 'Turing instability',
        signature: 'activator plus faster-diffusing inhibitor spontaneously breaking a uniform state into periodic pattern',
      },
      {
        name: 'Belousov-Zhabotinsky reaction',
        signature:
          'propagating oxidation waves, concentric targets and rotating spirals that annihilate on collision due to a refractory period',
      },
      {
        name: 'mycelial network',
        signature:
          'reconfigures topology toward resources, strengthening productive paths and letting others die back; decentralized, no central brain',
      },
      {
        name: 'Langton’s Ant',
        signature: 'symmetric, then chaotic, then a spontaneous repeating 104-step highway',
      },
      { name: 'turmites', signature: 'multi-state ants producing spirals and Fibonacci-like structures' },
      {
        name: 'Lenia',
        signature: 'continuous cellular automaton; fuzzy resilient lifeforms that move, repair damage and self-replicate',
      },
    ],
    impossible_geometry: [
      {
        name: 'Poincare disk',
        signature: 'objects shrink exponentially toward a boundary that represents infinity; tilings impossible in Euclidean space',
      },
      {
        name: 'hyperbolic Julia and Mandelbrot sets',
        signature: 'self-similar structures warped by negative curvature',
      },
      {
        name: 'surreal numbers',
        signature: 'recursive construction from the empty set generating transfinites and infinitesimals',
      },
      {
        name: 'pataphysics',
        signature: 'the science of the excepted case, the sporadic accident, rather than the general law',
      },
    ],
    physical_exotica: [
      { name: 'quantum foam', signature: 'seething bubbling froth of spacetime geometry at the Planck scale' },
      { name: 'cosmic web', signature: 'filaments, knots and voids emerging from amplified quantum fluctuations' },
      {
        name: 'cosmic strings',
        signature: 'one-dimensional topological defects forming cusps, kinks and pinched-off decaying loops',
      },
      { name: 'bootstrap paradox', signature: 'a stable fixed point; the object is the attractor of its own history' },
      { name: 'grandfather paradox', signature: 'a divergent trajectory; initial condition inconsistent with the system’s own history' },
    ],
    calibration_specimens: [
      'reaction-diffusion epidermis: features migrate, breed and dissolve across a face, forming temporary swirling organs',
      'Calabi-Yau contortionist: limbs pass through the torso by spatial compactification rather than by bones',
      'cellular-automata chanteuse: flesh tessellates, dies and resurrects to an unheard rhythm',
      'strange-attractor marionette: chaotic limbs bound within two inescapable orbital loops',
      'photoelastic silhouette: no physical body, only birefringent interference fringes mapping invisible torsion',
      'Banach-Tarski aerobics: a body fractures into unmeasurable point-clouds that reassemble into two identical dancers',
      'Gabriel’s Horn: infinite surface area, finite volume, endlessly coated and never filled',
      'Hopf fibration runway: interlocking non-intersecting fibers; limbs pass through the torso in linked loops',
      'Fourier transform televangelist: exists in the frequency domain, collapsing to a face only on audio feedback',
      'Klein-bottle contortionist: the head passes through the spine to become the exterior shell',
      'exotic R4 anomaly: locally normal, globally failing; unsmoothable non-diffeomorphic transitions',
      'Painlevé transcendent entity: limbs branch and self-annihilate by isomonodromic deformation',
      'noncommutative mirror-vault: X and Y refuse to commute; reflection shatters into a Cantor set of fuzzy spheres',
      'isospectral doppelgangers: different anatomy, identical spectral shadow',
      'Penrose quasicrystal molt: aperiodic five-fold shards, never repeating',
    ],
  },
  sources: {
    '1esWqAr': 'How can I force video models to generate smooth transitions',
    '1_cUmdd': 'Prompts weird today',
    '1GIn7FO': 'OUTSIDE THE BOX GUY personal prompt (jailbreak layer stripped)',
    '1gllbNM': "There's a fun little game I like to play",
    '1VaFDF': 'Datamosh weird guy',
    '19OqZp_': 'Seeking Weird and Obscure Chaos',
    '1dH7xiN': 'AI Slop',
  },
  not_yet_mined: [
    { id: '1UaRGr', title: 'Weird promptness', note: '90k, largest unmined' },
    { id: '1l9nFAk', title: 'Pentagonal Anholonomy Advanced Prompt Kit' },
    { id: '15UrgjT', title: 'Twistor String Theory prompts' },
    { id: '1Oq7R2k', title: 'Math Scryer Extracts' },
    { id: '1ZNOVHF', title: 'sora 2 prompts' },
    { id: '1fV4AUL', title: 'sora 2 prompts 2' },
    { id: '1TRwh-b', title: 'YTPMVs: Viral Error Aesthetics and Chaos', note: 'likely best remaining audio source' },
  ],
};

/**
 * Utility: Apply Destructive Vocabulary Ban substitution to prompt text
 */
export function applyDestructiveVocabBan(prompt: string): string {
  const op = SLOP_METHODS_LIBRARY.operators.find((o) => o.id === 'destructive_vocab_ban');
  if (!op || !op.swap) return prompt;

  let result = prompt;
  for (const [bad, replacement] of Object.entries(op.swap)) {
    const regex = new RegExp(`\\b${bad}\\b`, 'gi');
    result = result.replace(regex, replacement);
  }
  return result;
}

/**
 * Utility: Find slop method operator by ID
 */
export function getSlopMethodOperator(id: string): SlopMethodOperator | undefined {
  return SLOP_METHODS_LIBRARY.operators.find((o) => o.id === id);
}

/**
 * Utility: Filter operators by target engine (video, image, audio, text)
 */
export function getOperatorsForTarget(target: 'video' | 'image' | 'audio' | 'text'): SlopMethodOperator[] {
  return SLOP_METHODS_LIBRARY.operators.filter((o) => !o.targets || o.targets.includes(target));
}

/**
 * Utility: Filter operators by Weirdness Coefficient (1-10)
 */
export function getPermittedOperatorsForWeirdness(wCoeff: number): string[] {
  const protocol = SLOP_METHODS_LIBRARY.protocols.find((p) => p.id === 'w_coeff');
  if (!protocol || !protocol.bands) return [];

  const activeBands = protocol.bands.filter((b) => wCoeff >= b.range[0]);
  const permitted = new Set<string>();
  for (const band of activeBands) {
    for (const opId of band.permits) {
      permitted.add(opId);
    }
  }
  return Array.from(permitted);
}
